import loader from '../../core/loader.js';
import localization from '../../core/localization.js';
import config from '../../intentions/config.js'

loader.application('tasks', [async () => {
    function init() {
        return {
            loaded: false,
            tasks: []
        }
    }

    function createIntentions(vm) {
        vm.iTasks = config.intentionStorage.createIntention({
            title: {
                en: 'Need access to tasks information',
                ru: 'Нужен доступ к списку задач'
            },
            input: 'TaskInfo',
            output: 'None',
            onData: async (status, intention, interfaceObject) => {
                if (status == 'data')
                    Vue.set(vm, 'tasks', interfaceObject.query());
            }
        });
    }

    function deleteIntentions(vm) {
        config.intentionStorage.deleteIntention(vm.iTasks, 'client tasks');
    }

    const lang = localization.get();
    await loader.createVueTemplate({ path: 'tasks.html', id: 'Tasks-Template', meta: import.meta });
    const res = {};
    res.Constructor = Vue.component('tasks', {
        template: '#Tasks-Template',
        data: init,
        methods: {
            getText: function (contextText) {
                return localization.getText(lang, contextText);
            }
        },
        mounted: function () {
            this.loaded = true;
            createIntentions(this);
        },
        destroyed: function () {
            this.loaded = false;
            deleteIntentions(this);
        }
    });
    return res;
}]);