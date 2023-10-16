import {
    PsyanimUtils
} from 'psyanim-utils';

import PsyanimApp from '../src/core/PsyanimApp.js';

import ArriveTest from './scenes/ArriveTest.js';
import SeekTest from './scenes/SeekTest.js';
import FleeTest from './scenes/FleeTest.js';
import WanderTest from './scenes/WanderTest.js';
import SensorTest from './scenes/SensorTest.js';
import EvadeTest from './scenes/EvadeTest.js';
import AdvancedFleeTest from './scenes/AdvancedFleeTest.js';
import PsyanimPlayfightTest from './scenes/PsyanimPlayfightTest.js';
import ChargeTest from './scenes/ChargeTest.js';
import AdvancedPlayfightTest from './scenes/AdvancedPlayfightTest.js';
import PreciselyTimedArriveTest from './scenes/PreciselyTimedArriveTest.js';
import FOVSensorTest from './scenes/FOVSensorTest.js';
import PredatorTest from './scenes/PredatorTest.js';
import PreyTest from './scenes/PreyTest.js';
import PathfindingTest from './scenes/PathfindingTest.js';
import PathTest from './scenes/PathTest.js';
import ClickToMoveTest from './scenes/ClickToMoveTest.js';
import PsyanimDebugLoggerTest from './scenes/PsyanimDebugLoggerTest.js';
import PredatorPrey from './scenes/PredatorPrey.js';

import MimicInteractiveTest from './scenes/MimicInteractiveTest.js';

import ObstacleAvoidanceTest from './scenes/ObstacleAvoidanceTest.js';

import AdvancedArriveTest from './scenes/AdvancedArriveTest.js';

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
PsyanimApp.Instance.config.registerScene(AdvancedFleeTestCopy);
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