import PointClickMovementScene from './PointClickMovementScene';
import WanderScene from './WanderScene';
import FleeScene from './FleeScene';

export default {
    name: "myTestExperiment",
    runs: [
        {
            sceneType: PointClickMovementScene,
            parameterSet: {
                initialPos: { x: 100, y: 100 },
            },
            variations: 3,
            agentNamesToRecord: ['agent1']
        },
        {
            sceneType: WanderScene,
            parameterSet: {
                nAgents: 2,
            },
            variations: 1,
            agentNamesToRecord: ['agent*']
        },
        {
            sceneType: FleeScene,
            parameterSet: {
                
            },
            variations: 2,
            agentNamesToRecord: ['mouseFollowTarget', 'agent1', 'agent2']
        },
        {
            sceneType: WanderScene,
            parameterSet: {
                nAgents: 3,
            },
            variations: 2,
            agentNamesToRecord: ['agent*']
        },
        {
            sceneType: PointClickMovementScene,
            parameterSet: {
                initialPos: { x: 400, y: 300 },
            },
            variations: 3,
            agentNamesToRecord: ['agent1']
        }
    ]
}