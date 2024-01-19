const fs = require('node:fs');
const path = require('node:path');
const { syncFolder } = require('../04-copy-directory/index.js');
const { compileFiles } = require('../05-merge-styles/index.js');

function createFolder(path, callback) {
  fs.mkdir(path, { recursive: true }, callback);
}
function findFile(folderPath, fileName, callback) {
  fs.readdir(
    folderPath,
    { recursive: true, withFileTypes: true },
    (err, files) => {
      if (err) return callback(err);
      for (const file of files) {
        if (!file.isFile()) continue;

        if (file.name === fileName) {
          const filePath = path.join(file.path, file.name);
          return callback(null, filePath);
        }
      }
      callback(null, null);
    },
  );
}
function replaceWithTemplate(templateFilePath, templatesFolderPath, callback) {
  const regExp = /{{.+}}/;
  let templateStr;

  fs.readFile(templateFilePath, 'utf-8', (err, data) => {
    if (err) return callback(err);
    templateStr = data;

    let searchResult = regExp.exec(templateStr);
    (function replace() {
      if (!searchResult) {
        callback(null, templateStr);
      } else {
        const { 0: templateReplacer, index: startIndex } = searchResult;
        const endIndex = startIndex + templateReplacer.length;
        const templateName = templateReplacer.slice(2, -2);
        const templateFileName = templateName + '.html';

        findFile(templatesFolderPath, templateFileName, (err, path) => {
          if (err) callback(err);
          if (!path) callback(new Error('Template file not found'));

          fs.readFile(path, 'utf-8', (err, htmlString) => {
            if (err) callback(err);
            const firstPartOfTemplate = templateStr.slice(0, startIndex);
            const secondPartOfTemplate = templateStr.slice(endIndex);

            templateStr =
              firstPartOfTemplate + htmlString + secondPartOfTemplate;
            searchResult = regExp.exec(templateStr);
            replace();
          });
        });
      }
    })();
  });
}

const distFolderName = 'project-dist';
const distFolderPath = path.join(__dirname, distFolderName);

function fulfillTemplate() {
  const templateFileName = 'template.html';
  const templateFilePath = path.join(__dirname, templateFileName);

  const componentsFolderName = 'components';
  const componentsFolderPath = path.join(__dirname, componentsFolderName);
  const outputFileName = 'index.html';
  const outputFilePath = path.join(distFolderPath, outputFileName);

  replaceWithTemplate(
    templateFilePath,
    componentsFolderPath,
    (err, templateStr) => {
      if (err) throw err;

      fs.writeFile(outputFilePath, templateStr, (err) => {
        if (err) throw err;
      });
    },
  );
}
function compileStyles() {
  const sourceStylesFolderName = 'styles';
  const sourceStylesFolderPath = path.join(__dirname, sourceStylesFolderName);
  const compiledStylesFileName = 'style.css';
  const compiledStylesFilePath = path.join(
    distFolderPath,
    compiledStylesFileName,
  );

  compileFiles(
    sourceStylesFolderPath,
    compiledStylesFilePath,
    '.css',
    (err) => {
      if (err) throw err;
    },
  );
}
function copyAssets() {
  const sourceFolderPath = path.join(__dirname, 'assets');
  const destFolderPath = path.join(distFolderPath, 'assets');

  syncFolder(sourceFolderPath, destFolderPath, (err) => {
    if (err) throw err;
  });
}

createFolder(distFolderPath, (err) => {
  if (err) throw err;

  fulfillTemplate();
  compileStyles();
  copyAssets();
});
