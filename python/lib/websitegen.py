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

from lib.article import Article
from lib.page import Page
from lib.task import Task
from lib.utils import error
from PIL import Image


class WebsiteGen:
    """a:WebsiteGen represents a website generator. Send it messages to do things."""

    # Class.Public
    PARALLEL = "PARALLEL"
    SEQUENTIAL = "SEQUENTIAL"
    EXECUTION_VALUES = [PARALLEL, SEQUENTIAL]

    # Class.Private
    _logger = logging.getLogger(__name__)

    @staticmethod
    def _make_page(args, execution=PARALLEL) -> Page:
        """Used to parallelize builds of pages."""
        articles, uuid, template, pages = args
        actor = WebsiteGen(articles, execution=execution)
        return actor.page(uuid, template, pages)

    # Instance.Public.API
    def help(self) -> str:
        """Help message to the user."""
        return self.receive(Task(c="help", o="String"))

    def clone(self, article: Path, target: Path) -> Article:
        """Return an Article such that:

        * its content is a copy of ARTICLE except that all uuids have been replaced ;
        * it has been installed under TARGET.
        """
        return self.receive(Task(c=(article, target), o="Clone(article, target)"))

    def page(self, uuid: str, template: Path, pages: Path) -> Page:
        """Return a Page such that:

        * it has been built from an article with id UUID ;
        * it has been built from the template TEMPLATE ;
        * it has been installed under PAGES.
        """
        return self.receive(Task(c=(uuid, template, pages), o="Page"))

    def duplicated_uuids(self) -> str:
        """Raises an error is duplicated uuids are found or return a report."""
        return self.receive(Task(o="Report(duplicated_uuids)"))

    def pages(self, template: Path, pages: Path) -> str:
        """Return a report giving the status of pages built under PAGES using TEMPLATE."""
        return self.receive(Task(c=(template, pages), o="Report(pages)"))

    def sitemap(self, root: Path) -> Path:
        """Return a path such that:

        * it represents the sitemap of the website ;
        * it has been installed under ROOT.
        """
        return self.receive(Task(c=("sitemap", root), o="Path"))

    def index(self, pages: Path, uuid: str) -> Page:
        """Return a Page such that:

        * it represents the index of the website ;
        * it has been built from a page with id UUID ;
        * `__INDEX__' has been replaced with and index of PAGES.
        * it is installed under PAGES.
        """
        return self.receive(Task(c=(pages, uuid), o="Page(index)"))

    def article_with_id(self, id: str) -> Article:
        """Return an Article such that:

        * its content has an element with id UUID.
        """
        return self.receive(Task(c=id, o="ArticleWith(id)"))

    def all(self, uuid: str, template: Path, root: Path) -> str:
        """Return a report such that:

        * it informs the user of how went the website construction ;
        * the website has been installed under ROOT using TEMPLATE ;
        * the article with id UUID has been used to build the landing page.
        """
        return self.receive(Task(c=(uuid, template, root), o="Report(website)"))

    def list(self) -> str:
        """Return a report such that:

        * each line has the following format : Path | Description where:
        * Path is the root path a page ;
        * Description is its oneline description ;
        * lines are alphabetically sorted.
        """
        return self.receive(Task(o="Report(list)"))

    @cache
    def article_has_id(self, id: str) -> bool:
        """True means that an article identified by ID exists."""
        return self.receive(Task(c=id, o="ArticleHas(id)"))

    def argv(self, msg: Tuple) -> str:
        """Return a report such that:

        * it represents the log of execution of the message MSG.
        """

        res: Any = None

        match msg:
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
                res = f"Unexpected message. message = {msg}. Try the `help' message."

        return str(res)

    # Instance.Public.Receive
    def receive(self, task: Task) -> Any:
        """Return a result such that:

        * it is built from executing the task TASK ;
        * TASK is logged, depending on the logger configuration.
        """

        self._logger.info(f"{self} ← {task}")

        match task:
            case Task(c="help", o="String"):
                return "TODO: help"

            case Task(c=(article, target), o="Clone(article, target)"):
                if article.exists():
                    error(f"article does not exist. article = {article}")

                if not target.exists():
                    error(f"target exists. target = {target}")

                shutil.copytree(article, target)
                target_article = Article(target)
                target_article.replace_ids()
                return target_article

            case Task(c=(uuid, template, pages), o="Page"):
                match self.__article_by_id(uuid):
                    case None:
                        error(f"No article with uuid has been found. uuid = {uuid}")
                    case Article() as res:
                        article = res

                page_root = pages / uuid
                page = Page(page_root)

                # Return immediately if the page already represents the article.
                if (page.exists() and page.mtime()) > article.mtime():
                    return page

                page = page.reset().copy_to_data(article.data_dir()).make()

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

                page = page.copy_to_bg(Path(temp_webp)).copy_to_bg(Path(temp_jpg))

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

                page.copy_to_index(template_html)

                return page

            case Task(c=(pages, uuid), o="Page(index)"):

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

                index_page = Page(pages / uuid)
                index_page.replace_target("__INDEX__", sections)

                return index_page

            case Task(c=id, o="ArticleWith(id)"):
                return next(
                    (article for article in self.__articles() if article.has(id)),
                    None,
                )

            case Task(o="Report(list)"):
                lines = map(
                    self._line,
                    sorted(self.__articles(), key=lambda art: art.description()),
                )
                return "\n".join(lines)

            case Task(c=(template, pages), o="Report(pages)"):
                args = ((self.__root, uuid, template, pages) for uuid in self.__uuids())

                if self.__execution == self.PARALLEL:
                    with ProcessPoolExecutor() as executor:
                        results = list(executor.map(self._make_page, args))

                elif self.__execution == self.SEQUENTIAL:
                    results = [
                        self._make_page(arg, execution=self.__execution) for arg in args
                    ]

                return "\n".join([str(res) for res in results])

            case Task(c=(uuid, template, root), o="Report(website)"):
                report = self.duplicated_uuids()
                pages = root / "page"
                report += "\n".join(
                    [f"page = {page}" for page in self.pages(template, pages).split()]
                )
                report += f"\nindex = {self.index(pages, uuid)}"
                report += f"\nsitemap = {self.sitemap(root)}"
                return report

            case Task(c=("sitemap", root), o="Path"):

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
                return Path(sitemap_path)

            case Task(o="Report(duplicated_uuids)"):
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

            case Task(c=id, o="ArticleHas(id)"):
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

    def _line(self, art: Article) -> str:
        """Build a line when listing articles and descriptions."""
        return f"{art.article_html_file()} | {art.description()}"

    def _build_li(self, uuid: str, desc: str) -> str:
        """Build a list item in the index."""
        return f'<li><a href="/page/{uuid}/">{desc}</a></li>'

    @cache
    def __article_by_id(self, id) -> Article | None:
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
        return [Article(path) for path in self.__paths()]

    def __str__(self):
        return f"WebsiteGen articles={self.__root}"
