import path from 'path';
import sitemap from './sitemap.js';
import mainConfig from './config.js';
import fs from 'fs/promises';
import recursive from 'recursive-readdir';


const config = {
  domain: 'https://int-nt-tech.com',
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
      desktop: path.resolve(mainConfig.root, 'styles-min', 'desktop.css'),
      mobile: path.resolve(mainConfig.root, 'styles-min', 'mobile.css'),
    }
  },
  pages: []
};

export function isApplication(rpath) {
  return (rpath.indexOf('application') != -1);
}

export function isDefinitions(rpath) {
  return (rpath.indexOf('definitions') != -1);
}

export function isGenerated(rpath) {
  return (rpath.indexOf('.gen.js') != -1);
}

export function isLoader(rpath) {
  const hasLoader = (rpath.indexOf('loader.js') != -1);
  return hasLoader && !isApplication(rpath);
}

export function addFileToBundle(fPath, bundle) {
  const branch = config.scripts[bundle];
  if (branch.libraries == null) branch.libraries = { absolute: [], relative: [] };
  branch.libraries.absolute.push(path.join(config.directory, fPath));
  branch.libraries.relative.push(fPath);
}

async function resolveFilenames(config) {
  const promises = [];
  for (const page of config.pages) {
    if (page.filename == null) continue;
    const pt = path.resolve(mainConfig.root, page.filename);
    promises.push(fs.readFile(pt).then((data) => {
      page.content = data;
    }));
  }

  await Promise.all(promises);
  return config;
}

function searchJS(file, stats) {
  if (stats.isDirectory()) return false;
  const fp = path.parse(file);
  if (fp.base != 'pages.mjs') return true;
  return false;  
}

function searchPages() {
  return new Promise((resolve, reject) => {
    const appPath = path.resolve(mainConfig.root, 'apps');
    recursive(appPath, [searchJS], function (err, files) {
      if (err != null) return reject(err);
      return resolve(files);
    });
  });
}

async function loadContent(pages) {
  const promises = [];
  for (const page of pages) {
    if (page.filename == null) continue;
    promises.push(fs.readFile(path.resolve(mainConfig.root, page.filename)).then((data) => {
      page.content = data;
    }));
  }
  await Promise.all(promises);
}

export async function build() {
  const files = await searchPages();
  const promises = [];
  for (const file of files)
    promises.push(import(file).then(async (data)=>{
      const pages = data.pages;
      await loadContent(pages)
      config.pages.push(...pages);
    }
  ));
  await Promise.all(promises);
  return config;
}

export default {
  build,
  addFileToBundle,
  isLoader,
  isGenerated,
  isDefinitions,
  isApplication
}
