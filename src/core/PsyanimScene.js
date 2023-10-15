import Phaser from 'phaser';

import PsyanimScreenBoundary from './utils/PsyanimScreenBoundary.js';
import PsyanimEntity from './PsyanimEntity.js';

import {
    PsyanimDebug
} from 'psyanim-utils';

export default class PsyanimScene extends Phaser.Scene {

    constructor(key) {

        super(key);

        // canvas is always stored under div with id 'phaser-app'
        this._canvasParent = document.getElementById('phaser-app');

        this._afterCreateCalled = false;
    }

    addEntity(name, x = 0, y = 0, shapeParams = { isEmpty: true }, matterOptions = {}) {

        if (this._entities.some(e => e.name == name))
        {
            PsyanimDebug.error("Scene '" + this.scene.key + "' already has an entity named '" + name + "'!");
            return null;
        }

        let entity = new PsyanimEntity(this, name, x, y, shapeParams, matterOptions);

        this._entities.push(entity);

        if (this._afterCreateCalled)
        {
            entity.afterCreate();
        }

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

        this.deleteTexturesOnShutdown = true;

        // setup hook into the Phaser.Scene 'create' and 'shutdown' events only *once*
        if (!this._boundAfterCreate)
        {
            this._boundAfterCreate = this.afterCreate.bind(this);

            this.events.on('create', this._boundAfterCreate);    
        }

        if (!this._boundBeforeShutdown)
        {
            this._boundBeforeShutdown = this.beforeShutdown.bind(this);

            this.events.on('shutdown', this._boundBeforeShutdown);
        }
    }

    preload() {

    }

    create() {

        // setup wrapping with screen boundary
        this.screenBoundary = new PsyanimScreenBoundary(this);
    }

    afterCreate() {
 
        this._entities.forEach(e => e.afterCreate());

        this._afterCreateCalled = true;
    }

    beforeShutdown() {

        if (this.deleteTexturesOnShutdown)
        {
            let textureKeys = this.textures.getTextureKeys();

            textureKeys.forEach(key => {

                this.textures.remove(key);
            });
        }

        this._entities.forEach(e => e.beforeShutdown());
    }

    update(t, dt) {

        this._entities.forEach(e => e.update(t, dt));
    }
}