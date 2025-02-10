import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { PageBreakNode } from "./nodes/PageBrakeNode";
import PageBreakPlugin from "./plugins/PageBrakePlugin";
import DeleteNodePlugin from "./plugins/DeleteNodePlugin";
import CustomCommandsPlugin from "./plugins/CustomCommandsPlugin";
import { EquationNode } from "./nodes/EquationNode";
import EquationsPlugin from "./plugins/EquationPlugin";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "./components/ContextMenu";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";


function Placeholder() {
  return <div className="editor-placeholder">Enter some text...</div>;
}

const editorConfig = {
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    PageBreakNode,
    EquationNode
  ]
};

const EditorWithRef = ({setEditor}) => {
  const [editor] = useLexicalComposerContext();
  const editorRef = useRef(null);

  useEffect(() => {
    // Link the editor instance to the ref
    editorRef.current = editor;

    setEditor(editor)

    // Cleanup on unmount
    return () => {
      editorRef.current = null;
    };
  }, [editor]);

  return <div></div>;
};


export default function Editor({setSelectedProject, setTextToInput, setTextToTopic, setTextToResult, setEditor, canPaste, setCanPaste}) {
  const contextMenuRef = useRef(null) 
  const [contextMenu, setContextMenu] = useState({
    position:{
      x:0,
      y:0
    },
    toggled: false
  })

  function handleOnContextMenu(e){
    e.preventDefault()
  
    const contextMenuAtt = contextMenuRef.current.getBoundingClientRect()

    const isLeft = e.clientX < window?.innerWidth/2

    let x
    let y = e.clientY

    if(isLeft){
      x = e.clientX
    }
    else{
      x=e.clientX - contextMenuAtt.width
    }

    setContextMenu({
      position:{
        x,
        y
      }, 
      toggled: true
    })
  }

  function resetContextMenu(){
    setContextMenu({
      position:{
        x:0,
        y:0
      }, 
      toggled: false
    })
  }

  useEffect(()=>{
    function handler(e){
      if(contextMenuRef.current){
        if(!contextMenuRef.current.contains(e.target)){
          resetContextMenu()
        }
      }
    }

    document.addEventListener('click', handler)
    
    return ()=>{
      document.removeEventListener('click', handler)
    }
  })


  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <EditorWithRef setEditor={setEditor} />
        <ToolbarPlugin />
        <div onContextMenu={handleOnContextMenu} className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <PageBreakPlugin />
          <DeleteNodePlugin />
          <EquationsPlugin />
          <CustomCommandsPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />

          <ContextMenu
          contextMenuRef={contextMenuRef}
          positionX={contextMenu.position.x} 
          positionY={contextMenu.position.y} 
          isToggled={contextMenu.toggled}
          setSelectedProject={setSelectedProject}
          setTextToResult={setTextToResult}
          setTextToInput={setTextToInput}
          setTextToTopic={setTextToTopic}
          resetContextMenu={resetContextMenu}
          canPaste={canPaste}
          setCanPaste={setCanPaste}/>
        </div>
      </div>
    </LexicalComposer>
  );
}
