/*:
@target MZ
@plugindesc SupportSubfolder v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SupportSubfolder.js
@help
RPGツクールMZ v1.3.0以降で追加されたサブフォルダー機能に対応していないプラグインも
サブフォルダーに対応できるようにするプラグインです。

【使い方】
SupportSubfolder.jsをどのプラグインよりも一番上に導入してください。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

(() => {
"use strict";

const _PluginManager_parameters = PluginManager.parameters;
PluginManager.parameters = function(name) {
    const lowerPluginName = name.toLowerCase();
    if (this._parameters[lowerPluginName] == null) {
        const reg = new RegExp(lowerPluginName + "$");
        const pluginPath = Object.keys(this._parameters).find(pluginPath => pluginPath.match(reg));
        return _PluginManager_parameters.call(this, pluginPath);
    }
    return _PluginManager_parameters.call(this, name);
};

})();
