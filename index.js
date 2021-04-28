#! /usr/bin/env node
const Terser = require("terser");
const fs = require("fs");
const path = require("path");

function getAllFiles(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });

  return arrayOfFiles.filter((path) => path.match(/\.js$/));
}

async function minifyFiles(filePaths) {
  let settings = {
    mangle: {
      properties: false,
    },
  };

  filePaths.forEach(async (filePath) => {
    try {
      const { code } = await Terser.minify(
        fs.readFileSync(filePath, "utf8"),
        settings
      );
      fs.writeFileSync(filePath, code);
    } catch (error) {
      console.log(error);
    }
  });
}

const targetDirectory = process.argv[2];
if (targetDirectory) {
  const files = getAllFiles(targetDirectory);
  minifyFiles(files);
} else {
  console.error("Please specify a target directory.");
}
