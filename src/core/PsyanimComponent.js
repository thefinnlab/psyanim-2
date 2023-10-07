export default class PsyanimComponent {

    entity;

    constructor(entity) {

        this.entity = entity;
        this.scene = entity.scene;

        this._enabled = true;
    }

    destroy() {

        this.enabled = false;

        this.entity._removeComponent(this);
        
        this.entity = null;
    }

    get enabled() {
        return this._enabled;
    }

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

    onEnable() {
    }

    onDisable() {
    }

    afterCreate() {
    }

    beforeShutdown() {
    }

    update(t, dt) {
    }
}