# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import logging
import shutil
import subprocess  # nosec B404
from glob import glob
from pathlib import Path

from lib.task import Task
from lib.utils import error


class Page:
    """p:Page means that p represents a Page of the website."""

    # Class.Public
    SUFFIX_VALUES = [".webp", ".jpg"]

    # Class.Private
    _logger = logging.getLogger(__name__)

    # Instance.Public.API
    def root(self) -> Path:
        """Return the root of this page in the filesystem."""
        return self.receive(Task(c="root", o="Path"))

    def img(self, format: str) -> Path:
        """Return the background image in format FORMAT."""
        return self.receive(Task(c=("img", format), o="Path"))

    def data(self) -> Path:
        """Return the data of this page in the filesystem."""
        return self.receive(Task(c="data", o="Path"))

    def makefile(self) -> Path:
        """Return the makefile of this page in the filesystem."""
        return self.receive(Task(c="makefile", o="Path"))

    def index(self):
        """Return the index of this page in the filesystem."""
        return self.receive(Task(c="index", o="Path"))

    def files(self) -> list[Path]:
        """Return all files of this page in the filesystem."""
        return self.receive(Task(c="files", o="List(Path)"))

    def reset(self) -> "Page":
        """Return this page after deleting all its data."""
        return self.receive(Task(o="Reset(self)"))

    def make(self) -> "Page":
        """Return this page after running `make' in its data directory."""
        return self.receive(Task(o="Make(self)"))

    def mtime(self) -> float:
        """Return this page last modification time."""
        return self.receive(Task(c="mtime", o="Float"))

    def exists(self) -> bool:
        """True means: all this page files exist in the filesystem."""
        return self.receive(Task(o="Exists"))

    def copy_to_bg(self, src: Path) -> "Page":
        """Return this page after copying SRC to a its image."""
        return self.receive(Task(c=src, o="CopyToBg(self, src)"))

    def copy_to_data(self, src: Path) -> "Page":
        """Return this page after copying SRC to a its data."""
        return self.receive(Task(c=src, o="CopyToData(self, src)"))

    def copy_to_index(self, src: Path) -> "Page":
        """Return this page after copying SRC to a its index."""
        return self.receive(Task(c=src, o="CopyToIndex(self, src)"))

    def replace_target(self, target, content) -> "Page":
        """Return this page after copying replacing TARGET by CONTENT in its index."""
        return self.receive(
            Task(c=(target, content), o="ReplacedTarget(self, target, content)")
        )

    # Instance.Public.Receive
    def receive(self, task: Task):
        self._logger.info(f"{self} ← {task}")
        match task:
            case Task(c="root", o="Path"):
                return self._root

            case Task(c=("img", format), o="Path"):
                return self._background_imgs[format]

            case Task(c="data", o="Path"):
                return self._data

            case Task(c="makefile", o="Path"):
                return self._makefile

            case Task(c="index", o="Path"):
                return self._index

            case Task(c="files", o="List(Path)"):
                return self._paths

            case Task(o="Reset(self)"):
                root = self.root()

                if root.exists():
                    shutil.rmtree(root)

                root.mkdir(parents=True)

                return self

            case Task(o="Make(self)"):
                if self._makefile.exists():
                    subprocess.run(["/bin/make"], cwd=self.data())  # nosec B603

                return self

            case Task(c="mtime", o="Float"):
                if self.exists():
                    return max([p.stat().st_mtime for p in self._paths])
                else:
                    raise AssertionError("Not in the file system.")

            case Task(o="Exists"):
                return all([p.exists() for p in self._paths])

            case Task(c=src, o="CopyToData(self, src)"):
                shutil.copytree(src, self.data())
                return self

            case Task(c=src, o="CopyToBg(self, src)"):
                suffix = src.suffix
                if suffix not in self.SUFFIX_VALUES:
                    raise AssertionError(f"unexpected suffix {suffix}.")
                shutil.copy2(src, self.root() / f"bg{src.suffix}")
                return self

            case Task(c=src, o="CopyToIndex(self, src)"):
                with open(self._index, "w") as index:
                    index.write(src)
                return self

            case Task(c=(target, content), o="ReplacedTarget(self, target, content)"):
                with open(self.index(), "r+") as index_article:
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
