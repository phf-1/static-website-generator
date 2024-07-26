import os
import sys
from pathlib import Path
from lib.article import Article

def main(articles_dirs):
    articles = [Article.path_to_article(path) for path in articles_dirs]
    for article in sorted(articles, key=lambda x: x.desc()):
        print(f"{article.article_path()} | {article.desc()}")

if __name__ == "__main__":
    to_path = lambda string: Path(string).resolve()
    articles_dirs = [to_path(string) for string in sys.argv[1].split(" ")]
    main(articles_dirs)
    sys.exit(0)
