import PsyanimComponent from '../../PsyanimComponent.js';
import PsyanimFSMState from './PsyanimFSMState.js';

/**
 *  `PsyanimFSM` is the main finite-state machine class for the Psyanim Decision-Making framework.
 *  
 *  At any time, execution of this state machine may be resumed, paused, stopped and restarted programmatically.
 */
export default class PsyanimFSM extends PsyanimComponent {

    /**
     *  The initial state of the FSM is the first state the FSM will enter() on start.
     *  @type {PsyanimFSMState}
     */
    initialState;

    /**
     *  If true, this FSM will run in debug mode.
     *  @type {boolean}
     */
    debugLogging;

    constructor(entity) {

        super(entity);

        this.debugLogging = false;
        this.debugGraphics = false;

        this._stateVariables = {};
        this._states = [];

        this._initialized = false;

        this._running = true;

        /**
         *  Event emitter for this FSM.
         *  @type {Phaser.Events.EventEmitter}
         */
        this.events = new Phaser.Events.EventEmitter();
    }

    /**
     *  The name of the currently executing state.
     *  @type {string}
     */
    get currentStateName() {

        return this._currentState.constructor.name;
    }

    /**
     * Returns a snapshot of the current state variables for this FSM.
     * 
     * @returns {Object} - object containing state variables as key-value pairs
     */
    getStateVariableSnapshot() {

        let snapshot = {};

        let stateKeys = Object.keys(this._stateVariables);

        // copy the whole object
        for (let i = 0; i < stateKeys.length; ++i)
        {
            let key = stateKeys[i];

            snapshot[key] = this._stateVariables[key];
        }

        return snapshot;
    }

    /**
     * Returns a JSON object containing this FSM's state variables
     * 
     * @returns {string} - a stringified version of this FSM's state variable object
     */
    stringifyStateVariables() {

        return JSON.stringify(this._stateVariables, null, 4);
    }

    /**
     * Returns a reference to the state of type 'stateType' or null if not found
     * 
     * @param {PsyanimFSMState} stateType - a state type that inherits from PsyanimFSMState 
     * @returns {PsyanimFSMState} 
     */
    getState(stateType) {

        return this._states.find(state => state instanceof stateType);
    }

    /**
     * Returns `true` if this state machine is composed of `stateType`
     * 
     * @param {PsyanimFSMState} stateType - a state type that inherits from PsyanimFSMState
     * @returns {boolean}
     */
    hasState(stateType) {

        if (this.getState(stateType))
        {
            return true;
        }

        return false;
    }

    /**
     * This method creates a new state of type `stateType` within this state machine.
     * 
     * @param {PsyanimFSMState} stateType - a state type that inherits from PsyanimFSMState
     * @returns a reference to the newly created state instance
     */
    addState(stateType) {

        if (this.hasState(stateType))
        {
            console.error('state type already exists on this FSM: ', stateType.constructor.name);
            return;
        }

        let newState = new stateType(this);

        this._states.push(newState);

        return newState;
    }

    /**
     *  A reference to the state that is currently executing.
     *  @type {PsyanimFSMState}
     */
    get currentState() {

        return this._currentState;
    }

    /**
     *  If overriden, must call super.afterCreate() in child class.
     */
    afterCreate() {

        this._currentState = this.initialState;

        super.afterCreate();

        // call after create on each state
        for (let i = 0; i < this._states.length; ++i)
        {
            this._states[i].afterCreate();
        }
    }

    /**
     * Checks if a state variable is defined for this state machine
     * 
     * @param {string} key
     * @returns `true` if the variable is defined for this state machine
     */
    stateVariableExists(key) {

        return Object.hasOwn(this._stateVariables, key);
    }

    /**
     * Sets the value of a state variable for this state machine.
     * 
     * @param {string} key 
     * @param {*} value 
     */
    setStateVariable(key, value) {

        this._stateVariables[key] = value;
    }

    /**
     * Gets the value of a state variable for this state machine.
     * 
     * @param {string} key 
     * @returns {*} - the value of the state variable for `key`
     */
    getStateVariable(key) {

        return this._stateVariables[key];
    }

    /**
     * Pauses the execution of this state machine, w/o resetting it's state (can be resumed in same state).
     */
    pause() {

        if (this._running)
        {
            this.onPause();

            this._running = false;
        }
    }

    /**
     * Stops the execution of this state machine.
     * 
     * Current state is reset to initial state.
     */
    stop() {

        if (this._running)
        {
            this.onStop();

            if (this._currentState.stage != PsyanimFSMState.STAGE.EXITED)
            {
                this._currentState.exit();
            }
    
            this._currentState = this.initialState;
    
            this._running = false;
    
            this._initialized = false;
        }
    }

    /**
     * Stops the execution of this state machine before resuming from initial state.
     */
    restart() {

        this.stop();
        this.resume();
    }

    /**
     * Resumes the execution of this state machine.
     */
    resume() {

        if (this._running === false)
        {
            this.onResume();

            this._running = true;
        }
    }

    /**
     * This method is called when this FSM is paused. Child classes may override to add custom logic, but must call `super.onPause()`
     */
    onPause() {

        this._currentState.onPause();
    }

    /**
     * This method is called when this FSM is stopped. Child classes may override to add custom logic, but must call `super.onStop()`
     */
    onStop() {

        this._currentState.onStop();
    }

    /**
     * This method is called when this FSM is resumed. Child classes may override to add custom logic, but must call `super.onResume()`
     */
    onResume() {

        this._currentState.onResume();
    }

    /**
     *  If overriden, super.update(t, dt) must be called in child class update().
     */
    update(t, dt) {

        super.update(t, dt);

        if (!this._running)
        {
            return;
        }

        // we don't enter the 'initialState' until the first update() runs
        if (!this._initialized)
        {
            this._currentState.enter();
            this._initialized = true;
        }

        // see if we have any transition conditions met
        let currentTransition = null;

        for (let i = 0; i < this._currentState.transitions.length; ++i)
        {
            let t = this._currentState.transitions[i];

            if (t.isTriggered)
            {
                currentTransition = t;
                break;
            }
        }

        // if a transition is triggered, switch states
        if (currentTransition)
        {
            this._currentState.exit();

            this.events.emit('exit', this._currentState.name);

            let targetState = this.getState(currentTransition.targetStateType);

            targetState.enter();

            this.events.emit('enter', targetState.name);

            this._currentState = targetState;
        }

        // let the current state run
        this._currentState.run(t, dt);
    }
}