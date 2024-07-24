import PsyanimEnum from './PsyanimEnum.js';

// test dynamic import of MyTask
const taskModule = await import('./MyTask.js');

// we can get task type name and methods w/o instantiating
let taskType = taskModule.default; // taskModule.default = MyTask

console.log('task name:', taskType.prototype.constructor.name);

console.log('methods:', Object.getOwnPropertyNames(taskType.prototype)
    .filter(n => !n.startsWith('_') && n != 'constructor'));

// we must create instance of type to inspect it's keys
let taskInstance = new taskType();
let keys = Object.keys(taskInstance).filter(key => !key.startsWith('_'));

let keyInfo = [];

keys.forEach(key => {

    let value = taskInstance[key];

    if (value instanceof PsyanimEnum)
    {
        keyInfo.push({ 
            name: key, 
            type: PsyanimEnum.prototype.constructor.name, 
            options: taskInstance[key].options 
        });
    }
    else if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number')
    {
        keyInfo.push({ name: key, type: typeof value });
    }
    else
    {
        console.error("ERROR: failed to recognize type:", typeof value);
        process.exit(-1);
    }
});

console.log('variables:', keyInfo);