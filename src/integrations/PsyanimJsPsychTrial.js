import PsyanimApp from '../core/PsyanimApp.js';
import PsyanimJsPsychPlugin from './PsyanimJsPsychPlugin.js';
import PsyanimUtils from '../core/utils/PsyanimUtils.js';
import PsyanimDebug from '../core/utils/PsyanimDebug.js';
import PsyanimJsPsychTrialParameter from './PsyanimJsPsychTrialParameter.js';

export default class PsyanimJsPsychTrial {

    constructor(sceneDefinitionTemplate, sceneKey = null) {

        this._sceneDefinition = PsyanimUtils.cloneSceneDefinition(sceneDefinitionTemplate);

        // TODO: verify scene key is unique

        if (sceneKey)
        {
            this._sceneDefinition.key = sceneKey;
        }

        PsyanimApp.Instance.config.registerScene(this._sceneDefinition);

        this._validEntityParameters = ['initialPosition', 'shapeParams', 'matterOptions'];

        this._validShapeParameters = [
            'shapeType', 'radius', 'base', 'altitude', 'width', 'height', 'depth', 'color'
        ];

        this._validMatterOptions = [
            'isSensor', 'isStatic'
        ];

        // setup other plugin parameters
        this._endTrialKeys = ['enter'];
        this._duration = -1.0;
        this._endTrialOnContact = false;
        this._agentNamesToRecord = [];
        this._recordAnimationClips = true;
        this._recordStateLogs = true;
        this._subtext = '';

        // trial parameters that the user can decide to save
        this._trialParametersToSave = [];
        this._saveParametersOnModification = true;
    }

    get jsPsychTrialDefinition() {

        return {
            type: PsyanimJsPsychPlugin,
            sceneKey: this.sceneKey,
            duration: this.duration,
            endTrialOnContact: this.endTrialOnContact,
            agentNamesToRecord: this.agentNamesToRecord,
            recordAnimationClips: this.recordAnimationClips,
            recordStateLogs: this.recordStateLogs,
            subtext: this._subtext,
            trialParameters: this._trialParametersToSave
        };
    }

    get sceneKey() {

        return this._sceneDefinition.key;
    }

    get duration() {

        return this._duration;
    }

    set duration(value) {

        this._duration = value;
    }

    get endTrialOnContact() {

        return this._endTrialOnContact;
    }

    set endTrialOnContact(value) {

        this._endTrialOnContact = value;
    }

    get agentNamesToRecord() {

        return this._agentNamesToRecord;
    }

    addAgentNamesToRecord(namesArray) {

        if (!Array.isArray(namesArray))
        {
            PsyanimDebug.error("'namesArray' must be an array of strings!");
            return;
        }

        this._agentNamesToRecord = this._agentNamesToRecord.concat(namesArray);
    }

    get recordAnimationClips() {

        return this._recordAnimationClips;
    }

    set recordAnimationClips(value) {

        this._recordAnimationClips = value;
    }

    get recordStateLogs() {

        return this._recordStateLogs;
    }

    set recordStateLogs(value) {

        this._recordStateLogs = value;
    }

    get subtext() {

        return this._subtext;
    }

    set subtext(value) {

        this._subtext = value;
    }

    _getEntityDefinition(entityName) {

        let entityDefinition =  this._sceneDefinition.entities.find(e => e.name === entityName);

        if (!entityDefinition)
        {
            PsyanimDebug.error('No entity definition for entity named: ' + entityName);
        }

        return entityDefinition;
    }

    setEntityParameter(entityName, parameterName, value) {

        let entityDefinition = this._getEntityDefinition(entityName);

        if (!this._validEntityParameters.includes(parameterName))
        {
            PsyanimDebug.error("Parameter name '" + parameterName + "' is not a valid entity parameter. " + 
                "Valid parameters are: " + JSON.stringify(this._validEntityParameters));

            return;
        }

        entityDefinition[parameterName] = value;
    }

    setEntityShapeParameter(entityName, parameterName, value) {

        let entityDefinition = this._getEntityDefinition(entityName);

        if (!Object.hasOwn(entityDefinition, 'shapeParams'))
        {
            entityDefinition['shapeParams'] = {};
        }

        let shapeParams = entityDefinition['shapeParams'];

        if (!this._validShapeParameters.includes(parameterName))
        {
            PsyanimDebug.error("Shape parameter name '" + parameterName + "' is not a valid shape parameter. " + 
                "Valid parameters are: " + JSON.stringify(this._validShapeParameters));

            return;
        }

        shapeParams[parameterName] = value;
    }

    setEntityMatterOptions(entityName, parameterName, value) {

        let entityDefinition = this._getEntityDefinition(entityName);

        if (!Object.hasOwn(entityDefinition, 'matterOptions'))
        {
            entityDefinition['matterOptions'] = {};
        }

        let matterOptions = entityDefinition['matterOptions'];

        if (!this._validMatterOptions.includes(parameterName))
        {
            PsyanimDebug.error("Matter options parameter name '" + parameterName + "' is not a valid parameter. " + 
                "Valid parameters are: " + JSON.stringify(this._validMatterOptions));

            return;
        }

        matterOptions[parameterName] = value;
    }

    setPrefabParameter(entityName, parameterName, value) {

        let prefabParams = this.getPrefabParameters(entityName);

        prefabParams[parameterName] = value;

        if (this._saveParametersOnModification)
        {
            this.savePrefabParameter(entityName, parameterName);
        }
    }

    setComponentParameter(entityName, componentType, parameterName, value) {

        let componentParameters = this.getComponentParameters(entityName, componentType);

        componentParameters[parameterName] = value;

        if (this._saveParametersOnModification)
        {
            this.saveComponentParameter(entityName, componentType, parameterName);
        }
    }

    getSceneParameter(parameterName) {

        // TODO: validate parameter name

        return this._sceneDefinition[parameterName];
    }

    getEntityParameter(entityName, parameterName) {

        let entityDefinition = this._getEntityDefinition(entityName);

        if (!this._validEntityParameters.includes(parameterName))
        {
            PsyanimDebug.error("Parameter name '" + parameterName + "' is not a valid entity parameter. " + 
                "Valid parameters are: " + JSON.stringify(this._validEntityParameters));

            return;
        }

        return entityDefinition[parameterName];
    }

    getPrefabParameters(entityName) {

        let entityDefinition = this._getEntityDefinition(entityName);

        if (!Object.hasOwn(entityDefinition, 'prefab'))
        {
            PsyanimDebug.error('No prefab field found for entity named: ' + entityName);
            return;
        }

        let prefabDefinition = entityDefinition['prefab'];

        if (!Object.hasOwn(prefabDefinition, 'params'))
        {
            prefabDefinition['params'] = {};
        }

        return prefabDefinition['params'];
    }

    getComponentParameters(entityName, componentType) {

        let entityDefinition = this._getEntityDefinition(entityName);

        if (!Object.hasOwn(entityDefinition, 'components'))
        {
            PsyanimDebug.error('No components found for entity named: ' + entityName);
            return;
        }

        let componentDefinitions = entityDefinition['components'];

        let componentDefinition = componentDefinitions
            .find(c => c.type == componentType);

        if (!componentDefinition)
        {
            PsyanimDebug.error('Failed to find component type: ' + componentType.name);
            return;
        }

        if (!Object.hasOwn(componentDefinition, 'params'))
        {
            componentDefinition['params'] = {};
        }

        return componentDefinition['params'];
    }

    saveSceneParameter(parameterName) {

        let parameterValue = this.getSceneParameter(parameterName);

        let trialParameter = new PsyanimJsPsychTrialParameter(
            PsyanimJsPsychTrialParameter.Type.SCENE_PARAMETER,
            parameterName, parameterValue
        );

        if (!this._trialParametersToSave.find(p => p.is(trialParameter)))
        {
            this._trialParametersToSave.push(trialParameter);
        }
    }

    savePrefabParameter(entityName, parameterName) {

        let prefabParameters = this.getPrefabParameters(entityName);
        
        let parameterValue = prefabParameters[parameterName];

        let trialParameter = new PsyanimJsPsychTrialParameter(
            PsyanimJsPsychTrialParameter.Type.PREFAB_PARAMETER,
            parameterName, parameterValue, entityName
        );

        if (!this._trialParametersToSave.find(p => p.is(trialParameter)))
        {
            this._trialParametersToSave.push(trialParameter);
        }
    }

    saveComponentParameter(entityName, componentType, parameterName) {

        let componentParameters = this.getComponentParameters(entityName, componentType);

        let parameterValue = componentParameters[parameterName];

        let trialParameter = new PsyanimJsPsychTrialParameter(
            PsyanimJsPsychTrialParameter.Type.COMPONENT_PARAMETER,
            parameterName, parameterValue, entityName, componentType
        );

        if (!this._trialParametersToSave.find(p => p.is(trialParameter)))
        {
            this._trialParametersToSave.push(trialParameter);
        }
    }
}