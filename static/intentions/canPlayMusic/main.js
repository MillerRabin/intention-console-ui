function init(intentionStorage) {
    intentionStorage.createIntention({
        title: {
            en: 'Can play music',
            ru: 'Могу играть музыку'
        },
        input: 'Music',
        output: 'TaskOperationInfo',
        onData: async function (status, intention, value) {
            if (status != 'data') return;
            try {
                const md = window.document.querySelector('#Media audio');
                md.pause();
                const fname = intention.parameters[0].filename;
                const src = window.document.querySelector('#Media audio source');
                src.src = `http://192.168.0.3:8080/media?${window.encodeURI(fname)}`;
                await md.load();
                md.play();
                intention.send('completed', this, { success: true, data: value });
            } catch (e) {
                console.log(e);
                intention.send('error', this, e);
            }
        }
    });
}

export default {
    init
}