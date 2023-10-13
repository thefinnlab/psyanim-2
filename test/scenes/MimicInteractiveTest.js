import PsyanimConstants from "../../src/core/PsyanimConstants.js";

import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimMimic from "../../src/core/components/animation/PsyanimMimic.js";

export default {
    key: 'Mimic Interactive Test',
    entities: [
        {
            name: 'sceneControls',
            components: [
                { type: PsyanimSceneTitle },
                { type: PsyanimPhysicsSettingsController },
                { type: PsyanimSceneChangeController }
            ]
        },
        {
            name: 'player',
            initialPosition: { x: 600, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, 
                color: 0x0000ff
            },
            initialAngle: 135,
            components: [
                { type: PsyanimPlayerController }
            ]
        },
        {
            name: 'mimic',
            initialPosition: { x: 200, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 12,
                color: 0x00ff00
            },
            matterOptions: {
                isSensor: true
            },
            components: [
                { 
                    type: PsyanimMimic,
                    params: {
                        angleOffset: 180,
                        target: {
                            entityName: 'player',
                        }
                    }
                }
            ]
        }
    ]
}