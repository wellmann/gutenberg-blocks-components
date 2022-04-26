// WordPress dependencies.
const { serverSideRender: ServerSideRender } = wp;

// Local dependencies.
import { blockNameToBlockClassName } from '../../utils';
import EditContext from '../EditContext';

const EditWrapper = ({ blockName, editFunction }) => ((props) => {
  if (editFunction) {
    return (
      <EditContext.Provider value={ props }>
        { editFunction(props) }
      </EditContext.Provider>
    );
  }

  return (
    <ServerSideRender
      block={ blockName }
      attributes={ props.attributes }
    />
  );
});

export default EditWrapper;