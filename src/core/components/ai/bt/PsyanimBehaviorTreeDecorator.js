export default class PsyanimBehaviorTreeDecorator {

    // TODO: needs access to blackboard - can be via node

    blackboardKey;
    blackboardKeyValue;

    keyQuery;

    constructor(node) {

        this._node = node;
    }

    tick() {


    }
}