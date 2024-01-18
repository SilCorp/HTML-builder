const path = require('node:path');
const { readdir, stat } = require('node:fs');

const folderName = 'secret-folder';
const folderPath = path.join(__dirname, folderName);

readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    if (!file.isFile()) continue;
    const { base, name, ext } = path.parse(file.name);
    stat(path.join(folderPath, base), (err, { size }) => {
      if (err) throw err;
      console.log('%s – %s – %d', name, ext.slice(1), size);
    });
  }
});
