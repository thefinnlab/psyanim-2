import Phaser from 'phaser';

export default class PsyanimApp {

    constructor(config) {

        this.game = new Phaser.Game(config.phaserConfig);
    }

    // TODO: the experiment runs & scenes should be configured in index.js
    // file by adding data to the game.registry().  this will determine
    // what scenes get loaded, etc.  maybe the first scene for an experiment
    // should always be a 'PsyanimExperimentLoader' scene
}