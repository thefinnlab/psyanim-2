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
import PlayfightTest from './scenes/PlayfightTest.js';
import ChargeTest from './scenes/ChargeTest.js';
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

import FSMTest from './scenes/FSMTest.js';

import PlayfightTestv2 from './scenes/PlayfightTestv2.js';

import PredatorPreyTestV2 from './scenes/PredatorPreyTestV2.js';

import PredatorV2Test from './scenes/PredatorV2Test.js';
import PreyV2Test from './scenes/PreyV2Test.js';

import BasicHFSM from './scenes/BasicHFSM.js';

import BlackboardTest from './scenes/BlackboardTest.js';

import BehaviorTreePatrolTest from './scenes/BehaviorTreePatrolTest.js';
import BehaviorTreePatrolFleeTest from './scenes/BehaviorTreePatrolFleeTest.js';

import BehaviorTreePlayfightTest from './scenes/BehaviorTreePlayfightTest.js';

import BehaviorTreePatrolChaseTest from './scenes/BehaviorTreePatrolChaseTest.js';

import BehaviorTreePredatorTest from './scenes/BehaviorTreePredatorTest.js';

/**
 *  Setup Psyanim App - first register scenes:
 */

// make a clone of the scene definitions here to test our cloning funcs
let basicHFSMCopy = PsyanimUtils.cloneSceneDefinition(BasicHFSM);
let preyV2TestCopy = PsyanimUtils.cloneSceneDefinition(PreyV2Test);
let predatorV2TestCopy = PsyanimUtils.cloneSceneDefinition(PredatorV2Test);
let predatorPreyTestV2Copy = PsyanimUtils.cloneSceneDefinition(PredatorPreyTestV2);
let playfightTestv2Copy = PsyanimUtils.cloneSceneDefinition(PlayfightTestv2);
let fsmTestCopy = PsyanimUtils.cloneSceneDefinition(FSMTest);
let obstacleAvoidanceCopy = PsyanimUtils.cloneSceneDefinition(ObstacleAvoidanceTest);
let mimicInteractiveCopy = PsyanimUtils.cloneSceneDefinition(MimicInteractiveTest);
let predatorPreyCopy = PsyanimUtils.cloneSceneDefinition(PredatorPrey);
let ClickToMoveTestCopy = PsyanimUtils.cloneSceneDefinition(ClickToMoveTest);
let FOVSensorTestCopy = PsyanimUtils.cloneSceneDefinition(FOVSensorTest);
let ArriveTestCopy = PsyanimUtils.cloneSceneDefinition(ArriveTest);
let PlayfightTestCopy = PsyanimUtils.cloneSceneDefinition(PlayfightTest);
let PreciselyTimedArriveTestCopy = PsyanimUtils.cloneSceneDefinition(PreciselyTimedArriveTest);
let PreyTestCopy = PsyanimUtils.cloneSceneDefinition(PreyTest);
let PredatorTestCopy = PsyanimUtils.cloneSceneDefinition(PredatorTest);
let SeekTestCopy = PsyanimUtils.cloneSceneDefinition(SeekTest);
let FleeTestCopy = PsyanimUtils.cloneSceneDefinition(FleeTest);
let WanderTestCopy = PsyanimUtils.cloneSceneDefinition(WanderTest);
let SensorTestCopy = PsyanimUtils.cloneSceneDefinition(SensorTest);
let EvadeTestCopy = PsyanimUtils.cloneSceneDefinition(EvadeTest);
let AdvancedFleeTestCopy = PsyanimUtils.cloneSceneDefinition(AdvancedFleeTest);
let BlackboardTestCopy = PsyanimUtils.cloneSceneDefinition(BlackboardTest);
let BehaviorTreePatrolTestCopy = PsyanimUtils.cloneSceneDefinition(BehaviorTreePatrolTest);
let BehaviorTreePatrolFleeTestCopy = PsyanimUtils.cloneSceneDefinition(BehaviorTreePatrolFleeTest);
let BehaviorTreePlayfightTestCopy = PsyanimUtils.cloneSceneDefinition(BehaviorTreePlayfightTest);
let BehaviorTreePatrolChaseTestCopy = PsyanimUtils.cloneSceneDefinition(BehaviorTreePatrolChaseTest);
let BehaviorTreePredatorTestCopy = PsyanimUtils.cloneSceneDefinition(BehaviorTreePredatorTest);

// register the scene def clones to make sure the clones are g2g too
PsyanimApp.Instance.config.registerScene(BehaviorTreePredatorTestCopy);
PsyanimApp.Instance.config.registerScene(BehaviorTreePatrolChaseTestCopy);
PsyanimApp.Instance.config.registerScene(BehaviorTreePatrolFleeTestCopy);
PsyanimApp.Instance.config.registerScene(BehaviorTreePlayfightTestCopy);
PsyanimApp.Instance.config.registerScene(BehaviorTreePatrolTestCopy);
PsyanimApp.Instance.config.registerScene(BlackboardTestCopy);
PsyanimApp.Instance.config.registerScene(predatorPreyTestV2Copy);
PsyanimApp.Instance.config.registerScene(SensorTestCopy);
PsyanimApp.Instance.config.registerScene(playfightTestv2Copy);
PsyanimApp.Instance.config.registerScene(basicHFSMCopy);
PsyanimApp.Instance.config.registerScene(preyV2TestCopy);
PsyanimApp.Instance.config.registerScene(predatorV2TestCopy);
PsyanimApp.Instance.config.registerScene(predatorPreyCopy);
PsyanimApp.Instance.config.registerScene(PlayfightTestCopy);
PsyanimApp.Instance.config.registerScene(fsmTestCopy);
PsyanimApp.Instance.config.registerScene(AdvancedFleeTestCopy);
PsyanimApp.Instance.config.registerScene(AdvancedArriveTest);
PsyanimApp.Instance.config.registerScene(obstacleAvoidanceCopy);
PsyanimApp.Instance.config.registerScene(mimicInteractiveCopy);
PsyanimApp.Instance.config.registerScene(ClickToMoveTestCopy);
PsyanimApp.Instance.config.registerScene(FOVSensorTestCopy);
PsyanimApp.Instance.config.registerScene(ArriveTestCopy);
PsyanimApp.Instance.config.registerScene(PreciselyTimedArriveTestCopy);
PsyanimApp.Instance.config.registerScene(PreyTestCopy);
PsyanimApp.Instance.config.registerScene(PredatorTestCopy);
PsyanimApp.Instance.config.registerScene(SeekTestCopy);
PsyanimApp.Instance.config.registerScene(FleeTestCopy);
PsyanimApp.Instance.config.registerScene(WanderTestCopy);
PsyanimApp.Instance.config.registerScene(EvadeTestCopy);

// just use the original scene defs here
PsyanimApp.Instance.config.registerScene(PathfindingTest);
PsyanimApp.Instance.config.registerScene(PathTest);
PsyanimApp.Instance.config.registerScene(ChargeTest);
PsyanimApp.Instance.config.registerScene(PsyanimDebugLoggerTest);

/**
 *  Make config edits & run the app
 */

PsyanimApp.Instance.run();

PsyanimApp.Instance.config.setDebugEnabled(true);