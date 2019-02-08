import IntentionStorage from '/node_modules/intention-storage/browser/main.js';

const task = [{
    title: 'Change interface',
    input: 'NavigationResult',
    output: 'None'
}];

const gNavigation = [
    {
        type: 'task',
        name: {
            name: 'Storages',
            en: 'Storages',
            ru: 'Хранилища'
        },
        words: {
            ru: 'хранилища',
            en: 'storages'
        },
        value: 'storages',
        intentions: task
    },
    {
        type: 'task',
        name: {
            name: 'Intentions',
            en: 'Intentions',
            ru: 'Намерения'
        },
        words: {
            ru: 'намерения',
            en: 'intentions'
        },
        value: 'intentions',
        intentions: task
    }
];

IntentionStorage.create({
    title: {
        en: 'Types and Intentions for console navigation',
        ru: 'Типы и Намерени для навигации по консоли'
    },
    description: {
        ru: `<h2>Поддерживаемая навигация</h2>
            <ul>
                <li>Намерения</li>
                <li>Хранилища</li>
            </ul>`,
        en: `<h2>Supported navigation</h2>
            <ul>
                <li>Intentions</li>
                <li>Storages</li>
            </ul>`
    },
    input: 'None',
    output: 'EntitiesInfo',
    onData: async function onData(status) {
        if (status == 'accept') return gNavigation;
    }
});
