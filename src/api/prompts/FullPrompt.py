from prompts.AssistantPrompt import AssistantPrompt
from prompts.BasePrompt import BasePrompt
from prompts.SystemPrompt import SystemPrompt
from prompts.UserPrompt import UserPrompt


class FullPrompt(BasePrompt):
    def __init__(self, id, name, description, system_prompt: SystemPrompt, assistant_prompt: AssistantPrompt, user_prompt: UserPrompt, include_text):
        super().__init__(prompt="")
        self.id = id
        self.name = name
        self.description = description
        self.system_prompt = system_prompt
        self.assistant_prompt = assistant_prompt
        self.user_prompt = user_prompt
        self.include_text = include_text


    def push(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "prompts": [self.system_prompt.push(), self.assistant_prompt.push(), self.user_prompt.push()],
            "include_text": self.include_text
        }