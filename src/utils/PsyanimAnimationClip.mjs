import PsyanimMessaging from "./PsyanimMessaging.mjs";

export default class PsyanimAnimationClip {

    // sampleLength is number of floats necessary to represent a sample
    static SAMPLE_LENGTH = 4;

    constructor() {

        this._transformData = [];
    }

    static fromBuffer(buffer) {

        let header = PsyanimMessaging.getHeader(buffer);

        if (header != PsyanimMessaging.MESSAGE_TYPES.ANIMATION_CLIP)
        {
            console.error("ERROR: invalid animation clip header = " + header);
        }

        let data = new Float32Array(buffer);

        let clip = new PsyanimAnimationClip();

        let nSamples = (data.length - PsyanimMessaging.MESSAGE_HEADER_LENGTH) / PsyanimAnimationClip.SAMPLE_LENGTH;

        for (let i = 0; i < nSamples; ++i)
        {
            let offset = PsyanimMessaging.MESSAGE_HEADER_LENGTH + PsyanimAnimationClip.SAMPLE_LENGTH * i;

            clip._transformData.push({

                t: data[offset],

                x: data[offset + 1], 
                y: data[offset + 2],

                rotation: data[offset + 3]
            });
        }

        return clip;
    }

    toFloat32Array() {

        let nSamples = this._transformData.length;

        let data = new Float32Array(PsyanimMessaging.MESSAGE_HEADER_LENGTH + 
            nSamples * PsyanimAnimationClip.SAMPLE_LENGTH);

        PsyanimMessaging.setHeader(data.buffer, PsyanimMessaging.MESSAGE_TYPES.ANIMATION_CLIP);

        for (let i = 0; i < nSamples; ++i)
        {
            let transform = this._transformData[i];

            let offset = PsyanimMessaging.MESSAGE_HEADER_LENGTH + PsyanimAnimationClip.SAMPLE_LENGTH * i;

            // we store data in this order: t, x, y, angle
            data[offset] = transform.t;
            data[offset + 1] = transform.x;
            data[offset + 2] = transform.y;
            data[offset + 3] = transform.rotation;
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