import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

export default class EmptyScene extends PsyanimScene {

    constructor() {

        super('EmptyScene');
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneChangeController);
    }
}