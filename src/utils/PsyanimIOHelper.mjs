import fs from 'fs';

export default class PsyanimIOHelper {

    static absolutePath(dirpath, filename) {

        return path.resolve(path.join(dirpath, filename));
    }

    static createDir(dirpath) {

        if (!fs.existsSync(dirpath))
        {
            fs.mkdirSync(dirpath, { recursive: true });
        }
    }

    static getNextAvailableFileIndex(dirpath, filenameBase) {

        PsyanimIOHelper.createDir(dirpath);

        let filenameIndex = 0;

        // TODO: implement

        // let filePath = dirpath + 

        // while (fs.existsSync())
    }

    static createSubdir(dirpath, subdirName) {
     
        // TODO: implement
    }

    static createExperimentRunFolders(projectDir, experimentName) {

        // TODO: let's use Date.now() for uniquely capturing experiment runs in /videos and /anim
        // let timestamp = Date.now();

        // TODO: make sure projectDir/videos/experimentName/timestamp/ dir exitsts
        // and also make sure projectDir/anim/experimentName/timestamp/ dir exists!
    }
}