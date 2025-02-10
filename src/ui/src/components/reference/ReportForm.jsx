import { Button } from "@mui/material"
import { useState } from "react"

export default function Report({referenceStyle}){
    const [year, setYear] = useState('')
    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [site, setSite] = useState('')
    const [title, setTitle] = useState('')
    const [publisher, setPublisher] = useState('')


    const handleClick = async (e)=>{
        e.preventDefault()

        let data = await fetch(URL_CHAT + `/reference/report`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"first_name": firstName, "last_name": lastName, "year": year, "publisher": publisher, "title": title, "format": referenceStyle, "url": site})})
                  .then(response => response.json())
                  .then(data => data['response']);
        setResult(data)
    }

    return(
        <div>
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
                    <label for="site" className="block mb-2 text-sm font-medium text-black">Url</label>
                    <input type="url" id="site" value={site} onChange={(e)=> setSite(e.target.value)} className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="www.something.com" required />
                </div>
                <div>
                    <label for="publisher" className="block mb-2 text-sm font-medium text-black">Publisher</label>
                    <input type="text" id="publisher" value={publisher} onChange={(e)=> setPublisher(e.target.value)} className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="Publisher" required />
                </div> 
            </div>

            <button onClick={handleClick} className="w-full h-12 justify-center text-black bg-white font-medium rounded-md text-lg flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400">
                Generar
            </button>
        </div>
    )
}