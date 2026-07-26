const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'docs');
const port = 4173;

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };

http.createServer((req, res) => {
  let filePath = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  try {
    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch (e) {}
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
    res.end(data);
  });
}).listen(port, () => console.log('Serving docs/ at http://localhost:' + port));
