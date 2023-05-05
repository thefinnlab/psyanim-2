import Phaser from 'phaser';

export default class PsyanimComponent {

    entity = null;

    constructor(entity) {

        this.entity = entity;

        this._enabled = true;
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

    update(t, dt) {
    }
}