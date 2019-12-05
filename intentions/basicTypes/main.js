const basicTypes = [
    {
        type: 'class',
        extends: 'integer',
        name: {
            general: 'int8',
            en: 'Eight bit integer',
            ru: 'Восьмибитное целое'
        },
        lowerLimit: 0,
        upperLimit: 255
    }, {
        type: 'class',
        extends: 'integer',
        name: {
            general: 'int16',
            en: 'Sixteen bit integer',
            ru: 'Шестнадцатибитное целое'
        },
        lowerLimit: 0,
        upperLimit: 65535
    }
];

function init(intentionStorage) {
    intentionStorage.createIntention({
        title: {
            en: 'Basic types intentions',
            ru: 'Базовые типы данных',
        },
        description: {
            en: `<h2>Translates data types</h2>
            <ul>
                <li>int8</li>
                <li>int16</li>
            </ul>`,
            ru: `<h2>Транслирую типы данных</h2>
            <ul>
                <li>int8</li>
                <li>int16</li>
            </ul>`
        },
        input: 'None',
        output: 'EntitiesInfo',
        onData: async function onData(status, intention) {
            if (status == 'accepted')
                intention.send('data', this, basicTypes);
        }
    });
}

export default {
    init
}