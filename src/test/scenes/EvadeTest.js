import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimWanderBehavior from '../../core/components/steering/PsyanimWanderBehavior';

export default class EvadeTest extends PsyanimScene {

    constructor() {

        super('Evade Test');
    }

    create() {

        super.create();

        // add agents as vehicles to this scene
        let wanderAgent = this.addEntity('wanderAgent', 0, 0, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, color: 0xff0000         
        });

        let wanderTarget = this.addEntity('wanderTarget', 0, 0, { isEmpty: true });

        let wanderVehicle = wanderAgent.addComponent(PsyanimVehicle);
        wanderVehicle.target = wanderTarget;
        wanderVehicle.setState(PsyanimVehicle.STATE.SEEK);

        let wander = wanderAgent.addComponent(PsyanimWanderBehavior);
        wander.vehicle = wanderVehicle;
        wander.target = wanderTarget;
        wander.maxSpeed = 4;

        let evadeAgent = this.addEntity('evadeAgent', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, color: 0x00ff00         
        });

        let evadeAgentVehicle = evadeAgent.addComponent(PsyanimVehicle);
        evadeAgentVehicle.target = wanderAgent;
        evadeAgentVehicle.setState(PsyanimVehicle.STATE.EVADE);
    }
}