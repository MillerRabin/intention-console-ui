import loader from '../../core/loader.js';
import route from '../router/router.js';
import config from '../../intentions/config.js';
import '../listener/listener.js'
import '../tasks/tasks.js'
import localization from '../../core/localization.js';

let mount =  null;
let langDlg = null;
let langBtn = null;

function changeLanguage(lang) {
    const loc = localization.set(lang);
    window.location.assign(`/${loc.interface}/index.html`);
}

function createIntentions(vm) {
    config.intentionStorage.createIntention({
        title: {
            en: 'Console navigation',
            ru: 'Осуществляю навигацию по консоли'
        },
        input: 'None',
        output: 'NavigationResult',
        onData: async function onData(status, intention, value) {
            if (status != 'data') return;
            let vl = (value == null) ? intention.value : value;
            if (vl != null) {
                intention.send('completed', this, { success: true });
                router.push({ name: vl.value, params: { language: vm.lang.interface } });
            }
        }
    });
}

config.intentionStorage.createIntention({
    title: {
        en: 'Can change console localization',
        ru: 'Меняю локализацию консоли'
    },
    input: 'Language',
    output: 'ChangeLanguageOperationInfo',
    onData: async function onData(status, intention) {
        if (status != 'data') return;
        try {
            intention.send('completed', this, { success: true });
            const parameters = intention.parameters;
            changeLanguage(parameters[0].value);
        } catch (e) {
            console.log(e);
            intention.send('error', this, e);
        }
    }
});

function selectLanguage(event) {
    const target = event.target;
    changeLanguage(target.value);
    langDlg.close();
}


function enableLanguageSelection() {
    langBtn.onclick = () => {
        langDlg.showModal();
    };

    const langInputs = langDlg.querySelectorAll('input');
    for (let lang of langInputs)
        lang.onchange = selectLanguage;
}

loader.globalContentLoaded.then(() => {
    mount = window.document.getElementById('Intention');
    langDlg = mount.querySelector('#Header dialog.lang');
    langBtn = mount.querySelector('#Header button.lang');
    enableLanguageSelection();
    createIntentions();
});