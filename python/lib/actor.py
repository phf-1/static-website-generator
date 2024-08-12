from concurrent.futures import ProcessPoolExecutor
from glob import glob
from pathlib import Path
from functools import reduce
from itertools import groupby
from datetime import datetime, timezone, date
import shutil
import uuid
import logging


from PIL import Image

from lib.article import Article
from lib.page import Page
from lib.message import Message
from lib.message.all import All
from lib.message.index import Index
from lib.message.clone import Clone
from lib.message.list import List
from lib.message.page import Page as PageMessage
from lib.message.pages import Pages
from lib.message.sitemap import Sitemap
from lib.message.duplicated_uuids import DuplicatedUUIDs

logger = logging.getLogger(__name__)

PARALLEL  = "PARALLEL"
SEQUENTIAL = "SEQUENTIAL"

def error(msg):
    raise AssertionError(msg)

# Used to parallelize pages creations.
def make_page(args, execution=PARALLEL):
    articles, uuid, template, pages = args
    actor = Actor(articles, execution=execution)
    return actor.page(uuid, template, pages)

class Actor:
    def __init__(self, articles:Path, execution=PARALLEL) -> None:
        self._articles = articles
        self._execution = execution
        logger.info(f'{self}')

    def argv(self, args):
        match(args):
            case ["clone", str(article), str(target)]:
                message = Clone(self, Path(article), Path(target))

            case ["page", str(uuid), str(template), str(pages)]:
                message = PageMessage(self, uuid, Path(template), Path(pages))

            case ["duplicated_uuids"]:
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

    def page(self, uuid:str, template:Path, pages:Path):
        message = PageMessage(self, uuid, template, pages)
        return self.receive(message)

    def duplicated_uuids(self):
        message = DuplicatedUUIDs(self)
        return self.receive(message)

    def pages(self, template:Path, pages:Path):
        message = Pages(self, template, pages)
        return self.receive(message)

    def sitemap(self, root:Path):
        message = Sitemap(self, root)
        return self.receive(message)

    def index(self, pages:Path, uuid:str):
        message = Index(self, pages, uuid)
        return self.receive(message)

    def receive(self, msg:Message):
        logger.info(f'{self} ← {msg}')

        match msg:
            case Clone(address=self, article=article, target=target):
                article.exists() or error(f"article does not exist. article = {article}")
                not(target.exists()) or error(f"target does not exist. target = {target}")
                shutil.copytree(article, target)
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
                for k,g in groups:
                    date_str = k.strftime("%Y-%m")
                    sections += f'<x-h2 name="{date_str}" id="{date_str}">'
                    sections += '<ul>'
                    uuid_desc = [(art.uuid(), art.description()) for art in g]
                    uuid_desc.sort(key=lambda pair: pair[1])
                    sections += "\n".join([build_li(uuid,desc) for (uuid,desc) in uuid_desc])
                    sections += '</ul>'
                    sections += '</x-h2>'

                index_page = pages / uuid / "index.html"
                with open(index_page, "r+") as index_article:
                    index_str = index_article.read()
                    index_article.seek(0)
                    index_str = index_str.replace("__INDEX__",sections)
                    index_article.write(index_str)

                return index_page

            case List(address=self):
                articles = [Article(Path(path)) for path in glob(str(self._articles / '*'))]
                line = lambda art: f"{art.article_html_file()} | {art.description()}"
                lines = map(line, sorted(articles, key=lambda x: x.description()))
                return "\n".join(lines)

            case PageMessage(address=self, uuid=uuid, template=template, pages=pages):
                article = Article(self._articles / uuid)
                page_dir = pages / uuid
                page = Page(page_dir)
                if (page.exists() and page.mtime()) > article.mtime():
                    return page_dir

                # page_dir points to an empty directory.
                page_dir.exists() and shutil.rmtree(page_dir)
                page_dir.mkdir(parents=True)

                # page_dir/data = article_dir/data
                shutil.copytree(article.data_dir(), page_dir / "data")

                # page_dir/bg.webp = resize(article_dir/bg.*)
                bg_img_path = article.background_img_file()
                with Image.open(bg_img_path) as img:
                    width, height = img.size
                    new_width = 1500
                    new_height = int((new_width / width) * height)
                    resized_img = img.resize((new_width, new_height), Image.LANCZOS)
                    resized_img.save(str(page_dir / 'bg.webp'))
                    resized_img.save(str(page_dir / 'bg.jpg'))

                # index_value = template_value
                with open(template) as f:
                    index_value = f.read()

                # index_value/__LANG__ = article_dir/lang
                index_value = index_value.replace("__LANG__", article.lang())

                # index_value/__DESCRIPTION__ = article_dir/description
                index_value = index_value.replace("__DESCRIPTION__", article.description())

                # index_value/__CSS__ = article_dir/article.css
                index_value = index_value.replace("__CSS__", article.article_css())

                # index_value/__ARTICLE__ = article_dir/article.html
                index_value = index_value.replace("__ARTICLE__", article.article_html())

                # page_dir/index.html = index_value
                with open(page_dir / "index.html", "w") as index:
                    index.write(index_value)

                return page_dir

            case Pages(address=self, template=template, pages=pages):
                args = ((self._articles, uuid, template, pages) for uuid in self.__uuids())

                if self._execution == PARALLEL:
                    with ProcessPoolExecutor() as executor:
                        results = list(executor.map(make_page, args))

                elif self._execution == SEQUENTIAL:
                    results = [make_page(arg, execution=self._execution) for arg in args]

                return "\n".join([str(res) for res in results])

            case All(address=self, uuid=uuid, template=template, root=root):
                report = self.duplicated_uuids()
                pages = root / "page"
                report += "\n".join([f"page = {page}" for page in self.pages(template, pages).split()])
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
                    return f'<url>\n{props_str}\n</url>'

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
                uuids = reduce(lambda acc, article: acc + article.uuids(), self.__articles(), [])
                seen = set()
                duplicates = [id for id in uuids if id in seen or seen.add(id)]
                msg = "No duplicated uuids found in articles." if len(duplicates) == 0 else "Duplicated uuids found in articles:" + "  \n".join(set(duplicates))
                return msg + "\n"

    def __paths(self):
        return [Path(path) for path in glob(str(self._articles / '*'))]

    def __uuids(self):
        return [path.parts[-1] for path in self.__paths()]

    def __articles(self):
        return [Article(path) for path in self.__paths()]

    def __str__(self):
        return f"Actor articles={self._articles}"

