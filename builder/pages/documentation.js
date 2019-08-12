const fs = require('fs');
exports.pages = [{
    template: 'apps/documentation/en/documentation.pug',
    destination: 'en/documentation/what-is-what.html',
    priority: 0.8,
    freq: 'weekly',
    content: fs.readFileSync('../apps/documentation/en/what-is-what.html'),
    materialActive: 1
}, {
    template: 'apps/documentation/ru/documentation.pug',
    destination: 'ru/documentation/what-is-what.html',
    priority: 0.8,
    freq: 'weekly',
    content: fs.readFileSync('../apps/documentation/ru/what-is-what.html'),
    materialActive: 1
}, {
    template: 'apps/documentation/en/documentation.pug',
    destination: 'en/documentation/application.html',
    priority: 0.8,
    freq: 'weekly',
    content: fs.readFileSync('../apps/documentation/en/application.html'),
    materialActive: 2
}, {
    template: 'apps/documentation/ru/documentation.pug',
    destination: 'ru/documentation/application.html',
    priority: 0.8,
    freq: 'weekly',
    content: fs.readFileSync('../apps/documentation/ru/application.html'),
    materialActive: 2
}];

