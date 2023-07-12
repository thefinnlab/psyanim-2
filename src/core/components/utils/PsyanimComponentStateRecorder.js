import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimComponentStateRecorder extends PsyanimComponent {

    static STATE = {
        STOPPED: 0x0001,
        RECORDING: 0x0002,
    }

    constructor(entity) {

        super(entity);

        this._stateBuffer = [];

        this._componentType = null;
        this._componentInstance = null;

        this._currentComponentState = null;

        this._state = PsyanimComponentStateRecorder.STATE.STOPPED;
    }

    get data() {
        return this._stateBuffer;
    }

    record(componentType, componentInstance) {

        if (!componentType.STATE || !componentInstance._state)
        {
            console.error("ERROR: need to have a static 'STATE' property for componentType and componentInstance must have a '_state' field!");
            console.error("failed to start recording for type: " + componentType.name);
            return;
        }

        this._componentType = componentType;
        this._componentInstance = componentInstance;

        this._currentComponentState = componentInstance._state;

        this._stateBuffer.push({
            t: this.entity.scene.time.now,
            state: this._getStateName(this._componentType, this._currentComponentState)
        });

        this._state = PsyanimComponentStateRecorder.STATE.RECORDING;
    }

    stop() {
        this._state = PsyanimComponentStateRecorder.STATE.STOPPED;
    }

    clearBuffer() {

        this._stateBuffer = [];
    }

    _getObjectKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    _getStateName(type, state) {
        return this._getObjectKeyByValue(type.STATE, state);
    }

    update(t, dt) {

        super.update(t, dt);

        if (this._state == PsyanimComponentStateRecorder.STATE.RECORDING)
        {
            if (this._currentComponentState != this._componentInstance._state)
            {
                this._currentComponentState = this._componentInstance._state;

                this._stateBuffer.push({
                    t: t,
                    state: this._getStateName(this._componentType, this._currentComponentState)
                });    
            }
        }
    }
}