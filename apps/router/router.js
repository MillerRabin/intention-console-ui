import loader from '../../core/loader.js';
import '../browser/browser.js';
import '../storages/storages.js';
import localization from '../../core/localization.js';
import IntentionStorage from '/node_modules/intention-storage/browser/main.js';

loader.application('router', ['browser', 'storages', async (intentions, storages) => {
    const lang = localization.get();
    if (window.location.pathname == '/') {
        window.location.assign(`/${lang.interface}/index.html`);
        return;
    }

    const routes = [
        { name: 'intentions', path: '/:language/index.html', component: intentions.Constructor, meta: { active: 1 } },
        { name: 'storages', path: '/:language/storages.html', component: storages.Constructor, meta: { active: 2 } }
    ];

    return new VueRouter({
        mode: 'history',
        routes: routes
    });



}]);

