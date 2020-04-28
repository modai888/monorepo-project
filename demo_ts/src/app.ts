/**
 * app
 */
import http from 'http';

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    res.setHeader('Content-Type', 'text/html');
    res.end('hello world22');
});

const port = process.env.DEMO_TS_PORT || 8000;
server.listen(port, () => {
    console.log(`The server has started on port ${port}: ${process.env.NODE_ENV}`)
});
