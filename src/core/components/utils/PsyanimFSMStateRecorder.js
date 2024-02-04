import PsyanimComponent from '../../PsyanimComponent.js';

import PsyanimBasicHFSM from '../ai/PsyanimBasicHFSM.js';
import PsyanimFSM from '../ai/PsyanimFSM.js';

import { PsyanimDebug } from 'psyanim-utils';

export default class PsyanimFSMStateRecorder extends PsyanimComponent {

    stateMachine;

    debug;

    constructor(entity) {

        super(entity);

        this._stateBuffer = [];

        this.debug = false;

        this._keys = {
            SPACE: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        };
    }

    get data() {

        return this._stateBuffer;
    }

    afterCreate() {

        super.afterCreate();

        console.warn("TODO: we should be able to configure which events we want to take snapshots at!"
         + " ...to save memory and disk space.");

        if (this.stateMachine instanceof PsyanimBasicHFSM)
        {
            this.stateMachine.events.on('resume', this._handleFSMResumed.bind(this));
            this.stateMachine.events.on('stop', this._handleFSMStopped.bind(this));
            this.stateMachine.events.on('enter', this._handleFSMStateEntered.bind(this));
            this.stateMachine.events.on('exit', this._handleFSMStateExited.bind(this));
        }
        else if (this.stateMachine instanceof PsyanimFSM)
        {
            this.stateMachine.events.on('enter', this._handleFSMStateEntered.bind(this));
            this.stateMachine.events.on('exit', this._handleFSMStateExited.bind(this));
        }
        else
        {
            PsyanimDebug.error("'stateMachine' must be an instance of PsyanimFSM or PsyanimBasicFSM!");
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

        if (this.debug && Phaser.Input.Keyboard.JustDown(this._keys.SPACE))
        {
            let length = JSON.stringify(this._stateBuffer).length;

            console.log('PsyanimFSMStateRecorder buffer length =', length, ', buffer =', this._stateBuffer);
        }
    }
}