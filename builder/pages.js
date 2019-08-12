const path = require('path');
const sitemap = require('./sitemap.js');
const mainConfig = require('./config.js');
const interfacePages = require('./pages/interface.js').pages;
const documentPages = require('./pages/documentation.js').pages;

let config = {
    directory: mainConfig.root,
    domain: 'https://intention.tech',
    utils: {
        getModTime: sitemap.getModTime
    },
    robots: {
        userAgent: '*',
        template: 'apps/main/robots.pug',
        destination: 'robots.txt'
    },
    sitemap: {
        template: 'apps/main/sitemap.pug',
        destination: 'sitemap.xml'
    },
    css: {
        sources: {
            root: path.resolve(mainConfig.root),
            desktop: path.resolve(mainConfig.root, 'styles-min', 'desktop.css'),
            mobile: path.resolve(mainConfig.root, 'styles-min', 'mobile.css'),
            path: path.resolve(mainConfig.root, 'apps'),
            enabled: mainConfig.production
        }
    },
    pages: []
};

exports.isApplication = (rpath) => {
    return (rpath.indexOf('application') != -1);
};

exports.isDefinitions = (rpath) => {
    return (rpath.indexOf('definitions') != -1);
};

exports.isGenerated = (rpath) => {
    return (rpath.indexOf('.gen.js') != -1);
};

exports.isLoader = (rpath) => {
    const hasLoader = (rpath.indexOf('loader.js') != -1);
    return hasLoader && !exports.isApplication(rpath);
};

exports.addFileToBundle = (fPath, bundle) => {
    const branch = config.scripts[bundle];
    if (branch.libraries == null) branch.libraries = {absolute: [], relative: []};
    branch.libraries.absolute.push(path.join(config.directory, fPath));
    branch.libraries.relative.push(fPath);
};


exports.build = async () => {
    config.pages = config.pages.concat(
        interfacePages);
    config.pages = config.pages.concat(
        documentPages);
    return config;
};
