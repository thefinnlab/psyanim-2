import PsyanimFSMState from "../../../src/core/components/ai/PsyanimFSMState.js";

import PatrolState from "./PatrolState.js";

export default class IdleState extends PsyanimFSMState {

    constructor(fsm) {

        super(fsm);

        this.addTransition(PatrolState, 'patrol', (value) => value === 1);

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
            this.fsm.setStateVariable('patrol', 1);
        }

        super.run();
    }
}