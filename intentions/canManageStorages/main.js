const gTasks = [
    {
        type: 'task',
        name: {
            general: 'Add storage',
            en: 'Add storage',
            ru: 'Добавление хранилища'
        },
        words: {
            ru: 'Добавить хранилище',
            en: 'Add storage'
        },
        parameters: [{
            general: ['webaddress', 'ipaddress'],
            ru: 'веб адрес?',
            en: 'web address?'
        }, {
            general: 'ipport',
            ru: 'порт?',
            en: 'port?',
            value: 10010
        }],
        intentions: [{
            title: 'Add linked storage task',
            input: 'StorageOperationInfo',
            output: 'StorageInfo',
            value: 'add'
        }, {
            title: 'Change interface',
            input: 'NavigationResult',
            output: 'None',
            value: 'storages'
        }]
    }, {
        type: 'task',
        name: {
            general: 'Delete storage',
            en: 'Delete storage',
            ru: 'Удаление хранилища'
        },
        words: {
            ru: 'Удалить хранилище',
            en: 'Delete storage'
        },
        parameters: [{
            general: ['webaddress', 'ipaddress'],
            ru: 'веб адрес?',
            en: 'web address?'
        }, {
            general: 'ipport',
            ru: 'порт?',
            en: 'port?',
            value: 10010
        }],
        intentions: [{
            title: 'Remove linked storage task',
            input: 'StorageOperationInfo',
            output: 'StorageInfo',
            value: 'remove'
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
        intentionStorage.addLink([{type: 'WebAddress', value: storage.origin}, { type: 'IPPort', value: storage.port }])
    }
}

function addStorage(intentionStorage, parameters) {
    try {
        const res = intentionStorage.addLink(parameters);
        saveToStorage(res);
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
    } catch (e) {
        if (e.code == 'LNK-0001') {
            const link = e.detail.link;
            iPost.accepted.send({
                text: {
                    en: `Storage already exists ${ link.key }`,
                    ru: `Хранилище уже существует ${ link.key }`
                },
                context: {
                    en: 'Linked storage manager',
                    ru: 'Связанные хранилища'
                },
                time: new Date()
            });
            return;
        }
        console.log(e);
    }

}

function removeStorage(intentionStorage, parameters) {
    const res = intentionStorage.deleteLink(parameters);
    saveToStorage(res);
    iPost.accepted.send({
        text: {
            en: `Removed linked storage ${ res.key }`,
            ru: `Удалено хранилище ${ res.key }`
        },
        context: {
            en: 'Linked storage manager',
            ru: 'Связанные хранилища'
        },
        time: new Date()
    });
}


let iPost = null;

function init(intentionStorage) {
    addSavedStorages(intentionStorage);

    intentionStorage.createIntention({
        title: {
            en: 'Can manage storages',
            ru: 'Управляю хранилищами'
        },
        input: 'StorageInfo',
        output: 'StorageOperationInfo',
        onData: async function onData(status, intention, value) {
            if (status != 'data') return;
            const parameters = value.parameters.map((p) => {
                if (p.type == 'ipaddress') {
                    const t = Object.assign({}, p);
                    t.value = t.value.replace(/\s/g, '.');
                    return t
                }
                return p;
            });

            if (value.value == 'add') {
                addStorage(intentionStorage, parameters);
                intention.send('completed', this, { success: true });
                return;
            }

            if (value.value == 'remove') {
                removeStorage(intentionStorage, parameters);
                intention.send('completed', this, { success: true });
                return;
            }

            intention.send('error', this, { message: `Invalid value ${ value.value }`});
        }
    });

    intentionStorage.createIntention({
        title: {
            en: 'Types and Intentions to work with linked storages',
            ru: 'Типы и Намерения для работы со связанными хранилищами'
        },
        input: 'None',
        output: 'EntitiesInfo',
        onData: async function onData(status, intention) {
            if (status == 'accept')
                intention.send('data', this, gTasks);
        }
    });

    iPost = intentionStorage.createIntention({
        title: {
            en: 'Need a possibility to post data to user console about storage changing',
            ru: 'Нужна возможность отправлять данные в пользовательскую консоль об изменениях в хранилищах'
        },
        input: 'None',
        output: 'ContextText',
        onData: async function (status, intention, value) {}
    });
}

export default {
    init
}