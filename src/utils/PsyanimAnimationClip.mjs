export default class PsyanimAnimationClip {

    // sampleLength is number of floats necessary to represent a sample
    static SAMPLE_LENGTH = 4;

    constructor() {

        this._transformData = [];
    }

    static fromBuffer(buffer) {

        let data = new  Float32Array(buffer);

        let clip = new PsyanimAnimationClip();

        let nSamples = data.length / PsyanimAnimationClip.SAMPLE_LENGTH;

        for (let i = 0; i < nSamples; ++i)
        {
            clip._transformData.push({

                t: data[PsyanimAnimationClip.SAMPLE_LENGTH * i],

                x: data[PsyanimAnimationClip.SAMPLE_LENGTH * i + 1], 
                y: data[PsyanimAnimationClip.SAMPLE_LENGTH * i + 2],

                rotation: data[PsyanimAnimationClip.SAMPLE_LENGTH * i + 3]
            });
        }

        return clip;
    }

    toFloat32Array() {

        let nSamples = this._transformData.length;
        let data = new Float32Array(nSamples * PsyanimAnimationClip.SAMPLE_LENGTH);

        for (let i = 0; i < nSamples; ++i)
        {
            let transform = this._transformData[i];

            // we store data in this order: t, x, y, angle
            data[PsyanimAnimationClip.SAMPLE_LENGTH * i] = transform.t;
            data[PsyanimAnimationClip.SAMPLE_LENGTH * i + 1] = transform.x;
            data[PsyanimAnimationClip.SAMPLE_LENGTH * i + 2] = transform.y;
            data[PsyanimAnimationClip.SAMPLE_LENGTH * i + 3] = transform.rotation;
        }

        return data;
    }

    toBuffer() {

        return Buffer.from(this.toFloat32Array().buffer);
    }

    addSample(time, position, rotation) {

        this._transformData.push({
            t: time,
            x: position.x,
            y: position.y,
            rotation: rotation
        });
    }

    getSample(index) {

        let sample = this._transformData[index];

        return {
            t: sample.t,
            x: sample.x,
            y: sample.y,
            rotation: sample.rotation
        };
    }

    getSampleCount() {

        return this._transformData.length;
    }

    clone() {

        let clone = new PsyanimAnimationClip();

        clone._transformData = this._transformData.slice();

        return clone;
    }
}