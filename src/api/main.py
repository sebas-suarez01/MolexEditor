from fastapi import FastAPI, Body, BackgroundTasks
from typing import Optional, List, Dict
from fastapi.middleware.cors import CORSMiddleware
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from ReferenceVectorStore import ReferenceStoreContext
from repositories.ChatRepository import ChatRepository
from background_tasks.read_pdf_files import read_pdf
from repositories.PaperRepository import PaperRepository
from repositories.PromptRepository import PromptRepository
from requests_models.SavePromptData import SavePromptData
from requests_models.ArXivData import ArXivData
from requests_models.ArticleData import ArticleData
from requests_models.BookData import BookData
from requests_models.PromptData import PromptData
from requests_models.ReportData import ReportData
from contextlib import asynccontextmanager
from requests_models.WebsiteData import WebSiteData
from utils import REFERENCE_VECTORS_DIRECTORY_PATH, REFERENCE_COLLECTION_VECTORS_NAME
from utils_methods import get_model

resource={}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the Chroma vector store during startup
    print("Loading the vector store...")
    vector_store = Chroma(
        embedding_function=HuggingFaceEmbeddings(),
        persist_directory=REFERENCE_VECTORS_DIRECTORY_PATH,
        collection_name=REFERENCE_COLLECTION_VECTORS_NAME
    )
    print("Vector store loaded successfully.")

    store_context = ReferenceStoreContext()

    resource["vector_store"]= vector_store
    resource["store_context"]= store_context
    resource["model"] = get_model()
    print("Model Info Loaded")
    print(resource['model'])
    # Yield the vector store to make it available globally

    print("Resources Loaded")
    yield

    # Cleanup logic if necessary
    print("Shutting down the application...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/quotes/{topic}")
async def quotes(topic, max_results=5):
    repository = PaperRepository()

    response = repository.get_papers(topic=topic, max_results=max_results)

    return {"response": response}

@app.post("/paper/save")
async def download_paper(paper_data:ArXivData, background_tasks: BackgroundTasks):
    vector_store = resource["vector_store"]
    store_context = resource["store_context"]
    model_info = resource['model']

    repository = PaperRepository()

    repository.download_paper(paper_id=paper_data.id)

    background_tasks.add_task(read_pdf, paper_data, vector_store, store_context, model_info)

    return {"message": "Pdf file downloaded"}

@app.post("/paper/remove/{paper_id}")
async def remove_paper(paper_id:str):
    vector_store = resource["vector_store"]
    store_context = resource["store_context"]
    repository = PaperRepository()

    repository.remove_paper(paper_id=paper_id, vector_store=vector_store, store_context=store_context)

    return {"message": "Paper removed"}

@app.post("/chat")
async def chat(request_messages: list[dict], max_tokens: Optional[int] = -1, temperature: Optional[float] = 0, stream: Optional[bool] = False):
    model_info = resource['model']
    repository = ChatRepository(model_info=model_info, max_tokens=max_tokens, stream=stream, temperature=temperature)
    response = repository.get_chat_response(messages=request_messages)
    return {"response": response}

@app.post("/summarize")
async def summarize(text:str= Body(), max_tokens: Optional[int] = -1, temperature: Optional[float] = 0, stream: Optional[bool] = False):
    model_info = resource['model']
    repository = ChatRepository(model_info=model_info, max_tokens=max_tokens, stream=stream, temperature=temperature)
    response = repository.get_summarized_text(text=text)

    return {"response": response}

@app.post("/language")
async def language(text:str= Body(), max_tokens: Optional[int] = -1, temperature: Optional[float] = 0, stream: Optional[bool] = False):
    model_info = resource['model']
    repository = ChatRepository(model_info=model_info, max_tokens=max_tokens, stream=stream, temperature=temperature)
    response = repository.get_language(text=text)

    return {"response": response}

@app.post("/topic")
async def topic(text:str= Body(), max_tokens: Optional[int] = -1, temperature: Optional[float] = 0, stream: Optional[bool] = False):
    model_info = resource['model']
    repository = ChatRepository(model_info=model_info, max_tokens=max_tokens, stream=stream, temperature=temperature)
    response = repository.get_topic(text=text)
    return {"response": response}

@app.post("/check")
async def check(text:str= Body(), actions:Dict[str,any]= Body(), max_tokens: Optional[int] = -1, temperature: Optional[float] = 0, stream: Optional[bool] = False):
    vector_store = resource["vector_store"]
    model_info = resource['model']
    repository = ChatRepository(model_info=model_info, max_tokens=max_tokens, stream=stream, temperature=temperature)
    response = repository.get_check(text=text, actions=actions, vector_store=vector_store)

    return {"response": response}

@app.post("/reference/book")
async def reference_book(book_data:BookData=Body()):
    model_info = resource['model']
    repository = ChatRepository(model_info=model_info)
    response = repository.get_reference_book(book_data=book_data)
    return {"response": response}

@app.post("/reference/article")
async def reference_article(article_data:ArticleData=Body()):
    model_info = resource['model']
    repository = ChatRepository(model_info=model_info)
    response = repository.get_reference_article(article_data=article_data)
    return {"response": response}

@app.post("/reference/website")
async def reference_website(website_data:WebSiteData=Body()):
    model_info = resource['model']
    repository = ChatRepository(model_info=model_info)
    response = repository.get_reference_website(website_data=website_data)
    return {"response": response}

@app.post("/reference/report")
async def reference_report(report_data:ReportData=Body()):
    model_info = resource['model']
    repository = ChatRepository(model_info=model_info)
    response = repository.get_reference_report(report_data=report_data)
    return {"response": response}

@app.post("/extend")
async def extend(text=Body(), max_tokens: Optional[int] = -1, temperature: Optional[float] = 0, stream: Optional[bool] = False):
    vector_store = resource["vector_store"]
    model_info = resource['model']
    repository = ChatRepository(model_info=model_info, max_tokens=max_tokens, stream=stream, temperature=temperature)
    response = repository.get_extended_text(text=text, vector_store=vector_store)

    return {"response": response}

@app.post("/prompt")
async def prompt(data: PromptData= Body(), max_tokens: Optional[int] = -1, temperature: Optional[float] = 0, stream: Optional[bool] = False):
    model_info = resource['model']
    repository = PromptRepository(model_info=model_info, max_tokens=max_tokens, stream=stream, temperature=temperature)
    response = repository.get_prompt_answer(system_prompt=data.system_prompt,
                                            assistant_prompt=data.assistant_prompt,
                                            user_prompt=data.user_prompt, text=data.text)
    return {"response": response}

@app.get("/prompts")
async def get_prompts(max_tokens: Optional[int] = -1, temperature: Optional[float] = 0, stream: Optional[bool] = False):
    model_info = resource['model']
    repository = PromptRepository(model_info=model_info, max_tokens=max_tokens, stream=stream, temperature=temperature)
    response = repository.get_all_prompts()

    return {"response": response}

@app.post("/prompt/save")
async def save_prompt(data: SavePromptData= Body(), max_tokens: Optional[int] = -1, temperature: Optional[float] = 0, stream: Optional[bool] = False):
    model_info = resource['model']

    repository = PromptRepository(model_info=model_info, max_tokens=max_tokens, stream=stream, temperature=temperature)
    repository.save_prompt(id=data.id,
                           name=data.name,
                           description=data.description,
                           system_prompt=data.system_prompt,
                           assistant_prompt=data.assistant_prompt,
                           user_prompt=data.user_prompt,
                           include_text=data.include_text)

    return {"message": "Prompt Saved"}

@app.post("/prompt/remove/{prompt_id}")
async def remove_prompt(prompt_id:str, max_tokens: Optional[int] = -1, temperature: Optional[float] = 0, stream: Optional[bool] = False):
    model_info = resource['model']

    repository = PromptRepository(model_info=model_info, max_tokens=max_tokens, stream=stream, temperature=temperature)
    repository.remove_prompt(prompt_id=prompt_id)

    return {"message": f"Prompt {prompt_id} Removed"}

@app.post("/model/change/{model_name}")
async def change_model(model_name:str):

    model_info = get_model(model=model_name)
    resource['model'] = model_info

    return {"message": f"Model changed to {model_name}"}
