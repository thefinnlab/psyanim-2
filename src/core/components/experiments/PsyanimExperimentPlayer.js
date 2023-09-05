import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimAnimationPlayer from '../utils/PsyanimAnimationPlayer';

export default class PsyanimExperimentPlayer extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this._agents = [];
    }

    loadExperiment(experimentMetadata, animationClipData) {

        this.reset();

        let agentMetadata = experimentMetadata.agentMetadata;

        for (let i = 0; i < agentMetadata.length; ++i)
        {
            let metadata = agentMetadata[i];

            let animationClipID = metadata.animationClipId;
            let shapeParams = metadata.shapeParams;

            let agent = this.scene.addEntity('trial_' + experimentMetadata.trialNumber + '_' + metadata.name, 0, 0, shapeParams);

            let agentAnimData = animationClipData.find(ac => ac.id == animationClipID);

            if (!agentAnimData)
            {
                console.error("ERROR: could not find animClip ID: " + animationClipID + " for agent named: " + agent.name);
            }

            let animPlayer = agent.addComponent(PsyanimAnimationPlayer);

            animPlayer.play(agentAnimData.clip);

            this._agents.push(agent);
        }
    }

    reset() {

        for (let i = 0; i < this._agents.length; ++i)
        {
            this.scene.destroyEntityByName(this._agents[i].name);
        }

        this._agents = [];
    }

    update(t, dt) {

    }
}