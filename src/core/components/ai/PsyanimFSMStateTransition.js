/**
 *  `PsyanimFSMStateTransition` encapsulates information necessary for a state transition within a PsyanimFSM.
 */
export default class PsyanimFSMStateTransition {

    /**
     * @param {PsyanimFSM} fsm 
     * @param {PsyanimFSMState} targetStateType 
     * @param {string} variableKey 
     * @param {function} condition 
     */
    constructor(fsm, targetStateType, variableKey, condition) {

        this._targetStateType = targetStateType;
        this._fsm = fsm;
        this._variableKey = variableKey;
        this._condition = condition;
    }

    /**
     *  Reference to target state for this transition.
     * 
     *  @type {PsyanimFSMState}
     */
    get targetStateType() {

        return this._targetStateType;
    }

    /**
     *  Variable key for the transition variable used in transition condition.
     * 
     *  @type {string}
     */
    get variableKey() {

        return this._variableKey;
    }

    /**
     *  `true` if transition condition is met during FSM execution.
     * 
     *  @type {boolean}
     */
    get isTriggered() {

        let variableValue = this._fsm.getStateVariable(this._variableKey);

        return this._condition(variableValue);
    }
}