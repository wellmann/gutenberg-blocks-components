import { BaseControl } from '@wordpress/components';
import { withInstanceId } from '@wordpress/compose';
import Editor from 'react-simple-code-editor';
import { highlight, registerLanguage } from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import 'highlight.js/scss/vs.scss';

registerLanguage('css', css);
registerLanguage('javascript', javascript);

type Languages = 'css' | 'javascript';

interface Props {
  label: string,
  language: Languages,
  onChange: (code: string) => void,
  value: string,
  instanceId: string | number
};

const CodeAreaControl = ({ label, language, onChange, instanceId, ...props }: Props) => {
  const id = 'code-editor-control-' + instanceId;

  return (
    <BaseControl
      id={ id }
      label={ label }
    >
      <style>
        {`
          #${id}:not(:focus) {
            border: 1px solid rgb(117, 117, 117) !important;
          }
          #${id}:focus {
            border: 1px solid var(--wp-admin-theme-color) !important;
          }
        `}
      </style>
      <Editor
        onValueChange={ (code: string) => onChange(code) }
        highlight={ (code: string): string => highlight(code, { language }).value }
        textareaId={ id }
        padding={ 5 }
        style={ {
          overflow: 'auto !important',
          fontFamily: 'monospace'
        } }
        { ...props }
      />
    </BaseControl>
  );
};

export default withInstanceId(CodeAreaControl);