import PsyanimBehaviorTreeNode from "./PsyanimBehaviorTreeNode.js";

export default class PsyanimBehaviorTreeLeafNode extends PsyanimBehaviorTreeNode {

    tickDelegate;
    tickParameters;

    constructor(name, tickDelegate = null, tickParameters = null) {

        super(name);

        this.tickDelegate = tickDelegate;
        this.tickParameters = tickParameters;
    }

    tick() {
        
        if (this.tickDelegate)
        {
            let childStatus = null;

            if (this.tickParameters)
            {
                childStatus = this.tickDelegate(this.tickParameters);
            }
            else
            {
                childStatus = this.tickDelegate();
            }

            this.validateChildStatus(childStatus);

            return childStatus;
        }
        else
        {
            return PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }
    }
}