import { $convertFromMarkdownString } from '@lexical/markdown'
import type { InitialConfigType } from '@lexical/react/LexicalComposer'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import clsx from 'clsx'
import type { FC } from 'react'

import { TRANSFORMERS } from './constants'
import { nodes } from './nodes'
import { TreeViewPlugin } from './plugins'
import { SyncExternalValuePlugin } from './plugins/SyncExternalValuePlugin'
import { container, editor } from './RichTextEditor.css'

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error)
}

const initialConfig = (initialValue: string): InitialConfigType => ({
  namespace: 'MyEditor',
  editorState: () => $convertFromMarkdownString(initialValue, TRANSFORMERS),
  onError,
  nodes,
})

interface Props {
  value: string
  onUpdate: (value: string) => void
  isDebug?: boolean
}

export const RichTextEditor: FC<Props> = ({ value, onUpdate, isDebug }) => {
  return (
    <LexicalComposer initialConfig={initialConfig(value)}>
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <RichTextPlugin
        contentEditable={
          <div className={clsx('markdown-body', container)}>
            <ContentEditable className={editor} />
          </div>
        }
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <SyncExternalValuePlugin value={value} onUpdate={onUpdate} />
      {isDebug ? <TreeViewPlugin /> : <></>}
    </LexicalComposer>
  )
}
