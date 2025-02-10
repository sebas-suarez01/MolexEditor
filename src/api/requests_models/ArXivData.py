from pydantic import BaseModel


class ArXivData(BaseModel):
    id:str
    authors_names:str
    year:int
    title:str
    identifier:str
    url:str
