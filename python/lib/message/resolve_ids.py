from dataclasses import dataclass
from lib.message import Message


@dataclass
class ResolveIds(Message):
    def __str__(self):
        return "ResolveIds"
