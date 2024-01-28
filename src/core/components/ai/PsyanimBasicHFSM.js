import PsyanimComponent from "../../PsyanimComponent.js";

import { PsyanimDebug } from "psyanim-utils";

import PsyanimBasicHFSMInterrupt from "./PsyanimBasicHFSMInterrupt.js";

export default class PsyanimBasicHFSM extends PsyanimComponent {

    initialSubStateMachine;

    debugLogging;
    debugGraphics;

    constructor(entity) {

        super(entity);

        this._initialized = false;

        this.debugLogging = false;
        this.debugGraphics = false;

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

        if (!sourceFSM)
        {
            PsyanimDebug.error('ERROR: no sub-state machine exists in this PsyanimBasicHFSM for type: ', typeof(sourceFSM));
        }

        let destinationFSM = null;

        if (destinationFSMType != null)
        {
            destinationFSM = this.getSubStateMachine(destinationFSMType);

            if (!destinationFSM)
            {
                PsyanimDebug.error('ERROR: no sub-state machine exists in this PsyanimBasicHFSM for type: ', typeof(destinationFSMType));
            }    
        }

        let interrupt = new PsyanimBasicHFSMInterrupt(sourceFSM, variableKey, condition, destinationFSM);

        this._interrupts.push(interrupt);
    }

    afterCreate() {

        super.afterCreate();
    }

    _handleInterruptTriggered(interrupt) {

        if (this.debugLogging)
        {
            PsyanimDebug.log(this.constructor.name, 'Interrupt Triggered:', interrupt);
        }

        if (interrupt.destinationFSM)
        {
            // pause current FSM and add destination FSM to stack
            interrupt.sourceFSM.pause();

            this._fsmStack.push(interrupt.destinationFSM);

            interrupt.destinationFSM.resume();

            this._filterInterruptsByCurrentFSM();
        }
        else // stop the current FSM and pop it off stack
        {
            interrupt.sourceFSM.stop();

            if (this._fsmStack.length >= 2)
            {
                this._fsmStack.pop();

                this._fsmStack.at(-1).resume();

                this._filterInterruptsByCurrentFSM();
            }
            else
            {
                PsyanimDebug.error('ERROR FSM Stack corrupted: ', this._fsmStack);
            }
        }
    }
    
    _filterInterruptsByCurrentFSM() {

        let currentFsmName = this._fsmStack.at(-1).constructor.name;

        this._filteredInterrupts = this._interrupts.filter(i => i.sourceFSM.constructor.name == currentFsmName);
    }

    _init() {

        // only 1 sub-state machine on stack to start
        this._fsmStack = [this.initialSubStateMachine];

        // make sure sub-state machines are stopped initially
        this._subStateMachines.forEach(fsm => fsm.stop());

        // run the configured initial sub-state machine
        this.initialSubStateMachine.resume();

        this._currentFSM = this.initialSubStateMachine;

        this._filterInterruptsByCurrentFSM();

        this._initialized = true;
    }

    update(t, dt) {

        super.update(t, dt);

        if (!this._initialized)
        {
            this._init();
        }

        for (let i = 0; i < this._filteredInterrupts.length; ++i)
        {
            if (this._filteredInterrupts[i].isTriggered)
            {
                this._handleInterruptTriggered(this._filteredInterrupts[i]);
                
                break; // users should design for only 1 interrupt triggered at a time
            }
        }
    }
}