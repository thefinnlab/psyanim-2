import { initJsPsych } from 'jspsych';

import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import PsyanimJsPsychPlugin from '../../src/integrations/PsyanimJsPsychPlugin';

import PsyanimApp from '../../src/core/PsyanimApp';

import EmptyScene from './EmptyScene';

/**
 *  Setup Psyanim and PsyanimJsPsychPlugin
 */
PsyanimApp.Instance.config.registerScene(EmptyScene);

PsyanimApp.Instance.run();

PsyanimApp.Instance.setCanvasVisible(false);

/**
 *  Setup jsPsych experiment
 */

const userID = 'Jason';
const experimentName = '___experimentName';

const jsPsych = initJsPsych();

let welcome = {
    type: htmlKeyboardResponse,
    stimulus: 'Welcome to the experiment.  Press any key to begin.'
};

let emptySceneTrial = {
    type: PsyanimJsPsychPlugin,
    sceneKey: EmptyScene.KEY,
    experimentName: experimentName,
    userID: userID,
    sceneParameters: { },
};

let goodbye = {
    type: htmlKeyboardResponse,
    stimulus: 'Congrats - you have completed your first experiment!  Press any key to end this trial.'
};

jsPsych.run([welcome, emptySceneTrial, goodbye]);