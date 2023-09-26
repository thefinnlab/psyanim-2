import PsyanimApp from '../src/core/PsyanimApp';

import ArriveTest from './scenes/ArriveTest';
import SeekTest from './scenes/SeekTest';
import FleeTest from './scenes/FleeTest';
import WanderTest from './scenes/WanderTest';
import SensorTest from './scenes/SensorTest';
import EvadeTest from './scenes/EvadeTest';
import AdvancedFleeTest from './scenes/AdvancedFleeTest';
import PsyanimPlayfightTest from './scenes/PsyanimPlayfightTest';
import ChargeTest from './scenes/ChargeTest';
import AdvancedPlayfightTest from './scenes/AdvancedPlayfightTest';
import PreciselyTimedArriveTest from './scenes/PreciselyTimedArriveTest';
import FOVSensorTest from './scenes/FOVSensorTest';
import PredatorTest from './scenes/PredatorTest';
import PreyTest from './scenes/PreyTest';
import PathfindingTest from './scenes/PathfindingTest';
import PathTest from './scenes/PathTest';
import ClickToMoveTest from './scenes/ClickToMoveTest';
import PsyanimDebugLoggerTest from './scenes/PsyanimDebugLoggerTest';
import PredatorPrey from './scenes/PredatorPrey';

import PsyanimUtils from '../src/core/utils/PsyanimUtils';

import MimicInteractiveTest from './scenes/MimicInteractiveTest';

import ObstacleAvoidanceTest from './scenes/ObstacleAvoidanceTest';

import AdvancedArriveTest from './scenes/AdvancedArriveTest';

/**
 *  Register scenes
 */

// make a clone of the scene definitions here to test our cloning funcs
let obstacleAvoidanceCopy = PsyanimUtils.cloneSceneDefinition(ObstacleAvoidanceTest);
let mimicInteractiveCopy = PsyanimUtils.cloneSceneDefinition(MimicInteractiveTest);
let predatorPreyCopy = PsyanimUtils.cloneSceneDefinition(PredatorPrey);
let ClickToMoveTestCopy = PsyanimUtils.cloneSceneDefinition(ClickToMoveTest);
let FOVSensorTestCopy = PsyanimUtils.cloneSceneDefinition(FOVSensorTest);
let ArriveTestCopy = PsyanimUtils.cloneSceneDefinition(ArriveTest);
let PsyanimPlayfightTestCopy = PsyanimUtils.cloneSceneDefinition(PsyanimPlayfightTest);
let PreciselyTimedArriveTestCopy = PsyanimUtils.cloneSceneDefinition(PreciselyTimedArriveTest);
let PreyTestCopy = PsyanimUtils.cloneSceneDefinition(PreyTest);
let PredatorTestCopy = PsyanimUtils.cloneSceneDefinition(PredatorTest);
let SeekTestCopy = PsyanimUtils.cloneSceneDefinition(SeekTest);
let FleeTestCopy = PsyanimUtils.cloneSceneDefinition(FleeTest);
let WanderTestCopy = PsyanimUtils.cloneSceneDefinition(WanderTest);
let SensorTestCopy = PsyanimUtils.cloneSceneDefinition(SensorTest);
let EvadeTestCopy = PsyanimUtils.cloneSceneDefinition(EvadeTest);
let AdvancedFleeTestCopy = PsyanimUtils.cloneSceneDefinition(AdvancedFleeTest);
let AdvancedPlayfightTestCopy = PsyanimUtils.cloneSceneDefinition(AdvancedPlayfightTest);

// register the scene def clones to make sure the clones are g2g too
PsyanimApp.Instance.config.registerScene(AdvancedArriveTest);
PsyanimApp.Instance.config.registerScene(obstacleAvoidanceCopy);
PsyanimApp.Instance.config.registerScene(predatorPreyCopy);
PsyanimApp.Instance.config.registerScene(mimicInteractiveCopy);
PsyanimApp.Instance.config.registerScene(ClickToMoveTestCopy);
PsyanimApp.Instance.config.registerScene(FOVSensorTestCopy);
PsyanimApp.Instance.config.registerScene(ArriveTestCopy);
PsyanimApp.Instance.config.registerScene(PsyanimPlayfightTestCopy);
PsyanimApp.Instance.config.registerScene(PreciselyTimedArriveTestCopy);
PsyanimApp.Instance.config.registerScene(PreyTestCopy);
PsyanimApp.Instance.config.registerScene(PredatorTestCopy);
PsyanimApp.Instance.config.registerScene(SeekTestCopy);
PsyanimApp.Instance.config.registerScene(FleeTestCopy);
PsyanimApp.Instance.config.registerScene(WanderTestCopy);
PsyanimApp.Instance.config.registerScene(SensorTestCopy);
PsyanimApp.Instance.config.registerScene(EvadeTestCopy);
PsyanimApp.Instance.config.registerScene(AdvancedFleeTestCopy);
PsyanimApp.Instance.config.registerScene(AdvancedPlayfightTestCopy);

// just use the original scene defs here
PsyanimApp.Instance.config.registerScene(PathfindingTest);
PsyanimApp.Instance.config.registerScene(PathTest);
PsyanimApp.Instance.config.registerScene(ChargeTest);
PsyanimApp.Instance.config.registerScene(PsyanimDebugLoggerTest);

/**
 *  Make config edits & run the app
 */

PsyanimApp.Instance.config.setDebugEnabled(true);

PsyanimApp.Instance.run();