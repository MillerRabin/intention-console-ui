import loader from '../../core/loader.js';
import '../browser/browser.js';
import '../storages/storages.js';

loader.application('router', ['browser', 'storages', async (browser, storages) => {
    const routes = [
        { name: 'browser', path: '/', component: browser.Constructor, meta: { active: 1 } },
        { name: 'storages', path: '/storages.html', component: storages.Constructor, meta: { active: 2 } }
    ];

    return new VueRouter({
        mode: 'history',
        routes: routes
    });
}]);
