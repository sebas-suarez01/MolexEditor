import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect } from "react";

const URL_CHAT = 'http://127.0.0.1:8000'


function PromptList({
    isHidden, 
    setIsHidden, 
    prompts, 
    builtInPrompts, 
    setResponse,
    setName,
    setDescription,
    setSystemPrompt,
    setAssistantPrompt,
    setUserPrompt,
    setIncludeText,
    temperatureValue
}){
    const handleNewPrompt = ()=>{
        setIsHidden(1)
    }
    const handleEdit = (name, description, system_prompt, assistant_prompt, user_prompt, include_text)=>{
        setName(name)
        setDescription(description)
        setSystemPrompt(system_prompt)
        setAssistantPrompt(assistant_prompt)
        setUserPrompt(user_prompt)
        setIncludeText(include_text)
        setIsHidden(1)
    }
    useEffect(() => {
        const getAllPrompts = async ()=>{
            let data = await fetch(URL_CHAT + `/prompts`,{
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                      .then(response => response.json())
                      .then(data => data['response']);
            prompts.current = data
        }

        getAllPrompts()
    })

    const handleSend = async (id, name, description, system_prompt, assistant_prompt, user_prompt) => {
        let data = await fetch(URL_CHAT + `/prompt`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "id": id,
                "name": name,
                "description": description,
                "system_prompt": system_prompt,
                "assistant_prompt": assistant_prompt,
                "user_prompt": user_prompt,
                "text":"",
                "temperature":temperatureValue.current
            })
        })
                  .then(response => response.json())
                  .then(data => data['response']);
        setResponse(data)

        setIsHidden(2)
    }

    const handleClear = async(index)=>{
        const prompt_element = prompts.current[index]
        prompts.current.splice(index, 1)
        setIsChange(!isHidden)
        setIsChange(!isChange)

        let data = await fetch(URL_CHAT + `/prompt/remove/${prompt_element.id}`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
                  .then(response => response.json())
                  .then(data => data['response']);
    }
    return(
        <div className={`pt-5 space-y-8 ${isHidden !== 0 ? "hidden": ""} overflow-y-hidden`}>
            <div>
                <h1 className="text-4xl sticky">Prompts</h1>
                <div className="flex justify-center pt-1 sticky">
                    <button onClick={handleNewPrompt} className="w-20 justify-center text-black bg-white font-medium rounded-md text-lg flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400">
                        New
                    </button>
                </div>
            </div>
            <div className="w-full h-128 overflow-y-auto">
                <p className="text-2xl pb-2">Prompts Predefinidos</p>
                <ul className="space-y-3 pb-5">
                    {builtInPrompts.map((i, index)=>(
                        <li className="flex flex-row" key={index}>
                            <div className="w-full">
                                <button onClick={() => handleSend(i.id, i.name, i.description, i.system_message, i.asis_message, i.user_message)}>
                                    <p className="text-lg">{i.name}</p>
                                </button>
                                <p className="text-xs">{i.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                {prompts.current.length !== 0 && <p className="text-2xl pb-2">Prompts</p>}
                <ul className="space-y-3">
                    {prompts.current.map((i, index)=>(
                        <li className="flex flex-row" key={index}>
                            <div className="w-10/12">
                                <button onClick={() => handleSend(i.id, i.name, i.description, i.system_prompt, i.assistant_prompt, i.user_prompt, i.include_text)}>
                                    <p className="text-xl">{i.name}</p>
                                </button>
                                <p className="text-xs">{i.description}</p>
                            </div>
                            <div className="w-1/12">
                                <button onClick={()=>handleClear(index)}>
                                    <ClearIcon fontSize="small" />
                                </button>
                            </div>
                            <div className="w-1/12">
                                <button onClick={()=> handleEdit(i.name, i.description, i.system_prompt, i.assistant_prompt, i.user_prompt, i.include_text)}>
                                    <EditIcon fontSize="small" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default PromptList