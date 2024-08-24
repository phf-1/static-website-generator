# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import logging
import shutil
import tempfile
from concurrent.futures import ProcessPoolExecutor
from datetime import date, datetime, timezone
from functools import cache, reduce
from glob import glob
from itertools import groupby
from pathlib import Path
from typing import Any, Tuple

from lib.article import Article as ArticleT
from lib.message import *
from lib.page import Page as Publication
from lib.utils import error
from PIL import Image


class Actor:
    """Actor that gives behavior to a set of articles.

    Build
    -----

      root_dir = Path(…)
      execution = PARALLEL
      actor = Actor(root_dir, execution=PARALLEL)


    Use
    ---

      actor.help()
      actor.message(…)


    Implementation
    --------------

      instance = Constructor(init_data)
                   self.__init__(init_data)

      instance.message(params)

        # Calling a method is like having received a kind of message.
        msg = Message(…)

        return self.receive(msg)

                 # All received messages may be logged.
                 self._logger.info(f"{self} ← {msg}")

                 match msg:
                   case AMessage(…)
                     return …
    """

    # Class.Public
    PARALLEL = "PARALLEL"
    SEQUENTIAL = "SEQUENTIAL"
    EXECUTION_VALUES = [PARALLEL, SEQUENTIAL]

    # Class.Private
    _logger = logging.getLogger(__name__)

    @staticmethod
    def _build_li(uuid: str, desc: str) -> str:
        """Build a list item in the index."""
        return f'<li><a href="/page/{uuid}/">{desc}</a></li>'

    @staticmethod
    def _line(art: ArticleT) -> str:
        """Build a line when listing articles and descriptions."""
        return f"{art.article_html_file()} | {art.description()}"

    @staticmethod
    def _make_page(args, execution=PARALLEL) -> Publication:
        """Used to parallelize builds of pages."""
        articles, uuid, template, pages = args
        actor = Actor(articles, execution=execution)
        return actor.page(uuid, template, pages)

    # Instance.Public.API
    def help(self) -> str:
        """Return a string that tells the messages I understand to the user."""
        message = Help()
        return self.receive(message)

    def page(self, uuid: str, template: Path, pages: Path) -> Publication:
        """Return a Page.

        * UUID is used to find the matching article.
        * The article is injected in the TEMPLATE.
        * The page is built rooted at PAGES/UUID.
        """
        message = Page(uuid, template, pages)
        return self.receive(message)

    def duplicated_uuids(self) -> str:
        """Raise an error if there are duplicated uuids or return a report"""
        message = DuplicatedUUIDs()
        return self.receive(message)

    def pages(self, template: Path, pages: Path) -> str:
        """Build a page for each article and install it under PAGES using TEMPLATE."""
        message = Pages(template, pages)
        return self.receive(message)

    def sitemap(self, root: Path) -> str:
        """Return the path of the sitemap.

        * The sitemap is built and installed under ROOT.
        """
        message = Sitemap(root)
        return self.receive(message)

    def index(self, pages: Path, uuid: str):
        """Return a Publication.

        * This article has the given UUID.
        * `__INDEX__' has been replaced with and index of PAGES.
        """
        message = (Index(), pages, uuid)
        return self.receive(message)

    def clone(self, article: Path, target: Path) -> ArticleT:
        """Return an Article.

        * This article is clone of an ARTICLE rooted at TARGET directory.
        * All uuids are replaced.
        """
        message = Clone(article, target)
        return self.receive(message)

    def article_with_id(self, uuid: str):
        """Return an Article.

        * This article has contains an element associated with UUID.
        """
        message = ArticleWithId(uuid)
        return self.receive(message)

    def all(self, uuid: str, template: Path, root: Path) -> str:
        """Return a report that informs the user about how building the website went.

        * The report comes from building the website under ROOT using TEMPLATE.
        * UUID is used to identify the article that will be used as the landing page.
        """
        message = All(uuid, template, root)
        return self.receive(message)

    def list(self) -> str:
        """Return a report that lists Article × Description."""
        message = List()
        return self.receive(message)

    @cache
    def article_has_id(self, id: str) -> bool:
        """Return if there is an article identified by ID."""
        message = (Exists(), Article(), id)
        return self.receive(message)

    def argv(self, args: Tuple) -> str | None:
        """Return a reply to the message represented by ARG."""

        res: Any = None

        match args:
            case ("help",):
                res = self.help()

            case ("clone", str(article), str(target)):
                res = self.clone(Path(article), Path(target))

            case ("page", str(uuid), str(template), str(pages)):
                res = self.page(uuid, Path(template), Path(pages))

            case ("article_with_id", str(uuid)):
                res = self.article_with_id(uuid)

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
                res = f"Unexpected message. message = {args}. Try the `help' message."

        return str(res)

    # Instance.Public.Receive
    def receive(self, msg: Message | Tuple) -> Any:
        self._logger.info(f"{self} ← {msg}")

        match msg:
            case Help():
                return "TODO: help"

            case Clone(article=path, target=target):
                path.exists() or error(f"article does not exist. article = {path}")
                (not target.exists()) or error(f"target exists. target = {target}")
                shutil.copytree(path, target)
                target_article = ArticleT(target)
                target_article.replace_ids()
                return target_article

            case (Index(), Path() as pages, str(uuid)):

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
                return next(
                    (article for article in self.__articles() if article.has(uuid)),
                    None,
                )

            case List():
                lines = map(
                    self._line,
                    sorted(self.__articles(), key=lambda art: art.description()),
                )
                return "\n".join(lines)

            case Page(uuid=uuid, template=template, pages=pages):
                match self.__article_by_id(uuid):
                    case None:
                        error(f"No article with uuid has been found. uuid = {uuid}")
                    case ArticleT() as res:
                        article = res

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

            case (Exists(), Article(), str(id)):
                return next(
                    (True for article in self.__articles() if article.uuid() == id),
                    False,
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
    def __article_by_id(self, id) -> ArticleT | None:
        return next(
            (article for article in self.__articles() if article.uuid() == id), None
        )

    @cache
    def __paths(self):
        return [Path(path) for path in glob(str(self.__root / "*"))]

    @cache
    def __uuids(self):
        return [path.parts[-1] for path in self.__paths()]

    @cache
    def __articles(self):
        return [ArticleT(path) for path in self.__paths()]

    def __str__(self):
        return f"Actor articles={self.__root}"
