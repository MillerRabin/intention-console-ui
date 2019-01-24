import loader from '../../core/loader.js';
import '/apps/browser/browser.js';

const Browser = loader.wait('browser');
const expect = window.chai.expect;

describe('Browser', function () {
    let browser = null;

    it('#loads', async function () {
        browser = await Browser;
    });

    it('#mounts', async function () {
        const bi = await Browser;
        browser = new bi.Constructor().$mount();
        expect(browser.loaded).to.equal(true);
    });

    it('#destroys', async function () {
        browser.$destroy();
        expect(browser.loaded).to.equal(false);
    });
});