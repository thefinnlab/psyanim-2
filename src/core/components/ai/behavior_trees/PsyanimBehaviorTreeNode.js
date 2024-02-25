import { PsyanimDebug } from 'psyanim-utils';

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

    validateChildStatus(status) {

        let isValid = (status === PsyanimBehaviorTreeNode.STATUS.RUNNING ||
            status === PsyanimBehaviorTreeNode.STATUS.SUCCESS || 
            status === PsyanimBehaviorTreeNode.STATUS.FAILURE);

        if (!isValid)
        {
            PsyanimDebug.error('Invalid child status!');
        }
    }

    reset() {

        this._children.forEach(child => child.reset());

        this._currentChildIndex = 0;
    }

    tick() {

        if (this._children.length === 0)
        {
            return PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }

        let childStatus = this._children[this._currentChildIndex].tick();

        this.validateChildStatus(childStatus);

        return childStatus;
    }
}

const STATUS_ENUM = {
    FAILURE: 0X00,
    SUCCESS: 0x01,
    RUNNING: 0x02
};

PsyanimBehaviorTreeNode.STATUS = STATUS_ENUM;