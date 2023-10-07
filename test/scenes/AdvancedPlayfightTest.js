import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimAdvancedPlayfightAgentPrefab from '../../src/core/prefabs/PsyanimAdvancedPlayfightAgentPrefab.js';
import PsyanimAdvancedPlayfightAgent from '../../src/core/components/steering/agents/PsyanimAdvancedPlayfightAgent.js';
import PsyanimAdvancedPlayfightBehavior from '../../src/core/components/steering/PsyanimAdvancedPlayfightBehavior.js';

export default {
    key: 'Advanced Playfight Test',
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
            name: 'agent1',
            initialPosition: { x: 200, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 12, color: 0xff0000
            },
            prefab: {
                type: PsyanimAdvancedPlayfightAgentPrefab,
                params: {
                    collisionFrequency: 2000,
                    breakDuration: 1650
                }
            },
            components: [
                {
                    type: PsyanimAdvancedPlayfightBehavior,
                    params: {
                        debug: true
                    }
                },
                {
                    type: PsyanimAdvancedPlayfightAgent,
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
                type: PsyanimAdvancedPlayfightAgentPrefab,
                params: {
                    collisionFrequency: 2000,
                    breakDuration: 1650
                }
            },
            components: [
                {
                    type: PsyanimAdvancedPlayfightAgent,
                    params: {
                        target: {
                            entityName: 'agent1'
                        },
                    }
                }
            ]
        },
    ]
};