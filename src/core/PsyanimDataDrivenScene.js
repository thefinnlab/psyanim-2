import Phaser from 'phaser';

import PsyanimScene from './PsyanimScene';
import PsyanimConstants from './PsyanimConstants';

import PsyanimNavigationGrid from './utils/PsyanimNavigationGrid';

/**
 *  Algorithm (order is important!):
 * 
 *      - Instantiate all non-prefab entities & add their components to them
 *      - Configure and instantiate all prefabs
 *      - Configure all non-prefab entities
 * 
 */

export default class PsyanimDataDrivenScene extends PsyanimScene {

    constructor(key = null) {

        let sceneKey = 'Psyanim Data Driven Scene';

        if (key)
        {
            sceneKey = key;
        }

        super(sceneKey);
    }

    create() {

        super.create();

        this._sceneDefinition = this.registry.get('psyanim_currentSceneDefinition');

        if (Object.hasOwn(this._sceneDefinition, 'wrapScreenBoundary'))
        {
            this.screenBoundary.wrap = this._sceneDefinition.wrapScreenBoundary;
        }

        this._setupNavgrid();
        this._instantiateNonPrefabEntities();
        this._instantiatePrefabEntities();
        this._configureNonPrefabEntities();
    }

    _getRandomizedInitialPosition() {

        let canvasWidth = this.game.config.width;
        let canvasHeight = this.game.config.height;

        let canvasCenter = {
            x: canvasWidth / 2,
            y: canvasHeight / 2
        };

        let maxDeltaX = (canvasWidth - 100) / 2;
        let maxDeltaY = (canvasHeight - 100) / 2;

        let deltaX = (Math.random() * 2 - 1) * maxDeltaX;
        let deltaY = (Math.random() * 2 - 1) * maxDeltaY;

        return {
            x: canvasCenter.x + deltaX,
            y: canvasCenter.y + deltaY
        };
    }

    _isObject(o) {

        return (typeof(o) === 'object') && !Array.isArray(o) && (o !== null);
    }

    _configureNonPrefabEntities() {

        // TODO: 

        let entityDefinitions = this._sceneDefinition.entities;

        if (!entityDefinitions || entityDefinitions.length == 0)
        {
            return;
        }

        let nonPrefabEntityDefinitions = entityDefinitions
            .filter(e => !Object.hasOwn(e, 'prefabType'));

        /** finally, configure all the components */
        for (let i = 0; i < nonPrefabEntityDefinitions.length; ++i)
        {
            let entityDefinition = nonPrefabEntityDefinitions[i];

            let componentDefinitions = entityDefinition.components;

            if (componentDefinitions)
            {
                for (let j = 0; j < componentDefinitions.length; ++j)
                {
                    let componentDefinition = componentDefinitions[j];
    
                    // TODO: process component params!
                }    
            }
        }
    }

    _instantiatePrefabEntity(entityDefinition, nameOverride = null) {

        let name = (nameOverride) ? nameOverride : entityDefinition.name;

        // compute initial position
        let initialPosition = null;

        if (Object.hasOwn(entityDefinition, 'initialPosition'))
        {
            if (entityDefinition.initialPosition === 'random')
            {
                initialPosition = this._getRandomizedInitialPosition();
            }
            else
            {
                initialPosition = entityDefinition.initialPosition;
            }
        }
        else
        {
            initialPosition = { x: 0, y: 0 };
        }

        let shapeParams = Object.hasOwn(entityDefinition, 'shapeParams') ? 
            entityDefinition.shapeParams : PsyanimConstants.DEFAULT_ENTITY_SHAPE_PARAMS;

        let prefab = new entityDefinition.prefabType(shapeParams);

        let prefabParamNames = Object.keys(entityDefinition.prefabParams);

        /** configure the prefab first */
        for (let j = 0; j < prefabParamNames.length; ++j)
        {
            let paramName = prefabParamNames[j];

            let paramValue = entityDefinition.prefabParams[paramName];

            if (paramValue === 'navgrid')
            {
                prefab[paramName] = this._grid;
            }
            else if (this._isObject(paramValue))
            {
                // it's an entity or component reference!
                let entityReferenceName = paramValue.entityName;
                let componentReferenceIndex = paramValue.componentIndex;
                
                let entityReference = this.getEntityByName(entityReferenceName);

                if (componentReferenceIndex)
                {
                    let componentReference = entityReference
                        .getComponentByIndex(componentReferenceIndex);

                    prefab[paramName] = componentReference;
                }
                else
                {
                    prefab[paramName] = entityReference;
                }
            }
            else
            {
                prefab[paramName] = paramValue;
            }
        }

        /** instantiate the prefab after it's been properly configured */
        let newEntity = this.instantiatePrefab(prefab, name,
            initialPosition.x, initialPosition.y);
    }

    _instantiatePrefabEntities() {

        let entityDefinitions = this._sceneDefinition.entities;

        if (!entityDefinitions || entityDefinitions.length == 0)
        {
            return;
        }

        let prefabEntityDefinitions = entityDefinitions
            .filter(e => Object.hasOwn(e, 'prefabType'));

        for (let i = 0; i < prefabEntityDefinitions.length; ++i)
        {
            let entityDefinition = prefabEntityDefinitions[i];

            let nInstances = Object.hasOwn(entityDefinition, 'instances') ? 
                entityDefinition.instances : 1;

            if (nInstances < 1)
            {
                PsyanimDebug.error("'instances' can not be less than 1!  entity name: " + entityDefinition.name);
            }

            if (nInstances == 1)
            {
                this._instantiatePrefabEntity(entityDefinition);
            }
            else
            {
                for (let j = 0; j < nInstances; ++j)
                {
                    let instanceName = entityDefinition.name + '_' + (j + 1);

                    this._instantiatePrefabEntity(entityDefinition, instanceName);
                }    
            }
        }
    }

    _instantiateNonPrefabEntities() {

        let entityDefinitions = this._sceneDefinition.entities;

        if (!entityDefinitions || entityDefinitions.length == 0)
        {
            return;
        }

        let nonPrefabEntityDefinitions = entityDefinitions
            .filter(e => !Object.hasOwn(e, 'prefabType'));

        for (let i = 0; i < nonPrefabEntityDefinitions.length; ++i)
        {
            let entityDefinition = nonPrefabEntityDefinitions[i];

            if (!Object.hasOwn(entityDefinition, 'name'))
            {
                PsyanimDebug.error("No 'name' field found in entity definition!");
                return;
            }

            /** Instantiate the non-prefab entity first */
            let name = entityDefinition.name;

            let initialPosition = Object.hasOwn(entityDefinition, 'initialPosition') ? 
                entityDefinition.initialPosition : { x: 0, y: 0 };

            let shapeParams = Object.hasOwn(entityDefinition, 'shapeParams') ? 
                entityDefinition.shapeParams : PsyanimConstants.DEFAULT_ENTITY_SHAPE_PARAMS;

            let newEntity = this.addEntity(name, initialPosition.x, initialPosition.y, shapeParams);

            /** Then add all the components */
            let componentDefinitions = entityDefinition.components;

            if (componentDefinitions)
            {
                for (let j = 0; j < componentDefinitions.length; ++j)
                {
                    let componentDefinition = componentDefinitions[j];
    
                    newEntity.addComponent(componentDefinition.type);
                }    
            }
        }
    }

    _setupNavgrid() {

        let gridDefinition = this._sceneDefinition.navgrid;

        if (!gridDefinition)
        {
            return;
        }

        let cellSize = gridDefinition.cellSize;
        let obstacleDefinitions = gridDefinition.obstacles;

        this._grid = new PsyanimNavigationGrid(cellSize, 
            this.game.scale.width,
            this.game.scale.height);

        for (let i = 0; i < obstacleDefinitions.length; ++i)
        {
            let obstacleDefinition = obstacleDefinitions[i];

            let obstacle = this.addEntity('obstacle_' + i, 
                obstacleDefinition.position.x, 
                obstacleDefinition.position.y, 
                obstacleDefinition.shapeParams, 
                { isSleeping: true }
            );

            this._grid.addObstacle(obstacle);
        }

        this._grid.bake();
    }
}