import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import { $createParagraphNode, $createTextNode, $getRoot, $isParagraphNode } from 'lexical';
import { $createListNode, $createListItemNode } from "@lexical/list";
import { generateScientificPaperReference } from '../editor/utils';
import { $createHeadingNode } from '@lexical/rich-text';

const URL_CHAT = 'http://127.0.0.1:8000'


export default function Bibliography({bibliography, setBibliography, editor}){
    const handleClick = async (index)=>{
        const bibUpdated = [...bibliography]
        const indexItem = bibUpdated.indexOf(bibliography[index]);

        if (indexItem !== -1) {
            bibUpdated.splice(indexItem, 1);  // Removes the item at the found index
        }

        let data = await fetch(URL_CHAT + `/paper/remove/${bibliography[index].id}`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
                  .then(response => response.json())
                  .then(data => data['response']);

        setBibliography(bibUpdated)
    }

    const handleGenerate = () => {
        editor.update(() => {
            // Get the root node of the editor
            const root = $getRoot();

            const children = root.getChildren();

            // Find and remove existing "Bibliography" heading
            for (const child of children) {
                // Check if the node is a ParagraphNode
                if ($isParagraphNode(child)) {
                  const paragraphChildren = child.getChildren();
        
                  // Check if the paragraph contains an h2 heading with "Bibliography"
                  for (const node of paragraphChildren) {
                    if (node.getTag() === "h2" && node.getTextContent() === "Bibliography") {
                      // Remove the existing paragraph node
                      child.remove();
                      break;
                    }
                  }
                }
              }

            const paragraphNode = $createParagraphNode();

            const bibliography_node = $createHeadingNode("h2")
            const textNode = $createTextNode("Bibliography");
            bibliography_node.append(textNode)
            paragraphNode.append(bibliography_node)
            // Create an unordered list node
            const unorderedListNode = $createListNode("bullet");
            
            // Create list items and append them to the unordered list
            for (const element of bibliography) {
                const listItem = $createListItemNode();

                const reference = generateScientificPaperReference(element.authors_names, element.published_date.slice(0, 4), element.title, element.link, element.journal) 
                listItem.append($createTextNode(reference));
                unorderedListNode.append(listItem);
            }
      
            // Append the unordered list to the root
            paragraphNode.append(unorderedListNode);

            root.append(paragraphNode)
        });
    }

    return(
        <div className='flex flex-col mt-5 gap-5 overflow-x-hidden mx-3'>
            <h1>Bibliography</h1>
            <div className="flex flex-col h-128 gap-1 overflow-y-auto">
                {bibliography.map((i, index)=>(
                    <div key={index} className="flex items-center w-full p-4 text-black bg-white rounded-lg shadow dark:text-black dark:bg-gray-300 dark:hover:bg-gray-400">
                        <div>
                        <button type="button" onClick={()=>handleClick(index)} className="h-full w-8 bg-white text-white hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center dark:hover:text-white dark:bg-gray-500 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close">
                            <span className="sr-only">Close</span>
                            <CloseIcon />
                        </button>
                        </div>
                        <div>
                            <div className="ms-3 text-sm font-normal">{i.title}</div>
                            <p className="ms-3 text-xs">{i.published_date}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleGenerate} className="w-full h-12 justify-center text-black bg-white font-medium rounded-md text-lg flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400">
                Generar
            </button>
            
        </div>
    )
}