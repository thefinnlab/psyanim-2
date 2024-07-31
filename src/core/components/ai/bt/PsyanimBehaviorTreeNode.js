export default class PsyanimBehaviorTreeNode {

    // TODO: node needs access to the blackboard

    constructor(controller, id, name) {

        this._controller = controller;
        this._id = id;
        this._name = name;
        this._children = [];
        this._status = PsyanimBehaviorTreeNode.STATUS.UNTICKED;
    }

    get controller() {

        return this._controller;
    }

    get id() {

        return this._id;
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

    get childCount() {

        return this._children.length;
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
        
    }
}

const STATUS_ENUM = {
    UNTICKED: -1,
    FAILURE: 0x00,
    SUCCESS: 0x01,
    RUNNING: 0x02
};

PsyanimBehaviorTreeNode.STATUS = STATUS_ENUM;