import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent.js';

import PsyanimBehaviorTree from './PsyanimBehaviorTree.js';

export default class PsyanimBehaviorTreeAgent extends PsyanimComponent {

    tree;

    constructor(entity) {

        super(entity);

        this.tree = null;
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    afterCreate() {

        super.afterCreate();

        if (!this.tree)
        {
            this._tree = new PsyanimBehaviorTree();
        }
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
    }
}