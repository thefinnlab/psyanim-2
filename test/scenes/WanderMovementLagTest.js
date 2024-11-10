import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';
import PsyanimWanderAgentPrefab from '../../src/core/prefabs/PsyanimWanderAgentPrefab.js';
import PsyanimWanderAgent from '../../src/core/components/steering/agents/PsyanimWanderAgent.js';

import PsyanimPreyPrefab from '../../src/core/prefabs/PsyanimPreyPrefab.js';
import PsyanimPreyAgent from '../../src/core/components/steering/agents/PsyanimPreyAgent.js';
import PsyanimBasicPreyBehavior from '../../src/core/components/steering/PsyanimBasicPreyBehavior.js';

export default {

    key: 'Wander Movement Lag Test',
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
            name: 'wanderAgent',
            initialPosition: { x: 600, y: 300 },
            shapeParams: {
                textureKey: 'wanderTestTexture',
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 16, altitude: 32, 
                color: 0xffc0cb            
            },
            prefab: {
                type: PsyanimWanderAgentPrefab,
                params: {
                    debug: false,
                    movementLag: 10000,
                }
            },
            components: [
                {
                    type: PsyanimWanderAgent,
                    params: {
                        movementLagDetectionTarget: {
                            entityName: 'prey'
                        }
                    }
                }
            ]
        },
        {
            name: 'prey',
            initialPosition: { x: 100, y: 100 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, color: 0xffff00
            },
            prefab: { 
                type: PsyanimPreyPrefab,
            },
            components: [
                {
                    type: PsyanimBasicPreyBehavior,
                    params: {
                        debug: true,
                        movementLag: 4000,
                    }
                },
                {
                    type: PsyanimPreyAgent,
                    params: {
                        target: {
                            entityName: 'wanderAgent'
                        }
                    }    
                }
            ]
        }
    ]
};