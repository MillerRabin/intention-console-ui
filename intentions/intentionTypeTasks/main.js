const gTaskEntities = [
    {
        type: 'task',
        name: {
            general: 'Cancel task',
            en: 'cancel',
            ru: 'отменить'
        },
        words: {
            ru: 'отменить',
            en: 'cancel'
        },
        parameters: [{
            general: 'Integer',
            ru: 'Номер задачи?',
            en: 'Task index?',
            value: -2
        }],
        intentions: [{
            title: 'Cancel the task',
            input: 'TaskOperationInfo',
            output: 'TaskInfo'
        }],
        value: {
            operation: 'cancel'
        }
    }
];

function init(intentionStorage) {
    intentionStorage.createIntention({
        title: {
            en: 'Types and intentions for managing tasks',
            ru: 'Типы и Намерения для управления задачами'
        },
        description: {
            ru: `<h2>Поддерживаемые команды</h2>
            <ul>
                <li>Отменить [номер задачи] по-умолчанию последняя</li>
            </ul>`,
            en: `<h2>Supported commands</h2>
            <ul>
                <li>Cancel [task index] last by default</li>
            </ul>`
        },
        input: 'None',
        output: 'EntitiesInfo',
        onData: async function onData(status) {
            if (status == 'accept') return gTaskEntities;
        }
    });
}

export default {
    init
}