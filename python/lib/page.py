# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import logging
import shutil
import subprocess  # nosec B404
from glob import glob
from pathlib import Path

from lib.message import BG, Copy, Data, Index, Make, Message, Reset, Root
from lib.utils import error


class Page:
    # Class.Public
    # Class.Private
    _logger = logging.getLogger(__name__)

    # Instance.Public.Receive
    def receive(self, msg: Message):
        self._logger.info(f"{self} ← {msg}")
        match msg:
            case Root():
                """Return a Path.

                  * This path is the root of the page in the filesystem.
                """
                return self._root

            case Data():
                """Return a Path.

                  * This path is the data of the page in the filesystem.
                """
                return self._data

            case (Copy(), Path() as src, Data()):
                """Return a Page.

                  * This page is returned.
                  * All files under SRC have been added to the data of this page.
                """
                shutil.copytree(src, self._data)
                return self

            case (Copy(), Path() as src, BG()):
                """Return a Page.

                  * This page is returned.
                  * The background image represented by SRC is copied to this page.
                """
                shutil.copy2(src, self._root / f"bg{src.suffix}")
                return self

            case (Copy(), str(src), Index()):
                """Return a Page.

                  * This page is returned.
                  * The index.html file content is copied from SRC.
                """
                with open(self._index, "w") as index:
                    index.write(src)
                return self

            case Reset():
                """Return a Page.

                  * This page is returned.
                  * The root directory is now empty.
                """
                root = self._root

                if root.exists():
                    shutil.rmtree(root)

                root.mkdir(parents=True)

                return self

            case Make():
                """Return a Page.

                  * This page is returned.
                  * If any, the Makefile in the data directory is executed.
                """
                if self._makefile.exists():
                    subprocess.run(["/bin/make"], cwd=self._data)  # nosec B603

                return self

    # Instance.Public.API
    def root(self):
        message = Root()
        return self.receive(message)

    def make(self):
        message = Make()
        return self.receive(message)

    def reset(self):
        message = Reset()
        return self.receive(message)

    def copy(self, *args):
        match args:
            case (Path() as src, Data() as dst):
                message = (Copy(), src, dst)
                return self.receive(message)

            case (Path() as src, BG() as dst):
                message = (Copy(), src, dst)
                return self.receive(message)

            case (str(src), Index() as dst):
                message = (Copy(), src, dst)
                return self.receive(message)

            case _:
                error(f"Unexpected args. {args}")

    def data(self):
        return self._data

    def index(self):
        return self._index

    def background_img(self, format):
        return self._background_imgs[format]

    def mtime(self):
        if self.exists():
            return max([p.stat().st_mtime for p in self._paths])
        else:
            raise AssertionError("Not in the file system.")

    def exists(self):
        return all([p.exists() for p in self._paths])

    def replace_target(self, target, content):
        with open(self._index, "r+") as index_article:
            index_str = index_article.read()
            index_article.seek(0)
            index_str = index_str.replace(target, content)
            index_article.write(index_str)

        return self

    # Instance.Private
    def __init__(self, root: Path):
        self._root = root
        self._paths = []

        bg_img_jpg = root / "bg.jpg"
        self._paths.append(bg_img_jpg)

        bg_img_webp = root / "bg.webp"
        self._paths.append(bg_img_webp)

        self._background_imgs = {"jpg": bg_img_jpg, "webp": bg_img_webp}

        self._data = root / "data"
        self._makefile = self._data / "Makefile"

        self._paths.append(self._data)
        self._paths += [
            Path(p) for p in glob(str(Path(self._data / "**")), recursive=True)
        ]

        self._index = root / "index.html"
        self._paths.append(self._index)

    def __str__(self):
        return f"Page root = {self._root}"
