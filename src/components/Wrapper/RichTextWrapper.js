// External dependencies.
import BEMHelper from 'react-bem-helper';

// WordPress dependencies.
const { useContext } = wp.element;
const { RichText } = wp.blockEditor;

// Local dependencies.
import { EditContext } from 'components';

const RichTextWrapper = ({ name, ...props }) => {
  const { attributes, setAttributes, className } = useContext(EditContext);
  const bem = new BEMHelper({
    name: className.split(' ')[0],
    outputIsString: true
  });

  return (
    <RichText
      className={ bem(name) }
      tagName={ props.tagName || 'p' }
      allowedFormats={ !props.tagName ? ['core/bold', 'core/italic', 'core/link'] : [] }
      value={ attributes[name] }
      onChange={ (value) => setAttributes({ [name]: value }) }
      { ...props }
    />
  );
};

export default RichTextWrapper;