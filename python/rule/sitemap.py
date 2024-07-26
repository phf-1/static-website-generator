import os
import sys
from pathlib import Path

def loc(uuid):
    return f"<loc>https://phfrohring.com/page/{uuid}/</loc>"

def uuid_props(uuid):
    return [loc(uuid)]

def url(props):
    props_str = "\n".join(props)
    return f'<url>\n{props_str}\n</url>'

def urlset(urls):
    urls_str = "\n".join(urls)
    return f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls_str}\n</urlset>'

def sitemap(urlset):
    return f'<?xml version="1.0" encoding="UTF-8"?>\n{urlset}'

def main(root_path, uuids):
    props_list = [uuid_props(uuid) for uuid in uuids]
    urls = [url(props) for props in props_list]
    urlset_ = urlset(urls)
    sitemap_ = sitemap(urlset_)
    with open(root_path / "sitemap.xml", "w") as f:
        f.write(sitemap_)

if __name__ == "__main__":
    root_path = Path(sys.argv[1])
    uuids = sys.argv[2].split(" ")
    main(root_path, uuids)
    sys.exit(0)
