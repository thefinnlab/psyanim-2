import Phaser from 'phaser';

import PsyanimScene from '../../scene/PsyanimScene';

export default class PsyanimExperimentLoadingScene extends PsyanimScene {

    static KEY = '_PsyanimExperimentLoader';

    constructor() {

        super('_PsyanimExperimentLoader');

        this._currentSceneIndex = -1;
    }

    create() {

        super.create();

        let sceneKeys = this.registry.get('psyanimExperimentSceneKeys');

        const sceneNameHeader = document.getElementById("sceneName");

        if (this._currentSceneIndex < sceneKeys.length - 1)
        {
            sceneNameHeader.innerHTML = 'Loading...';
   
            this._keys = {

                ENTER: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            };    
        }
        else
        {
            sceneNameHeader.innerHTML = 'Experiment complete!';
        }
    }

    loadNextScene() {

        let sceneKeys = this.registry.get('psyanimExperimentSceneKeys');

        this._currentSceneIndex++;

        if (this._currentSceneIndex >= sceneKeys.length)
        {
            return;
        }

        let nextSceneKey = sceneKeys[this._currentSceneIndex];

        this.scene.start(nextSceneKey);
    }

    update(t, dt) {

        super.update(t, dt);
 
        if (Phaser.Input.Keyboard.JustDown(this._keys.ENTER))
        {
            this.loadNextScene();
        }
    }
}