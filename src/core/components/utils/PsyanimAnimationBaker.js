import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimAnimationClip from '../../../utils/PsyanimAnimationClip.mjs';

export default class PsyanimAnimationBaker extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this._clip = new PsyanimAnimationClip();
    }

    update(t, dt) {

        super.update(t, dt);

        this._clip.addSample(t, this.entity.position, this.entity.rotation);
    }

    bake() {

        return this._clip.clone();
    }
}