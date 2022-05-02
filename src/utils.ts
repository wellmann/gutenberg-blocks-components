// External dependencies.
const { createHash } = require('crypto');
const { basename } = require('path');

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

const getLocalIdent = ({ resourcePath, mode }: { resourcePath: string; mode: string }, localIdentName: string, localName: string): string => {
  const hash = createHash('sha256')
    .update(resourcePath + localName)
    .digest('hex')
    .slice(0, 5);
  localIdentName = basename(resourcePath, '.module.scss');

  return mode === 'production' ? `_${hash}` : `${localIdentName}__${localName}_${hash}`;
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
  getLocalIdent,
  stripTags,
  trimWords
};