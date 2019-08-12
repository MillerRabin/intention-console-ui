const fs = require('fs');
exports.pages = [{
    template: 'apps/documentation/en/documentation.pug',
    alias: '/',
    destination: 'index.html',
    priority: 0.8,
    freq: 'weekly',
    content: fs.readFileSync('../apps/documentation/en/what-is-what.html'),
    materialActive: 1
}, {
    template: 'apps/documentation/en/documentation.pug',
    destination: 'en/index.html',
    priority: 0.8,
    freq: 'weekly',
    content: fs.readFileSync('../apps/documentation/en/what-is-what.html'),
    materialActive: 1
}, {
    template: 'apps/documentation/ru/documentation.pug',
    destination: 'ru/index.html',
    priority: 0.8,
    freq: 'weekly',
    content: fs.readFileSync('../apps/documentation/ru/what-is-what.html'),
    materialActive: 1
}, {
    template: 'apps/browser/en/browser.pug',
    destination: 'en/browser.html',
    priority: 0.8,
    freq: 'weekly'
}, {
    template: 'apps/browser/ru/browser.pug',
    destination: 'ru/browser.html',
    priority: 0.8,
    freq: 'weekly'
}, {
    template: 'apps/storages/en/storages.pug',
    destination: 'en/storages.html',
    priority: 0.8,
    freq: 'weekly'
}, {
    template: 'apps/storages/ru/storages.pug',
    destination: 'ru/storages.html',
    priority: 0.8,
    freq: 'weekly'
}];

