import Phaser from 'phaser';

import PsyanimConstants from '../../../gameobjects/PsyanimConstants';
import MouseFollowTarget from '../../../gameobjects/input/MouseFollowTarget';
import PsyanimGeomUtils from '../../../gameobjects/PsyanimGeomUtils';
import ScreenBoundary from '../../../gameobjects/world/ScreenBoundary';
import PsyanimPlayerController from '../../../gameobjects/input/PsyanimPlayerController';

export default class MainScene extends Phaser.Scene {

    constructor() {

        super('main');
    }

    init() {
    }

    preload() {

    }

    create() {

        // setup wrapping with screen boundary
        this.screenBoundary = new ScreenBoundary(this);

        // create player
        this.player = new PsyanimPlayerController(this);

        // setup mouse follow target
        this.mouseFollowTarget = new MouseFollowTarget(this);
    }

    update(t, dt) {


    }
}