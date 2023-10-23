import PsyanimComponent from '../core/PsyanimComponent.js';

export default class PsyanimJsPsychExperimentPlaybackManager extends PsyanimComponent {

    trialSelector;
    experimentPlayer;

    constructor(entity) {

        super(entity);
    }

    afterCreate() {

        super.afterCreate();

        let nextTrialData = this.trialSelector.getTrialData();

        this.experimentPlayer.loadExperiment(
            nextTrialData.trialMetadata,
            nextTrialData.animationData
        );
    }

    update(t, dt) {
        
        super.update(t, dt);
    }
}