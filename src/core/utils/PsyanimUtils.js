export default class PsyanimUtils {

    static isObject(o) {

        return (typeof(o) === 'object') && !Array.isArray(o) && (o !== null);
    }

    static isSceneDefEntityReference(value) {

        if (PsyanimUtils.isObject(value) && Object.hasOwn(value, 'entityName'))
        {
            return true;
        }

        return false;
    }

    static isSceneDefComponentReference(value) {

        if  (PsyanimUtils.isSceneDefEntityReference(value) && Object.hasOwn(value, 'componentType'))
        {
            return true;
        }

        return false;
    }

    static cloneSceneDefinition(sceneDefinition) {

        let newSceneDefinition = {};

        newSceneDefinition.key = sceneDefinition.key;

        if (Object.hasOwn(sceneDefinition, 'wrapScreenBoundary'))
        {
            newSceneDefinition.wrapScreenBoundary = sceneDefinition.wrapScreenBoundary;
        }

        if (Object.hasOwn(sceneDefinition, 'navgrid'))
        {
            newSceneDefinition.navgrid = structuredClone(sceneDefinition.navgrid);
        }

        if (Object.hasOwn(sceneDefinition, 'entities'))
        {
            newSceneDefinition.entities = [];

            for (let i = 0; i < sceneDefinition.entities.length; ++i)
            {
                let entityDefinition = sceneDefinition.entities[i];

                let newEntity = {};

                newEntity.name = entityDefinition.name;

                if (Object.hasOwn(entityDefinition, 'initialPosition'))
                {
                    newEntity.initialPosition = structuredClone(entityDefinition.initialPosition);
                }

                if (Object.hasOwn(entityDefinition, 'initialAngle'))
                {
                    newEntity.initialAngle = structuredClone(entityDefinition.initialAngle);
                }

                if (Object.hasOwn(entityDefinition, 'shapeParams'))
                {
                    newEntity.shapeParams = structuredClone(entityDefinition.shapeParams);
                }

                if (Object.hasOwn(entityDefinition, 'matterOptions'))
                {
                    newEntity.matterOptions = structuredClone(entityDefinition.matterOptions);
                }

                if (Object.hasOwn(entityDefinition, 'instances'))
                {
                    newEntity.instances = structuredClone(entityDefinition.instances);
                }

                if (Object.hasOwn(entityDefinition, 'prefab'))
                {
                    let prefabDefinition = entityDefinition.prefab;

                    newEntity.prefab = {};
                    newEntity.prefab.type = prefabDefinition.type;

                    if (Object.hasOwn(prefabDefinition, 'params'))
                    {
                        newEntity.prefab.params = PsyanimUtils._cloneSceneDefinitionParams(prefabDefinition.params);
                    }
                }

                if (Object.hasOwn(entityDefinition, 'components'))
                {
                    let components = [];

                    for (let i = 0; i < entityDefinition.components.length; ++i)
                    {
                        let component = {};

                        component.type = entityDefinition.components[i].type;

                        if (Object.hasOwn(entityDefinition.components[i], 'enabled'))
                        {
                            component.enabled = structuredClone(entityDefinition.components[i].enabled);
                        }

                        if (Object.hasOwn(entityDefinition.components[i], 'params'))
                        {
                            component.params = PsyanimUtils._cloneSceneDefinitionParams(entityDefinition.components[i].params);
                        }

                        components.push(component);
                    }

                    newEntity.components = components;
                }

                newSceneDefinition.entities.push(newEntity);
            }
        }

        return newSceneDefinition;
    }
    
    static _cloneSceneDefinitionParams(params) {

        let newParams = {};

        let paramKeys = Object.keys(params);

        for (let i = 0; i < paramKeys.length; ++i)
        {
            let paramKey = paramKeys[i];
            let paramValue = params[paramKey];

            if (PsyanimUtils.isSceneDefComponentReference(paramValue))
            {
                newParams[paramKey] = {
                    entityName: paramValue['entityName'],
                    componentType: paramValue['componentType']
                }
            }
            else
            {
                newParams[paramKey] = structuredClone(paramValue);
            }
        }

        return newParams;
    }
}