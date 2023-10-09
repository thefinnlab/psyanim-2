import Phaser from 'phaser';

import PsyanimConfig from './PsyanimConfig.js';
import PsyanimDataDrivenScene from './PsyanimDataDrivenScene.js';

import {
    PsyanimDebug
} from 'psyanim-utils';

import { v4 as uudiv4 } from 'uuid';

export default class PsyanimApp {

    static get Instance() {

        if (PsyanimApp._instance == null)
        {
            PsyanimApp._instance = new PsyanimApp();
        }

        return PsyanimApp._instance;
    }

    constructor() {

        this._config = new PsyanimConfig();

        window.psyanimApp = this;

        this._sessionID = uudiv4();

        this._domElement = document.getElementById('phaser-app');

        if (this._domElement == null)
        {
            this._domElement = document.createElement('div');
            this._domElement.setAttribute('id', 'phaser-app');
            
            document.body.appendChild(this._domElement);
        }

        this.events = new Phaser.Events.EventEmitter();
    }

    setCanvasVisible(visible) {

        if (visible)
        {
            let canvas = this._game.canvas;

            if (canvas.parentElement == null)
            {
                this._domElement.appendChild(canvas);
            }
        }
        else
        {
            this._domElement.innerHTML = '';
        }
    }

    get sessionID() {
        return this._sessionID;
    }

    get currentScene() {

        return this._game.registry.get('psyanim_currentScene');
    }

    get currentSceneKey() {

        return this._currentSceneKey;
    }

    get sceneKeys() {

        return this._config.sceneKeys;
    }

    get domElement() {

        return this._domElement;
    }

    get config() {

        return this._config;
    }

    get game() {

        return this._game;
    }

    getSceneByKey(sceneKey) {

        if (!this.sceneKeys.includes(sceneKey))
        {
            PsyanimDebug.error('No scene with key: ' + sceneKey);
        }

        let psyanimScenes = this.config.phaserConfig.scene;
        let psyanimSceneKeys = psyanimScenes.map(s => s.KEY);

        if (psyanimSceneKeys.includes(sceneKey))
        {
            // return the actual psyanim scene reference
            return PsyanimApp.Instance.currentScene.scene.get(sceneKey);
        }
        else
        {
            // return the data-driven scene b.c. it will be the one used for this key
            return PsyanimApp.Instance.currentScene.scene.get(PsyanimDataDrivenScene.KEY);
        }
    }

    loadScene(sceneKey) {

        PsyanimDebug.log("load scene called with key: " + sceneKey);

        if (!this.sceneKeys.includes(sceneKey))
        {
            PsyanimDebug.error("Failed to load scene '" + sceneKey + "' - no scene registered with that key!");
        }

        let psyanimScenes = this.config.phaserConfig.scene;
        let psyanimSceneKeys = psyanimScenes.map(s => s.KEY);

        if (psyanimSceneKeys.includes(sceneKey))
        {
            this.currentScene.scene.start(sceneKey);
        }
        else
        {
            let sceneDefinition = this._config.getSceneDefinition(sceneKey);

            this._game.registry.set('psyanim_currentSceneDefinition', sceneDefinition);

            this.currentScene.scene.start(PsyanimDataDrivenScene.KEY);
        }

        this._currentSceneKey = sceneKey;
    }

    _loadExperimentVariations(experimentDefinition) {

        let experimentVariations = [];

        for (let i = 0; i < experimentDefinition.runs.length; ++i)
        {
            let run = experimentDefinition.runs[i];

            if (!run.sceneType.KEY)
            {
                PsyanimDebug.error("ERROR: to register a PsyanimScene type, it must contain a static string field called 'KEY'!");
            }

            if (!this._config.phaserConfig.scene.includes(run.sceneType))
            {
                this._config.phaserConfig.scene.push(run.sceneType);
            }

            for (let j = 0; j < run.variations; ++j)
            {
                experimentVariations.push({
                    sceneKey: run.sceneType.KEY,
                    parameterSet: run.parameterSet,
                    runNumber: i,
                    variationNumber: j,
                    agentNamesToRecord: run.agentNamesToRecord
                });
            }
        }

        return experimentVariations;
    }

    get currentPlayerID() {

        return this._game.registry.get('psyanim_currentPlayerID');
    }

    set currentPlayerID(value) {

        this._game.registry.set('psyanim_currentPlayerID', value);
    }

    run() {

        this._game = new Phaser.Game(this._config.phaserConfig);

        this._currentSceneKey = this.sceneKeys[0];

        let sceneDefinitionKeys = this.config.sceneDefinitions.map(s => s.key);

        if (sceneDefinitionKeys.includes(this._currentSceneKey))
        {
            let sceneDefinition = this.config.getSceneDefinition(this._currentSceneKey);

            this._game.registry.set('psyanim_currentSceneDefinition', sceneDefinition);
        }
    }
}

PsyanimApp._instance = null;