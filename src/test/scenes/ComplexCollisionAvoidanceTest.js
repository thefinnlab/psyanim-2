import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimPathFollow from '../../core/components/steering/PsyanimPathFollow';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

import PsyanimCollisionAvoidanceDebug from '../../core/components/rendering/PsyanimCollisionAvoidanceDebug';

export default class ComplexCollisionAvoidanceTest extends PsyanimScene {

    constructor() {

        super('Complex Collision Avoidance Test');
    }

    create() {

        super.create();

        let agentData = [
            {
                spawnPoint: new Phaser.Math.Vector2(250, 450),
                pathStart: new Phaser.Math.Vector2(230, 430),
                pathEnd: new Phaser.Math.Vector2(570, 370),
                color: 0xff0000,
                name: 'red'
            },
            {
                spawnPoint: new Phaser.Math.Vector2(550, 400),
                pathStart: new Phaser.Math.Vector2(570, 430),
                pathEnd: new Phaser.Math.Vector2(230, 370),
                color: 0xffff00,
                name: 'yellow'
            },
            {
                spawnPoint: new Phaser.Math.Vector2(250, 300),
                pathStart: new Phaser.Math.Vector2(300, 250),
                pathEnd: new Phaser.Math.Vector2(500, 550),
                color: 0x00ff00,
                name: 'green'
            },
            {
                spawnPoint: new Phaser.Math.Vector2(550, 300),
                pathStart: new Phaser.Math.Vector2(500, 250),
                pathEnd: new Phaser.Math.Vector2(300, 550),
                color: 0x0000ff,
                name: 'blue'
            },
        ];

        let predictionTime = 25;
        let targetOffset = 50;

        this.stoppingRadius = 50;
        this.agentComponents = [];

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
            vehicle.turnSpeed = Infinity;
            vehicle.maxSpeed = 2.0;
            vehicle.collisionRadius = 16;

            if (i != 0)
            {
                vehicle.enableCollisionAvoidance();
            }
            else
            {
                vehicle.maxSpeed = 1.5;
            }


            vehicle.maxAcceleration = 0.2;
            vehicle.sensorRadius = 100;

            let pathFollow = agent.addComponent(PsyanimPathFollow);
            pathFollow.p1 = pathStart;
            pathFollow.p2 = pathEnd;
            pathFollow.predictionTime = predictionTime;
            pathFollow.targetOffset = targetOffset;
            pathFollow.pathRenderer.enabled = true;

            this.agentComponents.push({
                agent: agent,
                pathFollow: pathFollow,
                vehicle: vehicle
            });
        }

        let yellowAgent = this.agentComponents.find(c => c.agent.name == 'yellow').agent;

        let debugRenderer = yellowAgent.addComponent(PsyanimCollisionAvoidanceDebug);

        debugRenderer.vehicle = yellowAgent.getComponent(PsyanimVehicle);
    }

    update(t, dt) {

        super.update(t, dt);

        this.agentComponents.forEach(data => {

            let distanceToPathEnd = data.agent.position.subtract(data.pathFollow.p2).length();

            if (distanceToPathEnd < this.stoppingRadius)
            {
                data.pathFollow.reverseDirection();
            }
        });
    }
}