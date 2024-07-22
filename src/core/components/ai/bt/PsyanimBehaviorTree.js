import PsyanimBehaviorTreeNode from './PsyanimBehaviorTreeNode.js';

export default class PsyanimBehaviorTree {

    constructor(name) {

        this._name = name;
        this._root = new PsyanimBehaviorTreeNode("root");
    }

    static fromJson(jsonData) {

        console.error("TODO: implement!");
        return null;
    }

    tick() {

        // TODO: this is probably where we want to handle decorators and things
        let status = this._root.tick();

        if (status === PsyanimBehaviorTreeNode.STATUS.FAILURE || 
            status === PsyanimBehaviorTreeNode.STATUS.SUCCESS)
        {
            this._root.reset();
        }
    }

    printTree() {

        let nodeStack = [];

        nodeStack.push({ level: 0, node: this._root });

        while (nodeStack.length !== 0)
        {
            let nextNode = nodeStack.pop();

            let style = null;

            if (nextNode.node.status === PsyanimBehaviorTreeNode.STATUS.UNTICKED)
            {
                style = 'color: white;';
            }
            else if (nextNode.node.status === PsyanimBehaviorTreeNode.STATUS.FAILURE)
            {
                style = 'color: red;';
            }
            else if (nextNode.node.status === PsyanimBehaviorTreeNode.STATUS.SUCCESS)
            {
                style = 'color: green;';
            }
            else if (nextNode.node.status === PsyanimBehaviorTreeNode.STATUS.RUNNING)
            {
                style = 'color: yellow;';
            }
            else
            {
                console.error("Next node status is invalid!");
            }

            console.log('%c' + '|    '.repeat(nextNode.level) + '|-' + nextNode.node.name, style);

            for (let i = nextNode.node.children.length - 1; i >= 0; --i)
            {
                nodeStack.push({ level: nextNode.level + 1, node: nextNode.node.children[i] });
            }
        }
    }
}