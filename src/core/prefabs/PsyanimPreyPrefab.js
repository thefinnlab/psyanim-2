import PsyanimEntityPrefab from "../PsyanimEntityPrefab";

import PsyanimVehicle from "../components/steering/PsyanimVehicle";
import PsyanimFleeBehavior from "../components/steering/PsyanimFleeBehavior";
import PsyanimSeekBehavior from "../components/steering/PsyanimSeekBehavior";
import PsyanimWanderBehavior from "../components/steering/PsyanimWanderBehavior";
import PsyanimFOVSensor from "../components/physics/PsyanimFOVSensor";
import PsyanimBasicPreyBehavior from "../components/steering/PsyanimBasicPreyBehavior";
import PsyanimPreyAgent from '../components/steering/agents/PsyanimPreyAgent';

/**
 *  Prefab for creating a `Prey Agent`.
 * 
 *  A `Prey Agent` will wander until the target comes within its field-of-view and within the `panic distance`,
 *  at which point it will begin to flee from the target in a direction offset by the `subtlety` parameter.
 * 
 *  A `Prey Agent` has the following components: 
 * 
 *  `PsyanimVehicle`, `PsyanimFleeBehavior`, `PsyanimSeekBehavior`, `PsyanimWanderBehavior`, 
 *  `PsyanimFOVSensor`, `PsyanimBasicPreyBehavior`, `PsyanimPreyAgent`
 * 
 */
export default class PsyanimPreyPrefab extends PsyanimEntityPrefab {

    /** Prey params */

    /**
     *  Maximum number of degrees which this agent will offset it's flee direction.
     *  @type {Number}
     */
    subtlety;

    /**
     *  Determines how often the agent will recompute it's flee direction based on the `subtlety` parameter.
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

    /** Flee params */

    /**
     *  Maximum speed this agent can flee from the target.
     *  @type {Number}
     */
    maxFleeSpeed;

    /**
     *  Maximum acceleration this agent can reach during flee from target.
     *  @type {Number}
     */
    maxFleeAcceleration;

    /**
     *  Distance from target at which the agent will begin fleeing.
     *  @type {Number}
     */
    panicDistance;

    /** Wander params */

    /**
     *  Maximum speed at which the agent will wander.
     *  @type {Number}
     */
    maxWanderSpeed;

    /**
     *  Maximum acceleration the agent can attain during wander.
     *  @type {Number}
     */
    maxWanderAcceleration;

    /**
     *  Radius of the wander circle.
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
     *  @type {Number}
     */
    maxWanderAngleChangePerFrame;

    constructor(shapeParams) {

        super(shapeParams);

        // prey params
        this.subtlety = 30;
        this.subtletyLag = 500;

        // fov params
        this.fovAngle = 120;
        this.fovRange = 200;
        this.fovResolution = 5;

        // flee params
        this.maxFleeSpeed = 6;
        this.maxFleeAcceleration = 0.2;
        this.panicDistance = 250;

        // wander params
        this.maxWanderSpeed = 4;
        this.maxWanderAcceleration = 0.2;
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;
    }

    create(entity) {

        super.create(entity);

        let vehicle = entity.addComponent(PsyanimVehicle);

        let flee = entity.addComponent(PsyanimFleeBehavior);
        flee.maxSpeed = this.maxFleeSpeed;
        flee.maxAcceleration = this.maxFleeAcceleration;
        flee.panicDistance = this.panicDistance;

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

        let prey = entity.addComponent(PsyanimBasicPreyBehavior);
        prey.fleeBehavior = flee;
        prey.wanderBehavior = wander;
        prey.fovSensor = fovSensor;
        prey.subtlety = this.subtlety;
        prey.subtletyLag = this.subtletyLag;

        let preyAgent = entity.addComponent(PsyanimPreyAgent);
        preyAgent.vehicle = vehicle;
        preyAgent.preyBehavior = prey;

        return entity;
    }
}