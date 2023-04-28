import Phaser from 'phaser';

export default class PsyanimScene extends Phaser.Scene {

    constructor(key) {

        super(key);
    }

    init() {

        const sceneNameHeader = document.getElementById("sceneName");

        sceneNameHeader.innerHTML = this.scene.key;
    }

    preload() {

    }

    create() {

        this.keys = {
            J: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
            K: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
        };
    }

    update(t, dt) {

        if (this.keys.J.isDown) {

            // load previous scene
        }
        else if (this.keys.K.isDown) {

            // load next scene
            let currentSceneIndex = this.scene.getIndex(this.scene.key);

            let scenes = this.scene.manager.scenes;

            let nextSceneIndex = currentSceneIndex + 1;

            if (nextSceneIndex == scenes.length)
            {
                nextSceneIndex = 0;
            }

            this.scene.start(scenes[nextSceneIndex]);
        }
    }
}