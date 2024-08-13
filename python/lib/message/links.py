from dataclasses import dataclass
from pathlib import Path
from lib.message import Message

@dataclass
class Links(Message):
    path: Path

    def __str__(self):
        return f'Links path={self.path}'
