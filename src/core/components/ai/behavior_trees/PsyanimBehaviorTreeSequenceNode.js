import PsyanimBehaviorTreeNode from "./PsyanimBehaviorTreeNode.js";

export default class PsyanimBehaviorTreeSequenceNode extends PsyanimBehaviorTreeNode {

    constructor(name) {

        super(name);
    }

    tick() {
        
        let childStatus = this._children[this._currentChildIndex].tick();

        this.validateChildStatus(childStatus);

        if (childStatus === PsyanimBehaviorTreeNode.STATUS.RUNNING)
        {
            return PsyanimBehaviorTreeNode.STATUS.RUNNING;
        }

        if (childStatus  === PsyanimBehaviorTreeNode.STATUS.FAILURE)
        {
            this._currentChildIndex = 0;

            return PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }

        this._currentChildIndex++;

        if (this._currentChildIndex >= this._children.length)
        {
            this._currentChildIndex = 0;

            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }

        return PsyanimBehaviorTreeNode.STATUS.RUNNING;
    }
}