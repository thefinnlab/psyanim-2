import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController';
import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimCircleRenderer from '../../src/core/components/rendering/PsyanimCircleRenderer';
import PsyanimLineRenderer from '../../src/core/components/rendering/PsyanimLineRenderer';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

export default class DebugGraphicsTest extends PsyanimScene {

    constructor() {

        super('DebugGraphicsTest');
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // create player
        this.player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, 
            width: 40, height: 20, 
            radius: 12, 
            color: 0x0000ff
        });

        this.player.addComponent(PsyanimPlayerController);
        this.player.addComponent(PsyanimCircleRenderer);

        this.line = this.player.addComponent(PsyanimLineRenderer);
    }

    update(t, dt) {

        super.update(t, dt);

        // update line endpoints in player's local space
        this.line.originPoint.x = this.player.x;
        this.line.originPoint.y = this.player.y;

        let offset = this.player.forward.setLength(150);

        this.line.endPoint.x = this.player.x + offset.x;
        this.line.endPoint.y = this.player.y + offset.y;
    }
}