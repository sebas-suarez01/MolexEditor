import { Button } from "@mui/material"
import { $getRoot, $isParagraphNode, $isTextNode } from "lexical";
import { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const URL_CHAT = 'http://127.0.0.1:8000'

const check_options = [
    {
        name: "Gramatica",
        task: "Corregir errores de ortografia y gramatica"
    },
    {
        name: "Brevedad",
        task: "Omitir palabras innecesarias"
    },
    {
        name: "Cliches",
        task: "Reemplace frases sobreutilizadas"
    },
    {
        name: "Legibilidad",
        task: "Simplificar oraciones complicadas"
    },
    {
        name: "Citacion",
        task: "Identificar afirmaciones que necesitan evidencia"
    },
    {
        name: "Repeticion",
        task: "Eliminar palabras repetidas"
    },
]

function Check({editor, temperatureValue}){
    
    const [selectedValues, setSelectedValues] = useState([])
    const [text, setText] = useState('')
    const [isResult, setIsResult] = useState(false)
    const [result, setResult] = useState('')


    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        
        setSelectedValues((prevValues) => {
          if (checked) {
            // Add the value to the array if checked
            return [...prevValues, value];
          } else {
            // Remove the value from the array if unchecked
            return prevValues.filter((val) => val !== value);
          }
        });
    };

    const handleClick = async (e)=>{
        e.preventDefault()

        const getTextFromEditor = () => {
            editor.read(() => {
                const editorState = editor.getEditorState();
                const plainText = editorState.read(() => {  
                    let textContent = "";
                    editorState.read(() => {
                        const root = $getRoot();
                        const children = root.getChildren()
                        console.log(children)
                        children.forEach((node) => {
                            if ($isParagraphNode(node)) {
                                textContent += node.getTextContent();
                                textContent += '\n'
                            }
                        });
                    });
                    return textContent;
                });
                setText(plainText)
            });
        };

        getTextFromEditor()

        let data = await fetch(URL_CHAT + '/check',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "text": text,
                "actions": selectedValues,
                "temperature": temperatureValue.current
            })})
                  .then(response => response.json())
                  .then(data => data['response']);
        
        setResult(data)
        setIsResult(true)
        
    }

    console.log(selectedValues)

    if(!isResult){
        return (
            <div className="p-5 overflow-hidden">
                <div className="pt-5 pb-28">
                    {check_options.map(i=>
                        <div className="flex pt-5 pb-5 pl-10 items-center" key={i.name}>
                            <div className="flex h-5">
                                <input type="checkbox" value={i.task} onChange={handleCheckboxChange} checked={selectedValues.includes(i.task)} className="w-5 h-5 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div className="ms-2 text-sm">
                                <label htmlFor={i.name} className="font-medium text-gray-900 text-lg">{i.name}</label>
                                <p id={i.name} className="text-xs font-normal text-gray-500">{i.task}</p>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={handleClick} className="w-full h-12 justify-center text-black bg-white font-medium rounded-md text-lg flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400">
                    Ejecutar
                </button>
            </div>
        )
    }
    else{
        return(
            <>
                <Button variant="outlined" onClick={()=> setIsResult(false)}>
                    <ArrowBackIcon/>
                </Button>

                {result}
            </>
        )
    }
}

export default Check