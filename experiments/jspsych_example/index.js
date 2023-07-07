import { initJsPsych } from 'jspsych';

import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import PsyanimJsPsychPlugin from './PsyanimJsPsychPlugin';

import PsyanimApp from '../../src/core/PsyanimApp';

import PointClickMovementScene from './PointClickMovementScene';

// register psyanim scenes and run the app o/
PsyanimApp.Instance.config.registerScene(PointClickMovementScene);

PsyanimApp.Instance.run();

PsyanimApp.Instance.setCanvasVisible(false);

// init jsPsych experiment
const jsPsych = initJsPsych({
    display_element: 'jspsych-target'
});

let experimentIndex = -1;

let getExperimentIndex = function() {
    return experimentIndex++;
};

let reportExperimentIndex = function() {
    console.log("experiment index = " + experimentIndex);
}

/**
 *  Init jsPsysch experiment
 * 
 *  Test demonstrates mixing  'PsyanimJsPsychPlugin' trials with other types of plugins in jsPsych
 */

let welcome = {
    type: htmlKeyboardResponse,
    stimulus: 'Welcome to the experiment.  Press any key to begin.'
};

let keyboardResponseTrial = {
    type: htmlKeyboardResponse,
    stimulus: 'Press any key to continue...',
    post_trial_gap: 2000,
};

// basic trial w/ custom parameters and function parameters
let myCustomTrial1 = {
    type: PsyanimJsPsychPlugin,
    speed: 98,
    target: "i'm a target!",
    myObject: {
        name: "bob",
        age: 42,
        itWorks: true
    },
    myEvaluatedFunctionParameter: getExperimentIndex,
    myUnevaluatedFunctionParameter: reportExperimentIndex,
    post_trial_gap: 2000,
};

// basic trial with custom parameters + function parameters where myObject has different fields than the 1st
let myCustomTrial2 = {
    type: PsyanimJsPsychPlugin,
    speed: 38,
    target: "I'm the next target!",
    myObject: {
        name: "elsa",
        age: 31,
        itWorkedAgain: true
    },
    myEvaluatedFunctionParameter: getExperimentIndex,
    myUnevaluatedFunctionParameter: reportExperimentIndex,
    post_trial_gap: 2000,
};

let myCustomTrial3 = myCustomTrial2;

jsPsych.run([welcome, 
    myCustomTrial1, keyboardResponseTrial, 
    myCustomTrial2, keyboardResponseTrial, 
    myCustomTrial3]);
