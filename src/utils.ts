const blockNameToBlockClassName = (blockName: string): string => {
  const blockNameParts = blockName.split('/');
  const blockSlug = blockNameParts[1];

  return 'block-' + blockSlug;
};

/**
 * Workaround until https://github.com/WordPress/gutenberg/issues/11763 is fixed.
 */
const convertToBem = (baseClassName: string, className: string): string => {
  let classNames = className.split(' ');
  classNames = classNames.map((className) => {
    if (className.indexOf('is-style-') !== -1) {
      return className.replace('is-style-', baseClassName + '--');
    }

    return className;
  });

  return classNames.join(' ');
};

const stripTags = (content: string): string => content.replace(/(<([^>]+)>)/gi, '');

const trimWords = (content: string, maxWords: number = 55, more: string = '&hellip;'): string => {
  const words = content.split(' ');

  if (maxWords >= words.length) {
    return content;
  }

  const truncated = words.slice(0, maxWords);

  return truncated.join(' ') + more;
};

export {
  blockNameToBlockClassName,
  convertToBem,
  stripTags,
  trimWords
};