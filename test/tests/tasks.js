const assert = window.chai.assert;

describe('#Tasks', function () {
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
            this.timeout(11000);
            setTimeout(function () {
                done();
            }, 5000);
        });
    });

    describe('Canceling task test', function () {
        it('Create waiting task', function () {
            listener.sendText('Добавить хранилище');
        });

        it('Wait', function (done) {
            this.timeout(6000);
            setTimeout(function () {
                done();
            }, 5000);
        });

        it('Cancel task', function () {
            assert.strictEqual(tasks.data.length, 1);
            const task = tasks.data[0];
            assert.strictEqual(task.name.general, 'Add storage');
            listener.sendText('Отменить');
        });

        it('Wait', function (done) {
            this.timeout(6000);
            setTimeout(function () {
                assert.strictEqual(tasks.data.length, 0);
                done();
            }, 5000);
        });



    });
});