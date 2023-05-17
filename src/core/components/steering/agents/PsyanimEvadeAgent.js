import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimEvadeAgent extends PsyanimComponent {

    target = null;
    evadeBehavior = null;
    vehicle = null;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        let steering = this.evadeBehavior.getSteering(this.target);

        this.vehicle.steer(steering);
    }
}