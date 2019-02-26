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
        intentions: [{
            title: 'Add linked storage task',
            input: 'StorageOperationInfo',
            output: 'StorageInfo'
        }, {
            title: 'Change interface',
            input: 'NavigationResult',
            output: 'None',
            value: 'storages'
        }]
    }
];

const storagesKey = 'storages';

function loadStorages() {
    try {
        const ss = window.localStorage.getItem(storagesKey);
        return (ss != null) ? JSON.parse(ss) : {};
    } catch (e) {
        return {};
    }
}
function saveToStorage(link) {
    const storages = loadStorages();
    storages[link.key] = link.toObject();
    window.localStorage.setItem(storagesKey, JSON.stringify(storages));
}

function addSavedStorages(intentionStorage) {
    const storages = loadStorages();
    for (let key in storages) {
        if (!storages.hasOwnProperty(key)) continue;
        const storage = storages[key];
        intentionStorage.addLink([{type: 'WebAddress', value: storage.origin}, { type: 'Port', value: storage.port }])
    }
}

let iPost = null;
let iSendData = null;

function init(intentionStorage) {
    addSavedStorages(intentionStorage);

    intentionStorage.createIntention({
        title: {
            en: 'Can manage storages',
            ru: 'Управляю хранилищами'
        },
        input: 'StorageInfo',
        output: 'StorageOperationInfo',
        onData: async function onData(status, intention) {
            if ((status != 'accept') && (status != 'data')) return;
            const parameters = intention.parameters;
            const res = intentionStorage.storage.addLink(parameters);
            saveToStorage(res);
            intention.send('data', this, { success: true });
            iPost.accepted.send({
                text: {
                    en: `Added linked storage ${ res.key }`,
                    ru: `Добавлено хранилище ${ res.key }`
                },
                context: {
                    en: 'Linked storage manager',
                    ru: 'Связанные хранилища'
                },
                time: new Date()
            });
        }
    });

    intentionStorage.createIntention({
        title: {
            en: 'Types and Intentions to work with linked storages',
            ru: 'Типы и Намерения для работы со связанными хранилищами'
        },
        input: 'None',
        output: 'EntitiesInfo',
        onData: async function onData(status) {
            if (status == 'accept') return gTasks;
        }
    });

    iPost = intentionStorage.createIntention({
        title: {
            en: 'Need a possibility to post data to user console about storage changing',
            ru: 'Нужна возможность отправлять данные в пользовательскую консколь об изменениях в хранилищах'
        },
        input: 'None',
        output: 'ContextText',
        onData: async function (status, intention, value) {}
    });

    iSendData = intentionStorage.createIntention({
        title: {
            en: 'Need a possibility to send binary data to another storages',
            ru: 'Нужна возможность отправлять данные в другие хранилища'
        },
        input: 'DataChannelOut',
        output: 'DataChannelIn',
        onData: async function (status, intention, value) {
            console.log(status);
            console.log(intention);
            console.log(value);
        }
    });
}

export default {
    init
}