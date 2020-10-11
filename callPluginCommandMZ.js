/*:
@target MV MZ
@plugindesc スクリプトからプラグインコマンドをコール v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/callPluginCommandMZ.js
@help
プラグインコマンドをスクリプトからコールできるようになります。

【使用方法】
スクリプトで次のコードを実行します。
callPluginCommand(this, プラグイン名, プラグインコマンド名, プラグインコマンド引数);

プラグイン名...実行するプラグインコマンドを持つプラグイン名を指定します。
プラグインコマンド名...実行するプラグインコマンド名を指定します。
プラグインコマンド引数...プラグインコマンドの引数を指定します。
この引数は文字列化されていないオブジェクトを指定する必要があります。

(例)
callPluginCommand(this, "SamplePlugin", "SamplePluginCommand", { array: [ { a: 100, b: 200 } ] });

【MVで使用した場合】
このプラグインをMVで使用した場合、MZの形式で登録されたプラグインコマンドを呼び出すように動作します。
MVのプラグインコマンドを呼び出すわけではないので注意してください。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const generatePluginParamStr = (params) => {
    if (typeof params === "string") {
        return params;
    } else if (typeof params === "object") {
        let result;
        if (params instanceof Array) {
            result = params.map(param => generatePluginParamStr(param));
        } else {
            result = {};
            for (const key in params) {
                result[key] = generatePluginParamStr(params[key]);
            }
        }
        return JSON.stringify(result);
    } else {
        return JSON.stringify(params);
    }
};

const callPluginCommand = (self, pluginName, commandName, params) => {
    const args = {};
    for (const key in params) {
        args[key] = generatePluginParamStr(params[key]);
    }
    PluginManager.callCommand(self, pluginName, commandName, args);
};

(() => {
"use strict";

if (Utils.RPGMAKER_NAME === "MV") {
    PluginManager._commands = {};

    PluginManager.registerCommand = function(pluginName, commandName, func) {
        const key = pluginName + ":" + commandName;
        this._commands[key] = func;
    };

    PluginManager.callCommand = function(self, pluginName, commandName, args) {
        const key = pluginName + ":" + commandName;
        const func = this._commands[key];
        if (typeof func === "function") {
            console.log(args);
            func.bind(self)(args);
        }
    };
}

})();
