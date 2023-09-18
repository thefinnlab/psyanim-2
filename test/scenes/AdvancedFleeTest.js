import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimAdvancedFleeAgentPrefab from '../../src/core/prefabs/PsyanimAdvancedFleeAgentPrefab';
import PsyanimAdvancedFleeAgent from '../../src/core/components/steering/agents/PsyanimAdvancedFleeAgent';

export default {
    key: 'Advanced Flee Test',
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
                type: PsyanimAdvancedFleeAgentPrefab,
                params: {
                    debug: true
                }
            },
            components: [
                {
                    type: PsyanimAdvancedFleeAgent,
                    params: {
                        target: {
                            entityName: 'mouseFollowTarget'
                        }
                    }
                }
            ]
        },
        {
            name: 'agent2',
            initialPosition: { x: 200, y: 150 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
                width: 60, height: 30,
                color: 0xffff00            
            },
            prefab: {
                type: PsyanimAdvancedFleeAgentPrefab,
                params: {
                    maxSpeed: 5,
                    advancedFleeWallSeparationDistance: 70
                }
            },
            components: [
                {
                    type: PsyanimAdvancedFleeAgent,
                    params: {
                        target: {
                            entityName: 'mouseFollowTarget'
                        }
                    }
                }
            ]
        },
    ]
}