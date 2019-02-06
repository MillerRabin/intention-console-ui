import IntensionStorage from '/node_modules/intention-storage/browser/main.js';

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
            input: 'StorageOperationInfo',
            output: 'StorageInfo'
        }]
    }
];

IntensionStorage.create({
    title: 'Can manage storages',
    description: '<p>Manages storages</p>',
    input: 'StorageInfo',
    output: 'StorageOperationInfo',
    onData: async function onData(status, intension) {
        if ((status != 'accept') && (status != 'data')) return;
        try {
            const parameters = intension.parameters;
            const res = IntensionStorage.storage.addLink(parameters);
            intension.send('data', this, { success: true });
            iPost.accepted.send({
                text: {
                    en: `Added linked storage ${ res }`,
                    ru: `Добавлено хранилище ${ res }`
                },
                context: {
                    en: 'Linked storage manager',
                    ru: 'Связанные хранилища'
                },
                time: new Date()
            });
        } catch (e) {
            intension.send('error', this, e);
        }
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

const iPost = IntensionStorage.create({
    title: 'Need post data to console from Tasks',
    description: '<p>Need post data to console from tasks</p>',
    input: 'None',
    output: 'ContextText',
    onData: async function (status, intension, value) {}
});