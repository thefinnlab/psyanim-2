import minimist from 'minimist';

import path from 'path';
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

    console.log('Experiment Name: ' + experimentName);

    // gather template file paths
    let srcDir = './src';

    if (!fs.existsSync(srcDir))
    {
        srcDir = '../src';

        if (!fs.existsSync(srcDir))
        {
            console.log("\nERROR: failed to find /src directory!\n");
            process.exit();
        }
    }

    let templateFiles = {
        indexHtmlPath: path.join(srcDir, 'test/core/templates/experiment/index.template.html'),
        indexJsPath: path.join(srcDir, 'test/core/templates/experiment/index.template.js'),
        webpackPath: path.join(srcDir, 'test/core/templates/experiment/webpack.template.config.js'),
        experimentDefinitionPath: path.join(srcDir, 'test/core/templates/experiment/ExperimentDefinition.template.js'),
        componentPath: path.join(srcDir, 'test/core/templates/PsyanimComponent.template.js'),
        scenePath: path.join(srcDir, 'test/core/templates/PsyanimScene.template.js'),
    };

    console.log(templateFiles);

    // setup experiment directory
    let rootDir = './experiments';

    if (!fs.existsSync(rootDir))
    {
        rootDir = '../experiments';

        if (!fs.existsSync(rootDir))
        {
            console.log("\nERROR: failed to find experiment directory!\n");
            process.exit();
        }
    }

    if (!isDirectory(rootDir))
    {
        console.log("ERROR: " + rootDir + " is not a directory!");
    }

    let experimentDirectory = path.join(rootDir, experimentName);

    if (!fs.existsSync(experimentDirectory))
    {
        // let's create the directory
        fs.mkdirSync(experimentDirectory, { recursive: true });

        // TODO: read in files, replace names as expected and write out to experimentDirectory
        // with the appropriate names

        // TODO: update package.json to have commands to build and run this experiment
    }




    
    // create components
    let createComponent = argv.c || argv.component;
    let createScene = argv.s || argv.scene;

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

        console.log("Component Names: " + JSON.stringify(componentNames));
    }

    // create scenes
    if (createScene)
    {
        let sceneNames = null;

        if (argv.s)
        {
            sceneNames = argv.s.split(',');
        }
        else
        {
            sceneNames = argv.scene.split(',');
        }

        console.log("Scene Name: " + JSON.stringify(sceneNames));
    }
}