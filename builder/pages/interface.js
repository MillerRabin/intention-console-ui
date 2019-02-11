const fs = require('fs');
const path = require('path');

exports.pages = [{
    template: 'apps/browser/en/browser.pug',
    alias: '/',
    destination: 'index.html',
    priority: 0.8,
    freq: 'weekly',
    templates: [{
        id: 'Browser-Template',
        body: fs.readFileSync(path.resolve(__dirname, '../../apps/browser/en/browser.html'))
    }]
}, {
    template: 'apps/browser/en/browser.pug',
    destination: 'en/index.html',
    priority: 0.8,
    freq: 'weekly',
    templates: [{
        id: 'Browser-Template',
        body: fs.readFileSync(path.resolve(__dirname, '../../apps/browser/en/browser.html'))
    }]
}, {
    template: 'apps/browser/ru/browser.pug',
    destination: 'ru/index.html',
    priority: 0.8,
    freq: 'weekly',
    templates: [{
        id: 'Browser-Template',
        body: fs.readFileSync(path.resolve(__dirname, '../../apps/browser/ru/browser.html'))
    }]
}, {
    template: 'apps/storages/en/storages.pug',
    destination: 'en/storages.html',
    priority: 0.8,
    freq: 'weekly',
    templates: [{
        id: 'Storages-Template',
        body: fs.readFileSync(path.resolve(__dirname, '../../apps/storages/en/storages.html'))
    }]
}, {
    template: 'apps/storages/ru/storages.pug',
    destination: 'ru/storages.html',
    priority: 0.8,
    freq: 'weekly',
    templates: [{
        id: 'Storages-Template',
        body: fs.readFileSync(path.resolve(__dirname, '../../apps/storages/ru/storages.html'))
    }]
}];

