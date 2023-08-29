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
import AdvancedArriveTest from './scenes/AdvancedArriveTest';
import FOVSensorTest from './scenes/FOVSensorTest';
import PredatorTest from './scenes/PredatorTest';
import PreyTest from './scenes/PreyTest';
import PathfindingTest from './scenes/PathfindingTest';
import PathTest from './scenes/PathTest';
import ClickToMoveTest from './scenes/ClickToMoveTest';
import PsyanimDebugLoggerTest from './scenes/PsyanimDebugLoggerTest';

/**
 *  Register scenes
 */

PsyanimApp.Instance.config.registerScene(FOVSensorTest);
PsyanimApp.Instance.config.registerScene(ArriveTest);
PsyanimApp.Instance.config.registerScene(ClickToMoveTest);
PsyanimApp.Instance.config.registerScene(PsyanimPlayfightTest);
PsyanimApp.Instance.config.registerScene(AdvancedArriveTest);
PsyanimApp.Instance.config.registerScene(PathfindingTest);
PsyanimApp.Instance.config.registerScene(PathTest);
PsyanimApp.Instance.config.registerScene(PreyTest);
PsyanimApp.Instance.config.registerScene(PredatorTest);
PsyanimApp.Instance.config.registerScene(SeekTest);
PsyanimApp.Instance.config.registerScene(FleeTest);
PsyanimApp.Instance.config.registerScene(WanderTest);
PsyanimApp.Instance.config.registerScene(SensorTest);
PsyanimApp.Instance.config.registerScene(EvadeTest);
PsyanimApp.Instance.config.registerScene(AdvancedFleeTest);
PsyanimApp.Instance.config.registerScene(AdvancedPlayfightTest);
PsyanimApp.Instance.config.registerScene(ChargeTest);
PsyanimApp.Instance.config.registerScene(PsyanimDebugLoggerTest);

/**
 *  Make config edits & run the app
 */

PsyanimApp.Instance.config.setDebugEnabled(true);

PsyanimApp.Instance.run();