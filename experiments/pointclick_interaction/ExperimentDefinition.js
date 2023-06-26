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
            variations: 3
        },
        {
            sceneType: WanderScene,
            parameterSet: {
                nAgents: 5,
            },
            variations: 1
        },
        {
            sceneType: FleeScene,
            parameterSet: {
                
            },
            variations: 2
        }
    ]
}