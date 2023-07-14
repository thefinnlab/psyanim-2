
let moduleLevelPromise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(42), 1000);
});

describe('jasmine async tests', () => {
    it('basic async test', async function() {

        let moduleLevelPromiseResult = await moduleLevelPromise;

        expect(moduleLevelPromiseResult).toBe(42);
    });
});