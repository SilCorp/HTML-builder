const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const output = fs.createWriteStream(filePath);

const stopWord = 'exit';

console.log('Type some text');
stdin.on('data', (data) => {
  const inputString = data.toString().trim();
  if (inputString === stopWord) {
    process.exit();
  }

  output.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => {
  stdout.write('\nBye bye!\n');
  process.exit();
});
