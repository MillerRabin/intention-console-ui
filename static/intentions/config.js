import interact from '/intentions/intention-can-interact-with-user/main.js';
import structurize from '/intentions/canStructurize/main.js';
import manageStorages from '/intentions/canManageStorages/main.js';
import query from '/node_modules/intention-can-query-entities/browser/main.js';
import TaskList from '/node_modules/intention-can-manage-tasks/browser/main.js';
import basicTypes from '/intentions/basicTypes/main.js';
import webAddress from '/intentions/webAddresses/main.js';
import languages from '/intentions/intentionTypeLanguages/main.js';
import navigation from '/intentions/intentionTypeNavigation/main.js';
import typeTasks from '/intentions/intentionTypeTasks/main.js';
import canPlayMusic from '/intentions/canPlayMusic/main.js';
import IS from '/node_modules/intention-storage/browser/main.js';

let gTasks = null;

function init(intentionStorage) {
    intentionStorage.dispatchInterval = 2000;
    interact.init(intentionStorage);
    structurize.init(intentionStorage);
    manageStorages.init(intentionStorage);
    query.init(intentionStorage);
    gTasks = new TaskList({ storage: intentionStorage });
    gTasks.statsInterval = 2000;
    basicTypes.init(intentionStorage);
    webAddress.init(intentionStorage);
    languages.init(intentionStorage);
    navigation.init(intentionStorage);
    typeTasks.init(intentionStorage);
    canPlayMusic.init(intentionStorage);
}


const intentionStorage = new IS.IntentionStorage();

init(intentionStorage);

export default {
    intentionStorage
}