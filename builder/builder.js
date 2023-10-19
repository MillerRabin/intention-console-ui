import path from "path";
import fs from 'fs/promises';
import pug from 'pug';
import uglifycss from 'uglifycss';
import recursive from 'recursive-readdir';
import pages from './pages.js';
import mainConfig from './config.js';

export async function checkDirectories(fileName) {
  const paths = fileName.split(path.sep);
  const absPath = fileName.startsWith(path.sep) ? path.sep : '';
  let base = absPath + paths[0];
  for (let i = 1; i < paths.length - 1; i++) {
    base = path.join(base, paths[i]);
    try {
      await fs.mkdir(base);
    } catch (e) { /* empty */ }
  }
}

export async function writeHtml(config, item) {
  async function compile(source, target, params) {
    console.log('render file ' + target);
    const html = pug.renderFile(source, params);
    await checkDirectories(target);
    try {
      await fs.writeFile(target, html);
    } catch (err) {
      console.log(err);
    }
  }

  function compilePage(config, item) {
    if (item.templatePage == null) return;
    const template = path.resolve(mainConfig.root, item.templatePage);
    const destination = path.resolve(mainConfig.root, item.templateUrl);
    return compile(template, destination, { config: config, item: item });
  }

  const template = path.resolve(mainConfig.root, item.template);
  const destination = path.resolve(mainConfig.root, item.destination);
  await compilePage(config, item);
  if (item.resolve != null)
    await item.resolve(config, item);
  return await compile(template, destination, { config: config, item: item });
}

async function writeRobots(config) {
  const template = path.resolve(mainConfig.root, config.robots.template);
  const destination = path.resolve(mainConfig.root, config.robots.destination);
  const routes = pug.renderFile(template, config);
  await fs.writeFile(destination, routes);
  return routes;
}

async function writeSitemap(config) {
  const template = path.resolve(mainConfig.root, config.sitemap.template);
  const destination = path.resolve(mainConfig.root, config.sitemap.destination);
  const routes = pug.renderFile(template, config);
  await fs.writeFile(destination, routes);
  return routes;
}

async function write(path, data) {
  await checkDirectories(path);
  await fs.writeFile(path, data);
}

async function buildCssBundles(config, debug) {
  const bundles = [];
  for (const key in config.css) {
    const bundle = config.css[key];
    const files = await buildCss(bundle, debug);
    if (files != null) bundles.push(files);
  }
  return bundles;
}

async function buildCss(bundle, debug = false) {
  function search(isMobile) {
    function ignore(file, stats) {
      if (stats.isDirectory()) return false;
      const fp = path.parse(file);
      if (fp.ext != '.css') return true;
      const mobile = file.match('mobile');
      let predicate = (mobile != null);
      if (isMobile) predicate = (mobile == null);
      return predicate;
    }

    return new Promise((resolve, reject) => {
      const appPath = path.resolve(mainConfig.root);
      recursive(appPath, [ignore], function (err, files) {
        if (err != null) return reject(err);
        const relFiles = [];
        for (let i = 0; i < files.length; i++)
          relFiles.push(files[i].substring(appPath.length + 1).replace(/\\/g, '/'));
        return resolve({ absolute: files, relative: relFiles });
      });
    });
  }


  const data = await Promise.all([search(false), search(true)]);
  if (bundle.libraries == null) {
    bundle.libraries = {
      absolute: [],
      relative: []
    }
  }
  const afiles = bundle.libraries.absolute.concat(data[0].absolute);
  const rfiles = bundle.libraries.relative.concat(data[0].relative);
  if (debug)
    return { desktopFiles: rfiles, mobileFiles: data[1].relative };

  const desktopCss = uglifycss.processFiles(afiles, { maxLineLen: 0 });
  const mobileCss = uglifycss.processFiles(data[1].absolute, { maxLineLen: 0 });

  await Promise.all([write(bundle.desktop, desktopCss), write(bundle.mobile, mobileCss)]);
  return {
    desktopFiles: [bundle.desktop.substring(bundle.root.length + 1).replace(/\\/g, '/')],
    mobileFiles: [bundle.mobile.substring(bundle.root.length + 1).replace(/\\/g, '/')]
  };
}

 export async function build(debug) {
  const lp = [];
  const config = await pages.build();

  lp.push(buildCssBundles(config, debug).then((files) => {
    config.css.files = files;
    const promises = [];
    for (let i = 0; i < config.pages.length; i++) {
      if (!config.pages[i].noRender)
        promises.push(writeHtml(config, config.pages[i]));
    }

    return Promise.all(promises);
  }));

  await Promise.all(lp);
  await Promise.all([writeRobots(config), writeSitemap(config)]);
}

export default {
  build
}