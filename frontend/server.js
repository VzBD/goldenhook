// Lightweight Next.js server for cPanel/Passenger
const next = require('next');
const http = require('http');

const dev = false;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Next server listening on ${port}`);
  });
});
