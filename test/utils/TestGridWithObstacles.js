import PsyanimConstants from '../../src/core/PsyanimConstants.js';
import PsyanimNavigationGrid from '../../src/core/utils/PsyanimNavigationGrid.js';

export default class TestGridWithObstacles {

    /** creates a standard test grid with some obstacles we can test in any scene with */
    static create(scene) {

        // setup pathfinding grid with obstacles
        let grid = new PsyanimNavigationGrid(
            10,
            scene.game.scale.width,
            scene.game.scale.height,
        );

        let obstacle1 = scene.addEntity('obstacle1', 170, 50, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 49,
            color: 0x0000ff
        },
        {
            isSleeping: true
        });

        let obstacle2 = scene.addEntity('obstacle2', 170, 160, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 98, altitude: 98,
            color: 0x00ff00
        },
        {
            isSleeping: true
        });

        let obstacle3 = scene.addEntity('obstacle3', 170, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 49,
            color: 0xffff00
        },
        {
            isSleeping: true
        });

        let obstacle4 = scene.addEntity('obstacle4', 730, 520, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 98, altitude: 98,
            color: 0x00ffff
        },
        {
            isSleeping: true
        });

        let obstacle5 = scene.addEntity('obstacle5', 400, 340, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
            height: 500, width: 100,
            color: 0xFFA500
        },
        {
            isSleeping: true
        });

        let obstacle6 = scene.addEntity('obstacle6', 600, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 100,
            color: 0xff00ff
        },
        {
            isSleeping: true
        });

        grid.addObstacle(obstacle1);
        grid.addObstacle(obstacle2);
        grid.addObstacle(obstacle3);
        grid.addObstacle(obstacle4);
        grid.addObstacle(obstacle5);
        grid.addObstacle(obstacle6);

        grid.bake();

        return grid;
    }
}