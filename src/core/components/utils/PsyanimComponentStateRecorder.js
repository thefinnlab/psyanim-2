import PsyanimComponent from '../../PsyanimComponent.js';

export default class PsyanimComponentStateRecorder extends PsyanimComponent {

    componentType;
    componentInstance;

    constructor(entity) {

        super(entity);

        this._stateBuffer = [];

        this._currentComponentState = null;

        this._state = PsyanimComponentStateRecorder.STATE.STOPPED;
    }

    get data() {
        return this._stateBuffer;
    }

    record() {

        if (!this.componentType)
        {
            console.error("ERROR: 'componentType' field is null on state recorder!");
            return;
        }

        if (!this.componentInstance)
        {
            console.error("ERROR: 'componentInstance' field is null on state recorder!");
            return;
        }

        if (!this.componentType.STATE || !this.componentInstance._state)
        {
            console.error("ERROR: need to have a static 'STATE' property for componentType and componentInstance must have a '_state' field!");
            console.error("failed to start recording for type: " + this.componentType.name);
            return;
        }

        this._currentComponentState = this.componentInstance._state;

        this._stateBuffer.push({
            t: this.entity.scene.time.now,
            state: this._getStateName(this.componentType, this._currentComponentState)
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
            if (this._currentComponentState != this.componentInstance._state)
            {
                this._currentComponentState = this.componentInstance._state;

                this._stateBuffer.push({
                    t: t,
                    state: this._getStateName(this.componentType, this._currentComponentState)
                });    
            }
        }
    }
}

PsyanimComponentStateRecorder.STATE = {
    STOPPED: 0x0001,
    RECORDING: 0x0002,
};