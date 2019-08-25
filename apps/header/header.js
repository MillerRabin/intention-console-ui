import localization from "../../core/localization.js";
import loader from "../../core/loader.js";
import router from "../router/router.js";
import config from "../../intentions/config.js";

const gLang = localization.get();
const gTemplateP = loader.request(`/apps/header/${gLang.interface}/header.html`);

router.on.change(function () {
    setActiveLink();
});

function changeLanguage(lang) {
    const loc = localization.set(lang);
    window.location.assign(`/${loc.interface}/index.html`);
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


function setActiveLink() {
    const links = window.document.querySelectorAll('#Header .top .route-link');
    const activeLink = window.document.querySelector('#Header .top .route-link.active');
    if (router.activeRoute == null) return;
    const active = router.activeRoute.active;
    if (activeLink != null)
        activeLink.classList.remove('active');
    const aLink = links[active];
    if (aLink == null) return;
    aLink.classList.add('active');
}

function enableLanguageSelection(header) {
    function selectLanguage(event) {
        const target = event.target;
        changeLanguage(target.value);
        header._langDlg.close();
    }

    const langBtn = header.mount.querySelector('#Header button.lang');
    langBtn.onclick = () => {
        try {
            header._langDlg.showModal();
        } catch (e) {
            console.log(e);
        }

    };

    const langInputs = header._langDlg.querySelectorAll('input');
    for (let lang of langInputs)
        lang.onchange = selectLanguage;
}

export default class Header {
    constructor(mount) {
        this._mount = mount;
        this.render();
    }

    async render() {
        this._mount.innerHTML = (await gTemplateP).text;
        this._langDlg = this._mount.querySelector('#Header dialog.lang');
        setActiveLink();
        enableLanguageSelection(this);
    }

    get mount() {
        return this._mount;
    }
}