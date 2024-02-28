import PsyanimBehaviorTreeNode from "./PsyanimBehaviorTreeNode.js";

export default class PsyanimBehaviorTreeInverterNode extends PsyanimBehaviorTreeNode {

    constructor(name) {

        super(name);
    }

    tick() {
        
        let childStatus = this._children[0].tick();

        if (childStatus === PsyanimBehaviorTreeNode.STATUS.SUCCESS)
        {
            this._status = PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }
        else if (childStatus === PsyanimBehaviorTreeNode.STATUS.FAILURE)
        {
            this._status = PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }
        else
        {
            this._status = PsyanimBehaviorTreeNode.STATUS.RUNNING;
        }

        return this._status;
    }
}