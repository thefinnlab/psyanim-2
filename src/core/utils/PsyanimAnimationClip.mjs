import PsyanimMessaging from "./PsyanimMessaging.mjs";

// sampleLength is number of floats necessary to represent a sample
PsyanimAnimationClip.SAMPLE_LENGTH = 4;

export default class PsyanimAnimationClip {

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

    static fromArray(data) {

        let nSamples = data.length / PsyanimAnimationClip.SAMPLE_LENGTH;

        let clip = new PsyanimAnimationClip();

        for (let i = 0; i < nSamples; ++i)
        {
            let offset = i * PsyanimAnimationClip.SAMPLE_LENGTH;

            let t = data[offset];
            let position = { x: data[offset + 1], y: data[offset + 2] };
            let rotation = data[offset + 3];

            clip.addSample(t, position, rotation);
        }

        return clip;
    }

    static fromJsonArray(data) {

        let floatArray = JSON.parse(data);

        return PsyanimAnimationClip.fromArray(floatArray);
    }

    toBuffer() {

        console.error("TODO: needs to return a PsyanimFloat32ArrayMessage!");

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

        return Buffer.from(data.buffer);
    }

    toArray() {

        let nSamples = this._transformData.length;

        let data = [];

        for (let i = 0; i < nSamples; ++i)
        {
            let transform = this._transformData[i];

            let offset = PsyanimAnimationClip.SAMPLE_LENGTH * i;

            data[offset] = transform.t;
            data[offset + 1] = transform.x;
            data[offset + 2] = transform.y;
            data[offset + 3] = transform.rotation;
        }

        return data;
    }

    toJsonArray() {

        return JSON.stringify(this.toArray());
    }

    addSample(time, position, rotation) {

        this._transformData.push({
            t: time,
            x: position.x,
            y: position.y,
            rotation: rotation
        });
    }

    clear() {

        this._transformData = [];
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