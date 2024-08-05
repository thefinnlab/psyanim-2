import { PsyanimBehaviorTreeDecoratorEnums, PsyanimBehaviorTreeTaskDefinition } from "psyanim-utils";

export default class PsyanimBehaviorTreeDecorator {

    get status() {

        return this._status;
    }

    get keyTypeAsString() {

        switch (this._keyType) {

            case PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE.BOOLEAN:

                return 'Boolean';

            case PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE.NUMBER:

                return 'Number';

            case PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE.STRING:

                return 'String';

            default:

                console.error("Unknown decorator key type:", this._keyType);

                return null;
        }
    }

    /**
     * 
     * @param {PsyanimBehaviorTreeNode} node 
     * @param {PsyanimBehaviorTreeDecoratorEnums.ABORT_MODE} abortMode 
     * @param {String} key 
     * @param {PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE} keyType 
     * @param {*} keyQueryType 
     * @param {*} keyValue - can be string or number
     */
    constructor(node, abortMode, key, keyType, keyQueryType, keyValue = null) {

        this._node = node;

        this._abortMode = abortMode;
        this._key = key;
        this._keyType = keyType;
        this._keyQueryType = keyQueryType;
        this._keyValue = keyValue;

        this._status = PsyanimBehaviorTreeTaskDefinition.STATUS.UNTICKED;
    }

    evaluate() {

        let value = this._node.controller.blackboard.getValue(key);

        switch (this._keyType) {

            case PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE.BOOLEAN:

                if (this._checkBoolean(value))
                {
                    this._status = PsyanimBehaviorTreeTaskDefinition.STATUS.SUCCESS;
                }
                else
                {
                    this._status = PsyanimBehaviorTreeTaskDefinition.STATUS.FAILURE;
                }

                break;

            case PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE.NUMBER:

                if (this._checkNumber(value))
                {
                    this._status = PsyanimBehaviorTreeTaskDefinition.STATUS.SUCCESS;
                }
                else
                {
                    this._status = PsyanimBehaviorTreeTaskDefinition.STATUS.FAILURE;
                }

                break;

            case PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE.STRING:

                if (this._checkString(value))
                {
                    this._status = PsyanimBehaviorTreeTaskDefinition.STATUS.SUCCESS;
                }
                else
                {
                    this._status = PsyanimBehaviorTreeTaskDefinition.STATUS.FAILURE;
                }

                break;

            default:

                console.error("Unknown decorator key type:", this._keyType);
                
                this._status = PsyanimBehaviorTreeTaskDefinition.STATUS.FAILURE;
        }

        return this._status === PsyanimBehaviorTreeTaskDefinition.STATUS.SUCCESS;
    }

    _checkBoolean(value) {

        switch (this._keyQueryType) {

            case PsyanimBehaviorTreeDecoratorEnums.BOOLEAN_QUERY_TYPE.IS_SET:

                if (value)
                {
                    return true;
                }
                else
                {
                    return false;
                }

            case PsyanimBehaviorTreeDecoratorEnums.BOOLEAN_QUERY_TYPE.IS_NOT_SET:

                if (!value)
                {
                    return true;
                }
                else 
                {
                    return false;
                }

            default:

                console.error('Key query type has invalid value:', this._keyQueryType);
        }
    }

    _checkNumber(value) {

        switch (this._keyQueryType) {

            case PsyanimBehaviorTreeDecoratorEnums.NUMBER_QUERY_TYPE.EQUAL_TO:

                return value === this._keyValue;

            case PsyanimBehaviorTreeDecoratorEnums.NUMBER_QUERY_TYPE.NOT_EQUAL_TO:

                return value !== this._keyValue;

            case PsyanimBehaviorTreeDecoratorEnums.NUMBER_QUERY_TYPE.GREATER_THAN:

                return value > this._keyValue;

            case PsyanimBehaviorTreeDecoratorEnums.NUMBER_QUERY_TYPE.GREATHER_THAN_OR_EQUAL:

                return value >= this._keyValue;

            case PsyanimBehaviorTreeDecoratorEnums.NUMBER_QUERY_TYPE.LESS_THAN:

                return value < this._keyValue;

            case PsyanimBehaviorTreeDecoratorEnums.NUMBER_QUERY_TYPE.LESS_THAN_OR_EQUAL:

                return value <= this._keyValue;

            default:

                console.error('Key query type has invalid value:', this._keyQueryType);
        }
    }

    _checkString(value) {

        switch (this._keyQueryType) {

            case PsyanimBehaviorTreeDecoratorEnums.STRING_QUERY_TYPE.EQUAL_TO:

                return value === this._keyValue;
 
            case PsyanimBehaviorTreeDecoratorEnums.STRING_QUERY_TYPE.NOT_EQUAL_TO:

                return value !== this._keyValue;

            case PsyanimBehaviorTreeDecoratorEnums.STRING_QUERY_TYPE.CONTAINS:

                return this._keyValue.includes(value);

            case PsyanimBehaviorTreeDecoratorEnums.STRING_QUERY_TYPE.DOES_NOT_CONTAIN:

                return !this._keyValue.includes(value);

            default:

                console.error('Key query type has invalid value:', this._keyQueryType);
        }
    }
}