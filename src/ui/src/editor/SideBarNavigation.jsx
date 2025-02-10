
import Chatbot from "../chat/Chatbot"
import Bibliography from "../components/BibliographyComponent"
import Check from "../components/CheckComponent"
import Prompt from "../components/prompt/PromptComponent"
import Quote from "../components/quote/QuoteComponent"
import Reference from "../components/reference/ReferenceComponent"
import Save from "../components/save/SaveComponent"
import Settings from "../components/SettingsComponent"
import SumExtend from "../components/SumExtComponent"


  
  const ProjectNavigation = ({
    selectedProject, 
    textInput, 
    textToTopic, 
    textToResult, 
    editor, 
    setBibliography, 
    bibliography, 
    setCanPaste,
    temperatureValue,
    isHidden,
  }) => {
    

    return(
      <> 
        <div className={`flex flex-col ${isHidden?"hidden":"w-[30rem]"}  h-screen overflow-y-auto p-1 ${selectedProject === 'settings'? "":"hidden"}`}>
          <Settings temperatureValue={temperatureValue}/>
        </div>
        <div className={`flex flex-col ${isHidden?"hidden":"w-[30rem]"} h-screen overflow-y-auto p-1 ${selectedProject === 'ask-to'? "":"hidden"}`}>
          <Chatbot temperatureValue={temperatureValue}/>
        </div>
        <div className={`flex flex-col ${isHidden?"hidden":"w-[30rem]"} h-screen overflow-y-auto p-1 ${selectedProject === 'search-citations'? "":"hidden"}`}>
          <Quote textToTopic={textToTopic} editor={editor} setBibliography={setBibliography} bibliography={bibliography}/>
        </div>
        <div className={`flex flex-col ${isHidden?"hidden":"w-[30rem]"} h-screen overflow-y-auto p-1 ${selectedProject === 'prompts'? "":"hidden"}`}>
          <Prompt temperatureValue={temperatureValue} />
        </div>
        <div className={`flex flex-col ${isHidden?"hidden":"w-[30rem]"} h-screen overflow-y-auto p-1 ${selectedProject === 'check'? "":"hidden"}`}>
          <Check editor={editor} temperatureValue={temperatureValue} />
        </div>
        <div className={`flex flex-col ${isHidden?"hidden":"w-[30rem]"} h-screen overflow-y-auto p-1 ${selectedProject === 'summextend'? "":"hidden"}`}>
          <SumExtend init_text={textInput} result_text={textToResult} setCanPaste={setCanPaste} temperatureValue={temperatureValue}/>
        </div>
        <div className={`flex flex-col ${isHidden?"hidden":"w-[30rem]"} h-screen overflow-y-auto p-1 ${selectedProject === 'reference'? "":"hidden"}`}>
          <Reference />
        </div>
        <div className={`flex flex-col ${isHidden?"hidden":"w-[30rem]"} h-screen overflow-y-auto p-1 ${selectedProject === 'save'? "":"hidden"}`}>
          <Save editor={editor}/>
        </div>
        <div className={`flex flex-col ${isHidden?"hidden":"w-[30rem]"} h-screen overflow-y-auto p-1 ${selectedProject === 'bibliography'? "":"hidden"}`}>
          <Bibliography bibliography={bibliography} setBibliography={setBibliography} editor={editor} />
        </div>
      </>
    )
    
  }
  
  export default ProjectNavigation