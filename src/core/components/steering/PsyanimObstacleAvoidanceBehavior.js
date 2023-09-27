import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';
import PsyanimConstants from '../../PsyanimConstants';

export default class PsyanimObstacleAvoidanceBehavior extends PsyanimComponent {

    multiRaySensor;

    seekBehavior;

    avoidDistance;

    constructor(entity) {

        super(entity);

        this.avoidDistance = 25;

        this._seekTarget = this.scene.addEntity('_' + this.entity.name + '_seekTarget', 0, 0, 
        {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            color: 0xff0000, radius: 4
        });

        this._keys = {
            SPACE: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        };
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

                let entityAngle = this._convertEntityAngleToVectorAngleD(this.entity.angle);

                let collisionNormal = new Phaser.Math.Vector2(collision.normal.x, collision.normal.y);
                let targetOffset = collisionNormal.clone();

                // note we have to reverse the 'y' b.c. we use the vector 'angle' below
                collisionNormal.y *= -1;

                let collisionNormalAngle = collisionNormal.angle() * (180.0 / Math.PI);

                let deltaDegrees = (entityAngle - collisionNormalAngle);

                this._angles = {
                    entityAngle: entityAngle,
                    collisionNormal: collisionNormal,
                    collisionNormalAngle: collisionNormalAngle,
                    deltaDegrees: deltaDegrees
                };

                if (Math.abs(deltaDegrees) < 180.0)
                {
                    if (Math.abs(deltaDegrees) < 1e-3 || deltaDegrees > 0.0)
                    {
                        targetOffset.rotate(-Math.PI / 2);
                    }
                    else
                    {
                        targetOffset.rotate(Math.PI / 2);
                    }    
                }
                else // abs(deltaDegrees) > 180.0
                {
                    if (deltaDegrees > 0.0)
                    {
                        targetOffset.rotate(-Math.PI / 2);
                    }
                    else
                    {
                        targetOffset.rotate(Math.PI / 2);
                    }
                }

                targetOffset.setLength(this.avoidDistance);

                this._seekTarget.position = targetPosition
                    .add(targetOffset);

                return this.seekBehavior.getSteering(this._seekTarget);
            }
        }

        return Phaser.Math.Vector2.ZERO.clone();
    }

    _convertEntityAngleToVectorAngleD(entityAngleDegrees) {

        let newAngle = entityAngleDegrees;

        if (entityAngleDegrees < 0)
        {
            newAngle *= -1;
        }
        else
        {
            newAngle = 360 - newAngle;
        }

        return newAngle;
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.SPACE))
        {
            console.log(this._angles);
        }
    }
}