import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent.js';

import { PsyanimDebug } from 'psyanim-utils';

import PsyanimAIController from './PsyanimAIController.js';

export default class PsyanimBehaviorTreeDebugger extends PsyanimComponent {

    behaviorTreeAgentNames;

    constructor(entity) {

        super(entity);

        this.behaviorTreeAgentNames = [];

        this._keys = {
            Q: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        };

        this._agentKeys = [];

        for (let i = 1; i < 11; ++i)
        {
            this._agentKeys.push(i.toString());
        }

        this.scene.input.keyboard.on('keydown', this._handleKeyDownEvent.bind(this));
    }

    _handleKeyDownEvent(e) {

        if (e.key === 'q')
        {
            this.scene.resume();
        }

        for (let i = 0; i < this._aiControllers.length; ++i)
        {
            let agent = this._aiControllers[i];

            if (e.key === this._agentKeys[i])
            {
                this.scene.pause();

                console.clear();

                console.log('********************************');
                console.log('Agent name:', agent.entity.name);
                console.log('********************************');
                console.log('\n');

                agent.tree.printTree();
            }
        }
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    afterCreate() {

        super.afterCreate();

        if (this.behaviorTreeAgentNames.length > 10)
        {
            PsyanimDebug.error("PsyanimBehaviorTreeDebugger does not support more than 1 tree!");l
        }

        this._aiControllers = [];

        this.behaviorTreeAgentNames.forEach(agentName => {

            let entity = this.entity.scene.getEntityByName(agentName);
            let controller = entity.getComponent(PsyanimAIController);

            this._aiControllers.push(controller);
        });
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