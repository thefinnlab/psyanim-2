import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController.js';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle.js';
import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior.js';
import PsyanimArriveAgent from '../../src/core/components/steering/agents/PsyanimArriveAgent.js';
import PsyanimFleeBehavior from '../../src/core/components/steering/PsyanimFleeBehavior.js';
import PsyanimFleeAgent from '../../src/core/components/steering/agents/PsyanimFleeAgent.js';

import PsyanimSensor from '../../src/core/components/physics/PsyanimSensor.js';

import MyAdvancedBehaviorTreeTest from '../components/AdvancedBehaviorTreeTest/MyAdvancedBehaviorTreeTest.js';

import MyItemSpawner from '../components/HFSMTest/MyItemSpawner.js';

export default {
    key: 'Advanced Behavior Tree Test',
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
                color: 0xff00ff,
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
            name: 'target1',
            initialPosition: { x: 100, y: 200 }
        },
        { 
            name: 'target2',
            initialPosition: { x: 400, y: 50 }
        },
        { 
            name: 'target3',
            initialPosition: { x: 700, y: 200 }
        },
        {
            name: 'agent',
            initialPosition: { x: 100, y: 300 },
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
                        enabled: false,
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
                    type: PsyanimFleeBehavior,
                    params: {
                        maxSpeed: 8,
                        maxAcceleration: 0.3,
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
                    }
                },
                {
                    type: MyAdvancedBehaviorTreeTest,
                    params: {
                        player: {
                            entityName: 'player'
                        },
                        target1: {
                            entityName: 'target1'
                        },
                        target2: {
                            entityName: 'target2'
                        },
                        target3: {
                            entityName: 'target3'
                        },
                        arriveAgent: {
                            entityName: 'agent',
                            componentType: PsyanimArriveAgent
                        },
                        fleeAgent: {
                            entityName: 'agent',
                            componentType: PsyanimFleeAgent
                        }
                    }
                }
            ]
        }
    ]
}