import { Button } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const URL_CHAT = 'http://127.0.0.1:8000'


function PromptBuilder({
    isHidden, 
    setIsHidden, 
    prompts,
    name,
    setName,
    description,
    setDescription,
    systemPrompt,
    setSystemPrompt,
    assistantPrompt,
    setAssistantPrompt,
    userPrompt,
    setUserPrompt,
    includeText,
    setIncludeText
}){
    
    const handleBack = ()=>{
        setName("")
        setDescription("")
        setSystemPrompt("")
        setAssistantPrompt("")
        setUserPrompt("")
        setIncludeText(false)
        setIsHidden(0)
    }

    const handleAdd = async () => {
        const id = crypto.randomUUID()

        prompts.current.push({
            'id': id,
            'name': name,
            'description': description,
            'system_prompt': systemPrompt,
            'assistant_prompt': assistantPrompt,
            'user_prompt': userPrompt,
            'include_text': includeText
        })

        let data = await fetch(URL_CHAT + `/prompt/save`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'id': id,
                'name': name,
                'description': description,
                'system_prompt': systemPrompt,
                'assistant_prompt': assistantPrompt,
                'user_prompt': userPrompt,
                'include_text': includeText
            })
        })
                  .then(response => response.json())
                  .then(data => data['response']);

        setName("")
        setDescription("")
        setSystemPrompt("")
        setAssistantPrompt("")
        setUserPrompt("")
        setIncludeText(false)

        setIsHidden(0)

    }

    return(
        <div className={`overflow-y-hidden ${isHidden !== 1? "hidden": ""}`}>
            <button className="w-1/12" onClick={handleBack}>
                <ArrowBackIcon />
            </button>
            <div>
                <div className="pt-2 px-3">
                    <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                    <input type="text" id="small-input" value={name} onChange={(e)=> setName(e.target.value)} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div className="pt-3 px-3">
                    <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900">Descripcion</label>
                    <input type="text" id="small-input" value={description} onChange={(e)=> setDescription(e.target.value)} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Breve descripción del prompt" />
                </div>
                <div className="pt-3 px-3">
                    <label htmlFor="message1" className="block mb-2 text-sm font-medium text-gray-900">Prompt del sistema</label>
                    <textarea id="message1" rows="4" value={systemPrompt} onChange={(e)=> setSystemPrompt(e.target.value)} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Opcional"></textarea>
                </div>
                <div className="pt-3 px-3">
                    <label htmlFor="message2" className="block mb-2 text-sm font-medium text-gray-900">Primer mensaje del asistente</label>
                    <textarea id="message2" rows="4" value={assistantPrompt} onChange={(e)=> setAssistantPrompt(e.target.value)} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Opcional"></textarea>
                </div>
                <div className="pt-3 px-3">
                    <label htmlFor="message3" className="block mb-2 text-sm font-medium text-gray-900">Su primer mensaje</label>
                    <textarea id="message3" rows="4" value={userPrompt} onChange={(e)=> setUserPrompt(e.target.value)} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Escriba su texto"></textarea>
                </div>
                <div className="pt-3 px-3">
                    <input id="default-checkbox" type="checkbox" value={includeText} onChange={(e)=> setIncludeText(e.target.value)} className="w-4 h-4 text-gray-500 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900">Include Text</label>
                </div>

                <div className="pt-6 px-3">
                    <button onClick={handleAdd} className="w-full justify-center text-black bg-white font-medium rounded-md text-lg flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400">
                        Añadir
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PromptBuilder