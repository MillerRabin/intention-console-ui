const fs = require('fs');
const path = require('path');

exports.pages = [{
    template: 'apps/browser/browser.pug',
    alias: '/',
    destination: 'index.html',
    priority: 0.8,
    freq: 'weekly',
    templates: [{
        id: 'Browser-Template',
        body: fs.readFileSync(path.resolve(__dirname, '../../apps/browser/browser.html'))
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

