const gAddresses = [
    {
        type: 'type',
        name: {
            general: 'WebAddress',
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
    }, {
        type: 'class',
        path: 'int16',
        name: {
            general: 'ipport',
            en: 'IP Port',
            ru: 'Интернет порт'
        }
    }, {
        type: 'class',
        path: 'int8 int8 int8 int8',
        name: {
            general: 'ipaddress',
            en: 'IP Address',
            ru: 'Интернет адрес'
        }
    }
];

function init(intentionStorage) {
    intentionStorage.createIntention({
        title: {
            en: 'Types for working with web addresses',
            ru: 'Типы для работы с веб адресами',
        },
        description: {
            en: `<h2>Translates entity types</h2>
            <ul>
                <li>WebAddress</li>
                <li>IPAddress</li>
                <li>IPPort</li>
            </ul>`,
            ru: `<h2>Транслирую сущности</h2>
            <ul>
                <li>WebAddress</li>
                <li>IPAddress</li>
                <li>IPPort</li>
            </ul>`
        },
        input: 'None',
        output: 'EntitiesInfo',
        onData: async function onData(status, intention) {
            if (status == 'accept')
                intention.send('data', this, gAddresses);
        }
    });
}

export default {
    init
}