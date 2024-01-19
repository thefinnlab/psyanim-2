import PsyanimComponent from "../../PsyanimComponent.js";

import { PsyanimDebug } from "psyanim-utils";

import PsyanimBasicHFSMInterrupt from "./PsyanimBasicHFSMInterrupt.js";

export default class PsyanimBasicHFSM extends PsyanimComponent {

    initialSubStateMachine;

    constructor(entity) {

        super(entity);

        this._initialized = false;

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

        console.log(this._interrupts);
    }

    afterCreate() {

        super.afterCreate();
    }

    _handleInterruptTriggered(interrupt) {

        console.log('interrupt triggered: ', interrupt);

        if (interrupt.destinationFSM)
        {
            // pause current FSM and add destination FSM to stack
            interrupt.sourceFSM.pause();

            interrupt.destinationFSM.resume();

            this._fsmStack.push(interrupt.destinationFSM);
        }
        else // stop the current FSM and pop it off stack
        {
            interrupt.sourceFSM.stop();

            if (this._fsmStack.length >= 2)
            {
                console.log('about to pop fsm stack:', this._fsmStack);

                this._fsmStack.pop();

                this._fsmStack.at(-1).resume();    
            }
            else
            {
                PsyanimDebug.error('ERROR FSM Stack corrupted: ', this._fsmStack);
            }
        }
    }
    
    _init() {

        // only 1 sub-state machine on stack to start
        this._fsmStack = [this.initialSubStateMachine];

        // make sure sub-state machines are stopped initially
        this._subStateMachines.forEach(fsm => fsm.stop());

        // run the configured initial sub-state machine
        this.initialSubStateMachine.resume();

        this._currentFSM = this.initialSubStateMachine;

        this._initialized = true;
    }

    update(t, dt) {

        super.update(t, dt);

        if (!this._initialized)
        {
            this._init();
        }

        // see if we have triggered any interrupts for the current fsm at top of stack

        // TODO: can we clean this up so it's not filtering every frame 
        //          and add some helper methods somewhere else for this?
        let currentFsmName = this._fsmStack.at(-1).constructor.name;

        let filteredInterrupts = this._interrupts.filter(i => i.sourceFSM.constructor.name == currentFsmName);

        for (let i = 0; i < filteredInterrupts.length; ++i)
        {
            if (filteredInterrupts[i].isTriggered)
            {
                this._handleInterruptTriggered(filteredInterrupts[i]);
                
                break; // users should design for only 1 interrupt triggered at a time
            }
        }
    }
}