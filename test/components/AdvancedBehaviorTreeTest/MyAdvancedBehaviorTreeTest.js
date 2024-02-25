import Phaser from 'phaser';

import PsyanimComponent from '../../../src/core/PsyanimComponent.js';

import PsyanimBehaviorTree from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTree.js';

import PsyanimBehaviorTreeSequenceNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeSequenceNode.js';
import PsyanimBehaviorTreeSelectorNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeSelectorNode.js';
import PsyanimBehaviorTreeLeafNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeLeafNode.js';
import PsyanimBehaviorTreeNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeNode.js';

export default class MyAdvancedBehaviorTreeTest extends PsyanimComponent {

    target1;
    target2;
    target3;

    arriveAgent;

    stoppingDistance;

    constructor(entity) {

        super(entity);

        this.stoppingDistance = 30;
    }

    afterCreate() {

        super.afterCreate();

        this._tree = new PsyanimBehaviorTree();

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

        // setup item collection task
        let checkForItemInSceneLeaf = new PsyanimBehaviorTreeLeafNode("checkForItemInScene",
            this._checkForItemInScene.bind(this));

        let itemCollectionSequence = new PsyanimBehaviorTreeSequenceNode("itemCollectionSequence");

        itemCollectionSequence.addChild(checkForItemInSceneLeaf);
        itemCollectionSequence.addChild(moveToTargetLeaf);

        // add to tree
        let mainSelector = new PsyanimBehaviorTreeSelectorNode("mainSequence");

        mainSelector.addChild(itemCollectionSequence);
        mainSelector.addChild(patrolSequence);

        this._tree.addChild(mainSelector);

        this._tree.tick();
    }

    _hasReachedTarget(target) {

        let distanceToTarget = this.entity.position
            .subtract(target.position)
            .length();

        return distanceToTarget < this.stoppingDistance;
    }

    _selectTarget(params) {

        this.arriveAgent.target = params.target;

        return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
    }

    _checkForItemInScene() {

        let item = this.entity.scene.getEntityByName('item');

        if (item)
        {
            this.arriveAgent.target = item;

            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }

        return PsyanimBehaviorTreeNode.STATUS.FAILURE;
    }

    _moveToTarget() {

        if (!this.arriveAgent.target)
        {
            return PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }

        if (this._hasReachedTarget(this.arriveAgent.target))
        {
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

    onSensorEnter(entity) {

        super.onSensorEnter(entity);
    
        console.log('sensor detected entity: ', entity.name);

        if (entity.name === 'item')
        {
            this.arriveAgent.target = null;

            this.entity.scene.destroyEntityByName(entity.name);

            console.log('collected item!');
        }
    }

    onSensorExit(entity) {

        super.onSensorExit(entity);
    }

    update(t, dt) {
        
        super.update(t, dt);

        this._tree.tick();
    }
}