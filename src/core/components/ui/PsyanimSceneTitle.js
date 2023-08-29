import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimApp from '../../PsyanimApp';

export default class PsyanimSceneTitle extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        const sceneNameHeader = document.getElementById("sceneName");

        sceneNameHeader.innerHTML = PsyanimApp.Instance.currentSceneKey;
    }
}