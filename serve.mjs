import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

createServer(async (req, res) => {
  try {
    let urlPath = req.url.split('?')[0].split('#')[0];
    if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
    const data = await readFile(join(__dirname, urlPath));
    const ext = extname(urlPath).toLowerCase();
    res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain; charset=utf-8' });
    res.end(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        const data = await readFile(join(__dirname, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      } catch {
        res.writeHead(404); res.end('Not found');
      }
    } else {
      res.writeHead(500); res.end('Server error: ' + err.message);
    }
  }
}).listen(PORT, () => {
  console.log(`\n  Bird Hunt Permit Hub`);
  console.log(`  Running at: http://localhost:${PORT}\n`);
});
