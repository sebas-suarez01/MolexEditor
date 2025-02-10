import { $createTextNode, $getSelection, $isRangeSelection, COMMAND_PRIORITY_HIGH } from "lexical";
import { useEffect } from "react";

export const CAPITALIZE_COMMAND = 'CAPITALIZE_COMMAND';

function useCapitalizeCommand(editor) {

  useEffect(() => {
    return editor.registerCommand(
      CAPITALIZE_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
            nodes.forEach((node) => {
              if (node.getType() === 'text') {
                const textContent = node.getTextContent();
                const capitalizedContent = textContent.charAt(0).toUpperCase() + textContent.slice(1);
                node.replace($createTextNode(capitalizedContent));
              }
            });
          }
        });
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  return null;
}

export default useCapitalizeCommand;