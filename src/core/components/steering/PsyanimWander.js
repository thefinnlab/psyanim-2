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

        this.target = entity.scene.addEntity(this.entity.name + 'wanderTarget', 0, 0, {
            isEmpty: true
        });

        this.vehicle.target = this.target;
        this.vehicle.setState(PsyanimVehicle.STATE.SEEK);
    }

    update(t, dt) {

        super.update(t, dt);

        this.target.x = this.entity.scene.input.x;
        this.target.y = this.entity.scene.input.y;
    }
}