import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle.js';

import PsyanimMultiRaySensor from '../../src/core/components/physics/PsyanimMultiRaySensor.js';
import PsyanimSeekBehavior from '../../src/core/components/steering/PsyanimSeekBehavior.js';
import PsyanimObstacleAvoidanceBehavior from '../../src/core/components/steering/PsyanimObstacleAvoidanceBehavior.js';

import PsyanimFleeBehavior from '../../src/core/components/steering/PsyanimFleeBehavior.js';
import PsyanimAdvancedFleeBehavior from '../../src/core/components/steering/PsyanimAdvancedFleeBehavior.js';
import PsyanimAdvancedFleeAgent from '../../src/core/components/steering/agents/PsyanimAdvancedFleeAgent.js';

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
            name: 'player',
            initialPosition: { x: 700, y: 500 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 12,
                color: 0x0000ff
            },
            components: [
                {
                    type: PsyanimPlayerController,
                    params: {
                        speed: 10
                    }
                }
            ]
        },
        {
            name: 'agent1',
            initialPosition: { x: 100, y: 100 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 12,
                color: 0xffc0cb            
            },
            components: [
                {
                    type: PsyanimVehicle,
                },
                {
                    type: PsyanimMultiRaySensor,
                    params: {
                        rayInfoList: [
                            {
                                id: 0,
                                distance: 125,
                                relativeAngle: 0
                            },
                            {
                                id: 1,
                                distance: 75,
                                relativeAngle: 25
                            },
                            {
                                id: 2,
                                distance: 75,
                                relativeAngle: -25
                            }
                        ],
                    }
                },
                // {
                //     type: PsyanimMultiRaySensorRenderer,
                //     params: {
                //         raySensor: {
                //             entityName: 'agent1',
                //             componentType: PsyanimMultiRaySensor    
                //         }
                //     }
                // },
                {
                    type: PsyanimSeekBehavior,
                    params: {
                        maxSpeed: 3,
                        maxAcceleration: 0.2
                    }
                },
                {
                    type: PsyanimObstacleAvoidanceBehavior,
                    params: {
                        multiRaySensor: {
                            entityName: 'agent1',
                            componentType: PsyanimMultiRaySensor
                        },
                        seekBehavior: {
                            entityName: 'agent1',
                            componentType: PsyanimSeekBehavior
                        },
                        avoidDistance: 1.5 * (75 * Math.sin(25 * Math.PI / 180)),
                        maxSeekSpeed: 3,
                        maxAcceleration: 0.2
                    }
                },
                {
                    type: PsyanimFleeBehavior,
                    params: {
                        maxSpeed: 3,
                        maxAcceleration: 0.2
                    }
                },
                {
                    type: PsyanimAdvancedFleeBehavior,
                    params: {
                        fleeBehavior: {
                            entityName: 'agent1',
                            componentType: PsyanimFleeBehavior
                        },
                        obstacleAvoidanceBehavior: {
                            entityName: 'agent1',
                            componentType: PsyanimObstacleAvoidanceBehavior
                        }
                    }
                },
                {
                    type: PsyanimAdvancedFleeAgent,
                    params: {
                        target: {
                            entityName: 'player'
                        },
                        advancedFleeBehavior: {
                            entityName: 'agent1',
                            componentType: PsyanimAdvancedFleeBehavior
                        },
                        vehicle: {
                            entityName: 'agent1',
                            componentType: PsyanimVehicle
                        }
                    }
                }
            ]
        }
    ]
}