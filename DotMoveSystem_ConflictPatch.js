/*:
@target MZ
@plugindesc ドット移動システム 競合回避用パッチ v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem_ConflictPatch.js
@help
ドット移動システム用の競合回避パッチです。

【使用方法】
下記の順にプラグインを導入してください。
・RegionBase.js
・DotMoveSystem.js
・DotMoveSystem_ConflictPatch.js

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

for (const className in DotMoveSystemClassAlias) {
    this[className] = DotMoveSystemClassAlias[className];
}  

(() => {
"use strict";

Game_Follower.prototype.findCollisionData = function(x, y) {
    return $gameMap.findArrayDataRegionAndTerrain(x, y, 'collisionForPlayer');
};

})();
