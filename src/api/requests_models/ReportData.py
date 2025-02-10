from pydantic import BaseModel


class ReportData(BaseModel):
    first_name: str
    last_name: str
    year: int
    publisher: str
    title: str
    url: str
    format: str