// WordPress dependencies.
const { serverSideRender: ServerSideRender } = wp;

// Local dependencies.
import { convertToBem } from '../../utils';
import EditContext from '../EditContext';

const getEdit = ({ blockNamespace, editFunction }) => ((props) => {
  let className = 'block ';
  className += convertToBem(props.className);
  
  if (editFunction) {
    if (props.attributes.align && ['full', 'wide'].includes(props.attributes.align)) {
        className += ' align' + props.attributes.align;
    }
    
    return (
      <EditContext.Provider value={ props }>
        <div className={ className }>
            { editFunction(props) }
        </div>
      </EditContext.Provider>
    );
  }

  return (
    <ServerSideRender
      block={ blockNamespace }
      attributes={ props.attributes }
    />
  );
});

export default getEdit;
