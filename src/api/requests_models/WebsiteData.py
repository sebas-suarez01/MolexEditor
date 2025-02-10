from pydantic import BaseModel


class WebSiteData(BaseModel):
    first_name: str
    last_name: str
    year: int
    site_name: str
    title: str
    url: str
    format: str