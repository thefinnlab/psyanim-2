import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent.js';

import PsyanimBehaviorTree from './PsyanimBehaviorTree.js';
import PsyanimBehaviorTreeNode from './PsyanimBehaviorTreeNode.js';

export default class PsyanimBehaviorTreeAgent extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this._tree = null;
    }

    get tree() {

        return this._tree;
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    afterCreate() {

        super.afterCreate();

        this._tree = new PsyanimBehaviorTree();
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

        let status = this._tree.tick();

        if (status === PsyanimBehaviorTreeNode.STATUS.FAILURE)
        {
            this._tree.reset();
        }
    }
}