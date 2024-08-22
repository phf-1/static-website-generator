from dataclasses import dataclass
from lib.message import Message


@dataclass
class PageWithId(Message):
    id: str

    def __str__(self):
        return "PageWithId"
