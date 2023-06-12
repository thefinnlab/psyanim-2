import { WebSocketServer } from "ws";
import test_animation_clip from "./test_animation_clip.mjs";

const wss = new WebSocketServer({ port: 4000 });

wss.on('connection', (ws) => {

    ws.binaryType = 'arraybuffer';

    ws.on('error', console.error);

    ws.on('message', (data) => {

        ws.send('server got your message!');

        let clip = new test_animation_clip();

        clip.loadSamplesFromBuffer(data);

        console.log(clip.samples);
    });
});

console.log("server started...");