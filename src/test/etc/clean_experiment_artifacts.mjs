import fs from 'fs';
import path from 'path';

let videosDir = path.resolve(path.join('experiments', 'videos'));
let animsDir = path.resolve(path.join('experiments', 'anims'));

fs.rmSync(videosDir, { recursive: true, force: true });
fs.rmSync(animsDir, { recursive: true, force: true });

console.log("cleaned anims dir: " + animsDir);
console.log("cleaned videos dir: " + videosDir);