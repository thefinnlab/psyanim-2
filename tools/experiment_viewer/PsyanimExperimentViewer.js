import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimFirebaseClient from '../../src/core/components/networking/PsyanimFirebaseClient';

export default class PsyanimExperimentViewer extends PsyanimScene {

    constructor() {

        super('Psyanim Experiment Viewer');
    }

    create() {

        super.create();

        // setup scene controls
        this._sceneControls = this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity;

        this._firebaseClient = this._sceneControls.addComponent(PsyanimFirebaseClient);

        // query db for available animation clips
        this._firebaseClient.getAllExperimentMetadataAsync((docs) => {

            console.log(docs);

            this._docs = docs;

            this._setupViewerControls();
        });
    }

    _setupViewerControls() {

        let viewerControlsElement = document.getElementById('experiment-controls');

        let selectElement = document.createElement('select');
        selectElement.id = 'experimentSelector';

        viewerControlsElement.appendChild(selectElement);

        for (let i = 0; i < this._docs.length; ++i)
        {
            let option = document.createElement('option');
            option.value = this._docs[i].id;
            option.text = this._docs[i].id;

            selectElement.appendChild(option);
        }

        this._loadExperimentDataAsync(selectElement.value);

        selectElement.addEventListener('change', (event) => {
            this._handleNewDocumentSelected(event.target.value);
        });
    }

    _handleNewDocumentSelected(docId) {

        console.log('selected experiment id = ' + docId);

        let doc = this._docs.find(d => d.id == docId);

        console.log(doc.data());

        this._loadExperimentDataAsync(doc.id);
    }

    _loadExperimentDataAsync(docId) {

        this._currentDoc = this._docs.find(d => d.id == docId).data();

        let agentMetadata = this._currentDoc.data.agentMetadata;

        let clipIDs = [];

        for (let i = 0; i < agentMetadata.length; ++i)
        {
            let metadata = agentMetadata[i];

            clipIDs.push(metadata.animationClipId);
        }

        this._firebaseClient.getAnimationClipsByIdAsync(clipIDs)
            .then((clips) => {

                this._clips = clips;
                console.log("received animation clips length = " + this._clips.length);
                console.log(this._clips);
            });

        console.log("querying for clip IDs: " + JSON.stringify(clipIDs));
    }
}