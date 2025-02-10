from pydantic import BaseModel


class SavePromptData(BaseModel):
    id:str
    name:str
    description:str
    system_prompt:str
    assistant_prompt: str
    user_prompt: str
    include_text: bool