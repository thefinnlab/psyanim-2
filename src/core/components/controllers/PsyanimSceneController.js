import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimSceneChangeController extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this._keys = {
            J: this.entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
            K: this.entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
        };
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.J)) {

            // load previous scene
            let currentSceneIndex = this.entity.scene.scene.getIndex(this.entity.scene.scene.key);

            let scenes = this.entity.scene.scene.manager.scenes;

            let nextSceneIndex = currentSceneIndex - 1;

            if (nextSceneIndex < 0)
            {
                nextSceneIndex = scenes.length - 1;
            }

            this.entity.scene.scene.start(scenes[nextSceneIndex]);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.K)) {

            // load next scene
            let currentSceneIndex = this.entity.scene.scene.getIndex(this.entity.scene.scene.key);

            let scenes = this.entity.scene.scene.manager.scenes;

            let nextSceneIndex = currentSceneIndex + 1;

            if (nextSceneIndex == scenes.length)
            {
                nextSceneIndex = 0;
            }

            this.entity.scene.scene.start(scenes[nextSceneIndex]);
        }
    }
}