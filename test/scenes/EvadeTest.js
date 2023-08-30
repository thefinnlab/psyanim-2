import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimEvadeAgentPrefab from '../../src/core/prefabs/PsyanimEvadeAgentPrefab';
import PsyanimEvadeAgent from '../../src/core/components/steering/agents/PsyanimEvadeAgent';

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