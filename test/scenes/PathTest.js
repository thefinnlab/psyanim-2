import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPathfindingRenderer from '../../src/core/components/rendering/PsyanimPathfindingRenderer';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimPath from '../../src/core/utils/PsyanimPath.mjs';

import PsyanimLineRenderer from '../../src/core/components/rendering/PsyanimLineRenderer';

export default class PathTest extends PsyanimScene {

    constructor() {

        super('Path Test')
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

        // setup line renderer showing closest point to mouse cursor on closest path segment
        this._closestPointRenderer = this.addEntity('closestPointRenderer')
            .addComponent(PsyanimLineRenderer);

        this._closestPointRenderer.lineColor = 0xff0000;

        this._keys = {
            ONE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
            TWO: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
        }
    }

    _computePathfollowingTargetLocation() {

        let targetPositionOffset = 50;
        let targetParameterOffset = targetPositionOffset / this._pathfinder.currentPath.getTotalLength();

        let parameter = this._pathfinder.currentPath
            .getParameter(this._mouseTarget.position);

        let targetParameter = parameter + targetParameterOffset;

        let targetPosition = this._pathfinder.currentPath
            .getPosition(targetParameter);

        this._pathFollowingTarget.x = targetPosition.x;
        this._pathFollowingTarget.y = targetPosition.y;
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