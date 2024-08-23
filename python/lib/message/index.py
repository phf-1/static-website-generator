# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

from dataclasses import dataclass
from pathlib import Path
from lib.message import Message


@dataclass
class Index(Message):
    pages: Path  # Where website pages are stored.
    uuid: str  # UUID of the index article.

    def __str__(self):
        return f"Index pages={self.pages} uuid={self.uuid}"
