import Phaser from 'phaser';

export default class PsyanimApp {

    constructor(config) {

        this._config = config;
        this._sceneKeys = [];
    }

    registerScene(scene) {

        if (!scene.KEY)
        {
            console.error("ERROR: to register a PsyanimScene, it must contain a static string field called 'KEY'!");
        }

        this._config.phaserConfig.scene.push(scene);

        this._sceneKeys.push(scene.KEY);
    }

    run() {

        this._game = new Phaser.Game(this._config.phaserConfig);

        this._game.registry.set('psyanimExperimentSceneKeys', this._sceneKeys);
    }
}