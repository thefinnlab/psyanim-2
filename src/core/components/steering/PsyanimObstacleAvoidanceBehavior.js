import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimObstacleAvoidanceBehavior extends PsyanimComponent {

    multiRaySensor;

    seekBehavior;

    avoidDistance;

    constructor(entity) {

        super(entity);

        this.avoidDistance = 25;

        this._seekTarget = this.scene.addEntity('_' + this.entity.name + '_seekTarget');
    }

    afterCreate() {

        super.afterCreate();
    }

    getSteering() {

        for (let ray of this.multiRaySensor.rayMap.values())
        {
            if (ray.collisions.length > 0)
            {
                let collision = ray.collisions[0];

                let targetPosition = new Phaser.Math.Vector2(
                    collision.point.x, collision.point.y)
                    .add(new Phaser.Math.Vector2(
                        collision.normal.x, collision.normal.y
                    ).scale(this.avoidDistance));

                // let entityAngle = this.entity.rotation;
                // let collisionNormalAngle = collision.normal.angle();

                // let deltaDegrees = (entityAngle - collisionNormalAngle) * 180 / Math.PI;

                this._seekTarget.position = targetPosition;

                return this.seekBehavior.getSteering(this._seekTarget);
            }
        }

        return Phaser.Math.Vector2.ZERO.clone();
    }
}