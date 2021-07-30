# Gutenberg Blocks Components

Accompanying npm package for https://github.com/wellmann/gutenberg-blocks-framework.

## Features

* auto-registration of blocks
*  only attributes are saved in post content - no markup
* no need to pass `value`,`setAttributes` and `className` to each component when using the custom wrapper components
* new default components
* class names follow the BEM pattern
* default example attributes

Import `InspectorControl`, `MediaPlaceholderWrapper` and `RichTextWrapper` from `components` instead of `wp.blockEditor` to write less repetitive code.  
You only need to add a `name` prop which corresponds to the attribute.

before:
```
 <RichText
    value={ attributes.text }
    onChange={ (text) => setAttributes({ text }) } />
```
now:
```
 <RichText name="text" />
```

## Included components

### Sidebar controls

* [DateTimePickerControl](src/components/Control/DateTimePickerControl.js)
* [EntitySelectControl](src/components/Control/EntitySelectControl.js)
* [EntityTokenField](src/components/Control/EntityTokenField.js)
* [ImageControl](src/components/Control/ImageControl.js)
* [MediaControl](src/components/Control/MediaControl.js)
* [URLControl](src/components/Control/URLControl.js)


### Wrapper

* [InspectorControlsWrapper](src/components/Control/InspectorControlsWrapper.js)
* [MediaPlaceholderWrapper](src/components/Control/MediaPlaceholderWrapper.js)
* [RichTextWrapper](src/components/Control/RichTextWrapper.js)


### Editor

* [EntitySearchList](src/components/Control/EntitySearchList.js)
* [Gallery](src/components/Control/Gallery.js)


## Usage of styles & scripts

The blocks assets are automatically compiled, combined and minified into the `dist` folder (including *.map files).  

The following config properties can be used in `package.json` to define the paths where to look for scss includes of the theme (by default the scss-loader is prepending imports for `_variables.scss` and `_mixins_.scss`):
* `themeSlug`
* `themeAssetsDir`
* `themeScssIncludesDir`