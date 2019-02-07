function clearTaskWaitList(list, task) {
    for (let [,ts] of list._waitTypesMap) {
        ts.delete(task);
    }
}

export default class TaskList {
    constructor({ onUpdate, onPost }) {
        this._map = new Map();
        this._waitTypesMap = new Map();
        this._onUpdate  = onUpdate;
        this._onPost = onPost;
    }
    add(task) {
        const stask = this._map.get(task.key);
        if (stask != null) {
            this.delete(stask);
            this.post({
                text: {
                    en: `Restarting the task`,
                    ru: `Перезапускаю задачу`
                },
                context: stask.name,
                time: new Date()
            });
        }

        this._map.set(task.key, task);
        task.list = this;
        try {
            task.execute();
        } catch (e) {
            this.delete(task);
        }
        this.update(task, 'created');
    }
    delete(task) {
        this._map.delete(task.key);
        clearTaskWaitList(this, task);
        task.list = null;
        this.update(task, 'deleted');
    }
    update(task, status) {
        try {
            if (this._onUpdate != null)
                this._onUpdate(task, status);

        } catch (e) {
            console.log(e);
        }
    }
    post(message) {
        try {
            if (this._onPost != null)
                this._onPost(message);
        } catch (e) {
            console.log(e);
        }
    }
    waitTypes(type, task) {
        if (!this._waitTypesMap.has(type))
            this._waitTypesMap.set(type, new Set());
        const tb = this._waitTypesMap.get(type);
        tb.add(task);
    }
    dispatchParameters(structures) {
        for (let structure of structures) {
            if (structure.value.type != 'type') continue;
            const name = structure.value.name.name.toLowerCase();
            const ts = this._waitTypesMap.get(name);
            if (ts == null) continue;
            for (let task of ts) {
                try {
                    const par = task.searchParameterByType(name);
                    if (par == null) continue;
                    par.value = structure.value;
                    task.execute();
                } catch (e) {
                    console.log(e);
                }
            }
            ts.clear();
        }
    }
    toObject() {
        const res = [];
        for (let [,task] of this._map) {
            res.push(task.toObject());
        }
        return res;
    }
    query() {
        return this.toObject();
    }

}