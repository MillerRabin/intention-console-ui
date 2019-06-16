exports.pages = [{
    template: 'apps/browser/en/browser.pug',
    alias: '/',
    destination: 'index.html',
    priority: 0.8,
    freq: 'weekly'
}, {
    template: 'apps/browser/en/browser.pug',
    destination: 'en/index.html',
    priority: 0.8,
    freq: 'weekly'
}, {
    template: 'apps/browser/ru/browser.pug',
    destination: 'ru/index.html',
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

