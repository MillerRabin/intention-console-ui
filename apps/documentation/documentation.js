import loader from '../../core/loader.js';
import localization from '../../core/localization.js';
import '../highlight/javascript.js';

const gLang = localization.get();
const gTemplateP = loader.request(`/apps/documentation/${gLang.interface}/material.html`);
const gMenuP = loader.request(`/apps/documentation/${gLang.interface}/menu.html`);

function getMaterial(route) {
    const np = route.params[1];
    const name = (np == null) ? 'what-is-what.html' : np.name;
    return loader.request(`/apps/documentation/${gLang.interface}/${name}`);
}

function unselectDoc(mount) {
    const active = mount.querySelector('.menu ul li a.active');
    if (active != null)
        active.classList.remove('active');
}

function selectByIndex(menuItems, index) {
    const item = menuItems[index];
    if (item == null) return;
    item.classList.add('active');
}

function searchByLoc(menuItems, route) {
    const spath = route.link;
    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        const href = item.getAttribute('href');
        if (href == spath) return i;
    }
    return null;
}

function selectDoc(mount, route) {
    unselectDoc(mount);
    const menuItems = mount.querySelectorAll('.menu ul li.level a');
    if (route.materialActive != null) {
        selectByIndex(menuItems, route.materialActive);
        return;
    }
    const index = searchByLoc(menuItems, route);
    if (index != null)
        selectByIndex(menuItems, index);
}

export default class Documentation {
    constructor(mount, route) {
        this._mount = mount;
        this._route = route;
        this.render();
    }

    async render() {
        this._mount.innerHTML = (await gTemplateP).text;
        const menu = this._mount.querySelector('.menu');
        menu.innerHTML = (await gMenuP).text;
        const material = this._mount.querySelector('.material');
        const doc = await getMaterial(this._route);
        material.innerHTML = doc.text;
        selectDoc(this._mount, this._route);
    }

    unmount() {

    }

    get mount() {
        return this._mount;
    }
}