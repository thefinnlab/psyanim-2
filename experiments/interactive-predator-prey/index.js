import { initJsPsych } from 'jspsych';

import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import PsyanimJsPsychPlugin from '../../src/integrations/PsyanimJsPsychPlugin';

import PsyanimApp from '../../src/core/PsyanimApp';

import InteractivePredator from './InteractivePredator';
import InteractivePrey from './InteractivePrey';

/**
 *  Setup Psyanim and PsyanimJsPsychPlugin
 */
PsyanimApp.Instance.config.registerScene(InteractivePredator);
PsyanimApp.Instance.config.registerScene(InteractivePrey);

PsyanimApp.Instance.run();

PsyanimApp.Instance.setCanvasVisible(false);

/**
 *  Setup jsPsych experiment
 */

const userID = 'Jason';
const experimentName = 'interactive-predator-prey';

const jsPsych = initJsPsych();

let welcome = {
    type: htmlKeyboardResponse,
    stimulus: 'Welcome to the experiment.  Press any key to begin.'
};

let pressAnyKeyToContinue = {
    type: htmlKeyboardResponse,
    stimulus: 'Press any key to continue to the next trial...'
};

let interactivePredatorTrial = {
    type: PsyanimJsPsychPlugin,
    sceneKey: InteractivePredator.KEY,
    experimentName: experimentName,
    userID: userID,
    sceneParameters: { },
};

let interactivePreyTrial = {
    type: PsyanimJsPsychPlugin,
    sceneKey: InteractivePrey.KEY,
    experimentName: experimentName,
    userID: userID,
    sceneParameters: { },
};

let goodbye = {
    type: htmlKeyboardResponse,
    stimulus: 'Congrats - you have completed your first experiment!  Press any key to end this trial.'
};

jsPsych.run([welcome, interactivePredatorTrial, pressAnyKeyToContinue, interactivePreyTrial, goodbye]);