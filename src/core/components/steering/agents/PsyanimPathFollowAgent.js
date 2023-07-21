import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimPathFollowAgent extends PsyanimComponent {

    vehicle = null;
    collisionAvoidanceBehavior = null;
    pathFollowBehavior = null;

    currentPath = null;

    predictionTime = 25;
    targetOffset = 50;

    patrol = false; // if patrolling, agent will reverse when it reaches end of path

    constructor(entity) {

        super(entity);
    }

    _getNextPathSegment() {

        if (this.currentPath && this.currentPath.length != 0)
        {
            if (this.currentPath.length == 1)
            {
                console.error("ERROR: current path only has 1 element - deleting path...");

                this.currentPath = null;

                return null;
            }
            else if (this.currentPath.length == 2)
            {
                // last segment - we're at the end of the path
                let p1 = this.currentPath.shift();
                let p2 = this.currentPath.shift();

                this.currentPath = null;

                return { p1: p1, p2: p2 };
            }

            return {
                p1: this.currentPath.shift(),
                p2: this.currentPath[0]
            };    
        }

        return null;
    }

    update(t, dt) {

        super.update(t, dt);

        // update steering params
        this.pathFollowBehavior.predictionTime = this.predictionTime;
        this.pathFollowBehavior.targetOffset = this.targetOffset;

        let stoppingRadius = this.predictionTime + this.targetOffset;

        // update path segment if appropriate
        let distanceToSegmentEnd = this.entity.position.subtract(this.pathFollowBehavior.p2).length();

        if (distanceToSegmentEnd < stoppingRadius)
        {
            

            // if (this.patrol)
            // {
            //     this.pathFollowBehavior.reverseDirection();
            // }
        }

        // compute steering
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