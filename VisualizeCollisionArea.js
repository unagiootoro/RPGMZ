/*:
@target MV MZ
@plugindesc 当たり判定可視化 v1.3.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/VisualizeCollisionArea.js
@help
当たり判定を可視化するプラグインです。

【使用方法】
このプラグインを導入したうえでF3キーを押すことで、当たり判定を表示することができます。
ドット移動機能拡張プラグインによって設定した半マス当たり判定や斜め当たり判定についても反映されます。
また、プラグインパラメータ「イベントを当たり判定に含める」を設定することで、
当たり判定可視化のチェックにイベントが含まれるのを許可したり禁止したりすることができます。
※注意: イベントが移動した場合については考慮されません。

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
@text 可視化キーコード
@type string
@default 114
@desc
可視化の有無を切り替えるキーコードを指定します。

@param VisualizeGamepadButtonIndex
@text 可視化ゲームパッドボタンインデックス
@type number
@min -1
@default -1
@desc
可視化の有無を切り替えるゲームパッドのボタンを指定します。使用しない場合は-1を指定してください。
*/

const VisualizeCollisionArea = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {
"use strict";

const PP = PluginManager.parameters(VisualizeCollisionArea);

const VisualizeKeyCode = parseInt(PP.VisualizeKeyCode);
const VisualizeGamepadButtonIndex = parseInt(PP.VisualizeGamepadButtonIndex);
const IncludeEventsInCollisionArea = PP.IncludeEventsInCollisionArea === "true";
const CollisionAreaColor = PP.CollisionAreaColor;

if (!isNaN(VisualizeKeyCode)) {
    Input.keyMapper[VisualizeKeyCode] = "VisualizeCollisionArea";
}
if (!isNaN(VisualizeGamepadButtonIndex) && VisualizeGamepadButtonIndex >= 0) {
    Input.gamepadMapper[VisualizeGamepadButtonIndex] = "VisualizeCollisionArea";
}

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
    
        const massCollisionTableGenerator = new MassCollisionTableGenerator($gamePlayer);
        const massCollisionTable = massCollisionTableGenerator.createMassCollisionTable();
        for (const massInfos of massCollisionTable) {
            if (!massInfos) continue;
            for (const massInfo of massInfos) {
                this.drawMassInfo(massInfo);
            }
        }
    }

    drawMassInfo(massInfo) {
        if (massInfo.type === "rect") {
            const rect = massInfo.rect;
            const x = rect.x * $gameMap.tileWidth();
            const y = rect.y * $gameMap.tileHeight();
            const width = rect.width * $gameMap.tileWidth();
            const height = rect.height * $gameMap.tileHeight();
            this.bitmap.fillRect(x, y, width, height, CollisionAreaColor);
        } else if (massInfo.type === "triangle") {
            const triangle = massInfo.triangle;
            const x1 = triangle.x1 * $gameMap.tileWidth();
            const y1 = triangle.y1 * $gameMap.tileHeight();
            const x2 = triangle.x2 * $gameMap.tileWidth();
            const y2 = triangle.y2 * $gameMap.tileHeight();
            const x3 = triangle.x3 * $gameMap.tileWidth();
            const y3 = triangle.y3 * $gameMap.tileHeight();
            const ctx = this.bitmap.context;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.fillStyle = CollisionAreaColor;
            ctx.fill();
        }
    }
}


class MassCollisionTableGenerator {
    constructor(character) {
        this._character = character;
    }

    createMassCollisionTable() {
        const passTable = this.computePassTable();
        const massCollisionTable = new Array($gameMap.height() * $gameMap.width());

        for (let y = 0; y < $gameMap.height(); y++) {
            for (let x = 0; x < $gameMap.width(); x++) {
                const pos = y * $gameMap.width() + x;
                if (!passTable[pos]) {
                    massCollisionTable[pos] = this.getMassInfos(x, y);
                }
            }
        }

        return massCollisionTable;
    }

    computePassTable() {
        const openList = [];
        const passTable = new Array($gameMap.height() * $gameMap.width());

        const posStart = this._character.y * $gameMap.width() + this._character.x;
        openList.push(posStart);
        passTable[posStart] = 1;

        while (openList.length > 0) {
            const pos1 = openList[0];
            const x1 = pos1 % $gameMap.width();
            const y1 = Math.floor(pos1 / $gameMap.width());

            openList.splice(0, 1);

            for (const direction of [8, 6, 2, 4]) {
                const x2 = $gameMap.roundXWithDirection(x1, direction);
                const y2 = $gameMap.roundYWithDirection(y1, direction);

                if (!$gameMap.isValid(x2, y2)) continue;

                const pos2 = y2 * $gameMap.width() + x2;

                if (passTable[pos2] != null) continue;

                if (this.checkPassMass(x1, y1, direction)) {
                    passTable[pos2] = true;
                    if (!openList.includes(pos2)) {
                        openList.push(pos2);
                    }
                } else {
                    passTable[pos2] = false;
                }
            }
        }

        return passTable;
    }

    getMassInfos(x, y) {
        if (typeof DotMoveSystem_FunctionExPluginName === "undefined") {
            return [new MassInfo("rect", new Rectangle(x, y, 1, 1))];
        } else {
            const collisionChecker = new DotMoveSystem.CharacterCollisionChecker($gamePlayer);
            const id = collisionChecker.getMassCollisionType(x, y);
            if (id === 13) {
                return [new MassInfo("triangle", new Triangle(x, y, x + 1, y, x, y + 1))];
            } else if (id === 14) {
                return [new MassInfo("triangle", new Triangle(x, y, x + 1, y + 1, x, y + 1))];
            } else if (id === 15) {
                return [new MassInfo("triangle", new Triangle(x + 1, y, x + 1, y + 1, x, y + 1))];
            } else if (id === 16) {
                return [new MassInfo("triangle", new Triangle(x, y, x + 1, y, x + 1, y + 1))];
            } else {
                const rects = collisionChecker.getMassRects(x, y);
                return rects.map(rect => new MassInfo("rect", rect));
            }
        }
    }

    checkPassMass(x, y, direction) {
        if (typeof DotMoveSystem_FunctionExPluginName !== "undefined") {
            const x2 = $gameMap.roundXWithDirection(x, direction);
            const y2 = $gameMap.roundYWithDirection(y, direction);
            const collisionChecker = $gamePlayer.mover()._controller._collisionChecker;
            if (collisionChecker.getMassCollisionType(x2, y2) >= 1 && collisionChecker.getMassCollisionType(x2, y2) <= 16) {
                return false;
            }
        }
        if (IncludeEventsInCollisionArea) {
            return $gamePlayer.canPass(x, y, direction);
        }
        return $gamePlayer.isMapPassable(x, y, direction);
    }
}


class Triangle {
    constructor(x1, y1, x2, y2, x3, y3) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
    }
}


class MassInfo {
    get type() { return this._type; }
    get rect() { return this._rect; }
    get triangle() { return this._triangle; }

    constructor(type, rectOrTriangle) {
        this._type = type;
        if (type === "rect") {
            this._rect = rectOrTriangle;
            this._triangle = null;
        } else if (type === "triangle") {
            this._rect = null;
            this._triangle = rectOrTriangle;
        } else {
            throw new Error(`${type} is not found.`);
        }
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
