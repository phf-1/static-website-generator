from dataclasses import dataclass
from lib.message import Message


@dataclass
class DuplicatedUUIDs(Message):
    def __str__(self):
        return "DuplicatedUUIDs"
