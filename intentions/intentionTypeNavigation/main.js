const taskIntention = [{
    title: 'Change interface',
    input: 'NavigationResult',
    output: 'None'
}];

const gNavigation = [
    {
        type: 'task',
        name: {
            general: 'Storages',
            en: 'Storages',
            ru: 'Хранилища'
        },
        words: {
            ru: 'перейти в хранилище',
            en: 'go to storages'
        },
        value: 'storages',
        intentions: taskIntention
    },
    {
        type: 'task',
        name: {
            general: 'Intentions',
            en: 'Intentions',
            ru: 'Намерения'
        },
        words: {
            ru: 'перейти в намерение',
            en: 'go to intentions'
        },
        value: 'intentions',
        intentions: taskIntention
    },
    {
        type: 'task',
        name: {
            general: 'Home',
            en: 'Home',
            ru: 'Главная'
        },
        words: {
            ru: 'Вернуться на главный',
            en: 'go to home'
        },
        value: 'home',
        intentions: taskIntention
    }
];

function init(intentionStorage) {
    intentionStorage.createIntention({
        title: {
            en: 'Types and Intentions for console navigation',
            ru: 'Типы и Намерения для навигации по консоли'
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
        onData: async function onData(status, intention) {
            if (status == 'accepted')
                intention.send('data', this, gNavigation);
        }
    });
}

export default {
    init
}
