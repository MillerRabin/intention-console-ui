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
    template: 'apps/storages/storages.pug',
    destination: 'storages.html',
    priority: 0.8,
    freq: 'weekly',
    templates: [{
        id: 'Storages-Template',
        body: fs.readFileSync(path.resolve(__dirname, '../../apps/storages/storages.html'))
    }]
}];

