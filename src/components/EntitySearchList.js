// WordPress dependencies.
const { useContext } = wp.element;
const { _n, sprintf } = wp.i18n;
const { withSelect } = wp.data;

// External dependencies.
import { SearchListControl } from '@woocommerce/components/src/search-list-control';

// Local dependencies.
import EditContext from './EditContext';

const EntitySearchList = ({ entity, name, items }) => {
  const { attributes, setAttributes } = useContext(EditContext);
  const options = [];

  if (items) {
    switch (entity) {
    case 'postType':
      items.forEach((item) => options.push({ id: item.id, name: item.title.rendered }));
      break;
    }
  }

  return (
    <SearchListControl
      value={ attributes[name] }
      onChange={ ( value = [] ) => setAttributes({ [name]: value.map((item) => item.id) }) }
      isLoading={ !items }
      list={ options }
      selected={ options.filter(({ id }) => attributes[name].includes(id)) }
      messages={ {
        clear: 'zurücksetzten',
        list: 'Ergebnisse',
        noItems: 'Keine Seiten gefunden.',
        noResults: 'Keine Ergebnisse für %s',
        search: 'Seitensuche',
        selected: (n) => sprintf(_n('%d Seite ausgewählt', '%d Seiten ausgewählt', n), n)
      } }
    />
  );
};

export default withSelect((select, { entity, type, args = {} }) => ({ items: select('core').getEntityRecords(entity, type, args) }))(EntitySearchList);