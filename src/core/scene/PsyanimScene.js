import Phaser from 'phaser';

import PsyanimScreenBoundary from './PsyanimScreenBoundary';

export default class PsyanimScene extends Phaser.Scene {

    constructor(key) {

        super(key);
    }

    addEntity(entity) {

        this._entities.push(entity);
    }

    init() {

        this._entities = [];

        const sceneNameHeader = document.getElementById("sceneName");

        sceneNameHeader.innerHTML = this.scene.key;
    }

    preload() {

    }

    create() {

        // setup wrapping with screen boundary
        this.screenBoundary = new PsyanimScreenBoundary(this);

        this.keys = {
            J: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
            K: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
        };
    }

    update(t, dt) {

        if (this.keys.J.isDown) {

            // load previous scene
            let currentSceneIndex = this.scene.getIndex(this.scene.key);

            let scenes = this.scene.manager.scenes;

            let nextSceneIndex = currentSceneIndex - 1;

            if (nextSceneIndex < 0)
            {
                nextSceneIndex = scenes.length - 1;
            }

            this.scene.start(scenes[nextSceneIndex]);
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

        this._entities.forEach(e => e.update(t, dt));
    }
}