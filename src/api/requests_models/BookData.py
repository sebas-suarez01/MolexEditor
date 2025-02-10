from pydantic import BaseModel


class BookData(BaseModel):
    first_name:str
    last_name:str
    year: int
    publisher: str
    title:str
    format:str
    first_page: int
    last_page: int
    editor: str
    chapter_title: str