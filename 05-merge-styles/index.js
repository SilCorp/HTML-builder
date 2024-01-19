const path = require('node:path');
const { readdir, createWriteStream, createReadStream } = require('node:fs');

function compileFiles(from, to, extension, callback) {
  const output = createWriteStream(to);

  readdir(from, { recursive: true, withFileTypes: true }, (err, files) => {
    if (err) callback(err);

    for (const file of files) {
      if (!file.isFile()) continue;
      if (path.extname(file.name) !== extension) continue;

      const filePath = path.join(file.path, file.name);
      const input = createReadStream(filePath);

      input.pipe(output);
    }
  });
}

const outputFolderName = 'project-dist';
const outputFolderPath = path.join(__dirname, outputFolderName);

const outputFileName = 'bundle.css';
const outputFilePath = path.join(outputFolderPath, outputFileName);

const sourceFolderName = 'styles';
const sourceFolderPath = path.join(__dirname, sourceFolderName);

compileFiles(sourceFolderPath, outputFilePath, '.css', (err) => {
  if (err) throw err;
});

module.exports = { compileFiles };
