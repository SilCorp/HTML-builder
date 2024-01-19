const path = require('node:path');
const { readdir, createWriteStream, createReadStream } = require('node:fs');

const outputFolderName = 'project-dist';
const outputFolderPath = path.join(__dirname, outputFolderName);

const outputFileName = 'bundle.css';
const outputFilePath = path.join(outputFolderPath, outputFileName);

const sourceFolderName = 'styles';
const sourceFolderPath = path.join(__dirname, sourceFolderName);

const outputStream = createWriteStream(outputFilePath);

readdir(
  sourceFolderPath,
  { recursive: true, withFileTypes: true },
  (err, files) => {
    if (err) throw err;

    for (const file of files) {
      if (!file.isFile()) continue;
      const fileExtension = path.extname(file.name);

      if (fileExtension !== '.css') continue;

      const inputPath = path.join(file.path, file.name);
      const inputStream = createReadStream(inputPath);

      inputStream.pipe(outputStream);
    }
  },
);
