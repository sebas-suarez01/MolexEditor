import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function PromptResponse({isHidden, setIsHidden, response}){
    
    const handleBack = ()=>{
        setIsHidden(0)
    }

    return(
        <div className={`overflow-y-hidden ${isHidden !== 2? "hidden": ""}`}>
            <button className="w-1/12" onClick={handleBack}>
                <ArrowBackIcon />
            </button>
            <div className='pt-5'>
                <p className='text-sm'>{response}</p>
            </div>
        </div>
    )
}

export default PromptResponse