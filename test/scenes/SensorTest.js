import PsyanimConstants from '../../src/core/PsyanimConstants.js';
import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';
import SensorTestManager from '../components/SensorTestManager.js';

import PsyanimJsPsychPlayerContactListener from '../../src/integrations/PsyanimJsPsychPlayerContactListener.js';

import PsyanimSensor from '../../src/core/components/physics/PsyanimSensor.js';

export default {
    key: 'Sensor Test',
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
            name: 'wall',
            initialPosition: { x: 650, y: 200 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
                width: 75, height: 125, color: 0xff00ff,
                depth: 1
            },
            matterOptions: {
                isStatic: true
            },
            components: [
                {
                    type: PsyanimJsPsychPlayerContactListener,
                    params: {
                        targetEntityNames: [
                            "wall",
                            "killzone1"
                        ]
                    }
                },
                {
                    type: PsyanimSensor,
                    params: {
                        debug: true,
                        bodyShapeParams: {
                            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
                            width: 75,
                            height: 125
                        }
                    }
                },
            ]
        },
        {
            name: 'killzone1',
            initialPosition: { x: 600, y: 200 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 200, color: 0xff0000
            },
            matterOptions: {
                isSensor: true
            }
        },
        {
            name: 'player',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, color: 0x0000ff    
            },
            components: [
                { type: PsyanimPlayerController },
                {
                    type: PsyanimSensor,
                    id: 42,
                    params: {
                        debug: true,
                        bodyShapeParams: {
                            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                            radius: 40,
                        },
                    }
                },
                {
                    type: PsyanimSensor,
                    id: 89,
                    params: {
                        debug: true,
                        bodyShapeParams: {
                            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
                            width: 35,
                            height: 150
                        },
                        offset: { x: -30, y: 0 }
                    }
                },
                {
                    type: SensorTestManager,
                    params: {
                        sensor1: {
                            entityName: 'player',
                            componentId: 42
                        },
                        sensor2: {
                            entityName: 'player',
                            componentId: 89
                        }
                    }
                },
            ]
        },
    ]
};