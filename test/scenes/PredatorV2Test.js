import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController.js';

import PsyanimPredatorFSM from "../../src/core/components/ai/predatorprey/PsyanimPredatorFSM.js";

export default {
    key: 'Predator v2 test',
    wrapScreenBoundary: false,
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
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 12, color: 0x0000ff
            },
            components: [
                {
                    type: PsyanimPlayerController,
                    params: {
                        speed: 4
                    }
                }
            ]
        },
        {
            name: 'predator',
            initialPosition: { x: 200, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 12, color: 0x000000
            },
            components: [
                {
                    type: PsyanimPredatorFSM,
                    params: {
                        target: {
                            entityName: 'player'
                        },
                        subtlety: 30,
                        averageWanderTime: 2000,
                        debugLogging: false,
                        debugGraphics: true,
                        movementLag: 4000,
                        fixedDuration: 4000,
                        // movementLagDetectionTarget: {
                        //     entityName: 'player'
                        // }                        
                    }
                }
            ]
        },
    ]
}