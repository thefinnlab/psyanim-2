import minimist from 'minimist';

import path, { dirname } from 'path';
import fs from 'fs';

let argv = minimist(process.argv.slice(2));

const showHelp = () => {

    console.log("\nPsyanim CLI - a tool for quickly setting up Psyanim Experiments\n");
    console.log("Usage: node ./psyanim_cli.mjs <options> experimentName\n");
    console.log("Options: \n\n" + 
        "-h, --help                             output usage information\n" + 
        "-c, --component                        create new component in an existing project\n" +
        "-s, --scene                            create new scene\n");
};

// root dirs can be relative to ./tools, so we check this dir ./ as well as ../
const findRootDir = (name) => {

    let dirPath = path.resolve("./", name);

    if (!fs.existsSync(dirPath) || path.basename(dirPath) == 'tools')
    {
        dirPath = path.join('../', name);

        if (!fs.existsSync(dirPath))
        {
            console.log("\nERROR: failed to find /" + name + " directory!\n");
            process.exit();
        }
    }

    if (!isDirectory(dirPath))
    {
        console.log("ERROR: " + dirPath + " is not a directory!");
    }

    return dirPath;
}

const convertToPosixPath = (pathString) => pathString.split(path.sep).join(path.posix.sep);
const isDirectory = (pathString) => fs.lstatSync(pathString).isDirectory();
const isFile = (pathString) => fs.lstatSync(pathString).isFile();

if (argv.h || argv.help)
{
    showHelp();
}
else
{
    let experimentName = argv._[0];

    if (!experimentName)
    {
        console.log("\nERROR: no experiment name specified.");
        showHelp();
        process.exit();
    }

    // gather template file paths
    let srcDir = findRootDir('src');

    let templateFilePaths = {
        packageJson: path.join(findRootDir(''), 'package.json'),
        indexHtml: path.join(srcDir, 'core/templates/experiment/index.template.html'),
        indexJs: path.join(srcDir, 'core/templates/experiment/index.template.js'),
        webpack: path.join(srcDir, 'core/templates/experiment/webpack.template.config.js'),
        component: path.join(srcDir, 'core/templates/PsyanimComponent.template.js'),
        scene: path.join(srcDir, 'core/templates/PsyanimScene.template.js'),
    };

    // setup experiment directory
    let rootDir = findRootDir('experiments');

    let experimentDirectory = path.join(rootDir, experimentName);

    if (!fs.existsSync(experimentDirectory))
    {
        fs.mkdirSync(experimentDirectory, { recursive: true });

        console.log("Created experiment directory at: " + experimentDirectory);
    }

    let experimentFilePaths = {
        webpack: path.join(findRootDir(''), 'webpack.' + experimentName + '.config.js'),
        indexHtml: path.join(experimentDirectory, 'index.html'),
        indexJs: path.join(experimentDirectory, 'index.js'),
    }

    // update package.json if it doesn't have the commands yet
    let packageJson = JSON.parse(fs.readFileSync(templateFilePaths.packageJson, { encoding: 'utf8' }));

    let modifiedPackageJson = false;

    let buildCmdName = experimentName + '-build';
    let watchCmdName = experimentName + '-watch';

    if (!Object.hasOwn(packageJson.scripts, buildCmdName))
    {
        packageJson.scripts[buildCmdName] = 
            "rimraf -v ./dist && webpack --config ./webpack." + experimentName + ".config.js";

        modifiedPackageJson = true;
    }

    if (!Object.hasOwn(packageJson.scripts, watchCmdName))
    {
        packageJson.scripts[watchCmdName] = 
            "rimraf -v ./dist && webpack --config ./webpack." + experimentName + ".config.js --watch";

        modifiedPackageJson = true;
    }

    if (modifiedPackageJson)
    {
        fs.writeFileSync(templateFilePaths.packageJson, JSON.stringify(packageJson, null, 2));

        console.log("Updated package.json with new build commands!");
    }

    let createdWebpackConfig = false;

    // create webpack config if it doesn't exist
    if (!fs.existsSync(experimentFilePaths.webpack))
    {
        let webpackTemplate = fs.readFileSync(templateFilePaths.webpack, { encoding: 'utf8' });

        webpackTemplate = webpackTemplate.replace(/___experimentName/g, experimentName);

        fs.writeFileSync(experimentFilePaths.webpack, webpackTemplate);

        createdWebpackConfig = true;

        console.log("Created webpack config at: " + experimentFilePaths.webpack);
    }

    // create index.html if it doesn't exist
    if (!fs.existsSync(experimentFilePaths.indexHtml))
    {
        let indexHtmlTemplate = fs.readFileSync(templateFilePaths.indexHtml, { encoding: 'utf8' });

        fs.writeFileSync(experimentFilePaths.indexHtml, indexHtmlTemplate);

        console.log("Created index.html at: " + experimentFilePaths.indexHtml);
    }

    // create index.js if it doesn't exist
    if (!fs.existsSync(experimentFilePaths.indexJs))
    {
        let indexJsTemplate = fs.readFileSync(templateFilePaths.indexJs, { encoding: 'utf8' });

        indexJsTemplate = indexJsTemplate.replace(/___experimentName/g, experimentName);

        fs.writeFileSync(experimentFilePaths.indexJs, indexJsTemplate);

        console.log("Created index.js at: " + experimentFilePaths.indexJs);
    }

    // create components if they don't already exist
    let createComponent = argv.c || argv.component;
    let createScene = argv.s || argv.scene || createdWebpackConfig;

    if (createComponent) {

        let componentNames = null;

        if (argv.c)
        {
            componentNames = argv.c.split(',');
        }
        else
        {
            componentNames = argv.component.split(',');
        }

        let componentTemplate = fs.readFileSync(templateFilePaths.component, { encoding: 'utf8' });

        for (let i = 0; i < componentNames.length; ++i)
        {
            let componentName = componentNames[i];

            let componentFilePath = path.join(experimentDirectory, componentName + '.js');

            if (!fs.existsSync(componentFilePath))
            {
                let componentCode = componentTemplate.replace(/___componentName/g, componentName);

                fs.writeFileSync(componentFilePath, componentCode);

                console.log("Created component at path: " + componentFilePath);
            }
        }
    }

    // create scenes if they don't already exist
    if (createScene)
    {
        let sceneNames = [];

        if (argv.s)
        {
            sceneNames = argv.s.split(',');
        }
        else if (argv.scene)
        {
            sceneNames = argv.scene.split(',');
        }

        if (createdWebpackConfig) // if we have a new project
        {
            // make sure there's always a blank 'Empty Scene'
            sceneNames.unshift('EmptyScene');
        }

        let sceneTemplate = fs.readFileSync(templateFilePaths.scene, { encoding: 'utf8' });

        for (let i = 0; i < sceneNames.length; ++i)
        {
            let sceneName = sceneNames[i];

            let sceneFilePath = path.join(experimentDirectory, sceneName + '.js');

            if (!fs.existsSync(sceneFilePath))
            {
                let sceneCode = sceneTemplate.replace(/___sceneName/g, sceneName);
                sceneCode = sceneCode.replace(/___sceneKey/g, sceneName);

                fs.writeFileSync(sceneFilePath, sceneCode);

                console.log("Created scene at path: " + sceneFilePath);
            }
        }
    }
}