import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPlayfightAgentPrefab from '../../src/core/prefabs/PsyanimPlayfightAgentPrefab.js';
import PsyanimPlayfightAgent from '../../src/core/components/steering/agents/PsyanimPlayfightAgent.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

export default {

    key: 'Playfight Test',
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
            name: 'agent1',
            initialPosition: { x: 200, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 12, color: 0xff0000
            },
            prefab: {
                type: PsyanimPlayfightAgentPrefab,
            },
            components: [
                {
                    type: PsyanimPlayfightAgent,
                    params: {
                        target: {
                            entityName: 'agent2'
                        }        
                    }
                }
            ]
        },
        {
            name: 'agent2',
            initialPosition: { x: 600, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 12, color: 0x0000ff
            },
            prefab: {
                type: PsyanimPlayfightAgentPrefab,
                params: {
                    debug: true,
                }
            },
            components: [
                {
                    type: PsyanimPlayfightAgent,
                    params: {
                        target: {
                            entityName: 'agent1'
                        }        
                    }
                }
            ]
        }
    ]
};