import { PsyanimDebug } from "psyanim-utils";

import PsyanimFSMStateTransition from './PsyanimFSMStateTransition.js';

export default class PsyanimFSMState {

    constructor(fsm) {

        this._entity = fsm.entity;

        this._fsm = fsm;
        this._stage = PsyanimFSMState.STAGE.ENTERING;

        this._transitions = [];
    }

    get fsm() {

        return this._fsm;
    }

    get entity() {

        return this._entity;
    }

    get transitions() {

        return this._transitions;
    }

    getTransition(targetStateType, variableKey) {

        return this._transitions.find(t => {
            return t.targetStateType instanceof targetStateType
                && t.variableKey === variableKey
        });
    }

    hasTransition(targetStateType, variableKey) {

        if (this.getTransition(targetStateType, variableKey))
        {
            return true;
        }

        return false;
    }

    addTransition(targetStateType, variableKey, condition) {

        if (this.hasTransition(targetStateType, variableKey))
        {
            console.error('transition already exists: targetState = ', typeof(targetStateType), ', key = ', variableKey);
            return;
        }

        let transition = new PsyanimFSMStateTransition(this._fsm, 
            targetStateType, variableKey, condition);

        this._transitions.push(transition);

        return transition;
    }

    enter() {

        this._stage = PsyanimFSMState.STAGE.RUNNING;

        console.log('ENTERING state: ', this.constructor.name);
    }

    exit() {

        this._stage = PsyanimFSMState.STAGE.EXITED;

        console.log('EXITING state: ', this.constructor.name);
    }

    run() {

        console.log('state RUNNING: ', this.constructor.name);
    }
}

PsyanimFSMState.STAGE = {
    ENTERING: 0x0001,
    RUNNING: 0x0002,
    EXITED:  0x0003
};