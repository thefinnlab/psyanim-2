import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimPlayerController from '../../core/components/controllers/PsyanimPlayerController';
import PsyanimFleeBehavior from '../../core/components/steering/PsyanimFleeBehavior';
import PsyanimEvadeBehavior from '../../core/components/steering/PsyanimEvadeBehavior';
import PsyanimEvadeAgent from '../../core/components/steering/agents/PsyanimEvadeAgent';

export default class EvadeTest extends PsyanimScene {

    constructor() {

        super('Evade Test');
    }

    create() {

        super.create();

        // create player
        let player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, 
            width: 40, height: 20, 
            radius: 12, 
            color: 0x0000ff
        });

        player.addComponent(PsyanimPlayerController);

        // create evade agent
        let agent = this.addEntity('evadeAgent', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, color: 0x00ff00         
        });

        let evadeAgentVehicle = agent.addComponent(PsyanimVehicle);

        let fleeBehavior = agent.addComponent(PsyanimFleeBehavior);

        let evadeBehavior = agent.addComponent(PsyanimEvadeBehavior);
        evadeBehavior.fleeBehavior = fleeBehavior;

        let evadeAgent = agent.addComponent(PsyanimEvadeAgent);
        evadeAgent.target = player;
        evadeAgent.vehicle = evadeAgentVehicle;
        evadeAgent.evadeBehavior = evadeBehavior;
    }
}