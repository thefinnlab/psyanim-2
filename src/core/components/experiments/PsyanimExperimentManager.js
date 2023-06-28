import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimApp from '../../PsyanimApp';

import PsyanimExperimentLoadingScene from './PsyanimExperimentLoadingScene';

import PsyanimAnimationBaker from '../utils/PsyanimAnimationBaker';

import PsyanimFirebaseClient from '../networking/PsyanimFirebaseClient';

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
        this._experimentName = PsyanimApp.Instance.game.registry.get('psyanim_experimentName');

        this._isLoadingScene = true;

        this._isComplete = false;
    }

    get experimentName() {

        return this._experimentName;
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

    get currentRunNumber() {

        return this._experimentVariations[this._currentSceneIndex].runNumber;
    }

    get currentVariationNumber() {

        return this._experimentVariations[this._currentSceneIndex].variationNumber;
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
            // save off baked animations + agent metadata
            if (this._agents)
            {
                this._agents.forEach(agent => {
                    
                    // save off baked animations
                    let animationBaker = agent.getComponent(PsyanimAnimationBaker);

                    animationBaker.stop();

                    let data = animationBaker.clip.toArray();

                    let docId = this._firebaseClient.addAnimationClip(data);

                    console.log('finished baking, data size = ' + data.length);

                    // update agent metadata animation clip Id
                    let metadata = this._runMetadata.agentMetadata.find(a => a.name == agent.name);
                    metadata.animationClipId = docId;
                });
            }

            if (!this.isLoadingScene)
            {
                this._firebaseClient.addExperimentRunMetadata(this._runMetadata);
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

                    let agent = null;

                    let hasWildcard = name.split('*').length > 1;

                    if (hasWildcard)
                    {
                        let nameRoot = name.split('*')[0];

                        let entityNames = this.scene.getAllEntityNames();

                        entityNames.forEach(entityName => {

                            if (entityName.startsWith(nameRoot))
                            {
                                agent = this.scene.getEntityByName(entityName);

                                if (agent)
                                {
                                    console.log("adding entity named: " + agent.name);

                                    this._agents.push(agent);
                                }
                                else
                                {
                                    console.error("ERROR: invalid name to record: " + entityName);
                                }
                            }
                        })
                    }
                    else
                    {
                        agent = this.scene.getEntityByName(name);

                        if (agent)
                        {
                            this._agents.push(agent);
                        }
                        else
                        {
                            console.error("ERROR: invalid agent name to record: " + name);
                        }    
                    }
                });

                // save off metadata
                let agentMetadata = [];

                this._agents.forEach(agent => {

                    agent.addComponent(PsyanimAnimationBaker).start();

                    let r0 = agent.position;

                    // save off agent metadata
                    agentMetadata.push({
                        name: agent.name,
                        initialPosition: { x: r0.x, y: r0.y },
                        shapeParams: agent.shapeParams,
                        animationClipId: -1
                    });
                });

                let playerID = PsyanimApp.Instance.currentPlayerID;

                if (!playerID)
                {
                    console.error("ERROR: player ID is null!");
                }

                // save off metadata for this run variation
                this._runMetadata = {

                    playerID: playerID,
                    experimentName: _PsyanimExperimentManager.Instance.experimentName,
                    runNumber: _PsyanimExperimentManager.Instance.currentRunNumber,
                    variationNumber: _PsyanimExperimentManager.Instance.currentVariationNumber,
                    sceneName: this.scene.scene.key,
                    agentMetadata: agentMetadata
                };
            }
        }
    }
}