from pathlib import Path
from glob import glob


def _error(msg):
    raise AssertionError(msg)


class Page:
    def __init__(self, path: Path):
        self._paths = []

        bg_img_jpg = path / "bg.jpg"
        self._paths.append(bg_img_jpg)

        bg_img_webp = path / "bg.webp"
        self._paths.append(bg_img_webp)

        self._background_imgs = {"jpg": bg_img_jpg, "webp": bg_img_webp}

        self._data = path / "data"
        self._paths.append(self._data)
        self._paths += [
            Path(p) for p in glob(str(Path(self._data / "**")), recursive=True)
        ]

        self._index = path / "index.html"
        self._paths.append(self._index)

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
