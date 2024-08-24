# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

from dataclasses import dataclass
from pathlib import Path

from lib.message.message import Message


@dataclass
class Page(Message):
    uuid: str
    template: Path
    pages: Path

    def __str__(self):
        return f"Page uuid={self.uuid} template={self.template} pages={self.pages}"
