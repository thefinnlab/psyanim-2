import PsyanimApp from '../../src/core/PsyanimApp';

import PsyanimConfig from '../../src/core/PsyanimConfig';

import MainScene from './MainScene';
import PlaybackScene from './PlaybackScene';

// create Psyanim config 
let config = new PsyanimConfig();

config.registerScene(MainScene);
config.registerScene(PlaybackScene);

// create Psyanim app
const app = new PsyanimApp(config);