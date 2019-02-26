const gAddresses = [
    {
        type: 'type',
        name: {
            name: 'WebAddress',
            en: 'Web address',
            ru: 'Веб адрес'
        },
        words: [{
            ru: 'локалхост',
            en: 'localhost'
        }, {
            ru: 'локал хост',
            en: 'local host',
        }],
        value: 'localhost'
    }
];

function init(intentionStorage) {
    intentionStorage.createIntention({
        title: {
            en: 'Types and Intentions to work with web addresses',
            ru: 'Типы и Намерения для работы с веб адресами',
        },
        description: {
            en: `<h2>Translated entity types</h2>
            <ul>
                <li>WebAddress</li>
            </ul>`,
            ru: `<h2>Транслирую сущности</h2>
            <ul>
                <li>WebAddress</li>
            </ul>`
        },
        input: 'None',
        output: 'EntitiesInfo',
        onData: async function onData(status) {
            if (status == 'accept') return gAddresses;
        }
    });
}

export default {
    init
}