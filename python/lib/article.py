from pathlib import Path
import glob
import uuid
import re

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
    @classmethod
    def path_to_article(cls, path):
        article_path = path / "article.html"
        article_css = path / "article.css"
        imgs = glob.glob(str(path / "bg.*"))
        background_img = imgs[0] if len(imgs) == 1 else None
        data_dir = path / "data"
        data_paths = [Path(p).resolve() for p in glob.glob(str(data_dir / "*"), recursive=True)]
        directory = path
        with open(path / "description") as f:
            desc = f.read().strip()
        with open(path / "lang") as f:
            lang = f.read().strip()
        uuid = path.parts[-1]
        return cls(
            article_path=article_path,
            article_css=article_css if article_css.exists() else None,
            background_img=background_img,
            data_paths=data_paths,
            desc=desc,
            directory=path,
            lang=lang,
            path=path,
            uuid=uuid,
            data_dir=data_dir
        )


    def __init__(self,
                 article_path=None,
                 article_css=None,
                 background_img=None,
                 data_paths=None,
                 desc=None,
                 directory=None,
                 lang=None,
                 path=None,
                 uuid=None,
                 data_dir=None
                 ):
        self._article_path = article_path
        self._article_css = article_css
        self._background_img = background_img
        self._data_paths = data_paths
        self._desc = desc
        self._directory = directory
        self._lang = lang
        self._path = path
        self._uuid = uuid
        self._data_dir = data_dir


    # Public

    def article_path(self):
        return self._article_path

    def article_css(self):
        return self._article_css

    def background_img(self):
        return self._background_img

    def data_paths(self):
        return self._data_paths

    def desc(self):
        return self._desc

    def directory(self):
        return self._directory

    def data_directory(self):
        return self._data_dir

    def lang(self):
        return self._lang

    def path(self):
        return self._path

    def uuid(self):
        return self._uuid

    def replace_ids(self):
        with open(self._article_path, 'r+') as file:
            content = file.read()
            file.seek(0)
            updated_content = re.sub(r'id="[^"]*"', replace_with_uuid, content)
            file.write(updated_content)
        return self

    def uuids(self):
        with open(self._article_path, 'r') as file:
            content = file.read()
            return re.findall(uuid4regex, content)

    # Private

    def __str__(self):
        return f"""Article(
    article_path = {self._article_path}
    article_css = {self._article_css}
    background_img = {self._background_img}
    data_paths = {[str(p) for p in self._data_paths]}
    desc = {self._desc}
    directory = {self._directory}
    lang = {self._lang}
    path = {self._path}
    uuid = {self._uuid}
)"""
