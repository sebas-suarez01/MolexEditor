import { useRef, useState } from "react"
import DownloadingIcon from '@mui/icons-material/Downloading';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const URL_CHAT = 'http://127.0.0.1:8000'

export default function PaperElement(
    {link, 
    title, 
    published_date,
    authors,
    isLoading,
    setIsLoading,
    items,
    index, 
    setBibliography, 
    bibliography,
    }){

    const handleUpdate = async (index)=>{
        const updatedItems = [...items.current]
        if(updatedItems[index].added){
            updatedItems[index].added = false

            //added.current = false

            const bibUpdated = [...bibliography]
            const indexItem = bibUpdated.indexOf(updatedItems[index]);

            if (indexItem !== -1) {
                bibUpdated.splice(indexItem, 1);  // Removes the item at the found index
            }
            setBibliography(bibUpdated)
        }
        else{
            updatedItems[index].added = true

            setIsLoading(true)
            //added.current = true
            
            let data = await fetch(URL_CHAT + `/paper/save`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "id": updatedItems[index].id,
                    "authors_names": authors,
                    "year": published_date.slice(0, 4),
                    "title": title,
                    "identifier": updatedItems[index].id,
                    "url": link
                })
            })
                      .then(response => response.json())
                      .then(data => data['response']);
            
            
            setIsLoading(false)

            const bibUpdated = [...bibliography]
            bibUpdated.push(updatedItems[index])

            setBibliography(bibUpdated)

        }

        items.current = updatedItems
    }

    return(
        <li className="pb-4 flex flex-row">
            <div>
                <button 
                type="button" 
                onClick={() => handleUpdate(index)} 
                className={` ${!(items.current[index].added) ? 'bg-gray-300 text-black hover:bg-gray-700 hover:text-white' : 'bg-black text-white'} focus:outline-none  font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2`}>
                    {!(items.current[index].added) ?"Add": isLoading ? <DownloadingIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
                </button>
            </div>
            <div>
                <a href={link} target="_blank" className="text-gray-700 dark:text-gray-600" >{title}</a>
                <p className="text-xs">{authors}</p>
                <p className="text-xs">{published_date}</p>
            </div>
        </li>
    )
}