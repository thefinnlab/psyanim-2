import PsyanimApp from '../../../PsyanimApp.js';
import PsyanimComponent from '../../../PsyanimComponent.js';

export default class PsyanimWanderAgent extends PsyanimComponent {

    vehicle;

    wanderBehavior;

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

    constructor(entity) {

        super(entity);

        // movement lag state params
        this.movementLag = 0;
        this.movementLagDetectionTarget = null;

        this.fixedDuration = -1;

        // private state
        this._behaviorExecutionTimer = 0;
        this._movementLagTimer = 0;
        this._movementLagTargetInitialPosition = null;

        this._state = PsyanimWanderAgent.STATE.MOVEMENT_LAG;
    }

    afterCreate() {

        super.afterCreate();

        if (this.movementLagDetectionTarget)
        {
            this._movementLagTargetInitialPosition = this.movementLagDetectionTarget.position;
        }

        if (this.movementLag === 0)
        {
            this._state = PsyanimWanderAgent.STATE.WANDERING;
        }
    }

    update(t, dt) {

        super.update(t, dt);

        // update timers
        if (this._state === PsyanimWanderAgent.STATE.MOVEMENT_LAG)
        {
            this._movementLagTimer += dt;
        }
        else
        {
            this._behaviorExecutionTimer += dt;
        }

        // update state
        if (this._state === PsyanimWanderAgent.STATE.MOVEMENT_LAG)
        {
            if (this.movementLagDetectionTarget)
            {
                if (!this._movementLagTargetInitialPosition.fuzzyEquals(
                    this.movementLagDetectionTarget.position))
                {
                    this._state = PsyanimWanderAgent.STATE.WANDERING;
                }
                else if (this.movementLag != 0 && this._movementLagTimer > this.movementLag)
                {
                    PsyanimApp.Instance.events.emit('psyanim-jspsych-endTrial');                    
                }
            }
            else if (this._movementLagTimer > this.movementLag)
            {
                this._state = PsyanimWanderAgent.STATE.WANDERING;
            }            
        }

        if (this.fixedDuration > 0 && this._behaviorExecutionTimer > this.fixedDuration)
        {
            PsyanimApp.Instance.events.emit('psyanim-jspsych-endTrial');
        }

        // compute steering
        let steering = Phaser.Math.Vector2.ZERO;

        if (this._state === PsyanimWanderAgent.STATE.WANDERING)
        {
            steering = this.wanderBehavior.getSteering();
        }

        this.vehicle.steer(steering);
    }
}

PsyanimWanderAgent.STATE = {
    MOVEMENT_LAG: 0x0001,
    WANDERING: 0x0002
};