/*:
@target MZ
@plugindesc Webサーバプラグイン v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SimpleWebServer.js
@help
RPGツクールMZのゲーム自体をWebサーバとして動作させるプラグインです。
このプラグインを導入することでWebサーバを簡単に立ち上げることができ、
ブラウザでの動作確認を気軽に行うことができるようになります。

【使用方法】
このプラグインを導入したゲームをテストプレイで起動した後、ブラウザのURLに
http://localhost:5700
と入力することでブラウザでゲームをプレイすることができます。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@param IpAddress
@text IPアドレス
@type number
@default 0.0.0.0
@desc
サーバーをリッスンするIPアドレスを指定します。

@param Port
@text ポート
@type number
@default 5700
@desc
サーバーをリッスンするポートを指定します。
*/

const SimpleWebServerPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {
"use strict";

const params = PluginManager.parameters(SimpleWebServerPluginName);
const IpAddress = params["IpAddress"];
const Port = parseInt(params["Port"]);

if (!(Utils.isNwjs() && Utils.isOptionValid("test"))) return;

const http = require("http");
const path = require("path")
const fs = require("fs");

class SimpleWebServer {
    constructor() {
        this._mimeTypes = this._createMimeTypes();
        this._server = this._createServer();
    }

    run(ipAddr, port) {
        this._server.listen(port, ipAddr);
    }

    _createMimeTypes() {
        return {
            ".html": "text/html",
            ".wasm": "application/wasm",
        };
    }

    _createServer() {
        const server = http.createServer();
        server.on("request", this._serverProcess.bind(this));
        return server;
    }

    _serverProcess(req, res) {
        let filePath;
        if (req.url === "/") {
            filePath = "index.html"
        } else {
            const matchData = req.url.match(/^\/(.+)/);
            filePath = decodeURIComponent(matchData[1]);
        }
        if (fs.existsSync(filePath)) {
            res.writeHead(200, { "Content-Type": this._getMimeType(filePath) });
            const file = fs.readFileSync(filePath);
            res.write(file);
        } else {
            res.writeHead(404, {});
            res.write("404 Not found.");
        }
        res.end();
    }

    _getMimeType(filePath) {
        const extName = path.extname(filePath);
        const mimeType = this._mimeTypes[extName];
        if (mimeType) {
            return mimeType;
        }
        return "text/plain";
    }
}

const server = new SimpleWebServer();
server.run(IpAddress, Port);

})();
