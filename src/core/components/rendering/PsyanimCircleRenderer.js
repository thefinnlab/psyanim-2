import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimCircleRenderer extends PsyanimComponent {
    
    forwardOffset = 100;
    rightOffset = 0;
    radius = 20;

    constructor(entity, options = { color: 0xa020f0 }) {

        super(entity);

        this.graphics = entity.scene.add.graphics({ lineStyle: { width: 2, color: options.color, alpha: 0.6 } });

        this._circle = new Phaser.Geom.Circle(
            entity.x + this.forwardOffset, 
            entity.y + this.rightOffset, 
            this.radius);
    }

    update(t, dt) {

        super.update(t, dt);

        this.graphics.clear();

        this.graphics.strokeCircleShape(this._circle);

        let forwardComponent = this.entity.forward.setLength(this.forwardOffset);
        let rightComponent = this.entity.right.setLength(this.rightOffset);

        let offsetVector = forwardComponent.add(rightComponent);

        let newPosition = this.entity.position.add(offsetVector);

        this._circle.setPosition(
            newPosition.x, 
            newPosition.y);
    }
}