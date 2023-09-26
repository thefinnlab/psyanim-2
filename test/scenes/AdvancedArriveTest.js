import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';

import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

import PsyanimMultiRaySensor from '../../src/core/components/physics/PsyanimMultiRaySensor';
import PsyanimMultiRaySensorRenderer from '../../src/core/components/rendering/PsyanimMultiRaySensorRenderer';
import PsyanimSeekBehavior from '../../src/core/components/steering/PsyanimSeekBehavior';
import PsyanimObstacleAvoidanceBehavior from '../../src/core/components/steering/PsyanimObstacleAvoidanceBehavior';

import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior';
import PsyanimAdvancedArriveBehavior from '../../src/core/components/steering/PsyanimAdvancedArriveBehavior';
import PsyanimAdvancedArriveAgent from '../../src/core/components/steering/agents/PsyanimAdvancedArriveAgent';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

export default {

    key: 'Arrive Test',
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
            initialPosition: { x: 700, y: 500 },
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
            initialPosition: { x: 100, y: 100 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 16, altitude: 32, 
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
                                distance: 150,
                                relativeAngle: 0
                            },
                            {
                                id: 1,
                                distance: 50,
                                relativeAngle: 25
                            },
                            {
                                id: 2,
                                distance: 50,
                                relativeAngle: -25
                            }
                        ],
                        bodyNames: ['obstacle1', 'obstacle2']
                    }
                },
                {
                    type: PsyanimMultiRaySensorRenderer,
                    params: {
                        raySensor: {
                            entityName: 'agent1',
                            componentType: PsyanimMultiRaySensor    
                        }
                    }
                },
                {
                    type: PsyanimSeekBehavior,
                    params: {
                        maxSpeed: 5,
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
                        avoidDistance: 25
                    }
                },
                {
                    type: PsyanimArriveBehavior,
                    params: {
                        maxSpeed: 5,
                        innerDecelerationRadius: 25,
                        outerDecelerationRadius: 140
                    }
                },
                {
                    type: PsyanimAdvancedArriveBehavior,
                    params: {
                        arriveBehavior: {
                            entityName: 'agent1',
                            componentType: PsyanimArriveBehavior
                        },
                        obstacleAvoidanceBehavior: {
                            entityName: 'agent1',
                            componentType: PsyanimObstacleAvoidanceBehavior
                        }
                    }
                },
                {
                    type: PsyanimAdvancedArriveAgent,
                    params: {
                        target: {
                            entityName: 'mouseFollowTarget'
                        },
                        advancedArriveBehavior: {
                            entityName: 'agent1',
                            componentType: PsyanimAdvancedArriveBehavior
                        },
                        vehicle: {
                            entityName: 'agent1',
                            componentType: PsyanimVehicle
                        }
                    }
                }
            ]
        },
        {
            name: 'obstacle1',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
                width: 25, height: 200,
                color: 0xff0000     
            },
            matterOptions: {
                isStatic: true
            }
        },
        {
            name: 'obstacle2',
            initialPosition: { x: 500+12.5, y: 200 + 12.5 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
                width: 200, height: 25,
                color: 0xff0000     
            },
            matterOptions: { isStatic: true }
        }
    ]
};