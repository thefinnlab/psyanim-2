export default class PsyanimAnimationClip {

    constructor() {

        this._transformData = [];
    }

    static fromBuffer(buffer) {

        let data = new  Float32Array(buffer);

        let clip = new PsyanimAnimationClip();

        for (let i = 0; i < nSamples; ++i)
        {
            clip._transformData.push({

                t: data[nSamples * i],

                x: data[nSamples * i + 1], 
                y: data[nSamples * i + 2],

                rotation: data[nSamples[i] + 3]
            });
        }

        return clip;
    }

    toFloat32Array() {

        // sampleLength is number of floats necessary to represent a sample
        const sampleLength = 3;

        let nSamples = this._transformData.length;
        let data = new Float32Array(nSamples * sampleLength);

        for (let i = 0; i < nSamples; ++i)
        {
            let transform = this._transformData[i];

            // we store data in this order: t, x, y, angle
            data[sampleLength * i] = transform.t;
            data[sampleLength * i + 1] = transform.pos.x;
            data[sampleLength * i + 2] = transform.pos.y;
            data[sampleLength * i + 3] = transform.rot;
        }
    }

    toBuffer() {

        return Buffer.from(this.toFloat32Array().Buffer);
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