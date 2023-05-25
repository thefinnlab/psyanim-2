import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimAnimationPlayer extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this._clip = null;
        
        this.events = new Phaser.Events.EventEmitter();
    }

    play(animationClip) {

        this._clip = animationClip;
        this._currentIndex = 0;
        this._nSamples = animationClip.getSampleCount();

        this.entity.setPhysicsEnabled(false);
    }

    update(t, dt) {

        super.update(t, dt);

        if (this._clip != null)
        {
            if (this._currentIndex < this._nSamples)
            {
                let currentSample = this._clip.getSample(this._currentIndex);

                this.entity.position = currentSample.pos;
                this.entity.rotation = currentSample.rot;

                this._currentIndex++;
            }
            else
            {
                this._clip = null;

                this.entity.setPhysicsEnabled(true);

                this.events.emit('playbackComplete');
            }
        }
    }
}