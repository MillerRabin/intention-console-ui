import decision from './decision.js';

let iQuery = null;

function init(intentionStorage) {
    intentionStorage.createIntention({
        title: {
            en: 'Can translate raw user input to known entities and tasks',
            ru: 'Преобразую пользовательский ввод в известные сущности и задачи'
        },
        input: 'Recognition',
        output: 'HTMLTextAreaElement',
        onData: async function (status, intention, value) {
            if (value != null)
                iQuery.accepted.send(value);
        }
    });

    iQuery = intentionStorage.createIntention({
        title: {
            en: 'I return known entities by raw user input',
            ru: 'Я возвращаю известные сущности из пользовательского ввода'
        },
        input: 'Entities',
        output: 'Recognition',
        onData: async (status, intention, value) => {
            if (status == 'data') {
                decision.build(value);
            }
        }
    });

    decision.init(intentionStorage);
}

export default {
    init
}