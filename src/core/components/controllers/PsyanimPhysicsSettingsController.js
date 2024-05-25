import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent.js';

/**
 *  This controller allows the user to slow down the rate at which simulation time passes by pressing the 't' key. Mostly for debugging.
 * 
 *  Pressing 't' toggles the rate of time passage between the `slowTimeScale` and normal time (1.0).
 */
export default class PsyanimPhysicsSettingsController extends PsyanimComponent {

    /**
     *  Fraction of normal time that this controller will slow the rate of simulation time passage to.
     * 
     *  @type {Number}
     */
    slowTimeScale;

    /**
     * 
     * @param {PsyanimEntity} entity 
     */
    constructor(entity) {

        super(entity);

        this.slowTimeScale = 0.05;

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
                this.entity.scene.matter.world.engine.timing.timeScale = this.slowTimeScale;
            }
        }
    }
}