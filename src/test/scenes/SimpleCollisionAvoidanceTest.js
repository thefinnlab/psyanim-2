import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimPathFollow from '../../core/components/steering/PsyanimPathFollow';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

export default class SimpleCollisionAvoidanceTest extends PsyanimScene {

    constructor() {

        super('Collision Avoidance Test');
    }

    create() {

        super.create();

        let agentData = [
            {
                spawnPoint: new Phaser.Math.Vector2(75, 305),
                pathStart: new Phaser.Math.Vector2(50, 300),
                pathEnd: new Phaser.Math.Vector2(750, 300),
                color: 0xff0000,
                name: 'red'
            },
            {
                spawnPoint: new Phaser.Math.Vector2(725, 290),
                pathStart: new Phaser.Math.Vector2(750, 295),
                pathEnd: new Phaser.Math.Vector2(50, 295),
                color: 0xffff00,
                name: 'yellow'
            }
        ];

        let predictionTime = 25;
        let targetOffset = 50;

        this.stoppingRadius = predictionTime + targetOffset;
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
            vehicle.maxSpeed = 2.5;

            vehicle.maxAcceleration = 0.2;
            vehicle.sensorRadius = 100;

            vehicle.enableCollisionAvoidance();

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