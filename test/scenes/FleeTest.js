import PsyanimConstants from '../../src/core/PsyanimConstants.js';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimFleeAgentPrefab from '../../src/core/prefabs/PsyanimFleeAgentPrefab.js';
import PsyanimFleeAgent from '../../src/core/components/steering/agents/PsyanimFleeAgent.js';

import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle.js';

export default {
    key: 'Flee Test',
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
                type: PsyanimFleeAgentPrefab
            },
            components: [
                {
                    type: PsyanimFleeAgent,
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
                type: PsyanimFleeAgentPrefab,
                params: {
                    maxSpeed: 5
                }
            },
            components: [
                {
                    type: PsyanimFleeAgent,
                    params: {
                        target: {
                            entityName: 'mouseFollowTarget'
                        }
                    }    
                },
                {
                    type: PsyanimVehicle,
                    params: {
                        nSamplesForLookSmoothing: 10
                    }
                }
            ]
        }
    ]
};