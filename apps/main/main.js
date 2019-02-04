import loader from '../../core/loader.js';
import '../router/router.js';
import '../../intensions/config.js';
import '../listener/listener.js'
import localization from '../../core/localization.js';
import IntensionStorage from '/node_modules/intension-storage/browser/main.js';

function changeLanguage(lang) {
    const loc = localization.set(lang);
    window.location.assign(`/${loc.interface}/index.html`);
}

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
                    changeLanguage(this.langRadio);
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

IntensionStorage.create({
    title: {
        en: 'Can change console localization',
        ru: 'Могу сменить локализацию консоли'
    },
    input: 'Language',
    output: 'ChangeLanguageOperationInfo',
    onData: async function onData(status, intension) {
        if ((status != 'accept') && (status != 'data')) return;
        try {
            intension.send('data', this, { success: true });
            const parameters = intension.getParameters();
            changeLanguage(parameters[0].value);
        } catch (e) {
            intension.send('error', this, e);
        }
    }
});