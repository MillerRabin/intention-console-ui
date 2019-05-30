import loader from '../../core/loader.js';
import '../tree/tree.js';
import localization from '../../core/localization.js';
import config from '../../intentions/config.js';


function createTree(name, value) {
    return { name: name, childs: [], opened: true, path: name, single: true, showRoot: name != 'Root', value: value };
}

function byName(a, b) {
    if ((a.value == null) || (b.value == null)) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    }
    if (a.value.title < b.value.title) return -1;
    if (a.value.title > b.value.title) return 1;
    return 0;
}

function sortByOrigin(vm) {
    const hash = new Map();
    for (let intention of vm.ilist) {
        intention.mtime = window.moment(intention.time);
        const oname = intention.origin == null ? 'local' : intention.origin;
        if (!hash.has(oname)) hash.set(oname, createTree(oname));
        const origin = hash.get(oname);
        origin.childs.push(createTree(intention.key, intention))
    }
    for (let [,origin] of hash) {
        origin.childs.sort(byName);
    }
    return [...hash.values()].sort(byName);
}

function sortByKey(vm) {
    const hash = new Map();
    for (let intention of vm.ilist) {
        intention.mtime = window.moment(intention.time);
        if (!hash.has(intention.key)) hash.set(intention.key, createTree(intention.key));
        const key = hash.get(intention.key);
        key.childs.push(createTree(intention.origin == null ? 'local' : intention.origin, intention))
    }
    for (let [,key] of hash) {
        key.childs.sort(byName);
    }
    return [...hash.values()].sort(byName);
}

function sortHash(vm) {
    if (vm.ilist == null) return;
    if (vm.sortMode == 'byOrigin') {
        vm.list.childs = sortByOrigin(vm);
        return;
    }
    if (vm.sortMode == 'byKey') {
        vm.list.childs = sortByKey(vm);
        return;
    }
    throw new Error(`Sort ${ vm.sortMode } is unsupported`);
}


function byOrigin() {
    this.sortMode = 'byOrigin';
    sortHash(this);
}

function byKey() {
    this.sortMode = 'byKey';
    sortHash(this);
}

function createIntention() {
    return config.intentionStorage.createIntention({
        title: {
            en: 'Need data about intentions',
            ru: 'Необходимы данные о намерениях'

        },
        input: 'StorageStats',
        output: 'None',
        onData: async (status, intention, interfaceObject) => {
            if (status != 'data') return;
            this.ilist = interfaceObject.queryIntentions();
            sortHash(this);
        }
    });
}

function onchecked(selected) {
    const vals = Object.values(selected);
    if (vals.length == 0) return;
    this.selected = vals[0].value;
}

function getText(contextText) {
    return localization.getText(lang, contextText);
}

const lang = localization.get();
const templateP = loader.request(`apps/browser/${lang.interface}/browser.html`);

async function mount(mount) {
    const template = await templateP;
    mount.innerHTML = template.text;
}

async function unmount(mount) {
    config.intentionStorage.deleteIntention(this.intention, 'client closed browser');
}

export default class Browser {
    constructor(mount) {
        this._mount = mount;
    }

    unmount() {

    }
}