from dataclasses import dataclass
from pathlib import Path
from lib.message import Message

@dataclass
class Clone(Message):
    article: Path
    target: Path

    def __str__(self):
        return f'Clone article={self.article} target={self.target}'
