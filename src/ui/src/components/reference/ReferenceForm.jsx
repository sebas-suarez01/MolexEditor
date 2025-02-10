import WebSite from "./WebSiteForm";
import Book from "./BookForm";
import Report from "./ReportForm";
import Article from "./ArticleForm";



export default function ReferenceForm({documentType, referenceStyle}){
    if(documentType === "Libro"){
        return(
            <Book referenceStyle={referenceStyle} />
        )
    }
    else if(documentType === "Articulo"){
        return(
            <Article referenceStyle={referenceStyle} />
        )
    }
    else if(documentType === "Sitio Web"){
        return(
            <WebSite referenceStyle={referenceStyle} />
        )
    }
    else if(documentType === "Informe"){
        return(
            <Report referenceStyle={referenceStyle}/>
        )
    }
}