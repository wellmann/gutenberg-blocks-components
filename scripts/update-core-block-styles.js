// External dependencies.
const console=require('console');
const { readdirSync, writeFileSync } = require('fs');
const { get } = require('https');
const { join } = require('path');

// Local dependencies.
const { BLOCKS_DIR } = require('../dist/config');

// Loop through projects blocks directory and find all overriden core blocks.
const blocksDirPath = join(process.cwd(), BLOCKS_DIR);
const coreBlockSlugs = readdirSync(blocksDirPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter((name) => name.indexOf('core-') === 0);

if (!coreBlockSlugs.length) {
  console.log('\x1b[31mno core blocks found\x1b[0m');
  process.exit(1);
}

// Get latest styles for the core blocks from GitHub.
coreBlockSlugs.forEach((dirName) => {
  let slug = dirName.replace('core-', '');
  let url = `https://raw.githubusercontent.com/WordPress/gutenberg/trunk/packages/block-library/src/${slug}/style.scss`;
  let headerBanner = `// DO NOT EDIT - UPDATED VIA SCRIPT FROM ${url}\r\n\r\n`;

  get(url, function(res) {
    if (res.statusCode !== 200) {
      console.error(res.statusCode + ' status code returned');
      process.exit(1);
    }

    res.setEncoding('utf8');
    let resBody = [headerBanner];
    res.on('data', function (chunk) {
      resBody.push(chunk);
    });

    res.on('end', function () {
      let localFilePath = join(dirName, 'core-style.scss');
      let content = resBody.join('');

      writeFileSync(join(blocksDirPath, localFilePath), content);
      console.log(`latest core/${slug} styles successfully written to \x1b[32m./${join(BLOCKS_DIR, localFilePath)}\x1b[0m`);
    });
  })
    .on('error', function(e) {
      console.error(e.message);
    })
    .end();
});