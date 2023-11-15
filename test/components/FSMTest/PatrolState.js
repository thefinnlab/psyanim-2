import { PsyanimDebug } from "psyanim-utils";

import PsyanimFSMState from "../../../src/core/components/ai/PsyanimFSMState.js";

import IdleState from "./IdleState.js";

export default class PatrolState extends PsyanimFSMState {

    constructor(fsm) {

        super(fsm);

        this.addTransition(IdleState, 'patrol', (value) => value === 0);

        this._keys = {
            ONE: this.entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
        };
    }

    enter() {

        super.enter();
    }

    exit() {

        super.exit();
    }

    run() {

        if (Phaser.Input.Keyboard.JustDown(this._keys.ONE))
        {
            this.fsm.setStateVariable('patrol', 0);
        }

        super.run();
    }
}