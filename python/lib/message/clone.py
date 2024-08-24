# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

from dataclasses import dataclass
from pathlib import Path
from lib.message.message import Message


@dataclass
class Clone(Message):
    article: Path
    target: Path

    def __str__(self):
        return f"Clone article={self.article} target={self.target}"
