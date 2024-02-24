import PsyanimBehaviorTreeNode from "./PsyanimBehaviorTreeNode.js";

export default class PsyanimBehaviorTree {

    constructor() {

        this._root = new PsyanimBehaviorTreeNode("root");
    }

    printTree() {

    }

    tick() {

        if (this._root.children.length === 0)
        {
            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }

        return this._root.tick();
    }
}