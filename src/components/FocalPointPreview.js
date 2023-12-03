const { BaseControl, Button, ResponsiveWrapper } = wp.components;

const wrapperStyles = {
  position: 'relative'
};

const sharedPreviewStyles = {
  backgroundColor: '#f0f0f0',
  backgroundSize: 'cover',
  overflow: 'hidden'
};

let desktopPreviewStyles = {
  ...sharedPreviewStyles,
  maxWidth: '85%',
  aspectRatio: '16/9'
};

let mobilePreviewStyles = {
  ...sharedPreviewStyles,
  position: 'absolute',
  right: 0,
  bottom: '-4px',
  paddingTop: '40%',
  borderWidth: '4px 0 0 4px',
  borderStyle: 'solid',
  borderColor: '#fff',
  aspectRatio: '9/16',
};

const FocalPointPreview = ({
  imageUrl,
  focalPoint,
  imageUrlMobile,
  focalPointMobile,
  editFunction
}) => {
  const focalPointPercentage = {
    x: (focalPoint?.x || 0.5) * 100,
    y: (focalPoint?.y || 0.5) * 100
  };
  const focalPointMobilePercentage = {
    x: (focalPointMobile?.x || 0.5) * 100,
    y: (focalPointMobile?.y || 0.5) * 100
  };

  desktopPreviewStyles = {
    ...desktopPreviewStyles,
    backgroundImage: imageUrl ? `url(${imageUrl})` : null,
    backgroundPosition: `${focalPointPercentage.x}% ${focalPointPercentage.y}%`
  }

  mobilePreviewStyles = {
    ...mobilePreviewStyles,
    backgroundImage: imageUrlMobile ? `url(${imageUrlMobile})` : (imageUrl ? `url(${imageUrl})` : null),
    backgroundPosition: focalPointMobile ? `${focalPointMobilePercentage.x}% ${focalPointMobilePercentage.y}%` : `${focalPointPercentage.x}% ${focalPointPercentage.y}%`
  }

  return (
    <BaseControl label="Preview of the image with focal point on desktop and mobile" hideLabelFromVision={ true }>
      <div style={ wrapperStyles }>
        <div style={ desktopPreviewStyles }>
        </div>
        <div style={ mobilePreviewStyles }>
        </div>
        { editFunction && <Button
        aria-label="Edit focal point"
        icon="edit"
        onClick={ editFunction }
        style={ {
          position: 'absolute',
          top: '-4px',
          right: 0,
        } }
        isSmall
        /> }
      </div>
    </BaseControl>
  );
};

export default FocalPointPreview;