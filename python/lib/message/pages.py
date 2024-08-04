from dataclasses import dataclass
from pathlib import Path
from lib.message import Message

@dataclass
class Pages(Message):
    template: Path
    pages: Path
