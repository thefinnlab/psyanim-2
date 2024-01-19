import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimConstants from '../../src/core/PsyanimConstants.js';
import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController.js';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle.js';
import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior.js';
import PsyanimArriveAgent from '../../src/core/components/steering/agents/PsyanimArriveAgent.js';
import PsyanimPathFollowingAgent from '../../src/core/components/steering/agents/PsyanimPathFollowingAgent.js';
import PsyanimFleeBehavior from '../../src/core/components/steering/PsyanimFleeBehavior.js';
import PsyanimFleeAgent from '../../src/core/components/steering/agents/PsyanimFleeAgent.js';

import PsyanimSensor from '../../src/core/components/physics/PsyanimSensor.js';

import MyItemSpawner from '../components/HFSMTest/MyItemSpawner.js';

import MyPatrolFleeAgentFSM from '../components/HFSMTest/MyPatrolFleeAgentFSM.js';
import MyCollectItemFSM from '../components/HFSMTest/MyCollectItemFSM.js';
import MyBasicHFSM from '../components/HFSMTest/MyBasicHFSM.js';

export default {
    key: 'Basic HFSM Test',
    wrapScreenBoundary: true,
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
            initialPosition: { x: 400, y: 550 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                color: 0xff0000,
                base: 12, altitude: 20
            },
            components: [
                {
                    type: PsyanimPlayerController
                }
            ]
        },
        {
            name: 'itemSpawner',
            components: [
                {
                    type: MyItemSpawner
                }
            ]
        },
        {
            name: 'agent',
            initialPosition: { x: 100, y: 200 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                color: 0x0000ff,
                base: 12, altitude: 20
            },
            components: [
                {
                    type: PsyanimSensor,
                    params: {
                        bodyShapeParams: {
                            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                            radius: 24                
                        }
                    }
                },
                {
                    type: PsyanimVehicle,
                },
                {
                    type: PsyanimArriveBehavior,
                    params: {
                        maxSpeed: 6,
                        innerDecelerationRadius: 4,
                        outerDecelerationRadius: 50
                    }
                },
                {
                    type: PsyanimArriveAgent,
                    params: {
                        arriveBehavior: {
                            entityName: 'agent',
                            componentType: PsyanimArriveBehavior
                        },
                        vehicle: {
                            entityName: 'agent',
                            componentType: PsyanimVehicle
                        }
                    }
                },
                {
                    type: PsyanimPathFollowingAgent,
                    params: {
                        currentPathVertices: [
                            { x: 100, y: 200 },
                            { x: 400, y: 50 },
                            { x: 700, y: 200 },
                        ],
                        arriveAgent: {
                            entityName: 'agent',
                            componentType: PsyanimArriveAgent
                        },
                        targetPositionOffset: 50
                    }
                },
                {
                    type: PsyanimFleeBehavior,
                    params: {
                        maxSpeed: 8,
                        maxAcceleration: 0.3,
                        panicDistance: 150
                    }
                },
                {
                    type: PsyanimFleeAgent,
                    enabled: false,
                    params: {
                        fleeBehavior: {
                            entityName: 'agent',
                            componentType: PsyanimFleeBehavior
                        },
                        vehicle: {
                            entityName: 'agent',
                            componentType: PsyanimVehicle
                        },
                        target: {
                            entityName: 'player'
                        }
                    }
                },
                {
                    type: MyPatrolFleeAgentFSM,
                },
                {
                    type: MyCollectItemFSM,
                },
                {
                    type: MyBasicHFSM
                }
            ]
        }
    ],
}