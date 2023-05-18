import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimPathFollowBehavior from '../../core/components/steering/PsyanimPathFollowBehavior';
import PsyanimCollisionAvoidanceBehavior from '../../core/components/steering/PsyanimCollisionAvoidanceBehavior';
import PsyanimPathFollowAgent from '../../core/components/steering/agents/PsyanimPathFollowAgent';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimPathRenderer from '../../core/components/rendering/PsyanimPathRenderer';
import PsyanimSeekBehavior from '../../core/components/steering/PsyanimSeekBehavior';

import PsyanimCollisionAvoidanceDebug from '../../core/components/rendering/PsyanimCollisionAvoidanceDebug';

export default class SimpleCollisionAvoidanceTest extends PsyanimScene {

    constructor() {

        super('Simple Collision Avoidance Test');
    }

    create() {

        super.create();

        let agentData = [
            {
                spawnPoint: new Phaser.Math.Vector2(225, 299),
                pathStart: new Phaser.Math.Vector2(200, 299),
                pathEnd: new Phaser.Math.Vector2(600, 299),
                color: 0xff0000,
                name: 'red'
            },
            {
                spawnPoint: new Phaser.Math.Vector2(575, 301),
                pathStart: new Phaser.Math.Vector2(600, 301),
                pathEnd: new Phaser.Math.Vector2(200, 301),
                color: 0xffff00,
                name: 'yellow'
            }
        ];

        let predictionTime = 25;
        let targetOffset = 50;

        this.stoppingRadius = predictionTime + targetOffset;
        this.agentComponents = [];

        // setup path renderer
        let path = this.addEntity('path', 0, 0, {
            isEmpty: true
        });

        this.pathRenderer = path.addComponent(PsyanimPathRenderer);
        this.pathRenderer.setRadius(30);
        this.pathRenderer.p1 = new Phaser.Math.Vector2(200, 300);
        this.pathRenderer.p2 = new Phaser.Math.Vector2(600, 300);

        for (let i = 0; i < agentData.length; ++i)
        {
            let spawnPoint = agentData[i].spawnPoint;
            let pathStart = agentData[i].pathStart;
            let pathEnd = agentData[i].pathEnd;
            let color = agentData[i].color;
            let name = agentData[i].name;

            let agent = this.addEntity(name, spawnPoint.x, spawnPoint.y, {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, color: color
            });

            let vehicle = agent.addComponent(PsyanimVehicle);
            vehicle.turnSpeed = 100;
            vehicle.maxSpeed = 2.5;
            vehicle.maxAcceleration = 0.2;

            let collisionAvoidance = agent.addComponent(PsyanimCollisionAvoidanceBehavior);
            collisionAvoidance.setSensorRadius(100);
            collisionAvoidance.collisionRadius = 10;

            let seek = agent.addComponent(PsyanimSeekBehavior);

            let pathFollow = agent.addComponent(PsyanimPathFollowBehavior);
            pathFollow.p1 = pathStart;
            pathFollow.p2 = pathEnd;
            pathFollow.predictionTime = predictionTime;
            pathFollow.targetOffset = targetOffset;
            pathFollow.seekBehavior = seek;

            let pathFollowAgent = agent.addComponent(PsyanimPathFollowAgent);
            pathFollowAgent.collisionAvoidanceBehavior = collisionAvoidance;
            pathFollowAgent.vehicle = vehicle;
            pathFollowAgent.pathFollowBehavior = pathFollow;

            this.agentComponents.push({
                agent: agent,
                pathFollow: pathFollow,
                vehicle: vehicle,
                collisionAvoidance: collisionAvoidance
            });
        }
        
        this.redAgentComponents = this.agentComponents.find(c => c.agent.name == 'red');

        let debugRenderer = this.redAgentComponents.agent.addComponent(PsyanimCollisionAvoidanceDebug);

        debugRenderer.collisionAvoidanceBehavior = this.redAgentComponents.collisionAvoidance;
        
        this._testKeys = {
            C: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
        };
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._testKeys.C)) {

            let collisionAvoidance = this.redAgentComponents.collisionAvoidance;

            let agentInfo = "nearby agents: ";
            
            collisionAvoidance._nearbyAgents.forEach(v => {

                agentInfo += v.name + ", ";
            });

            console.log(agentInfo);
        }

        this.agentComponents.forEach(data => {

            let distanceToPathEnd = data.agent.position.subtract(data.pathFollow.p2).length();

            if (distanceToPathEnd < this.stoppingRadius)
            {
                data.pathFollow.reverseDirection();
            }
        });
    }
}