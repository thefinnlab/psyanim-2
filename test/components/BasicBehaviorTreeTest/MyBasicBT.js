import Phaser from 'phaser';

import PsyanimComponent from '../../../src/core/PsyanimComponent.js';

import PsyanimBehaviorTree from '../../../src/core/components/ai/behavior_trees/PsyanimBehaviorTree.js';

export default class MyBasicBT extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        console.warn("TODO: implement PsyanimBehaviorTree::printTree() first as a sanity test, using iterative traversal method!");
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
    }
}