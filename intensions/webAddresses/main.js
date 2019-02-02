import IntensionStorage from '/node_modules/intension-storage/browser/main.js';

const waName = {
    name: 'WebAddress',
    en: 'Web address',
    ru: 'Веб адрес'
};

const gAddresses = [
    {
        type: 'type',
        name: waName,
        words: {
            ru: 'локалхост',
            en: 'localhost'
        },
        value: 'localhost'
    },
    {
        type: 'type',
        name: waName,
        words: {
            ru: 'локал хост',
            en: 'local host',
        },
        value: 'localhost'
    }
];

IntensionStorage.create({
    title: 'Can send information about Web addresses types',
    description: '<p>Web address types information</p>',
    input: 'None',
    output: 'EntitiesInfo',
    onData: async function onData(status) {
        if (status == 'accept') return gAddresses;
    }
});