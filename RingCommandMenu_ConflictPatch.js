/*:
@target MZ
@plugindesc リングコマンドメニュー 競合回避用パッチ v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/RingCommandMenu_ConflictPatch.js
@help
リングコマンドメニュー用の競合回避パッチです。

【使用方法】
下記の順にプラグインを導入してください。
・MOGシリーズのプラグイン
・RingCommandMenu.js
・RingCommandMenu_ConflictPatch.js

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

for (const className in RingCommandMenuClassAlias) {
    this[className] = RingCommandMenuClassAlias[className];
}  

(() => {
"use strict";

Scene_RingCommandMenu.prototype.updateMenuBackground = function() {
};

Spriteset_RingCommandMenu.prototype.canReloadWeatherEX = function() {
    return false;
};

})();
