const fs = require('fs');
const path = require('node:path');
const { readdir, copyFile } = require('node:fs');

const newFolderName = 'files-copy';
const newFolderPath = path.join(__dirname, newFolderName);

const sourceFolderName = 'files';
const sourceFolderPath = path.join(__dirname, sourceFolderName);

function initCopyFolder(folderPath, callback) {
  fs.mkdir(folderPath, { recursive: true }, (err, path) => {
    if (err) callback(err);
    const isFolderAlreadyExist = !path;
    if (isFolderAlreadyExist) {
      fs.rm(folderPath, { recursive: true, force: true }, () =>
        initCopyFolder(folderPath, callback),
      );
      return;
    }

    callback(err, path);
  });
}

function copyFolder(from, to) {
  readdir(from, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      const fileName = file.name;
      const copyFrom = path.join(from, fileName);
      const copyTo = path.join(to, fileName);

      if (file.isDirectory()) {
        initCopyFolder(copyTo, (err) => {
          if (err) throw err;
          copyFolder(copyFrom, copyTo);
        });
      }

      if (file.isFile()) {
        copyFile(copyFrom, copyTo, (err) => {
          if (err) throw err;
        });
      }
    }
  });
}

initCopyFolder(newFolderPath, (err) => {
  if (err) throw err;
  copyFolder(sourceFolderPath, newFolderPath);
});
