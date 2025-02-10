import { useEffect } from "react";
import { createCommand, $getSelection, $isRangeSelection, COMMAND_PRIORITY_NORMAL, $isTextNode } from "lexical";

export const TOGGLE_LOWERCASE_COMMAND = createCommand();


function useLowercaseCommand(editor){
    useEffect(() => {
        const unregisterLowercase = editor.registerCommand(
            TOGGLE_LOWERCASE_COMMAND,
          () => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const textNodes = selection.getNodes();
                textNodes.forEach((node) => {
                    if ($isTextNode(node)) {
                        const text = node.getTextContent();
                        node.setTextContent(text.toLowerCase());
                    }
                });
              }
            });
            return true; // Indicate the command was handled
          },
          COMMAND_PRIORITY_NORMAL
        );
    
        return () => {
          unregisterLowercase(); // Cleanup on unmount
        };
      }, [editor]);

    return null
}

export default useLowercaseCommand