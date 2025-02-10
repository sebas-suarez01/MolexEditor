import SummarizeIcon from '@mui/icons-material/Summarize';
import LabelIcon from '@mui/icons-material/Label';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { $getSelection, $isRangeSelection, $isTextNode } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';

const URL_CHAT = 'http://127.0.0.1:8000'


function ContextMenu({
    positionX,
    positionY, 
    isToggled, 
    contextMenuRef, 
    setSelectedProject, 
    setTextToInput, 
    setTextToTopic,
    setTextToResult,
    resetContextMenu,
    canPaste,
    setCanPaste
}){
    const [editor] = useLexicalComposerContext();

    const [textTopicSearch, setTextTopicSearch] = useState("")
    const [selectedText, setSelectedText] = useState("")

    const [topicFlag, setTopicFlag] = useState(false)
    const [extendFlag, setExtendFlag] = useState(false)
    const [summarizeFlag, setSummarizeFlag] = useState(false)



    const handleSummarize = () => {
        editor.read(()=>{
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const textNodes = selection.getNodes();
                let tempText = ''
                textNodes.forEach((node) => {
                    if ($isTextNode(node)) {
                        const text = node.getTextContent();
                        tempText = tempText + text
                    }
                });
                setTextToInput(tempText)
                setSelectedText(tempText)
                setSummarizeFlag(true)
            }
        })
        setSelectedProject('summextend')
        resetContextMenu()
    }
    const handleSearch = () => {
        editor.read(()=>{
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const textNodes = selection.getNodes();
                let tempText = ''
                textNodes.forEach((node) => {
                    if ($isTextNode(node)) {
                        const text = node.getTextContent();
                        tempText = tempText + text
                    }
                });
                setTextTopicSearch(tempText)
                setTopicFlag(true)
            }
        })
        setSelectedProject('search-citations')
        resetContextMenu()

    }
    const handleExtend = () =>{
        editor.read(()=>{
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const textNodes = selection.getNodes();
                let tempText = ''
                textNodes.forEach((node) => {
                    if ($isTextNode(node)) {
                        const text = node.getTextContent();
                        tempText = tempText + text
                    }
                });
                setSelectedText(tempText)
                setTextToInput(tempText)
                setExtendFlag(true)
            }
        })
        setSelectedProject('summextend')
        resetContextMenu()
    }
    const handleCopy = () =>{
        editor.read(async ()=>{
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const textNodes = selection.getNodes();
                let tempText = ''
                textNodes.forEach((node) => {
                    if ($isTextNode(node)) {
                        const text = node.getTextContent();
                        tempText = tempText + text
                    }
                });
                await navigator.clipboard.writeText(tempText);
                setCanPaste(true)
            }
        })
        resetContextMenu()
    }
    const handlePaste = async () =>{
        const copiedClipboardText = await navigator.clipboard.readText()
        editor.update(()=>{
            const selection = $getSelection();
            selection.insertText(copiedClipboardText);
            setCanPaste(false)
        })

        resetContextMenu()
    }

    useEffect(()=>{
        async function fetchSummarize(){
            let summarized = await fetch(URL_CHAT + `/summarize`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedText)})
                    .then(response => response.json())
                    .then(data => data['response']);
            setTextToResult(summarized)
        }

        if(summarizeFlag){
            fetchSummarize()
        }
        setSummarizeFlag(false)
    }, [selectedText])

    useEffect(()=>{
        async function fetchExtend(){
            let extended = await fetch(URL_CHAT + `/extend`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedText)})
                    .then(response => response.json())
                    .then(data => data['response']);
            
            setTextToResult(extended)
        }

        if(extendFlag){
            fetchExtend()
        }
        setExtendFlag(false)
    }, [selectedText])


    useEffect(()=>{
        async function fetchTopicSearch(){
            let topic = await fetch(URL_CHAT + `/topic`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(textTopicSearch)})
                    .then(response => response.json())
                    .then(data => data['response']);
            setTextToTopic(topic)
            console.log(topic)
        }

        if(topicFlag){
            fetchTopicSearch()
        }
        setTopicFlag(false)
    }, [textTopicSearch])

    


    return(
        <menu style={{
            top: positionY + 2 + 'px',
            left: positionX + 2 + 'px'

        }}
        className={`context-menu ${isToggled ? "active" : ""}`}
        ref={contextMenuRef}>
            <button
            onClick={handleSummarize}
            key={0}
            className="context-menu-button">
                <span>Summarize Text</span>
                <SummarizeIcon />
            </button>
            <button
            onClick={handleSearch}
            key={1}
            className="context-menu-button">
                <span>Search Related</span>
                <FormatQuoteIcon />
            </button>
            <button
            onClick={handleExtend}
            key={2}
            className="context-menu-button">
                <span>Extend Text</span>
                <LabelIcon />
            </button>
            <button
            onClick={handleCopy}
            key={3}
            className="context-menu-button">
                <span>Copy</span>
                <ContentCopyIcon />
            </button>
            {canPaste && <button
            onClick={handlePaste}
            key={4}
            className="context-menu-button">
                <span>Paste</span>
                <ContentPasteIcon />
            </button>}
        </menu>
    )
}
export default ContextMenu