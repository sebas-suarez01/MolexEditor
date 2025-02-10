from ModelRequest import ModelRequest
from ChatLLM import ChatLLM
from prompts.AssistantPrompt import AssistantPrompt
from prompts.BuiltInPrompts import UserTextIncludePrompt
from prompts.FullPrompt import FullPrompt
from prompts.SystemPrompt import SystemPrompt
from prompts.UserPrompt import UserPrompt
from utils import JSON_PROMPT_INFO_PATH
import json
import os


class PromptRepository:
    def __init__(self, model_info, max_tokens=-1, stream=False, temperature=0):
        self.model_info = model_info
        self.max_tokens = max_tokens
        self.stream = stream
        self.temperature=temperature

    def get_chat_response(self, messages):

        model_request = ModelRequest(model=self.model_info['name'],
                                     api_key=self.model_info['apikey'],
                                     base_url=self.model_info['baseurl'],
                                     max_tokens=self.max_tokens,
                                     stream=self.stream,
                                     temperature=self.temperature)

        response = model_request.post(messages=messages)

        return response

    def get_prompt_answer(self, system_prompt, assistant_prompt, user_prompt, text=""):
        chat = ChatLLM()

        sys_prompt = SystemPrompt(system_prompt)
        assist_prompt = AssistantPrompt(assistant_prompt)

        chat.add_prompt(sys_prompt)
        chat.add_prompt(assist_prompt)
        if text == "":
            user_prompt = UserPrompt(user_prompt)
        else:
            user_prompt = UserTextIncludePrompt(user_prompt, text)

        chat.add_prompt(user_prompt)

        response = self.get_chat_response(messages=chat.get())

        return response

    def get_all_prompts(self):
        with open(JSON_PROMPT_INFO_PATH, 'r', encoding='utf-8') as file:
            data = json.load(file)

        data_response = []

        for d in data:
            sys_prompt = ""
            as_prompt = ""
            us_prompt = ""
            for p in d['prompts']:
                if p['role'] == 'user':
                    us_prompt = p['content']
                elif p['role'] == 'system':
                    sys_prompt = p['content']
                elif p['role'] == 'assistant':
                    as_prompt = p['content']
            prompt = {
                "name": d['name'],
                "description": d['description'],
                "system_prompt": sys_prompt,
                "assistant_prompt": as_prompt,
                "user_prompt": us_prompt,
                "include_text": d['include_text']
            }
            data_response.append(prompt)

        return data_response

    def save_prompt(self, id, name, description, system_prompt, assistant_prompt, user_prompt, include_text):

        sys_prompt = SystemPrompt(system_prompt)
        assist_prompt = AssistantPrompt(assistant_prompt)

        us_prompt = UserPrompt(user_prompt)

        full_prompt = FullPrompt(id=id,
                                 name=name,
                                 description=description,
                                 system_prompt=sys_prompt,
                                 assistant_prompt=assist_prompt,
                                 user_prompt=us_prompt,
                                 include_text=include_text)

        with open(JSON_PROMPT_INFO_PATH, 'r', encoding='utf-8') as file:
            data = json.load(file)

        exists = any(d['id'] == full_prompt.id for d in data)

        if not exists:
            data.append(full_prompt.push())

            # Save the updated data back to the file
            with open(JSON_PROMPT_INFO_PATH, "w") as file:
                json.dump(data, file, indent=4)

    def remove_prompt(self, prompt_id):

        if os.path.exists(JSON_PROMPT_INFO_PATH):
            # Open the file and load the existing data
            with open(JSON_PROMPT_INFO_PATH, "r") as file:
                try:
                    data = json.load(file)
                except json.JSONDecodeError:
                    data = []  # Start with an empty list if the file is empty or corrupted
        else:
            data = []

        new_data = []
        for d in data:
            if prompt_id != d['id']:
                new_data.append(d)

        with open(JSON_PROMPT_INFO_PATH, "w") as file:
            json.dump(new_data, file, indent=4)

        print(f"{prompt_id} Removed")