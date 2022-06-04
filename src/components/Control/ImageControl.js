// WordPress dependencies.
const { MediaUpload } = wp.blockEditor;
const { Button, ResponsiveWrapper } = wp.components;
const { withSelect } = wp.data;
const { useContext } = wp.element;
const { __ } = wp.i18n;

const ImagePreview = withSelect((select, { imageId }) => ({ image: select('core').getMedia(imageId) }))(({ image, open }) => (
  <Button onClick={ open } className="editor-post-featured-image__preview">
    { image && <ResponsiveWrapper naturalWidth={ image.media_details.width } naturalHeight={ image.media_details.height }>
      <img src={ image.source_url } alt="" />
    </ResponsiveWrapper> }
  </Button>
));

const ImageControl = ({ label, value, onChange, ...restProps }) => {
  const onRemove = () => onChange(null);

  return (
    <MediaUpload
      value={ value }
      onSelect={ ({ id }) => onChange(id) }
      allowedTypes={ ['image'] }
      render={ ({ open }) => (
        <div className="editor-post-featured-image">
          <div className="editor-post-featured-image__container">
            { value ?
            <>
              <ImagePreview imageId={ value } open={ open } />
              <Button onClick={ restProps.onRemove || onRemove } isLink isDestructive>{ __('Remove') }</Button>
            </> : ''
            }
            { !value && <Button onClick={ open } className="editor-post-featured-image__toggle">{ label }</Button> }
          </div>
        </div>
      ) }
      { ...restProps }
    />
  );
};

export default ImageControl;