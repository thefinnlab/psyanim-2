import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimPlayerController from '../../core/components/controllers/PsyanimPlayerController';

export default class WanderTest extends PsyanimScene {

    constructor() {

        super('Wander Test');
    }

    create() {

        super.create();
    }
}