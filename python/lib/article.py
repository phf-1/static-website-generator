# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import logging
import re
import uuid
from functools import cache
from glob import glob
from pathlib import Path
from typing import Any, Tuple

from bs4 import BeautifulSoup
from lib.task import Task


class Article:
    # Class.Public
    alphanum_restr = "[0-9a-f]"
    uuid_restr = f"{alphanum_restr}{{8}}-{alphanum_restr}{{4}}-4{alphanum_restr}{{3}}-{alphanum_restr}{{4}}-{alphanum_restr}{{12}}"
    href_restr = f'href="({uuid_restr})"'
    href_re = re.compile(href_restr, re.I)
    id_restr = f'id="({uuid_restr})"'
    id_re = re.compile(id_restr, re.I)

    # Class.Private
    _logger = logging.getLogger(__name__)

    # Instance.Public.API
    @cache
    def read(self, path: Path) -> str:
        """Return a string read from PATH."""
        return self.receive(Task(c=path, o="String"))

    @cache
    def description_file(self) -> Path:
        """Return the file that contains the description of the article."""
        return self.receive(Task(c="description", o="Path"))

    @cache
    def description(self) -> str:
        """Return the description of the article."""
        return self.receive(Task(c="description", o="String"))

    @cache
    def root(self) -> Path:
        """Return the root path of the article."""
        return self.receive(Task(c="root", o="Path"))

    @cache
    def article_html_file(self):
        """Return the path of the html content of the article."""
        return self.receive(Task(c="html", o="Path"))

    @cache
    def article_html(self, ctx):
        """Return the html content of the article.

        * href references have been replaced.
          * if `href="$UUID"', then:
            case $UUID is found in the article → `href="#$UUID"'
            case $UUID identifies an article → `href="/page/$UUID"'
            case $UUID identifies an element in an article identified by $ID → `href="/page/$ID#$UUID"'

        * __REFERENCE__ is replaced by self.__links()
        """
        return self.receive(Task(c=(ctx, "html"), o="String"))

    @cache
    def data_dir(self) -> Path:
        """Return the data path of the article."""
        return self.receive(Task(c="data", o="Path"))

    @cache
    def article_css_file(self):
        """Return the path of the css file of the article."""
        return self.receive(Task(c="css", o="Path"))

    @cache
    def article_css(self):
        """Return the path of the css content of the article."""
        return self.receive(Task(c="css", o="String"))

    @cache
    def background_img_file(self) -> Path:
        """Return the path of the background image file of the article."""
        return self.receive(Task(c="bg", o="Path"))

    @cache
    def lang_file(self) -> Path:
        """Return the file that contains the language of the article."""
        return self.receive(Task(c="lang", o="Path"))

    @cache
    def lang(self) -> str:
        """Return the language of the article."""
        return self.receive(Task(c="lang", o="String"))

    @cache
    def uuid(self) -> str:
        """Return the id of the article."""
        return self.receive(Task(c="id", o="String"))

    def replace_ids(self) -> "Article":
        return self.receive(Task(c="replaced_ids", o="Article"))

    @cache
    def uuids(self) -> list[str]:
        return self.receive(Task(c="ids", o="List[String]"))

    @cache
    def has(self, id) -> bool:
        return self.receive(Task(c=id, o="Has"))

    @cache
    def files(self) -> list[Path]:
        return self.receive(Task(c="files", o="List[Path]"))

    def exists(self) -> bool:
        return self.receive(Task(c=self, o="Exists"))

    def mtime(self) -> float:
        return self.receive(Task(c=None, o="MTime"))

    # Instance.Public.Receive
    def receive(self, task: Task) -> Any:
        self._logger.info(f"{self} ← {task}")

        match task:
            case Task(c="description", o="Path"):
                return self._description

            case Task(c="id", o="String"):
                return self._uuid

            case Task(c="root", o="Path"):
                return self._root

            case Task(c="css", o="Path"):
                return self._article_css

            case Task(c="lang", o="Path"):
                return self._lang

            case Task(c="html", o="Path"):
                return self._article_html

            case Task(c="bg", o="Path"):
                return self._bg_img_file

            case Task(c="data", o="Path"):
                return self._data_dir

            case Task(c=p, o="String") if isinstance(p, Path):
                with open(p, "r") as f:
                    return f.read()

            case Task(c="description", o="String"):
                return self.read(self.description_file())

            case Task(c="lang", o="String"):
                return self.read(self.lang_file())

            case Task(c="css", o="String"):
                path = self.article_css_file()
                if path.exists():
                    return self.read(path)
                else:
                    return ""

            case Task(c=(ctx, "html"), o="String"):
                html = self.read(self.article_html_file())

                def in_page(id):
                    if self.has(id):
                        return lambda html: html.replace(
                            f'href="{id}"', f'href="#{id}"'
                        )

                def article_has_id(id):
                    if ctx.article_has_id(id):
                        return lambda html: html.replace(
                            f'href="{id}"', f'href="/page/{id}"'
                        )

                def article_with_id(id):
                    match ctx.article_with_id(id):
                        case article if isinstance(article, Article):
                            return lambda html: html.replace(
                                f'href="{id}"', f'href="/page/{article.uuid()}#{id}"'
                            )

                finders = [in_page, article_has_id, article_with_id]
                for ref_uuid in re.findall(self.href_re, html):
                    renderer = None

                    for find in finders:
                        renderer = find(ref_uuid)
                        if renderer is not None:
                            html = renderer(html)
                            break

                    if renderer is None:
                        raise AssertionError(
                            f"No element has been found with uuid {ref_uuid}"
                        )

                return html.replace("__REFERENCE__", self.__links())

            case Task(c=id, o="Has"):
                return id in self.uuids()

            case Task(c=self, o="Exists"):
                return all([p.exists() for p in self.files()])

            case Task(c=None, o="MTime"):
                if self.exists():
                    return max([p.stat().st_mtime for p in self.files()])
                else:
                    raise AssertionError("Not in the file system.")

            case Task(c="files", o="List[Path]"):
                return self._files

            case Task(c="ids", o="List[String]"):
                content = self.read(self.article_html_file())
                return re.findall(self.id_re, content)

            case Task(c="replaced_ids", o="Article"):
                html_file = self.article_html_file()

                def replace_with_uuid(match):
                    return f'id="{uuid.uuid4()}"'

                with open(html_file, "r+") as file:
                    content = file.read()
                    file.seek(0)
                    updated_content = re.sub(r'id="[^"]*"', replace_with_uuid, content)
                    file.write(updated_content)
                return self

            case _:
                raise AssertionError(f"Unexpected task. task = {task}")

    # Instance.Private
    def __init__(self, root: Path):
        self._root = root
        self._article_html = root / "article.html"
        self._article_css = root / "article.css"
        match glob(str(root / "bg.*")):
            case images if len(images) == 0:
                raise AssertionError(
                    f"No background image has been found (bg.*) under root. root = {root}"
                )
            case images:
                imgs = images
        self._bg_img_file = Path(imgs[0])
        self._data_dir = root / "data"
        self._description = root / "description"
        self._lang = root / "lang"
        self._uuid = root.parts[-1]
        self._files = [
            self._root,
            self._article_html,
            self._bg_img_file,
            self._data_dir,
            self._description,
            self._lang,
        ]
        if self._article_css.is_file():
            self._files.append(self._article_css)
        self._files += [
            Path(p).resolve() for p in glob(str(self._data_dir / "**"), recursive=True)
        ]
        self._logger.info(f"{self}")

    @cache
    def __links(self):
        html = self.read(self.article_html_file())
        parsed = BeautifulSoup(html, "html.parser")
        pairs = {}
        for link in parsed.find_all("a"):
            href = link.get("href")
            if href not in pairs:
                if href and href.startswith("https://"):
                    name = "".join(str(content) for content in link.contents)
                    pairs[href] = name
        for link in parsed.find_all("x-blockquote"):
            href = link.get("url")
            if href not in pairs:
                if href and href.startswith("https://"):
                    name = link.get("source")
                    pairs[href] = name

        def to_reference(pair: list) -> str:
            return f"<li><a href={pair[0]}>{pair[1]}</a></li>"

        pairs = sorted(pairs.items(), key=lambda p: p[1])

        return "\n".join(map(to_reference, pairs))

    def __str__(self):
        return f"Article root={self._root}"
