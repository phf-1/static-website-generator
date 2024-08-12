from dataclasses import dataclass
from pathlib import Path
from lib.message import Message

@dataclass
class Index(Message):
    pages: Path # Where website pages are stored.
    uuid: str # UUID of the index article.

    def __str__(self):
        return f'Index pages={self.pages} uuid={self.uuid}'

