import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimVehicle from './PsyanimVehicle';

import PsyanimPathRenderer from '../rendering/PsyanimPathRenderer';

export default class PsyanimPathFollow extends PsyanimComponent {

    p1 = new Phaser.Math.Vector2(0, 0);
    p2 = new Phaser.Math.Vector2(400, 300);

    radius = 20;

    constructor(entity) {

        super(entity);

        this.vehicle = this.entity.getComponent(PsyanimVehicle);

        if (!this.vehicle)
        {
            this.vehicle = this.entity.addComponent(PsyanimVehicle);
        }

        this.pathRenderer = this.entity.getComponent(PsyanimPathRenderer);

        if (!this.pathRenderer)
        {
            this.pathRenderer = this.entity.addComponent(PsyanimPathRenderer);
        }
    }

    onEnable() {
        this.pathRenderer.enabled = true;
    }

    onDisable() {
        this.pathRenderer.enabled = false;
    }

    update(t, dt) {

        super.update(t, dt);

        this.pathRenderer.p1 = this.p1;
        this.pathRenderer.p2 = this.p2;
    }
}