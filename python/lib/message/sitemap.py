from dataclasses import dataclass
from pathlib import Path
from lib.message import Message

@dataclass
class Sitemap(Message):
    root: Path

    def __str__(self):
        return f'Sitemap root={self.root}'

