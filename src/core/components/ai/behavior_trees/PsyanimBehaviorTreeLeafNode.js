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
            let status = null;

            if (this.tickParameters)
            {
                status = this.tickDelegate(this.tickParameters);
            }
            else
            {
                status = this.tickDelegate();
            }

            this.validateTaskStatus(status);

            return status;
        }
        else
        {
            return PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }
    }
}