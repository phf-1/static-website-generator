import os
import sys
from pathlib import Path

def main(index_path, articles_dir, uuids):
    def read_desc(uuid):
        path = Path(articles_dir) / uuid / "description"
        with open(path) as f:
            return f.read()

    uuid_desc = [(uuid, read_desc(uuid)) for uuid in uuids]
    uuid_desc.sort(key=lambda pair: pair[1])
    
    def build_li(uuid, desc):
        return f'<li><a href="/page/{uuid}/">{desc}</a></li>'

    items = "\n".join([build_li(uuid,desc.strip()) for (uuid,desc) in uuid_desc])
    
    with open(index_path, "r+") as index:
        index_str = index.read()
        index.seek(0)
        index_str = index_str.replace("__INDEX__",items)
        index.write(index_str)

if __name__ == "__main__":
    index_path = sys.argv[1]
    articles_dir = sys.argv[2]
    uuids = sys.argv[3].split(" ")
    # TODO: uuids is not necessary. articles_dir ⊢ uuids.
    main(index_path, articles_dir, uuids)
    sys.exit(0)
