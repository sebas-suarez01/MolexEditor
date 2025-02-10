import 'katex/dist/katex.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical';
import { useCallback, useEffect } from 'react';
import * as React from 'react';

import { $createEquationNode, EquationNode } from '../nodes/EquationNode';
import KatexEquationAlterer from '../ui/KatexEquationAlterer';

// CommandPayload type removed
const INSERT_EQUATION_COMMAND = createCommand('INSERT_EQUATION_COMMAND');

export function InsertEquationDialog({onClose }) {
  const [editor] = useLexicalComposerContext();

  const onEquationConfirm = useCallback(
    (equation, inline) => {
      editor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation, inline });
      onClose();
    },
    [editor, onClose]
  );
  return <KatexEquationAlterer onConfirm={onEquationConfirm} />;
}

export default function EquationsPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error(
        'EquationsPlugins: EquationsNode not registered on editor'
      );
    }
    return editor.registerCommand(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const { equation, inline } = payload;
        const equationNode = $createEquationNode(equation, inline);

        $insertNodes([equationNode]);
        if ($isRootOrShadowRoot(equationNode.getParentOrThrow())) {
          $wrapNodeInElement(equationNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
