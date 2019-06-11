import Browser from '../browser/browser.js';
import Storages from '../storages/storages.js';
import localization from '../../core/localization.js';
import messages from '../messages/messages.service.js';


const lang = localization.get();
let activeComponent = null;

const gRouter = {
    activeRoute: null,
    push: changeState,
    on: {
        change: onChangeRoute
    },
    off: {
        change: offChangeRoute
    }
};

const gMount = window.document.getElementById('Router');

if (window.location.pathname == '/') {
    window.location.assign(`/${lang.interface}/index.html`);
}

const routes = [
    { name: 'intentions', path: '/:language/index.html', Contructor: Browser, active: 0 },
    { name: 'storages', path: '/:language/storages.html', Contructor: Storages, active: 1 }
];

function onChangeRoute(callback) {
    messages.on('router.change', callback)
}

function offChangeRoute(callback) {
    messages.off('router.change', callback)
}

function splitPath(path) {
    const pathItems = path.split('/');
    const res = [];
    for (let item of pathItems) {
        const iarr = item.split(':');
        const rItem = { path: item };
        if (iarr.length == 1) {
            rItem.reg = item;
            res.push(rItem);
            continue;
        }
        rItem.paramName = iarr[1];
        rItem.reg = '(.+)';
        res.push(rItem);
    }
    return res;
}

function getLink(href) {
    const origin = window.location.origin;
    const larr = href.split(origin);
    if (larr.length > 1)
        return larr[1];
    return href;
}

function buildPath(pathItems) {
    const reg = [];
    const params = [];

    for (let item of pathItems) {
        reg.push(item.reg);
        if (item.paramName == null) continue;
        params.push(item.paramName);
    }

    return {
        reg: new RegExp('^' + reg.join('/') + '$', 'i'),
        params: params
    }
}

function createRegPath(path) {
    const pathItems = splitPath(path);
    return buildPath(pathItems);
}

function pathToReg(routes) {
    for (let route of routes)
        route.pathReg = createRegPath(route.path);
}

function matchParameters(route, path) {
    const pathReg = route.pathReg;
    const match = pathReg.reg.exec(path);
    if (match == null) return null;
    const tRoute = Object.assign({ params: [] }, route);
    tRoute.link = path;
    for (let i = 0; i < pathReg.params.length; i++) {
        const rObj = {};
        const name = pathReg.params[i];
        rObj[name] = match[i + 1];
        tRoute.params.push(rObj);
    }
    return tRoute;
}

function matchRoute(routes, path) {
    const link = getLink(path);
    for (let route of routes) {
        const match = matchParameters(route, link);
        if (match == null) continue;
        if (match.Contructor == null) continue;
        return match;
    }
    return null;
}

function pushState(route) {
    window.history.pushState({ link: route.link }, route.name, route.link);
}

function changeRoute(event) {
    const route = applyRoute(routes, event.target.href);
    pushState(route);
    return false;
}

window.onpopstate = async function (event) {
    const state = event.state;
    applyRoute(routes, state.link);
};

function reloadLinks() {
    const links = window.document.querySelectorAll('.router-link');
    for (let link of links) {
        link.onclick = changeRoute;
    }
}

function buildLink(route) {
    //const paths =
}

function changeState(routeParams) {
    let route = null;
    if (routeParams.name != null) {
        route = routes.find(r => r.name == routeParams.name);
        if (route == null) return null;
        const tRoute = Object.assign({ params: routeParams.params }, route);
        if (!routeParams.params.noMount)
            setNewRoute(tRoute);
        tRoute.link = buildLink(tRoute);
        pushState(tRoute);
        return tRoute;
    }
    return null;
}

function setNewRoute(route) {
    if (activeComponent != null)
        activeComponent.unmount();
    if (route == null) return null;
    gRouter.activeRoute = route;
    activeComponent = new route.Contructor(gMount);
    reloadLinks();
    messages.send('router.change', { router: gRouter, route });
}

function applyRoute(routes, path) {
    const route = matchRoute(routes, path);
    setNewRoute(route);
    return route;
}

pathToReg(routes);
applyRoute(routes, window.location.href);

export default gRouter;
