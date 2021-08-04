// Modified snippet: https://gist.github.com/florianbrinkmann/167939b3e0a8c33a5ae3f1c0dc561859

// WordPress dependencies.
const { FormTokenField } = wp.components;
const { useContext } = wp.element;
const { withSelect } = wp.data;

// Local dependencies.
import EditContext from '../EditContext';

const EntityTokenField = ({ entity, name, items, ...restProps }) => {
  const { attributes, setAttributes } = useContext(EditContext);
  const selectedItems = attributes[name] ?? [];
  let suggestions = [];
  let value = [];

  const getDisplayValue = (item) => {
    switch (entity) {
    case 'postType':
      return item.title.rendered;
    case 'taxonomy':
      return item.name;
    }
  };

  if (items) {
    suggestions = items.map((item) => getDisplayValue(item));

    value = selectedItems.map((itemId) => {
      let matchedPost = items.find((item) => item.id === itemId);
      return matchedPost ? getDisplayValue(matchedPost) : false;
    });
  }

  const onChange = (selectedItems) => {
    let selectedItemsArray = [];
    selectedItems.map((itemName) => {
      const matchingItem = items.find((item) => getDisplayValue(item) === itemName);
      if (matchingItem) {
        selectedItemsArray.push(matchingItem.id);
      }
    });

    setAttributes({ [name]: selectedItemsArray });
  };

  return <FormTokenField
    { ...restProps }
    value={ value }
    suggestions={ suggestions }
    maxSuggestions={ 20 }
    onChange={ onChange }
  />;
};

export default withSelect((select, { entity, type, args = {} }) => ({ items: select('core').getEntityRecords(entity, type, { per_page: -1, ...args }) }))(EntityTokenField);