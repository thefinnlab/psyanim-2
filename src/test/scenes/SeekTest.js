import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimPlayerController from '../../core/components/controllers/PsyanimPlayerController';

import PsyanimSeekBehavior from '../../core/components/steering/PsyanimSeekBehavior';
import PsyanimSeekAgent from '../../core/components/steering/agents/PsyanimSeekAgent';

export default class SeekTest extends PsyanimScene {

    constructor() {

        super('Seek Test');
    }

    create() {

        super.create();

        // setup mouse follow target
        let mouseTarget = this.addEntity('mouseFollowTarget', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0x00ff00
        });

        mouseTarget.addComponent(PsyanimMouseFollowTarget, { radius: 4 });

        // create player
        let player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, 
            width: 40, height: 20, 
            radius: 12, 
            color: 0x0000ff
        });

        player.addComponent(PsyanimPlayerController);

        // add agents to the scene
        let agent1 = this.addEntity('agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        let agent2 = this.addEntity('agent2', 200, 150, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        });

        let agent3 = this.addEntity('agent3', 200, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            radius: 12,
            color: 0x87ceeb          
        });

        // add vehicle components to our agents
        let vehicle1 = agent1.addComponent(PsyanimVehicle);
        let vehicle2 = agent2.addComponent(PsyanimVehicle);
        let vehicle3 = agent3.addComponent(PsyanimVehicle);

        vehicle1.maxSpeed = 5;
        vehicle2.maxSpeed = 4;
        vehicle3.maxSpeed = 5;

        vehicle2.nSamplesForSmoothing = 10;

        // add seek behavior components to our agents
        let seek1 = agent1.addComponent(PsyanimSeekBehavior);
        let seek2 = agent2.addComponent(PsyanimSeekBehavior);
        let seek3 = agent3.addComponent(PsyanimSeekBehavior);

        seek1.maxSpeed = 5;
        seek2.maxSpeed = 4;
        seek3.maxSpeed = 6;

        seek3.maxAcceleration = 0.4;

        // add seek agent component to our agents
        let seekAgent1 = agent1.addComponent(PsyanimSeekAgent);
        let seekAgent2 = agent2.addComponent(PsyanimSeekAgent);
        let seekAgent3 = agent3.addComponent(PsyanimSeekAgent);

        seekAgent1.seekBehavior = seek1;
        seekAgent2.seekBehavior = seek2;
        seekAgent3.seekBehavior = seek3;

        seekAgent1.vehicle = vehicle1;
        seekAgent2.vehicle = vehicle2;
        seekAgent3.vehicle = vehicle3;

        seekAgent1.target = player;
        seekAgent2.target = agent3;
        seekAgent3.target = mouseTarget;
    }
}