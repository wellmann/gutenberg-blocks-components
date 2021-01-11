// WordPress dependencies.
const { withNotices } = wp.components;
const { createHigherOrderComponent } = wp.compose;
const { Component, Fragment, forwardRef } = wp.element;
const { count } = wp.wordcount;

/**
 * A Higher Order Component used to set a word limit for input components.
 *
 * @param {WPElement} WrappedComponent The wrapped component.
 *
 * @return {Component} Component with word limit enforced.
 */
const withWordLimit = ({ limit, threshold }) => createHigherOrderComponent((WrappedComponent) => {

  class ComponentWithWordLimit extends Component {
    static defaultProps = { onChange: () => null }

    onChange = (eventOrvalue) => {
      console.log('onChange');
      threshold = typeof threshold === 'undefined' ? 2 : threshold;
      const text = typeof eventOrvalue === Object ? event.target.value : eventOrvalue;
      const countThreshold = count(text, 'words') + threshold;

      console.log(countThreshold);
      console.log(limit);
      console.log(this.props);

      if (countThreshold > limit) {
        this.props.ownProps.noticeOperations.createErrorNotice('Error message');
      }

      this.props.ownProps.onChange(eventOrvalue);
    }

    render() {

      return (
        <Fragment>

          <WrappedComponent { ...this.props.ownProps } onChange={ this.onChange } />
        </Fragment>
      );
    }
  }

  // Forward ref to keep focus event intact.
  const ComponentWithWordLimitforwardRef = forwardRef((props, ref) => {
    return <ComponentWithWordLimit { ...props } forwardedRef={ ref } />;
  });

  return withNotices(ComponentWithWordLimitforwardRef);
}, 'withWordLimit');

export default withWordLimit;