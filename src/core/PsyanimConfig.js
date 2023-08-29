import Phaser from 'phaser';

import PsyanimScene from './PsyanimScene';
import PsyanimDebug from './utils/PsyanimDebug';
import PsyanimDataDrivenScene from './PsyanimDataDrivenScene';

export default class PsyanimConfig {

    constructor() {

        this._phaserConfig = {
            type: Phaser.AUTO,
            parent: 'phaser-app',
            width: 800,
            height: 600,
            backgroundColor: 0xffffff,
            scene: [],
            physics: {
                default: 'matter',
                matter: {
                    gravity: {
                        y: 0
                    }
                }
            }
        };

        this._sceneKeys = [];

        this._dataDrivenScenes = [];
    }

    registerScene(scene) {

        if (scene.prototype instanceof PsyanimScene)
        {
            if (!scene.hasOwnProperty('KEY'))
            {
                PsyanimDebug.error("Scene has no 'key' field!");
            }

            if (!this._phaserConfig.scene.includes(scene))
            {
                this._phaserConfig.scene.push(scene);
                this._sceneKeys.push(scene.KEY);
            }
            else
            {
                PsyanimDebug.error("ERROR: scene is already registered in app config!");
            }    
        }
        else
        {
            if (!Object.hasOwn(scene, 'key'))
            {
                PsyanimDebug.error('Scene has no key!');
            }

            this._dataDrivenScenes.push(scene);
            this._sceneKeys.push(scene.key);

            // if user registers at least 1 data-driven scene, we need to register PsyanimDataDrivenScene
            if (!this._phaserConfig.scene.includes(PsyanimDataDrivenScene))
            {
                this._phaserConfig.scene.push(PsyanimDataDrivenScene);
            }
        }
    }

    get sceneKeys() {

        return this._sceneKeys.slice();
    }

    get sceneDefinitions() {

        return this._dataDrivenScenes.slice();
    }

    getSceneDefinition(key) {

        return this._dataDrivenScenes.find(s => s.key === key);
    }

    setDebugEnabled(enabled) {

        if (enabled)
        {
            this._phaserConfig.physics.matter.debug = {

                showAxes: false,
                showAngleIndicator: true,
                angleColor: 0xe81153,

                showBroadphase: false,
                broadphaseColor: 0xffb400,

                showBounds: false,
                boundsColor: 0xffffff,

                showVelocity: true,
                velocityColor: 0x00aeef,

                showCollisions: false,
                collisionColor: 0xf5950c,
    
                showSeparations: false,
                separationColor: 0xffa500,

                showBody: true,
                showStaticBody: true,
                showInternalEdges: true,

                renderFill: false,
                renderLine: true,
    
                fillColor: 0x106909,
                fillOpacity: 1,
                lineColor: 0x28de19,
                lineOpacity: 1,
                lineThickness: 1,
    
                staticFillColor: 0x0d177b,
                staticLineColor: 0x1327e4,

                showSleeping: true,
                staticBodySleepOpacity: 1,
                sleepFillColor: 0x464646,
                sleepLineColor: 0x999a99,
    
                showSensors: true,
                sensorFillColor: 0x0d177b,
                sensorLineColor: 0x1327e4,
    
                showPositions: true,
                positionSize: 4,
                positionColor: 0xe042da,
    
                showJoint: true,
                jointColor: 0xe0e042,
                jointLineOpacity: 1,
                jointLineThickness: 2,
    
                pinSize: 4,
                pinColor: 0x42e0e0,
    
                springColor: 0xe042e0,
    
                anchorColor: 0xefefef,
                anchorSize: 4,
    
                showConvexHulls: true,
                hullColor: 0xd703d0
            };
        }
        else
        {
            this._phaserConfig.physics.matter.debug = false;
        }
    }

    get phaserConfig() {

        return this._phaserConfig;
    }
}