import Phaser from 'phaser';

import PsyanimScene from '../../scene/PsyanimScene';

import PsyanimExperimentManager from '../../components/experiments/PsyanimExperimentManager';

export default class PsyanimExperimentLoadingScene extends PsyanimScene {

    static KEY = '_PsyanimExperimentLoader';

    constructor() {

        super('_PsyanimExperimentLoader');
    }

    create() {

        super.create();

        this._experimentManager = this.addEntity('experimentManager')
            .addComponent(PsyanimExperimentManager);

        const sceneNameHeader = document.getElementById("sceneName");

        if (this._experimentManager.isComplete)
        {
            sceneNameHeader.innerHTML = "Experiment complete!";
        }
        else
        {
            sceneNameHeader.innerHTML = "Loading...";
        }
    }

    update(t, dt) {

        super.update(t, dt);
    }
}