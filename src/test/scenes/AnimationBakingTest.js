import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

import PsyanimFleeBehavior from '../../core/components/steering/PsyanimFleeBehavior';
import PsyanimFleeAgent from '../../core/components/steering/agents/PsyanimFleeAgent';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../core/components/ui/PsyanimSceneTitle';

import PsyanimExperimentTimer from '../../core/components/utils/PsyanimExperimentTimer';

import PsyanimAnimationBaker from '../../core/components/utils/PsyanimAnimationBaker';
import PsyanimAnimationPlayer from '../../core/components/utils/PsyanimAnimationPlayer';

/**
 *  TODO: 
 *      
 *      - for now, animation baking will take place in memory only and generate an AnimationClip
 *      - once an animation clip is generated, it can be played back on any entity for video recording
 */

export default class AnimationBakingTest extends PsyanimScene {

    constructor() {

        super('Animation Baking Test');
    }

    create() {

        super.create();

        let experimentDuration = 8000;

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController).entity
            .addComponent(PsyanimExperimentTimer)
                .setOnTimerElapsed(experimentDuration, () => {

                    this.initPlayback();
        });

        // setup mouse follow target
        this.mouseTarget = this.addEntity('mouseFollowTarget', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0x00ff00
        });

        // add agents to this scene
        this.agent1 = this.addEntity('agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        this.agent2 = this.addEntity('agent2', 200, 150, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        });

        this.initSimulation();
    }
    
    initSimulation() {

                // add mouse follow target controller
                this.mouseTarget.addComponent(PsyanimMouseFollowTarget, { radius: 4 });

                // add vehicle components to our agents
                let vehicle1 = this.agent1.addComponent(PsyanimVehicle);
                let vehicle2 = this.agent2.addComponent(PsyanimVehicle);
        
                vehicle2.nSamplesForLookSmoothing = 10;
        
                // add flee behavior components to our agents
                let flee1 = this.agent1.addComponent(PsyanimFleeBehavior);
                let flee2 = this.agent2.addComponent(PsyanimFleeBehavior);
        
                flee1.maxSpeed = 6;
                flee1.maxSpeed = 5;
        
                // add flee agent component to our agents
                let fleeAgent1 = this.agent1.addComponent(PsyanimFleeAgent);
                let fleeAgent2 = this.agent2.addComponent(PsyanimFleeAgent);
        
                fleeAgent1.fleeBehavior = flee1;
                fleeAgent2.fleeBehavior = flee2;
        
                fleeAgent1.vehicle = vehicle1;
                fleeAgent2.vehicle = vehicle2;
        
                fleeAgent1.target = this.mouseTarget;
                fleeAgent2.target = this.mouseTarget;

                // add animation bakers to each agent
                this.mouseTarget.addComponent(PsyanimAnimationBaker);
                this.agent1.addComponent(PsyanimAnimationBaker);
                this.agent2.addComponent(PsyanimAnimationBaker);
    }

    initPlayback() {

        console.log("simulation complete - beginning playback!");

        // capture animation clips from bakers
        let agent1AnimationClip = this.agent1
            .getComponent(PsyanimAnimationBaker)
            .bake();

        let agent2AnimationClip = this.agent2
            .getComponent(PsyanimAnimationBaker)
            .bake();

        let mouseTargetAnimationClip = this.mouseTarget
            .getComponent(PsyanimAnimationBaker)
            .bake();

        console.log("mouseTarget animation clip file size = " + mouseTargetAnimationClip.getFileSize() + 
            ", sample count = " + mouseTargetAnimationClip.getSampleCount());

        console.log("agent 1 animation clip file size = " + agent1AnimationClip.getFileSize() + 
            ", sample count = " + agent1AnimationClip.getSampleCount());

        console.log("agent 2 animation clip file size = " + agent2AnimationClip.getFileSize() + 
            ", sample count = " + agent2AnimationClip.getSampleCount());

        // destroy all components on each entity
        this.agent1.getComponents().forEach(c => c.destroy());
        this.agent2.getComponents().forEach(c => c.destroy());
        this.mouseTarget.getComponents().forEach(c => c.destroy());

        // add the PsyanimAnimationPlayer component to playback your animation!
        this.agent1.addComponent(PsyanimAnimationPlayer)
            .play(agent1AnimationClip);

        this.agent2.addComponent(PsyanimAnimationPlayer)
            .play(agent2AnimationClip);

        this.mouseTarget.addComponent(PsyanimAnimationPlayer)
            .play(mouseTargetAnimationClip);
    }

    saveVideoToServer() {

        // TODO: replace message contents with the blob from ccapture
        let xhttp = new XMLHttpRequest();
        xhttp.open('POST', '/data', true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify( { message: "my custom video" } ));
    }
}