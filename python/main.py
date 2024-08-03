import sys
from pathlib import Path
from lib.actor import Actor

if __name__ == "__main__":
    actor = Actor(Path(sys.argv[1]))
    print(actor.argv(sys.argv[2:]))
    sys.exit(0)
