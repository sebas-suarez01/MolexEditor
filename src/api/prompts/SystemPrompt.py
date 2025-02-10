from prompts.BasePrompt import BasePrompt


class SystemPrompt(BasePrompt):
    def __init__(self, prompt):
        super().__init__(prompt=prompt)
        self.role = 'system'

    def push(self):
        return {
            'role': self.role,
            'content': self.prompt
        }