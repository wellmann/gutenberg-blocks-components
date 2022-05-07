// WordPress dependencies.
const { ComboboxControl } = wp.components;
const { withSelect } = wp.data;

const EntityComboboxControl = ({ entity, items = [], placeholder = '', ...restProps }) => {
  const options = [];

  if (placeholder) {
    options.push({ value: 0, label: placeholder });
  }

  if (items) {
    switch (entity) {
    case 'postType':
      items.forEach((item) => options.push({ value: item.id, label: item.title.rendered }));
      break;
    case 'taxonomy':
      items.forEach((item) => options.push({ value: item.id, label: item.name }));
      break;
    }
  }

  if (!items && !placeholder && restProps.label) {
    options.push({ value: 0, label: restProps.label });
  }

  return <ComboboxControl { ...restProps } options={ options } disabled={ !items } />;
};

export default withSelect((select, { entity, type, args = {} }) => ({ items: select('core').getEntityRecords(entity, type, args) }))(EntityComboboxControl);