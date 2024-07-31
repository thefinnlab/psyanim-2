import PsyanimBehaviorTreeNode from "./PsyanimBehaviorTreeNode.js";

export default class PsyanimBehaviorTreeSelectorNode extends PsyanimBehaviorTreeNode {

    constructor(controller, id, name) {

        super(controller, id, name);

        this._currentChildIndex = 0;
    }

    reset() {

        this._currentChildIndex = 0;

        super.reset();
    }

    tick() {
        
        let childStatus = this._children[this._currentChildIndex].tick();

        this.validateTaskStatus(childStatus);

        if (childStatus === PsyanimBehaviorTreeNode.STATUS.RUNNING)
        {
            this._status = PsyanimBehaviorTreeNode.STATUS.RUNNING;
        }
        else if (childStatus === PsyanimBehaviorTreeNode.STATUS.SUCCESS)
        {
            this._currentChildIndex = 0;
            this._status = PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }
        else // child tick returned failure, let's move onto the next child if there are more
        {
            this._currentChildIndex++;

            if (this._currentChildIndex >= this._children.length)
            {
                this._currentChildIndex = 0;

                this._status = PsyanimBehaviorTreeNode.STATUS.FAILURE;
            }
            else
            {
                this._status = PsyanimBehaviorTreeNode.STATUS.RUNNING;
            }
        }

        return this._status;
    }
}