import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimConstants from '../../core/PsyanimConstants';

import PsyanimPathfindingRenderer from '../../core/components/rendering/PsyanimPathfindingRenderer';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../core/components/ui/PsyanimSceneTitle';

import PsyanimPath from '../../utils/PsyanimPath.mjs';

import PsyanimLineRenderer from '../../core/components/rendering/PsyanimLineRenderer';

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
            currentPath: new PsyanimPath([
                new Phaser.Math.Vector2(50, 550),
                new Phaser.Math.Vector2(150, 300),
                new Phaser.Math.Vector2(250, 400),
                new Phaser.Math.Vector2(350, 250),
                new Phaser.Math.Vector2(450, 350),
                new Phaser.Math.Vector2(550, 100),
                new Phaser.Math.Vector2(700, 500)
            ])
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

        this._pathFollowingTarget.visible = false;

        // setup line renderer showing closest point to mouse cursor on closest path segment
        this._closestPointRenderer = this.addEntity('closestPointRenderer')
            .addComponent(PsyanimLineRenderer);

        this._closestPointRenderer.lineColor = 0xff0000;

        this._closestPointRenderer.enabled = false;

        this._keys = {
            ONE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
            TWO: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
        }
    }

    /**
     *  TODO: need to update this to use the path parameter and project the seek target onto
     *  the path at the location of the path parameter!
     */
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
        let closestSegment = this._pathfinder.currentPath
            .getClosestSegment(this._mouseTarget.position);

        let start = closestSegment.p1.clone();
        let end = closestSegment.p2.clone();

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

    _updateClosestPointToMouseCursor() {

        let mousePos = this._mouseTarget.position;

        let closestPoint = this._pathfinder.currentPath.getClosestPoint(mousePos);

        this._closestPointRenderer.originPoint = mousePos;
        this._closestPointRenderer.endPoint = closestPoint;
    }

    update(t, dt) {

        super.update(t, dt);

        this._computePathfollowingTargetLocation();

        this._updateClosestPointToMouseCursor();

        // compute parameter for mouse target

        // TODO: this is failing at the first segment for some reason...
        // closest segment is evaluating to the 1st segment in case
        // where the parameter is supposed to be '0' (start of path)...

        let parameter = this._pathfinder.currentPath.getParameter(
            this._mouseTarget.position
        );

        console.log("parameter = " + parameter);

        // handle control inputs
        if (Phaser.Input.Keyboard.JustDown(this._keys.ONE))
        {
            this._pathFollowingTarget.visible = !this._pathFollowingTarget.visible;
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.TWO))
        {
            this._closestPointRenderer.enabled = !this._closestPointRenderer.enabled;
        }
    }
}