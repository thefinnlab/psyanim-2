import { ParameterType } from 'jspsych';

import PsyanimApp from '../../src/core/PsyanimApp';

import PsyanimAnimationBaker from '../core/components/utils/PsyanimAnimationBaker';

import PsyanimComponentStateRecorder from '../core/components/utils/PsyanimComponentStateRecorder';

/**
 *  _PsyanimJsPsychPlugin is a private singleton instance that maintains state across all trials
 *  and handles all communication with PsyanimApp.
 */
class _PsyanimJsPsychPlugin {

    static get Instance() {

        if (_PsyanimJsPsychPlugin._instance == null)
        {
            _PsyanimJsPsychPlugin._instance = new _PsyanimJsPsychPlugin();
        }

        return _PsyanimJsPsychPlugin._instance;
    }

    static _instance = null;

    constructor() {

        console.log("Psyanim jsPsych plugin initialized!");

        this._currentTrialIndex = 0;
    }

    get jsPsych() {

        return this._jsPsych;
    }

    set jsPsych(value) {

        this._jsPsych = value;
    }

    beginNextTrial(display_element, trial) {

        // TODO: add some error checking on the parameter set!

        console.log("starting next trial!");

        this._jsPsych.pluginAPI.clearAllTimeouts();
        this._jsPsych.pluginAPI.cancelAllKeyboardResponses();

        this._currentTrial = trial;

        // add phaser game canvas to display element
        this._displayElement = display_element;

        display_element.appendChild(PsyanimApp.Instance.domElement);

        PsyanimApp.Instance.setCanvasVisible(true);

        // load scene and add parameter-set to game registry
        PsyanimApp.Instance.loadScene(trial.sceneKey);

        PsyanimApp.Instance.game.registry.set('psyanim_currentParameterSet', trial.sceneParameters);

        if (trial.agentNamesToRecord && trial.agentNamesToRecord.length > 0)
        {
            let trialScene = this._getScene(trial.sceneKey);

            trialScene.events.on('create', this._setupAnimationBaking, this);
        }

        // setup any timeouts that are configured
        if (trial.duration > 0)
        {
            this._jsPsych.pluginAPI.setTimeout(() => this.endTrial(), trial.duration);
        }

        // setup keyboard inputs
        if (trial.endTrialKeys.length > 0) {

            // let Psyanim process keys related to interactivity, but have jsPsych
            // process keystrokes related to GUI & progressing the experiment trials
            this._jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: () => this.endTrial(),
                valid_responses: trial.endTrialKeys, // can also be any keycode, e.g. ' ' for space, 'i', 'u', etc...f
                persist: false
            });
        }
    }

    endTrial() {

        this._jsPsych.pluginAPI.clearAllTimeouts();
        this._jsPsych.pluginAPI.cancelAllKeyboardResponses();

        // save off documents if document writer configured
        if (this._documentWriter)
        {
            // gather agent metadata
            let agentMetadata = [];

            if (this._currentTrial.agentNamesToRecord)
            {
                let agentsToRecord = this._getAgentsByName(this._currentTrial.agentNamesToRecord);

                agentsToRecord.forEach(agent => {

                    let metadata = {
                        name: agent.name,
                        shapeParams: agent.shapeParams
                    };

                    if (this._currentTrial.recordAnimationClips)
                    {
                        // save baked animation data
                        let animationBaker = agent.getComponent(PsyanimAnimationBaker);
                        animationBaker.stop();
            
                        let animData = animationBaker.clip.toArray();

                        metadata.animationClipId = this._documentWriter.addAnimationClip(animData);
                    }

                    // save agent state logs
                    if (this._currentTrial.recordStateLogs)
                    {
                        let recorders = agent.getComponentsByType(PsyanimComponentStateRecorder);

                        if (recorders)
                        {
                            metadata.stateLogs = [];

                            recorders.forEach(recorder => {

                                console.log(recorder.data);

                                let stateLogId = this._documentWriter.addAgentStateLog(recorder.data);

                                metadata.stateLogs.push({
                                    stateLogId: stateLogId,
                                    componentTypeName: recorder.componentType.name,
                                });
                            });
                        }    
                    }

                    agentMetadata.push(metadata);
                });
            }

            // gather trial metadata
            let trialMetadata = {

                sessionID: PsyanimApp.Instance.sessionID,
                userID: this._currentTrial.userID,
                experimentName: this._currentTrial.experimentName,
                trialNumber: this._currentTrialIndex,
                sceneKey: this._currentTrial.sceneKey,
                agentMetadata: agentMetadata,
            };

            this._documentWriter.addExperimentTrialMetadata(trialMetadata);

            console.log(trialMetadata);
        }

        // progress to the next trial
        this._currentTrialIndex++;

        // remove phaser game canvas from display element
        PsyanimApp.Instance.setCanvasVisible(false);

        this._displayElement.removeChild(PsyanimApp.Instance.domElement);
        this._displayElement = null;

        this._currentTrial = null;

        // this must be called to end the trial and proceed to the next one!
        this._jsPsych.finishTrial();
    }

    _getScene(key) {

        return PsyanimApp.Instance.currentScene.scene.get(key);
    }

    _setupAnimationBaking(scene) {

        let agentsToRecord = this._getAgentsByName(this._currentTrial.agentNamesToRecord);

        if (agentsToRecord.length > 0)
        {
            agentsToRecord.forEach(agent => {
                agent.addComponent(PsyanimAnimationBaker).start();
            });
        }

        scene.events.off('create', this._setupAnimationBaking, this);
    }

    _getAgentsByName(agentNames) {

        let agents = [];

        agentNames.forEach(name => {

            let agent = null;

            let hasWildcard = name.split('*').length > 1;

            if (hasWildcard) // handle wildcard case
            {
                let nameRoot = name.split('*')[0];

                let entityNames = PsyanimApp.Instance.currentScene.getAllEntityNames()
                    .filter(entityName => entityName.startsWith(nameRoot));

                entityNames.forEach(entityName => {
                    
                    agent = PsyanimApp.Instance.currentScene.getEntityByName(entityName);

                    if (agent)
                    {
                        agents.push(agent);
                    }
                    else
                    {
                        console.error("ERROR: invalid agent name to record: " + name);
                    }
                });
            }
            else // handle single agent case
            {
                agent = PsyanimApp.Instance.currentScene.getEntityByName(name);

                if (agent)
                {
                    agents.push(agent);
                }
                else
                {
                    console.error("ERROR: invalid agent name to record: " + name);
                }
            }
        });

        return agents;
    }
}

export default class PsyanimJsPsychPlugin {

    static info = {
            name: 'psyanim-jsPsych-plugin',
            parameters: {

                sceneKey: {
                    type: ParameterType.HTML_STRING,
                    default: undefined
                },

                sceneParameters: {
                    type: ParameterType.OBJECT,
                    default: {}
                },

                endTrialKeys: {
                    type: ParameterType.KEYS,
                    default: ['enter']
                },

                duration: {
                    type: ParameterType.FLOAT,
                    default: -1.0
                },

                agentNamesToRecord: {
                    type: ParameterType.OBJECT,
                    default: []
                },

                recordAnimationClips: {
                    type: ParameterType.BOOL,
                    default: true
                },

                recordStateLogs: {
                    type: ParameterType.BOOL,
                    default: true
                }
            }
    };

    static setDocumentWriter(writer) {

        _PsyanimJsPsychPlugin.Instance._documentWriter = writer;
    }

    constructor(jsPsych) {

        _PsyanimJsPsychPlugin.Instance.jsPsych = jsPsych;
    }

    trial(display_element, trial) {

        _PsyanimJsPsychPlugin.Instance.beginNextTrial(display_element, trial);;
    }
}