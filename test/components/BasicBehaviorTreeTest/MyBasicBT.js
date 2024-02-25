import Phaser from 'phaser';

import PsyanimComponent from '../../../src/core/PsyanimComponent.js';

import PsyanimBehaviorTree from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTree.js';
import PsyanimBehaviorTreeNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeNode.js';

import PsyanimBehaviorTreeSequenceNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeSequenceNode.js';
import PsyanimBehaviorTreeSelectorNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeSelectorNode.js';
import PsyanimBehaviorTreeLeafNode from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeLeafNode.js';

export default class MyBasicBT extends PsyanimComponent {

    idleDuration;
    walkDuration;
    eatDuration;

    constructor(entity) {

        super(entity);

        /**
         *  Expect tree to look like:
         * 
         *  root
         *  --- mainSequence
         *  ------ reset
         *  ------ idle
         *  ------ mainSelector
         *  --------- eatLunchSelector
         *  ------------ eatCanFail
         *  ------------ walkCanFail
         *  --------- doWork
         *  ------------ idle
         *  ------------ walk
         *  ------------ eat
         *  ------------ idle
         * 
         *  Expect the following behavior:
         * 
         *      - mainSequence always starts with a 'reset' followed by an 'idle', followed by mainSelector
         *      - mainSelector Will try eatLunchSelector or doWork
         *      - eatLunchSelector can fail on either of it's leaf nodes
         *      - doWork will always succeed, with all leaf nodes returning success, in-order
         */

        this.idleDuration = 1000;
        this.walkDuration = 2000;
        this.eatDuration = 2000;

        this._state = MyBasicBT.STATE.INITIALIZED;

        this._idleTimer = 0;
        this._walkTimer = 0;
        this._eatTimer = 0;

        this._tree = new PsyanimBehaviorTree();

        let walkCanFailLeaf = new PsyanimBehaviorTreeLeafNode("walkCanFail", 
            this.walk.bind(this), { canFail: true });
            
        let eatCanFailLeaf = new PsyanimBehaviorTreeLeafNode("eatCanFail", 
            this.eat.bind(this), { canFail: true });

        let walkLeaf = new PsyanimBehaviorTreeLeafNode("walk", this.walk.bind(this));
        let eatLeaf = new PsyanimBehaviorTreeLeafNode("eat", this.eat.bind(this));
        let idleLeaf = new PsyanimBehaviorTreeLeafNode("idle", this.idle.bind(this));

        let resetLeaf = new PsyanimBehaviorTreeLeafNode("reset", this.resetBehaviorTree.bind(this));

        let eatLunchSelector = new PsyanimBehaviorTreeSelectorNode("eatLunchSelector");

        eatLunchSelector.addChild(eatCanFailLeaf);
        eatLunchSelector.addChild(walkCanFailLeaf);

        let doWorkSequence = new PsyanimBehaviorTreeSequenceNode("doWork");

        doWorkSequence.addChild(idleLeaf);
        doWorkSequence.addChild(walkLeaf);
        doWorkSequence.addChild(eatLeaf);
        doWorkSequence.addChild(idleLeaf);

        let mainSelector = new PsyanimBehaviorTreeSelectorNode("mainSelector");

        mainSelector.addChild(eatLunchSelector);
        mainSelector.addChild(doWorkSequence);

        let mainSequence = new PsyanimBehaviorTreeSequenceNode("mainSequence");

        mainSequence.addChild(resetLeaf);
        mainSequence.addChild(idleLeaf);
        mainSequence.addChild(mainSelector);

        this._tree.addChild(mainSequence);

        this._tree.printTree();
    }

    resetBehaviorTree(params) {

        console.log('resetting tree');

        this._tree.reset();

        this._state = MyBasicBT.STATE.INITIALIZED;

        return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
    }

    walk(params = { canFail: false }) {

        if (this._state != MyBasicBT.STATE.WALK)
        {
            this._state = MyBasicBT.STATE.WALK;
            this._walkTimer = 0;
        }

        if (this._walkTimer > this.walkDuration)
        {
            if (params.canFail && Math.random() > 0.5)
            {
                console.log('walking failed.');
                return PsyanimBehaviorTree.STATUS.FAILURE;
            }    

            console.log('walking succeeded!');
            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }

        if (params.canFail)
        {
            console.log('walking, can fail');
        }
        else
        {
            console.log("walking");
        }

        return PsyanimBehaviorTreeNode.STATUS.RUNNING;
    }

    eat(params = { canFail: false }) {

        if (this._state != MyBasicBT.STATE.EAT)
        {
            this._state = MyBasicBT.STATE.EAT;
            this._eatTimer = 0;
        }

        if (this._eatTimer > this.eatDuration)
        {
            if (params.canFail && Math.random() > 0.5)
            {
                console.log('eating failed!');
                return PsyanimBehaviorTree.STATUS.FAILURE;
            }
    
            console.log('eating succeeded!');
            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }

        if (params.canFail)
        {
            console.log('eating, can fail');
        }
        else
        {
            console.log("eating");
        }

        return PsyanimBehaviorTreeNode.STATUS.RUNNING;
    }

    idle(params = { canFail: false }) {

        if (this._state != MyBasicBT.STATE.IDLE)
        {
            this._state = MyBasicBT.STATE.IDLE;
            this._idleTimer = 0;
        }

        if (this._idleTimer > this.idleDuration)
        {
            if (params.canFail && Math.random() > 0.5)
            {
                return PsyanimBehaviorTree.STATUS.FAILURE;
            }
    
            return PsyanimBehaviorTreeNode.STATUS.SUCCESS;
        }

        if (params.canFail)
        {
            console.log('idling, can fail');
        }
        else
        {
            console.log("idling");
        }

        return PsyanimBehaviorTreeNode.STATUS.RUNNING;
    }

    _testPrintTree() {

        let node1 = new PsyanimBehaviorTreeNode("node1");
        let node2 = new PsyanimBehaviorTreeNode("node2");
        let node3 = new PsyanimBehaviorTreeNode("node3");

        this._tree.addChild(node1);
        this._tree.addChild(node2);
        this._tree.addChild(node3);

        let node4 = new PsyanimBehaviorTreeNode("node4");
        let node5 = new PsyanimBehaviorTreeNode("node5");
        let node6 = new PsyanimBehaviorTreeNode("node6");

        node1.addChild(node4);
        node1.addChild(node5);
        node3.addChild(node6);

        let node7 = new PsyanimBehaviorTreeNode("node7");
        let node8 = new PsyanimBehaviorTreeNode("node8");
        let node9 = new PsyanimBehaviorTreeNode("node9");

        node2.addChild(node7);
        node7.addChild(node8);
        node8.addChild(node9);

        this._tree.printTree();
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    afterCreate() {

        super.afterCreate();
    }

    beforeShutdown() {

        super.beforeShutdown();
    }

    onSensorEnter(entity) {

        super.onSensorEnter(entity);
    }

    onSensorExit(entity) {

        super.onSensorExit(entity);
    }

    update(t, dt) {
        
        super.update(t, dt);

        this._tree.tick();

        if (this._state === MyBasicBT.STATE.WALK)
        {
            this._walkTimer += dt;
        }
        else if (this._state === MyBasicBT.STATE.EAT)
        {
            this._eatTimer += dt;
        }
        else if (this._state === MyBasicBT.STATE.IDLE)
        {
            this._idleTimer += dt;
        }
    }
}

const MY_BASIC_BT_STATE = {
    INITIALIZED: 0,
    IDLE: 1,
    WALK: 2,
    EAT: 3
};

MyBasicBT.STATE = MY_BASIC_BT_STATE;