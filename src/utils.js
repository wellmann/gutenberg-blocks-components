/**
 * Workaround until https://github.com/WordPress/gutenberg/issues/11763 is fixed.
 */
const convertToBem = (baseClassName, className) => {
  let classNames = className.split(' ');
  classNames = classNames.map((className) => {
    if (className.indexOf('is-style-') !== -1) {
      return className.replace('is-style-', baseClassName + '--');
    }

    return className;
  });

  return classNames.join(' ');
};

const blockNameToBlockClassName = (blockName) => {
  const blockNameParts = blockName.split('/');
  const blockNamespace = blockNameParts[0];
  const blockSlug = blockNameParts[1];

  return 'block-' + blockSlug;
};

const stripTags = (content) => content.replace(/(<([^>]+)>)/gi, '');

const trimWords = (content, maxWords = 55, more = '&hellip;') => {
  const words = content.split(' ');

  if (maxWords >= words.length) {
    return content;
  }

  const truncated = words.slice(0, maxWords);

  return truncated.join(' ') + more;
};

export {
  convertToBem,
  blockNameToBlockClassName,
  stripTags,
  trimWords
};