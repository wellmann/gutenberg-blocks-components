# Gutenberg Blocks Components

NPM package to facilitate the development of Gutenberg blocks.

## Features

* auto-registration of blocks
*  only attributes are saved in post content - no markup
* no need to pass `value`,`setAttributes` and `className` to each component when using our custom wrapper components
* improved default components
* class names follow the BEM pattern
* default example attributes

Import `InspectorControl`, `MediaPlaceholderWrapper` and `RichTextWrapper` from `components` instead of `wp.blockEditor` to write less repetitive code.  
You only need to add a `name` prop which corresponds to the attribute.

```
 <RichText
    value={ attributes.text }
    onChange={ (text) => setAttributes({ text }) } />
```
vs.
```
 <RichText name="text" />
```

A selected set of Gutenberg default modules are grouped into a WordPress category, while blocks belonging to this plugins namespace are put into their own category as well.

## Usage of styles & scripts

The blocks assets are automatically compiled, combined and minified into the `dist` folder (including *.map files).  
The following variables can be used inside `*.scss` files:
* `assets_path` - holds the path to the themes `assets` folder

If used in conjunction with a specific setup and theme, variables and mixins from `<theme-name>/assets/css/_includes` can be imported and used inside the blocks `*.scss` files.

To customize these paths look into the config object of the `package.json`.  
You can use the following options to alter the defaults:

* `themeDirName`
* `themeAssets`
* `themeScssIncludes`