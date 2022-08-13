# Gutenberg Blocks Components

Accompanying npm package for https://github.com/wellmann/gutenberg-blocks-framework.

## Features

* auto-registration of blocks
*  only attributes are saved in post content - no markup
* no need to pass `value`,`setAttributes` and `className` to each component when using the custom wrapper components
* new default components
* class names follow the BEM pattern

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

The following config properties can be used in `package.json` to define the paths where to look for scss includes of the theme (by default the scss-loader is prepending imports defined in `package.json` config as `scssDefaultImports`):
* `themeSlug` - defaults to cwd name where `-gutenberg-blocks` is replaced with `-theme`
* `themeDistDir` - default `dist`
* `themeScssIncludesDir` - default `assets/scss/_includes`

To further customize some settings these options have been added:
* `blocksDir` - default `blocks`
* `scssDefaultImports` - default `[]`; example `['variables.scss']`
* `defaultBlockCategory` - default `''`

## Installation

Add a `.npmrc` file to your project root next to the package.json wiht the following contents:
```
@wellmann:registry=https://npm.pkg.github.com
```
Authentication to [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

Or just add it to your dependencies like this:
```json
{
  "dependencies": {
    "@wellmann/gutenberg-blocks-components": "github:wellmann/gutenberg-blocks-components#v2.0.0"
  }
}
```