import Phaser from 'phaser';

import PsyanimComponent from "../../PsyanimComponent";

export default class PsyanimBasicPredatorBehavior extends PsyanimComponent {

    /**
     *  Basic algorithm is to wander until a target is in sight, and then pursue that target, but
     *  more subtly by varying the pursuit angle a tad bit off from the normal direction an 
     *  'arrive' behavior would approach at.
     */

    static STATE = {
        WANDERING: 0x0001,
        PURSUING: 0x0002,
    };

    subtlety = 30; // 'degrees'
    subtletyLag = 500; // 'ms'

    fovSensor = null;

    arriveBehavior = null;
    wanderBehavior = null;
    
    constructor(entity) {

        super(entity);

        this._state = PsyanimBasicPredatorBehavior.STATE.WANDERING;

        this._arriveTarget = this.scene.addEntity(this.name + '_arriveTarget');

        this._subtletyAngle = 0;
        this._subtletyUpdateTimer = 0;
    }

    get maxSpeed() {

        switch(this._state) {

            case PsyanimBasicPredatorBehavior.STATE.WANDERING:

                return this.wanderBehavior.seekBehavior.maxSpeed;

            case PsyanimBasicPredatorBehavior.STATE.PURSUING:

                return this.arriveBehavior.maxSpeed;

            default:

                console.error("ERROR: invalid state: " + this._state);
                return 0;
        }
    }

    getSteering(target) {

        // determine if target is in sight
        let targetInSight = false;

        let entitiesInSight = this.fovSensor.getEntitiesInSight([target]);

        if (entitiesInSight.length != 0)
        {
            if (entitiesInSight.includes(target))
            {
                targetInSight = true;
            }
        }

        // update state
        if (targetInSight)
        {
            this._state = PsyanimBasicPredatorBehavior.STATE.PURSUING;
        }
        else
        {
            this._state = PsyanimBasicPredatorBehavior.STATE.WANDERING;
        }

        // compute steering
        if (this._state == PsyanimBasicPredatorBehavior.STATE.PURSUING)
        {
            let targetRelativePosition = target.position
                .subtract(this.entity.position);

            targetRelativePosition.rotate(this._subtletyAngle * Math.PI / 180.0);

            let newTargetPosition = this.entity.position
                .add(targetRelativePosition);

            this._arriveTarget.position = newTargetPosition;

            return this.arriveBehavior.getSteering(this._arriveTarget);
        }
        else if (this._state == PsyanimBasicPredatorBehavior.STATE.WANDERING)
        {
            return this.wanderBehavior.getSteering();
        }
    }

    update(t, dt) {
     
        super.update(t, dt);

        this._subtletyUpdateTimer += dt;

        if (this._subtletyUpdateTimer > this.subtletyLag)
        {
            this._subtletyUpdateTimer = 0;

            if (this._state == PsyanimBasicPredatorBehavior.STATE.PURSUING)
            {
                // recompute subtlety angle
                this._subtletyAngle = this.subtlety * (2 * Math.random() - 1);
            }
        }
    }
}