import { initJsPsych } from 'jspsych';

import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import PsyanimJsPsychPlugin from '../../src/integrations/PsyanimJsPsychPlugin';

import PsyanimApp from '../../src/core/PsyanimApp';

import EmptyScene from './EmptyScene';
import PlayfightScene from './PlayfightScene';

import PsyanimFirebaseClient from '../../src/utils/PsyanimFirebaseClient';

import firebaseConfig from '../../firebase.config.json';


/**
 *  Setup Psyanim and PsyanimJsPsychPlugin
 */
PsyanimApp.Instance.config.registerScene(EmptyScene);
PsyanimApp.Instance.config.registerScene(PlayfightScene);

PsyanimApp.Instance.run();

PsyanimApp.Instance.setCanvasVisible(false);

/**
 *  Setup PsyanimJsPsychPlugin
 */

const firebaseClient = new PsyanimFirebaseClient(firebaseConfig);

PsyanimJsPsychPlugin.setDocumentWriter(firebaseClient);

/**
 *  Setup jsPsych experiment
 */

const userID = 'Jason';
const experimentName = 'playfight_v2';

const jsPsych = initJsPsych();

let timeline = [];

let welcome = {
    type: htmlKeyboardResponse,
    stimulus: 'Welcome to the experiment.  Press any key to begin.'
};

timeline.push(welcome);

let loadingTrial = {
    type: htmlKeyboardResponse,
    stimulus: 'Press any key to begin the next trial!'
};

// declare your variables that vary from run to run in arrays
let experimentDurations = [4000, 6000, 7000, 8000, 10000]; // every experiment run needs a duration set
let breakDurations = [2000, 2500, 3000, 3500, 4000];

let maxChargeSpeeds = [8, 9, 10, 11, 12];

for (let i = 0; i < experimentDurations.length; ++i)
{
    let playfightSceneTrial = {
        type: PsyanimJsPsychPlugin,
        sceneKey: PlayfightScene.KEY,
        experimentName: experimentName,
        userID: userID,
        sceneParameters: { 
    
            // declare the rest of your parameters that remain constant between runs
            maxChargeAcceleration: 0.4,
    
            circleAgentRadius: 12,
            outerDecelerationRadius: 30,
    
            maxWanderSpeed: 4,
            maxWanderAcceleration: 0.2,
    
            wanderRadius: 50,
            wanderOffset: 250,
            maxWanderAngleChangePerFrame: 20,
    
            maxFleeSpeed: 4,
            maxFleeAcceleration: 0.2,
            panicDistance: 100,
        },
        agentNamesToRecord: ['agent0', 'agent1'],
    };

    playfightSceneTrial.sceneParameters.experimentDuration = experimentDurations[i];

    playfightSceneTrial.sceneParameters.breakDuration = breakDurations[i];
    playfightSceneTrial.sceneParameters.maxChargeSpeed = maxChargeSpeeds[i];

    timeline.push(playfightSceneTrial);
    timeline.push(loadingTrial);
}

let goodbye = {
    type: htmlKeyboardResponse,
    stimulus: 'Congrats - you have completed your first experiment!  Press any key to end this trial.'
};

timeline.push(goodbye);

jsPsych.run(timeline);