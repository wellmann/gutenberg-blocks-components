import { createHigherOrderComponent } from '@wordpress/compose';
import { useContext, useId, useState } from '@wordpress/element';
import { count, CountType } from '@wordpress/wordcount';
import { __, sprintf } from '@wordpress/i18n';
import { v4 as uuidv4 } from 'uuid';
import EditContext from './components/EditContext';

/**
 * A Higher Order Component used to set and display a character limit for input components.
 */
const withCharCount = (
  limit: number,
  hint: string = __('Characters: %d of %d'),
  strategy: CountType = 'characters_excluding_spaces',
  onCharLimitExceeded?: (charCount: number, limit: number, id: string) => void
  ) => createHigherOrderComponent((WrappedComponent) => {
    return (props) => {
      const { attributes } = useContext(EditContext);
      const value = props.value || attributes[props.name];
      const id = props.id || 'charcount-' + uuidv4();
      const hintId = useId();
      const [charCount, setCharCount] = useState(count(value, strategy));
      const limitExceeded = charCount > limit;

      if (limitExceeded && typeof onCharLimitExceeded === 'function') {
        onCharLimitExceeded(limit, charCount, id);
      }

      return (
        <>
          <WrappedComponent
            { ...props }
            onChange={ (value: string) => setCharCount(count(value, strategy)) }
            aria-describedby={ hintId }
            id={ id }
          />
          <small
            id={ hintId }
            style={ {
              padding: '.25em',
              background: '#fff',
              color: limitExceeded ? '#cc1818' : undefined
            } }
          >
            { sprintf(hint, charCount, limit) }
          </small>
        </>
      );
    };
}, 'withCharCount');

export default withCharCount;