import IntensionStorage from '/node_modules/intension-storage/browser/main.js';

const gTasks = [
    {
        type: 'task',
        name: {
            name: 'Add storage',
            en: 'Add storage',
            ru: 'Добавление хранилища'
        },
        words: {
            ru: 'Добавить хранилище',
            en: 'Add storage'
        },
        parameters: [{
            name: 'webAddress',
            ru: 'веб адрес?',
            en: 'web address?'
        }],
        intensions: [{
            title: 'Protocol create storage',
            input: 'StorageInfo',
            output: 'StorageOperationInfo'
        }]
    }
];

IntensionStorage.create({
    title: 'Can manage storages',
    description: '<p>Manages storages</p>',
    input: 'StorageInfo',
    output: 'StorageOperationInfo',
    onData: async function onData(status, intension, value) {
        if (status != 'data') return;
        console.log(intension);
        console.log(value);
    }
});

IntensionStorage.create({
    title: 'Can send storage entities',
    description: '<p>Storage entities</p>',
    input: 'None',
    output: 'EntitiesInfo',
    onData: async function onData(status) {
        if (status == 'accept') return gTasks;
    }
});