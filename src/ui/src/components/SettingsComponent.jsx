import { useEffect, useRef, useState } from "react"

const models=["gpt-4o-mini", "gemini-1.5-flash"]

const URL = 'http://127.0.0.1:8000'

function Settings({temperatureValue}){
    const [isHidden, setIsHidden] = useState(true)
    const [flagSettings, setFlagSettings] = useState(false)

    const firstValue = useRef(models[0])
    const handleChangeDropdown=()=>{
        setIsHidden(!isHidden)
    }
    const handleChangeLLM=(item)=>{
        setIsHidden(!isHidden)
        setFlagSettings(true)
        firstValue.current = item
    }

    useEffect(()=>{
        async function fetchSettings() {
            await fetch(URL + `/model/change/${firstValue.current}`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }})
                    .then(response => response.json())
                    .then(data => data['response']);
        }
    
        if(flagSettings){
            fetchSettings()
        }
        setFlagSettings(false)
    }, [flagSettings])
    return(
        <div className="p-3">
            <div className="pt-5">
                <p className="text-lg pb-3">Elige el modelo</p>
                <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" onClick={handleChangeDropdown} className="text-white w-40 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" type="button">
                    <div className="w-32">
                        {firstValue.current}
                    </div> 
                    <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </button>

                <div className="h-40 w-full">
                    <div id="dropdown" className={`z-10 ${isHidden?"hidden":""}  bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}>
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                            {models.map((item, index)=>(
                                <li  key={item}>
                                    <a href="#" onClick={()=>handleChangeLLM(item)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{item}</a>
                                </li>
                            ))}
                            
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <p className="text-lg pt-5 pb-2">Creatividad del modelo</p>
                <input ref={temperatureValue} id="price-range-input" type="range" onChange={(e)=> temperatureValue.current = e.target.value} min="0" max="10" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
        </div> 
    )
}

export default Settings