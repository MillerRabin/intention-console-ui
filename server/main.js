import serve from 'koa-static';
import Koa from 'koa';
import path from 'path';
import http from 'http';

function createServer(port) {
  const app = new Koa();
  const cPath = path.resolve('.');
  app.use(serve(cPath));

  return new Promise((resolve, reject) => {
    const server = http.createServer(app.callback());
    server.listen(port, (err) => {
      if (err != null) return reject(err);
      return resolve(server);
    });
  });
}

createServer(8000).then(() => {
  console.log('Server started at port 8000');
});