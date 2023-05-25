import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimWanderBehavior from '../../core/components/steering/PsyanimWanderBehavior';
import PsyanimWanderAgent from '../../core/components/steering/agents/PsyanimWanderAgent';
import PsyanimSeekBehavior from '../../core/components/steering/PsyanimSeekBehavior';

import PsyanimConstants from '../../core/PsyanimConstants';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../core/components/ui/PsyanimSceneTitle';

export default class HTMLCaptureStreamTest extends PsyanimScene {

    constructor() {

        super('HTMLCaptureStreamTest');
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        this._keys = {
            C: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
            V: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V)
        };

        let nAgents = 5;

        for (let i = 0; i < nAgents; ++i)
        {
            let deltaX = (Math.random() * 2 - 1) * 350;
            let deltaY = (Math.random() * 2 - 1) * 250;

            let agent = this.addEntity('agent' + i, 400 + deltaX, 300 + deltaY, {
                textureKey: 'wanderTestRectangle',
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 16, altitude: 32, 
                color: 0xffc0cb            
            });
    
            let wanderVehicle = agent.addComponent(PsyanimVehicle);

            let seek = agent.addComponent(PsyanimSeekBehavior);

            let wander = agent.addComponent(PsyanimWanderBehavior);   
            wander.vehicle = wanderVehicle;
            
            wander.maxSpeed = 3;
            wander.radius = 50;
            wander.maxAngleChangePerFrame = 20;

            wander.seekBehavior = seek;

            let wanderAgent = agent.addComponent(PsyanimWanderAgent);
            wanderAgent.vehicle = wanderVehicle;
            wanderAgent.wanderBehavior = wander;
        }

        let chunks = [];

        let canvas_stream = this.game.canvas.captureStream(60);

        this.media_recorder = new MediaRecorder(canvas_stream, {mimeType: "video/webm"});

        this.media_recorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };

        this.media_recorder.onstop = () => {

            let myBlob = new Blob(chunks, { type: "video/webm" });

            // console.log(blob);

            let blobUrl = URL.createObjectURL(myBlob);

            let link = document.createElement("a");
            link.href = blobUrl;
            link.download = "aDefaultFileName.txt";
            link.innerHTML = "Click here to download vid!";
            document.body.appendChild(link);

            // let xhr = new XMLHttpRequest();
            // xhr.open("POST", "/data", true);
            // xhr.setRequestHeader('Content-type','video/webm');
            // xhr.send(blob);
        };
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.C))
        {
            this.media_recorder.start();
        }
        
        if (Phaser.Input.Keyboard.JustDown(this._keys.V))
        {
            this.media_recorder.stop();
        }
    }
}