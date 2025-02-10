from typing import List

from prompts.BasePrompt import BasePrompt


class ChatLLM:
    def __init__(self, prompts: List[BasePrompt] = None):
        self.chat = prompts

    def get(self):
        return list([p.push() for p in self.chat])

    def add_prompt(self, prompt):
        self.chat.append(prompt)