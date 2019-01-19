import loader from '../../core/loader.js';
import intensionStorage from '/node_modules/intension-storage/main.js';
import '../tree/tree.js';

loader.application('browser', ['tree', async () => {
    function init() {
        return {
            loaded: false,
            sortMode: 'byOrigin',
            list: createTree('Root'),
            intension: null,
            ilist: null,
            selected: null
        }
    }

    function createTree(name, value) {
        return { name: name, childs: [], opened: true, path: name, single: true, showRoot: name != 'Root', value: value };
    }

    function byName(a, b) {
        if (a.name > b.name) return -1;
        if (a.name < b.name) return 1;
        return 0;
    }

    function sortByOrigin(vm) {
        const hash = new Map();
        for (let intension of vm.ilist) {
            intension.mtime = window.moment(intension.time);
            if (!hash.has(intension.origin)) hash.set(intension.origin, createTree(intension.origin));
            const origin = hash.get(intension.origin);
            origin.childs.push(createTree(intension.key, intension))
        }
        for (let [,origin] of hash) {
            origin.childs.sort(byName);
        }
        return [...hash.values()].sort(byName);
    }

    function sortByKey(vm) {
        const hash = new Map();
        for (let intension of vm.ilist) {
            intension.mtime = window.moment(intension.time);
            if (!hash.has(intension.key)) hash.set(intension.key, createTree(intension.key));
            const key = hash.get(intension.key);
            key.childs.push(createTree(intension.origin, intension))
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

    await loader.createVueTemplate({ path: 'apps/browser/browser.html', id: 'Browser-Template' });
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
            }
        },
        mounted: function () {
            this.loaded = true;
            this.intension = intensionStorage.create({
                title: 'need return intensions information',
                input: 'InterfaceObject',
                output: 'None',
                onData: async (status, intension, interfaceObject) => {
                    if (status != 'data') return;
                    this.ilist = interfaceObject.query();
                    sortHash(this);
                }
            });
        },
        destroyed: function () {
            intensionStorage.delete(this.intension, 'client closed browser');
        }
    });
    return res;
}]);