import Phaser from 'phaser';

import PsyanimScene from '../../scenes/PsyanimScene';

import PsyanimConstants from '../../entities/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../entities/controllers/MouseFollowTarget';
import PsyanimPlayerController from '../../entities/controllers/PsyanimPlayerController';
import PsyanimVehicle from '../../entities/steering/PsyanimVehicle';

export default class WanderTest extends PsyanimScene {

    constructor() {

        super('Wander Test');
    }

    create() {

        super.create();
    }
}