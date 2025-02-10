import { useEffect, useState } from "react"

const URL_SUMMARIZE = 'http://127.0.0.1:8000'


const CopyToClipboard = ({text, setCanPaste}) => {
    const [textToCopy, setTextToCopy] = useState(text);
    const [copySuccess, setCopySuccess] = useState("Copy");
  
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopySuccess("Copied!");
        setCanPaste(true)
      } catch (err) {
        setCopySuccess("Failed to copy!");
      }
    };
  
    return (
      <div>
        <button onClick={handleCopy}>{copySuccess}</button>
      </div>
    );
};

export default function SumExtend({init_text, result_text, setCanPaste, temperatureValue}){
    const [text, setText] = useState(init_text)
    const [summarizeFlag, setSummarizeFlag] = useState(false)
    const [extendFlag, setExtendFlag] = useState(false)
    const [textResult, setTextResult] = useState(result_text)

    const handleSummarizationClick =()=>{
        setSummarizeFlag(true)
    }
    const handleExtendClick =()=>{
        setExtendFlag(true)
    }

    useEffect(() => {
        setText(init_text);
    }, [init_text]);

    useEffect(()=>{
        async function fetchExtend() {
            let extend_text = await fetch(URL_SUMMARIZE + `/extend`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "text": text,
                    "temperature": temperatureValue.current
                })})
                    .then(response => response.json())
                    .then(data => data['response']);
            setTextResult(extend_text)
        }

        if(extendFlag){
            fetchExtend()
        }
        setExtendFlag(false)
    }, [extendFlag])

    useEffect(()=>{
        async function fetchSummarize() {
            let summarized_text = await fetch(URL_SUMMARIZE + `/summarize`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "text":text,
                    "temperature": temperatureValue.current
                })})
                    .then(response => response.json())
                    .then(data => data['response']);
            setTextResult(summarized_text)
        }

        if(summarizeFlag){
           fetchSummarize()
        }
        setSummarizeFlag(false)
    }, [summarizeFlag])

    return(
        <div className="flex flex-col p-5 w-full h-full">
            <div className="flex flex-col h-1/2 w-full gap-1 bg-gray-100 overflow-y-auto">
                <textarea id="message" value={text} onChange={e => setText(e.target.value)} rows="4" className="block p-2.5 min-h-5/6 w-full min-h-full h-full text-sm text-black bg-gray-50 border-gray-300 focus:ring-blue-500 dark:bg-gray-100 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500" placeholder="Write your text here..."></textarea>
            </div>
            <div className="flex flex-col w-full gap-1 bg-gray-100 overflow-y-hidden">
            <div className="flex gap-1">
                <button onClick={handleSummarizationClick} className="w-1/2 bg-gray-700 text-white">Summarize</button>
                <button onClick={handleExtendClick} className="w-1/2 bg-gray-700 text-white">Extend</button>
            </div>
            </div>
            <div className="flex h-1/2 w-full bg-gray-100 overflow-y-auto border-2 text-sm border-gray-300">
                {textResult}
            </div>
            <div className="flex justify-center items-center h-5 w-20 bg-black text-white text-xs overflow-hidden">
                <CopyToClipboard text={text} setCanPaste={setCanPaste} />
            </div>
            
        </div>
    )
}