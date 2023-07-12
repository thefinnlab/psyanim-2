import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

export default class EmptyScene extends PsyanimScene {

    static KEY = 'EmptyScene';

    constructor() {

        super(EmptyScene.KEY);
    }

    init() {
        
        super.init();
    }

    create() {

        super.create();
    }

    update(t, dt) {

        super.update(t, dt);
    }
}