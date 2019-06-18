const assert = window.chai.assert;

describe.only('#Storages', function () {
    let listener = null;
    let tasks = null;
    describe('Init', function () {
        it('Init', function () {
            const listenerM = window.document.getElementById('Listener');
            assert.ok(listenerM);
            listener = listenerM.scope;
            assert.ok(listener);
            const tasksM = window.document.getElementById('Tasks');
            assert.ok(tasksM);
            tasks = tasksM.scope;
            assert.ok(tasks);
        });

        it('Wait', function (done) {
            this.timeout(6000);
            setTimeout(function () {
                done();
            }, 5000);
        });

    });

    describe('Add storages by waiting parameters', function () {
        it('Create waiting task', function () {
            listener.sendText('Добавить хранилище');
        });

        it('Wait', function (done) {
            this.timeout(6000);
            setTimeout(function () {
                done();
            }, 5000);
        });

        it('send ip', function () {
            listener.sendText('192 168 0 110 1515');
        });

    });
});