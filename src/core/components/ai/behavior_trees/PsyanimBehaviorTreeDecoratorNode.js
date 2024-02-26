import PsyanimBehaviorTreeNode from "./PsyanimBehaviorTreeNode.js";

export default class PsyanimBehaviorTreeDecoratorNode extends PsyanimBehaviorTreeNode {


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

            if (status === PsyanimBehaviorTreeNode.STATUS.SUCCESS)
            {
                let childStatus = this._children[0].tick();

                return childStatus;
            }
            else
            {
                return status;
            }
        }
        else
        {
            return PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }
    }
}