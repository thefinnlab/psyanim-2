import PsyanimEntityPrefab from "../PsyanimEntityPrefab";

import PsyanimVehicle from "../components/steering/PsyanimVehicle";
import PsyanimArriveBehavior from "../components/steering/PsyanimArriveBehavior";
import PsyanimSeekBehavior from "../components/steering/PsyanimSeekBehavior";
import PsyanimWanderBehavior from "../components/steering/PsyanimWanderBehavior";
import PsyanimFOVSensor from "../components/physics/PsyanimFOVSensor";
import PsyanimBasicPredatorBehavior from "../components/steering/PsyanimBasicPredatorBehavior";
import PsyanimPredatorAgent from "../components/steering/agents/PsyanimPredatorAgent";

/**
 *  Prefab for creating a `Predator Agent`.
 * 
 *  A `Predator Agent` will wander until the target comes within its field-of-view and remains within the `boredom distance`,
 *  at which point it will begin to chase the target in a direction offset by the `subtlety` parameter.
 * 
 *  A `Predator Agent` has the following components: 
 * 
 *  `PsyanimVehicle`, `PsyanimArriveBehavior`, `PsyanimSeekBehavior`, `PsyanimWanderBehavior`, 
 *  `PsyanimFOVSensor`, `PsyanimBasicPredatorBehavior`, `PsyanimPredatorAgent`
 */
export default class PsyanimPredatorPrefab extends PsyanimEntityPrefab {

    /** Predator Params */

    /**
     *  Target that the predator will chase when in sight.
     *  @type {PsyanimEntity}
     */
    target;

    /**
     *  Maximum number of degrees which this agent will offset its chase direction.
     *  @type {Number}
     */
    subtlety;

    /**
     *  Determines how often the agent will recompute its chase direction offset based on the `subtlety` parameter.
     *  @type {Number}
     */
    subtletyLag;

    /** Field-of-view Params */

    /**
     *  Field-of-view cone angle, in degrees.
     *  @type {Number}
     */
    fovAngle;

    /**
     *  Field-of-view cone height, in pixels.  This determines how far out the target can see.
     *  @type {Number}
     */
    fovRange;

    /**
     *  Field-of-view resolution, in degrees.  
     * 
     *  This determines how many degrees of the field-of-view an entity must occupy to be detected.
     * 
     *  The lower the number, the higher the resolution, and the more CPU overhead this component has.
     * 
     *  @type {Number}
     */
    fovResolution;

    /** Chase Params */

    /**
     *  Maximum speed at which this agent will chase the target.
     *  @type {Number}
     */
    maxChaseSpeed;

    /**
     *  Maximum acceleration at which this agent will reach during a chase.
     *  @type {Number}
     */
    maxChaseAcceleration;

    /**
     *  Distance, in px, from target which agent will come to rest during a chase.
     *  @type {Number}
     */
    chaseInnerDecelerationRadius;

    /**
     *  Distance, in px, from target which the agent will begin slowing down during a chase.
     *  @type {Number}
     */
    chaseOuterDecelerationRadius;

    /** Wander Params */

    /**
     *  Radius of the wander circle
     *  @type {Number}
     */
    wanderRadius;

    /**
     *  Distance the wander circle is offset from the agent's position.
     *  @type {Number}
     */
    wanderOffset;

    /**
     *  Maximum number of degrees the wander target can move around the wander circle per frame.
     */
    maxWanderAngleChangePerFrame;

    /**
     *  Maximum speed at which the agent can wander.
     *  @type {Number}
     */
    maxWanderSpeed;

    /**
     *  Maximum rate at which the agent can accelerate when wandering.
     *  @type {Number}
     */
    maxWanderAcceleration;

    constructor(shapeParams) {

        super(shapeParams);

        // prey params
        this.subtlety = 30;
        this.subtletyLag = 500;

        // fov params
        this.fovAngle = 120;
        this.fovRange = 200;
        this.fovResolution = 5;

        // chase params
        this.maxChaseSpeed = 6;
        this.maxChaseAcceleration = 0.2;
        this.chaseInnerDecelerationRadius = 16;
        this.chaseOuterDecelerationRadius = 40;

        // wander params
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;
        this.maxWanderSpeed = 4;
        this.maxWanderAcceleration = 0.2;
    }

    create(entity) {

        super.create(entity);

        let vehicle = entity.addComponent(PsyanimVehicle);

        let arrive = entity.addComponent(PsyanimArriveBehavior);
        arrive.maxSpeed = this.maxChaseSpeed;
        arrive.maxAcceleration = this.maxChaseAcceleration;
        arrive.innerDecelerationRadius = this.chaseInnerDecelerationRadius;
        arrive.outerDecelerationRadius = this.chaseOuterDecelerationRadius;

        let seek = entity.addComponent(PsyanimSeekBehavior);
        seek.maxSpeed = this.maxWanderSpeed;
        seek.maxAcceleration = this.maxWanderAcceleration;

        let wander = entity.addComponent(PsyanimWanderBehavior);
        wander.seekBehavior = seek;
        wander.radius = this.wanderRadius;
        wander.offset = this.wanderOffset;
        wander.maxWanderAngleChangePerFrame = this.maxWanderAngleChangePerFrame;

        let fovSensor = entity.addComponent(PsyanimFOVSensor);
        fovSensor.fovAngle = this.fovAngle;
        fovSensor.fovRange = this.fovRange;
        fovSensor.resolution = this.fovResolution;

        let predator = entity.addComponent(PsyanimBasicPredatorBehavior);
        predator.arriveBehavior = arrive;
        predator.wanderBehavior = wander;
        predator.fovSensor = fovSensor;
        predator.subtlety = this.subtlety;
        predator.subtletyLag = this.subtletyLag;

        let predatorAgent = entity.addComponent(PsyanimPredatorAgent);
        predatorAgent.vehicle = vehicle;
        predatorAgent.predatorBehavior = predator;
        predatorAgent.target = this.target;

        return entity;
    }
}