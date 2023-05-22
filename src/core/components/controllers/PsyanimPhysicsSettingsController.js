import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimPhysicsSettingsController extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this._keys = {
            T: this.entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T)
        };
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.T)) {

            if (this.entity.scene.matter.world.engine.timing.timeScale < 1)
            {
                this.entity.scene.matter.world.engine.timing.timeScale = 1.0;
            }
            else
            {
                this.entity.scene.matter.world.engine.timing.timeScale = 0.05;
            }
        }
    }
}