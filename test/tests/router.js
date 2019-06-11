import router from '/apps/router/router.js';
const assert = window.chai.assert;

describe('router', function () {
    it('#change state by name and params', async function () {
        router.push({ name: 'intentions', params: { language: 'ru', noMount: true }});
    });
});