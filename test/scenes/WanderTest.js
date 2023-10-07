import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';
import PsyanimWanderAgentPrefab from '../../src/core/prefabs/PsyanimWanderAgentPrefab.js';

export default {

    key: 'Wander Test',
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
            name: 'agent',
            instances: 20,
            initialPosition: 'random',
            shapeParams: {
                textureKey: 'wanderTestTexture',
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 16, altitude: 32, 
                color: 0xffc0cb            
            },
            prefab: {
                type: PsyanimWanderAgentPrefab,
                params: {
                    debug: false
                }
            }
        }
    ]
};