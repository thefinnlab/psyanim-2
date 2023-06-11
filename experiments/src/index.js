import Phaser from 'phaser';

import Config from './config';

import { initJsPsych } from 'jspsych';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

// create phaser game
const game = new Phaser.Game(Config.get());

// init jsPsych experiment
const jsPsych = initJsPsych({
    display_element: 'jspsych-target',
});

const trial = {
    type: htmlKeyboardResponse,
    stimulus: 'Hello world!',
};

jsPsych.run([trial]);