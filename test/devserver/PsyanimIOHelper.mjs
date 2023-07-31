import fs from 'fs';
import path from 'path';

export default class PsyanimIOHelper {

    static absoluteDirectoryPath(...args) {

        return path.resolve(path.join(...args));
    }

    static deleteAllSubdirs(dirPath) {

        fs.readdir(dirPath, (err, fileNames) => {

            if (err)
            {
                console.log("ERROR reading files in dirPath: " + dirPath);
            }

            fileNames.forEach(fileName => {

                fs.rmSync(path.join(dirPath, fileName), { recursive: true, force: true });
            });
        });
    }

    static absoluteFilePath(dirpath, filename) {

        return path.resolve(path.join(dirpath, filename));
    }

    static createDir(dirpath) {

        if (!fs.existsSync(dirpath))
        {
            fs.mkdirSync(dirpath, { recursive: true });
        }
    }

    static getNextRunVariationFilePath(dirpath, fileExtension) {

        const filenameBase = 'variation_';

        PsyanimIOHelper.createDir(dirpath);

        let filenameIndex = 0;

        let filePath = PsyanimIOHelper.absoluteFilePath(
            dirpath, filenameBase + filenameIndex.toString().padStart(4, '0') + fileExtension);

        while (fs.existsSync(filePath))
        {
            filenameIndex++;

            filePath = PsyanimIOHelper.absoluteFilePath(
                dirpath, filenameBase + filenameIndex.toString().padStart(4, '0') + fileExtension);    
        }

        return filePath;
    }

    static createExperimentRunFolders(projectDir, experimentName, runName) {

        let videosDir = PsyanimIOHelper.absoluteDirectoryPath(
            projectDir, 'videos', experimentName);

        let videoRunDir = PsyanimIOHelper.absoluteDirectoryPath(videosDir, runName);

        let animsDir = PsyanimIOHelper.absoluteDirectoryPath(
            projectDir, 'anims', experimentName);

        let animRunDir = PsyanimIOHelper.absoluteDirectoryPath(
            animsDir, runName);

        PsyanimIOHelper.createDir(videoRunDir);
        PsyanimIOHelper.createDir(animRunDir);

        return {

            videosDir: videosDir,
            videoRunDir: videoRunDir,

            animsDir: animsDir,
            animRunDir: animRunDir
        };
    }
}