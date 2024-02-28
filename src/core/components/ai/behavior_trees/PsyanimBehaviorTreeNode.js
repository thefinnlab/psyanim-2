import { PsyanimDebug } from 'psyanim-utils';

export default class PsyanimBehaviorTreeNode {

    constructor(name) {

        this._name = name;
        this._children = [];
        this._status = PsyanimBehaviorTreeNode.STATUS.UNTICKED;
    }

    get name() {

        return this._name;
    }

    get status() {

        return this._status;
    }

    get children() {

        return this._children;
    }

    addChild(node) {

        this._children.push(node);
    }

    validateTaskStatus(status) {

        let isValid = (status === PsyanimBehaviorTreeNode.STATUS.UNTICKED ||
            status === PsyanimBehaviorTreeNode.STATUS.RUNNING ||
            status === PsyanimBehaviorTreeNode.STATUS.SUCCESS || 
            status === PsyanimBehaviorTreeNode.STATUS.FAILURE);

        if (!isValid)
        {
            PsyanimDebug.error('Invalid task status! node: ', this.name);
        }
    }

    reset() {

        this._status = PsyanimBehaviorTreeNode.STATUS.UNTICKED;
        this._children.forEach(child => child.reset());
    }

    tick() {

        if (this._children.length === 0)
        {
            this._status = PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }
        else
        {
            let childStatus = this._children[0].tick();

            this.validateTaskStatus(childStatus);
    
            this._status = childStatus;    
        }

        return this._status;
    }
}

const STATUS_ENUM = {
    UNTICKED: -1,
    FAILURE: 0x00,
    SUCCESS: 0x01,
    RUNNING: 0x02
};

PsyanimBehaviorTreeNode.STATUS = STATUS_ENUM;