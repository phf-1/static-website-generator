# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

from concurrent.futures import ProcessPoolExecutor
from datetime import datetime, timezone, date
from functools import reduce
from glob import glob
from itertools import groupby
from pathlib import Path
from typing import Tuple
import logging
import shutil
from functools import cache
import tempfile

from PIL import Image

from lib.article import Article
from lib.page import Page as Publication
from lib.message import *
from lib.utils import error


class Actor:
    # Class.Public
    PARALLEL = "PARALLEL"
    SEQUENTIAL = "SEQUENTIAL"
    EXECUTION_VALUES = [PARALLEL, SEQUENTIAL]

    # Class.Private
    _logger = logging.getLogger(__name__)

    @staticmethod
    def _build_li(uuid, desc):
        """Build a list item in the index."""
        return f'<li><a href="/page/{uuid}/">{desc}</a></li>'

    @staticmethod
    def _line(art: Article) -> str:
        """Build a line when listing articles and descriptions."""
        return f"{art.article_html_file()} | {art.description()}"

    @staticmethod
    def _make_page(args, execution=PARALLEL):
        """Used to parallelize builds of pages."""
        articles, uuid, template, pages = args
        actor = Actor(articles, execution=execution)
        return actor.page(uuid, template, pages)

    # Instance.Public.Receive
    def receive(self, msg: Message | Tuple):
        self._logger.info(f"{self} ← {msg}")

        match msg:
            case Help():
                """Return a string that tells the messages I understand to the user."""
                return "TODO: help"

            case Clone(article=path, target=target):
                """Return an Article.

                  * This article is clone of an ARTICLE rooted at TARGET directory.
                  * All uuids are replaced.
                """
                path.exists() or error(f"article does not exist. article = {path}")
                (not target.exists()) or error(f"target exists. target = {target}")
                shutil.copytree(path, target)
                target_article = Article(target)
                target_article.replace_ids()
                return target_article

            case (Index(), Path() as pages, str(uuid)):
                """Return a Publication.

                  * This article has the given UUID.
                  * `__INDEX__' has been replaced with and index of PAGES.
                """

                def key(article):
                    timestamp = article.mtime()
                    a_datetime = datetime.fromtimestamp(timestamp, tz=timezone.utc)
                    return date(a_datetime.year, a_datetime.month, 1)

                articles = sorted(self.__articles(), key=key, reverse=True)
                groups = groupby(articles, key)
                sections = ""
                for a_date, g in groups:
                    date_str = a_date.strftime("%Y-%m")
                    sections += f'<x-h2 name="{date_str}" id="{date_str}">'
                    sections += "<ul>"
                    uuid_desc = [(art.uuid(), art.description()) for art in g]
                    uuid_desc.sort(key=lambda pair: pair[1])
                    sections += "\n".join(
                        [self._build_li(uuid, desc) for (uuid, desc) in uuid_desc]
                    )
                    sections += "</ul>"
                    sections += "</x-h2>"

                index_page = Publication(pages / uuid)
                index_page.replace_target("__INDEX__", sections)

                return index_page

            case ArticleWithId(id=uuid):
                """Return an Article.

                  * This article has contains an element associated with UUID.
                """
                return next(
                    (article for article in self.__articles() if article.has(uuid)),
                    None,
                )

            case List():
                """Return a String.

                  * This string represents pairs: Article × Description
                """
                lines = map(
                    self._line,
                    sorted(self.__articles(), key=lambda art: art.description()),
                )
                return "\n".join(lines)

            case Page(uuid=uuid, template=template, pages=pages):
                """Return a Page.

                  * UUID is used to find the matching article.
                  * The article is injected in the TEMPLATE.
                  * The page is built rooted at PAGES/UUID.
                """
                article = self.__article_by_id(uuid)
                page_root = pages / uuid
                page = Publication(page_root)

                # Return immediately if the page already represents the article.
                if (page.exists() and page.mtime()) > article.mtime():
                    return page

                page.reset()
                page.copy(article.data_dir(), Data())
                page.make()

                # page_root/bg.webp = resize(article_dir/bg.*)
                bg_img_path = article.background_img_file()
                with Image.open(bg_img_path) as img:
                    width, height = img.size
                    new_width = 1500
                    new_height = int((new_width / width) * height)
                    resized_img = img.resize(
                        (new_width, new_height), Image.Resampling.LANCZOS
                    )
                    temp_webp = tempfile.NamedTemporaryFile(suffix=".webp").name
                    resized_img.save(temp_webp)

                    temp_jpg = tempfile.NamedTemporaryFile(suffix=".jpg").name
                    resized_img.save(temp_jpg)

                page.copy(Path(temp_webp), BG())
                page.copy(Path(temp_jpg), BG())

                article_html = article.article_html(self)

                # template_html = template_value
                with open(template) as f:
                    template_html = f.read()
                    template_html = template_html.replace("__LANG__", article.lang())
                    template_html = template_html.replace(
                        "__DESCRIPTION__", article.description()
                    )
                    template_html = template_html.replace(
                        "__CSS__", article.article_css()
                    )
                    template_html = template_html.replace("__ARTICLE__", article_html)

                page.copy(template_html, Index())
                return page

            case Pages(template=template, pages=pages):
                args = ((self.__root, uuid, template, pages) for uuid in self.__uuids())

                if self.__execution == self.PARALLEL:
                    with ProcessPoolExecutor() as executor:
                        results = list(executor.map(self._make_page, args))

                elif self.__execution == self.SEQUENTIAL:
                    results = [
                        self._make_page(arg, execution=self.__execution) for arg in args
                    ]

                return "\n".join([str(res) for res in results])

            case All(uuid=uuid, template=template, root=root):
                report = self.duplicated_uuids()
                pages = root / "page"
                report += "\n".join(
                    [f"page = {page}" for page in self.pages(template, pages).split()]
                )
                report += f"\nindex = {self.index(pages, uuid)}"
                report += f"\nsitemap = {self.sitemap(root)}"
                return report

            case Sitemap(root=root):

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

            case DuplicatedUUIDs():
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

    # Instance.Public.API
    def help(
        self,
    ):
        message = Help()
        return self.receive(message)

    def page(self, uuid: str, template: Path, pages: Path):
        message = Page(uuid, template, pages)
        return self.receive(message)

    def links(self, path: Path):
        message = Links(path)
        return self.receive(message)

    def duplicated_uuids(self):
        message = DuplicatedUUIDs()
        return self.receive(message)

    def resolve_ids(self):
        message = ResolveIds()
        return self.receive(message)

    def pages(self, template: Path, pages: Path):
        message = Pages(template, pages)
        return self.receive(message)

    def sitemap(self, root: Path):
        message = Sitemap(root)
        return self.receive(message)

    def index(self, pages: Path, uuid: str):
        message = (Index(), pages, uuid)
        return self.receive(message)

    def clone(self, article: Path, target: Path):
        message = Clone(article, target)
        return self.receive(message)

    def article_with_id(self, uuid: str):
        message = ArticleWithId(uuid)
        return self.receive(message)

    def all(self, uuid: str, template: Path, root: Path):
        message = All(uuid, template, root)
        return self.receive(message)

    def list(self):
        message = List()
        return self.receive(message)

    def argv(self, args: Tuple) -> str | None:
        res = str

        match args:
            case ("help",):
                res = self.help()

            case ("clone", str(article), str(target)):
                res = self.clone(Path(article), Path(target))

            case ("page", str(uuid), str(template), str(pages)):
                res = self.page(uuid, Path(template), Path(pages))

            case ("article_with_id", str(uuid)):
                res = self.article_with_id(uuid)

            case ("links", str(path)):
                res = self.links(Path(path))

            case ("index", str(path), str(uuid)):
                res = self.index(Path(path), uuid)

            case ("duplicated-uuids",):
                res = self.duplicated_uuids()

            case ("pages", str(template), str(pages)):
                res = self.pages(Path(template), Path(pages))

            case ("sitemap", str(root)):
                res = self.sitemap(Path(root))

            case ("all", str(uuid), str(template), str(root)):
                res = self.all(uuid, Path(template), Path(root))

            case ("list",):
                res = self.list()

            case _:
                error(f"Unexpected args. {args}")

        return str(res)

    @cache
    def page_has_id(self, id):
        return next(
            (True for article in self.__articles() if article.uuid() == id), False
        )

    @cache
    def __article_by_id(self, id):
        return next(
            (article for article in self.__articles() if article.uuid() == id), None
        )

    # Instance.Private
    def __init__(self, root: Path, execution: str = PARALLEL) -> None:
        if not root.is_dir():
            error(f"root is not a directory. root = {root}")
        self.__root = root

        if execution not in self.EXECUTION_VALUES:
            error(
                f"execution is unexpected. execution = {execution}. valid values: {self.EXECUTION_VALUES}"
            )
        self.__execution = execution
        self.__resolved_ids = None
        self._logger.info(f"{self}")

    @cache
    def __paths(self):
        return [Path(path) for path in glob(str(self.__root / "*"))]

    @cache
    def __uuids(self):
        return [path.parts[-1] for path in self.__paths()]

    @cache
    def __articles(self):
        return [Article(path) for path in self.__paths()]

    def __str__(self):
        return f"Actor articles={self.__root}"
