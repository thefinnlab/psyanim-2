import Phaser from 'phaser';

import PsyanimScreenBoundary from './PsyanimScreenBoundary';
import PsyanimEntity from '../PsyanimEntity';

export default class PsyanimScene extends Phaser.Scene {

    constructor(key) {

        super(key);
    }

    addEntity(name, x, y, shapeParams = {}, matterOptions = {}) {

        let entity = new PsyanimEntity(this, name, x, y, shapeParams, matterOptions);

        this._entities.push(entity);

        return entity;
    }

    getEntityByName(name) {

        return this._entities.find(e => e.name == name);
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

        this._sceneChangeKeys = {
            J: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
            K: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
            T: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T)
        };
    }

    update(t, dt) {

        if (Phaser.Input.Keyboard.JustDown(this._sceneChangeKeys.J)) {

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
        else if (Phaser.Input.Keyboard.JustDown(this._sceneChangeKeys.K)) {

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
        else if (Phaser.Input.Keyboard.JustDown(this._sceneChangeKeys.T)) {

            if (this.matter.world.engine.timing.timeScale < 1)
            {
                this.matter.world.engine.timing.timeScale = 1.0;
            }
            else
            {
                this.matter.world.engine.timing.timeScale = 0.05;
            }
        }

        this._entities.forEach(e => e.update(t, dt));
    }
}