import PsyanimConstants from "../../src/core/PsyanimConstants.js";

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import MatterCollisionTest from "../components/MatterCollisionTest.js";

import PsyanimPlayerController from "../../src/core/components/controllers/PsyanimPlayerController.js";

export default {

    key: 'Matter Collision Test',
    entities: [
        {
            name: 'sceneControls',
            components: [
                { type: PsyanimSceneTitle },
                { type: PsyanimPhysicsSettingsController },
                { type: PsyanimSceneChangeController }
            ]
        },
        // TODO: setup custom collision categories.
        {
            name: 'player',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 12,
                color: 0xff0000, depth: 1
            },
            matterOptions: {
                collisionFilter: {
                    category: 0x000000,
                    mask: 0x000000
                }
            },
            components: [
                { type: MatterCollisionTest },
                { type: PsyanimPlayerController }
            ]
        },
        {
            name: 'rectangle',
            initialPosition: { x: 600, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
                width: 100, height: 200,
                color: 0x00ff00, depth: 0
            },
            matterOptions: {
                // isSensor: true,
            }
        }
    ]
}