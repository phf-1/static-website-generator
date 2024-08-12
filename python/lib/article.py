from glob import glob
from pathlib import Path
import logging
import re
import uuid

from lib.message import Message
from lib.message.replace_ids import ReplaceIds

logger = logging.getLogger(__name__)
uuid4regex = re.compile(r'id="([0-9a-f]{12}4[0-9a-f]{3}[89ab][0-9a-f]{15}\Z)"', re.I)

def replace_with_uuid(match):
        return f'id="{uuid.uuid4()}"'

def replace_ids_in_file(path:Path) -> None:
    with open(target / "article.html", 'r+') as file:
        content = file.read()
        file.seek(0)
        updated_content = re.sub(r'id="[^"]*"', replace_with_uuid, content)
        file.write(updated_content)

class Article:
    def __init__(self, root:Path):
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
        self._article_css.is_file() and self._files.append(self._article_css)
        self._files += [Path(p).resolve() for p in glob(str(self._data_dir / "**"), recursive=True)]
        logger.info(f'{self}')

    # Public

    def root(self):
        return self._root

    def article_html_file(self):
        return self._article_html

    def article_html(self):
        if self._article_html.is_file():
            with open(self._article_html) as f:
                return f.read()
        else:
            raise AssertionError(f"{self._article_html} is not a file.")

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

    def uuids(self):
        with open(self._article_html, 'r') as file:
            content = file.read()
            return re.findall(uuid4regex, content)

    def exists(self):
        return all([p.exists() for p in self._files])

    def mtime(self):
        if self.exists():
            return max([p.stat().st_mtime for p in self._files])
        else:
            raise AssertionError("Not in the file system.")

    def receive(self, msg:Message):
        logger.info(f'{self} ← {msg}')

        match msg:
            case ReplaceIds(address=self):
                with open(self._article_html, 'r+') as file:
                    content = file.read()
                    file.seek(0)
                    updated_content = re.sub(r'id="[^"]*"', replace_with_uuid, content)
                    file.write(updated_content)
                return self

            case _:
                raise AssertionError(f'Unexpected msg. msg = {msg}')

    # Private

    def __str__(self):
        return f"Article root={self._root}"
