import loader from '../../core/loader.js';
import '../frontpage/frontpage.js';
import '../listener/listener.js';
import '../browser/browser.js';

loader.application('router', ['frontpage', 'listener', 'browser', async (frontpage, listener, browser) => {
    const routes = [
        { name: 'home', path: '/', component: frontpage.Constructor, meta: { active: 1 } },
        { name: 'listener', path: '/listener.html', component: listener.Constructor, meta: { active: 2 } },
        { name: 'browser', path: '/browser.html', component: browser.Constructor, meta: { active: 3 } }
    ];

    return new VueRouter({
        mode: 'history',
        routes: routes
    });
}]);
