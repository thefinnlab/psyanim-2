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
 *      - add optional automatic animation baking to experiment manager
 *      - implement dedicated animation browser app and add to firebase web apps
 *      - implement metadata saving in experiment manager with experiment playback
 *      - implement 
 *      
 *  High-level:
 * 
 *      - create a few scenes we can use for testing that satisfy the basics of what Eshin asked for
 *      - build out experiment manager and ability to run these scenes according to configuration added
 *          here in index.js
 *              - don't forget that we need an 'experiment loader' and a class that lets 
 *                  other javascripts in the DOM control scene transitions from our 'loading scene!'
 *      - build out automagic animation baking features into experiment manager
 *      - build a tool that lets us playback any animation or experiment metadata file!
 */