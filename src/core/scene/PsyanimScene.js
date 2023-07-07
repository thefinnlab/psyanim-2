import Phaser from 'phaser';

import PsyanimScreenBoundary from './PsyanimScreenBoundary';
import PsyanimEntity from '../PsyanimEntity';

export default class PsyanimScene extends Phaser.Scene {

    constructor(key) {

        super(key);

        // canvas is always stored under div with id 'phaser-app'
        this._canvasParent = document.getElementById('phaser-app');
    }

    addEntity(name, x = 0, y = 0, shapeParams = { isEmpty: true }, matterOptions = {}) {

        let entity = new PsyanimEntity(this, name, x, y, shapeParams, matterOptions);

        this._entities.push(entity);

        return entity;
    }

    getAllEntityNames() {

        return this._entities.map(e => e.name);
    }

    getEntityByName(name) {

        return this._entities.find(e => e.name == name);
    }

    destroyEntityByName(name) {

        let entity = this._entities.find(e => e.name == name);

        if (entity) {

            this._entities = this._entities.filter(e => e.name != entity.name);
            entity.destroy();
        }
        else
        {
            console.warn("WARNING: failed to find entity named '" + name + "'!");
        }
    }

    getComponentByType(componentType) {

        let entity = this._entities.find(e => e.getComponent(componentType) != null);

        if (entity != null)
        {
            return entity.getComponent(componentType);
        }

        return null;
    }

    _destroyAllEntities() {

        this._entities.forEach( (e) => {
            e.destroy();
        });

        this._entities = [];
    }

    init() {

        this._entities = [];

        this.registry.set('psyanim_currentScene', this);
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