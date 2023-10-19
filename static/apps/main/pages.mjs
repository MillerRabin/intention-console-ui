
export const pages = [{
    template: 'apps/documentation/en/documentation.pug',
    alias: '/',
    destination: 'index.html',
    priority: 0.8,
    freq: 'weekly',
    filename: 'apps/documentation/en/what-is-what.html',
    materialActive: 1,
    bodyClass: 'documentation-body'
  }, {
    template: 'apps/documentation/en/documentation.pug',
    destination: 'en/index.html',
    priority: 0.8,
    freq: 'weekly',
    filename: 'apps/documentation/en/what-is-what.html',
    materialActive: 1,
    bodyClass: 'documentation-body'
  }, {
    template: 'apps/documentation/ru/documentation.pug',
    destination: 'ru/index.html',
    priority: 0.8,
    freq: 'weekly',
    filename: 'apps/documentation/ru/what-is-what.html',
    materialActive: 1,
    bodyClass: 'documentation-body'
}];

export default {
  pages
}