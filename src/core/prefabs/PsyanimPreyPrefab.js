import PsyanimEntityPrefab from "../PsyanimEntityPrefab";

import PsyanimVehicle from "../components/steering/PsyanimVehicle";

import PsyanimMultiRaySensor from "../components/physics/PsyanimMultiRaySensor";
import PsyanimMultiRaySensorRenderer from "../components/rendering/PsyanimMultiRaySensorRenderer";
import PsyanimSeekBehavior from "../components/steering/PsyanimSeekBehavior";
import PsyanimObstacleAvoidanceBehavior from "../components/steering/PsyanimObstacleAvoidanceBehavior";

import PsyanimFleeBehavior from "../components/steering/PsyanimFleeBehavior";
import PsyanimEvadeBehavior from '../components/steering/PsyanimEvadeBehavior';
import PsyanimAdvancedFleeBehavior from "../components/steering/PsyanimAdvancedFleeBehavior";

import PsyanimWanderBehavior from "../components/steering/PsyanimWanderBehavior";
import PsyanimFOVSensor from "../components/physics/PsyanimFOVSensor";
import PsyanimBasicPreyBehavior from "../components/steering/PsyanimBasicPreyBehavior";
import PsyanimPreyAgent from '../components/steering/agents/PsyanimPreyAgent';

import PsyanimFOVRenderer from "../components/rendering/PsyanimFOVRenderer";

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

    /**
     *  Min. distance, in 'px', to target in which this predator will flee to maintain.
     *  @type {Number}
     */
    safetyDistance;

    /**
     *  If true, agent state transitions will be written out to Psyanim Debug Logs
     *  @type {boolean}
     */
    showDebugLogs;

    /** Field-of-view Params */

    /**
     *  Determines how whether or not this agent will have a limited field of view.
     * 
     *  If false, the agent's field of view will be 360 degrees and have unlimited range.
     *  @type {boolean}
     */
    useFov;

    /**
     *  Field-of-view cone angle, in degrees.
     *  @type {Number}
     */
    fovAngle;

    /**
     *  Field-of-view cone height, in pixels.  Determines how far out the agent can see.
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

    /**
     *  Toggles debug graphics for field-of-view.
     *  @type {boolean}
     */
    showDebugGraphics;

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

    /**
     *  Direction to search for an escape route if fleeing from an agent, 
     *  but a wall is found in the way.
     *  @type {boolean}
     */
    searchClockwiseDirection;

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

    constructor(shapeParams = { isEmpty: true }, matterOptions = {}) {

        super(shapeParams, matterOptions);

        // prey params
        this.subtlety = 30;
        this.subtletyLag = 500;
        this.safetyDistance = 225;
        this.showDebugLogs = false;

        // fov params
        this.useFov = false;
        this.fovAngle = 120;
        this.fovRange = 150;
        this.fovResolution = 5;
        this.showDebugGraphics = false;

        // flee params
        this.maxFleeSpeed = 7;
        this.maxFleeAcceleration = 0.2;
        this.panicDistance = 250;
        this.searchClockwiseDirection = true;

        // wander params
        this.maxWanderSpeed = 3.5;
        this.maxWanderAcceleration = 0.2;
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 10;
    }

    create(entity) {

        super.create(entity);

        // TODO: parameterize these!
        let mainRayLength = 100;
        let whiskerAngle = 25;
        let whiskerLength = 75;

        let vehicle = entity.addComponent(PsyanimVehicle);
        vehicle.maxSpeed = 3;
        vehicle.turnSpeed = 0.05;

        let multiRaySensor = entity.addComponent(PsyanimMultiRaySensor);
        multiRaySensor.rayInfoList = [
            {
                id: 0,
                distance: mainRayLength,
                relativeAngle: 0
            },
            {
                id: 1,
                distance: whiskerLength,
                relativeAngle: whiskerAngle
            },
            {
                id: 2,
                distance: whiskerLength,
                relativeAngle: -whiskerAngle
            }
        ];

        if (this.showDebugGraphics)
        {
            let multiRaySensorRenderer = entity.addComponent(PsyanimMultiRaySensorRenderer);
            multiRaySensorRenderer.raySensor = multiRaySensor;    
        }

        let seek = entity.addComponent(PsyanimSeekBehavior);

        let obstacleAvoidanceBehavior = entity.addComponent(PsyanimObstacleAvoidanceBehavior);
        obstacleAvoidanceBehavior.multiRaySensor = multiRaySensor;
        obstacleAvoidanceBehavior.seekBehavior = seek;
        obstacleAvoidanceBehavior.maxSeekSpeed = this.maxFleeSpeed;
        obstacleAvoidanceBehavior.maxSeekAcceleration = this.maxFleeAcceleration;
        obstacleAvoidanceBehavior.avoidDistance = 2 * (whiskerLength * Math.sin(whiskerAngle * Math.PI / 180));

        let flee = entity.addComponent(PsyanimFleeBehavior);
        flee.maxSpeed = this.maxFleeSpeed;
        flee.maxAcceleration = this.maxFleeAcceleration;
        flee.panicDistance = this.panicDistance;

        let evade = entity.addComponent(PsyanimEvadeBehavior);
        evade.fleeBehavior = flee;
        evade.maxPredictionTime = 3.0;

        let advancedFlee = entity.addComponent(PsyanimAdvancedFleeBehavior);
        advancedFlee.fleeBehavior = evade;
        advancedFlee.obstacleAvoidanceBehavior = obstacleAvoidanceBehavior;

        let wander = entity.addComponent(PsyanimWanderBehavior);
        wander.seekBehavior = seek;
        wander.maxSeekSpeed = this.maxWanderSpeed;
        wander.maxSeekAcceleration = this.maxWanderAcceleration;
        wander.radius = this.wanderRadius;
        wander.offset = this.wanderOffset;
        wander.maxWanderAngleChangePerFrame = this.maxWanderAngleChangePerFrame;

        let fovSensor = null;

        if (this.useFov)
        {
            fovSensor = entity.addComponent(PsyanimFOVSensor);
            fovSensor.fovAngle = this.fovAngle;
            fovSensor.fovRange = this.fovRange;
            fovSensor.resolution = this.fovResolution;    
        }

        if (this.useFov && this.showDebugGraphics)
        {
            let fovRenderer = entity.addComponent(PsyanimFOVRenderer);
            fovRenderer.fovSensor = fovSensor;
        }

        let prey = entity.addComponent(PsyanimBasicPreyBehavior);
        prey.fleeBehavior = advancedFlee;
        prey.wanderBehavior = wander;
        prey.fovSensor = fovSensor;
        prey.subtlety = this.subtlety;
        prey.subtletyLag = this.subtletyLag;
        prey.safetyDistance = this.safetyDistance;
        prey.debug = this.showDebugLogs;

        let preyAgent = entity.addComponent(PsyanimPreyAgent);
        preyAgent.vehicle = vehicle;
        preyAgent.preyBehavior = prey;

        return entity;
    }
}