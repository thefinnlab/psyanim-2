import { initJsPsych } from 'jspsych';

import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import PsyanimJsPsychPlugin from '../../src/integrations/PsyanimJsPsychPlugin';

import PsyanimApp from '../../src/core/PsyanimApp';

import EmptyScene from './EmptyScene';

import WolfpackScene from './WolfpackScene';

/**
 *  Setup Psyanim and PsyanimJsPsychPlugin
 */
PsyanimApp.Instance.config.registerScene(EmptyScene);
PsyanimApp.Instance.config.registerScene(WolfpackScene);

PsyanimApp.Instance.run();

PsyanimApp.Instance.setCanvasVisible(false);

/**
 *  Setup jsPsych experiment
 */

const userID = 'Jason';
const experimentName = 'interactive_wolfpack';

const jsPsych = initJsPsych();

let welcome = {
    type: htmlKeyboardResponse,
    stimulus: 'Welcome to the experiment.  Press any key to begin.'
};

let pressAnyKeyToContinue = {
    type: htmlKeyboardResponse,
    stimulus: 'Press any key to continue to the next trial...'
};

let predatorTrial = {
    type: PsyanimJsPsychPlugin,
    sceneKey: WolfpackScene.KEY,
    experimentName: experimentName,
    userID: userID,
    sceneParameters: {
        nAgents: 100,
        agentRadius: 6,
        maxAgentSpeed: 1.5,
        playerIsPredator: true
    }
}

let preyTrial = {
    type: PsyanimJsPsychPlugin,
    sceneKey: WolfpackScene.KEY,
    experimentName: experimentName,
    userID: userID,
    sceneParameters: {
        nAgents: 100,
        agentRadius: 6,
        maxAgentSpeed: 1.5,
        playerIsPredator: false
    }
}

let goodbye = {
    type: htmlKeyboardResponse,
    stimulus: 'Congrats - you have completed your first experiment!  Press any key to end this trial.'
};

jsPsych.run([welcome, preyTrial, pressAnyKeyToContinue, predatorTrial, goodbye]);