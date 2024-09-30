import PsyanimBehaviorTreeNode from "./PsyanimBehaviorTreeNode.js";

export default class PsyanimBehaviorTreeSequenceNode extends PsyanimBehaviorTreeNode {

    constructor(controller, id, name) {

        super(controller, id, name);

        this._currentChildIndex = 0;
    }

    reset() {

        this._currentChildIndex = 0;

        super.reset();
    }

    tick(t, dt) {

        super.tick(t, dt);

        if (!this.canExecute)
        {
            this._status = PsyanimBehaviorTreeNode.STATUS.FAILURE;

            return this._status;
        }

        let childStatus = this._children[this._currentChildIndex].tick(t, dt);

        this.validateTaskStatus(childStatus);

        if (childStatus === PsyanimBehaviorTreeNode.STATUS.RUNNING)
        {
            this._status = PsyanimBehaviorTreeNode.STATUS.RUNNING;
        }
        else if (childStatus  === PsyanimBehaviorTreeNode.STATUS.FAILURE)
        {
            this._currentChildIndex = 0;

            this._status = PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }
        else // child tick returned succes, move onto next one if there are more
        {
            this._currentChildIndex++;

            if (this._currentChildIndex >= this._children.length)
            {
                this._currentChildIndex = 0;

                this._status = PsyanimBehaviorTreeNode.STATUS.SUCCESS;
            }
            else
            {
                this._status = PsyanimBehaviorTreeNode.STATUS.RUNNING;
            }
        }

        return this._status;
    }
}