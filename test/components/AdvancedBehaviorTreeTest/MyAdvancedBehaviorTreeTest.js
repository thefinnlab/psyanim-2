import Phaser from 'phaser';

import PsyanimComponent from '../../../src/core/PsyanimComponent.js';

import PsyanimBehaviorTree from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTree.js';

import PsyanimBehaviorTreeSequenceNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeSequenceNode.js';
import PsyanimBehaviorTreeSelectorNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeSelectorNode.js';
import PsyanimBehaviorTreeDecoratorNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeDecoratorNode.js';
import PsyanimBehaviorTreeInverterNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeInverterNode.js';
import PsyanimBehaviorTreeLeafNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeLeafNode.js';
import PsyanimBehaviorTreeNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeNode.js';

export default class MyAdvancedBehaviorTreeTest extends PsyanimComponent {

    player;

    target1;
    target2;
    target3;

    arriveAgent;
    fleeAgent;

    fleePanicDistance;
    fleeSafetyDistance;

    stoppingDistance;

    constructor(entity) {

        super(entity);

        this.player = null;

        this.stoppingDistance = 30;

        this.fleePanicDistance = 150;
        this.fleeSafetyDistance = 200;
    }

    afterCreate() {

        super.afterCreate();

        this._tree = new PsyanimBehaviorTree();

        console.warn("TODO: tree node rules need to be enforced for each type!");
        console.warn("TODO: need to get the flee working using decorator nodes...");

        // setup patrol task
        let selectTarget1Leaf = new PsyanimBehaviorTreeLeafNode("selectTarget1", 
            this._selectTarget.bind(this), { target: this.target1 });

        let selectTarget2Leaf = new PsyanimBehaviorTreeLeafNode("selectTarget2", 
            this._selectTarget.bind(this), { target: this.target2 });

        let selectTarget3Leaf = new PsyanimBehaviorTreeLeafNode("selectTarget3", 
            this._selectTarget.bind(this), { target: this.target3 });

        let moveToTargetLeaf = new PsyanimBehaviorTreeLeafNode("moveToTarget", this._moveToTarget.bind(this));

        let patrolSequence = new PsyanimBehaviorTreeSequenceNode("patrolSequence");

        patrolSequence.addChild(selectTarget2Leaf);
        patrolSequence.addChild(moveToTargetLeaf);

        patrolSequence.addChild(selectTarget3Leaf);
        patrolSequence.addChild(moveToTargetLeaf);

        patrolSequence.addChild(selectTarget2Leaf);
        patrolSequence.addChild(moveToTargetLeaf);

        patrolSequence.addChild(selectTarget1Leaf);
        patrolSequence.addChild(moveToTargetLeaf);

        let patrolSequenceDecorator = new PsyanimBehaviorTreeDecoratorNode("patrolSequenceDecorator",
            this._checkForItemNotInScene.bind(this));

        patrolSequenceDecorator.addChild(patrolSequence);

        // setup item collection task
        let itemCollectionDecorator = new PsyanimBehaviorTreeDecoratorNode("itemCollectionDecorator",
            this._checkForItemInScene.bind(this));

        itemCollectionDecorator.addChild(moveToTargetLeaf);

        // setup flee task
        let checkIfTargetInPanicRadiusLeaf = new PsyanimBehaviorTreeLeafNode("checkIfTargetInPanicRadius",
            this._checkIfPlayerInPanicRadius.bind(this));

        let fleeFromTargetLeaf = new PsyanimBehaviorTreeLeafNode("fleeFromTarget",
            this._fleeFromTarget.bind(this));

        let fleeFromPlayerSequence = new PsyanimBehaviorTreeSequenceNode("fleeFromPlayerSequence");

        fleeFromPlayerSequence.addChild(checkIfTargetInPanicRadiusLeaf);
        fleeFromPlayerSequence.addChild(fleeFromTargetLeaf);

        // add to tree
        let mainSelector = new PsyanimBehaviorTreeSelectorNode("mainSelector");

        // TODO: need to make this work still!
        // mainSelector.addChild(fleeFromPlayerSequence);
        mainSelector.addChild(itemCollectionDecorator);
        mainSelector.addChild(patrolSequenceDecorator);

        this._tree.addChild(mainSelector);

        this._tree.printTree();
    }

    _hasReachedTarget() {

        let distanceToTarget = this.entity.position
            .subtract(this._target.position)
            .length();

        return distanceToTarget < this.stoppingDistance;
    }

    _selectTarget(params) {

        this._target = params.target;

        if (this._target)
        {
            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }

        return PsyanimBehaviorTreeNode.STATUS.FAILURE;
    }

    /**
     *  TODO: don't do this - make this work with an inverter node!
     */
    _checkForItemNotInScene() {

        let status = this._checkForItemInScene();

        if (status === PsyanimBehaviorTreeLeafNode.STATUS.SUCCESS)
        {
            return PsyanimBehaviorTreeLeafNode.STATUS.FAILURE;
        }
        else if (status === PsyanimBehaviorTreeLeafNode.STATUS.FAILURE)
        {
            return PsyanimBehaviorTreeLeafNode.STATUS.SUCCESS;
        }
    }

    _checkForItemInScene() {

        let item = this.entity.scene.getEntityByName('item');

        if (item)
        {
            this._target = item;

            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }

        return PsyanimBehaviorTreeNode.STATUS.FAILURE;
    }

    _isTargetInSafetyRadius() {

        let distanceToPlayer = this.entity.position
            .subtract(this.player)
            .length();

        return distanceToPlayer < this.fleeSafetyDistance;
    }

    /**
     *  TODO: don't do this - make this work with an inverter node!
     */
    _checkIfPlayerNotInPanicRadius() {

        let status = this._checkIfPlayerInPanicRadius();

        if (status === PsyanimBehaviorTreeLeafNode.STATUS.SUCCESS)
        {
            return PsyanimBehaviorTreeLeafNode.STATUS.FAILURE;
        }
        else if (status === PsyanimBehaviorTreeLeafNode.STATUS.FAILURE)
        {
            return PsyanimBehaviorTreeLeafNode.STATUS.SUCCESS;
        }
    }

    _checkIfPlayerInPanicRadius() {

        let distanceToPlayer = this.entity.position
            .subtract(this.player)
            .length();

        if (distanceToPlayer < this.fleePanicDistance)
        {
            this._target = this.player;

            return PsyanimBehaviorTree.STATUS.SUCCESS;
        }

        return PsyanimBehaviorTree.STATUS.FAILURE;
    }

    _fleeFromTarget() {

        console.log('fleeing!');

        if (!this._target)
        {
            this.fleeAgent.enabled = false;

            return PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }

        this.fleeAgent.enabled = true;
        this.fleeAgent.target = this._target;

        if (!this._isTargetInSafetyRadius())
        {
            this.fleeAgent.enabled = false;

            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }

        return PsyanimBehaviorTreeNode.STATUS.RUNNING;
    }

    _moveToTarget() {

        if (!this._target)
        {
            this.arriveAgent.enabled = false;

            return PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }

        this.arriveAgent.target = this._target;
        this.arriveAgent.enabled = true;

        if (this._hasReachedTarget())
        {
            this.arriveAgent.enabled = false;

            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }

        return PsyanimBehaviorTreeNode.STATUS.RUNNING;
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    beforeShutdown() {

        super.beforeShutdown();
    }

    disableAllSteeringAgents() {

        this.arriveAgent.enabled = false;
        this.fleeAgent.enabled = false;
    }

    onSensorEnter(entity) {

        super.onSensorEnter(entity);
    
        if (entity.name === 'item')
        {
            this._target = null;
            this.disableAllSteeringAgents();

            this.entity.scene.destroyEntityByName(entity.name);

            console.log('collected item!');
        }
    }

    onSensorExit(entity) {

        super.onSensorExit(entity);
    }

    update(t, dt) {
        
        super.update(t, dt);

        let status = this._tree.tick();

        if (status === PsyanimBehaviorTreeNode.STATUS.FAILURE)
        {
            this._tree.reset();
        }
    }
}