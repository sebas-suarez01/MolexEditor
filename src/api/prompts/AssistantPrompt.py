from prompts.BasePrompt import BasePrompt


class AssistantPrompt(BasePrompt):
    def __init__(self, prompt):
        super().__init__(prompt=prompt)
        self.role = 'assistant'

    def push(self):
        return {
            'role': self.role,
            'content': self.prompt
        }