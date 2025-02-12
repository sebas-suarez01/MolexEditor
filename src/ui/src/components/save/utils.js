import {CLEAR_HISTORY_COMMAND} from 'lexical'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';

export function editorStateFromSerializedDocument(editor, maybeStringifiedDocument) {
    const json =
      typeof maybeStringifiedDocument === 'string'
        ? JSON.parse(maybeStringifiedDocument)
        : maybeStringifiedDocument;
    return editor.parseEditorState(json.editorState);
  }



function readTextFileFromSystem(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.lexical, .md';
    input.multiple = true;

    input.addEventListener('change', (event) => {
      const target = event.target
      

      if (target.files) {
        const file = target.files[0];
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();

        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
  
        reader.onload = (readerEvent) => {
          if (readerEvent.target) {
            const content = readerEvent.target.result;
            callback(content, fileExtension);
          }
        };
      }
    });
    input.click();
  }

export function importFile(editor) {
    readTextFileFromSystem((text, extension) => {
      if(extension === 'md'){
        editor.update(()=>{
          $convertFromMarkdownString(text, TRANSFORMERS)

        })
      }
      else{
        editor.setEditorState(editorStateFromSerializedDocument(editor, text));
      }
      
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
    });
}

export function serializedDocumentFromEditorState(editorState, config = Object.freeze({})) {
    return {
      editorState: editorState.toJSON(),
      lastSaved: config.lastSaved || Date.now(),
      source: config.source || 'Lexical',
      version: '0.22.0',
    };
  }

function exportBlob(data, fileName) {
    const a = document.createElement('a');
    const body = document.body;
  
    if (body === null) {
      return;
    }
  
    body.appendChild(a);
    a.style.display = 'none';
    const json = JSON.stringify(data);
    const blob = new Blob([json], {
      type: 'octet/stream',
    });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

export function exportFile(editor, config = Object.freeze({})) {
    const now = new Date();
    const serializedDocument = serializedDocumentFromEditorState(
      editor.getEditorState(),
      {
        ...config,
        lastSaved: now.getTime(),
      },
    );
    const fileName = config.fileName || now.toISOString();
    exportBlob(serializedDocument, `${fileName}.lexical`);
  }