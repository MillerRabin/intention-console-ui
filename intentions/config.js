import interact from '/intentions/intention-can-interact-with-user/main.js';
import structurize from '/intentions/canStructurize/main.js';
import manageStorages from '/intentions/canManageStorages/main.js';
import query from '/node_modules/intention-can-query-entities/browser/main.js';
import TaskList from '/node_modules/intention-can-manage-tasks/browser/main.js';
import webAddress from '/intentions/webAddresses/main.js';
import languages from '/intentions/intentionTypeLanguages/main.js';
import navigation from '/intentions/intentionTypeNavigation/main.js';
import typeTasks from '/intentions/intentionTypeTasks/main.js';
import IS from '/node_modules/intention-storage/browser/main.js';

let gTasks = null;

function init(intentionStorage) {
    interact.init(intentionStorage);
    structurize.init(intentionStorage);
    manageStorages.init(intentionStorage);
    query.init(intentionStorage);
    gTasks = new TaskList({ storage: intentionStorage });
    webAddress.init(intentionStorage);
    languages.init(intentionStorage);
    navigation.init(intentionStorage);
    typeTasks.init(intentionStorage);
}


const intentionStorage = new IS.IntentionStorage();

init(intentionStorage);

export default {
    intentionStorage
}