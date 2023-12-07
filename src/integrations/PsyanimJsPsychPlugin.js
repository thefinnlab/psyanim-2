import { ParameterType } from 'jspsych';

import PsyanimApp from '../../src/core/PsyanimApp.js';

import PsyanimAnimationBaker from '../core/components/utils/PsyanimAnimationBaker.js';

import PsyanimComponentStateRecorder from '../core/components/utils/PsyanimComponentStateRecorder.js';

import PsyanimJsPsychTrialParameter from './PsyanimJsPsychTrialParameter.js';

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

    constructor() {

        console.log("Psyanim jsPsych plugin initialized!");

        this._domElement = document.getElementById('psyanim-app');

        this._currentTrialIndex = 0;
        this._clearConsoleOnNewTrial = true;
    }

    get jsPsych() {

        return this._jsPsych;
    }

    set jsPsych(value) {

        this._jsPsych = value;
    }

    set clearConsoleOnNewTrial(value) {

        this._clearConsoleOnNewTrial = value;
    }

    beginNextTrial(display_element, trial) {

        if (this._clearConsoleOnNewTrial)
        {
            console.clear();
        }

        console.log("starting next trial!");

        this._currentTrialJsPsychData = {};

        PsyanimApp.Instance.game.registry.set('psyanimJsPsychPlugin_trialData', this._currentTrialJsPsychData);

        this._jsPsych.pluginAPI.clearAllTimeouts();
        this._jsPsych.pluginAPI.cancelAllKeyboardResponses();

        this._currentTrial = trial;

        // add phaser game canvas to display element
        this._displayElement = display_element;

        if (!document.getElementById(this._domElement.id))
        {
            display_element.appendChild(this._domElement);
        }

        if (this._currentTrial.subtext)
        {
            this._subtextElement = document.createElement('p');
            this._subtextElement.innerHTML = this._currentTrial.subtext;

            this._subtextElement.classList.add('canvas-subtext');

            this._domElement.appendChild(this._subtextElement);
        }

        PsyanimApp.Instance.setCanvasVisible(true);

        // load scene and add parameter-set to game registry
        PsyanimApp.Instance.loadScene(trial.sceneKey);

        if (trial.agentNamesToRecord && trial.agentNamesToRecord.length > 0)
        {
            let trialScene = PsyanimApp.Instance.getSceneByKey(trial.sceneKey);

            trialScene.events.on('create', this._setupAnimationBaking, this);
        }

        // setup any timeouts that are configured
        if (trial.duration > 0)
        {
            this._jsPsych.pluginAPI.setTimeout(this.endTrial.bind(this), trial.duration);
        }

        // setup events
        if (trial.endTrialOnContact)
        {
            PsyanimApp.Instance.events.on('playerContact', this.endTrial, this);
        }

        if (trial.endTrialOnPlaybackComplete)
        {
            PsyanimApp.Instance.events.on('playbackComplete', this.endTrial, this);
        }

        PsyanimApp.Instance.events.on('psyanim-jspsych-endTrial', this.endTrial, this);

        // setup keyboard inputs
        if (trial.endTrialKeys.length > 0) {

            // let Psyanim process keys related to interactivity, but have jsPsych
            // process keystrokes related to GUI & progressing the experiment trials
            this._jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: this.endTrial.bind(this),
                valid_responses: trial.endTrialKeys, // can also be any keycode, e.g. ' ' for space, 'i', 'u', etc...f
                persist: false
            });
        }
    }

    _replaceInstancedEntityNames(agentNamesToRecord) {

        let sceneDefinition = PsyanimApp.Instance.config.getSceneDefinition(this._currentTrial.sceneKey);

        let instancedEntityBaseNames = [];
        let instancedEntityNames = [];

        for (let i = 0; i < agentNamesToRecord.length; ++i) 
        {
            let agentName = agentNamesToRecord[i];

            // handle wildcard case by taking name root as agent name for instanced agents
            let hasWildcard = agentName.split('*').length > 1;

            if (hasWildcard)
            {
                let nameRoot = agentName.split('*')[0];

                // make sure we ignore duplicates and filter out non-wildcard names that are same as nameRoot
                if (instancedEntityBaseNames.includes(nameRoot))
                {
                    continue;
                }

                agentName = nameRoot;
            }

            let entityDefinition = sceneDefinition.entities.find(e => e.name == agentName);

            if (!entityDefinition)
            {
                console.error('Failed to find an entity definition for agent name: ', agentName);
            }

            if (Object.hasOwn(entityDefinition, 'instances') && entityDefinition.instances > 1)
            {
                let nInstances = entityDefinition.instances;

                for (let j = 0; j < nInstances; ++j)
                {
                    let instanceName = agentName + '_' + (j + 1);

                    if (agentNamesToRecord.includes(instanceName))
                    {
                        console.error('Instance name already exists: ', instanceName);
                    }
                    else
                    {
                        if (!instancedEntityBaseNames.includes(agentName))
                        {
                            instancedEntityBaseNames.push(agentName);
                            instancedEntityBaseNames.push(agentName + '*'); // handle wildcards too
                        }
                        
                        instancedEntityNames.push(instanceName);
                    }
                }
            }
        }

        // remove the original base names used, as well as any wildcard versions
        agentNamesToRecord = agentNamesToRecord.filter(name => !instancedEntityBaseNames.includes(name));

        // add instanced entity names to agentNamesToRecord
        agentNamesToRecord.push(...instancedEntityNames);

        return agentNamesToRecord;
    }

    _expandWildcardAgentNames(agentNamesToRecord) {

        let sceneDefinition = PsyanimApp.Instance.config.getSceneDefinition(this._currentTrial.sceneKey);

        let wildcardNames = [];
        let expandedNames = [];

        for (let i = 0; i < agentNamesToRecord.length; ++i)
        {
            let agentName = agentNamesToRecord[i];

            // handle wildcard case by taking name root as agent name for instanced agents
            let hasWildcard = agentName.split('*').length > 1;

            if (hasWildcard)
            {
                let nameRoot = agentName.split('*')[0];

                let entityNames = sceneDefinition.entities
                    .filter(e => e.name.startsWith(nameRoot))
                    .map(e => e.name);

                expandedNames.push(...entityNames);
                wildcardNames.push(agentName);
            }
        }

        // remove the wildcards
        agentNamesToRecord = agentNamesToRecord.filter(name => !wildcardNames.includes(name));

        // add expanded names
        agentNamesToRecord.push(...expandedNames);

        return agentNamesToRecord;
    }

    endTrial() {

        this._jsPsych.pluginAPI.clearAllTimeouts();
        this._jsPsych.pluginAPI.cancelAllKeyboardResponses();

        // save off documents if document writer configured
        if (this._documentWriter)
        {
            // gather agent metadata
            let agentMetadata = [];

            let trialParameters = this._currentTrial.trialParameters;

            // get all agent names who have 'prefab' or 'component' trial parameters
            let trialParameterAgentNames = [...new Set(trialParameters
                .filter(p => { 
                    return p.parameterType === PsyanimJsPsychTrialParameter.Type.PREFAB_PARAMETER || 
                            p.parameterType === PsyanimJsPsychTrialParameter.Type.COMPONENT_PARAMETER 
                })
                .map(p => p.entityName))];

            let agentNamesToRecord = [...new Set(trialParameterAgentNames
                .concat(this._currentTrial.agentNamesToRecord))];

            // replace any agent names that are instanced
            agentNamesToRecord = this._replaceInstancedEntityNames(agentNamesToRecord);

            // replace any remaining wildcard, non-instanced agent names
            agentNamesToRecord = this._expandWildcardAgentNames(agentNamesToRecord);

            if (agentNamesToRecord)
            {
                let agentsToRecord = this._getAgentsByName(agentNamesToRecord);

                agentsToRecord.forEach(agent => {

                    let metadata = {
                        name: agent.name,
                        initialPosition: agent.initialPosition,
                        shapeParams: agent.shapeParams,
                        matterOptions: agent.matterOptions
                    };

                    if (trialParameterAgentNames.includes(agent.name))
                    {
                        // save off the trial parameters found for this agent
                        metadata.trialParameters = trialParameters
                            .filter(p => p.entityName === agent.name)
                            .map(p => {

                                // we don't save off the Entity name
                                let parameter = {
                                    parameterType: p.parameterType,
                                    parameterName: p.parameterName,
                                    parameterValue: p.parameterValue
                                };

                                // we don't save off the componentTypeName unless it's a component parameter
                                if (p.componentTypeName)
                                {
                                    parameter.componentTypeName = p.componentTypeName;
                                }

                                return parameter;
                            });
                    }

                    if (agentNamesToRecord.includes(agent.name) && 
                    this._currentTrial.recordAnimationClips)
                    {
                        // save baked animation data
                        let animationBaker = agent.getComponent(PsyanimAnimationBaker);
                        animationBaker.stop();
            
                        metadata.animationClipId = this._documentWriter
                            .addAnimationClip(animationBaker.clip.getData());
                    }

                    // save agent state logs
                    if (agentNamesToRecord.includes(agent.name) && 
                        this._currentTrial.recordStateLogs)
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
            if (this._currentTrial.saveTrialMetadata)
            {
                let trialMetadata = {

                    sessionID: PsyanimApp.Instance.sessionID,
                    userID: this._userID,
                    experimentName: this._experimentName,
                    trialNumber: this._currentTrialIndex,
                    sceneKey: this._currentTrial.sceneKey,
                    agentMetadata: agentMetadata,
                };
    
                // add scene parameters to trial metadata
                let trialSceneParameters = this._currentTrial.trialParameters
                    .filter(p => p.parameterType === PsyanimJsPsychTrialParameter.Type.SCENE_PARAMETER);
    
                trialSceneParameters.push(new PsyanimJsPsychTrialParameter(
                    PsyanimJsPsychTrialParameter.Type.SCENE_PARAMETER,
                    'canvasSize', {
                        width: PsyanimApp.Instance.currentScene.game.config.width,
                        height: PsyanimApp.Instance.currentScene.game.config.height
                    }
                ));
    
                let color = PsyanimApp.Instance.currentScene.game.config.backgroundColor;
                let colorHex = Phaser.Display.Color.RGBToString(color.r, color.g, color.b, color.a);
    
                trialSceneParameters.push(new PsyanimJsPsychTrialParameter(
                    PsyanimJsPsychTrialParameter.Type.SCENE_PARAMETER,
                    'backgroundColor', colorHex
                ));
    
                trialSceneParameters.push(new PsyanimJsPsychTrialParameter(
                    PsyanimJsPsychTrialParameter.Type.SCENE_PARAMETER,
                    'wrapScreenBoundary', PsyanimApp.Instance.currentScene.screenBoundary.wrap
                ));
    
                trialMetadata.sceneParameters = [];
    
                trialSceneParameters.forEach(p => {
    
                    trialMetadata.sceneParameters.push({
                        parameterType: p.parameterType,
                        parameterName: p.parameterName,
                        parameterValue: p.parameterValue
                    });
                });
    
                this._documentWriter.addExperimentTrialMetadata(trialMetadata);
            }
        }

        // remove any open event subs
        if (this._currentTrial.endTrialOnContact)
        {
            PsyanimApp.Instance.events.off('playerContact', this.endTrial, this);
        }

        if (this._currentTrial.endTrialOnPlaybackComplete)
        {
            PsyanimApp.Instance.events.off('playbackComplete', this.endTrial, this);
        }

        PsyanimApp.Instance.events.off('psyanim-jspsych-endTrial', this.endTrial, this);

        // stop the current scene
        PsyanimApp.Instance.stopCurrentScene();

        // progress to the next trial
        this._currentTrialIndex++;

        // remove phaser game canvas from display element
        PsyanimApp.Instance.setCanvasVisible(false);

        if (this._subtextElement)
        {
            this._domElement.removeChild(this._subtextElement);
            this._subtextElement = null;
        }

        this._displayElement = null;

        this._currentTrial = null;

        // this must be called to end the trial and proceed to the next one!
        this._jsPsych.finishTrial(this._currentTrialJsPsychData);
    }

    _setupAnimationBaking(scene) {

        let agentsToRecord = this._getAgentsByName(this._currentTrial.agentNamesToRecord);

        if (agentsToRecord.length > 0)
        {
            agentsToRecord.forEach(agent => {

                let baker = agent.addComponent(PsyanimAnimationBaker);

                let animationParameters = this._currentTrial.animationParameters
                    .filter(p => p.entityName === agent.name);

                baker.addAnimationParameters(animationParameters);

                baker.start();
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
                    console.error("ERROR in scene '", PsyanimApp.Instance.currentSceneKey, 
                        "': invalid agent name: " + name, 
                        ", valid names = ", PsyanimApp.Instance.currentScene.getAllEntityNames());
                }
            }
        });

        return agents;
    }
}

export default class PsyanimJsPsychPlugin {

    static setDocumentWriter(writer) {

        _PsyanimJsPsychPlugin.Instance._documentWriter = writer;
    }

    static setExperimentName(experimentName) {

        _PsyanimJsPsychPlugin.Instance._experimentName = experimentName;
    }

    static setUserID(userID) {

        _PsyanimJsPsychPlugin.Instance._userID = userID;
    }

    static setClearConsoleOnNewTrial(clear) {

        _PsyanimJsPsychPlugin.Instance.clearConsoleOnNewTrial = clear;
    }

    constructor(jsPsych) {

        _PsyanimJsPsychPlugin.Instance.jsPsych = jsPsych;
    }

    trial(display_element, trial) {

        _PsyanimJsPsychPlugin.Instance.beginNextTrial(display_element, trial);;
    }
}

PsyanimJsPsychPlugin.info = {
    
    name: 'psyanim-jsPsych-plugin',
    parameters: {

        sceneKey: {
            type: ParameterType.HTML_STRING,
            default: undefined
        },

        endTrialKeys: {
            type: ParameterType.KEYS,
            default: ['enter']
        },

        duration: {
            type: ParameterType.FLOAT,
            default: -1.0
        },

        endTrialOnContact: {
            type: ParameterType.BOOL,
            default: false
        },

        endTrialOnPlaybackComplete: {

            type: ParameterType.BOOL,
            default: false
        },

        saveTrialMetadata: {
            type: ParameterType.BOOL,
            default: true
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
        },

        subtext: {
            type: ParameterType.STRING,
            default: ''
        },

        trialParameters: {
            type: ParameterType.OBJECT,
            default: []
        },

        animationParameters: {
            type: ParameterType.OBJECT,
            default: []
        }
    }
};

_PsyanimJsPsychPlugin._instance = null;