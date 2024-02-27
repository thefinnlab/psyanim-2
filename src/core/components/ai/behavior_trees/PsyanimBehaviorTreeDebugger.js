import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent.js';

import { PsyanimDebug } from 'psyanim-utils';

import PsyanimBehaviorTreeAgent from './PsyanimBehaviorTreeAgent.js';

export default class PsyanimBehaviorTreeDebugger extends PsyanimComponent {

    behaviorTreeAgentNames;

    constructor(entity) {

        super(entity);

        this.behaviorTreeAgentNames = [];

        this._keys = {
            Q: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        };

        this._agentKeys = [
            entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
            entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
            entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
            entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
            entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
            entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX),
            entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN),
            entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT),
            entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE),
            entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TEN),
        ];
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

        this._behaviorTreeAgents = [];

        this.behaviorTreeAgentNames.forEach(agentName => {

            let entity = this.entity.scene.getEntityByName(agentName);
            let agent = entity.getComponent(PsyanimBehaviorTreeAgent);

            this._behaviorTreeAgents.push(agent);
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

        if (Phaser.Input.Keyboard.JustDown(this._keys.Q))
        {
            // TODO: restore physics timescale
        }

        for (let i = 0; i < this._behaviorTreeAgents.length; ++i)
        {
            // TODO: print out tree with color-coded paths, 
            // depending on which agent was selected
        }
    }
}