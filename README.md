# MolexEditor


The repository contains two main components:
1. **FrontEnd**: A React application(UI)
2. **BackEnd**: A FastAPI application(API)



## 📖 Bachelor's Thesis Implementation  

This project is the **implementation** of my bachelor's thesis. The research document explaining the problem, methodology, and theoretical background is available in the `research/` folder.

📄 **Read the research document:**  
[MolexEditor (PDF)](research/my_thesis_research.pdf)  

For more details on the project and its objectives, refer to the research paper above.



## Prerequisites
Ensure you have the following installed:  
- [Node.js](https://nodejs.org/) (for React frontend)  
- [Python 3.9+](https://www.python.org/) (for FastAPI backend)  
- [pip](https://pip.pypa.io/en/stable/) (Python package manager)  
- [virtualenv](https://virtualenv.pypa.io/en/stable/) (optional but recommended for Python)

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  

```sh
git clone https://github.com/sebas-suarez01/MolexEditor
cd MolexEditor
```

### 🖥️ Frontend (React UI) Setup
#### Install Dependencies
```sh
cd ui
npm install
```

#### ▶️ Run the Frontend
```sh
npm run dev
```

### 🛠️ Backend (FastAPI API) Setup
#### 📌 Create a Virtual Environment
```sh
cd api
python -m venv venv  # Create virtual environment
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate # On Windows
```
#### 📌 Install Dependencies
```sh
pip install -r requirements.txt
```

#### ▶️ Run the Backend
```sh
uvicorn main:app --reload
```

## 🎯 Running Both Together
### Backend
```sh
cd api
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload
```
### FrontEnd
```sh
cd ui
npm run dev
```

## ✅ Project Structure
MolexEditor/\
│── ui/      # React UI\
│── api/       # FastAPI API\
│── README.md      # Project instructions\
│── .gitignore     # Ignored files
