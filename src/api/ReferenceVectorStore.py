from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List
from utils import REFERENCE_COLLECTION_VECTORS_NAME, REFERENCE_VECTORS_DIRECTORY_PATH, CHUNK_DOCUMENT_SIZE
from collections import defaultdict


class ReferenceStoreContext:

    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings()
        self.documents:List[Document] = []
        #documents_ids, ids_counter = ReferenceStoreContext.get_documents_ids(self.documents)
        self.documents_ids = []
        self.ids_counter = defaultdict(int)


    @staticmethod
    def get_documents_ids(documents: List[Document]):
        documents_ids = []
        id_counter = defaultdict(int)
        for doc in documents:
            id = doc.metadata['id']
            doc_id = f"{id}-{id_counter[id]}"
            id_counter[id] += 1
            documents_ids.append(doc_id)

        return documents_ids, id_counter


    def add_document(self, id, in_line_cite, content, vector_store:Chroma):
        metadata = {"source": in_line_cite, "id": id}
        document = Document(page_content=content, metadata=metadata)

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_DOCUMENT_SIZE)

        split_docs = text_splitter.split_documents([document])

        self.documents.extend(split_docs)
        print("Documents added")

        documents_ids, ids_counter = ReferenceStoreContext.get_documents_ids(documents=split_docs)
        vector_store.add_documents(documents=split_docs, ids=documents_ids)

        self.ids_counter.update(ids_counter)
        print("Ids Updated")


    def remove_document(self, id, vector_store:Chroma):
        ids = [f"{id}-{c}" for c in range(self.ids_counter.get(id))]
        vector_store.delete(ids=ids)
        print("Document removed from vector")
        docs = []

        for d in self.documents:
            if d.metadata["id"] != id:
                docs.append(d)
        print("Document Removed")
        self.ids_counter[id]=0

        print("Ids Counter to zero")

