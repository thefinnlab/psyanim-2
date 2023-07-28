import fs from 'fs';

export default class test_animation_clip
{
    constructor() {

        this._samples = null;
    }

    loadSamplesFromBuffer(buffer) {

        this._samples = new Float32Array(buffer);
    }

    generateTestSamples(nSamples) {

        this._samples = new Float32Array(nSamples * 3);

        for (let j = 0; j < nSamples; ++j)
        {
            let sample = {
                x: j + 10,
                y: j + 20,
                angle: j + 30,
            };

            this._samples[3 * j] = sample.x;
            this._samples[3 * j + 1] = sample.y;
            this._samples[3 * j + 2] = sample.angle;
        }
    }

    saveToFileSync(filePath) {

        // write file
        fs.writeFileSync(filePath, this.buffer, (err) => {
            if (err)
            {
                console.error(err);
            }

            console.log("file written successfully!");
        });
    }

    get buffer() {

        return Buffer.from(this._samples.buffer);
    }

    get samples() {

        return this._samples;
    }
}