import PsyanimScene from "../../core/scene/PsyanimScene";

import PsyanimSceneTitle from "../../core/components/ui/PsyanimSceneTitle";
import PsyanimPhysicsSettingsController from "../../core/components/controllers/PsyanimPhysicsSettingsController";
import PsyanimSceneChangeController from "../../core/components/controllers/PsyanimSceneController";

import PsyanimFOVSensor from "../../core/components/physics/PsyanimFOVSensor";
import PsyanimFOVRenderer from "../../core/components/rendering/PsyanimFOVRenderer";

import PsyanimConstants from "../../core/PsyanimConstants";
import PsyanimPlayerController from "../../core/components/controllers/PsyanimPlayerController";

export default class PsyanimFOVSensorTest extends PsyanimScene {

    static KEY = 'Psyanim FOV Sensor Test';

    constructor() {

        super(PsyanimFOVSensorTest.KEY);
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // create player
        this._player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, 
            width: 40, height: 20, 
            radius: 12, 
            color: 0x0000ff
        });

        this._player.addComponent(PsyanimPlayerController);
        
        this._fovSensor = this._player.addComponent(PsyanimFOVSensor);
        this._fovSensorRenderer = this._player.addComponent(PsyanimFOVRenderer);

        this._fovSensorRenderer.fovSensor = this._fovSensor;

        // add some static objects into the scene
        this._box = this.addEntity('box', 700, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 50, height: 125,
            color: 0xffff00            
        },
        {
            isStatic: true
        });
    }

    update(t, dt) {

        super.update(t, dt);

        let entitiesInSight = this._fovSensor.getEntitiesInSight([this._box]);

        console.log("found " + entitiesInSight.length + " entities in sight!");

        console.log(entitiesInSight);
    }
}