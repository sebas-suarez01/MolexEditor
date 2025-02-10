from openai import OpenAI

class ModelRequest:
    def __init__(self, api_key, base_url=None, model='gpt-4o-mini', max_tokens = -1, stream= False, temperature=0):
        self.api_key = api_key
        self.model = model
        self.max_tokens = max_tokens
        self.stream = stream
        self.base_url=base_url
        self.temperature = temperature

    def post(self, messages):

        client = OpenAI(api_key=self.api_key, base_url=self.base_url)

        if self.max_tokens < 0:
            completion = client.chat.completions.create(
                model=self.model,
                messages=messages,
            )
        else:
            completion = client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
        response_content = completion.choices[0].message.content

        return response_content