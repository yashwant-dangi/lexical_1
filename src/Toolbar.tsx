/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { EditorStateExtension } from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useExtensionDependency } from "@lexical/react/useExtensionComponent";
import {
  useExtensionSignalValue,
  useSignalValue,
} from "@lexical/react/useExtensionSignalValue";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  type StateValueOrUpdater,
  $setState,
  $getRoot,
} from "lexical";
import { INSERT_TABLE_COMMAND } from "@lexical/table";

import { pageSetupState } from "./plugins/PagesExtension/pageSetup";

export const DEFAULT_PAGE_SETUP = {
  margins: {
    bottom: 0.4,
    left: 0.4,
    right: 0.4,
    top: 0.4,
  },
  orientation: "portrait" as const,
  pageSize: "A4",
};

function Divider() {
  return <div className="divider" />;
}

export function $setPageSetup(
  pageSetup: StateValueOrUpdater<typeof pageSetupState>,
): void {
  $setState($getRoot(), pageSetupState, pageSetup);
}

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const canUndo = useExtensionSignalValue(HistoryExtension, "canUndo");
  const canRedo = useExtensionSignalValue(HistoryExtension, "canRedo");
  const editorState = useSignalValue(
    useExtensionDependency(EditorStateExtension).output,
  );
  const { isBold, isItalic, isUnderline, isStrikethrough } = editorState.read(
    () => {
      const selection = $getSelection();
      const isRange = $isRangeSelection(selection);
      return {
        isBold: isRange && selection.hasFormat("bold"),
        isItalic: isRange && selection.hasFormat("italic"),
        isStrikethrough: isRange && selection.hasFormat("strikethrough"),
        isUnderline: isRange && selection.hasFormat("underline"),
      };
    },
    { editor },
  );

  return (
    <div className="toolbar">
      <button
        type="button"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        type="button"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={"toolbar-item spaced " + (isBold ? "active" : "")}
        aria-label="Format Bold"
      >
        <i className="format bold" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={"toolbar-item spaced " + (isItalic ? "active" : "")}
        aria-label="Format Italics"
      >
        <i className="format italic" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
        aria-label="Format Underline"
      >
        <i className="format underline" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough" />
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
        className="toolbar-item spaced list-button"
        aria-label="Insert bullet list"
        title="Bullet list"
      >
        <span aria-hidden="true">•</span>
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }}
        className="toolbar-item spaced list-button"
        aria-label="Insert numbered list"
        title="Numbered list"
      >
        <span aria-hidden="true">1.</span>
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: "3",
            includeHeaders: { rows: true, columns: false },
            rows: "3",
          });
        }}
        className="toolbar-item spaced table-button"
        aria-label="Insert 3 by 3 table"
        title="Insert 3 × 3 table"
      >
        Table
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <i className="format left-align" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <i className="format center-align" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <i className="format right-align" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <i className="format justify-align" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.update(() => {
            $setPageSetup((prev) => ({
              ...(prev || DEFAULT_PAGE_SETUP),
              pageSize: "A3",
            }));
          });
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        A3
      </button>{" "}
      <button
        type="button"
        onClick={() => {
          editor.update(() => {
            $setPageSetup((prev) => ({
              ...(prev || DEFAULT_PAGE_SETUP),
              pageSize: "A4",
            }));
          });
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        A4
      </button>{" "}
      <button
        type="button"
        onClick={() => {
          editor.update(() => {
            $setPageSetup((prev) => ({
              ...(prev || DEFAULT_PAGE_SETUP),
              pageSize: "A5",
            }));
          });
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        A5
      </button>{" "}
    </div>
  );
}
