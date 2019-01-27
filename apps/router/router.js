import loader from '../../core/loader.js';
import '../frontpage/frontpage.js';
import '../listener/listener.js';
import '../browser/browser.js';
import '../storages/storages.js';

loader.application('router', ['frontpage', 'listener', 'browser', 'storages', async (frontpage, listener, browser, storages) => {
    const routes = [
        { name: 'home', path: '/', component: frontpage.Constructor, meta: { active: 1 } },
        { name: 'listener', path: '/listener.html', component: listener.Constructor, meta: { active: 2 } },
        { name: 'browser', path: '/browser.html', component: browser.Constructor, meta: { active: 3 } },
        { name: 'storages', path: '/storages.html', component: storages.Constructor, meta: { active: 4 } }
    ];

    return new VueRouter({
        mode: 'history',
        routes: routes
    });
}]);
