from dataclasses import dataclass

from lib.message import Message


@dataclass
class List(Message):
    def __str__(self):
        return "List"
