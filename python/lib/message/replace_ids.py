from dataclasses import dataclass
from lib.message import Message


@dataclass
class ReplaceIds(Message):

    def __str__(self):
        return "ReplaceIds"
