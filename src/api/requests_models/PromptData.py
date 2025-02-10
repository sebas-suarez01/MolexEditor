from pydantic import BaseModel


class PromptData(BaseModel):
    id:str
    name:str
    description:str
    system_prompt:str
    assistant_prompt: str
    user_prompt: str
    text: str