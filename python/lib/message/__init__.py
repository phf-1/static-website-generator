from dataclasses import dataclass
from typing import Any


@dataclass
class Message:
    address: Any

    def __str__(self):
        return f"Message"
