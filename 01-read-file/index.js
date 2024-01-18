const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

const inputFileName = 'text.txt';
const inputFilePath = path.join(__dirname, inputFileName);

const input = fs.createReadStream(inputFilePath, 'utf-8');
const output = process.stdout;

pipeline(input, output, (err) => {
  if (err) {
    console.error(err);
  }
});
