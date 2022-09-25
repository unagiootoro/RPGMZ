/*:
@target MZ
@plugindesc ドット移動システム 競合回避用パッチ v1.2.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem_ConflictPatch.js
@help
ドット移動システム用の競合回避パッチです。

【使用方法】
下記の順にプラグインを導入してください。
・DotMoveSystem.js
・OverpassTile.js
・RegionBase.js
・DotMoveSystem_ConflictPatch.js

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

(() => {
    "use strict";

    const { CharacterCollisionCheckProcess } = DotMoveSystem;

    Game_Follower.prototype.findCollisionData = function(x, y) {
        return $gameMap.findArrayDataRegionAndTerrain(x, y, 'collisionForPlayer');
    };

    // OverpassTile.jsで再定義される
    Game_CharacterBase.prototype.isHigherPriority = function() {
        return undefined;
    };

    const CharacterCollisionCheckProcess_checkCharacter = CharacterCollisionCheckProcess.prototype.checkCharacter;
    CharacterCollisionCheckProcess.prototype.checkCharacter = function(x, y, d, character) {
        if (this._character.isHigherPriority() !== character.isHigherPriority()) return null;
        return CharacterCollisionCheckProcess_checkCharacter.call(this, x, y, d, character);
    };
})();
