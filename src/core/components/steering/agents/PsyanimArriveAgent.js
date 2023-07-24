import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimArriveAgent extends PsyanimComponent {

    target = null;
    arriveBehavior = null;
    vehicle = null;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        if (this.target)
        {
            this.vehicle.maxSpeed = this.arriveBehavior.maxSpeed;

            let steering = this.arriveBehavior.getSteering(this.target);
    
            this.vehicle.steer(steering);    
        }
    }
}