import PsyanimScene from "../../core/scene/PsyanimScene";

import PsyanimSceneTitle from "../../core/components/ui/PsyanimSceneTitle";
import PsyanimPhysicsSettingsController from "../../core/components/controllers/PsyanimPhysicsSettingsController";
import PsyanimSceneChangeController from "../../core/components/controllers/PsyanimSceneController";

import PsyanimMouseFollowTarget from "../../core/components/controllers/PsyanimMouseFollowTarget";

export default class PredatorTest extends PsyanimScene {

    static KEY = 'Predator Test';

    constructor() {

        super(PredatorTest.KEY);
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // setup mouse follow target
        let mouseTarget = this.addEntity('mouseFollowTarget', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0x00ff00
        });

        mouseTarget.addComponent(PsyanimMouseFollowTarget, { radius: 4 });

        
    }
}