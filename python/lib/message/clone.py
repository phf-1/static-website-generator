from dataclasses import dataclass
from pathlib import Path
from lib.message import Message

@dataclass
class Clone(Message):
    article: Path
    target: Path
