import IntensionStorage from '/node_modules/intention-storage/browser/main.js';
import decision from './decision.js';

IntensionStorage.create({
    title: {
        en: 'Can translate raw user input to known entities and tasks',
        ru: 'Преобразую пользовательский ввод в известные сущности и задачи'
    },
    input: 'Recognition',
    output: 'HTMLTextAreaElement',
    onData: async function (status, intension, value) {
        iQuery.accepted.send(value);
    }
});

const iQuery = IntensionStorage.create({
    title: {
        en: 'Need possibility to return known entities by raw user input',
        ru: 'Нужна возможность возвращать известные сущности из пользовательского ввода'
    },
    input: 'Entities',
    output: 'Recognition',
    onData: async (status, intension, value) => {
        if (status == 'data') {
            decision.build(value);
        }
    }
});
