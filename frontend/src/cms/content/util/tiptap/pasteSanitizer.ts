import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';

export const PlainTextPaste = Extension.create({
  name: 'plainTextPaste',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('plainTextPaste'),
        props: {
          handlePaste: (view: EditorView, event: ClipboardEvent) => {
            const text = event.clipboardData?.getData('text/plain') ?? '';
            if (!text) return false;

            const { state, dispatch } = view;
            dispatch(state.tr.insertText(text));
            return true;
          },
        },
      }),
    ];
  },
});
