import PsyanimApp from "../../PsyanimApp.js";

import PsyanimComponent from "../../PsyanimComponent.js";

import {
    PsyanimDebug
} from 'psyanim-utils';

export default class PsyanimBasicPreyBehavior extends PsyanimComponent {

    subtlety; // 'degrees'
    subtletlyLag; // ms

    /**
     *  Delay time, in ms, before agent will begin moving initially.
     *  @type {Number}
     */
    movementLag;

    /**
     *  If user provides this, agent will not move initially until the target first moves.
     *  @type {PsyanimEntity}
     */
    movementLagDetectionTarget;

    /**
     *  NOTE: this optional parameter is specific to integration with jsPsych!
     * 
     *  Time duration, in ms, that this behavior will execute, once moving, before throwing an 
     *  event to tell jsPsych to end the current trial.
     *  @type {Number}
     */
    fixedDuration;

    safetyDistance; // min. distance in 'px' to target which this predator will flee to maintain

    fovSensor;

    fleeBehavior;
    wanderBehavior;

    debug;

    constructor(entity) {

        super(entity);

        this.subtletly = 30; // 'degrees'
        this.subtletlyLag = 500; // ms    

        this.safetyDistance = 100;

        this.movementLag = 0;

        this.fixedDuration = -1;

        this.movementLagDetectionTarget = null;

        this._state = PsyanimBasicPreyBehavior.STATE.MOVEMENT_LAG;

        this._fleeTarget = this.scene.addEntity(this.entity.name + '_fleeTarget');

        this._subtletyAngle = 0;
        this._subtletyUpdateTimer = 0;

        this._behaviorExecutionTimer = 0;

        this._movementLagTimer = 0;
        this._movementLagTargetInitialPosition = null;

        this.debug = false;
    }

    afterCreate() {

        super.afterCreate();

        // use an initial angle and subtlety that's randomized
        this.entity.setAngle(360 * (2 * Math.random() - 1));
        this._recomputeSubtletyAngle();

        if (this.movementLagDetectionTarget)
        {
            this._movementLagTargetInitialPosition = this.movementLagDetectionTarget.position;
        }

        if (this.movementLag === 0)
        {
            this._state = PsyanimBasicPreyBehavior.STATE.WANDERING;
        }
    }

    get maxSpeed() {

        switch(this._state) {

            case PsyanimBasicPreyBehavior.STATE.MOVEMENT_LAG:

                return 0;

            case PsyanimBasicPreyBehavior.STATE.WANDERING:

                return this.wanderBehavior.seekBehavior.maxSpeed;

            case PsyanimBasicPreyBehavior.STATE.FLEEING:

                return this.fleeBehavior.maxSpeed;

            default:

            console.error("ERROR: invalid state: " + this._state);
            return 0;
        }
    }

    getSteering(target) {

        // determine if target is in sight
        let targetInSight = false;

        if (this.fovSensor)
        {
            let entitiesInSight = this.fovSensor.getEntitiesInSight([target]);

            if (entitiesInSight.length != 0)
            {
                if (entitiesInSight.includes(target))
                {
                    targetInSight = true;
                }
            }    
        }
        else // treat it as 360 degree FOV
        {
            targetInSight = true;
        }

        let distanceToTarget = this.entity.position
            .subtract(target.position)
            .length();

        // update state
        if (this._state === PsyanimBasicPreyBehavior.STATE.MOVEMENT_LAG)
        {
            if (this.movementLagDetectionTarget)
            {
                if (!this._movementLagTargetInitialPosition.fuzzyEquals(
                    this.movementLagDetectionTarget.position))
                {
                    this._state = PsyanimBasicPreyBehavior.STATE.WANDERING;
                }
                else if (this.movementLag != 0 && this._movementLagTimer > this.movementLag)
                {
                    PsyanimApp.Instance.events.emit('psyanim-jspsych-endTrial');                    
                }
            }
            else if (this._movementLagTimer > this.movementLag)
            {
                this._state = PsyanimBasicPreyBehavior.STATE.WANDERING;
            }
        }
        else
        {
            if (targetInSight && distanceToTarget < this.safetyDistance)
            {
                if (this._state != PsyanimBasicPreyBehavior.STATE.FLEEING)
                {
                    if (this.debug)
                    {
                        PsyanimDebug.log("Prey '" + this.entity.name + "' state = FLEEING.");
                    }
        
                    this._state = PsyanimBasicPreyBehavior.STATE.FLEEING;
                }
            }
            else
            {
                if (this._state != PsyanimBasicPreyBehavior.STATE.WANDERING)
                {
                    if (this.debug)
                    {
                        PsyanimDebug.log("Prey '" + this.entity.name + "' state = WANDERING.");
                    }
        
                    this._state = PsyanimBasicPreyBehavior.STATE.WANDERING;    
                }
            }
        }

        // compute steering
        if (this._state === PsyanimBasicPreyBehavior.STATE.MOVEMENT_LAG)
        {
            return Phaser.Math.Vector2.ZERO;
        }
        else if (this._state == PsyanimBasicPreyBehavior.STATE.FLEEING)
        {
            let targetRelativePosition = target.position
                .subtract(this.entity.position);

            targetRelativePosition.rotate(this._subtletyAngle * Math.PI / 180.0);

            let newTargetPosition = this.entity.position
                .add(targetRelativePosition);

            this._fleeTarget.position = newTargetPosition;

            return this.fleeBehavior.getSteering(this._fleeTarget);
        }
        else if (this._state == PsyanimBasicPreyBehavior.STATE.WANDERING)
        {
            return this.wanderBehavior.getSteering();
        }
    }

    _recomputeSubtletyAngle() {

        this._subtletyAngle = this.subtlety * (2 * Math.random() - 1);
    }

    update(t, dt) {

        super.update(t, dt);

        this._subtletyUpdateTimer += dt;

        if (this._state === PsyanimBasicPreyBehavior.STATE.MOVEMENT_LAG)
        {
            this._movementLagTimer += dt;
        }
        else
        {
            this._behaviorExecutionTimer += dt;
        }

        if (this.fixedDuration > 0 && this._behaviorExecutionTimer > this.fixedDuration)
        {
            PsyanimApp.Instance.events.emit('psyanim-jspsych-endTrial');
        }

        if (this._subtletyUpdateTimer > this.subtletyLag)
        {
            this._subtletyUpdateTimer = 0;

            if (this._state == PsyanimBasicPreyBehavior.STATE.FLEEING)
            {
                this._recomputeSubtletyAngle();
            }
        }        
    }
}

PsyanimBasicPreyBehavior.STATE = {
    WANDERING: 0x0001,
    FLEEING: 0x0002,
    MOVEMENT_LAG: 0x0004
}; 