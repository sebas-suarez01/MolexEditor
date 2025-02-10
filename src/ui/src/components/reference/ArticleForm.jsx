import { Button } from "@mui/material"
import { useState } from "react"

export default function Article({referenceStyle}){
    const [year, setYear] = useState('')
    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [articleTitle, setArticleTitle] = useState('')
    const [firstPage, setFirstPage] = useState('')
    const [lastPage, setLastPage] = useState('')
    const [journal, setJournal] = useState('')
    const [volume, setVolume] = useState('')
    const [issue, setIssue] = useState('')
    const [doi, setDoi] = useState('')


    const handleClick = async (e)=>{
        e.preventDefault()

        let data = await fetch(URL_CHAT + `/reference/article`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "first_name": firstName,
                    "last_name": lastName, 
                    "year": year, 
                    "journal": journal, 
                    "volume": volume, 
                    "title": articleTitle, 
                    "format": referenceStyle, 
                    "first_page": firstPage, 
                    "last_page": lastPage, 
                    "issue": issue,
                    "doi": doi
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
                    <label for="articleTitle" className="block mb-2 text-sm font-medium text-black">Article Title</label>
                    <input type="text" id="articleTitle" value={articleTitle} onChange={(e)=> setArticleTitle(e.target.value)} className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="Title" required />
                </div>
                <div>
                    <label for="first_page" className="block mb-2 text-sm font-medium text-black">First Page</label>
                    <input type="number" id="first_page" value={firstPage} onChange={(e)=> setFirstPage(e.target.value)} min={0} max={1000} className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="" required />
                </div>
                <div>
                    <label for="last_page" className="block mb-2 text-sm font-medium text-black">Last Page</label>
                    <input type="number" id="last_page" value={lastPage} onChange={(e)=> setLastPage(e.target.value)} min={1} max={1000} className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="" required />
                </div>
                <div>
                    <label for="year" className="block mb-2 text-sm font-medium text-black">Year</label>
                    <input type="number" id="year" value={year} onChange={(e)=> setYear(e.target.value)} min={1492} max={2025} className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="" required />
                </div>
                <div>
                    <label for="journal" className="block mb-2 text-sm font-medium text-black">Journal</label>
                    <input type="text" id="journal" value={journal} onChange={(e)=> setJournal(e.target.value)} className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="Publisher" required />
                </div>
                <div>
                    <label for="volume" className="block mb-2 text-sm font-medium text-black">Volume</label>
                    <input type="number" id="volume" value={volume} onChange={(e)=> setVolume(e.target.value)} className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="" required />
                </div>
                <div>
                    <label for="issue" className="block mb-2 text-sm font-medium text-black">Issue</label>
                    <input type="number" id="issue" value={issue} onChange={(e)=> setIssue(e.target.value)} min={0} max={1000} className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="" required />
                </div>
                <div>
                    <label for="doi" className="block mb-2 text-sm font-medium text-black">DOI</label>
                    <input type="text" id="doi" value={doi} onChange={(e)=> setDoi(e.target.value)} className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="" required />
                </div>
            </div>
            <button onClick={handleClick} className="w-full h-12 justify-center text-black bg-white font-medium rounded-md text-lg flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400">
                Generar
            </button>
        </div>
    )
}