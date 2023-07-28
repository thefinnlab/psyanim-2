
// basic promise returned from async
async function simpleConstant() {
    return Promise.resolve(1);
};

simpleConstant().then((result) => console.log("result = " + result));

// promise result awaited in async method
async function setTimeoutPromise() {

    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 1000);
    });

    let result = await promise;

    console.log(result);
};

// promise result awaited at module-level
await setTimeoutPromise();

let moduleLevelPromise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(42), 1000);
});

let moduleLevelPromiseResult = await moduleLevelPromise;

console.log("moduleLevelPromiseResult = " + moduleLevelPromiseResult);