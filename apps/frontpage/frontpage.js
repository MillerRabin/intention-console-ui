import loader from '../../core/loader.js';

loader.application('frontpage', [async () => {
    function init() {
        return {
            loaded: false
        }
    }

    await loader.createVueTemplate({ path: 'apps/frontpage/frontpage.html', id: 'FrontPage-Template' });
    const res = {};
    res.Constructor = Vue.component('frontpage', {
        template: '#FrontPage-Template',
        data: init,
        watch:{},
        methods: {},
        mounted: function () {
            this.loaded = true;
        }
    });
    return res;
}]);