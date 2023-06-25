import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimExperimentLoadingScene from './PsyanimExperimentLoadingScene';

export default class PsyanimExperimentController extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this._currentSceneIndex = -1;

        this._keys = {

            ENTER: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
        };
    }

    returnToExperimentLoaderScene() {

        this.scene.scene.start(PsyanimExperimentLoadingScene.KEY);
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.ENTER))
        {
            this.returnToExperimentLoaderScene();
        }
    }
}