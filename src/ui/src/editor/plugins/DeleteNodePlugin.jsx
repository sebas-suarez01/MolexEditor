import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    DELETE_CHARACTER_COMMAND,
    COMMAND_PRIORITY_LOW,
    $getSelection,
    $isRangeSelection,
    $getNodeByKey,
  } from "lexical";
  
  import { useEffect } from "react";
  
  export default function DeleteNodePlugin() {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
      const removeNodeOnDelete = editor.registerCommand(
        DELETE_CHARACTER_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const { anchor } = selection;
            const node = $getNodeByKey(anchor.key);
  
            // Check if the node is your custom node (e.g., PageBreakNode)
          if (node && node.getType() === "pageBreak") {
            node.remove(); // Remove the node
            return true; // Prevent further propagation of the delete command
          }
            
          }
          return false; // Allow default behavior for other nodes
        },
        COMMAND_PRIORITY_LOW
      );
  
      return () => {
        removeNodeOnDelete(); // Cleanup on unmount
      };
    }, [editor]);
  }
  