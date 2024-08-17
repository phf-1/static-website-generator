from dataclasses import dataclass
from pathlib import Path
from lib.message import Message


@dataclass
class All(Message):
    uuid: str
    template: Path
    root: Path

    def __str__(self):
        return f"All uuid={self.uuid} template={self.template} root={self.root}"
