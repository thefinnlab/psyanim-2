import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';

import PsyanimArriveAgentPrefab from '../../src/core/prefabs/PsyanimArriveAgentPrefab';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimDebug from '../../src/core/utils/PsyanimDebug';

export default class DataDrivenSceneTest extends PsyanimScene {

    constructor() {

        super('Data Driven Scene Test');

        this._sceneDefinition = {

            entities: [
                {
                    name: 'sceneControls',
                    components: [
                        { type: PsyanimSceneTitle },
                        { type: PsyanimPhysicsSettingsController },
                        { type: PsyanimSceneChangeController }
                    ]
                },
                {
                    name: 'mouseFollowTarget',
                    initialPosition: { x: 400, y: 300 },
                    shapeParams: {
                        shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                        radius: 4,
                        color: 0x00ff00
                    },
                    components: [
                        { type: PsyanimMouseFollowTarget }
                    ]
                },
                {
                    name: 'agent1',
                    initialPosition: { x: 600, y: 450 },
                    shapeParams: {
                        shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                        base: 16, altitude: 32, 
                        color: 0xffc0cb            
                    },
                    prefabType: PsyanimArriveAgentPrefab,
                    prefabParams: {
                        target: {
                            entityName: 'mouseFollowTarget',
                        },
                    }
                }
            ]
        };
    }

    _isObject(o) {

        return (typeof(o) === 'object') && !Array.isArray(o) && (o !== null);
    }

    create() {

        super.create();

        let entityDefinitions = this._sceneDefinition.entities;

        for (let i = 0; i < entityDefinitions.length; ++i)
        {
            /** instantiate all the entities */
            let entityDefinition = entityDefinitions[i];

            if (!Object.hasOwn(entityDefinition, 'name'))
            {
                PsyanimDebug.error("No 'name' field found in entity definition!");
                return;
            }

            let name = entityDefinition.name;

            let initialPosition = Object.hasOwn(entityDefinition, 'initialPosition') ? 
                entityDefinition.initialPosition : { x: 0, y: 0 };

            let shapeParams = Object.hasOwn(entityDefinition, 'shapeParams') ? 
                entityDefinition.shapeParams : PsyanimConstants.DEFAULT_ENTITY_SHAPE_PARAMS;

            let prefab = null;
            let newEntity = null;

            if (entityDefinition.prefabType)
            {
                prefab = new entityDefinition.prefabType(shapeParams);

                let prefabParamNames = Object.keys(entityDefinition.prefabParams);

                for (let j = 0; j < prefabParamNames.length; ++j)
                {
                    let paramName = prefabParamNames[j];

                    let paramValue = entityDefinition.prefabParams[paramName];

                    if (this._isObject(paramValue))
                    {
                        // it's an entity or component reference!
                        let entityReferenceName = paramValue.entityName;
                        let componentReferenceIndex = paramValue.componentIndex;
                        
                        let entityReference = this.getEntityByName(entityReferenceName);

                        if (componentReferenceIndex)
                        {
                            let componentReference = entityReference
                                .getComponentByIndex(componentReferenceIndex);

                            // TODO: add the component reference to this prefab!
                        }
                        else
                        {
                            prefab[paramName] = entityReference;
                        }
                    }
                }

                newEntity = this.instantiatePrefab(prefab, name,
                    initialPosition.x, initialPosition.y);
            }
            else
            {
                newEntity = this.addEntity(name, initialPosition.x, initialPosition.y, shapeParams);
            }

            /** add all the components */
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

        /** finally, configure all the components */
        for (let i = 0; i < entityDefinitions.length; ++i)
        {
            let entityDefinition = entityDefinitions[i];

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
}