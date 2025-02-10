
class BasePrompt:
    def __init__(self, prompt: str=""):
        self.prompt = prompt

    def push(self):
        pass

    def __repr__(self):
        return str(self.__dict__)







