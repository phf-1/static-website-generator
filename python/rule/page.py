from pathlib import Path
import glob
import os
import shutil
import sys

from PIL import Image

from lib.article import Article


# article_dir, template_file, page_dir ⊢ page_dir
def main(article_dir, template_file, page_dir):
    article = Article.path_to_article(article_dir)
    
    # page_dir points to an empty directory.
    if page_dir.exists():
        shutil.rmtree(page_dir)
    page_dir.mkdir(parents=True)

    # page_dir/data = article_dir/data
    shutil.copytree(article_dir / 'data', page_dir / "data")

    # page_dir/bg.webp = resize(article_dir/bg.*)
    bg_img_path = Path(glob.glob(str(article_dir / 'bg.*'))[0])
    with Image.open(bg_img_path) as img:
        width, height = img.size
        new_width = 1500
        new_height = int((new_width / width) * height)
        resized_img = img.resize((new_width, new_height), Image.LANCZOS)
        resized_img.save(str(page_dir / 'bg.webp'))
        resized_img.save(str(page_dir / 'bg.jpg'))

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
