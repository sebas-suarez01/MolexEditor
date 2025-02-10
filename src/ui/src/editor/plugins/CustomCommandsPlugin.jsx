import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useUppercaseCommand from "../commands/uppercase";
import useLowercaseCommand from "../commands/lowercase";
import useInOutdentCommand from "../commands/inoutdent";
import useCapitalizeCommand from "../commands/capitalize";


function CustomCommandsPlugin() {
    const [editor] = useLexicalComposerContext();

    useUppercaseCommand(editor)
    useLowercaseCommand(editor)
    useInOutdentCommand(editor)
    useCapitalizeCommand(editor)
}

export default CustomCommandsPlugin;
