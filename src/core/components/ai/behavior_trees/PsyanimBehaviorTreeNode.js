

export default class PsyanimBehaviorTreeNode {

    constructor(name) {

        this._name = name;
        this._children = [];
        this._currentChildIndex = 0;
    }

    get name() {

        return this._name;
    }

    get children() {

        return this._children;
    }

    addChild(node) {

        this._children.push(node);
    }

    tick() {

        if (this._children.length === 0)
        {
            return PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }

        return this._children[this._currentChildIndex].tick();
    }
}

const STATUS_ENUM = {
    FAILURE: 0X00,
    SUCCESS: 0x01,
    RUNNING: 0x02
};

PsyanimBehaviorTreeNode.STATUS = STATUS_ENUM;