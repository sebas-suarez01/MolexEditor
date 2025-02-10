import PromptBuilder from "./PromptBuilderComponent"
import { useEffect, useRef, useState } from "react"
import PromptList from "./PromptListComponent"
import PromptResponse from "./PromptResponseComponent"

export const builtInPrompts =[
    {
        'name': "Prompt 1",
        'description': 'Description1',
        'system_message': "SystemMessage",
        'asis_message': 'Assistante',
        'user_message': 'User'

    },
    {
        'name': "Prompt 2",
        'description': 'Description2',
        'system_message': "SystemMessage",
        'asis_message': 'Assistante',
        'user_message': 'User'
    },
    {
        'name': "Prompt 2",
        'description': 'Description2',
        'system_message': "SystemMessage",
        'asis_message': 'Assistante',
        'user_message': 'User'
    },
]

function Prompt({temperatureValue}){
    const [isHidden, setIsHidden] = useState(0)
    const [response, setResponse] = useState('')

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [systemPrompt, setSystemPrompt] = useState("")
    const [assistantPrompt, setAssistantPrompt] = useState("")
    const [userPrompt, setUserPrompt] = useState("")
    const [includeText, setIncludeText] = useState(false)


    const prompts = useRef([])

    return(
        <div className="flex flex-col overflow-x-auto mx-3">
            <PromptList 
            isHidden={isHidden} 
            setIsHidden={setIsHidden} 
            builtInPrompts={builtInPrompts}
            prompts={prompts}
            setResponse={setResponse}
            setName={setName}
            setDescription={setDescription}
            setSystemPrompt={setSystemPrompt}
            setAssistantPrompt={setAssistantPrompt}
            setUserPrompt={setUserPrompt}
            setIncludeText={setIncludeText}
            temperatureValue={temperatureValue}
            />
            <PromptResponse isHidden={isHidden} setIsHidden={setIsHidden} response={response} />
            <PromptBuilder 
            isHidden={isHidden} 
            setIsHidden={setIsHidden} 
            prompts={prompts}
            name ={name}
            setName ={setName}
            description={description}
            setDescription={setDescription}
            systemPrompt={systemPrompt}
            setSystemPrompt={setSystemPrompt}
            assistantPrompt={assistantPrompt}
            setAssistantPrompt={setAssistantPrompt}
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
            includeText={includeText}
            setIncludeText={setIncludeText}
            />
        </div>
    )
}

export default Prompt