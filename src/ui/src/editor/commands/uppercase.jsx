import { useEffect } from "react";
import { createCommand, $getSelection, $isRangeSelection, COMMAND_PRIORITY_NORMAL, $isTextNode } from "lexical";

export const TOGGLE_UPPERCASE_COMMAND = createCommand();


function useUppercaseCommand(editor){
    useEffect(() => {
        const unregisterUppercase = editor.registerCommand(
          TOGGLE_UPPERCASE_COMMAND,
          () => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const textNodes = selection.getNodes();
                textNodes.forEach((node) => {
                    if ($isTextNode(node)) {
                        const text = node.getTextContent();
                        node.setTextContent(text.toUpperCase());
                    }
                });
              }
            });
            return true; // Indicate the command was handled
          },
          COMMAND_PRIORITY_NORMAL
        );
    
        return () => {
          unregisterUppercase(); // Cleanup on unmount
        };
    }, [editor]);

    return null
}

export default useUppercaseCommand