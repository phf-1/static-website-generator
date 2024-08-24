# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

from dataclasses import dataclass

from lib.message.all import All
from lib.message.bg import BG
from lib.message.clone import Clone
from lib.message.copy import Copy
from lib.message.data import Data
from lib.message.duplicated_uuids import DuplicatedUUIDs
from lib.message.help import Help
from lib.message.index import Index
from lib.message.links import Links
from lib.message.list import List
from lib.message.make import Make
from lib.message.page import Page
from lib.message.page_with_id import ArticleWithId
from lib.message.pages import Pages
from lib.message.replace_ids import ReplaceIds
from lib.message.reset import Reset
from lib.message.resolve_ids import ResolveIds
from lib.message.root import Root
from lib.message.sitemap import Sitemap


@dataclass
class Message:
    def __str__(self):
        return "Message"


__all__ = [
    "All",
    "ArticleWithId",
    "BG",
    "Clone",
    "Copy",
    "Data",
    "DuplicatedUUIDs",
    "Help",
    "Index",
    "Links",
    "List",
    "Make",
    "Message",
    "Page",
    "Pages",
    "ReplaceIds",
    "Reset",
    "ResolveIds",
    "Root",
    "Sitemap",
]
