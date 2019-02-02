export default class TaskList {
    constructor() {
        this.map = new Map();
        this.waitTypesMap = new Map();
    }
    add(task) {
        this.map.set(task.id, task);
        task.list = this;
        task.execute();
    }
    delete(task) {
        this.map.delete(task.id);
        task.list = null;
    }
    waitTypes(type, task) {
        if (!this.waitTypesMap.has(type))
            this.waitTypesMap.set(type, new Set());
        const tb = this.waitTypesMap.get(type);
        tb.add(task);
    }
    dispatchParameters(structures) {
        for (let structure of structures) {
            if (structure.value.type != 'type') continue;
            const name = structure.value.name.name.toLowerCase();
            const ts = this.waitTypesMap.get(name);
            for (let task of ts) {
                const par = task.searchParameterByType(name);
                par.value = structure.value;
                task.execute();
            }
        }
    }
}