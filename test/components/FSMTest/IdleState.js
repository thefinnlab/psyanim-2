import PsyanimFSMState from "../../../src/core/components/ai/PsyanimFSMState.js";

import PatrolState from "./PatrolState.js";

import PsyanimArriveAgent from "../../../src/core/components/steering/agents/PsyanimArriveAgent.js";

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

        this._arriveAgent = this.entity.getComponent(PsyanimArriveAgent);

        this._arriveAgent.enabled = false;
        this.entity.setVelocity(0, 0);
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        if (Phaser.Input.Keyboard.JustDown(this._keys.ONE))
        {
            this.fsm.setStateVariable('patrol', 1);
        }

        super.run();
    }
}