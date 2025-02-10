const SideBarItems = ({item, setSelectedProject, index, isHidden, setIsHidden, selectedProject}) =>{
    const handleClick = (text) => {

        
        if(selectedProject === text){
            setSelectedProject("")
            setIsHidden(!isHidden)
        }
        else if(selectedProject === ""){
            setSelectedProject(text)
            setIsHidden(!isHidden)
        }
        else{
            setSelectedProject(text)
        }
    }
    return(
        <>
            {item.show && 
            <button className={`${selectedProject==item.text?"bg-gray-400":""} h-10`} onClick={()=>handleClick(item.text)} key={index}>
                <item.icon />
            </button>
            }
        </>
    )
}

export default SideBarItems