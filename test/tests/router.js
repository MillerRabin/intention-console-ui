import router from '/apps/router/router.js';
import Browser from '/apps/browser/browser.js';

const assert = window.chai.assert;

describe('router', function () {
    it('#change state by name and params', function () {
        const route = router.push({ name: 'intentions', params: { language: 'ru' }});
        assert.equal(route.Constructor, Browser);
        const location = window.location.pathname;
        assert.equal(location, '/ru/browser.html');
    });
    it('#back', function (done) {
        router.back();
        setTimeout(function () {
            const location = window.location.pathname;
            assert.equal(location, '/test/testSuit.html');
            done();
        }, 100);
    });
});