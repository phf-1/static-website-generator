import os
import sys
from pathlib import Path
import shutil

# article_dir, template_file ⊢ page_dir
def main(article_dir, template_file, page_dir):

    # page_dir points to an empty directory.
    if page_dir.exists():
        shutil.rmtree(page_dir)    
    page_dir.mkdir(parents=True)

    # page_dir/data = article_dir/data
    shutil.copytree(article_dir / "data", page_dir / "data")

    # index_value = template_value
    with open(template_file) as f:
        index_value = f.read()
    
    # index_value/__LANG__ = article_dir/lang
    with open(article_dir / "lang") as f:
        index_value = index_value.replace("__LANG__", f.read().strip())

    # index_value/__DESCRIPTION__ = article_dir/description
    with open(article_dir / "description") as f:
        index_value = index_value.replace("__DESCRIPTION__", f.read().strip())

    # index_value/__CSS__ = article_dir/article.css
    article_css = article_dir / "article.css"
    if article_css.exists():
        with open(article_css) as f:
            index_value = index_value.replace("__CSS__", f.read().strip())

    # index_value/__ARTICLE__ = article_dir/article.html
    with open(article_dir / "article.html") as f:
        index_value = index_value.replace("__ARTICLE__", f.read())

    # page_dir/index.html = index_value
    with open(page_dir / "index.html", "w") as index:
        index.write(index_value)

if __name__ == "__main__":
    article_dir = sys.argv[1]
    template_file = sys.argv[2]
    page_dir = sys.argv[3]    
    main(Path(article_dir), Path(template_file), Path(page_dir))
    sys.exit(0)
