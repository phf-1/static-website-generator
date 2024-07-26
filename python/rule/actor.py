import sys
from pathlib import Path
import shutil
import uuid
import re

def replace_with_uuid(match):
        return f'id="{uuid.uuid4()}"'

# Builds a new actor derived from the example.
def main(actor_example, new_actor):
    # Anything under the actor example directory is copied under the new actor
    # directory.
    shutil.copytree(actor_example, new_actor)

    # Every id in the new actor files are replaced by fresh ids.
    with open(new_actor / "article.html", 'r+') as file:
        content = file.read()
        file.seek(0)
        updated_content = re.sub(r'id="[^"]*"', replace_with_uuid, content)
        file.write(updated_content)

    # The new actor directory is returned to the caller.
    print(new_actor)

if __name__ == "__main__":
    actor_example = Path(sys.argv[1])
    new_actor = Path(sys.argv[2])
    main(actor_example, new_actor)
    sys.exit(0)
