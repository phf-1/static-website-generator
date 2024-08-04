from dataclasses import dataclass
from pathlib import Path
from lib.message import Message

@dataclass
class All(Message):
    uuid: str
    template: Path
    root: Path
