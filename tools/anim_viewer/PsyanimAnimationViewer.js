import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimAnimationPlayer from '../../src/core/components/utils/PsyanimAnimationPlayer';

import PsyanimFirebaseClient from '../../src/core/components/networking/PsyanimFirebaseClient';

export default class PsyanimAnimationViewer extends PsyanimScene {

    constructor() {

        super('Psyanim Animation Viewer');
    }

    create() {

        super.create();

        // setup scene controls
        this._sceneControls = this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity;

        this._firebaseClient = this._sceneControls.addComponent(PsyanimFirebaseClient);

        // add agent with playback component
        let agent = this.addEntity('agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        this._animationPlayer = agent.addComponent(PsyanimAnimationPlayer);

        // query db for available animation clips
        this._firebaseClient.getAllAnimationClipAsync((clipData) => {

            this._clipData = clipData;

            this._setupViewerControls();
        });
    }

    // TODO: rename this - it's no longer part of an experiment!
    _setupViewerControls() {

        // setup experiment controls
        let viewerControlsElement = document.getElementById('experiment-controls');

        // setup our document selector element
        let selectElement = document.createElement('select');
        selectElement.id = 'documentSelector';
        
        viewerControlsElement.appendChild(selectElement);

        for (let i = 0; i < this._clipData.length; ++i)
        {
            let option = document.createElement('option');
            option.value = this._clipData[i].id;
            option.text = this._clipData[i].id;
            selectElement.appendChild(option);
        }

        console.log("initial selected doc id: " + selectElement.value);

        this._playAnimation(selectElement.value);

        selectElement.addEventListener('change', (event) => {

            console.log("selected doc id: " + event.target.value);

            this._playAnimation(event.target.value);
        });
    }

    _playAnimation(id) {

        let clipObj = this._clipData.find((clipObj) => clipObj.id == id);

        console.log("playing clip for clip ID: " + clipObj.id);

        let clip = clipObj.clip;

        this._animationPlayer.play(clip);
    }
}