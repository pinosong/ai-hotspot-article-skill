// Local relay: Chromium -> 127.0.0.1:18080 -> egress proxy (adds Proxy-Authorization).
// The VM's egress proxy does TLS MITM; Chromium must ALSO be launched with
// --ignore-certificate-errors, and --proxy-server=http://127.0.0.1:18080.
// Playwright's `proxy` option with proxy credentials hangs -- do not use it.
const net = require('net');

const purl = new URL(process.env.HTTPS_PROXY || process.env.https_proxy || '');
const PROXY_HOST = purl.hostname;
const PROXY_PORT = Number(purl.port) || 8080;
const AUTH = 'Basic ' + Buffer.from(
  decodeURIComponent(purl.username) + ':' + decodeURIComponent(purl.password)
).toString('base64');

const server = net.createServer((client) => {
  let buf = Buffer.alloc(0);
  const onData = (chunk) => {
    buf = Buffer.concat([buf, chunk]);
    const idx = buf.indexOf('\r\n\r\n');
    if (idx === -1) return;
    client.removeListener('data', onData);
    const head = buf.slice(0, idx).toString('latin1');
    const rest = buf.slice(idx + 4);
    const lines = head.split('\r\n');
    const [method, target, ver] = lines[0].split(' ');
    const upstream = net.connect(PROXY_PORT, PROXY_HOST, () => {
      if (method === 'CONNECT') {
        upstream.write(
          `CONNECT ${target} HTTP/1.1\r\nHost: ${target}\r\n` +
          `Proxy-Authorization: ${AUTH}\r\nProxy-Connection: Keep-Alive\r\n\r\n`
        );
      } else {
        let out = `${method} ${target} ${ver}\r\n`;
        let hasAuth = false;
        for (const l of lines.slice(1)) {
          if (/^proxy-authorization:/i.test(l)) { hasAuth = true; out += `Proxy-Authorization: ${AUTH}\r\n`; }
          else out += l + '\r\n';
        }
        if (!hasAuth) out += `Proxy-Authorization: ${AUTH}\r\n`;
        upstream.write(out + '\r\n');
      }
      if (rest.length) upstream.write(rest);
      upstream.pipe(client);
      client.pipe(upstream);
    });
    const kill = () => { try { client.destroy(); } catch (e) {} try { upstream.destroy(); } catch (e) {} };
    upstream.on('error', kill);
    client.on('error', kill);
  };
  client.on('data', onData);
  client.on('error', () => {});
});

server.listen(18080, '127.0.0.1', () => console.log('relay up on 127.0.0.1:18080'));
