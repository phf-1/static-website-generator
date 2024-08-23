# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

from pathlib import Path
import logging
import os
import sys

from lib.actor import Actor

if __name__ == "__main__":
    logging.basicConfig(
        format="%(asctime)s - %(levelname)s -  %(name)s - %(message)s",
        level=os.environ.get("LOGLEVEL", "INFO").upper(),
    )
    execution = os.environ.get("EXECUTION", "PARALLEL").upper()
    actor = Actor(Path(sys.argv[1]), execution=execution)
    print(actor.argv(sys.argv[2:]))
    sys.exit(0)
