import IntensionStorage from '/node_modules/intension-storage/browser/main.js';

const gProtocols = [
    {
        name: {
            en: 'Create storage',
            ru: 'Создание хранилища'
        },
        words: {
            ru: 'Добавить хранилище',
        },
        fields: [{
            address: 'Text',
            port: 'Integer?80'
        }],
        intensions: [{
                title: 'Post started',
                input: 'None',
                output: 'Text',
                parameters: [{
                    ru: 'Добавление хранилища'
                }]
            }, {
                title: 'Protocol create storage',
                input: 'StorageInfo',
                output: 'StorageOperationInfo',
                parameters: [{
                    address: "@fields.address",
                    port:    "@fields.address",
                }]
            }
        ]
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
    title: 'Can send storage protocols information',
    description: '<p>Storage protocol information</p>',
    input: 'None',
    output: 'ProtocolInfo',
    onData: async function onData(status) {
        if (status == 'accept') return gProtocols;
    }
});


const iPost = IntensionStorage.create({
    title: 'Need post data to console',
    description: '<p>Need post data to console</p>',
    input: 'None',
    output: 'Text',
    onData: async function onData(status) {}
});
