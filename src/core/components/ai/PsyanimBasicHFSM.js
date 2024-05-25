import PsyanimComponent from "../../PsyanimComponent.js";

import { PsyanimDebug } from "psyanim-utils";

import PsyanimBasicHFSMInterrupt from "./PsyanimBasicHFSMInterrupt.js";

/**
 *  `PsyanimBasicHFSM` is a variant of a hierarchical state machine which allows building a state machine
 *  that's composed of other state machines, with a stack-based mechanism for interrupting a state machine
 *  to begin execution of another, or to resume execution of a previously running machine from same state.
 */
export default class PsyanimBasicHFSM extends PsyanimComponent {

    /**
     *  Initial state machine to execute on start
     *  @type {PsyanimFSM}
     */
    initialSubStateMachine;

    /**
     *  Enabled debug logging in console
     *  @type {boolean}
     */
    debugLogging;

    /**
     *  Enabled debug visualization in phaser canvas
     *  @type {boolean}
     */
    debugGraphics;

    /**
     *  Event emitter for all PsyanimBasicHFSM events
     * 
     *  @type {Phaser.Matter.Events.EventEmitter}
     */
    events;

    constructor(entity) {

        super(entity);

        this._initialized = false;

        this.debugLogging = false;
        this.debugGraphics = false;

        this._subStateMachines = [];
        this._interrupts = [];

        this.events = new Phaser.Events.EventEmitter();
    }

    /**
     * The name of the currently executing PsyanimFSM instance.
     * 
     * @type {string}
     */
    get currentFSMName() {

        return this.getCurrentSubStateMachine().constructor.name;
    }

    /**
     * Returns the name of the current state for the currently executing PsyanimFSM instance.
     * 
     * @type {string}
     */
    get currentStateName() {

        return this.getCurrentSubStateMachine().currentStateName;
    }

    /**
     * Returns a snapshot of the current state variables for all sub-state machines in the HFSM.
     * 
     * @returns {Object} - object containing the state variables as key-value pairs.
     */
    getStateVariableSnapshot() {

        let fsmSnapshots = [];

        for (let i = 0; i < this._subStateMachines.length; ++i)
        {
            let fsm = this._subStateMachines[i];
            let fsmName = fsm.constructor.name;

            let snapshot = {
                fsmName: fsmName,
                stateVariables: fsm.getStateVariableSnapshot()
            };

            fsmSnapshots.push(snapshot);
        }

        return fsmSnapshots;
    }

    /**
     * Returns a JSON object containing this HFSM's state variables
     * 
     * @returns {string} - a stringified version of this HFSM's state variables
     */
    stringifyStateVariables() {

        let data = [];

        for (let i = 0; i < this._subStateMachines.length; ++i)
        {
            let subStateMachine = this._subStateMachines[i];

            data.push({ 
                fsmType: subStateMachine.constructor.name,
                stateVariables: subStateMachine.stringifyStateVariables()
            });
        }

        return JSON.stringify(data);
    }

    /**
     * Returns a reference to the currently executing sub-state machine
     * 
     * @returns {PsyanimFSM} - object of type that inherits from PsyanimFSM
     */
    getCurrentSubStateMachine() {

        return this._fsmStack.at(-1);
    }

    /**
     * Gets a reference to sub-state machine of type `fsmType`
     * 
     * @param {PsyanimFSM} fsmType - type that inherits from `PsyanimFSM`
     * @returns {PsyanimFSM}
     */
    getSubStateMachine(fsmType) {
        
        return this._subStateMachines.find(fsm => fsm instanceof fsmType);
    }

    /**
     * Returns true if this HFSM is composed of an FSM of type `fsmType`
     * 
     * @param {PsyanimFSM} fsmType - type that inherits from `PsyanimFSM`
     * @returns {boolean}
     */
    hasSubStateMachine(fsmType) {

        if (this.getSubStateMachine(fsmType))
        {
            return true;
        }

        return false;
    }

    /**
     * Adds a sub-state machine to this HFSM.
     * 
     * @param {PsyanimFSM} fsm - instance of a type that inherits from `PsyanimFSM`
     */
    addSubStateMachine(fsm) {

        this._subStateMachines.push(fsm);
    }

    /**
     * Sets up interrupt to either 1) transition from `sourceFSMType` to `destinationFSMType` or 2) pop running `sourceFSMType` off the stack.
     * 
     * @param {PsyanimFSM} sourceFSMType - instance of a type that inherits from `PsyanimFSM`
     * @param {string} variableKey - name of variable key to be checked in the `condition` function
     * @param {function} condition - function that accepts the value of `variableKey` variable and returns true or false
     * @param {PsyanimFSM} [destinationFSMType] - instance of a type that inherits from `PsyanimFSM`. If null, `sourceFSMType` gets popped off stack on transition.
     */
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

    /**
     *  If overriden, must call super.afterCreate() in child class.
     */
    afterCreate() {

        super.afterCreate();
    }

    _handleFSMStateEntered(stateName) {

        this.events.emit('enter', stateName);
    }

    _handleFSMStateExited(stateName) {

        this.events.emit('exit', stateName);
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

            this.events.emit('pause', interrupt.sourceFSM);

            this._fsmStack.push(interrupt.destinationFSM);

            interrupt.destinationFSM.resume();

            this.events.emit('resume', interrupt.destinationFSM);

            this._filterInterruptsByCurrentFSM();
        }
        else // stop the current FSM and pop it off stack
        {
            interrupt.sourceFSM.stop();

            this.events.emit('stop', interrupt.sourceFSM);

            if (this._fsmStack.length >= 2)
            {
                this._fsmStack.pop();

                this.getCurrentSubStateMachine().resume();

                this.events.emit('resume', this.getCurrentSubStateMachine());

                this._filterInterruptsByCurrentFSM();
            }
            else
            {
                PsyanimDebug.error('ERROR FSM Stack corrupted: ', this._fsmStack);
            }
        }
    }
    
    _filterInterruptsByCurrentFSM() {

        let currentFsmName = this.currentFSMName;

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

        // sub to fsm events
        this._fsmEnterEventHandler = this._handleFSMStateEntered.bind(this);
        this._fsmExitEventHandler = this._handleFSMStateExited.bind(this);

        for (let i = 0; i < this._subStateMachines.length; ++i)
        {
            let fsm = this._subStateMachines[i];

            fsm.events.on('enter', this._fsmEnterEventHandler);
            fsm.events.on('exit', this._fsmExitEventHandler);
        }

        this._initialized = true;
    }

    /**
     *  If overriden, super.update(t, dt) must be called in child class update().
     */
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