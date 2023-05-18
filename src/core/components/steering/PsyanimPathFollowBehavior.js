import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimConstants from '../../PsyanimConstants';

export default class PsyanimPathFollowBehavior extends PsyanimComponent {

    vehicle = null;

    seekBehavior = null;

    p1 = new Phaser.Math.Vector2(0, 0);
    p2 = new Phaser.Math.Vector2(400, 300);

    radius = 30;

    predictionTime = 25;
    targetOffset = 50;

    constructor(entity) {

        super(entity);

        this._seekTarget = entity.scene.addEntity(this.entity.name + 'SeekTarget', 0, 0, {
            isEmpty: true,
        }, {
            collisionFilter: PsyanimConstants.DEFAULT_VISUAL_ONLY_COLLISION_FILTER
        });

        this.computeSeekTargetLocation();
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

    getSteering() {

        this.computeSeekTargetLocation();

        return this.seekBehavior.getSteering(this._seekTarget);
    }
}