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

                this.validateTaskStatus(childStatus);

                this._status = childStatus;
            }
            else
            {
                this._status = status;
            }
        }
        else
        {
            this._status = PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }

        return this._status;
    }
}