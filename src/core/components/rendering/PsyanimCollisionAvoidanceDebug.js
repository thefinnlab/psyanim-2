import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimCollisionAvoidanceDebug extends PsyanimComponent {

    vehicle = null;

    constructor(entity) {

        super(entity);
        
        this.graphics = entity.scene.add.graphics({ lineStyle: { width: 2, color: 0x00ff00, alpha: 1.0 } });

        this._circle = new Phaser.Geom.Circle(0, 0, 4);
    }

    update(t, dt) {

        super.update(t, dt);

        this.graphics.clear();

        let finalRelativePosition = this.vehicle._collisionAvoidanceTargetPosition;

        if (finalRelativePosition == null)
        {
            return;
        }

        let targetPosition = this.entity.position.add(finalRelativePosition);

        this._circle.setPosition(
            targetPosition.x, targetPosition.y
        );

        this.graphics.strokeCircleShape(this._circle);
    }
}