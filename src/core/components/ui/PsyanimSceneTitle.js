import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimSceneTitle extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        const sceneNameHeader = document.getElementById("sceneName");

        sceneNameHeader.innerHTML = this.entity.scene.scene.key;
    }
}