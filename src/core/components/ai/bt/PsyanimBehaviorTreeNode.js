import { PsyanimDebug } from "psyanim-utils";

export default class PsyanimBehaviorTreeNode {

    constructor(controller, id, name) {

        this._controller = controller;
        this._id = id;
        this._name = name;
        this._children = [];
        this._status = PsyanimBehaviorTreeNode.STATUS.UNTICKED;

        this._decorators = [];

        this._evaluatedDecorators = false;

        this._events = new Phaser.Events.EventEmitter();
    }

    get events() {

        return this._events;
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

    get decorators() {

        return this._decorators;
    }

    getAllChildrenRecursive() {

        let children = [];

        for (let i = 0; i < this._children.length; ++i)
        {
            let child = this._children[i];

            children.push(child);

            children.push(...child.getAllChildrenRecursive());
        }

        return children;
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

        this._evaluatedDecorators = false;
        this._canExecute = false;

        this._children.forEach(child => child.reset());
    }

    evaluateDecorators(setEvaluated = true) {

        if (this._decorators.length === 0)
        {
            if (setEvaluated)
            {
                this._evaluatedDecorators = true;
            }

            return true;
        }

        for (let i = 0; i < this._decorators.length; ++i)
        {
            let success = this._decorators[i].evaluate();

            if (!success)
            {
                return false;
            }
        }

        if (setEvaluated)
        {
            this._evaluatedDecorators = true;
        }

        return true;
    }

    get canExecute() {

        return this._canExecute;
    }

    fail() {

        this._status = PsyanimBehaviorTreeNode.STATUS.FAILURE;

        this._canExecute = false;
        this._evaluatedDecorators = true;
    }

    tick(t, dt) {

        this.events.emit('tick', this);

        if (!this._evaluatedDecorators)
        {
            this._canExecute = this.evaluateDecorators();
        }
    }
}

const STATUS_ENUM = {
    UNTICKED: -1,
    FAILURE: 0x00,
    SUCCESS: 0x01,
    RUNNING: 0x02
};

PsyanimBehaviorTreeNode.STATUS = STATUS_ENUM;