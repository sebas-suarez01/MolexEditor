import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getNodeByKey,
  $isElementNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isParentElementRTL,
  $wrapNodes,
  $isAtNodeEnd,
  $patchStyleText
} from "@lexical/selection";
import { $findMatchingParent, $getNearestNodeOfType, $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from "@lexical/list";
import { createPortal } from "react-dom";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode
} from "@lexical/rich-text";
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages
} from "@lexical/code";
import { INSERT_PAGE_BREAK } from "./PageBrakePlugin";
import { TOGGLE_UPPERCASE_COMMAND } from "../commands/uppercase";
import { TOGGLE_LOWERCASE_COMMAND } from "../commands/lowercase";
import { InsertEquationDialog } from "./EquationPlugin";
import useModal from "../hooks/useModal";
import { clearFormatting } from "../utils";
import { CAPITALIZE_COMMAND } from "../commands/capitalize";

const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol"
]);

const supportedBlockTypes2 = new Set([
  "left",
  "right",
  "center",
  "justify",
  "start",
  "end"
]);
const supportedBlockTypes3 = new Set([
  "lowercase",
  "uppercase",
  "capitalize",
  "strikethrough",
  "subscript",
  "superscript",
  "clear",
  "Aa"

]);

const supportedBlockTypes4 = new Set([
  "page-break",
  "equation",
  "Insert"
]);

const supportedBlockTypesFont = new Set([
  "arial",
  "courier",
  "georgia",
  "times",
  "trebuchent",
  "verdana"
]);

const FONT_FAMILY_OPTIONS = [
  ['arial', 'Arial'],
  ['courier', 'Courier New'],
  ['georgia', 'Georgia'],
  ['times', 'Times New Roman'],
  ['trebuchent', 'Trebuchet MS'],
  ['verdana', 'Verdana'],
];

const FONT_SIZE_OPTIONS = [
  ['10px', '10px'],
  ['11px', '11px'],
  ['12px', '12px'],
  ['13px', '13px'],
  ['14px', '14px'],
  ['15px', '15px'],
  ['16px', '16px'],
  ['17px', '17px'],
  ['18px', '18px'],
  ['19px', '19px'],
  ['20px', '20px'],
];

const blockTypeToBlockName = {
  code: "Code Block",
  h1: "Section",
  h2: "Subsection",
  h3: "SubSubSection",
  h4: "Heading",
  h5: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List"
};

const blockTypeToBlockName2 = {
  left: "Left Align",
  right: "Right Align",
  center: "Center Align",
  justify: "Justify Align",
  start: "Start Align",
  end: "End Align",

};

const blockTypeToBlockNameFont = {
  arial: "Arial",
  courier: "Courier",
  georgia: "Georgia",
  times: "TNR",
  trebuchent: "Trebuchet",
  verdana: "Verdana",

};

function Divider() {
  return <div className="divider" />;
}

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Select({ onChange, className, options, value }) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
}) {
  const dropDownRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false)
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"));
        }
      });
    }
    setShowBlockOptionsDropDown(false)
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"));
        }
      });
    }
    setShowBlockOptionsDropDown(false)
  };
  const formatSmallSmallHeading = () => {
    if (blockType !== "h3") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h3"));
        }
      });
    }
    setShowBlockOptionsDropDown(false)
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false)
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false)
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false)
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false)
  };

  return (
    <div className="dropdown" ref={dropDownRef}>
      <button className="item" onClick={formatParagraph}>
        <span className="icon paragraph" />
        <span className="text">Normal</span>
        {blockType === "paragraph" && <span className="active" />}
      </button>
      <button className="item" onClick={formatLargeHeading}>
        <span className="icon large-heading" />
        <span className="text">Section</span>
        {blockType === "h1" && <span className="active" />}
      </button>
      <button className="item" onClick={formatSmallHeading}>
        <span className="icon small-heading" />
        <span className="text">Subsection</span>
        {blockType === "h2" && <span className="active" />}
      </button>
      <button className="item" onClick={formatSmallSmallHeading}>
        <span className="icon smallsmall-heading" />
        <span className="text">Subsubsection</span>
        {blockType === "h3" && <span className="active" />}
      </button>
      <button className="item" onClick={formatBulletList}>
        <span className="icon bullet-list" />
        <span className="text">Bullet List</span>
        {blockType === "ul" && <span className="active" />}
      </button>
      <button className="item" onClick={formatNumberedList}>
        <span className="icon numbered-list" />
        <span className="text">Numbered List</span>
        {blockType === "ol" && <span className="active" />}
      </button>
      <button className="item" onClick={formatQuote}>
        <span className="icon quote" />
        <span className="text">Quote</span>
        {blockType === "quote" && <span className="active" />}
      </button>
      <button className="item" onClick={formatCode}>
        <span className="icon code" />
        <span className="text">Code Block</span>
        {blockType === "code" && <span className="active" />}
      </button>
    </div>
  );
}
function BlockOptionsDropdownList2({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,

}) {
  const dropDownRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left + 430}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false)
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);
  

  const leftAlign = ()=>{
    if (blockType !== "left") {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
    }
    setShowBlockOptionsDropDown(false)
  }
  const rightAlign = ()=>{
    if (blockType !== "right") {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
    }
    setShowBlockOptionsDropDown(false)
  }
  const centerAlign = ()=>{
    if (blockType !== "center") {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
    }
    setShowBlockOptionsDropDown(false)
  }
  const justifyAlign = ()=>{
    if (blockType !== "justify") {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
    }
    setShowBlockOptionsDropDown(false)
  }
  const startAlign = ()=>{
    if (blockType !== "start") {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "start");
    }
    setShowBlockOptionsDropDown(false)
  }
  const endAlign = ()=>{
    if (blockType !== "end") {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "end");
    }
    setShowBlockOptionsDropDown(false)
  }

  return (
    <div className="dropdown-format" ref={dropDownRef}>
      <button className="item" onClick={leftAlign}>
        <span className="icon left-align" />
        <span className="text">Left Align</span>
        {blockType === "left" && <span className="active" />}
      </button>
      <button className="item" onClick={rightAlign}>
        <span className="icon right-align" />
        <span className="text">Right Align</span>
        {blockType === "right" && <span className="active" />}
      </button>
      <button className="item" onClick={centerAlign}>
        <span className="icon center-align" />
        <span className="text">Center Align</span>
        {blockType === "center" && <span className="active" />}
      </button>
      <button className="item" onClick={justifyAlign}>
        <span className="icon justify-align" />
        <span className="text">Justify Align</span>
        {blockType === "justify" && <span className="active" />}
      </button>
      <button className="item" onClick={startAlign}>
        <span className="icon start-align" />
        <span className="text">Start Align</span>
        {blockType === "start" && <span className="active" />}
      </button>
      <button className="item" onClick={endAlign}>
        <span className="icon end-align" />
        <span className="text">End Align</span>
        {blockType === "end" && <span className="active" />}
      </button>
    </div>
  );
}
function BlockOptionsDropdownList3({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,

}) {
  const dropDownRef = useRef(null);
  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left + 500}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false)
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);
  

  const lowercase = ()=>{
    if (blockType !== "lowercase") {
      editor.dispatchCommand(TOGGLE_LOWERCASE_COMMAND);
    }
    setShowBlockOptionsDropDown(false)
  }
  const uppercase = ()=>{
    if (blockType !== "uppercase") {
      editor.dispatchCommand(TOGGLE_UPPERCASE_COMMAND);
    }
    setShowBlockOptionsDropDown(false)
  }
  const capitalize = ()=>{
    if (blockType !== "capitalize") {
      editor.dispatchCommand(CAPITALIZE_COMMAND);
    }
    setShowBlockOptionsDropDown(false)
  }
  const strikethrough = ()=>{
    if (blockType !== "strikethrough") {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
    }
    setShowBlockOptionsDropDown(false)
  }
  const subscript = ()=>{
    if (blockType !== "subscript") {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
    }
    setShowBlockOptionsDropDown(false)
  }
  const superscript = ()=>{
    if (blockType !== "superscript") {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
    }
    setShowBlockOptionsDropDown(false)
  }

  const clear = ()=>{
    if (blockType !== "clear") {
      clearFormatting(editor)
    }
    setShowBlockOptionsDropDown(false)
  }

  return (
    <div className="dropdown-format" ref={dropDownRef}>
      <button className="item" onClick={lowercase}>
        <span className="icon lowercase" />
        <span className="text">Lowercase</span>
        {blockType === "lowercase" && <span className="active" />}
      </button>
      <button className="item" onClick={uppercase}>
        <span className="icon uppercase" />
        <span className="text">Uppercase</span>
        {blockType === "uppercase" && <span className="active" />}
      </button>
      <button className="item" onClick={capitalize}>
        <span className="icon capitalize" />
        <span className="text">Capitalize</span>
        {blockType === "capitalize" && <span className="active" />}
      </button>
      <button className="item" onClick={strikethrough}>
        <span className="icon strikethrough" />
        <span className="text">Strikethrough</span>
        {blockType === "strikethrough" && <span className="active" />}
      </button>
      <button className="item" onClick={subscript}>
        <span className="icon subscript" />
        <span className="text">Subscript</span>
        {blockType === "subscript" && <span className="active" />}
      </button>
      <button className="item" onClick={superscript}>
        <span className="icon superscript" />
        <span className="text">Superscript</span>
        {blockType === "superscript" && <span className="active" />}
      </button>
      <button className="item" onClick={clear}>
        <span className="icon clear" />
        <span className="text">Clear Formatting</span>
        {blockType === "clear" && <span className="active" />}
      </button>
    </div>
  );
}
function BlockOptionsDropdownList4({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
  showModal
}) {
  
  const dropDownRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left+600}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false)
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);
  

  const pagebreak = ()=>{
    if (blockType !== "page-break") {
      editor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
    }
    setShowBlockOptionsDropDown(false)
  }
  const equation = ()=>{
    if (blockType !== "equation") {
      showModal('Insert Equation', (onClose) => (
        <InsertEquationDialog onClose={onClose} />
      ));
    }
    setShowBlockOptionsDropDown(false)
  }

  return (
    <div className="dropdown-format" ref={dropDownRef}>
      <button className="item" onClick={pagebreak}>
        <span className="icon page" />
        <span className="text">Page Breaker</span>
        {blockType === "page-break" && <span className="active" />}
      </button>
      <button className="item" onClick={equation}>
        <span className="icon equation" />
        <span className="text">Equation</span>
        {blockType === "equation" && <span className="active" />}
      </button>
    </div>
  );
}
function BlockOptionsDropdownListFont({
  editor,
  fontState,
  blockType,
  setFontState,
  toolbarRef,
  setShowBlockOptionsDropDown,
  style
}) {
  const dropDownRef = useRef(null);
  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left + 220}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false)
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);
  
  const handleClick = useCallback(
    (option, text) => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {[style]: text,});
          console.log(option)
          setFontState(option)
        }
      });
    },
    [editor, style]);

  const buttonAriaLabel =
    style === 'font-family'
      ? 'Formatting options for font family'
      : 'Formatting options for font size';

  return (
    <div className="dropdown-format" ref={dropDownRef}>
      {(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
        ([option, text]) => (
          <button
          className={`item ${style === 'font-size' ? 'fontsize-item' : ''}`}
          aria-label={buttonAriaLabel}
          onClick={() => handleClick(option, text)}
          key={option}>
              <span className="text">{text}</span>
              {blockType===option && <span className="active" />}
          </button>
        ),
      )}
    </div>
  );
}

export default function ToolbarPlugin() {
  const [modal, showModal] = useModal();
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [blockType2, setBlockType2] = useState("left");
  const [blockType3, setBlockType3] = useState("Aa");
  const [blockType4, setBlockType4] = useState("Insert");
  const [fontState, setFontState] = useState("arial");


  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(
    false
  );
  const [showBlockOptionsDropDown2, setShowBlockOptionsDropDown2] = useState(
    false
  );
  const [showBlockOptionsDropDown3, setShowBlockOptionsDropDown3] = useState(
    false
  );
  const [showBlockOptionsDropDown4, setShowBlockOptionsDropDown4] = useState(
    false
  );
  const [showBlockOptionsDropDownFont, setShowBlockOptionsDropDownFont] = useState(
    false
  );

  const [codeLanguage, setCodeLanguage] = useState("");
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

        // If node is a link, we need to fetch the parent paragraph node to set format
      let matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );

      const nodeFormat = $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType()
      setBlockType2((nodeFormat || "left"))
    }
  }, [editor]);
  
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      ),
    );
  }, [editor, updateToolbar]);

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  
  const onCodeLanguageSelect = useCallback(
    (e) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      {supportedBlockTypes.has(blockType) && (
        <>
          <button
            className="toolbar-item block-controls"
            onClick={() =>{
                setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
                if(showBlockOptionsDropDown2){
                  setShowBlockOptionsDropDown2(!showBlockOptionsDropDown2)
                }

                if(showBlockOptionsDropDown3){
                  setShowBlockOptionsDropDown3(!showBlockOptionsDropDown3)
                }
                if(showBlockOptionsDropDown4){
                  setShowBlockOptionsDropDown4(!showBlockOptionsDropDown4)
                }
                if(showBlockOptionsDropDownFont){
                  setShowBlockOptionsDropDownFont(!showBlockOptionsDropDownFont)
                }
              }
            }
            aria-label="Formatting Options"
          >
            <span className={"icon block-type " + blockType} />
            <span className="text">{blockTypeToBlockName[blockType]}</span>
            <i className="chevron-down" />
          </button>
          {showBlockOptionsDropDown &&
            createPortal(
              <BlockOptionsDropdownList
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
                setShowBlockOptionsDropDown2={setShowBlockOptionsDropDown2}

              />,
              document.body
            )}
          <Divider />
        </>
      )}
      {supportedBlockTypesFont.has(fontState) && (
        <>
          <button
            className="toolbar-item block-controls"
            onClick={() =>{
                setShowBlockOptionsDropDownFont(!showBlockOptionsDropDownFont)
                if(showBlockOptionsDropDown){
                  setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
                }
                if(showBlockOptionsDropDown2){
                  setShowBlockOptionsDropDown2(!showBlockOptionsDropDown2)
                }
                if(showBlockOptionsDropDown3){
                  setShowBlockOptionsDropDown3(!showBlockOptionsDropDown3)
                }
                if(showBlockOptionsDropDown4){
                  setShowBlockOptionsDropDown4(!showBlockOptionsDropDown4)
                }
              }
            }
            aria-label="Formatting Font"
          >
            <span className="text-sm text-gray pr-2">{blockTypeToBlockNameFont[fontState]}</span>
            <i className="chevron-down" />
          </button>
          {showBlockOptionsDropDownFont &&
            createPortal(
              <BlockOptionsDropdownListFont
                editor={editor}
                fontState={blockTypeToBlockNameFont[fontState]}
                blockType={fontState}
                setFontState={setFontState}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDownFont}
                style={'font-family'}
              />,
              document.body
            )}
          <Divider />
        </>
      )}

      {blockType === "code" ? (
        <>
          <Select
            className="toolbar-item code-language"
            onChange={onCodeLanguageSelect}
            options={codeLanguges}
            value={codeLanguage}
          />
          <i className="chevron-down inside" />
        </>
      ) : (
        <>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={"toolbar-item spaced " + (isBold ? "active" : "")}
            aria-label="Format Bold"
          >
            <i className="format bold" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={"toolbar-item spaced " + (isItalic ? "active" : "")}
            aria-label="Format Italics"
          >
            <i className="format italic" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
            aria-label="Format Underline"
          >
            <i className="format underline" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
            className={"toolbar-item spaced " + (isCode ? "active" : "")}
            aria-label="Insert Code"
          >
            <i className="format code" />
          </button>
          <button
            onClick={insertLink}
            className={"toolbar-item spaced " + (isLink ? "active" : "")}
            aria-label="Insert Link"
          >
            <i className="format link" />
          </button>
          {isLink &&
            createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
          <Divider />
        </>
      )}
      {supportedBlockTypes2.has(blockType2) && (
        <>
          <button
            className="toolbar-item block-controls"
            onClick={() =>{
                setShowBlockOptionsDropDown2(!showBlockOptionsDropDown2)
                if(showBlockOptionsDropDown){
                  setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
                }
                if(showBlockOptionsDropDown3){
                  setShowBlockOptionsDropDown3(!showBlockOptionsDropDown3)
                }
                if(showBlockOptionsDropDown4){
                  setShowBlockOptionsDropDown4(!showBlockOptionsDropDown4)
                }
                if(showBlockOptionsDropDownFont){
                  setShowBlockOptionsDropDownFont(!showBlockOptionsDropDownFont)
                }
              }
            }
            aria-label="Formatting Directions"
          >
            <span className={"icon " + blockType2 + "-align"} />
            <span className="text">{blockTypeToBlockName2[blockType2]}</span>
            <i className="chevron-down" />
          </button>
          {showBlockOptionsDropDown2 &&
            createPortal(
              <BlockOptionsDropdownList2
                editor={editor}
                blockType={blockType2}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown2}

              />,
              document.body
            )}
          <Divider />
        </>
      )}
      {supportedBlockTypes3.has(blockType3) && (
        <>
          <button
            className="toolbar-item block-controls"
            onClick={() =>{
                setShowBlockOptionsDropDown3(!showBlockOptionsDropDown3)
                if(showBlockOptionsDropDown){
                  setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
                }
                if(showBlockOptionsDropDown2){
                  setShowBlockOptionsDropDown2(!showBlockOptionsDropDown2)
                }
                if(showBlockOptionsDropDown4){
                  setShowBlockOptionsDropDown4(!showBlockOptionsDropDown4)
                }
                if(showBlockOptionsDropDownFont){
                  setShowBlockOptionsDropDownFont(!showBlockOptionsDropDownFont)
                }
              }
            }
            aria-label="Formatting Actions"
          >
            <span className="text-sm text-gray pr-2">Aa</span>
            <i className="chevron-down" />
          </button>
          {showBlockOptionsDropDown3 &&
            createPortal(
              <BlockOptionsDropdownList3
                editor={editor}
                blockType={blockType3}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown3}

              />,
              document.body
            )}
          <Divider />
        </>
      )}
      {supportedBlockTypes4.has(blockType4) && (
        <>
          <button
            className="toolbar-item block-controls"
            onClick={() =>{
                setShowBlockOptionsDropDown4(!showBlockOptionsDropDown4)
                if(showBlockOptionsDropDown){
                  setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
                }
                if(showBlockOptionsDropDown2){
                  setShowBlockOptionsDropDown2(!showBlockOptionsDropDown2)
                }
                if(showBlockOptionsDropDown3){
                  setShowBlockOptionsDropDown3(!showBlockOptionsDropDown3)
                }
                if(showBlockOptionsDropDownFont){
                  setShowBlockOptionsDropDownFont(!showBlockOptionsDropDownFont)
                }
              }
            }
            aria-label="Insert Actions"
          >
            <span className="icon add" />
            <span className="text-sm text-gray pr-2">Insert</span>
            <i className="chevron-down" />
          </button>
          {showBlockOptionsDropDown4 &&
            createPortal(
              <BlockOptionsDropdownList4
                editor={editor}
                blockType={blockType4}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown4}
                showModal={showModal}
              />,
              document.body
            )}
          <Divider />
        </>
      )}
      {modal}
      
    </div>
    
    
  );
}