import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimPathFollowAgent extends PsyanimComponent {

    vehicle = null;
    collisionAvoidanceBehavior = null;
    pathFollowBehavior = null;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        let steering = null;

        if (this.collisionAvoidanceBehavior != null)
        {
            steering = this.collisionAvoidanceBehavior.getSteering();

            if (steering.length() < 1e-3)
            {
                steering = this.pathFollowBehavior.getSteering();
            }
        }
        else
        {
            steering = this.pathFollowBehavior.getSteering();
        }

        this.vehicle.steer(steering);
    }
}