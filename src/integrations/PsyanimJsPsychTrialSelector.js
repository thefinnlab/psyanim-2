import PsyanimComponent from '../core/PsyanimComponent.js';

import {
    PsyanimDebug,
    PsyanimUtils
} from 'psyanim-utils';

export default class PsyanimJsPsychTrialSelector extends PsyanimComponent {

    trialInfo;

    randomizeTrialOrder;

    constructor(entity) {

        super(entity);

        this.randomizeTrialOrder = false;

        this._currentTrialJsPsychData = this.scene.registry.get('psyanimJsPsychPlugin_trialData');
    }

    _getTrialData() {

        let trialIDs = this.trialInfo.map(info => info.trialID);

        if (trialIDs.length == 0)
        {
            PsyanimDebug.error('No trial IDs configured for selector!');
        }

        this._usedTrialIDs = this.scene.registry.get('psyanimTrialSelector_usedTrialIDs');

        if (this.randomizeTrialOrder)
        {
            if (!this._usedTrialIDs)
            {
                // reference to '_usedTrialIDs' *is* the reference pointed at by the phaser registry
                this._usedTrialIDs = [];
                this.scene.registry.set('psyanimTrialSelector_usedTrialIDs', this._usedTrialIDs);
            }    
        }
        else
        {
            if (!this.scene.registry.has('psyanimTrialSelector_nextTrialIndex'))
            {
                this.scene.registry.set('psyanimTrialSelector_nextTrialIndex', 0);
            }
        }

        this._trialMetadata = this.scene.registry.get('psyanim_trialMetadata')
            .filter(t => trialIDs.includes(t.id));

        this._animationData = this.scene.registry.get('psyanim_animationData');
    }

    _getNextTrialIDRandomized() {

        let availableTrialMetadata = this._trialMetadata.filter(t => {
            return !this._usedTrialIDs.includes(t.id)
        });

        let trialMetadataIndex = PsyanimUtils.getRandomInt(0, availableTrialMetadata.length - 1);

        return availableTrialMetadata[trialMetadataIndex].id;
    }

    _getNextTrialID() {

        let nextTrialIndex = this.scene.registry.get('psyanimTrialSelector_nextTrialIndex');

        let trialID = this._trialMetadata[nextTrialIndex].id;

        this.scene.registry.set('psyanimTrialSelector_nextTrialIndex', nextTrialIndex + 1);

        return trialID;
    }

    getTrialData() {

        if (!this._trialMetadata)
        {
            // lazy load it b.c. experiment manager calls it from afterCreate()
            this._getTrialData();
        }

        let trialID = null;

        if (this.randomizeTrialOrder)
        {
            trialID = this._getNextTrialIDRandomized();

            this._usedTrialIDs.push(trialID);
        }
        else
        {
            trialID = this._getNextTrialID();
        }

        this._currentTrialJsPsychData['trialID'] = trialID;

        PsyanimDebug.log('playing back trial ID: ' + trialID);

        let trialMetadata = this._trialMetadata.find(doc => doc.id === trialID).data;

        let trialPlaybackInfo = this.trialInfo.find(info => info.trialID === trialID);

        return {
            trialPlaybackInfo: trialPlaybackInfo,
            trialMetadata: trialMetadata,
            animationClipData: this._animationData
        };
    }

    update(t, dt) {
        
        super.update(t, dt);
    }
}