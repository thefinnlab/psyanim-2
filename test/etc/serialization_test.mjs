import fs from 'fs';
import test_animation_clip from './test_animation_clip.mjs';

let nAgents = 2;
let nSeconds = 8;
let nSamples = nSeconds * 60;

for (let i = 0; i < nAgents; ++i)
{
    let clip = new test_animation_clip();

    clip.generateTestSamples(nSamples);

    clip.saveToFileSync('./src/test/data/agent' + i + '.json');
}

for (let i = 0; i < nAgents; ++i)
{
    fs.readFile('./src/test/data/agent' + i + '.json', (err, data) => {

        if (err)
        {
            console.error(err);
        }

        if (!ArrayBuffer.isView(data))
        {
            console.error("ERROR: data isn't a TypedArray!");
        }

        let clip = new test_animation_clip();

        clip.loadSamplesFromBuffer(data.buffer);

        console.log(clip.samples);

        let success = true;
    
        for (let j = 0; j < nSamples; ++j)
        {
            let sample = {
                x: clip.samples[3 * j],
                y: clip.samples[3 * j + 1],
                angle: clip.samples[3 * j + 2]
            };
    
            if (sample.x != j + 10 ||
                sample.y != j + 20 ||
                sample.angle != j + 30)
            {
                success = false;
                console.error('found bad sample: ' + JSON.stringify(sample) + ' at j = ' + j);
            }
        }
    
        if (success == true)
        {
            console.log("SUCCESS: ALL THE DATA LOOKS GREAT!");
        }
        else
        {
            console.error("ERROR: DATA IS CORRUPTED!");
        }
    });
}