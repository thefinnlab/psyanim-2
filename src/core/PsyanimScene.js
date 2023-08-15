import Phaser from 'phaser';

import PsyanimScreenBoundary from './utils/PsyanimScreenBoundary';
import PsyanimEntity from './PsyanimEntity';

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

    instantiatePrefab(prefab, instanceName, x = 0, y = 0) {

        let entity = this.addEntity(
            instanceName, x, y,
            prefab.shapeParams, 
            prefab.matterOptions);

        prefab.create(entity);

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

    /**
     * 
     * @param {*} componentType 
     * @returns the first component found of type 'componentType'
     */
    getComponentByType(componentType) {

        let entity = this._entities.find(e => e.getComponent(componentType) != null);

        if (entity != null)
        {
            return entity.getComponent(componentType);
        }

        return null;
    }

    getComponentsByType(componentType) {

        return this._entities
            .filter(e => e.getComponent(componentType) != null)
            .map(e => e.getComponent(componentType));
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

        // setup hook into the Phaser.Scene 'create' event only *once*
        if (!this._boundAfterCreate)
        {
            this._boundAfterCreate = this._afterCreate.bind(this);

            this.events.on('create', this._boundAfterCreate);    
        }
    }

    preload() {

    }

    create() {

        // setup wrapping with screen boundary
        this.screenBoundary = new PsyanimScreenBoundary(this);
    }

    _afterCreate() {
 
        this._entities.forEach(e => e.afterCreate());
    }

    update(t, dt) {

        this._entities.forEach(e => e.update(t, dt));
    }
}