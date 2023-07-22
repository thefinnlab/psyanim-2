import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimConstants from '../../core/PsyanimConstants';

import PsyanimPathfindingRenderer from '../../core/components/rendering/PsyanimPathfindingRenderer';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../core/components/ui/PsyanimSceneTitle';

export default class AdvancedPathFollowingTest extends PsyanimScene {

    constructor() {

        super('Advanced Path Following Test')
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // setup mouse follow target
        this._mouseTarget = this.addEntity('mouseFollowTarget', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0x00ff00
        });

        this._mouseTarget.addComponent(PsyanimMouseFollowTarget, { radius: 4 });

        // setup hard-coded path and renderer
        this._pathfinder = {
            currentPath: [
                new Phaser.Math.Vector2(150, 500),
                new Phaser.Math.Vector2(650, 100)
            ]
        };

        this._path = this.addEntity('path');

        this._renderer = this._path.addComponent(PsyanimPathfindingRenderer);
        this._renderer.pathfinder = this._pathfinder;

        // setup seek target
        this._pathFollowingTarget = this.addEntity('pathFollowingTarget', 700, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0xFFA500
        });
    }

    _computePathfollowingTargetLocation() {

        // algo params
        let predictionTime = 25;
        let targetOffset = 50;
        let radius = 30;

        // compute future position
        let predictedPosition = this._mouseTarget.velocity;
        predictedPosition.setLength(predictionTime);
        predictedPosition.add(this._mouseTarget.position);

        // TODO: allow reversal w/ a flag
        let start = this._pathfinder.currentPath[0].clone();
        let end = this._pathfinder.currentPath[1].clone();

        // 'a' is our predicted position relative to the line start
        let a = predictedPosition.clone();
        a.subtract(start);

        // 'b' will be our future position projected onto our current path segment
        let b = end.clone();
        b.subtract(start);
        b.normalize();

        b.setLength(a.dot(b));
        
        // 'c' is an offset amount for the target, along the direction of our path segment
        let c = b.clone().setLength(targetOffset);

        let target = start.clone();
        target.add(b);
        target.add(c);

        // get distance from target position to predicted position
        let predictedOffset = predictedPosition.clone();
        predictedOffset.subtract(target);

        let predictedOffsetDistance = predictedOffset.length();

        if (predictedOffsetDistance > radius)
        {
            this._pathFollowingTarget.x = target.x;
            this._pathFollowingTarget.y = target.y;
        }
    }

    update(t, dt) {

        super.update(t, dt);

        this._computePathfollowingTargetLocation();
    }
}