export default class TaskList {
    constructor() {
        this.map = new Map();
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
}