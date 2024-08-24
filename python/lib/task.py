# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

from dataclasses import dataclass
from typing import Any


@dataclass
class Task:
    c: Any  # context
    o: Any  # objective

    def __str__(self):
        return f"Task context={self.c} objective={self.o}"
