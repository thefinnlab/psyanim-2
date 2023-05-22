import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimEntity from '../../core/PsyanimEntity';

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimPlayerController from '../../core/components/controllers/PsyanimPlayerController';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';

export default class RayCastTest extends PsyanimScene {

    constructor() {

        super('RayCastTest');
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
        .addComponent(PsyanimPhysicsSettingsController).entity
        .addComponent(PsyanimSceneChangeController);    

        // create player
        this.player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, 
            width: 40, height: 20, 
            radius: 12, 
            color: 0x0000ff
        });

        this.player.addComponent(PsyanimPlayerController);

        // add some static objects into the scene
        this.box = this.addEntity('box', 500, 250, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 50, height: 125,
            color: 0xffff00            
        },
        {
            isStatic: true
        });

        this.screenBoundary.wrap = false;

        this.bodies = [this.box.body, 
            this.screenBoundary.topBoundary.body, this.screenBoundary.bottomBoundary.body, 
            this.screenBoundary.leftBoundary.body, this.screenBoundary.rightBoundary.body];
    }

    update(t, dt) {

        super.update(t, dt);

        let start = { x: this.player.x, y: this.player.y };

        let forward = this.player.forward;
        let endPositionRelative = forward.setLength(100);

        let endPositionVector = this.player.position.add(endPositionRelative);

        let end = { x: endPositionVector.x, y: endPositionVector.y };

        let collisions = this.matter.query.ray(this.bodies, start, end);

        if (collisions && collisions.length != 0)
        {
            collisions.forEach(c => {

                c.bodyA.gameObject.setTint(0xff0000);
            });
        }

        this.bodies.forEach(body => {

            if (!collisions || !collisions.find(c => c.bodyA.gameObject.name == body.gameObject.name))
            {
                body.gameObject.setTint(0xffff00);
            }
        });
    }
}