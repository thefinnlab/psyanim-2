import PsyanimBehaviorTreeNode from './PsyanimBehaviorTreeNode.js';
import PsyanimBehaviorTreeDecorator from './PsyanimBehaviorTreeDecorator.js';

import PsyanimBehaviorTreeSelectorNode from './PsyanimBehaviorTreeSelectorNode.js';
import PsyanimBehaviorTreeSequenceNode from './PsyanimBehaviorTreeSequenceNode.js';

import PsyanimBehaviorTreeTask from './PsyanimBehaviorTreeTask.js';

import { PsyanimBehaviorTreeDecoratorEnums, PsyanimBehaviorTreeTaskDefinition } from 'psyanim-utils';

import {

    PsyanimDebug,

    // import built-in tasks
    MoveTo,
    PatrolTargetSelector,
    Wait,
    Flee,
    Wander,
    PlayfightCharge

} from 'psyanim-utils';

export default class PsyanimBehaviorTree {

    constructor(name, controller) {

        this._name = name;
        this._root = new PsyanimBehaviorTreeSequenceNode(controller, 0, "root");

        this._nodes = [this._root];

        this._decoratorsWithAborts = [];

        this._controller = controller;
        this._blackboard = controller.blackboard;

        this._currentlyTickingNode = null;
    }

    load(behaviorTreeDefinition, userDefinedTasks = []) {

        PsyanimDebug.log('Loading Behavior Tree:', behaviorTreeDefinition);

        let builtinTasks = [
            MoveTo,
            PatrolTargetSelector,
            Wait,
            Flee,
            Wander,
            PlayfightCharge
        ];

        let taskDefinitions = builtinTasks.concat(userDefinedTasks);

        let taskDefinitionNames = taskDefinitions.map(t => t.prototype.constructor.name);

        // load nodes
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

                    let data = nodeDef.fieldData[key];

                    let taskParameter = taskDefinitionInstance[key];

                    if (data.isBlackboardKey)
                    {
                        taskParameter.setBlackboardKey(data.value);
                    }
                    else
                    {
                        taskParameter.value = data.value;
                    }
                });

                node = new PsyanimBehaviorTreeTask(
                    this._controller,
                    nodeDef.id, 
                    nodeDef.name, 
                    taskDefinitionInstance);
            }

            nodes.push(node);
        });

        this._nodes = nodes;

        // load edges & build graph 
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

            // always make sure children are sorted by id!
            parentNode.children.sort((a, b) => a.id - b.id);
        });

        // load decorators
        behaviorTreeDefinition.decorators.forEach(decoratorDef => {

            let node = this._nodes.find(n => n.id === decoratorDef.nodeId);

            if (!node)
            {
                console.error("Failed to find node with ID:", decorator.nodeId);
                return;
            }

            let abortMode = PsyanimBehaviorTreeDecoratorEnums.ABORT_MODE.NONE;

            switch (decoratorDef.fieldData["Abort Mode"].value)
            {
                case "Self":

                    abortMode = PsyanimBehaviorTreeDecoratorEnums.ABORT_MODE.SELF;
                    break;

                case "Lower Priority":

                    abortMode = PsyanimBehaviorTreeDecoratorEnums.ABORT_MODE.LOWER_PRIORITY;
                    break;

                case "Both":

                    abortMode = PsyanimBehaviorTreeDecoratorEnums.ABORT_MODE.BOTH;
                    break;

                case "None":

                    abortMode = PsyanimBehaviorTreeDecoratorEnums.ABORT_MODE.NONE;
                    break;

                default:

                    console.error("Invalid decorator abort mode:", decoratorDef.fieldData["Abort Mode"].value);
                    return;
            }

            let key = decoratorDef.fieldData["Blackboard Key"].value;

            let keyType = decoratorDef.fieldData["Key Type"].value;

            if (!(keyType === PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE.STRING || 
                keyType === PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE.NUMBER || 
                keyType === PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE.BOOLEAN))
            {
                console.error('Unknown decorator key type:', keyType);
                return;
            }

            let keyQueryType = decoratorDef.fieldData["Query Type"].value;

            let keyValue = null;

            if (keyType === PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE.NUMBER || 
                keyType === PsyanimBehaviorTreeDecoratorEnums.KEY_TYPE.STRING)
            {
                keyValue = decoratorDef.fieldData["Key Query Value"].value;
            }

            let decorator = new PsyanimBehaviorTreeDecorator(
                node,
                abortMode,
                key,
                keyType,
                keyQueryType,
                keyValue
            );

            if (decorator.triggersAbort)
            {
                this._decoratorsWithAborts.push(decorator);
            }
        });

        // subscribe to node events
        this._nodes.forEach(node => {
            node.events.on('tick', this._handleNodeTick.bind(this));
        });

        // TODO: here for debugging - remove before flight!
        this.printTree();
    }

    _handleNodeTick(node) {

        this._currentlyTickingNode = node;
    }

    getAllNodeIDs() {

        let children = this._root.getAllChildrenRecursive();

        let nodeIDs = children.map(child => child.id);

        nodeIDs.unshift(this._root.id);

        return nodeIDs;
    }

    tick() {

        // check if any aborts are triggered in decorators
        if (this._currentlyTickingNode)
        {
            let nodeId = this._currentlyTickingNode.id;

            for (let i = 0; i < this._decoratorsWithAborts.length; ++i)
            {
                let decorator = this._decoratorsWithAborts[i];

                let resetTree = false;
                let failCurrentNode = false;

                if (decorator.abortMode === PsyanimBehaviorTreeDecoratorEnums.ABORT_MODE.SELF ||
                    decorator.abortMode === PsyanimBehaviorTreeDecoratorEnums.ABORT_MODE.BOTH)
                {
                    if (nodeId >= decorator.selfAbortNodeStartId && 
                        nodeId <= decorator.selfAbortNodeEndId)
                    {
                        // we should only fail the current node on 'SELF' mode if decorator fails
                        failCurrentNode = !decorator.evaluate();
                    }
                }

                if (!failCurrentNode && 
                    (decorator.abortMode === PsyanimBehaviorTreeDecoratorEnums.ABORT_MODE.LOWER_PRIORITY ||
                    decorator.abortMode === PsyanimBehaviorTreeDecoratorEnums.ABORT_MODE.BOTH))
                {
                    if (nodeId > decorator.selfAbortNodeEndId)
                    {
                        resetTree = decorator.evaluate();
                    }                    
                }

                if (resetTree)
                {
                    // reset the tree
                    this._root.reset();

                    this._currentlyTickingNode = null;

                    break;
                }
                else if (failCurrentNode)
                {
                    // fail the current node and let tree execute from there
                    this._currentlyTickingNode.fail();

                    break;
                }
            }
        }

        // tick the tree
        let status = this._root.tick();

        if (status === PsyanimBehaviorTreeNode.STATUS.FAILURE || 
            status === PsyanimBehaviorTreeNode.STATUS.SUCCESS)
        {
            // reset the tree
            this._root.reset();

            this._currentlyTickingNode = null;
        }
    }

    printTree() {

        let nodeStack = [];

        nodeStack.push({ level: 0, node: this._root });

        while (nodeStack.length !== 0)
        {
            let nextNodeData = nodeStack.pop();

            let nextNode = nextNodeData.node;

            let style = null;

            if (nextNode.status === PsyanimBehaviorTreeNode.STATUS.UNTICKED)
            {
                style = 'color: white;';
            }
            else if (nextNode.status === PsyanimBehaviorTreeNode.STATUS.FAILURE)
            {
                style = 'color: red;';
            }
            else if (nextNode.status === PsyanimBehaviorTreeNode.STATUS.SUCCESS)
            {
                style = 'color: green;';
            }
            else if (nextNode.status === PsyanimBehaviorTreeNode.STATUS.RUNNING)
            {
                style = 'color: yellow;';
            }
            else
            {
                console.error("Next node status is invalid!");
            }

            let currentLevel = nextNodeData.level;

            for (let i = 0; i < nextNode.decorators.length; ++i)
            {
                let decorator = nextNode.decorators[i];
                let label = '(BB Query: ' + decorator.keyTypeAsString + ')';

                console.log('%c' + '|    '.repeat(currentLevel++) + '|-' + label, style);
            }

            console.log('%c' + '|    '.repeat(currentLevel) + '|-' + nextNode.name, style);

            for (let i = nextNode.childCount - 1; i >= 0; --i)
            {
                nodeStack.push({ level: currentLevel + 1, node: nextNode.children[i] });
            }
        }
    }
}