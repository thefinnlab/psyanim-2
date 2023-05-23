import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimExperimentTimer extends PsyanimComponent {

    constructor(entity) {

        super(entity);

    }

    setOnTimerElapsed(duration, callback, args = [], callbackScope = null) {

        this.entity.scene.time.delayedCall(
            duration, callback, args, callbackScope
        );
    }

    update(t, dt) {

    }
}