import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

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

        this._currentParameterSet = null;
        this._parameterSets = [];
    }
}

/**
 *  Component-interface to experiment manager singleton
 */

export default class PsyanimExperimentManager extends PsyanimComponent {
    
    constructor(entity) {

        super(entity);

        // TODO: the experiment runs & scenes should be configured in index.js
        // file by adding data to the game.registry().  this will determine
        // what scenes get loaded, etc.  maybe the first scene for an experiment
        // should always be a 'PsyanimExperimentLoader' scene
    }

    registerScene(scene) {

        // TODO: add this scene to experiment manager!
    }

    addAgent(scene, agent) {

        // get sceneInfo

        // serialize agent info

    }
}