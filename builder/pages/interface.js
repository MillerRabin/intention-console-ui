const fs = require('fs');
const path = require('path');

exports.pages = [{
    template: 'apps/frontpage/frontpage.pug',
    destination: 'index.html',
    alias: '/',
    priority: 0.8,
    freq: 'weekly',
    templates: [{
        id: 'Frontpage-Template',
        body: fs.readFileSync(path.resolve(__dirname, '../../apps/frontpage/frontpage.html'))
    }]
}, {
    template: 'apps/listener/listener.pug',
    destination: 'listener.html',
    priority: 0.8,
    freq: 'weekly',
    templates: [{
        id: 'Listener-Template',
        body: fs.readFileSync(path.resolve(__dirname, '../../apps/listener/listener.html'))
    }]
}];

