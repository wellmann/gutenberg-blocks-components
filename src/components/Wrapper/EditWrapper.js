// WordPress dependencies.
const { withDispatch } = wp.data;
const { tokenList: TokenList, serverSideRender: ServerSideRender } = wp;

// Local dependencies.
import { convertToBem } from '../../utils';
import EditContext from '../EditContext';

const getEdit = ({ blockNamespace, additionalClassNames, editFunction }) => (
  withDispatch(( dispatch, { className, clientId } ) => {
    if (additionalClassNames) {
      const list = new TokenList(className);
      list.remove(className.split(' ')[0]); // Remove blocks default class name.
      additionalClassNames.map((className) => list.add(className));

      dispatch('core/block-editor').updateBlockAttributes(clientId, { className: list.value });
    }
  })((props) => {
    let className = convertToBem(props.className);

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

    const { attributes } = props;

    if (attributes.hasOwnProperty('className')) {
      delete attributes.className;
    }

    if (attributes.hasOwnProperty('hideMobile')) {
      delete attributes.hideMobile;
    }

    if (attributes.hasOwnProperty('hideDesktop')) {
      delete attributes.hideDesktop;
    }

    return (
      <ServerSideRender
        block={ blockNamespace }
        attributes={ props.attributes }
        className={ className }
      />
    );
  })
);

export default getEdit;