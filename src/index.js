import Phaser from 'phaser';

import Config from './test/hello_matter/config';

// TODO: just store these configs as a .json file
const game = new Phaser.Game(Config.get());