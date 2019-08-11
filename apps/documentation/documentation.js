import loader from '../../core/loader.js';
import localization from '../../core/localization.js';

const gLang = localization.get();
const gTemplateP = loader.request(`/apps/documentation/${gLang.interface}/material.html`);

export default class Documentation {
    constructor(mount) {
        this._mount = mount;
        this.render();
    }

    async render() {
        this._mount.innerHTML = (await gTemplateP).text;
    }

    unmount() {

    }

    get mount() {
        return this._mount;
    }
}