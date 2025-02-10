from pydantic import BaseModel


class ArticleData(BaseModel):
    first_name:str
    last_name:str
    year: int
    journal: str
    title:str
    format:str
    volume:int
    first_page: int
    last_page: int
    issue:str
    doi:str