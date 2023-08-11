import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimAdvancedArriveAgent extends PsyanimComponent {

    target;
    advancedArriveBehavior;
    vehicle;

    constructor(entity) {
        
        super(entity);
    }

    // this component is enabled at the start of any charge
    onEnable() {

        // at the start of charge, disable friction and recompute max speed
        this.entity.body.friction = 0;
        this.entity.body.frictionAir = 0;
        this.entity.body.frictionStatic = 0;

        this.advancedArriveBehavior.computeMaxSpeed(this.target);
    }

    // this component is disabled at the end of any charge
    onDisable() {

        this.entity.body.friction = 0.1;
        this.entity.body.frictionAir = 0.01;
        this.entity.body.frictionStatic = 0.5;

        this.entity.setVelocity(0, 0);
    }

    update(t, dt) {

        super.update(t, dt);

        // sync params from behaviors
        this.vehicle.maxSpeed = this.advancedArriveBehavior.maxSpeed;

        let steering = this.advancedArriveBehavior.getSteering(this.target);

        this.vehicle.steer(steering);
    }
}