import PsyanimConstants from "../../src/core/PsyanimConstants.js";

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimPredatorFSM from "../../src/core/components/ai/predatorprey/PsyanimPredatorFSM.js";
import PsyanimPreyFSM from '../../src/core/components/ai/predatorprey/PsyanimPreyFSM.js';

export default {
    key: 'Predator Prey v2',
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
                            entityName: 'prey'
                        },
                        debug: true
                    }
                }
            ]
        },
        {
            name: 'prey',
            initialPosition: { x: 700, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 12, color: 0x000000
            },
            components: [
                {
                    type: PsyanimPreyFSM,
                    params: {
                        target: {
                            entityName: 'predator',
                        },
                        debug: true
                    }
                }
            ]
        }
    ],
}