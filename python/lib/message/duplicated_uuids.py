from dataclasses import dataclass
from pathlib import Path
from lib.message import Message

@dataclass
class DuplicatedUUIDs(Message):

    def __str__(self):
        return f'DuplicatedUUIDs'

