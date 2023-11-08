import Phaser from 'phaser';

import PsyanimComponent from '../core/PsyanimComponent.js';

import PsyanimAnimationPlayer from '../core/components/utils/PsyanimAnimationPlayer.js';

export default class PsyanimJsPsychExperimentPlayer extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this.events = new Phaser.Events.EventEmitter();

        this._entities = [];
    }

    afterCreate() {

        super.afterCreate();
    }

    clear() {

        let entityNames = this._entities.map(e => e.name);

        entityNames.forEach(name => {
            this.scene.destroyEntityByName(name);
        });

        this._entities = [];
    }

    hasAnimationClips(experimentMetadata) {

        let agentMetadata = experimentMetadata.agentMetadata;

        for (let i = 0; i < agentMetadata.length; ++i)
        {
            if (Object.hasOwn(agentMetadata[i], 'animationClipId'))
            {
                return true;
            }
        }

        return false;
    }

    loadExperiment(trialPlaybackData) {

        let trialPlaybackInfo = trialPlaybackData.trialPlaybackInfo;
        let trialMetadata = trialPlaybackData.trialMetadata;
        let animationClipData = trialPlaybackData.animationClipData;

        this.clear();

        if (!this.hasAnimationClips(trialMetadata))
        {
            console.warn('Current trial has no animation clips!');
        }

        this._playbackComplete = false;

        let agentMetadata = trialMetadata.agentMetadata;

        for (let i = 0; i < agentMetadata.length; ++i)
        {
            let metadata = agentMetadata[i];

            if (trialPlaybackInfo.excludeAgents.includes(metadata.name))
            {
                continue;
            }

            let animationClipID = metadata.animationClipId;

            if (!animationClipID)
            {
                continue;
            }

            let shapeParams = metadata.shapeParams;

            let agent = this.scene
                .addEntity(metadata.name, 0, 0, shapeParams);

            let agentAnimData = animationClipData.find(ac => ac.id == animationClipID);

            if (!agentAnimData)
            {
                console.error("ERROR: could not find animClip ID: " + animationClipID + " for agent named: " + agent.name);
            }

            let animPlayer = agent.addComponent(PsyanimAnimationPlayer);

            animPlayer.events.on('playbackComplete', this._handlePlaybackComplete.bind(this));

            animPlayer.play(agentAnimData.clip);

            this._entities.push(agent);
        }

        if (this._entities.length == 0)
        {
            console.error('Trial has no entities configured for playback: ', trialPlaybackInfo.trialID);
        }
    }

    _handlePlaybackComplete() {

        if (!this._playbackComplete)
        {
            this._playbackComplete = true;

            this.clear();

            this.events.emit('playbackComplete');
        }
    }

    update(t, dt) {

        super.update(t, dt);
    }
}