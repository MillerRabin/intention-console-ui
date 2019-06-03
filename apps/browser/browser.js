import loader from '../../core/loader.js';
import '../tree/tree.js';
import localization from '../../core/localization.js';
import config from '../../intentions/config.js';

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
            intention.mtime = window.moment(intention.createTime);
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
            intention.mtime = window.moment(intention.createTime);
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
            this.intention = config.intentionStorage.createIntention({
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
            config.intentionStorage.deleteIntention(this.intention, 'client closed browser');
            this.loaded = false;
        }
    });
    return res;
}]);