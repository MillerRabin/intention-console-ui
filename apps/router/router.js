import Browser from '../browser/browser.js';
import Storages from '../storages/storages.js';
import localization from '../../core/localization.js';

const lang = localization.get();
if (window.location.pathname == '/') {
    window.location.assign(`/${lang.interface}/index.html`);
}

const routes = [
    { name: 'intentions', path: '/:language/index.html', component: Browser, active: 1 },
    { name: 'storages', path: '/:language/storages.html', component: Storages, active: 2 }
];

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
    for (let route of routes) {
        const match = matchParameters(route, path);
        if (match == null) continue;
        return match;
    }
    return null;
}


async function applyRoute(routes, path) {
    const route = matchRoute(routes, path);
    console.log(route);
}


pathToReg(routes);
applyRoute(routes, window.location.pathname);

export default {

}
