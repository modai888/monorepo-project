"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * app
 */
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end('hello world22');
});
const port = process.env.DEMO_TS_PORT || 8000;
server.listen(port, () => {
    console.log(`The server has started on port ${port}: ${process.env.NODE_ENV}`);
});
//# sourceMappingURL=app.js.map