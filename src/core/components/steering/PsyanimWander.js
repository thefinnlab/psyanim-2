import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimVehicle from './PsyanimVehicle';

export default class PsyanimWander extends PsyanimComponent {
    

    constructor(entity) {

        super(entity);

        this.vehicle = this.entity.getComponent(PsyanimVehicle);

        if (!this.vehicle)
        {
            this.vehicle = this.entity.addComponent(PsyanimVehicle);
        }

        // this.vehicle.setState(PsyanimVehicle.STATE.SEEK);
    }

    update(t, dt) {

        super.update(t, dt);
    }
}