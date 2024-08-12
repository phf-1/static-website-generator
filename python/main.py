from pathlib import Path
import logging
import os
import sys

from lib.actor import Actor

if __name__ == "__main__":
    logging.basicConfig(
        format='%(asctime)s - %(levelname)s -  %(name)s - %(message)s',
        level=os.environ.get('LOGLEVEL', 'INFO').upper()
    )
    actor = Actor(Path(sys.argv[1]), execution=os.environ.get('EXECUTION', 'PARALLEL').upper())
    print(actor.argv(sys.argv[2:]))
    sys.exit(0)
