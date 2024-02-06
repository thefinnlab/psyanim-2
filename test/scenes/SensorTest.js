import PsyanimConstants from '../../src/core/PsyanimConstants.js';
import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController.js';
import PsyanimMatterSensor from '../../src/core/components/physics/PsyanimMatterSensor.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';
import SensorTestManager from '../components/SensorTestManager.js';

import PsyanimJsPsychPlayerContactListener from '../../src/integrations/PsyanimJsPsychPlayerContactListener.js';

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
            name: 'testManager',
            components: [
                {
                    type: SensorTestManager,
                    params: {
                        sensor: {
                            entityName: 'player',
                            componentType: PsyanimMatterSensor
                        }
                    }
                },
                {
                    type: PsyanimJsPsychPlayerContactListener,
                    params: {
                        sensor: {
                            entityName: 'player',
                            componentType: PsyanimMatterSensor
                        },
                        targetEntityNames: [
                            "wall",
                            "killzone1"
                        ]
                    }
                }
            ]
        },
        {
            name: 'wall',
            initialPosition: { x: 650, y: 200 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 75, color: 0xff00ff,
                depth: 1
            },
            matterOptions: {
                isStatic: true
            }
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
                    type: PsyanimMatterSensor,
                    params: {
                        debug: true,
                        bodyShapeParams: {
                            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                            radius: 75,
                        }
                    }
                }
            ]
        },
    ]
};