// WordPress dependencies.
const { serverSideRender: ServerSideRender } = wp;

// Local dependencies.
import EditContext from '../EditContext';

const getEdit = ({ blockName, editFunction }) => ((props) => {
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

export default getEdit;