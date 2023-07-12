import { initJsPsych } from 'jspsych';

import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import PsyanimJsPsychPlugin from '../../src/integrations/PsyanimJsPsychPlugin';

import PsyanimApp from '../../src/core/PsyanimApp';

import EmptyScene from './EmptyScene';
import PlayfightScene from './PlayfightScene';

/**
 *  Setup Psyanim and PsyanimJsPsychPlugin
 */
PsyanimApp.Instance.config.registerScene(EmptyScene);
PsyanimApp.Instance.config.registerScene(PlayfightScene);

PsyanimApp.Instance.run();

PsyanimApp.Instance.setCanvasVisible(false);

/**
 *  Setup jsPsych experiment
 */

const userID = 'Jason';
const experimentName = 'playfight_v2';

const jsPsych = initJsPsych();

let welcome = {
    type: htmlKeyboardResponse,
    stimulus: 'Welcome to the experiment.  Press any key to begin.'
};

let loadingTrial = {
    type: htmlKeyboardResponse,
    stimulus: 'Press any key to begin the next trial!'
};

let playfightSceneTrial = {
    type: PsyanimJsPsychPlugin,
    sceneKey: PlayfightScene.KEY,
    experimentName: experimentName,
    userID: userID,
    sceneParameters: { },
};

let goodbye = {
    type: htmlKeyboardResponse,
    stimulus: 'Congrats - you have completed your first experiment!  Press any key to end this trial.'
};

jsPsych.run([welcome, loadingTrial, playfightSceneTrial, goodbye]);