import loader from '../../core/loader.js';
import intentionStorage from '/node_modules/intention-storage/browser/main.js';
import '../tree/tree.js';
import localization from '../../core/localization.js';

loader.application('browser', ['tree', async () => {
    function init() {
        return {
            loaded: false,
            sortMode: 'byOrigin',
            list: createTree('Root'),
            intention: null,
            ilist: null,
            selected: null
        }
    }

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
            if (!hash.has(intention.origin)) hash.set(intention.origin, createTree(intention.origin));
            const origin = hash.get(intention.origin);
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
            key.childs.push(createTree(intention.origin, intention))
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

    const lang = localization.get();
    await loader.createVueTemplate({ path: 'browser.html', id: 'Browser-Template', meta: import.meta, localization: { use: lang.interface } });
    const res = {};

    res.Constructor = Vue.component('browser', {
        template: '#Browser-Template',
        data: init,
        methods: {
            byOrigin: function () {
                this.sortMode = 'byOrigin';
                sortHash(this);
            },
            byKey: function () {
                this.sortMode = 'byKey';
                sortHash(this);
            },
            onchecked: function(selected) {
                const vals = Object.values(selected);
                if (vals.length == 0) return;
                this.selected = vals[0].value;
            },
            getText(contextText) {
                return localization.getText(lang, contextText);
            }
        },
        mounted: function () {
            intentionStorage.enableStats();
            this.intention = intentionStorage.create({
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
            this.loaded = true;
        },
        destroyed: function () {
            intentionStorage.delete(this.intention, 'client closed browser');
            this.loaded = false;
        }
    });
    return res;
}]);