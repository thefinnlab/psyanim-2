import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimSceneTitle from '../../core/components/ui/PsyanimSceneTitle';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';

import PsyanimSingletonTest from '../components/PsyanimSingletonTest';

export default class SingletonTest extends PsyanimScene {

    constructor() {

        super('Singleton Test');
    }

    create() {

        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimSceneChangeController);

        this.addEntity('mySingleton')
            .addComponent(PsyanimSingletonTest);
    }
}