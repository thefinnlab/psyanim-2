import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimVehicle from './PsyanimVehicle';

import PsyanimPathRenderer from '../rendering/PsyanimPathRenderer';

export default class PsyanimPathFollow extends PsyanimComponent {

    p1 = new Phaser.Math.Vector2(0, 0);
    p2 = new Phaser.Math.Vector2(400, 300);

    radius = 30;

    predictionTime = 25;
    targetOffset = 50;

    constructor(entity) {

        super(entity);

        this.vehicle = this.entity.getComponent(PsyanimVehicle);

        if (!this.vehicle)
        {
            this.vehicle = this.entity.addComponent(PsyanimVehicle);
        }

        this.pathRenderer = this.entity.getComponent(PsyanimPathRenderer);

        if (!this.pathRenderer)
        {
            this.pathRenderer = this.entity.addComponent(PsyanimPathRenderer);
        }

        this.pathRenderer.setRadius(this.radius);

        this._seekTarget = entity.scene.addEntity(this.entity.name + 'SeekTarget', 0, 0, {
            isEmpty: true,
        });

        this.vehicle.target = this._seekTarget;
        this.vehicle.setState(PsyanimVehicle.STATE.SEEK);

        this.computeSeekTargetLocation();
    }

    onEnable() {
        this.pathRenderer.enabled = true;
    }

    onDisable() {
        this.pathRenderer.enabled = false;
    }

    computeSeekTargetLocation() {

        // compute future position
        let predictedPosition = new Phaser.Math.Vector2(this.entity.getVelocity());
        predictedPosition.setLength(this.predictionTime);
        predictedPosition.add(this.entity.position);

        // TODO: allow reversal w/ a flag
        let start = this.p1.clone();
        let end = this.p2.clone();

        // 'a' is our predicted position relative to the line start
        let a = predictedPosition.clone();
        a.subtract(start);

        // 'b' will be our future position projected onto our current path segment
        let b = end.clone();
        b.subtract(start);
        b.normalize();

        b.setLength(a.dot(b));
        
        // 'c' is an offset amount for the target, along the direction of our path segment
        let c = b.clone().setLength(this.targetOffset);

        let target = start.clone();
        target.add(b);
        target.add(c);

        // get distance from target position to predicted position
        let predictedOffset = predictedPosition.clone();
        predictedOffset.subtract(target);

        let predictedOffsetDistance = predictedOffset.length();

        if (predictedOffsetDistance > this.radius)
        {
            this._seekTarget.x = target.x;
            this._seekTarget.y = target.y;
        }
    }

    reverseDirection() {

        let start = this.p2;
        let end = this.p1;

        this.p1 = start;
        this.p2 = end;
    }

    update(t, dt) {

        super.update(t, dt);

        // update path renderer
        this.pathRenderer.p1 = this.p1;
        this.pathRenderer.p2 = this.p2;
        this.pathRenderer.setRadius(this.radius);

        this.computeSeekTargetLocation();
    }
}