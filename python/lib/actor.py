from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional, Any
import shutil
from glob import glob
from PIL import Image
from lib.article import Article

def error(msg):
    raise AssertionError(msg)

@dataclass
class Message:
    address: Any

@dataclass
class Clone(Message):
    article: Path
    target: Path

@dataclass
class Page(Message):
    uuid: str
    template: Path
    pages: Path

@dataclass
class Index(Message):
    path: Path

@dataclass
class List(Message):
    pass

class Actor:
    def __init__(self, articles:Path) -> None:
        self._articles = articles

    def argv(self, args):
        match(args):
            case ["clone", str(article), str(target)]:
                message = Clone(self, Path(article), Path(target))

            case ["page", str(uuid), str(template), str(pages)]:
                message = Page(self, uuid, Path(template), Path(pages))

            case ["index", str(path)]:
                message = Index(self, Path(path))

            case ["list"]:
                message = List(self)

            case _:
                raise AssertionError(f"Unexpected args. {args}")

        return self.__behaviour(message)

    def __behaviour(self, msg:Message):
        match msg:
            case Clone(address=self, article=article, target=target):
                article.exists() or error(f"article does not exist. article = {article}")
                not(target.exists()) or error(f"target does not exist. target = {target}")
                shutil.copytree(article, target)
                target_article = Article.path_to_article(target)
                target_article.replace_ids()
                return target_article.directory()

            case Index(address=self, path=path):
                uuids = glob(str(self._articles / '*'))
                print(uuids)

            case List(address=self):
                articles = [Article.path_to_article(Path(path)) for path in glob(str(self._articles / '*'))]
                line = lambda art: f"{art.article_path()} | {art.desc()}"
                lines = map(line, sorted(articles, key=lambda x: x.desc()))
                return "\n".join(lines)

            case Page(address=self, uuid=uuid, template=template, pages=pages):
                article = Article.path_to_article(self._articles / uuid)
                page_dir = pages / uuid

                # page_dir points to an empty directory.
                page_dir.exists() and shutil.rmtree(page_dir)
                page_dir.mkdir(parents=True)

                # page_dir/data = article_dir/data
                shutil.copytree(article.data_directory(), page_dir / "data")

                # page_dir/bg.webp = resize(article_dir/bg.*)
                bg_img_path = article.background_img()
                with Image.open(bg_img_path) as img:
                    width, height = img.size
                    new_width = 1500
                    new_height = int((new_width / width) * height)
                    resized_img = img.resize((new_width, new_height), Image.LANCZOS)
                    resized_img.save(str(page_dir / 'bg.webp'))
                    resized_img.save(str(page_dir / 'bg.jpg'))

                # index_value = template_value
                with open(template) as f:
                    index_value = f.read()

                # index_value/__LANG__ = article_dir/lang
                index_value = index_value.replace("__LANG__", article.lang())

                # index_value/__DESCRIPTION__ = article_dir/description
                index_value = index_value.replace("__DESCRIPTION__", article.desc())

                # index_value/__CSS__ = article_dir/article.css
                article_css = article.article_css()
                if isinstance(article_css,Path) and article_css.exists():
                    with open(article_css) as f:
                        index_value = index_value.replace("__CSS__", f.read().strip())

                # index_value/__ARTICLE__ = article_dir/article.html
                with open(article.article_path()) as f:
                    index_value = index_value.replace("__ARTICLE__", f.read())

                # page_dir/index.html = index_value
                with open(page_dir / "index.html", "w") as index:
                    index.write(index_value)

                return page_dir

    def __str__(self):
        return f"Actor(articles={self._articles})"

