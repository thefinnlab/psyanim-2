import WebSocket from 'ws';

import test_animation_clip from './test_animation_clip.mjs';

const ws = new WebSocket('ws://localhost:4000');

ws.on('error', console.error);

ws.on('open', () => {

    console.log("connection opened!");

    let nSeconds = 8;
    let nSamples = nSeconds * 60;    

    let clip = new test_animation_clip();

    clip.generateTestSamples(nSamples);

    ws.send(clip.buffer);
});

ws.on('message', (data) => {
    console.log('received msg: ' + data.toString());
});