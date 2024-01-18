import PsyanimComponent from "../../PsyanimComponent.js";

import { PsyanimDebug } from "psyanim-utils";

class PsyanimBasicHFSMInterrupt {

    constructor(sourceFSM, variableKey, condition, destinationFSM = null) {

        this._sourceFSM = sourceFSM;
        this._destinationFSM = destinationFSM;
        this._variableKey = variableKey;
        this._condition = condition;
    }

    get sourceFSM() {

        return this._sourceFSM;
    }

    get destinationFSM() {

        return this._destinationFSM;
    }
    
    get isTriggered() {

        let variableValue = this._sourceFSM.getStateVariable(this._variableKey);

        return this._condition(variableValue);
    }
}

export default class PsyanimBasicHFSM extends PsyanimComponent {

    initialSubStateMachine;

    constructor(entity) {

        super(entity);

        /**
         *  Going to allow for adding 'SubStateMachines' and declaring 
         *  transitions between them based on the fsm.events EventEmitter.
         * 
         *  Certain FSM event types, prefixed with an '_' will be reserved
         *  specifically for communicating with the higher-level HFSM.
         *  
         *  These event types get published based on state variable changes.
         *  So, the state variables themselves should be prefixed with '_'.
         */

        this._subStateMachines = [];
        this._interrupts = [];
    }

    getSubStateMachine(fsmType) {
        
        return this._subStateMachines.find(fsm => fsm instanceof fsmType);
    }

    hasSubStateMachine(fsmType) {

        if (this.getSubStateMachine(fsmType))
        {
            return true;
        }

        return false;
    }

    addSubStateMachine(fsm) {

        this._subStateMachines.push(fsm);
    }

    addInterrupt(sourceFSMType, variableKey, condition, destinationFSMType = null) {

        let sourceFSM = this.getSubStateMachine(sourceFSMType);

        let destinationFSM = this.getSubStateMachine(destinationFSMType);

        let interrupt = new PsyanimBasicHFSMInterrupt(sourceFSM, variableKey, condition, destinationFSM);

        this._interrupts.push(interrupt);
    }

    afterCreate() {

        super.afterCreate();

        // only 1 sub-state machine on stack to start
        this._fsmStack = [this.initialSubStateMachine];

        // make sure sub-state machines are stopped initially
        this._subStateMachines.forEach(fsm => fsm.stop());

        // run the configured initial sub-state machine
        this.initialSubStateMachine.resume();
    }

    _handleInterruptTriggered(interrupt) {

        if (interrupt.destinationFSM)
        {
            interrupt.sourceFSM.pause();

            interrupt.destinationFSM.start();

            this._fsmStack.push(interrupt.destinationFSM);
        }
        else
        {
            interrupt.sourceFSM.stop();

            this._fsmStack.pop();

            this._fsmStack.at(-1).resume();
        }
    }
    
    update(t, dt) {

        super.update(t, dt);

        // see if we have triggered any interrupts
        for (let i = 0; i < this._interrupts.length; ++i)
        {
            if (this._interrupts[i].isTriggered)
            {
                this._handleInterruptTriggered(this._interrupts[i]);
            }
        }
    }
}