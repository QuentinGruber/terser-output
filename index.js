// minify.js
var Terser = require("terser");
var fs = require("fs");
var path = require("path");

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

let settings = {
  mangle: {
    properties: true,
  },
};

const files = getAllFiles("out");
minifyFiles(files);
