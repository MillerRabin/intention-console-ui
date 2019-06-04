import config from '../../intentions/config.js'
import localization from '../../core/localization.js';
import loader from "../../core/loader.js";
import dom from "../../core/dom.js";

const gLang = localization.get();
const gTemplateP = loader.request(`/apps/listener/${gLang.interface}/listener.html`);

function addAnswer(listener, answer, ext = true) {
    appendAnswer(listener, answer, ext);
    const offset = listener.output.scrollTop + listener.output.clientHeight;
    const sh = listener.output.scrollHeight;
    const threshold = 10;
    if ((sh >= offset - threshold) && (sh <= offset + threshold))
        setTimeout(() => {
            listener.output.scrollTop = listener.output.scrollHeight - listener.output.clientHeight;
        });
}

function buildAlternatives(answer) {
    const templates = [];
    for (let alt in answer.alternatives) {
        templates.push(
            `<div>
                <div class="text">
                <span>${getText(alt.transcript)}</span>
            </div>`
        );
    }
    return templates.join('');
}

function appendAnswer(listener, answer, ext) {
    const time = window.moment(answer.time);
    const ad = window.document.createElement('div');
    ad.className = 'answer';
    if (ext)
        ad.classList.add('ext');
    ad.innerHTML = `<div class="top">
                        <span class="time">${ time.format('DD-MMM-YYYY HH:mm:ss.SSS') }</span>
                        ${(answer.context != null) ? `<span class="contex">{[${getText(answer.context)}]}</span>` : '' }
                    </div>
                    <pre>${getText(answer.text)}</pre>
                    ${ ((answer.alternatives != null) && (answer.alternatives.length > 0)) ?
                        `<div class="alternatives">
                            <button>
                                <span class="${ dom.class({'icon': true, 'icon-plus-squared-alt': !answer.showAlternatives, 'icon-minus-squared-alt': answer.showAlternatives})}"></span>
                                <span>Alternatives</span>
                            </button>
                            ${ answer.showAlternatives ? buildAlternatives(answer): '' }
                        </div>` : '' }`;
    listener._output.appendChild(ad);
}


function createIntentions(listener, lang) {
    listener.iInteract = config.intentionStorage.createIntention({
        title: {
            en: 'Need possibility to interact with user',
            ru: 'Нужна возможность взаимодействия с пользователем'
        },
        input: 'Recognition',
        output: 'HTMLTextAreaElement',
        onData: async (status, intention, data) => {
            if (status == 'data')
                await addAnswer(listener, data, false);
        },
        parameters: [lang.speechRecognizer, listener.input]
    });

    listener.iPost = config.intentionStorage.createIntention({
        title: {
            en: 'Can post data to console',
            ru: 'Отправляю данные в пользовательскую консоль'
        },
        input: 'ContextText',
        output: 'None',
        onData: async (status, intention, value) => {
            if (status == 'data')
                await addAnswer(listener, value);
        }
    });
}

function deleteIntentions(listener) {
    config.intentionStorage.deleteIntention(listener.iInteract, 'client closed listener');
    config.intentionStorage.deleteIntention(listener.iPost, 'client closed listener');
}

function getText(contextText) {
    const lang = localization.get();
    return localization.getText(lang, contextText);
}

function toggleAlternatives(answer) {
    answer.showAlternatives = !answer.showAlternatives;
}

async function render(listener) {
    const template = await gTemplateP;
    listener._mount.innerHTML = template.text;
    listener._output = listener._mount.querySelector('.output');
    listener.input = listener._mount.querySelector('.content textarea');
    const lang = localization.get();
    createIntentions(listener, lang);
}

class Listener {
    constructor(mount) {
        this._mount = mount;
        this._output = null;
        this.input = null;
        render(this);
    }

    unmount() {
        deleteIntentions(this);
    }
}

export default Listener;