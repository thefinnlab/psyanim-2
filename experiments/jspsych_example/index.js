import { initJsPsych } from 'jspsych';

import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import imageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';
import preload from '@jspsych/plugin-preload';

import PsyanimJsPsychPlugin from '../../src/integrations/PsyanimJsPsychPlugin';

import PsyanimApp from '../../src/core/PsyanimApp';

import EmptyScene from './EmptyScene';
import PointClickMovementScene from './PointClickMovementScene';
import FleeScene from './FleeScene';
import WanderScene from './WanderScene';

import PsyanimFirebaseClient from '../../src/utils/PsyanimFirebaseClient';

/**
 *  Setup Psyanim
 */
PsyanimApp.Instance.config.registerScene(EmptyScene);
PsyanimApp.Instance.config.registerScene(PointClickMovementScene);
PsyanimApp.Instance.config.registerScene(WanderScene);
PsyanimApp.Instance.config.registerScene(FleeScene);

PsyanimApp.Instance.run();

PsyanimApp.Instance.setCanvasVisible(false);

/**
 *  Setup PsyanimJsPsychPlugin
 */

const firebaseClient = new PsyanimFirebaseClient();

PsyanimJsPsychPlugin.setDocumentWriter(firebaseClient);

/**
 *  Setup jsPsych experiment
 * 
 *  Test demonstrates mixing  'PsyanimJsPsychPlugin' trials with other types of plugins in jsPsych
 */

const userID = 'testerABCD1234';
const experimentName = 'hello_jsPsych';

const jsPsych = initJsPsych();

let welcome = {
    type: htmlKeyboardResponse,
    stimulus: 'Welcome to the experiment.  Press any key to begin.'
};

let keyboardResponseTrial = {
    type: htmlKeyboardResponse,
    stimulus: 'Press any key to continue...',
    post_trial_gap: 500,
};

var preloadTrial = {
    type: preload,
    images: ['img/blue.png', 'img/orange.png']
};  

var blue_trial = {
    type: imageKeyboardResponse,
    stimulus: 'img/blue.png',
    choices: ['f', 'j']
};

var orange_trial = {
    type: imageKeyboardResponse,
    stimulus: 'img/orange.png',
    choices: ['f', 'j']
};  

let pointclickTrial1 = {
    type: PsyanimJsPsychPlugin,
    sceneKey: PointClickMovementScene.KEY,
    experimentName: experimentName,
    userID: userID,
    sceneParameters: { 
        initialPos: { x: 600, y: 100 }
    },
    agentNamesToRecord: ['agent1'],
    post_trial_gap: 300,
};

let pointclickTrial2 = {
    type: PsyanimJsPsychPlugin,
    sceneKey: PointClickMovementScene.KEY,
    experimentName: experimentName,
    userID: userID,
    sceneParameters: { 
        initialPos: { x: 600, y: 500 }
    },
    agentNamesToRecord: ['agent1'],
    post_trial_gap: 300,
};

let fleeTrial = {
    type: PsyanimJsPsychPlugin,
    sceneKey: FleeScene.KEY,
    experimentName: experimentName,
    userID: userID,
    agentNamesToRecord: ['mouseFollowTarget', 'agent1', 'agent2'],
    post_trial_gap: 300    
}

let wanderTrial = {
    type: PsyanimJsPsychPlugin,
    sceneKey: WanderScene.KEY,
    experimentName: experimentName,
    userID: userID,
    sceneParameters: {
        nAgents: 5
    },
    agentNamesToRecord: ['agent*'],
    post_trial_gap: 300
};

jsPsych.run([preloadTrial, welcome, 
    pointclickTrial1, keyboardResponseTrial, 
    pointclickTrial2, keyboardResponseTrial, 
    blue_trial, orange_trial,
    fleeTrial, keyboardResponseTrial,
    wanderTrial]);