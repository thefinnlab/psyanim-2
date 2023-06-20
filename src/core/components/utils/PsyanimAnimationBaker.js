import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimAnimationClip from '../../../utils/PsyanimAnimationClip.mjs';

export default class PsyanimAnimationBaker extends PsyanimComponent {

    static STATE = {

        IDLE: 0x0001,
        BAKING: 0x0002,
    };

    constructor(entity) {

        super(entity);

        this._clip = new PsyanimAnimationClip();
        this._state = PsyanimAnimationBaker.STATE.IDLE;
    }

    get isRunning() {

        return this._state == PsyanimAnimationBaker.STATE.BAKING;
    }

    start() {

        this._state = PsyanimAnimationBaker.STATE.BAKING;
    }

    stop() {

        this._state = PsyanimAnimationBaker.STATE.IDLE;
    }

    clear() {

        this._clip.clear();
    }

    update(t, dt) {

        super.update(t, dt);

        switch (this._state)
        {
            case PsyanimAnimationBaker.STATE.IDLE:

                break;

            case PsyanimAnimationBaker.STATE.BAKING:

                this._clip.addSample(t, this.entity.position, this.entity.rotation);

                break;
        }
    }

    get clip() {

        return this._clip;
    }
}