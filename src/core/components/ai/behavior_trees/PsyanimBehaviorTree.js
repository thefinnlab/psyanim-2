import PsyanimBehaviorTreeNode from "./PsyanimBehaviorTreeNode.js";

export default class PsyanimBehaviorTree extends PsyanimBehaviorTreeNode {

    constructor(name = "root") {

        super(name);
    }

    printTree() {

        let nodeStack = [];

        nodeStack.push({ level: 0, node: this });

        while (nodeStack.length !== 0)
        {
            let nextNode = nodeStack.pop();

            console.log('---'.repeat(nextNode.level), nextNode.node.name);

            for (let i = nextNode.node.children.length - 1; i >= 0; --i)
            {
                nodeStack.push({ level: nextNode.level + 1, node: nextNode.node.children[i] });
            }
        }
    }
}