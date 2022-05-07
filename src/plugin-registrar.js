// WordPress dependencies.
const { registerPlugin } = wp.plugins;

const requireContext = require.context(__PLUGINS_DIR__, true, /plugin\.js$/);
requireContext.keys().forEach((key) => {
  let pluginSlug = key.split('/')[1];
  let pluginName = __PREFIX__ + '-' + pluginSlug;
  let exportObj = requireContext(key);
  let settings = { render: exportObj.default };

  if (exportObj.icon) {
    settings.icon = exportObj.icon;
  }

  if (exportObj.scope) {
    settings.scope = exportObj.scope;
  }

  registerPlugin(pluginName, settings);
});