import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimPathFollow from '../../core/components/steering/PsyanimPathFollow';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

export default class PsyanimCollisionAvoidance extends PsyanimScene {

    constructor() {

        super('Collision Avoidance Test');
    }

    create() {

        super.create();

        let agentData = [
            {
                spawnPoint: new Phaser.Math.Vector2(250, 450),
                pathStart: new Phaser.Math.Vector2(230, 430),
                pathEnd: new Phaser.Math.Vector2(570, 370)
            },
            {
                spawnPoint: new Phaser.Math.Vector2(550, 400),
                pathStart: new Phaser.Math.Vector2(570, 430),
                pathEnd: new Phaser.Math.Vector2(230, 370)
            },
            {
                spawnPoint: new Phaser.Math.Vector2(250, 300),
                pathStart: new Phaser.Math.Vector2(300, 250),
                pathEnd: new Phaser.Math.Vector2(500, 550)
            },
            {
                spawnPoint: new Phaser.Math.Vector2(550, 300),
                pathStart: new Phaser.Math.Vector2(500, 250),
                pathEnd: new Phaser.Math.Vector2(300, 550)
            },
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

            let agent = this.addEntity('agent' + i, spawnPoint.x, spawnPoint.y, {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, color: 0xffc0cb
            });

            let vehicle = agent.addComponent(PsyanimVehicle);
            vehicle.turnSpeed = Infinity;
            vehicle.maxSpeed = 2.5;
            vehicle.enableCollisionAvoidance();

            let pathFollow = agent.addComponent(PsyanimPathFollow);
            pathFollow.p1 = pathStart;
            pathFollow.p2 = pathEnd;
            pathFollow.predictionTime = predictionTime;
            pathFollow.targetOffset = targetOffset;

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