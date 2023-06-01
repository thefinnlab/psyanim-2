import Phaser from 'phaser';

import PsyanimScreenBoundary from './PsyanimScreenBoundary';
import PsyanimEntity from '../PsyanimEntity';

export default class PsyanimScene extends Phaser.Scene {

    constructor(key) {

        super(key);

        // this.events.on('shutdown', () => this._destroyAllEntities());
    }

    addEntity(name, x = 0, y = 0, shapeParams = { isEmpty: true }, matterOptions = {}) {

        let entity = new PsyanimEntity(this, name, x, y, shapeParams, matterOptions);

        this._entities.push(entity);

        return entity;
    }

    getEntityByName(name) {

        return this._entities.find(e => e.name == name);
    }

    _destroyAllEntities() {

        this._entities.forEach( (e) => {
            e.destroy();
        });

        this._entities = [];
    }

    init() {

        this._entities = [];
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