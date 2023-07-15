import PsyanimAnimationClip from '../../utils/PsyanimAnimationClip.mjs';
import PsyanimMessaging from '../../utils/PsyanimMessaging.mjs';
import fs from 'fs';

const fps = 60;
const nSeconds = 8;

const generateTestSamples = (clip, nSamples) => {

    for (let j = 0; j < nSamples; ++j)
    {
        let sample = {
            t: j,
            x: j + 10,
            y: j + 20,
            rotation: j + 30,
        };

        clip.addSample(sample.t, { x: sample.x, y: sample.y }, sample.rotation);
    }
};

const validateAnimationTestData = (clip) => {

    let nSamples = clip.getSampleCount();

    expect(nSamples).toBe(nSeconds * fps);

    for  (let i = 0; i < nSamples; ++i)
    {
        let sample = clip.getSample(i);

        expect(sample.t).toBe(i);
        expect(sample.x).toBe(i + 10);
        expect(sample.y).toBe(i + 20);
        expect(sample.rotation).toBe(i + 30);
    }
};

// describe('serialization test', () => {
//     it('verify we can serialize / deserialize animation data w/o corruption', () => {

//         let testFilePath = './src/test/data/anim_test_clip.psyanim';

//         let fps = 60;
//         let nSeconds = 8;
//         let nSamples = nSeconds * fps;

//         let originalClip = new PsyanimAnimationClip();

//         generateTestSamples(originalClip, nSamples);

//         validateAnimationTestData(originalClip);

//         fs.writeFileSync(testFilePath, originalClip.toBuffer());

//         let serializedClipData = fs.readFileSync(testFilePath);

//         if (!ArrayBuffer.isView(serializedClipData))
//         {
//             expect(false).withContext("ERROR: data isn't an array buffer!").toBe(true);
//         }

//         expect(PsyanimMessaging.getHeader(serializedClipData.buffer))
//             .toBe(PsyanimMessaging.MESSAGE_TYPES.ANIMATION_CLIP);

//         let newClip = PsyanimAnimationClip.fromBuffer(serializedClipData.buffer);

//         validateAnimationTestData(newClip);
//     });
// });