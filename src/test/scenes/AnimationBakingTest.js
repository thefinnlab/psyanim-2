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

        this.mouseTarget.addComponent(PsyanimMouseFollowTarget, { radius: 4 });

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
    }

    initPlayback() {

        console.log("simulation complete - beginning playback!");

        this.agent1.getComponents().forEach(c => c.destroy());
        this.agent2.getComponents().forEach(c => c.destroy());
        this.mouseTarget.getComponents().forEach(c => c.destroy());
    }
}