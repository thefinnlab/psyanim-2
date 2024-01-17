import PsyanimComponent from "../../src/core/PsyanimComponent.js";

export default class FsmApiKeyboardControls extends PsyanimComponent {

    fsm;

    constructor(entity) {

        super(entity);

        this._keys = {
            I: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            O: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
            U: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U),
            P: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P),
        }
    }

    afterCreate() {

        super.afterCreate();
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.U))
        {
            this.fsm.restart();
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.I))
        {
            this.fsm.resume();
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.O))
        {
            this.fsm.stop();
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.P))
        {
            this.fsm.pause();
        }
    }
}