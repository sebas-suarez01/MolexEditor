from prompts.BasePrompt import BasePrompt


class UserPrompt(BasePrompt):
    def __init__(self, prompt):
        super().__init__(prompt=prompt)
        self.role = 'user'

    def push(self):
        return {
            'role': self.role,
            'content': self.prompt
        }