import IntensionStorage from '/node_modules/intension-storage/browser/main.js';

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
        intensions: [{
            title: 'Change language task',
            input: 'ChangeLanguageOperationInfo',
            output: 'Language'
        }]
    }
];

IntensionStorage.create({
    title: {
        en: 'Localization',
        ru: 'Локализации'
    },
    description: {
        en: '<p>Describes languages and intensions for changing localization</p>',
        ru: '<p>описывает языки и команды для смены локализации</p>'
    },
    input: 'None',
    output: 'EntitiesInfo',
    onData: async function onData(status) {
        if (status == 'accept') return gLanguages;
    }
});