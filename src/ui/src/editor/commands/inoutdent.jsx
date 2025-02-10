import {
  COMMAND_PRIORITY_EDITOR,
  INDENT_CONTENT_COMMAND,
  KEY_TAB_COMMAND,
  OUTDENT_CONTENT_COMMAND
} from 'lexical';
import {useEffect} from 'react';

export default function useInOutdentCommand(editor) {
    useEffect(() => {
        const inoutdent = editor.registerCommand(
            KEY_TAB_COMMAND,
            (payload) => {
                const event = payload;
                event.preventDefault();

                return editor.dispatchCommand(
                    event.shiftKey ? OUTDENT_CONTENT_COMMAND : INDENT_CONTENT_COMMAND,
                );
            },
            COMMAND_PRIORITY_EDITOR,
        );
      
        return () => {
            inoutdent(); // Cleanup on unmount
        };
    }, [editor]);
  
    return null
}