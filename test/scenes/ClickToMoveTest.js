import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimClickToMovePlayerPrefab from '../../src/core/prefabs/PsyanimClickToMovePlayerPrefab';

export default {

    key: 'Click To Move Test',
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
            initialPosition: { x: 700, y: 100 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 12, altitude: 24, 
                color: 0xff0000            
            },
            initialAngle: 225,
            prefab: {
                type: PsyanimClickToMovePlayerPrefab,
                params: {
                    grid: 'navgrid',
                    debug: true
                }
            }
        }
    ],
    navgrid: {
        cellSize: 10,
        obstacles: [
            {
                position: { x: 170, y: 50 },
                shapeParams: {
                    shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                    radius: 49,
                    color: 0x0000ff
                }
            },
            {
                position: { x: 170, y: 160 },
                shapeParams: {
                    shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                    base: 98, altitude: 98,
                    color: 0x00ff00
                }
            },
            {
                position: { x: 170, y: 300 },
                shapeParams: {
                    shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                    radius: 49,
                    color: 0xffff00
                }
            },
            {
                position: { x: 730, y: 520 },
                shapeParams: {
                    shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                    base: 98, altitude: 98,
                    color: 0x00ffff
                }
            },
            {
                position: { x: 400, y: 340 },
                shapeParams: {
                    shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
                    height: 500, width: 100,
                    color: 0xFFA500
                }
            },
            {
                position: { x: 600, y: 300 },
                shapeParams: {
                    shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                    radius: 100,
                    color: 0xff00ff
                }
            },
        ]
    }
};