// External dependencies.
import BEMHelper from 'react-bem-helper';

// WordPress dependencies.
const { MediaPlaceholder, MediaUpload } = wp.blockEditor;
const { Button, Icon, ResponsiveWrapper } = wp.components;
const { withSelect } = wp.data;
const { useContext } = wp.element;
const { __ } = wp.i18n;

// Local dependencies.
import EditContext from './EditContext';

const ImagePreview = withSelect((select, { imageId }) => ({ image: select('core').getMedia(imageId) }))(({ image }) => (
  <>
    { image && <ResponsiveWrapper naturalWidth={ image.media_details.width } naturalHeight={ image.media_details.height }>
      <img src={ image.source_url } alt="" />
    </ResponsiveWrapper> }
  </>
));
const Gallery = ({ name, label = __('Image'), width = '100%', height, ...props }) => {
  const { attributes, setAttributes, className, isSelected } = useContext(EditContext);
  const value = attributes[name];
  const allowedTypes = ['image'];
  const bem = new BEMHelper(className.split(' ')[0]);
  const onSelect = (images) => setAttributes({ [name]: images.map((image) => image.id) });
  const previewImageId = value.length > 0 ? value[0] : undefined;
  const previewStyle = {
    display: 'block',
    position: 'relative',
    padding: 0,
    width,
    height: 'auto'
  };
  const Preview = () => (
    <MediaUpload
      onSelect={ onSelect }
      allowedTypes={ allowedTypes }
      value={ value }
      multiple={ true }
      gallery={ true }
      render={ ({ open }) => (
        isSelected ? <Button
          onClick={ open }
          style={ previewStyle }><ImagePreview imageId={ previewImageId } /></Button> : <ImagePreview imageId={ previewImageId } />
      ) }
    />
  );
  return value.length > 0 ? <Preview /> : <div style={ { width, height } }><MediaPlaceholder
    { ...bem(name) }
    icon={ <Icon icon="format-gallery" /> }
    labels={ { title: label, instructions: '' } }
    onSelect={ onSelect }
    accept="image/*"
    allowedTypes={ allowedTypes }
    { ...props }
    multiple={ true }
    gallery={ true }
  /></div>;
};

export default Gallery;