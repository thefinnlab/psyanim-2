import PsyanimConstants from "../../src/core/PsyanimConstants";

import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimMimic from "../../src/core/components/animation/PsyanimMimic";

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
                        xOffset: -400,
                        yOffset: 100,
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