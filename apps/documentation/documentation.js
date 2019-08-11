import loader from '../../core/loader.js';
import localization from '../../core/localization.js';

const gLang = localization.get();
const gTemplateP = loader.request(`/apps/documentation/${gLang.interface}/material.html`);
const gMenuP = loader.request(`/apps/documentation/${gLang.interface}/menu.html`);
const gMaterialP = getMaterial();

function getMaterial() {
    const name = 'what-is-what';
    return loader.request(`/apps/documentation/${gLang.interface}/${name}.html`);
}

export default class Documentation {
    constructor(mount) {
        this._mount = mount;
        this.render();
    }

    setActive(index) {
        const active = this._mount.querySelector('.menu ul li a.active');
        if (active != null)
            active.classList.remove('active');
        const menuItems = this._mount.querySelectorAll('.menu ul li.level');
        const item = menuItems[index];
        if (item == null) return;
        const anchor = item.querySelector('a');
        anchor.classList.add('active');
    }

    async render() {
        this._mount.innerHTML = (await gTemplateP).text;
        const menu = this._mount.querySelector('.menu');
        menu.innerHTML = (await gMenuP).text;
        const material = this._mount.querySelector('.material');
        material.innerHTML = (await gMaterialP).text;
        this.setActive(0);
    }

    unmount() {

    }

    get mount() {
        return this._mount;
    }
}