import Phaser from 'phaser';

import PsyanimScreenBoundary from './PsyanimScreenBoundary';
import PsyanimEntity from '../PsyanimEntity';

export default class PsyanimScene extends Phaser.Scene {

    constructor(key) {

        super(key);
    }

    addEntity(name, x = 0, y = 0, shapeParams = { isEmpty: true }, matterOptions = {}) {

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
    }

    update(t, dt) {

        this._entities.forEach(e => e.update(t, dt));
    }
}