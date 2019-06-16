import router from '/apps/router/router.js';
import Browser from '/apps/browser/browser.js';

const assert = window.chai.assert;

describe('router', function () {
    it('#change state by name and params', async function () {
        const route = router.push({ name: 'intentions', params: { language: 'ru' }});
        assert.equal(route.Constructor, Browser);
        const location = window.location.pathname;
        assert.equal(location, '/ru/index.html');
    });
    it('#back', function (done) {
        router.back();
        setTimeout(function () {
            const location = window.location.pathname;
            assert.equal(location, '/test/testSuit.html');
            done();
        });
    });
});