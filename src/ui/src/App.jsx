import { useRef, useState } from 'react';
import Editor from './editor/Editor';
import SideBar from './editor/PermanentSideBar';
import ProjectNavigation from './editor/SideBarNavigation';

function App() {
  const [selectedProject, setSelectedProject] = useState("")
  const [textInput, setTextToInput]= useState('')
  const [textToResult, setTextToResult]= useState('')
  const [textToTopic, setTextToTopic] = useState('')
  const [editor, setEditor] = useState(null)
  const [canPaste, setCanPaste] = useState(false)
  const [bibliografy, setBibliography] = useState([])
  const temperatureValue = useRef(0)
  const [isHidden, setIsHidden] = useState(true)
  return (
    <>
    <div className='flex h-full'>
      <div className={`flex flex-col ${isHidden?"w-[95rem]":"w-[65rem]"} w-[65rem] h-screen bg-gray-200 items-center`}>
        <h1>Editor</h1>
        <Editor 
        setSelectedProject={setSelectedProject} 
        setTextToInput={setTextToInput}
        setTextToTopic={setTextToTopic}
        setTextToResult={setTextToResult}
        setEditor={setEditor}
        canPaste={canPaste}
        setCanPaste={setCanPaste}/>
      </div>
      
      <ProjectNavigation 
      selectedProject={selectedProject} 
      textInput={textInput} 
      textToTopic={textToTopic}
      textToResult={textToResult}
      editor={editor} 
      setBibliography={setBibliography}
      bibliography={bibliografy}
      setCanPaste={setCanPaste}
      temperatureValue={temperatureValue}
      isHidden={isHidden}
      />

      <SideBar 
      setSelectedProject={setSelectedProject}
      selectedProject={selectedProject} 
      isBibliographyShowed={bibliografy.length != 0} 
      isHidden={isHidden} 
      setIsHidden={setIsHidden}/>
    </div>
    </>
  );
}

export default App;