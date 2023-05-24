import Phaser from 'phaser';

export default class PsyanimAnimationClip {

    constructor() {

        this._transformData = [];
    }

    static fromJson() {

        console.error("TODO: implement!");
    }

    addSample(time, position, rotation) {

        this._transformData.push({
            t: time,
            pos: position,
            rot: rotation
        });
    }

    getSample(index) {

        let sample = this._transformData[index];

        return {
            t: sample.t,
            pos: sample.pos,
            rot: sample.rot
        };
    }

    getSampleCount() {

        return this._transformData.length;
    }

    getFileSize() {

        let jsonData = JSON.stringify(this._transformData);

        return jsonData.length;
    }

    clone() {

        let clone = new PsyanimAnimationClip();

        clone._transformData = this._transformData.slice();

        return clone;
    }
}