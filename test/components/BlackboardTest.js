import PsyanimComponent from "../../src/core/PsyanimComponent.js";

import PsyanimBehaviorTreeBlackboard from "../../src/core/components/ai/bt/PsyanimBehaviorTreeBlackboard.js";

export default class BlackboardTest extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this._keys = {
            ONE: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        }
    }

    afterCreate() {

        super.afterCreate();

        this._blackboard = this.entity.getComponent(PsyanimBehaviorTreeBlackboard);
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.ONE))
        {
            console.log('blackboard:', JSON.parse(this._blackboard.toJson()).data);
        }
    }
}