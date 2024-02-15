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
            if (!this.scene.registry.has('psyanimTrialSelector_lastTrialIndex'))
            {
                this.scene.registry.set('psyanimTrialSelector_lastTrialIndex', 0);
            }
        }

        this._trialMetadata = this.scene.registry.get('psyanim_trialMetadata')
            .filter(t => trialIDs.includes(t.id));

        this._animationData = this.scene.registry.get('psyanim_animationData');
    }

    _getNextTrialIndexRandomized() {

        let availableTrialMetadata = this._trialMetadata.filter(t => {
            return !this._usedTrialIDs.includes(t.id)
        });

        let trialMetadataIndex = PsyanimUtils.getRandomInt(0, availableTrialMetadata.length - 1);

        return trialMetadataIndex;
    }

    _getNextTrialIndex() {

        let lastTrialIndex = this.scene.registry.get('psyanimTrialSelector_lastTrialIndex');

        let nextTrialIndex = lastTrialIndex + 1;

        this.scene.registry.set('psyanimTrialSelector_lastTrialIndex', nextTrialIndex);

        return nextTrialIndex;
    }

    getTrialData() {

        if (!this._trialMetadata)
        {
            // lazy load it b.c. experiment manager calls it from afterCreate()
            this._getTrialData();
        }

        let trialMetadataIndex = -1;
        
        if (this.randomizeTrialOrder)
        {
            trialMetadataIndex = this._getNextTrialIndexRandomized();
        }
        else
        {
            trialMetadataIndex = this._getNextTrialIndex();
        }

        let trialID = availableTrialMetadata[trialMetadataIndex].id;

        this._currentTrialJsPsychData['trialID'] = trialID;

        PsyanimDebug.log('playing back trial ID: ' + trialID);

        this._usedTrialIDs.push(trialID);

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