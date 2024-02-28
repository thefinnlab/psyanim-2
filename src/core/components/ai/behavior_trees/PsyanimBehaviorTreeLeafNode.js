import PsyanimBehaviorTreeNode from "./PsyanimBehaviorTreeNode.js";

export default class PsyanimBehaviorTreeLeafNode extends PsyanimBehaviorTreeNode {

    tickDelegate;
    tickParameters;

    constructor(name, tickDelegate = null, tickParameters = null) {

        super(name);

        this.tickDelegate = tickDelegate;
        this.tickParameters = tickParameters;
    }

    clone() {

        let newLeafNode = new PsyanimBehaviorTreeLeafNode(this._name, this.tickDelegate, this.tickParameters);

        return newLeafNode;
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

            this._status = status;
        }
        else
        {
            this._status = PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }

        return this._status;
    }
}