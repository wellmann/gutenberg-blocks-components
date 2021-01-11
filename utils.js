/**
 * Workaround until https://github.com/WordPress/gutenberg/issues/11763 is fixed.
 */
const convertToBem = (className) => {
  let classNames = className.split(' ');
  classNames = classNames.map((className) => {
    if (className.indexOf('is-style-') !== -1) {
      return className.replace('is-style-', classNames[0] + '--');
    }

    return className;
  });

  return classNames.join(' ');
};

const buildExamplePreview = (attributes = {}) => (
  Object.keys(attributes).map((key) => {
    let attribute = attributes[key];

    if (attribute.hasOwnProperty('default')) {
      return { [key]: attribute.default };
    }

    switch (attribute.type) {
    case 'number':
      return { [key]: 1 };
    case 'string':
    default:
      return { [key]: 'Lorem ipsum dolor' };
    }
  })
);

export {
  convertToBem,
  buildExamplePreview
};