import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimApp from '../../PsyanimApp';

import PsyanimExperimentLoadingScene from './PsyanimExperimentLoadingScene';

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

        this._currentSceneIndex = 0;

        this._experimentVariations = PsyanimApp.Instance.game.registry.get('psyanim_experimentVariations');

        this._isLoadingScene = true;

        this._isComplete = false;
    }

    get currentSceneKey() {

        if (this._isLoadingScene)
        {
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

    get currentParameterSet() {

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

    getNextSceneKey() {

        if (this._isLoadingScene)
        {
            if (this._currentSceneIndex >= this.totalVariations)
            {
                this._isComplete = true;
                return;
            }

            this._isLoadingScene = false;

            let nextSceneKey = this._experimentVariations[this._currentSceneIndex].sceneKey;

            this._currentSceneIndex++;

            return nextSceneKey;
        }
        else if (!this._isComplete)
        {
            this._isLoadingScene = true;

            return PsyanimExperimentLoadingScene.KEY;
        }

        // TODO: create a scene for experiment completion too.  
        return null;
    }
}

/**
 *  Component-interface to experiment manager singleton
 */

export default class PsyanimExperimentManager extends PsyanimComponent {
    
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
        }
    }

    loadNextScene() {

        if (!this.isComplete)
        {
            let nextSceneKey = _PsyanimExperimentManager.Instance.getNextSceneKey();

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

        if (Phaser.Input.Keyboard.JustDown(this._keys.ENTER))
        {
            this.loadNextScene();
        }
    }
}