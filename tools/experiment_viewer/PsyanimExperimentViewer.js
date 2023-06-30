import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimFirebaseClient from '../../src/core/components/networking/PsyanimFirebaseClient';

import PsyanimExperimentPlayer from '../../src/core/components/experiments/PsyanimExperimentPlayer';

export default class PsyanimExperimentViewer extends PsyanimScene {

    constructor() {

        super('Psyanim Experiment Viewer');
    }

    create() {

        super.create();

        // setup scene controls
        this._sceneControls = this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity;

        this._experimentPlayer = this._sceneControls.addComponent(PsyanimExperimentPlayer);
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

        // console.log('selected experiment id = ' + docId);

        let doc = this._docs.find(d => d.id == docId);

        console.log(doc.data());

        this._loadExperimentDataAsync(doc.id);
    }

    _loadExperimentDataAsync(docId) {

        this._currentExperimentDoc = this._docs.find(d => d.id == docId).data();

        let agentMetadata = this._currentExperimentDoc.data.agentMetadata;

        let clipIDs = [];

        for (let i = 0; i < agentMetadata.length; ++i)
        {
            let metadata = agentMetadata[i];

            clipIDs.push(metadata.animationClipId);
        }

        this._firebaseClient.getAnimationClipsByIdAsync(clipIDs)
            .then((clipData) => {

                this._clipData = clipData;

                // console.log("received animation clips length = " + this._clipData.length);

                console.log(this._clipData);

                this._runExperiment();
            });

        // console.log("querying for clip IDs: " + JSON.stringify(clipIDs));
    }

    _runExperiment() {

        console.log("setting up experiment...");

        this._experimentPlayer.loadExperiment(this._currentExperimentDoc.data, this._clipData);
    }
}