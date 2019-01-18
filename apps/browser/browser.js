import loader from '../../core/loader.js';
import intensionStorage from '../../services/IntensionStorage/IntensionStorage.js';
import '../tree/tree.js';

async function onError(intension, error) {
    console.log(error);
}

async function onClose(intension, info) {
    console.log(info);
}

loader.application('browser', ['tree', async () => {
    function init() {
        return {
            loaded: false,
            sortMode: 'byOrigin',
            list: createTree('Root'),
            intension: null
        }
    }

    function createTree(name) {
        return { name: name, childs: [], opened: true, path: name, single: true, showRoot: name != 'Root' };
    }

    async function queryIntension(vm, interfaceObject) {
        vm.list.childs = await interfaceObject.query({ sort: vm.sortMode });
    }

    await loader.createVueTemplate({ path: 'apps/browser/browser.html', id: 'Browser-Template' });
    const res = {};

    res.Constructor = Vue.component('browser', {
        template: '#Browser-Template',
        data: init,
        methods: {
            byOrigin: function () {
                this.sortMode = 'byOrigin';
            },
            byKey: function () {
                this.sortMode = 'byKey';
            }
        },
        mounted: function () {
            this.loaded = true;
            this.intension = intensionStorage.create({
                title: 'need return intensions information',
                input: 'InterfaceObject',
                output: 'None',
                onAccept: async (intension, interfaceObject) => {
                    queryIntension(this, interfaceObject);
                },
                onData: async (intension, interfaceObject) => {
                    queryIntension(this, interfaceObject);
                },
                onClose: onClose,
                onError: onError
            });
        },
        destroyed: function () {
            intensionStorage.delete(this.intension, 'client closed browser');
        }
    });
    return res;
}]);