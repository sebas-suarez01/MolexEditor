import arxiv
import os
import json

from ReferenceVectorStore import ReferenceStoreContext
from utils import JSON_PDF_INFO_PATH, CHUNK_DOCUMENT_SIZE
from utils_methods import paper_exists, get_split_docs


class PaperRepository:
    def __init__(self):
        self.arxiv_client = arxiv.Client()

    def download_paper(self, paper_id):
        if paper_exists(paper_id):
            return {"message": "Pdf already exists"}

        search = arxiv.Search(id_list=[paper_id])

        paper = next(self.arxiv_client.results(search))

        paper.download_pdf(dirpath="./save_data/papers", filename=f"{paper.title}.pdf")

        print(f"{paper_id} downloaded")


    def remove_paper(self, paper_id, vector_store, store_context: ReferenceStoreContext):
        print(paper_id)
        if os.path.exists(JSON_PDF_INFO_PATH):
            # Open the file and load the existing data
            with open(JSON_PDF_INFO_PATH, "r") as file:
                try:
                    data = json.load(file)
                except json.JSONDecodeError:
                    data = []  # Start with an empty list if the file is empty or corrupted
        else:
            data = []

        new_data = []
        for d in data:
            if paper_id != d['id']:
                new_data.append(d)

        store_context.remove_document(id=paper_id, vector_store=vector_store)

        with open(JSON_PDF_INFO_PATH, "w") as file:
            json.dump(new_data, file, indent=4)

        print(f"{paper_id} Removed")

    def get_papers(self, topic, max_results):

        search = arxiv.Search(
            query=f"{topic}",
            max_results=int(max_results),
            sort_by=arxiv.SortCriterion.SubmittedDate
        )

        papers = []
        for result in self.arxiv_client.results(search):
            authors_names = ', '.join(author.name for author in result.authors)

            papers.append(
                {"id": result.get_short_id(),
                 "link": result.entry_id,
                 "title": result.title,
                 "summary": result.summary,
                 "journal": result.journal_ref,
                 "published_date": result.published,
                 "authors_names": authors_names,
                 "added": False})

        return papers