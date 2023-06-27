import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimApp from '../../PsyanimApp';

import PsyanimExperimentLoadingScene from './PsyanimExperimentLoadingScene';

import PsyanimAnimationBaker from '../utils/PsyanimAnimationBaker';

import PsyanimFirebaseClient from '../networking/PsyanimFirebaseClient';

/**
 *  Data Model
 */

class PsyanimExperimentMetadata {

    constructor() {

        this._sceneInfo = [];
    }

    addAgent(scene, name, x, y, shapeParams, matterOptions) {

        let sceneInfo = this._sceneInfo.find(s => s.name == scene.name);

        sceneInfo._agentInfo.push({

            sceneName: scene.name,
            name: name,
            initialPosition: { x: x, y: y },
            shapeParams: shapeParams,
            matterOptions: matterOptions
        });
    }
}

/**
 *  Experiment Manager Singleton
 */

class _PsyanimExperimentManager {

    static get Instance() {

        if (_PsyanimExperimentManager._instance == null)
        {
            _PsyanimExperimentManager._instance = new _PsyanimExperimentManager();
        }

        return _PsyanimExperimentManager._instance;
    }

    static _instance = null;

    constructor() {

        this._currentSceneIndex = -1;

        this._experimentVariations = PsyanimApp.Instance.game.registry.get('psyanim_experimentVariations');

        this._isLoadingScene = true;

        this._isComplete = false;
    }

    get currentSceneKey() {

        if (this._isLoadingScene)
        {
            return PsyanimExperimentLoadingScene.KEY;
        }
        else if (this._isComplete)
        {
            // TODO: create a scene for experiment completion w/ it's own key, too.
            return PsyanimExperimentLoadingScene.KEY;
        }
        else
        {
            return this._experimentVariations[this._currentSceneIndex].sceneKey;
        }
    }

    get currentSceneIndex() {

        return this._currentSceneIndex;
    }

    get agentNamesToRecord() {

        return this._experimentVariations[this._currentSceneIndex].agentNamesToRecord;
    }

    get currentParameterSet() {

        console.log("this._currentSceneIndex = " + this._currentSceneIndex);

        return this._experimentVariations[this._currentSceneIndex].parameterSet;
    }

    get totalVariations() {

        return this._experimentVariations.length;
    }

    get isLoadingScene() {

        return this._isLoadingScene;
    }

    get isComplete() {

        return this._isComplete;
    }

    transitionToNextScene() {

        if (this._isLoadingScene)
        {
            if (this._currentSceneIndex >= this.totalVariations - 1)
            {
                this._isComplete = true;
                return;
            }

            this._isLoadingScene = false;

            this._currentSceneIndex++;
        }
        else if (!this._isComplete)
        {
            this._isLoadingScene = true;
        }
    }
}

/**
 *  Component-interface to experiment manager singleton
 */

export default class PsyanimExperimentManager extends PsyanimComponent {
    
    static STATE = {
        INITIALIZING: 0x0001,
        RUNNING: 0x0002,
    }

    constructor(entity) {

        super(entity);

        /**
         *  experiment manager will be responsible for:
         * 
         *      - managing recording of agent and experiment data
         *      - providing facilities to end the experiment based on configured end-conditions
         *      - providing access to the run parameters
         */

        this._keys = {

            ENTER: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
        };

        this._state = PsyanimExperimentManager.STATE.INITIALIZING;

        this._firebaseClient = this.entity.getComponent(PsyanimFirebaseClient);

        if (this._firebaseClient == null)
        {
            this._firebaseClient = this.entity.addComponent(PsyanimFirebaseClient);
        }
    }

    loadNextScene() {

        if (!this.isComplete)
        {
            // save off baked animations
            if (this._agents)
            {
                this._agents.forEach(agent => {
                    
                    let animationBaker = agent.getComponent(PsyanimAnimationBaker);

                    animationBaker.stop();

                    let data = animationBaker.clip.toArray();

                    this._firebaseClient.addAnimationClip(
                        'test',
                        'interaction',
                        'run_' + Date.now(),
                        data,
                    );

                    let jsonData = JSON.stringify(data);

                    console.log("finished baking data size: " + jsonData.length);
                });
            }

            // load next scene
            _PsyanimExperimentManager.Instance.transitionToNextScene();

            let nextSceneKey = _PsyanimExperimentManager.Instance.currentSceneKey;

            this.scene.scene.start(nextSceneKey);    
        }
    }

    get isComplete() {

        return _PsyanimExperimentManager.Instance.isComplete;
    }

    get isLoadingScene() {

        return _PsyanimExperimentManager.Instance.isLoadingScene;
    }

    get totalVariations() {

        return _PsyanimExperimentManager.Instance.totalVariations;
    }

    get currentSceneIndex() {

        return _PsyanimExperimentManager.Instance.currentSceneIndex;
    }

    get currentSceneKey() {

        return _PsyanimExperimentManager.Instance.currentSceneKey;
    }

    get currentParameterSet() {

        return _PsyanimExperimentManager.Instance.currentParameterSet;
    }

    update(t, dt) {

        super.update(t, dt);

        if (this._state == PsyanimExperimentManager.STATE.INITIALIZING)
        {
            this._state = PsyanimExperimentManager.STATE.RUNNING;

            if (!this.isLoadingScene)
            {
                this._agents = [];

                let agentNamesToRecord = _PsyanimExperimentManager.Instance.agentNamesToRecord;

                console.log(agentNamesToRecord);

                agentNamesToRecord.forEach(name => {

                    let agent = this.scene.getEntityByName(name);

                    if (agent)
                    {
                        this._agents.push(agent);
                    }
                    else
                    {
                        console.error("ERROR: invalid agent name to record: " + name);
                    }
                });

                this._agents.forEach(agent => {

                    agent.addComponent(PsyanimAnimationBaker).start();
                });
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this._keys.ENTER))
        {
            this.loadNextScene();
        }
    }
}