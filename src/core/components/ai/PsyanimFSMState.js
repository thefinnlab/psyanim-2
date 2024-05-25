import { PsyanimDebug } from "psyanim-utils";

import PsyanimFSMStateTransition from './PsyanimFSMStateTransition.js';

/**
 *  `PsyanimFSMState` represents a single state in a `PsyanimFSM` state machine.
 */
export default class PsyanimFSMState {

    constructor(fsm) {

        this._entity = fsm.entity;

        this._fsm = fsm;
        this._stage = PsyanimFSMState.STAGE.ENTERING;

        this._transitions = [];
    }

    /**
     *  The name of the state. Same as class name.
     * 
     *  @type {string}
     */
    get name() {

        return this.constructor.name;
    }

    /**
     *  Reference to the state machine this state belongs to.
     * 
     *  @type {PsyanimFSM}
     */
    get fsm() {

        return this._fsm;
    }

    /**
     *  Reference to the entity this state's FSM is attached to.
     * 
     *  @type {PsyanimEntity}
     */
    get entity() {

        return this._entity;
    }

    /**
     *  The stage of execution this state is currently in.
     * 
     *  @type {PsyanimFSMState.STAGE}
     */
    get stage() {
        
        return this._stage;
    }

    /**
     *  List of transitions that can be triggered while FSM is in this state.
     * 
     *  @type {PsyanimFSMStateTransition[]}
     */
    get transitions() {

        return this._transitions;
    }

    /**
     *  Returns `true` if this state is currently running.
     * 
     *  @type {boolean}
     */
    get isActive() {

        return this._stage === PsyanimFSMState.STAGE.RUNNING;
    }

    /**
     * Gets reference to state transition object by target state type and variable key.
     * 
     * @param {PsyanimFSMState} targetStateType - must be a class that inherits from `PsyanimFSMState`
     * @param {string} variableKey 
     * @returns {PsyanimFSMStateTransition}
     */
    getTransition(targetStateType, variableKey) {

        return this._transitions.find(t => {
            return t.targetStateType instanceof targetStateType
                && t.variableKey === variableKey
        });
    }

    /**
     * Returns true if state has transition defined by target state type and variable key.
     * @param {PsyanimFSMState} targetStateType - must be a class that inherits from `PsyanimFSMState`
     * @param {string} variableKey 
     * @returns {PsyanimFSMStateTransition}
     */
    hasTransition(targetStateType, variableKey) {

        if (this.getTransition(targetStateType, variableKey))
        {
            return true;
        }

        return false;
    }

    /**
     * Adds a transition to this state.
     * @param {PsyanimFSMState} targetStateType - must be a class that inherits from `PsyanimFSMState`
     * @param {*} variableKey 
     * @param {*} condition 
     * @returns {PsyanimFSMState}
     */
    addTransition(targetStateType, variableKey, condition) {

        if (this.hasTransition(targetStateType, variableKey))
        {
            PsyanimDebug.error('transition already exists: targetState = ', typeof(targetStateType), ', key = ', variableKey);
            return;
        }

        let transition = new PsyanimFSMStateTransition(this._fsm, 
            targetStateType, variableKey, condition);

        this._transitions.push(transition);

        return transition;
    }

    /**
     *  If overriden, must call super.afterCreate() in child class.
     */
    afterCreate() {

    }

    /**
     *  Called to notify state that it's been activated within the PsyanimFSM state machine. Intended to be overriden by child class, but must call super.enter()!
     */
    enter() {

        this._stage = PsyanimFSMState.STAGE.RUNNING;

        if (this.fsm.debugLogging)
        {
            PsyanimDebug.log(this._entity.name, 'ENTERING state: ', this.constructor.name);
        }
    }

    /**
     *  Called to notify state that it's been exited within the PsyanimFSM state machine. Intended to be overriden by child class, but must call super.exit()!
     */
    exit() {

        this._stage = PsyanimFSMState.STAGE.EXITED;

        if (this.fsm.debugLogging)
        {
            PsyanimDebug.log(this._entity.name, 'EXITING state: ', this.constructor.name);
        }
    }

    /**
     * This method is called when the FSM is paused. Child classes may override to add custom logic, but must call `super.onPause()`
     */
    onPause() {

    }

    /**
     * This method is called when the FSM is stopped. Child classes may override to add custom logic, but must call `super.onStop()`
     */
    onStop() {

    }

    /**
     * This method is called when the FSM is resumed. Child classes may override to add custom logic, but must call `super.onResume()`
     */
    onResume() {
        
    }

    /**
     * This method is called by the parent FSM and is intended to be overriden by child classes, but don't forget to call `super.run()`
     */
    run(t, dt) {

        if (this.fsm.debugLogging)
        {
            PsyanimDebug.log(this._entity.name, 'state RUNNING: ', this.constructor.name);            
        }
    }
}

PsyanimFSMState.STAGE = {
    ENTERING: 0x0001,
    RUNNING: 0x0002,
    EXITED:  0x0003
};