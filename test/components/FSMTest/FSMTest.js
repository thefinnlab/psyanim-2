import Phaser from 'phaser';

import PsyanimComponent from '../../../src/core/PsyanimComponent.js';

import PsyanimFSM from '../../../src/core/components/ai/PsyanimFSM.js';

import IdleState from './IdleState.js';
import PatrolState from './PatrolState.js';

export default class FSMTest extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        console.warn('TODO: update PsyanimDebug.log() to accept variable number of arguments like console.log()!');

        // setup fsm and add states
        this._fsm = this.entity.addComponent(PsyanimFSM);

        this._fsm.debug = true;

        let idleState = this._fsm.addState(IdleState);
        let patrolState = this._fsm.addState(PatrolState);

        this._fsm.initialState = idleState;

        // setup debug controls
        this._keys = {
            ONE: this.entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
            TWO: this.entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
        };
    }

    update(t, dt) {

        super.update(t, dt);

        // print debug info on keypress
        if (Phaser.Input.Keyboard.JustDown(this._keys.TWO))
        {
            console.log(this._fsm.stringifyStateVariables());
        }
    }
}