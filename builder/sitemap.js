import fs from "fs";
import path from "path";

function modTime(config, item) {
  if (item.templateUrl == null) return new Date();
  let filename = path.resolve(config.directory, item.templateUrl).replace(/\\/g, '/');
  let lastmod = null;
  let stat = null;
  try {
    stat = fs.statSync(filename);
    lastmod = stat.mtime;
  }
  catch (e) {
    lastmod = new Date();
  }
  return lastmod;
}

export function getModTime(directory, item) {
  const mt = modTime({ directory: directory }, item);
  return mt;
}

export default {
  getModTime
};