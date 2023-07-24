import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../core/components/ui/PsyanimSceneTitle';

export default class AdvancedPathFollowingTest extends PsyanimScene {

    constructor() {

        super('Advanced Path Following Test');
    }

    create() {

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);
    }
}