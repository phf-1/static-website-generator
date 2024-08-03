from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional, Any
import shutil
from glob import glob
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
class Index(Message):
    path: Path

class Actor:
    def __init__(self, articles:Path) -> None:
        self._articles = articles

    def argv(self, args):
        match(args):
            case ["clone", str(article), str(target)]:
                message = Clone(self, Path(article), Path(target))

            case ["index", str(path)]:
                message = Index(self, Path(path))

            case _:
                raise AssertionError(f"Unexpected args. {args}")
            
        return self.__behaviour(message)

    def __behaviour(self, msg:Message):
        match msg:
            case Clone(address=address, article=article, target=target):
                article.exists() or error(f"article does not exist. article = {article}")
                not(target.exists()) or error(f"target does not exist. target = {target}")
                shutil.copytree(article, target)
                target_article = Article.path_to_article(target)
                target_article.replace_ids()
                return target_article.directory()

            case Index(address=address, path=path):
                uuids = glob(str(self._articles / '*'))
                print(uuids)
                
    def __str__(self):
        return f"Actor(articles={self._articles})"

