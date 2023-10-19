import config from '../../intentions/config.js'
import localization from "../../core/localization.js";
import loader from "../../core/loader.js";
import dom from "../../core/dom.js";

const gLang = localization.get();
const gTemplateP = loader.request(`/apps/storages/${gLang.interface}/storages.html`);


function createIntentions(storages) {
    storages.intention = config.intentionStorage.createIntention({
        title: {
            en: 'Need data about linked storages',
            ru: 'Необходимы данные о связанных хранилищах'
        },
        input: 'StorageStats',
        output: 'None',
        onData: async (status, intention, interfaceObject) => {
            if (status != 'data') return;
            storages.data = interfaceObject.queryLinkedStorages();
        }
    });
}

function deleteIntentions(vm) {
    config.intentionStorage.deleteIntention(vm.intention, 'client closed browser');
}

async function render(storages) {
    storages._mount.innerHTML = (await gTemplateP).text;
    storages._content = storages._mount.querySelector('.content > .border-box');
}

function getStorageStatus(storage) {
    if (storage.status == 'open') return 1;
    return storage.status;
}


function updateStorages(storages) {
    dom.clearChilds(storages._content);
    for (let storage of storages._data) {
        const sd = window.document.createElement('div');
        sd.className = 'storage';
        const status = getStorageStatus(storage);
        if (status != 1) sd.classList.add('error');
        sd.innerHTML = `<h2>${storage.key}</h2>
                        <span>${(status != 1) ? 'offline' : 'online'}</span>`;
        storages._content.appendChild(sd);
    }
}

export default class Storages {
    constructor(mount) {
        this._mount = mount;
        this._data = null;
        createIntentions(this);
        render(this);
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        updateStorages(this);
    }

    unmount() {
        deleteIntentions(this);
    }
}
