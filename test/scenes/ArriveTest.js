import PsyanimConstants from '../../src/core/PsyanimConstants.js';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget.js';

import PsyanimArriveAgentPrefab from '../../src/core/prefabs/PsyanimArriveAgentPrefab.js';
import PsyanimArriveAgent from '../../src/core/components/steering/agents/PsyanimArriveAgent.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

export default {

    key: 'Arrive Test',
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
            name: 'mouseFollowTarget',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 4,
                color: 0x00ff00
            },
            components: [
                { type: PsyanimMouseFollowTarget }
            ]
        },
        {
            name: 'agent1',
            initialPosition: { x: 600, y: 450 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 16, altitude: 32, 
                color: 0xffc0cb            
            },
            prefab: {
                type: PsyanimArriveAgentPrefab,
            },
            components: [
                {
                    type: PsyanimArriveAgent,
                    params: {
                        target: {
                            entityName: 'mouseFollowTarget'
                        }
                    }
                }
            ]
        }
    ]
};