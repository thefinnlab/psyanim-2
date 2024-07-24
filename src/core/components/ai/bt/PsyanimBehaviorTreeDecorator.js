export default class PsyanimBehaviorTreeDecorator {

    // TODO: needs access to blackboard - can be via node

    /**
     *  Abort modes:
     * 
     *      - None
     *      - Self
     *      - Lower Priority
     *      - Both
     */

    /**
     *  Key Type: Boolean
     * 
     *  Key Query Types: 
     * 
     *      - Is Set
     *      - Is Not Set
     */

    /**
     *  Key Type: Float
     * 
     *  Key Query Types: 
     * 
     *      - Equal To
     *      - Not Equal To
     *      - Greater Than
     *      - Greater Than or Equal To
     *      - Less Than
     *      - Less Than Or Equal To
     */

    /**
     *  Key Type: Float
     * 
     *  Key Query Types: 
     * 
     *      - Equal To
     *      - Not Equal To
     *      - Greater Than
     *      - Greater Than or Equal To
     *      - Less Than
     *      - Less Than Or Equal To
     */

    /**
     *  Key Type: String
     * 
     *  Key Query Types:
     * 
     *      - Equal To
     *      - Not Equal To
     *      - Contains
     *      - Does Not Contain
     */

    /**
     *  Key Type: Enum
     * 
     *  Key Query Types:
     * 
     *      - Equal To
     *      - Not Equal To
     */

    blackboardKey;
    blackboardKeyValue;

    keyQuery;

    constructor(node) {

        this._node = node;
    }

    tick() {


    }
}