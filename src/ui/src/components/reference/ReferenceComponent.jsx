import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useState } from "react"
import ReferenceForm from "./ReferenceForm"

const documentTypes = [
    "Libro",
    "Articulo",
    "Sitio Web",
    "Informe"

]

const referenceStyles = [
    "APA 7ma Edicion",
    "MLA 9na Edicion",
    "Chicago",
    "Vancouver",
    "Harvard",
    "IEEE"
]

export default function Reference(){
    const[documentType, setDocumentType]= useState('')
    const [reference, setReference] = useState('APA 7ma Edicion')
    const handleChangeDocumentType = (e)=>{
        setDocumentType(e.target.value)
    }
    const handleChangeReferenceStyle = (e)=>{
        setReference(e.target.value)
    }
    return(
        <div className="flex flex-col p-5 space-y-10">
        <FormControl required fullWidth>
            <InputLabel id="simple-select-label-2">Document Type</InputLabel>
            <Select
            labelId="simple-select-label-2"
            id="simple-select-2"
            value={documentType}
            label="Document Type"
            onChange={handleChangeDocumentType}
            >
                {documentTypes.map((item, index)=>(
                    <MenuItem value={item} key={index}>{item}</MenuItem>
                ))}
            </Select>
        </FormControl>


        <FormControl required fullWidth>
            <InputLabel id="simple-select-label">Reference Style</InputLabel>
            <Select
            labelId="simple-select-label"
            id="simple-select"
            value={reference}
            label="Reference Style"
            onChange={handleChangeReferenceStyle}
            >
                {referenceStyles.map((item, index)=>(
                    <MenuItem value={item} key={index}>{item}</MenuItem>
                ))}
            </Select>
        </FormControl>

        <ReferenceForm documentType={documentType} referenceStyle={reference} />

        
        </div>
    )
}