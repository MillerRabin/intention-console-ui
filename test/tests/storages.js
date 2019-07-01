const assert = window.chai.assert;
import router from '/apps/router/router.js';

describe('#Storages', function () {
    let listener = null;
    let tasks = null;

    this.afterAll('Return back to test suit', function () {
        router.push({ path: '/test/testSuit.html' });
    });

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

    describe('Remove test storage', function () {
        it('Create waiting task', function () {
            listener.sendText('Удалить хранилище');
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

        it('Wait', function (done) {
            this.timeout(6000);
            setTimeout(function () {
                done();
            }, 5000);
        });

        it('Check results', function () {
            const li = listener.output.children.length - 1;
            const lastAnswer = listener.output.children[li];
            const textElem = lastAnswer.querySelector('pre');
            const text = textElem.innerText;
            assert.strictEqual(text, 'Добавлено хранилище ws://192.168.0.110:1515');
        });

    });

    describe('Remove test storage', function () {
        it('Create waiting task', function () {
            listener.sendText('Удалить хранилище');
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

        it('Wait', function (done) {
            this.timeout(6000);
            setTimeout(function () {
                done();
            }, 5000);
        });
    });
});