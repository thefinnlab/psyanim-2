import PsyanimComponent from '../core/PsyanimComponent.js';

import {
    PsyanimDebug,
    PsyanimUtils
} from 'psyanim-utils';

export default class PsyanimJsPsychTrialSelector extends PsyanimComponent {

    trialIDs;

    constructor(entity) {

        super(entity);

        this.trialIDs = [];

        this._usedTrialIDs = this.scene.registry.get('psyanimTrialSelector_usedTrialIDs');

        if (!this._usedTrialIDs)
        {
            this._usedTrialIDs = [];
            this.scene.registry.get('psyanimTrialSelector_usedTrialIDs', this._usedTrialIDs);
        }

        this._trialMetadata = this.scene.registry.get('psyanim_trialMetadata');
        this._animationData = this.scene.registry.get('psyanim_animationData');
    }

    afterCreate() {

        super.afterCreate();

        if (this.trialIDs.length == 0)
        {
            PsyanimDebug.error('No trial IDs configured for selector!');
        }
    }

    getTrialData() {

        let availableTrialMetadata = this._trialMetadata.filter(t => {
            return !this._usedTrialIDs.includes(t.id)
        });

        let trialMetadataIndex = PsyanimUtils.getRandomInt(0, availableTrialMetadata.length - 1);

        let trialID = availableTrialMetadata[trialMetadataIndex].id;

        PsyanimDebug.log('playing back trial ID: ' + trialID);

        this._usedTrialIDs.push(trialID);

        let trialMetadata = this._trialMetadata.find(doc => doc.id === trialID).data;

        return {
            trialMetadata: trialMetadata,
            animationData: this._animationData
        };
    }

    update(t, dt) {
        
        super.update(t, dt);
    }
}