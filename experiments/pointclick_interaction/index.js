import PsyanimApp from '../../src/core/PsyanimApp';

import ExperimentDefinition from './ExperimentDefinition';

PsyanimApp.Instance.run(ExperimentDefinition);

/**
 *  Remove before flight:
 */

/**
 *  Philosophy:
 * 
 *      - As much as possible, we need to leave the index.js and index.html files in the control of
 *          researchers to customize their experiments at will!
 * 
 *      - Experiments should all be controllable from other scripts loaded in the DOM, to give
 *          maximum control over experiment execution to researchers.
 * 
 *      - Keep interactive scenes as simple as possible, focused on AI & animation, not experiments
 *          - Leave experiment management to our Psyanim Experiment framework
 * 
 *      - In index.js for each experiment, we decide what data we're going to record
 * 
 *      - In index.js for each experiment, we configure info necessary to ID each metadata file
 *          - this might be experiment name, scene name, run # (tied to parameter set), variation #
 * 
 *      - Each animation clip will have an auto-generated unique ID, so it doesn't need special configuration
 * 
 *      - we will create generic playback tools for individual anims & experiments that will have 
 *          their own webpack config
 * 
 */

/**
 *  TODOs:
 * 
 *      - implement metadata saving in experiment manager with experiment playback
 *      - update README!
 * 
 */