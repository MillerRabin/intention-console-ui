import loader from '../../core/loader.js';

loader.application('intensionsBrowser', [async () => {
    function init() {
        return {
            loaded: false
        }
    }

    await loader.createVueTemplate({ path: 'apps/intensionsBrowser/intensionsBrowser.html', id: 'IntensionsBrowser-Template' });
    const res = {};

    res.Constructor = Vue.component('intensionsBrowser', {
        template: '#IntensionsBrowser-Template',
        data: init,
        methods: {},
        mounted: function () {
            this.loaded = true;
        }
    });
    return res;
}]);