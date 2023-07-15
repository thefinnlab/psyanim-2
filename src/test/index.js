import PsyanimApp from '../core/PsyanimApp';

import ArriveTest from './scenes/ArriveTest';
import SeekTest from './scenes/SeekTest';
import FleeTest from './scenes/FleeTest';
import WanderTest from './scenes/WanderTest';
import SensorTest from './scenes/SensorTest';
import PathFollowTest from './scenes/PathFollowTest';
import EvadeTest from './scenes/EvadeTest';
import SimpleCollisionAvoidanceTest from './scenes/SimpleCollisionAvoidanceTest';
import RayCastTest from './scenes/RayCastTest';
import AdvancedFleeTest from './scenes/AdvancedFleeTest';
import PsyanimPlayfightTest from './scenes/PsyanimPlayfightTest';
import ChargeTest from './scenes/ChargeTest';
import AdvancedPlayfightTest from './scenes/AdvancedPlayfightTest';

import AdvancedArriveTest from './scenes/AdvancedArriveTest';

import DebugGraphicsTest from './scenes/DebugGraphicsTest';

import ShowHideCanvasTest from './scenes/ShowHideCanvasTest';

import PsyanimFOVSensorTest from './scenes/PsyanimFOVSensorTest';

/**
 *  Register scenes
 */

console.warn("TODO: advanced arrive test is broken");

PsyanimApp.Instance.config.registerScene(PsyanimFOVSensorTest);
PsyanimApp.Instance.config.registerScene(ArriveTest);
PsyanimApp.Instance.config.registerScene(SeekTest);
PsyanimApp.Instance.config.registerScene(FleeTest);
PsyanimApp.Instance.config.registerScene(WanderTest);
PsyanimApp.Instance.config.registerScene(SensorTest);
PsyanimApp.Instance.config.registerScene(PathFollowTest);
PsyanimApp.Instance.config.registerScene(SimpleCollisionAvoidanceTest);
PsyanimApp.Instance.config.registerScene(EvadeTest);
PsyanimApp.Instance.config.registerScene(RayCastTest);
PsyanimApp.Instance.config.registerScene(AdvancedFleeTest);
PsyanimApp.Instance.config.registerScene(PsyanimPlayfightTest);
PsyanimApp.Instance.config.registerScene(AdvancedPlayfightTest);
PsyanimApp.Instance.config.registerScene(ChargeTest);
PsyanimApp.Instance.config.registerScene(AdvancedArriveTest); // TODO: this is broken
PsyanimApp.Instance.config.registerScene(DebugGraphicsTest);
PsyanimApp.Instance.config.registerScene(ShowHideCanvasTest);

/**
 *  Make config edits & run the app
 */

PsyanimApp.Instance.config.setDebugEnabled(true);

PsyanimApp.Instance.run();