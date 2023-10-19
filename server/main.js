import serve from 'koa-static';
import Koa from 'koa';
import path from 'path';
import http from 'http';
import { build } from "../builder/builder.js";
import { port, root } from  "./config.js";

function createServer(port) {
  const app = new Koa();
  const cPath = path.resolve(root);
  app.use(serve(cPath));

  return new Promise((resolve, reject) => {
    const server = http.createServer(app.callback());
    server.listen(port, (err) => {
      if (err != null) return reject(err);
      return resolve(server);
    });
  });
}

async function init() {
  await build(true);
  await createServer(port);
  console.log('Server started at port 8000');
}

await init();