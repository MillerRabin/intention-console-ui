import loader from '../../core/loader.js';
import '/apps/listener/listener.js';

const Listener = loader.wait('listener');
const expect = window.chai.expect;

describe('Listener', function () {
    let listener = null;

    it('#loads', async function () {
        listener = await Listener;
    });

    it('#mounts', async function () {
        const bi = await Listener;
        listener = new bi.Constructor().$mount();
        expect(listener.loaded).to.equal(true);
    });

    it('#destroys', async function () {
        listener.$destroy();
        expect(listener.loaded).to.equal(false);
    });
});