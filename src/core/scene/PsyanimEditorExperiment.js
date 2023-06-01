import Phaser from 'phaser';

import PsyanimScene from './PsyanimScene';

import PsyanimExperimentTimer from '../components/utils/PsyanimExperimentTimer';

import PsyanimClientNetworkManager from '../components/networking/PsyanimClientNetworkManager';

import PsyanimVideoRecorder from '../components/utils/PsyanimVideoRecorder';
import PsyanimAnimationBaker from '../components/utils/PsyanimAnimationBaker';
import PsyanimAnimationPlayer from '../components/utils/PsyanimAnimationPlayer';

import PsyanimExperimentControls from '../components/ui/PsyanimExperimentControls';

export default class PsyanimEditorExperiment extends PsyanimScene {

    static STATE = {
        IDLE: 0x0000,
        SIMULATING: 0x0001,
        RECORDING: 0x0002,
    };

    recordVideo = false;

    constructor(key) {

        super(key);
        
        this._duration = 200;

        this._currentParameterSet = null;
        this._currentAnimationClipSet = [];

        this._currentParameterSetIndex = 0;
        this._parameterSets = [];

        this._agentNamesToRecord = [];

        this._state = PsyanimEditorExperiment.STATE.IDLE;
    };

    addParameterSet(parameterSet) {

        if (!parameterSet)
        {
            console.error("ERROR: parameterSet is null!");
        }

        let parameterSetCopy = JSON.parse(JSON.stringify(parameterSet));

        this._parameterSets.push(parameterSetCopy);
    }

    get currentParameterSet() {

        return this._currentParameterSet;
    }

    addAgentNamesToRecord(agentName) {

        this._agentNamesToRecord.push(...agentName);
    }

    setVideoSavePath(rootDirPath, subdirName, filenameBase) {

        this._networkManager.doPost('/video-save-path', JSON.stringify({
            rootDirPath: rootDirPath,
            subdirName: subdirName,
            filenameBase: filenameBase
        }));
    }

    init() {

        super.init();

        // update current parameter set
        if (this._parameterSets.length == 0)
        {
            console.error("ERROR: No parameter sets added to experiment!");

            this.scene.start('EmptyScene');
        }

        if (this._state == PsyanimEditorExperiment.STATE.IDLE)
        {
            this._transitionToNextParameterSet();
        }
        else if (this._state == PsyanimEditorExperiment.STATE.SIMULATING)
        {
            this._currentParameterSetIndex++;

            this._transitionToNextParameterSet();
        }
        else if (this._state == PsyanimEditorExperiment.STATE.RECORDING)
        {
            if (this._currentParameterSetIndex >= this._parameterSets.length - 1)
            {
                this._nextSceneKey = 'Empty Scene';
            }
        }
    }

    _getAgentsToRecord() {

        let agents = [];

        this._agentNamesToRecord.forEach(name => {

            let agent = this.getEntityByName(name);

            if (!agent)
            {
                console.error("ERROR: failed to find agent by name '" + name + "'!");
            }

            agents.push(agent);
        });

        return agents;
    }

    _transitionToNextParameterSet() {

        // transition to next parameter set
        this._currentParameterSet = this._parameterSets[this._currentParameterSetIndex];
        this._currentAnimationClipSet = [];

        this._duration = this._currentParameterSet.experimentDuration;

        console.log("Experiment" + (this._currentParameterSetIndex + 1) + " start time: " + this.time.now / 1000);
        console.log("Experiment " + (this._currentParameterSetIndex + 1) + " duration: " + this._duration / 1000);

        this._nextSceneKey = this.scene.key;

        if (!this.recordVideo && this._currentParameterSetIndex >= this._parameterSets.length - 1)
        {
            this._nextSceneKey = 'Empty Scene';
        }
    }

    preload() {

        super.preload();
    }

    create() {

        super.create();

        // create test manager
        this._testManager = this.addEntity('testManager');

        this._experimentControls = this._testManager
            .addComponent(PsyanimExperimentControls);

        this._experimentControls.editorExperiment = this;

        if (this._state == PsyanimEditorExperiment.STATE.IDLE)
        {
            this._experimentControls.setStartButtonEnabled(true);
        }
        else
        {
            this._experimentControls.setStartButtonEnabled(false);            
        }

        // create network manager
        this._networkManager = this.addEntity('networkManager')
            .addComponent(PsyanimClientNetworkManager);

        // call child class experiment setup code
        this.setupExperiment();

        if (this._state == PsyanimEditorExperiment.STATE.IDLE)
        {
            // disable all components on the relevant agents for now
            let agents = this._getAgentsToRecord();

            agents.forEach(agent => {
                let components = agent.getComponents();
                components.forEach(c => c.enabled = false);
            });

            this._state = PsyanimEditorExperiment.STATE.SIMULATING;
        }
        else
        {
            this._run();
        }
    }

    start() {

        let agents = this._getAgentsToRecord();

        agents.forEach(agent => {
            let components = agent.getComponents();
            components.forEach(c => c.enabled = true);
        });

        this._run();
    }

    _run() {

        // simulate and record
        if (this._state == PsyanimEditorExperiment.STATE.SIMULATING)
        {
            console.log("Running simulation!");
            this._initSimulation();
        }
        else if (this._state == PsyanimEditorExperiment.STATE.RECORDING)
        {
            console.log("Recording baked animation to video!");
            this._initVideoRecording();
        }
    }

    _initSimulation() {

        // add animation baker components to relevant agents
        let agents = this._getAgentsToRecord();

        if (this.recordVideo)
        {
            agents.forEach(agent => {
                agent.addComponent(PsyanimAnimationBaker);
            });    
        }

        // setup simulation timer callback
        this.addEntity('_simulationTimer')
            .addComponent(PsyanimExperimentTimer)
            .setOnTimerElapsed(this._duration, () => {

                if (this.recordVideo)
                {
                    agents.forEach(agent => {
                        
                        this._currentAnimationClipSet.push({
                            agentName: agent.name,
                            clip: agent.getComponent(PsyanimAnimationBaker).bake()
                        });
                    });
                }

                if (this.recordVideo)
                {
                    this._state = PsyanimEditorExperiment.STATE.RECORDING;
                }
                else
                {
                    this._state = PsyanimEditorExperiment.STATE.SIMULATING;
                }
    
                this.scene.start(this._nextSceneKey);
            });
    }

    _initVideoRecording() {

        // get all the agents we're working with
        let agents = this._getAgentsToRecord();

        // setup animation playback components
        agents.forEach(agent => {

            // get the baked animation clip
            let clip = this._currentAnimationClipSet
                .find(clipData => clipData.agentName == agent.name)
                .clip;

            if (clip == null)
            {
                console.error("ERROR: no animation clip for agent named: " + agent.name);
            }

            // remove all existing components from these agents
            agent.getComponents().forEach(c => c.destroy());

            // add the animation player to play the baked animation clip
            agent.addComponent(PsyanimAnimationPlayer)
                .play(clip);
        });

        // go ahead and create the websocket connection to server
        this._networkManager.connect();

        // setup video recording
        this._videoRecorder = this._testManager.addComponent(PsyanimVideoRecorder);
        this._videoRecorder.events.on('videoFileReady', () => {

            let data = this._videoRecorder.getVideoBlob();

            this._networkManager.sendBlob(data);

            this._networkManager.disconnect();

            this._state = PsyanimEditorExperiment.STATE.SIMULATING;

            this.scene.start(this._nextSceneKey);
        });

        this._videoRecorder.start();

        this.addEntity('_videoRecordingTimer')
            .addComponent(PsyanimExperimentTimer)
            .setOnTimerElapsed(this._duration, () => {

                this._videoRecorder.stop();
        });
    }
}