from ChatLLM import ChatLLM
from prompts.BuiltInPrompts import SystemGenerateTextPrompt, UserTopicPrompt, UserCheckPrompt, UserLanguageDetectPrompt, \
    UserBookReferencePrompt, UserArticleReferencePrompt, UserWebSiteReferencePrompt, UserReportReferencePrompt, \
    UserExtendTextInLineCitations, UserSummarizePrompt, UserCheckCitationPrompt
from ModelRequest import ModelRequest
from utils_methods import get_related_docs
from typing import Dict


class ChatRepository:

    def __init__(self, model_info, max_tokens=-1, stream=False, temperature=0):
        self.model_info = model_info
        self.max_tokens = max_tokens
        self.stream = stream
        self.temperature = temperature

    def get_topic(self, text):
        chat = ChatLLM(prompts=[SystemGenerateTextPrompt()])

        chat.add_prompt(UserTopicPrompt(text=text))

        response = self.get_chat_response(messages=chat.get())

        return response

    def get_summarized_text(self, text):
        chat = ChatLLM(prompts=[SystemGenerateTextPrompt()])

        chat.add_prompt(UserSummarizePrompt(text=text))

        response = self.get_chat_response(messages=chat.get())

        return response

    def get_extended_text(self, text, vector_store):

        topic = self.get_topic(text=text)

        related_docs = get_related_docs(query=topic, vector_store=vector_store)

        chat = ChatLLM(prompts=[SystemGenerateTextPrompt()])

        chat.add_prompt(UserExtendTextInLineCitations(related_docs=related_docs, text=text))

        response = self.get_chat_response(messages=chat.get())

        return response

    def get_check(self, text, actions:Dict, vector_store):

        if not "Citacion" in actions:
            chat = ChatLLM(prompts=[SystemGenerateTextPrompt()])
            actions_values = list(actions.values())

            chat.add_prompt(UserCheckPrompt(text=text, actions=','.join(actions_values)))

            response = self.get_chat_response(messages=chat.get())

            return response

        removed_value = actions.pop("Citacion")

        full_response =""

        chat = ChatLLM(prompts=[SystemGenerateTextPrompt()])
        if len(actions) > 0:

            actions_values = list(actions.values())

            chat.add_prompt(UserCheckPrompt(text=text, actions=','.join(actions_values)))

            response_actions = self.get_chat_response(messages=chat.get())

            full_response+=f"""Actions response: {response_actions}"""


        related_docs = get_related_docs(query=text, vector_store=vector_store)

        chat.add_prompt(UserCheckCitationPrompt(related_docs=related_docs, text=text))

        response = self.get_chat_response(messages=chat.get())

        full_response += f"""Citation Response: {response}"""
        return full_response


    def get_language(self, text):
        chat = ChatLLM(prompts=[SystemGenerateTextPrompt()])

        chat.add_prompt(UserLanguageDetectPrompt(text=text))

        response = self.get_chat_response(messages=chat.get())

        return response

    def get_reference_book(self, book_data):
        chat = ChatLLM(prompts=[SystemGenerateTextPrompt()])

        chat.add_prompt(UserBookReferencePrompt(title=book_data.title,
                                                authors=f"{book_data.first_name} {book_data.last_name}",
                                                publish_year=book_data.year,
                                                publisher=book_data.publisher,
                                                reference=book_data.format,
                                                chapter_title=book_data.chapter_title,
                                                pages=f"{book_data.first_page}-{book_data.last_page}"))

        response = self.get_chat_response(messages=chat.get())

        return response

    def get_reference_article(self, article_data):
        chat = ChatLLM(prompts=[SystemGenerateTextPrompt()])

        chat.add_prompt(UserArticleReferencePrompt(title=article_data.title,
                                                   authors=f"{article_data.first_name} {article_data.last_name}",
                                                   publish_year=article_data.year,
                                                   journal=article_data.journal,
                                                   reference=article_data.format,
                                                   volume=article_data.volume,
                                                   issue=article_data.issue,
                                                   pages=f"{article_data.first_page}-{article_data.last_page}",
                                                   doi=article_data.doi))

        response = self.get_chat_response(messages=chat.get())

        return response

    def get_reference_website(self, website_data):
        chat = ChatLLM(prompts=[SystemGenerateTextPrompt()])

        chat.add_prompt(UserWebSiteReferencePrompt(title=website_data.title,
                                                   authors=f"{website_data.first_name} {website_data.last_name}",
                                                   publish_year=website_data.year,
                                                   website_name=website_data.site_name,
                                                   reference=website_data.format,
                                                   url=website_data.url))

        response = self.get_chat_response(messages=chat.get())

        return response

    def get_reference_report(self, report_data):
        chat = ChatLLM(prompts=[SystemGenerateTextPrompt()])

        chat.add_prompt(UserReportReferencePrompt(title=report_data.title,
                                                  authors=f"{report_data.first_name} {report_data.last_name}",
                                                  publish_year=report_data.year,
                                                  publisher=report_data.publisher,
                                                  reference=report_data.format,
                                                  url=report_data.url))

        response = self.get_chat_response(messages=chat.get())

        return response

    def get_chat_response(self, messages):

        model_request = ModelRequest(model=self.model_info['name'],
                                     base_url=self.model_info['baseurl'],
                                     api_key=self.model_info['apikey'],
                                     max_tokens=self.max_tokens,
                                     stream=self.stream,
                                     temperature=self.temperature)

        response = model_request.post(messages=messages)

        return response