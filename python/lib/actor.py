from bs4 import BeautifulSoup
from concurrent.futures import ProcessPoolExecutor
from datetime import datetime, timezone, date
from functools import reduce
from glob import glob
from itertools import groupby
import subprocess  # nosec B404
from pathlib import Path
import logging
import shutil

from PIL import Image

from lib.article import Article
from lib.message import Message
from lib.message.resolve_ids import ResolveIds
from lib.message.all import All
from lib.message.clone import Clone
from lib.message.duplicated_uuids import DuplicatedUUIDs
from lib.message.index import Index
from lib.message.links import Links
from lib.message.list import List
from lib.message.page import Page as PageMessage
from lib.message.page_with_id import PageWithId
from lib.message.pages import Pages
from lib.message.sitemap import Sitemap
from lib.page import Page

logger = logging.getLogger(__name__)

PARALLEL = "PARALLEL"
SEQUENTIAL = "SEQUENTIAL"


def error(msg):
    raise AssertionError(msg)


# Used to parallelize builds of pages.
def make_page(args, execution=PARALLEL):
    articles, uuid, template, pages = args
    actor = Actor(articles, execution=execution)
    return actor.page(uuid, template, pages)


class Actor:
    def __init__(self, articles: Path, execution=PARALLEL) -> None:
        self._articles = articles
        self.__articles_cache = None
        self._execution = execution
        self._resolved_ids = None
        logger.info(f"{self}")

    def argv(self, args):
        logger.info(f"{self} ← argv({args})")
        match args:
            case ["clone", str(article), str(target)]:
                message = Clone(self, Path(article), Path(target))

            case ["page", str(uuid), str(template), str(pages)]:
                message = PageMessage(self, uuid, Path(template), Path(pages))

            case ["page_with_id", str(uuid)]:
                message = PageWithId(self, uuid)

            case ["links", str(path)]:
                message = Links(self, Path(path))

            case ["index", str(path), str(uuid)]:
                message = Index(self, Path(path), uuid)

            case ["duplicated-uuids"]:
                message = DuplicatedUUIDs(self)

            case ["pages", str(template), str(pages)]:
                message = Pages(self, Path(template), Path(pages))

            case ["sitemap", str(root)]:
                message = Sitemap(self, Path(root))

            case ["all", str(uuid), str(template), str(root)]:
                message = All(self, uuid, Path(template), Path(root))

            case ["list"]:
                message = List(self)

            case _:
                raise AssertionError(f"Unexpected args. {args}")

        return self.receive(message)

    def page(self, uuid: str, template: Path, pages: Path):
        message = PageMessage(self, uuid, template, pages)
        return self.receive(message)

    def links(self, path: Path):
        message = Links(self, path)
        return self.receive(message)

    def duplicated_uuids(self):
        message = DuplicatedUUIDs(self)
        return self.receive(message)

    def resolve_ids(self):
        message = ResolveIds(self)
        return self.receive(message)

    def pages(self, template: Path, pages: Path):
        message = Pages(self, template, pages)
        return self.receive(message)

    def sitemap(self, root: Path):
        message = Sitemap(self, root)
        return self.receive(message)

    def index(self, pages: Path, uuid: str):
        message = Index(self, pages, uuid)
        return self.receive(message)

    def receive(self, msg: Message):
        logger.info(f"{self} ← {msg}")

        match msg:
            case Clone(address=self, article=path, target=target):
                path.exists() or error(f"article does not exist. article = {path}")
                not (target.exists()) or error(
                    f"target does not exist. target = {target}"
                )
                shutil.copytree(path, target)
                target_article = Article(target)
                target_article.replace_ids()
                return target_article.root_dir()

            case Index(address=self, pages=pages, uuid=uuid):

                def build_li(uuid, desc):
                    return f'<li><a href="/page/{uuid}/">{desc}</a></li>'

                articles = self.__articles()

                def key(article):
                    timestamp = article.mtime()
                    a_datetime = datetime.fromtimestamp(timestamp, tz=timezone.utc)
                    return date(a_datetime.year, a_datetime.month, 1)

                articles = sorted(articles, key=key, reverse=True)
                groups = groupby(articles, key)
                sections = ""
                for k, g in groups:
                    date_str = k.strftime("%Y-%m")
                    sections += f'<x-h2 name="{date_str}" id="{date_str}">'
                    sections += "<ul>"
                    uuid_desc = [(art.uuid(), art.description()) for art in g]
                    uuid_desc.sort(key=lambda pair: pair[1])
                    sections += "\n".join(
                        [build_li(uuid, desc) for (uuid, desc) in uuid_desc]
                    )
                    sections += "</ul>"
                    sections += "</x-h2>"

                index_page = pages / uuid / "index.html"
                with open(index_page, "r+") as index_article:
                    index_str = index_article.read()
                    index_article.seek(0)
                    index_str = index_str.replace("__INDEX__", sections)
                    index_article.write(index_str)

                return index_page

            case Links(address=self, path=path):
                path.exists() or error(f"path does not exist. path={path}")
                with open(path) as f:
                    html_content = f.read()
                return f"{self.__links(html_content)}"

            case PageWithId(address=self, id=uuid):
                return self.page_with_id(uuid)

            case List(address=self):
                articles = [
                    Article(Path(path)) for path in glob(str(self._articles / "*"))
                ]

                def line(art: Article) -> str:
                    return f"{art.article_html_file()} | {art.description()}"

                lines = map(line, sorted(articles, key=lambda x: x.description()))
                return "\n".join(lines)

            case PageMessage(address=self, uuid=uuid, template=template, pages=pages):
                article = Article(self._articles / uuid)
                page_dir = pages / uuid
                page = Page(page_dir)
                if (page.exists() and page.mtime()) > article.mtime():
                    return page_dir

                # page_dir points to an empty directory.
                if page_dir.exists():
                    shutil.rmtree(page_dir)
                page_dir.mkdir(parents=True)

                # page_dir/data = article_dir/data
                page_data = page_dir / "data"
                shutil.copytree(article.data_dir(), page_data)

                # page_dir/bg.webp = resize(article_dir/bg.*)
                bg_img_path = article.background_img_file()
                with Image.open(bg_img_path) as img:
                    width, height = img.size
                    new_width = 1500
                    new_height = int((new_width / width) * height)
                    resized_img = img.resize(
                        (new_width, new_height), Image.Resampling.LANCZOS
                    )
                    resized_img.save(str(page_dir / "bg.webp"))
                    resized_img.save(str(page_dir / "bg.jpg"))

                # Make files, if any to make.
                page_data_makefile = page_data / "Makefile"
                if page_data_makefile.exists():
                    subprocess.run(["/bin/make"], cwd=page_data)  # nosec B603

                # index_value = template_value
                with open(template) as f:
                    index_value = f.read()

                # index_value/__LANG__ = article_dir/lang
                index_value = index_value.replace("__LANG__", article.lang())

                # index_value/__DESCRIPTION__ = article_dir/description
                index_value = index_value.replace(
                    "__DESCRIPTION__", article.description()
                )

                # index_value/__CSS__ = article_dir/article.css
                index_value = index_value.replace("__CSS__", article.article_css())

                # Add references in the article if any.
                article_html = article.article_html(self)
                REFERENCE = "__REFERENCE__"
                if REFERENCE in article_html:
                    article_html = article_html.replace(
                        REFERENCE, self.__links(article_html)
                    )

                # index_value/__ARTICLE__ = article_dir/article.html
                index_value = index_value.replace("__ARTICLE__", article_html)

                # page_dir/index.html = index_value
                with open(page_dir / "index.html", "w") as index:
                    index.write(index_value)

                return page_dir

            case Pages(address=self, template=template, pages=pages):
                args = (
                    (self._articles, uuid, template, pages) for uuid in self.__uuids()
                )

                if self._execution == PARALLEL:
                    with ProcessPoolExecutor() as executor:
                        results = list(executor.map(make_page, args))

                elif self._execution == SEQUENTIAL:
                    results = [
                        make_page(arg, execution=self._execution) for arg in args
                    ]

                return "\n".join([str(res) for res in results])

            case All(address=self, uuid=uuid, template=template, root=root):
                report = self.duplicated_uuids()
                pages = root / "page"
                report += "\n".join(
                    [f"page = {page}" for page in self.pages(template, pages).split()]
                )
                report += f"\nindex = {self.index(pages, uuid)}"
                report += f"\nsitemap = {self.sitemap(root)}"
                return report

            case Sitemap(address=self, root=root):

                def loc(uuid):
                    return f"<loc>https://phfrohring.com/page/{uuid}/</loc>"

                def uuid_props(uuid):
                    return [loc(uuid)]

                def url(props):
                    props_str = "\n".join(props)
                    return f"<url>\n{props_str}\n</url>"

                def urlset(urls):
                    urls_str = "\n".join(urls)
                    return f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls_str}\n</urlset>'

                def sitemap(urlset):
                    return f'<?xml version="1.0" encoding="UTF-8"?>\n{urlset}'

                props_list = [uuid_props(uuid) for uuid in self.__uuids()]
                urls = [url(props) for props in props_list]
                urlset_ = urlset(urls)
                sitemap_ = sitemap(urlset_)
                sitemap_path = root / "sitemap.xml"
                with open(sitemap_path, "w") as f:
                    f.write(sitemap_)
                return sitemap_path

            case DuplicatedUUIDs(address=self):
                uuids: list[str] = reduce(
                    lambda acc, article: acc + article.uuids(), self.__articles(), []
                )
                seen = set()
                duplicates = []
                for id in uuids:
                    if id in seen:
                        duplicates.append(id)
                    else:
                        seen.add(id)
                if len(duplicates) == 0:
                    return "No duplicated uuids found in articles."
                else:
                    error(
                        "Duplicated uuids found in articles:"
                        + "  \n".join(set(duplicates))
                    )

    def page_with_id(self, id):
        return next((article.uuid() for article in self.__articles() if article.has(id)), None)

    def page_has_id(self, id):
        return next((True for article in self.__articles() if article.uuid() == id), False)

    def __paths(self):
        return [Path(path) for path in glob(str(self._articles / "*"))]

    def __uuids(self):
        return [path.parts[-1] for path in self.__paths()]

    def __articles(self):
        if self.__articles_cache == None:
            self.__articles_cache = [Article(path) for path in self.__paths()]
        return self.__articles_cache

    def __links(self, html_string):
        parsed = BeautifulSoup(html_string, "html.parser")
        pairs = {}
        for link in parsed.find_all("a"):
            href = link.get("href")
            if href not in pairs:
                if href and (href.startswith("https://") or href.startswith("/page/")):
                    name = "".join(str(content) for content in link.contents)
                    pairs[href] = name
        for link in parsed.find_all("x-blockquote"):
            href = link.get("url")
            if href not in pairs:
                if href and href.startswith("https://"):
                    name = link.get("source")
                    pairs[href] = name
        pairs = sorted(pairs.items(), key=lambda p: p[1])

        def to_reference(pair: list) -> str:
            return f"<li><a href={pair[0]}>{pair[1]}</a></li>"

        return "\n".join(map(to_reference, pairs))

    def __str__(self):
        return f"Actor articles={self._articles}"
