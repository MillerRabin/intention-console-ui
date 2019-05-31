import Browser from '../browser/browser.js';
import Storages from '../storages/storages.js';
import localization from '../../core/localization.js';
import messages from '../messages/messages.service.js';


const lang = localization.get();
let activeComponent = null;

const gRouter = {
    activeRoute: null,
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

    reg.push();
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
    window.history.pushState(route.state, route.state.title, route.link);
}

function changeRoute(event) {
    applyRoute(routes, event.target.href);
    return false;
}

window.onpopstate = async function (event) {

};

function reloadLinks() {
    const links = window.document.querySelectorAll('.router-link');
    for (let link of links) {
        link.onclick = changeRoute;
    }
}

async function applyRoute(routes, path) {
    const route = matchRoute(routes, path);
    if (activeComponent != null)
        activeComponent.unmount();
    gRouter.activeRoute = route;
    activeComponent = new route.Contructor(gMount);
    reloadLinks();
    messages.send('router.change', { router: gRouter, route });
}

pathToReg(routes);
applyRoute(routes, window.location.href);

export default gRouter;
