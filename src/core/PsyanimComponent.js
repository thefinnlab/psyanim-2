import {
    PsyanimDebug
} from 'psyanim-utils';

/**
 * A `PsyanimComponent` is the most fundamental building block of `user-defined state` and `behavior` in Psyanim-2.
 * 
 * This class, `PsyanimComponent`, is designed to be inherited from and attached to `PsyanimEntities`.
 */
export default class PsyanimComponent {

    /**
     * The entity to which this component is attached.
     * 
     * @type {PsyanimEntity}
     */
    entity;

    /**
     * The scene to which this component's entity belongs.
     * 
     * @type {PsyanimScene}
     */
    scene;

    /**
     * The constructor of the PsyanimComponent must be provided the PsyanimEntity instance to which it is attached.
     * 
     * @param {PsyanimEntity} entity 
     */
    constructor(entity) {

        this.entity = entity;
        this.scene = entity.scene;

        this._id = null;

        this._enabled = true;

        this._afterCreateCalled = false;
    }

    get id() {

        return this._id;
    }

    set id(value) {

        if (typeof value !== 'number')
        {
            PsyanimDebug.error("Invalid type for 'id':", typeof value);
        }

        if (this._id)
        {
            this.scene.freeComponentID(this._id);
        }

        this._id = value;
    }

    /**
     * Called whenever the entity is destroyed.
     * 
     * This method is meant to be overriden in child class, but don't forget to call super.destroy().
     */
    destroy() {

        this.enabled = false;

        this.entity._removeComponent(this);
        
        this.entity = null;
    }

    /**
     * This component's update() method only runs when it is enabled.
     * 
     * @return {boolean} - flag represents whether this component is enabled or not.
     */
    get enabled() {
        return this._enabled;
    }

    /**
     * Sets whether or not this component is enabled.
     * 
     * This component's update() method only runs when it is enabled.
     * 
     * @param {boolean} - flag represents whether to enable or disable this component
     */
    set enabled(value) {

        if (this._enabled && value == false) 
        {
            this.onDisable();
        }
        else if (!this._enabled && value == true)
        {
            this.onEnable();
        }

        this._enabled = value;
    }

    /**
     * This method is called once every time a component is enabled.
     * 
     * This method is meant to be overriden in child class, but don't forget to call super.onEnable().
     */
    onEnable() {
    }

    /**
     * This method is called once every time a component is disabled.
     * 
     * This method is meant to be overriden in child class, but don't forget to call super.onDisable().
     */
    onDisable() {
    }

    /**
     * onSensorEnter is called any time another entity enters this entity's sensor. This method is intended to be overriden in child class.
     * 
     * All sensors attached to an entity are treated as a single composite sensor.
     * 
     * @param {PsyanimEntity} entity - the entity that entered this entity's sensor. 
     */
    onSensorEnter(entity) {

    }

    /**
     * onSensorExit is called any time another entity exits this entity's sensor. This method is intended to be overriden in child class.
     * 
     * All sensors attached to an entity are treated as a single composite sensor.
     * 
     * @param {PsyanimEntity} entity - the entity that exited this entity's sensor.
     */
    onSensorExit(entity) {
        
    }

    /**
     * This method is called once after a scene is created for each component instance.
     * 
     * It will run after the constructor(), but before the first time update() is called,
     * and guaranteed to only run after the `PsyanimScene`'s create() method has finished.
     * 
     * This method is meant to be overriden in child class, but don't forget to call super.afterCreate().
     */
    afterCreate() {

        this._afterCreateCalled = true;
    }

    /**
     * This method is called once after a scene load has been triggered, but before the current scene shuts down.
     */
    beforeShutdown() {
    }

    /**
     * This method is run once every simulation frame.
     * 
     * @param {number} t - current time in seconds, measured relative to app start
     * @param {number} dt - time since last update() ran, in ms (frametime)
     */
    update(t, dt) {

        if (!this._afterCreateCalled)
        {
            this.afterCreate();
        }
    }
}