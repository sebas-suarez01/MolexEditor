import { Button } from "@mui/material"
import { useState } from "react"

const URL_CHAT = 'http://127.0.0.1:8000'


export default function Book({referenceStyle}){
    const [year, setYear] = useState('')
    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [publisher, setPublisher] = useState('')
    const [title, setTitle] = useState('')
    const [chapterTitle, setChapterTitle] = useState('')
    const [firstPage, setFirstPage] = useState('')
    const [lastPage, setLastPage] = useState('')
    const [result, setResult] = useState('')


    const handleClick = async (e)=>{
        e.preventDefault()

        let data = await fetch(URL_CHAT + `/reference/book`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "first_name": firstName, 
                "last_name": lastName, 
                "year": year, 
                "publisher": publisher, 
                "title": title, 
                "format": referenceStyle,
                "first_page": firstPage, 
                "last_page": lastPage, 
                "chapter_title": chapterTitle
            })})
                  .then(response => response.json())
                  .then(data => data['response']);
        setResult(data)
    }


    return(
        <div className="p-5">
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="autor_first_name" className="block mb-2 text-sm font-medium text-black">First name</label>
                    <input type="text" id="autor_first_name" value={firstName} onChange={(e)=> setFirstName(e.target.value)} className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="John" required />
                </div>
                <div>
                    <label for="author_last_name" className="block mb-2 text-sm font-medium text-black">Last Name</label>
                    <input type="text" id="author_last_name" value={lastName} onChange={(e)=> setLastName(e.target.value)} className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="Doe" required />
                </div>
                <div>
                    <label for="title" className="block mb-2 text-sm font-medium text-black">Title</label>
                    <input type="text" id="title" value={title} onChange={(e)=> setTitle(e.target.value)} className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="Title" required />
                </div>  
                <div>
                    <label for="year" className="block mb-2 text-sm font-medium text-black">Year</label>
                    <input type="number" id="year" value={year} onChange={(e)=> setYear(e.target.value)} min={1492} max={2025} className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="" required />
                </div>
                <div>
                    <label for="publisher" className="block mb-2 text-sm font-medium text-black">Publisher</label>
                    <input type="text" id="publisher" value={publisher} onChange={(e)=> setPublisher(e.target.value)} className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="Publisher" required />
                </div>
                <div>
                    <label for="chapter_title" className="block mb-2 text-sm font-medium text-black">Chapter Title</label>
                    <input type="text" id="chapter_title" value={chapterTitle} onChange={(e)=> setChapterTitle(e.target.value)} className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="Title" required />
                </div>  
                <div>
                    <label for="first_page" className="block mb-2 text-sm font-medium text-black">First Page</label>
                    <input type="number" id="first_page" value={firstPage} onChange={(e)=> setFirstPage(e.target.value)} min={0} max={1000} className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="" required />
                </div>
                <div>
                    <label for="last_page" className="block mb-2 text-sm font-medium text-black">Last Page</label>
                    <input type="number" id="last_page" value={lastPage} onChange={(e)=> setLastPage(e.target.value)} min={1} max={1000} className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="" required />
                </div>
            </div>

            <button onClick={handleClick} className="w-full h-12 justify-center text-black bg-white font-medium rounded-md text-lg flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400">
                Generar
            </button>
        </div>
    )
}