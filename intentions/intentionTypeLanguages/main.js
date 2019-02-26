const ltName = {
    name: 'Language',
    en: 'Language',
    ru: 'Язык'
};

const gLanguages = [
    {
        type: 'type',
        name: ltName,
        words: {
            ru: 'русский',
            en: 'russian'
        },
        value: 'ru-RU'
    },
    {
        type: 'type',
        name: ltName,
        words: {
            ru: 'английский',
            en: 'english',
        },
        value: 'en-US'
    },
    {
        type: 'task',
        name: {
            name: 'Change language',
            en: 'change language',
            ru: 'change language'
        },
        words: {
            ru: 'сменить язык',
            en: 'change language'
        },
        parameters: [{
            name: 'Language',
            ru: 'Язык локализации?',
            en: 'Language?'
        }],
        intentions: [{
            title: 'Change language task',
            input: 'ChangeLanguageOperationInfo',
            output: 'Language'
        }]
    }
];

function init(intentionStorage) {
    intentionStorage.createIntention({
        title: {
            en: 'Localization Types and intentions for localization managing',
            ru: 'Типы и Намерения для управления локализацией'
        },
        description: {
            ru: `<h2>Поддерживаемые языки</h2>
            <ul>
                <li>Русский ru-RU</li>
                <li>Английский en-US</li>
            </ul>`,
            en: `<h2>Supported languages</h2>
            <ul>
                <li>Russian ru-RU</li>
                <li>English en-US</li>
            </ul>`
        },
        input: 'None',
        output: 'EntitiesInfo',
        onData: async function onData(status) {
            if (status == 'accept') return gLanguages;
        }
    });
}

export default {
    init
}