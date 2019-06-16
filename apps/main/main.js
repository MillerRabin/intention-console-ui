import loader from '../../core/loader.js';
import router from '../router/router.js';
import config from '../../intentions/config.js';
import Listener from '../listener/listener.js';
import Tasks from '../tasks/tasks.js'
import localization from '../../core/localization.js';

let gMount =  null;
let langDlg = null;
let langBtn = null;
let listener = null;
let tasks = null;

function changeLanguage(lang) {
    const loc = localization.set(lang);
    window.location.assign(`/${loc.interface}/index.html`);
}

function createIntentions() {
    const lang = localization.get();
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
                router.push({ name: vl.value, params: { language: lang.interface } });
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

router.on.change(function () {
    setActiveLink();
});

function setActiveLink() {
    const links = window.document.querySelectorAll('#Header .top .router-link');
    const activeLink = window.document.querySelector('#Header .top .router-link.active');
    const active = router.activeRoute.active;
    if (activeLink != null)
        activeLink.classList.remove('active');
    const aLink = links[active];
    aLink.classList.add('active');
}


loader.globalContentLoaded.then(() => {
    gMount = window.document.getElementById('Intention');
    langDlg = gMount.querySelector('#Header dialog.lang');
    langBtn = gMount.querySelector('#Header button.lang');
    const listenerM = window.document.getElementById('Listener');
    listener = new Listener(listenerM);
    listenerM.scope = listener;
    const tasksM = window.document.getElementById('Tasks');
    tasks = new Tasks(tasksM);
    setActiveLink();
    enableLanguageSelection();
    createIntentions();
});