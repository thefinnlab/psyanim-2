import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimSceneTitle from "../../src/core/components/ui/PsyanimSceneTitle";
import PsyanimPhysicsSettingsController from "../../src/core/components/controllers/PsyanimPhysicsSettingsController";
import PsyanimSceneChangeController from "../../src/core/components/controllers/PsyanimSceneController";

import PsyanimFOVSensor from "../../src/core/components/physics/PsyanimFOVSensor";
import PsyanimFOVRenderer from "../../src/core/components/rendering/PsyanimFOVRenderer";

import PsyanimConstants from "../../src/core/PsyanimConstants";
import PsyanimPlayerController from "../../src/core/components/controllers/PsyanimPlayerController";

export default class FOVSensorTest extends PsyanimScene {

    static KEY = 'FOV Sensor Test';

    constructor() {

        super(FOVSensorTest.KEY);
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
        this._fovSensor.fovAngle = 120;
        this._fovSensor.fovRange = 200;

        this._fovSensorRenderer = this._player.addComponent(PsyanimFOVRenderer);
        this._fovSensorRenderer.fovSensor = this._fovSensor;

        // add some static objects into the scene
        this._box = this.addEntity('box', 700, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 10, height: 15,
            color: 0xffff00            
        },
        {
            isStatic: true
        });
    }

    update(t, dt) {

        super.update(t, dt);

        let entitiesInSight = this._fovSensor.getEntitiesInSight([this._box]);

        if (entitiesInSight.length != 0)
        {
            console.log("found " + entitiesInSight.length + " entities!");

            if (entitiesInSight.includes(this._box))
            {
                entitiesInSight[0].setTint(0x00ff00);
            }
            else
            {
                this._box.setTint(0xffffff);
            }
        }
        else
        {
            this._box.setTint(0xffffff);
        }
    }
}