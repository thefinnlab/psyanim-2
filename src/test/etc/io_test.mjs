import fs from 'fs';
import PsyanimIOHelper from "../../utils/PsyanimIOHelper.mjs";

let projectDir = './experiments';
let experimentName = 'playfight';
let runName = Date.now().toString();

let experimentPaths = PsyanimIOHelper.createExperimentRunFolders(
    projectDir, experimentName, runName);

console.log(JSON.stringify(experimentPaths, null, '\n') + '\n');

for (let i = 0; i < 42; ++i)
{
    let nextVideoRunVariationFilePath = PsyanimIOHelper.getNextRunVariationFilePath(
        experimentPaths.videoRunDir, ".txt");    

    let nextAnimRunVariationFilePath = PsyanimIOHelper.getNextRunVariationFilePath(
        experimentPaths.animRunDir, ".txt");        

    fs.writeFileSync(nextVideoRunVariationFilePath, 'hello video o/');   
    fs.writeFileSync(nextAnimRunVariationFilePath, 'hello anim o/');   
}