from PyPDF2 import PdfReader
import json
import os
from ReferenceVectorStore import ReferenceStoreContext
from ChatLLM import ChatLLM
from ModelRequest import ModelRequest
from prompts.BuiltInPrompts import UserArXivInLineReferencePrompt
from requests_models.ArXivData import ArXivData
from utils import JSON_PDF_INFO_PATH, GPT_MODEL, CHUNK_DOCUMENT_SIZE
from utils_methods import clean_text, get_split_docs


def read_pdf(paper_data:ArXivData, vector_store, store_context, model_info):

    pdf_path = f"./save_data/papers/{paper_data.title}.pdf"
    reader = PdfReader(pdf_path)

    # Extract text from all pages
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text()

    chat = ChatLLM(prompts=[])

    chat.add_prompt(UserArXivInLineReferencePrompt(authors=paper_data.authors_names,
                                                   publish_year=paper_data.year,
                                                   reference="APA 7ma Edición"))

    model_request = ModelRequest(model=model_info['name'],
                                 api_key=model_info["apikey"],
                                 base_url=model_info['baseurl'],
                                 max_tokens=100,
                                 stream=False)

    in_line_cite = model_request.post(messages=chat.get())

    save_data_to_json(JSON_PDF_INFO_PATH,
                      {"id": paper_data.id,
                       "in-line-cite": in_line_cite,
                       "title": paper_data.title,
                       "text": full_text},
                      vector_store=vector_store,
                      store_context=store_context)


def save_data_to_json(file_path, new_data, vector_store, store_context: ReferenceStoreContext):
    # Check if the JSON file already exists
    if os.path.exists(file_path):
        # Open the file and load the existing data
        with open(file_path, "r") as file:
            try:
                data = json.load(file)
            except json.JSONDecodeError:
                data = []  # Start with an empty list if the file is empty or corrupted
    else:
        data = []  # Create a new list if the file doesn't exist

    new_data = clean_text(new_data)
    # Append the new data
    exists = any(d['id'] == new_data['id'] for d in data)

    if not exists:
        data.append(new_data)

        store_context.add_document(id=new_data['id'],
                                   in_line_cite=new_data['in-line-cite'],
                                   content=new_data['text'],
                                   vector_store=vector_store)

        # Save the updated data back to the file
        with open(file_path, "w") as file:
            json.dump(data, file, indent=4)  # Indent makes the JSON more readable

    print(f"Data saved to {file_path}")