import Phaser from 'phaser';

import PsyanimConfig from './PsyanimConfig';

export default class PsyanimApp {

    static get Instance() {

        if (PsyanimApp._instance == null)
        {
            PsyanimApp._instance = new PsyanimApp();
        }

        return PsyanimApp._instance;
    }

    static _instance = null;

    constructor() {

        this._config = new PsyanimConfig();

        window.psyanimApp = this;

        this._domElement = document.getElementById('phaser-app');

        if (this._domElement == null)
        {
            this._domElement = document.createElement('div');
            this._domElement.setAttribute('id', 'phaser-app');
            
            document.body.appendChild(this._domElement);
        }
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

    get currentScene() {

        return this._game.registry.get('psyanim_currentScene');
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

    loadScene(sceneKey) {

        console.log("load scene called with key: " + sceneKey);

        this.currentScene.scene.start(sceneKey);
    }

    _loadExperimentVariations(experimentDefinition) {

        let experimentVariations = [];

        for (let i = 0; i < experimentDefinition.runs.length; ++i)
        {
            let run = experimentDefinition.runs[i];

            if (!run.sceneType.KEY)
            {
                console.error("ERROR: to register a PsyanimScene type, it must contain a static string field called 'KEY'!");
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
    }
}