import loader from '../../core/loader.js';
import '../browser/browser.js';
import '../storages/storages.js';
import localization from '../../core/localization.js';

loader.application('router', ['browser', 'storages', async (browser, storages) => {
    const lang = localization.get();
    if (window.location.pathname == '/') {
        window.location.assign(`/${lang.interface}/index.html`);
        return;
    }

    const routes = [
        { name: 'browser', path: '/:language/index.html', component: browser.Constructor, meta: { active: 1 } },
        { name: 'storages', path: '/storages.html', component: storages.Constructor, meta: { active: 2 } }
    ];

    return new VueRouter({
        mode: 'history',
        routes: routes
    });
}]);
