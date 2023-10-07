import Phaser from 'phaser';

import PsyanimComponent from "../../src/core/PsyanimComponent.js";

export default class AdvancedArriveTestManager extends PsyanimComponent {

    target;

    advancedArriveAgent;
    mouseFollowTarget;

    constructor(entity) {

        super(entity);

        this._timer = 0;

        this._keys = {
            C: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
        }
    }

    update(t, dt) {

        super.update(t, dt);

        this._timer += dt;

        if (Phaser.Input.Keyboard.JustDown(this._keys.C))
        {
            this.advancedArriveAgent.enabled = true;
            this.mouseFollowTarget.enabled = false;

            this._timer = 0;
        }

        if (this.advancedArriveAgent.enabled)
        {
            // check end condition
            let distanceToTarget = this.target.position
                .subtract(this.advancedArriveAgent.entity.position)
                .length();

            if (distanceToTarget < 20)
            {
                console.log("reached target in " + (this._timer / 1000) + " seconds!");

                this.advancedArriveAgent.enabled = false;
                this.mouseFollowTarget.enabled = true;
            }
        }
    }
}