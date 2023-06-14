import path from 'path';

let rootDirPath = './check/';

let subdirA = '/this/';

let subdirB = '/works/';

let filename = 'myfile.txt';

let fullPath = path.resolve(path.join(rootDirPath, subdirA, subdirB, filename));

console.log(fullPath);

// let dirPath = rootDirPath + '/' + timestamp;

// if (!fs.existsSync(dirPath))
// {
//     fs.mkdirSync(dirPath, { recursive: true });
// }