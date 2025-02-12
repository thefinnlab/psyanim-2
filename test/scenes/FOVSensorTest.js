import PsyanimConstants from "../../src/core/PsyanimConstants.js";

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimPlayerController from "../../src/core/components/controllers/PsyanimPlayerController.js";

import PsyanimFOVSensor from "../../src/core/components/physics/PsyanimFOVSensor.js";
import PsyanimFOVRenderer from "../../src/core/components/rendering/PsyanimFOVRenderer.js";

import FOVSensorTestColorModifier from "../components/FOVSensorTestColorModifier.js";

export default {

    key: 'FOV Sensor Test',
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
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, 
                width: 40, height: 20, 
                radius: 12, 
                color: 0x0000ff
            },
            components: [
                { type: PsyanimPlayerController },
                {
                    type: PsyanimFOVSensor,
                    id: 23,
                    params: {
                        fovAngle: 120,
                        fovRange: 200
                    }
                },
                {
                    type: PsyanimFOVRenderer,
                    params: {
                        fovSensor: {
                            entityName: 'player',
                            componentId: 23
                        }
                    }
                }
            ]
        },
        {
            name: 'box',
            initialPosition: 'random',
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
                width: 10, height: 15,
                color: 0xffff00            
            },
            instances: 5,
            matterOptions: {
                isStatic: true
            },
            components: [
                { 
                    type: FOVSensorTestColorModifier,
                    params: {
                        fovSensor: {
                            entityName: 'player',
                            componentType: PsyanimFOVSensor
                        }
                    }
                }
            ]
        }
    ],
};