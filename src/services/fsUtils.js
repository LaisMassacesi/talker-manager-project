const fs = require('fs').promises;
const path = require('path');

const TALKER_DB = '../talker.json';

const readFile = async () => {
  try {
    const pathResolve = path.resolve(__dirname, TALKER_DB);
    const fileResult = JSON.parse(await fs.readFile(pathResolve));
    return fileResult; 
  } catch (error) {
    console.log(`error reading file: ${error}`);
    return [];
  }
};
// readFile();

module.exports = {
  readFile,
};
