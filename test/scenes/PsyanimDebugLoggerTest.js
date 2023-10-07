import PsyanimDebug from "../../src/core/utils/PsyanimDebug.js";
import PsyanimScene from "../../src/core/PsyanimScene.js";

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

// import firebaseConfig from '../data/firebase.config.json';
// import PsyanimFirebaseClient from "../../src/integrations/PsyanimFirebaseClient";
// import PsyanimFirebaseLogger from "../../src/integrations/PsyanimFirebaseLogger";

export default class PsyanimDebugLoggerTest extends PsyanimScene {

    static KEY = 'Psyanim Debug Logger Test';

    constructor() {

        super(PsyanimDebugLoggerTest.KEY);
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // let firebaseClient = new PsyanimFirebaseClient(firebaseConfig);

        // PsyanimDebug.logger = new PsyanimFirebaseLogger(PsyanimApp.Instance.sessionID, firebaseClient);

        this._keys = {
            U: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U),
            I: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            O: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)
        }
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.U))
        {
            PsyanimDebug.log('MESSAGE: hello PsyanimDebug!');
        }

        if (Phaser.Input.Keyboard.JustDown(this._keys.I))
        {
            PsyanimDebug.warn("WARN: you've been warned!");            
        }

        if (Phaser.Input.Keyboard.JustDown(this._keys.O))
        {
            PsyanimDebug.error('ERROR: Not a real error - just a test!');            
        }
    }
}