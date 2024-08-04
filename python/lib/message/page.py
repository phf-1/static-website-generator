from dataclasses import dataclass
from pathlib import Path
from lib.message import Message

@dataclass
class Page(Message):
    uuid: str
    template: Path
    pages: Path
