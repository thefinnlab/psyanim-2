import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimPlayerController from '../../core/components/controllers/PsyanimPlayerController';
import PsyanimConstants from '../../core/PsyanimConstants';

import PsyanimCircleRenderer from '../../core/components/rendering/PsyanimCircleRenderer';

export default class DebugGraphicsTest extends PsyanimScene {

    constructor() {

        super('DebugGraphicsTest');
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
        player.addComponent(PsyanimCircleRenderer);
    }
}