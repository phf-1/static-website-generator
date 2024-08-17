from dataclasses import dataclass
from pathlib import Path
from lib.message import Message


@dataclass
class ReplaceIds(Message):

    def __str__(self):
        return f"ReplaceIds"
