import { useEffect, useRef, useState } from "react"
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaperElement from "./PaperElements";

const URL_CHAT = 'http://127.0.0.1:8000'


export default function Quote({textToTopic, setBibliography, bibliography}){
    const [inputText, setInputText]= useState(textToTopic)
    const inputData = useRef(textToTopic)

    const result_data = useRef([])
    const [currentPage, setCurrentPage] = useState(1)

    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const [itemsToDisplay, setItemsToDisplay] = useState(result_data.current.slice(startIndex, endIndex));
    
    useEffect(() => {
        setItemsToDisplay(result_data.current.slice(startIndex, endIndex))
    }, [currentPage]);

    useEffect(() => {
        setInputText(textToTopic)
        inputData.current = textToTopic;
    }, [textToTopic]);

    const handleClick = async (e)=>{
        e.preventDefault()

        const start = 0;
        const max_results = 60

        let inputDataSplitted = inputData.current.split(' ')
        inputDataSplitted = inputDataSplitted.join('+')
        let data = await fetch(URL_CHAT + `/quotes/${inputDataSplitted}?start=${start}&max_results=${max_results}`,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }})
                  .then(response => response.json())
                  .then(data => data['response']);
        result_data.current = data
        
        setItemsToDisplay(result_data.current.slice(startIndex, endIndex))
        setIsLoading(isLoading)
        
    }
    const handleChange = (e)=>{
        inputData.current = e.target.value
        setInputText(e.target.value)
    }

    return(
        <div className="overflow-y-hidden">
            <div className="relative w-full p-5">
                <input type="search" id="search-dropdown" ref={inputData} value={inputText} onChange={handleChange} className="block p-2.5 w-10/12 h-10 text-sm text-black bg-white rounded-s-lg border-s-1 border border-black" placeholder="Search Topics" required />
                <button type="submit" onClick={handleClick} className="absolute top-5 end-3.5 p-2.5 text-sm w-2/12 font-medium h-10 text-white bg-gray-700 rounded-e-lg border border-gray-700 hover:bg-gray-800 focus:ring-2 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                    <SearchIcon />
                    <span className="sr-only">Search</span>
                </button>
            </div>
            <div className="p-3 w-full h-128 overflow-y-auto">
                <ul className="list-disc">
                    {itemsToDisplay.map((i, index)=>
                        <PaperElement 
                        link={i.link} 
                        published_date={i.published_date} 
                        title={i.title}
                        authors={i.authors_names}
                        index={((currentPage - 1) * itemsPerPage + index)} 
                        items={result_data}
                        setBibliography={setBibliography}
                        bibliography={bibliography}
                        key={index}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading} />    
                    )}
                </ul>
            </div>
            
            <div className={`flex justify-center w-full ${result_data.current.length === 0 ? "invisible": ""} pt-5`}>
                <a href="#" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className={`flex items-center justify-center ${currentPage===1? "invisible":""} px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>
                    <ArrowBackIcon />
                </a>
                <a href="#" onClick={() => setCurrentPage(currentPage +  1)} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <ArrowForwardIcon />
                </a>
            </div>
        </div>
    )
}