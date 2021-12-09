/*:
@target MV MZ
@plugindesc 当たり判定可視化 v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/VisualizeCollisionArea.js
@help
当たり判定を可視化するプラグインです。

【使用方法】
このプラグインを導入したうえでF3キーを押すことで、当たり判定を表示することができます。
また、プラグインパラメータ「イベントを当たり判定に含める」を設定することで、
当たり判定可視化のチェックにイベントが含まれるのを許可したり禁止したりすることができます。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@param IncludeEventsInCollisionArea
@text イベントを当たり判定に含める
@type boolean
@default false
@desc
trueを設定すると、当たり判定可視化の際にイベントを当たり判定として考慮するようになります。

@param CollisionAreaColor
@text 衝突エリアカラー
@type string
@default #ff0000aa
@desc
衝突エリアのカラーをCSSカラー形式(RGBA)で指定します。

@param VisualizeKeyCode
@text 可視化キー名
@type string
@default 114
@desc
可視化の有無を切り替えるキーコードを指定します。
*/

const VisualizeCollisionArea = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {
"use strict";

const PP = PluginManager.parameters(VisualizeCollisionArea);

const VisualizeKeyCode = parseInt(PP.VisualizeKeyCode);
const IncludeEventsInCollisionArea = PP.IncludeEventsInCollisionArea === "true";
const CollisionAreaColor = PP.CollisionAreaColor;

Input.keyMapper[VisualizeKeyCode] = "VisualizeCollisionArea";

class Sprite_CollisionArea extends Sprite {
    initialize(bitmap = null) {
        super.initialize(bitmap);
    }

    update() {
        super.update();
        this.updatePosition();
    }

    updatePosition() {
        this.x = -$gameMap.displayX() * $gameMap.tileWidth();
        this.y = -$gameMap.displayY() * $gameMap.tileHeight();
    }

    visualizeCollisionArea() {
        if (this.bitmap) {
            this.bitmap.clear();
        } else {
            this.bitmap = new Bitmap($gameMap.width() * $gameMap.tileWidth(), $gameMap.height() * $gameMap.tileHeight());
        }
    
        const massCollisionTableGenerator = new MassCollisionTableGenerator();
        const massCollisionTable = massCollisionTableGenerator.createMassCollisionTable();
        for (const massRects of massCollisionTable) {
            if (!massRects) continue;
            for (const rect of massRects) {
                const x = rect.x * $gameMap.tileWidth();
                const y = rect.y * $gameMap.tileHeight();
                const width = rect.width * $gameMap.tileWidth();
                const height = rect.height * $gameMap.tileHeight();
                this.bitmap.fillRect(x, y, width, height, CollisionAreaColor);
            }
        }
    }
}


class MassCollisionTableGenerator {
    createMassCollisionTable() {
        const checkedTable = new Array($gameMap.height() * $gameMap.width());
        const massCollisionTable = new Array($gameMap.height() * $gameMap.width());
        let loopCount = 0;
    
        const checkMassRect = (x, y) => {
            if (++loopCount > 4096) {
                throw new Error("マップが巨大すぎるため、衝突判定マップの作成に失敗しました。");
            }
            for (const direction of [8, 6, 2, 4]) {
                const x2 = $gameMap.roundXWithDirection(x, direction);
                const y2 = $gameMap.roundYWithDirection(y, direction);
                if (!(x2 >= 0 && x2 < $gameMap.width() && y2 >= 0 && y2 < $gameMap.height())) continue;
                const nextPos = y2 * $gameMap.width() + x2;
                if (this.checkPassMass(x, y, direction)) {
                    if (massCollisionTable[nextPos]) {
                        massCollisionTable[nextPos] = null;
                        checkedTable[nextPos] = true;
                    } else {
                        if (checkedTable[nextPos]) continue;
                    }
                } else {
                    checkedTable[nextPos] = true;
                    continue;
                }
                checkMassRect(x2, y2);
            }
        };
    
        for (let y = 0; y < $gameMap.height(); y++) {
            for (let x = 0; x < $gameMap.width(); x++) {
                const pos = y * $gameMap.width() + x;
                massCollisionTable[pos] = this.getMassRects(x, y);
            }
        }
    
        checkMassRect($gamePlayer.x, $gamePlayer.y);
    
        return massCollisionTable;
    }

    getMassRects(x, y) {
        if (typeof DotMoveSystem_FunctionExPluginName === "undefined") {
            return [new Rectangle(x, y, 1, 1)];
        } else {
            const collisionChecker = $gamePlayer.mover()._controller._collisionChecker;
            return collisionChecker.getMassRects(x, y);
        }
    }

    checkPassMass(x, y, direction) {
        if (typeof DotMoveSystem_FunctionExPluginName !== "undefined") {
            const x2 = $gameMap.roundXWithDirection(x, direction);
            const y2 = $gameMap.roundYWithDirection(y, direction);
            const collisionChecker = $gamePlayer.mover()._controller._collisionChecker;
            if (collisionChecker.getMassCollisionType(x2, y2) >= 1 && collisionChecker.getMassCollisionType(x2, y2) <= 12) {
                return false;
            }
        }
        if (IncludeEventsInCollisionArea) {
            return $gamePlayer.canPass(x, y, direction);
        }
        return $gamePlayer.isMapPassable(x, y, direction);
    }
}


class VisualizeBitmapCache {
    constructor(mapId, bitmap) {
        this._mapId = mapId;
        this._bitmap = bitmap;
    }

    mapId() {
        return this._mapId;
    }

    bitmap() {
        return this._bitmap;
    }
}


const _Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
Spriteset_Map.prototype.initialize = function() {
    _Spriteset_Map_initialize.call(this);
    this._collisionAreaVisualizeState = "none";
};

Spriteset_Map.prototype.visualizeCollisionArea = function() {
    if ($gameTemp.visualizeBitmapCache() && $gameTemp.visualizeBitmapCache().mapId() === $gameMap.mapId()) {
        if (!this._collisionAreaSprite) {
            this._collisionAreaSprite = new Sprite_CollisionArea($gameTemp.visualizeBitmapCache().bitmap());
            this._baseSprite.addChild(this._collisionAreaSprite);
        }
    } else {
        if (!this._collisionAreaSprite) {
            this._collisionAreaSprite = new Sprite_CollisionArea();
            this._baseSprite.addChild(this._collisionAreaSprite);
        }
        this._collisionAreaSprite.visualizeCollisionArea();
        $gameTemp.setVisualizeBitmapCache(new VisualizeBitmapCache($gameMap.mapId(), this._collisionAreaSprite.bitmap));
    }
}

Spriteset_Map.prototype.hideCollisionArea = function() {
    if (this._collisionAreaSprite) {
        this._collisionAreaSprite.bitmap.baseTexture.destroy();
        this._baseSprite.removeChild(this._collisionAreaSprite);
        $gameTemp.setVisualizeBitmapCache(null);
        this._collisionAreaSprite = null;
    }
}

const _Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
    _Spriteset_Map_update.call(this);
    if ($gameTemp.isPlaytest()) {
        if (Input.isTriggered("VisualizeCollisionArea")) {
            $gameTemp.setCollisionAreaVisualized(!$gameTemp.collisionAreaVisualized());
            this._collisionAreaVisualizeState = "none";
        }

        if (this._collisionAreaVisualizeState === "none") {
            this._collisionAreaVisualizeState = "wait";
            return;
        }

        if (this._collisionAreaVisualizeState === "wait") {
            this._collisionAreaVisualizeState = "changed";
            if ($gameTemp.collisionAreaVisualized()) {
                this.visualizeCollisionArea();
            } else {
                this.hideCollisionArea();
            }
        }
    }
}


const _Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    this._collisionAreaVisualized = false;
    this._visualizeBitmapCache = null;
};

Game_Temp.prototype.collisionAreaVisualized = function() {
    return this._collisionAreaVisualized;
};

Game_Temp.prototype.setCollisionAreaVisualized = function(collisionAreaVisualized) {
    this._collisionAreaVisualized = collisionAreaVisualized;
};

Game_Temp.prototype.visualizeBitmapCache = function() {
    return this._visualizeBitmapCache;
};

Game_Temp.prototype.setVisualizeBitmapCache = function(visualizeBitmapCache) {
    this._visualizeBitmapCache = visualizeBitmapCache;
};

})();
