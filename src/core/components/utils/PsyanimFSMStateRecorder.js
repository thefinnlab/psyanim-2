import PsyanimComponent from '../../PsyanimComponent.js';

import PsyanimBasicHFSM from '../ai/PsyanimBasicHFSM.js';
import PsyanimFSM from '../ai/PsyanimFSM.js';

import { PsyanimDebug } from 'psyanim-utils';

export default class PsyanimFSMStateRecorder extends PsyanimComponent {

    stateMachine;

    recordResumeEvents;
    recordStopEvents;
    recordEnterEvents;
    recordExitEvents;

    recordOnStart;

    debug;

    constructor(entity) {

        super(entity);

        this._stateBuffer = [];

        this.recordOnStart = true;

        this.recordResumeEvents = false;
        this.recordStopEvents = false;
        this.recordEnterEvents = false;
        this.recordExitEvents = false;

        this.debug = false;

        this._fsmResumedHandler = this._handleFSMResumed.bind(this);
        this._fsmStoppedHandler = this._handleFSMStopped.bind(this);
        this._fsmEnterHandler = this._handleFSMStateEntered.bind(this);
        this._fsmExitHandler = this._handleFSMStateExited.bind(this);

        this._recording = false;

        this._keys = {
            Q: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            R: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
            SPACE: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        };
    }

    get data() {

        return this._stateBuffer;
    }

    record() {

        if (this._recording)
        {
            return;
        }

        if (this.stateMachine instanceof PsyanimBasicHFSM)
        {
            if (this.recordResumeEvents)
            {
                this.stateMachine.events.on('resume', this._fsmResumedHandler);
            }

            if (this.recordStopEvents)
            {
                this.stateMachine.events.on('stop', this._fsmStoppedHandler);
            }

            if (this.recordEnterEvents)
            {
                this.stateMachine.events.on('enter', this._fsmEnterHandler);
            }

            if (this.recordExitEvents)
            {
                this.stateMachine.events.on('exit', this._fsmExitHandler);
            }
        }
        else if (this.stateMachine instanceof PsyanimFSM)
        {
            if (this.recordEnterEvents)
            {
                this.stateMachine.events.on('enter', this._fsmEnterHandler);
            }

            if (this.recordExitEvents)
            {
                this.stateMachine.events.on('exit', this._fsmExitHandler);
            }
        }
        else
        {
            PsyanimDebug.error("'stateMachine' must be an instance of PsyanimFSM or PsyanimBasicFSM!");
        }

        this._recording = true;
    }

    stop() {
        
        if (this.stateMachine instanceof PsyanimBasicHFSM)
        {
            this.stateMachine.events.off('resume', this._fsmResumedHandler);
            this.stateMachine.events.off('stop', this._fsmStoppedHandler);
            this.stateMachine.events.off('enter', this._fsmEnterHandler);
            this.stateMachine.events.off('exit', this._fsmExitHandler);
        }
        else if (this.stateMachine instanceof PsyanimFSM)
        {
            this.stateMachine.events.off('enter', this._fsmEnterHandler);
            this.stateMachine.events.off('exit', this._fsmExitHandler);
        }
        else
        {
            PsyanimDebug.error("'stateMachine' must be an instance of PsyanimFSM or PsyanimBasicFSM!");
        }

        this._recording = false;
    }

    afterCreate() {

        super.afterCreate();

        if (this.recordOnStart)
        {
            this.record();
        }
    }

    _handleFSMStateEntered(stateName) {

        this._stateBuffer.push({
            eventType: 'enter', 
            stateName: stateName,
            stateVariableSnapshot: this.stateMachine.getStateVariableSnapshot(),
            t: this.entity.scene.time.now
        });
    }

    _handleFSMStateExited(stateName) {

        this._stateBuffer.push({
            eventType: 'exit',
            stateName, stateName,
            stateVariableSnapshot: this.stateMachine.getStateVariableSnapshot(),
            t: this.entity.scene.time.now
        });
    }

    _handleFSMResumed(fsm) {

        this._stateBuffer.push({
            eventType: 'resume',
            stateMachine: fsm.constructor.name,
            currentState: fsm.currentStateName,
            stateVariableSnapshot: this.stateMachine.getStateVariableSnapshot(),
            t: this.entity.scene.time.now
        });
    }

    _handleFSMStopped(fsm) {

        this._stateBuffer.push({
            eventType: 'stop',
            stateMachine: fsm.constructor.name,
            currentState: fsm.currentStateName,
            stateVariableSnapshot: this.stateMachine.getStateVariableSnapshot(),
            t: this.entity.scene.time.now
        });
    }

    _recordSnapshot() {

        this._stateBuffer.push(this.stateMachine.getStateVariableSnapshot());
    }

    update(t, dt) {

        super.update(t, dt);

        if (this.debug)
        {
            if (Phaser.Input.Keyboard.JustDown(this._keys.SPACE))
            {
                let length = JSON.stringify(this._stateBuffer).length;

                console.log('PsyanimFSMStateRecorder buffer length =', length, ', buffer =', this._stateBuffer);
            }

            if (Phaser.Input.Keyboard.JustDown(this._keys.R))
            {
                this.record();
            }

            if (Phaser.Input.Keyboard.JustDown(this._keys.Q))
            {
                this.stop();
            }
        }
    }
}