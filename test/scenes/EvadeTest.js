import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimEvadeAgentPrefab from '../../src/core/prefabs/PsyanimEvadeAgentPrefab.js';
import PsyanimEvadeAgent from '../../src/core/components/steering/agents/PsyanimEvadeAgent.js';

export default {
    key: 'Evade Test',
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
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, 
                width: 40, height: 20, 
                radius: 12, 
                color: 0x0000ff
            },
            components: [
                { type: PsyanimPlayerController }
            ]
        },
        {
            name: 'agent1',
            initialPosition: { x: 600, y: 450 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 16, altitude: 32, color: 0x00ff00         
            },
            prefab: { type: PsyanimEvadeAgentPrefab },
            components: [
                {
                    type: PsyanimEvadeAgent,
                    params: {
                        target: {
                            entityName: 'player'
                        }
                    }
                }
            ]
        },
    ]
};