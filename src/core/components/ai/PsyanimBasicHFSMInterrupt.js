/**
 *  `PsyanimBasicHFSMInterrupt` encapsulates information related to an interrupt.
 */
export default class PsyanimBasicHFSMInterrupt {

    /**
     * @param {PsyanimFSM} sourceFSM 
     * @param {string} variableKey 
     * @param {function} condition 
     * @param {PsyanimFSM} [destinationFSM]
     */
    constructor(sourceFSM, variableKey, condition, destinationFSM = null) {

        this._sourceFSM = sourceFSM;
        this._destinationFSM = destinationFSM;
        this._variableKey = variableKey;
        this._condition = condition;
    }

    /**
     *  The FSM which triggers the interrupt condition.
     * 
     *  @type {PsyanimFSM}
     */
    get sourceFSM() {

        return this._sourceFSM;
    }

    /**
     *  The FSM which the HFSM will transition to, pushing it onto the execution stack. If null, the interrupt results in `sourceFSM` being popped off stack.
     * 
     *  @type {PsyanimFSM}
     */
    get destinationFSM() {

        return this._destinationFSM;
    }
    
    /**
     *  Returns `true` if the interrupt condition is satisfied at runtime.
     * 
     *  @type {boolean}
     */
    get isTriggered() {

        let variableValue = this._sourceFSM.getStateVariable(this._variableKey);

        return this._condition(variableValue);
    }
}