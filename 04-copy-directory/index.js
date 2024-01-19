const fs = require('fs');
const path = require('node:path');
const { readdir, copyFile } = require('node:fs');

function initFolder(folderPath, callback) {
  fs.mkdir(folderPath, { recursive: true }, (err, path) => {
    if (err) callback(err);
    const isFolderAlreadyExist = !path;
    if (isFolderAlreadyExist) {
      fs.rm(folderPath, { recursive: true, force: true }, () =>
        initFolder(folderPath, callback),
      );
      return;
    }

    callback(err, path);
  });
}
function copyFolder(from, to, callback) {
  readdir(from, { withFileTypes: true }, (err, files) => {
    if (err) callback(err);
    for (const file of files) {
      const fileName = file.name;
      const copyFrom = path.join(from, fileName);
      const copyTo = path.join(to, fileName);

      if (file.isDirectory()) {
        initFolder(copyTo, (err) => {
          if (err) callback(err);
          copyFolder(copyFrom, copyTo, callback);
        });
      }

      if (file.isFile()) {
        copyFile(copyFrom, copyTo, (err) => {
          if (err) callback(err);
        });
      }
    }
    callback();
  });
}
function syncFolder(source, destination, callback) {
  initFolder(destination, (err) => {
    if (err) callback(err);
    copyFolder(source, destination, callback);
  });
}

const newFolderName = 'files-copy';
const newFolderPath = path.join(__dirname, newFolderName);

const sourceFolderName = 'files';
const sourceFolderPath = path.join(__dirname, sourceFolderName);

syncFolder(sourceFolderPath, newFolderPath, (err) => {
  if (err) throw err;
});

module.exports = { syncFolder };
