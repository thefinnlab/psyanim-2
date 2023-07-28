import PsyanimScene from "../../src/core/scene/PsyanimScene"

import PsyanimApp from "../../src/core/PsyanimApp";

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

export default class ShowHideCanvasTest extends PsyanimScene {

    constructor() {

        super('Show Hide Canvas Test');
    }

    create() {

        super.create();

        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneChangeController).entity
            .addComponent(PsyanimSceneTitle);

        this._keys = {
            I: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            U: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U)
        };
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.I))
        {
            PsyanimApp.Instance.setCanvasVisible(true);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.U))
        {
            PsyanimApp.Instance.setCanvasVisible(false);
        }
    }
}