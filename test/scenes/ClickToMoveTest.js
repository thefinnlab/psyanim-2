import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import TestGridWithObstacles from '../utils/TestGridWithObstacles';

import PsyanimClickToMovePlayerPrefab from '../../src/core/prefabs/PsyanimClickToMovePlayerPrefab';

export default class ClickToMoveTest extends PsyanimScene {

    constructor() {

        super('Click To Move Test');
    }

    create() {

        super.create();

        this.screenBoundary.wrap = false;

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // create navigation grid for pathfinding based on environment obstacles
        this._grid = TestGridWithObstacles.create(this);

        // setup player agent
        let playerPrefab = new PsyanimClickToMovePlayerPrefab({
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 12, altitude: 24, 
            color: 0xff0000            
        });

        playerPrefab.grid = this._grid;
        playerPrefab.debug = true;

        this._player = this.instantiatePrefab(playerPrefab, 'player', 700, 100);
    }
}