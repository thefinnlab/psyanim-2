import PsyanimBehaviorTreeNode from "./PsyanimBehaviorTreeNode.js";

export default class PsyanimBehaviorTreeSelectorNode extends PsyanimBehaviorTreeNode {

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

        if (childStatus === PsyanimBehaviorTreeNode.STATUS.SUCCESS)
        {
            this._currentChildIndex = 0;
            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }

        this._currentChildIndex++;

        if (this._currentChildIndex >= this._children.length)
        {
            this._currentChildIndex = 0;

            return PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }

        return PsyanimBehaviorTreeNode.STATUS.RUNNING;
    }
}