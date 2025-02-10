import json
from langchain.schema import Document
from langchain_chroma import Chroma

from ReferenceVectorStore import ReferenceStoreContext
from utils import JSON_PDF_INFO_PATH, JSON_MODEL_INFO
from langchain.text_splitter import RecursiveCharacterTextSplitter
import re


def paper_exists(paper_id):
    with open(JSON_PDF_INFO_PATH, "r") as file:
        data = json.load(file)

    for d in data:
        id = d.get("id")
        if id == paper_id:
            return True

    return False

def clean_text(data):
    text = data.get('text')
    index = str(text).find("References")
    text = text[0:index]
    cleaned_text = re.sub(r'[^A-Za-z0-9\s]', '', text)
    data['text'] = cleaned_text

    return data

def load_json_documents(json_path):
    with open(json_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    documents = []
    for item in data:
        in_line_cite = item.get("in-line-cite")
        text = item.get("text")
        metadata = {"source": in_line_cite, "id": item.get('id')}
        documents.append(Document(page_content=text, metadata=metadata))
    return documents

def get_split_docs(chunk_document_size = 500):

    docs = load_json_documents(JSON_PDF_INFO_PATH)

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_document_size)

    docs = text_splitter.split_documents(docs)

    return docs

def get_related_docs(query, vector_store:Chroma, search_type='similarity', amount = 3):

    retriever = vector_store.as_retriever(search_type=search_type, search_kwargs={"k": amount})

    retrieved_docs = retriever.invoke(query)
    print('Retrive docs')
    return retrieved_docs

def get_model(model="gpt-4o-mini"):
    with open(JSON_MODEL_INFO, 'r', encoding='utf-8') as file:
        data = json.load(file)

    if model in data:
        model_info = data[model]

        model_info["name"] = model
        return model_info
    else:
        model_info = data['gpt-4o-mini']
        model_info["name"] = 'gpt-4o-mini'
        return model_info

