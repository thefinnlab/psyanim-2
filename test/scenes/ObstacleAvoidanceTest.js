import PsyanimConstants from "../../src/core/PsyanimConstants";

import PsyanimSceneTitle from "../../src/core/components/ui/PsyanimSceneTitle";
import PsyanimPhysicsSettingsController from "../../src/core/components/controllers/PsyanimPhysicsSettingsController";
import PsyanimSceneChangeController from "../../src/core/components/controllers/PsyanimSceneController";

import PsyanimPlayerController from "../../src/core/components/controllers/PsyanimPlayerController";

import PsyanimMultiRaySensor from '../../src/core/components/physics/PsyanimMultiRaySensor';
import PsyanimMultiRaySensorRenderer from '../../src/core/components/rendering/PsyanimMultiRaySensorRenderer';

import PsyanimObstacleAvoidanceBehavior from '../../src/core/components/steering/PsyanimObstacleAvoidanceBehavior';

export default {
    key: 'Obstacle Avoidance Test',
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
            name: 'obstacle1',
            initialPosition: { x: 200, y: 200 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 100,
                color: 0xffff00
            },
            matterOptions: { isStatic: true }
        },
        {
            name: 'player',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, 
                color: 0x0000ff
            },
            components: [
                {
                    type: PsyanimPlayerController,
                    params: {
                        speed: 10
                    }
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
                        bodyNames: ['obstacle1']
                    }
                },
                {
                    type: PsyanimMultiRaySensorRenderer,
                    params: {
                        raySensor: {
                            entityName: 'player',
                            componentType: PsyanimMultiRaySensor
                        }
                    }
                },
                {
                    type: PsyanimObstacleAvoidanceBehavior,
                    params: {
                        multiRaySensor: {
                            entityName: 'player',
                            componentType: PsyanimMultiRaySensor
                        },
                        avoidDistance: 25
                    }
                }
            ]
        }
    ]
}