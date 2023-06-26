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

        this._experimentVariations = [];
    }

    get config() {

        return this._config;
    }

    get game() {

        return this._game;
    }

    _loadExperimentDefinition(experimentDefinition) {

        for (let i = 0; i < experimentDefinition.runs.length; ++i)
        {
            let run = experimentDefinition.runs[i];

            if (!run.sceneType.KEY)
            {
                console.error("ERROR: to register a PsyanimScene type, it must contain a static string field called 'KEY'!");
            }

            this._config.phaserConfig.scene.push(run.sceneType);

            for (let j = 0; j < run.variations; ++j)
            {
                this._experimentVariations.push({
                    sceneKey: run.sceneType.KEY,
                    parameterSet: run.parameterSet,
                    runNumber: i,
                    variationNumber: j
                });
            }
        }
    }

    run(experimentDefinition) {

        if (this._config == null)
        {
            // use default config
            this._config = new PsyanimConfig();
        }

        this._loadExperimentDefinition(experimentDefinition);

        this._game = new Phaser.Game(this._config.phaserConfig);

        this._game.registry.set('psyanim_experimentVariations', this._experimentVariations);
    }
}