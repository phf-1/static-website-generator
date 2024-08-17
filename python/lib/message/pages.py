from dataclasses import dataclass
from pathlib import Path
from lib.message import Message


@dataclass
class Pages(Message):
    template: Path
    pages: Path

    def __str__(self):
        return f"Pages pages={self.pages} template={self.template}"
