import main from '/apps/main/main.js'
const assert = window.chai.assert;

describe('Main', function () {
    it('Check initialization', async function () {
        await main.loaded;
        const listenerM = window.document.getElementById('Listener');
        assert.ok(listenerM);
        const listener = listenerM.scope;
        assert.ok(listener);
    });

    it('Wait', function (done) {
        this.timeout(11000);
        setTimeout(function () {
            done();
        }, 5000);
    });
});