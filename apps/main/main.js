import loader from '../../core/loader.js';
import '../router/router.js';
import '../../intensions/config.js';
import '../listener/listener.js'
import localization from '../../core/localization.js';

loader.application('Main', ['router', 'listener', async (router) => {
    const data = {
        loaded: false,
        disabled: false,
        active: 1,
        langDlg: null,
        lang: null,
        langRadio: null
    };

    data.application = new Vue({
        el: '#Intension',
        router: router,
        data: data,
        methods: {
            showLangDialog: function () {
                this.langDlg.showModal();
            },
            selectLanguage: function () {
                setTimeout(() => {
                    this.lang = localization.set(this.langRadio);
                    window.location.assign(`/${this.lang.interface}/index.html`);
                    this.langDlg.close();
                });
            }
        },
        mounted: async function () {
            this.loaded = true;
            this.active = this.$route.meta.active;
            this.lang = localization.get();
            this.langDlg = this.$el.querySelector('#Header dialog.lang')
        }
    });

    return data;
}]);