import loader from '../loader.js';
import '../frontpage/frontpage.js';
import '../listener/listener.js';

loader.application('router', ['frontpage', 'listener', async (frontpage, listener) => {
    const routes = [
        { name: 'home', path: '/', component: frontpage.Constructor, meta: { active: 1 } },
        { name: 'listener', path: '/listener.html', component: listener.Constructor, meta: { active: 2 } }
    ];

    return new VueRouter({
        mode: 'history',
        routes: routes
    });
}]);
