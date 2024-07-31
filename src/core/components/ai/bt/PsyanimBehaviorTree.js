import PsyanimBehaviorTreeNode from './PsyanimBehaviorTreeNode.js';

import PsyanimBehaviorTreeSelectorNode from './PsyanimBehaviorTreeSelectorNode.js';
import PsyanimBehaviorTreeSequenceNode from './PsyanimBehaviorTreeSequenceNode.js';

import PsyanimBehaviorTreeTask from './PsyanimBehaviorTreeTask.js';

import { 
    PsyanimDebug,

    // import built-in tasks
    MoveTo,
    PatrolTargetSelector

} from 'psyanim-utils';

export default class PsyanimBehaviorTree {

    constructor(name, controller) {

        console.warn("TODO: tree needs access to blackboard.");

        this._name = name;
        this._root = new PsyanimBehaviorTreeSequenceNode(controller, 0, "root");

        this._controller = controller;
    }

    load(behaviorTreeDefinition, userDefinedTasks = []) {

        PsyanimDebug.log('Loading Behavior Tree:', behaviorTreeDefinition);

        let builtinTasks = [
            MoveTo,
            PatrolTargetSelector
        ];

        let taskDefinitions = builtinTasks.concat(userDefinedTasks);

        let taskDefinitionNames = taskDefinitions.map(t => t.prototype.constructor.name);

        let nodes = [];

        behaviorTreeDefinition.nodes.forEach(nodeDef => {

            let node = null;

            if (nodeDef.isComposite)
            {
                if (nodeDef.type === 'Behavior Tree Root')
                {
                    node = this._root;
                }
                else if (nodeDef.type === 'Sequence')
                {
                    node = new PsyanimBehaviorTreeSequenceNode(
                        this._controller, 
                        nodeDef.id, 
                        nodeDef.name);
                }
                else if (nodeDef.type === 'Selector')
                {
                    node = new PsyanimBehaviorTreeSelectorNode(
                        this._controller,
                        nodeDef.id,
                        nodeDef.name);
                }
                else
                {
                    PsyanimDebug.error("Unknown composite type:", nodeDef.type);
                    return;
                }
            }
            else // it's a task
            {
                let taskDefinitionIndex = taskDefinitionNames.indexOf(nodeDef.type);

                let taskDefinition = taskDefinitions[taskDefinitionIndex];

                let taskDefinitionInstance = new taskDefinition(this._controller);

                let fieldDataKeys = Object.keys(nodeDef.fieldData);

                fieldDataKeys.forEach(key => {
                    taskDefinitionInstance[key] = nodeDef.fieldData[key];
                });

                node = new PsyanimBehaviorTreeTask(
                    this._controller,
                    nodeDef.id, 
                    nodeDef.name, 
                    taskDefinitionInstance);
            }

            nodes.push(node);
        });

        behaviorTreeDefinition.edges.forEach(edgeDef => {

            let parentNode = nodes.find(node => node.id === edgeDef.bottomPortNodeId);
            let childNode = nodes.find(node => node.id === edgeDef.topPortNodeId);

            if (!parentNode)
            {
                console.error('Failed to find parent node with ID:', edgeDef.bottomPortNodeId);
                return;
            }
            else if (!childNode)
            {
                console.error('Failed to find child node with ID:', edgeDef.topPortNodeId);
                return;
            }

            parentNode.children.push(childNode);
        });

        this.printTree();

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

            for (let i = nextNode.node.childCount - 1; i >= 0; --i)
            {
                nodeStack.push({ level: nextNode.level + 1, node: nextNode.node.children[i] });
            }
        }
    }
}