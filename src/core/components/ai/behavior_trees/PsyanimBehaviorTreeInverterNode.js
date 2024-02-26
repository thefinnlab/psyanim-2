import PsyanimBehaviorTreeNode from "./PsyanimBehaviorTreeNode.js";

export default class PsyanimBehaviorTreeInverterNode extends PsyanimBehaviorTreeNode {

    constructor(name) {

        super(name);
    }

    tick() {
        
        let childStatus = this._children[0].tick();

        if (childStatus === PsyanimBehaviorTreeNode.STATUS.SUCCESS)
        {
            return PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }
        else if (childStatus === PsyanimBehaviorTreeNode.STATUS.FAILURE)
        {
            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }
        else
        {
            return PsyanimBehaviorTreeNode.STATUS.RUNNING;
        }
    }
}