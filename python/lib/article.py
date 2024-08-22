from glob import glob
from pathlib import Path
import logging
import re
import uuid
from functools import cache

from lib.message import Message
from lib.message.replace_ids import ReplaceIds

logger = logging.getLogger(__name__)
alphanum_restr = "[0-9a-f]"
uuid_restr = f"{alphanum_restr}{{8}}-{alphanum_restr}{{4}}-4{alphanum_restr}{{3}}-{alphanum_restr}{{4}}-{alphanum_restr}{{12}}"
href_restr = f'href="({uuid_restr})"'
href_re = re.compile(href_restr, re.I)
id_restr = f'id="({uuid_restr})"'
id_re = re.compile(id_restr, re.I)


def replace_with_uuid(match):
    return f'id="{uuid.uuid4()}"'


class Article:
    def __init__(self, root: Path):
        self._root = root
        self._article_html = root / "article.html"
        self._article_css = root / "article.css"
        imgs = glob(str(root / "bg.*"))
        self._bg_img_file = Path(imgs[0]) if len(imgs) == 1 else None
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
        logger.info(f"{self}")

    # Public

    def root(self):
        return self._root

    def article_html_file(self):
        return self._article_html

    @cache
    def article_html(self, ctx):
        html = ""

        if self._article_html.is_file():
            with open(self._article_html) as f:
                html = f.read()
        else:
            raise AssertionError(f"{self._article_html} is not a file.")

        def in_page(id):
            if self.has(id):
                return lambda html: html.replace(f'href="{id}"', f'href="#{id}"')

        def page_has_id(id):
            if ctx.page_has_id(id):
                return lambda html: html.replace(f'href="{id}"', f'href="/page/{id}"')

        def page_with_id(id):
            match ctx.page_with_id(id):
                case page_id if isinstance(page_id, str):
                    return lambda html: html.replace(
                        f'href="{id}"', f'href="/page/{page_id}#{id}"'
                    )

        finders = [in_page, page_has_id, page_with_id]
        for ref_uuid in re.findall(href_re, html):
            renderer = None

            for find in finders:
                renderer = find(ref_uuid)
                if renderer is not None:
                    html = renderer(html)
                    break

            if renderer is None:
                raise AssertionError(f"No element has been found with uuid {ref_uuid}")

        return html

    def article_css_file(self):
        return self._article_css

    def article_css(self):
        if self._article_css.is_file():
            with open(self._article_css) as f:
                return f.read()
        else:
            logger.info(f"{self._article_css} is not a file.")
            return ""

    def background_img_file(self):
        return self._bg_img_file

    def description(self):
        if self._description.is_file():
            with open(self._description) as f:
                return f.read().strip()
        else:
            raise AssertionError(f"{self._description} is not a file.")

    def description_file(self):
        return self._description

    def data_dir(self):
        return self._data_dir

    def lang(self):
        if self._lang.is_file():
            with open(self._lang) as f:
                return f.read().strip()
        else:
            raise AssertionError(f"{self._lang} is not a file.")

    def lang_file(self):
        return self._lang

    def root_dir(self):
        return self._root

    def uuid(self):
        return self._uuid

    def replace_ids(self):
        message = ReplaceIds(self)
        return self.receive(message)

    @cache
    def uuids(self) -> list[str]:
        with open(self._article_html, "r") as file:
            content = file.read()
            return re.findall(id_re, content)

    @cache
    def has(self, id):
        return id in self.uuids()

    def exists(self):
        return all([p.exists() for p in self._files])

    def mtime(self):
        if self.exists():
            return max([p.stat().st_mtime for p in self._files])
        else:
            raise AssertionError("Not in the file system.")

    def receive(self, msg: Message):
        logger.info(f"{self} ← {msg}")

        match msg:
            case ReplaceIds(address=self):
                with open(self._article_html, "r+") as file:
                    content = file.read()
                    file.seek(0)
                    updated_content = re.sub(r'id="[^"]*"', replace_with_uuid, content)
                    file.write(updated_content)
                return self

            case _:
                raise AssertionError(f"Unexpected msg. msg = {msg}")

    # Private

    def __str__(self):
        return f"Article root={self._root}"
