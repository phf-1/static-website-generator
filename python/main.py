# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

"""python3 main.py ${ARTICLE} ${MSG} may do what you want.

Configuration is done using environment variables:

  export PYTHONPATH=.
  export EXECUTION=parallel
  export LOGLEVEL=error

ARTICLE is a path to a directory of articles.

so:

  python3 main.py ${ARTICLE}

is to be understood as an Actor `actor' that represents the articles in ${ARTICLES}.
sending messages to `actor' is how to do things with the articles, like building a
static website. Given a message MSG, we have:

  $ actor ${MSG}

To tell what `actor' understands, try:

  $ actor help

If, for some reason, something goes wrong, then: the actor tells what went wrong and
how to likely correct the problem.
"""

import logging
import os
import sys
from pathlib import Path

from lib.websitegen import WebsiteGen

if __name__ == "__main__":
    logging.basicConfig(
        format="%(asctime)s - %(levelname)s -  %(name)s - %(message)s",
        level=os.environ.get("LOGLEVEL", "INFO").upper(),
    )
    execution = os.environ.get("EXECUTION", "PARALLEL").upper()
    actor = WebsiteGen(Path(sys.argv[1]), execution=execution)
    print(actor.argv(tuple(sys.argv[2:])))
    sys.exit(0)
