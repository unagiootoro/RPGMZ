/*:
@target MV MZ
@plugindesc Dot movement system v1.7.2
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem.js
@help
It is a plugin that allows you to move in dot units.

【How to use】
Basically, it can be used just by installing it, but more detailed control is possible by setting the following contents.

■ Setting of movement unit
In the travel route script
this.setMoveUnit (Movement unit (decimal between 0 and 1));
By writing, you can specify the movement unit per step.
For example, to move an event half a step
this.setMoveUnit(0.5);
It is described as.

■ Move to any angle in dot units
In the travel route script
this.dotMoveByDeg (angle (integer from 0 to 359));
By writing, you can move in the direction of the angle specified in dot units.

■ Move the event in the direction of the player in dot units
In the travel route script
this.dotMoveToPlayer();
By writing, you can move the event in the direction of the player in dot units.

■ Move to the specified coordinates
In the travel route script
this.moveToTarget(X coordinate, Y coordinate);
You can move it toward the specified coordinates by writing.
※1 If it collides with a wall etc. on the way, the arrival coordinates will shift.
※2 The movement with respect to the specified coordinates is performed with the upper left of the character as the origin.

■ Event contact judgment settings
Annotate the very first event command on the EV page on the first page of the event
Event contact judgment can be set in more detail by describing the following contents in the annotation.
・ Contact range on the horizontal axis
<widthArea: Contact width (decimal number between 0 and 1)>

・ Contact range on the vertical axis
<heightArea: Contact width (decimal number between 0 and 1)>

If you set the event priority below the regular character or above the regular character,
Both the contact range on the horizontal axis and the contact range on the vertical axis are used as the contact range.
When set to the same as a normal character, the contact range on the horizontal axis will be changed when touching upward or downward.
When touching to the left or right, the contact range on the vertical axis is used.

If neither the horizontal axis nor the vertical axis is set, 0.5 will be applied.

■ Event size setting
Annotate the very first event command on the EV page on the first page of the event
You can set the size of the event in more detail by including the following in the annotation.
・ Horizontal size
<width: width (real numbers greater than or equal to 0.5>

・ Vertical size
<height: height (real numbers greater than or equal to 0.5)>

・ X coordinate display offset
<offsetX: offset (real number)>

・ Y coordinate display offset
<offsetY: offset (real number)>

For example, to set a 96 * 96 size character with width: 2 and height: 2, it will be as follows.
When displaying a character larger than 48 * 48, the display start position is different from the actual XY coordinates.
You need to adjust the display offset.
<width: 2>
<height: 2>
<offsetX: 0.5>
<offsetY: 1>

■ Other functions that can be used in scripts
Game_CharacterBase#isMoved()
Gets whether the character has moved into that frame.

Game_CharacterBase#calcFar(targetCharacter)
Gets the distance between the characters. The origin of the distance calculation uses the center point.

Game_CharacterBase#calcDeg(targetCharacter)
Gets the angle to the target character. The origin of the angle calculation uses the center point.

【License】
This plugin is available under the terms of the MIT license.
*/

/*:ja
@target MV MZ
@plugindesc ドット移動システム v1.7.2
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem.js
@help
ドット単位での移動が可能になるプラグインです。

【使用方法】
基本的に導入するだけで使用可能ですが、以下の内容を設定することでより詳細な制御が可能になります。

■ 移動単位の設定
移動ルートのスクリプトで
this.setMoveUnit(移動単位(0～1の間の小数));
と記載することで、一歩あたりの移動単位を指定することができます。
例えば、イベントを半歩移動させるには
this.setMoveUnit(0.5);
と記載します。

■ ドット単位で任意の角度に移動させる
移動ルートのスクリプトで
this.dotMoveByDeg(角度(0～359の整数));
と記載することで、ドット単位で指定した角度の方向へ移動させることができます。

■ ドット単位でイベントをプレイヤーの方向に移動させる
移動ルートのスクリプトで
this.dotMoveToPlayer();
と記載することで、イベントをドット単位でプレイヤーの方向に移動させることができます。

■ 指定の座標に移動させる
移動ルートのスクリプトで
this.moveToTarget(X座標, Y座標);
と記載することで、指定した座標に向けて移動させることができます。
※1 途中で壁などに衝突した場合は到達座標がずれます。
※2 指定の座標に対する移動はキャラクターの左上を原点として行います。

■ イベント接触判定の設定
イベントの1ページ目のEVページの一番最初のイベントコマンドを注釈にしたうえで、
注釈に以下の内容を記載することでイベント接触判定をより詳細に設定することができます。
・横軸の接触範囲
<widthArea: 接触幅(0～1の間の小数)>

・縦軸の接触範囲
<heightArea: 接触幅(0～1の間の小数)>

イベントのプライオリティを通常キャラの下または通常キャラの上に設定した場合、
横軸の接触範囲と縦軸の接触範囲の両方を接触範囲として使用します。
通常キャラと同じに設定した場合、上または下方向に接触した場合は横軸の接触範囲が、
左または右方向に接触した場合は縦軸の接触範囲が使用されます。

横軸、縦軸ともに設定しなかった場合は0.5が適用されます。

■ イベントのサイズの設定
イベントの1ページ目のEVページの一番最初のイベントコマンドを注釈にしたうえで、
注釈に以下の内容を記載することでイベントのサイズをより詳細に設定することができます。
・横方向サイズ
<width: 横幅(0.5以上の実数>

・縦方向サイズ
<height: 縦幅(0.5以上の実数)>

・X座標表示オフセット
<offsetX: オフセット(実数)>

・Y座標表示オフセット
<offsetY: オフセット(実数)>

例えば96*96サイズのキャラクターをwidth: 2, height: 2で設定する場合は次のようになります。
48*48より大きいサイズのキャラクターを表示する場合、表示開始位置が実際のXY座標とは異なるため、
表示オフセットを調整する必要があります。
<width: 2>
<height: 2>
<offsetX: 0.5>
<offsetY: 1>

■ その他スクリプトで使用可能な関数
Game_CharacterBase#isMoved()
キャラクターがそのフレーム中に移動したか否かを取得します。

Game_CharacterBase#calcFar(targetCharacter)
キャラクター間の距離を取得します。距離計算の原点は中心点を使用します。

Game_CharacterBase#calcDeg(targetCharacter)
ターゲットのキャラクターに対する角度を取得します。角度計算の原点は中心点を使用します。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const DotMoveSystemPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

const DotMoveSystemClassAlias = (() => {
"use strict";

const DIALOG_COST = 1 / Math.sin(Math.PI / 4);

class EventParamParser {
    static getWidth(event) {
        let width = 1;
        let noteWidth = this.getAnnotationValue(event, "width");
        if (noteWidth != null) width = parseFloat(noteWidth);
        return width;
    }

    static getHeight(event) {
        let height = 1;
        let noteHeight = this.getAnnotationValue(event, "height");
        if (noteHeight != null) height = parseFloat(noteHeight);
        return height;
    }

    static getOffsetX(event) {
        let offsetX = 0;
        let noteOffsetX = this.getAnnotationValue(event, "offsetX");
        if (noteOffsetX != null) offsetX = parseFloat(noteOffsetX);
        return offsetX;
    }

    static getOffsetY(event) {
        let offsetY = 0;
        let noteOffsetY = this.getAnnotationValue(event, "offsetY");
        if (noteOffsetY != null) offsetY = parseFloat(noteOffsetY);
        return offsetY;
    }

    static getWidthArea(event) {
        let widthArea = 0.5;
        let noteWidthArea = this.getAnnotationValue(event, "widthArea");
        if (noteWidthArea != null) widthArea = parseFloat(noteWidthArea);
        return widthArea;
    }

    static getHeightArea(event) {
        let heightArea = 0.5;
        let noteHeightArea = this.getAnnotationValue(event, "heightArea");
        if (noteHeightArea != null) heightArea = parseFloat(noteHeightArea);
        return heightArea;
    }

    static getAnnotationValue(event, name) {
        const note = this.getAnnotation(event);
        const data = { note: note };
        DataManager.extractMetadata(data);
        if (data.meta[name]) return data.meta[name];
        return null;
    }

    static getAnnotation(event) {
        const eventData = event.event();
        if (eventData) {
            const noteLines = [];
            const page0List = eventData.pages[0].list;
            if (page0List.length > 0 && page0List[0].code === 108) {
                for (let i = 0; i < page0List.length; i++) {
                    if (page0List[0].code === 108 || page0List[0].code === 408) {
                        noteLines.push(page0List[i].parameters[0]);
                    } else {
                        break;
                    }
                }
                return noteLines.join("\n");
            }
        }
        return "";
    }
}

class DotMoveUtils {
    static direction2deg(direction) {
        switch (direction) {
        case 8:
            return 0;
        case 9:
            return 45;
        case 6:
            return 90;
        case 3:
            return 135;
        case 2:
            return 180;
        case 1:
            return 225;
        case 4:
            return 270;
        case 7:
            return 315;
        }
    }

    static deg2direction(deg) {
        deg = this.degNormalization(deg);
        const t = Math.round(deg / 45);
        if (t === 0 || t === 8) {
            return 8;
        } else if (t === 1) {
            return 9;
        } else if (t === 2) {
            return 6;
        } else if (t === 3) {
            return 3;
        } else if (t === 4) {
            return 2;
        } else if (t === 5) {
            return 1;
        } else if (t === 6) {
            return 4;
        } else if (t === 7) {
            return 7;
        } else {
            throw new Error(`${deg} is not found`);
        }
    }

    static deg2direction4(deg, lastDirection) {
        deg = this.degNormalization(deg);
        const t = Math.round(deg / 45);
        if (t === 0 || t === 8) {
            return 8;
        } else if (t === 1) {
            if (lastDirection === 8) return 8;
            return 6;
        } else if (t === 2) {
            return 6;
        } else if (t === 3) {
            if (lastDirection === 6) return 6;
            return 2;
        } else if (t === 4) {
            return 2;
        } else if (t === 5) {
            if (lastDirection === 2) return 2;
            return 4;
        } else if (t === 6) {
            return 4;
        } else if (t === 7) {
            if (lastDirection === 4) return 4;
            return 8;
        } else {
            throw new Error(`${deg} is not found`);
        }
    }

    static degNormalization(deg) {
        deg %= 360;
        if (deg < 0) deg = 360 + deg;
        return deg;
    }

    static rad2deg(rad) {
        return (rad * 180 / Math.PI) + 90;
    }

    static deg2rad(deg) {
        return (deg - 90) * Math.PI / 180;
    }

    static calcDistance(deg, dpf) {
        const rad = this.deg2rad(deg);
        let disX = dpf * Math.cos(rad);
        let disY = dpf * Math.sin(rad);
        const unit = 65536;
        disX *= unit;
        disX = Math.round(disX);
        disX /= unit;
        disY *= unit;
        disY = Math.round(disY);
        disY /= unit;
        return { x: disX, y: disY };
    }

    static calcDeg(fromPoint, targetPoint) {
        const ox = $gameMap.deltaX(targetPoint.x, fromPoint.x);
        const oy = $gameMap.deltaY(targetPoint.y, fromPoint.y);
        const rad = Math.atan2(oy, ox);
        return this.rad2deg(rad);
    }

    static calcFar(fromPoint, targetPoint) {
        const xDiff = $gameMap.deltaX(targetPoint.x, fromPoint.x);
        const yDiff = $gameMap.deltaY(targetPoint.y, fromPoint.y);
        if (xDiff === 0 && yDiff === 0) return 0;
        return Math.sqrt(xDiff**2 + yDiff**2);
    }

    static nextPointWithDirection(point, direction, unit = 1) {
        let x = point.x;
        let y = point.y;
        const [xSign, ySign] = this.direction2XYSign(direction);
        x += xSign * unit;
        y += ySign * unit;
        x = $gameMap.roundX(x);
        y = $gameMap.roundY(y);
        return { x, y };
    }

    static prevPointWithDirection(point, direction, unit = 1) {
        let x = point.x;
        let y = point.y;
        const [xSign, ySign] = this.direction2XYSign(direction);
        x -= xSign * unit;
        y -= ySign * unit;
        x = $gameMap.roundX(x);
        y = $gameMap.roundY(y);
        return { x, y };
    }

    static direction2XYSign(direction) {
        const [horz, vert] = this.direction2HorzAndVert(direction);
        const xSign = horz === 4 ? -1 : horz === 6 ? 1 : 0;
        const ySign = vert === 8 ? -1 : vert === 2 ? 1 : 0;
        return [xSign, ySign];
    }

    static direction2HorzAndVert(direction) {
        let horz = 5, vert = 5;
        switch (direction) {
        case 8:
            vert = 8;
            break;
        case 9:
            horz = 6;
            vert = 8;
            break;
        case 6:
            horz = 6;
            break;
        case 3:
            horz = 6;
            vert = 2;
            break;
        case 2:
            vert = 2;
            break;
        case 1:
            horz = 4;
            vert = 2;
            break;
        case 4:
            horz = 4;
            break;
        case 7:
            horz = 4;
            vert = 8;
            break;
        }
        return [horz, vert];
    }

    static isCollidedRect(rect1, rect2) {
        if ((rect1.x > rect2.x && rect1.x < (rect2.x + rect2.width) || (rect1.x + rect1.width) > rect2.x && (rect1.x + rect1.width) < rect2.x + rect2.width || rect2.x >= rect1.x && (rect2.x + rect2.width) <= (rect1.x + rect1.width)) &&
            (rect1.y > rect2.y && rect1.y < (rect2.y + rect2.height) || (rect1.y + rect1.height) > rect2.y && (rect1.y + rect1.height) < rect2.y + rect2.height || rect2.y >= rect1.y && (rect2.y + rect2.height) <= (rect1.y + rect1.height))) {
                return true;
        }
        return false;
    }

    static mapEventCacheMasses(x, y, width, height) {
        const masses = [];
        if (x >= $gameMap.width()) x = $gameMap.width();
        if (y >= $gameMap.height()) y = $gameMap.height();
        const x1 = Math.floor(x);
        const x2 = Math.ceil(x) + Math.ceil(width - 1);
        const y1 = Math.floor(y);
        const y2 = Math.ceil(y) + Math.ceil(height - 1);
        for (let ix = x1; ix <= x2; ix++) {
            for (let iy = y1; iy <= y2; iy++) {
                const ix2 = $gameMap.roundX(ix);
                const iy2 = $gameMap.roundY(iy);
                const i = iy2 * $gameMap.width() + ix2;
                masses.push(i);
            }
        }
        return masses;
    }

    static enteringMassesEvents(x, y, width, height) {
        const events = [];
        const masses = this.mapEventCacheMasses(x, y, width, height);
        const mapEventsCache = $gameTemp.mapEventsCache();
        for (const massIdx of masses) {
            const massEvents = mapEventsCache[massIdx];
            if (!massEvents) continue;
            for (const event of massEvents) {
                if (!events.includes(event)) events.push(event);
            }
        }
        return events;
    }
}


// バージョンIDが同じ場合、Game_Map#setupはコールされないため、マップ遷移時の初期化処理はここで実施する
const _Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    // マップ遷移時に全てのムーバーをクリアする(メモリリーク対策)
    $gameTemp.clearMovers();
    // マップ遷移時にマップのイベント配置の初期設定を行う
    $gameMap.initMapEventsCache();
};


const _Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    _Game_Map_initialize.call(this);
    this._disableHereEventRect = null;
};

// 足元のイベント起動を禁止する座標
// 少し移動しただけで何度も足元のイベントが起動されるのと
// 場所移動時に足元のイベントが起動されるのを防ぐために使用
Game_Map.prototype.disableHereEventRect = function() {
    return this._disableHereEventRect;
};

Game_Map.prototype.setDisableHereEventRect = function(rect) {
    this._disableHereEventRect = rect;
};

Game_Map.prototype.initMapEventsCache = function() {
    // ループ時を考慮して実際のマップサイズ+1の幅の領域を確保する
    $gameTemp.setupMapEventsCache(this.width() + 1, this.height() + 1);
    for (const event of this.events()) {
        event.mover().initMapEventCache();
    }
};

// マイナス値に対応
Game_Map.prototype.roundX = function(x) {
    if (this.isLoopHorizontal()) {
        x %= this.width();
        if (x < 0) x = this.width() + x;
    }
    return x;
};

Game_Map.prototype.roundY = function(y) {
    if (this.isLoopVertical()) {
        y %= this.height();
        if (y < 0) y = this.height() + y;
    }
    return y;
};

Game_Map.prototype.distance = function(x1, y1, x2, y2) {
    const xDis = Math.abs(this.deltaX(x1, x2));
    const yDis = Math.abs(this.deltaY(y1, y2));
    if (xDis > yDis) {
        return (xDis - yDis) + yDis * DIALOG_COST;
    } else {
        return (yDis - xDis) + xDis * DIALOG_COST;
    }
};


class CollisionResult {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize(targetRect, collisionRect) {
        this._targetRect = targetRect;
        this._collisionRect = collisionRect;
        this._collisionLengthX = this.calcCollisionLengthX();
        this._collisionLengthY = this.calcCollisionLengthY();
    }

    get targetRect() { return this._targetRect; }
    get collisionRect() { return this._collisionRect; }

    getCollisionLength(axis) {
        if (axis === "x") {
            return this._collisionLengthX;
        } else {
            return this._collisionLengthY;
        }
    }

    collisionLengthX() {
        return this._collisionLengthX;
    }

    collisionLengthY() {
        return this._collisionLengthY;
    }

    calcCollisionLengthX() {
        if (this._targetRect.x > this._collisionRect.x) {
            const len = (this._collisionRect.x + this._collisionRect.width) - this._targetRect.x;
            return len > this._targetRect.width ? this._targetRect.width : len;
        } else {
            return (this._targetRect.x + this._targetRect.width) - this._collisionRect.x;
        }
    }

    calcCollisionLengthY() {
        if (this._targetRect.y > this._collisionRect.y) {
            const len = (this._collisionRect.y + this._collisionRect.height) - this._targetRect.y;
            return len > this._targetRect.height ? this._targetRect.height : len;
        } else {
            return (this._targetRect.y + this._targetRect.height) - this._collisionRect.y;
        }
    }
}


// キャラクターの衝突判定を実施する。
// このクラスからキャラクターの状態を書き換えることはない。
class CharacterCollisionChecker {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize(character) {
        this._character = character;
        this._characterRealPosMode = true;
    }

    checkCollision(x, y, d) {
        let collisionResults = [];
        collisionResults = collisionResults.concat(this.checkCollisionMass(x, y, d));
        // マップの範囲有効判定をマスの衝突確認で実施する必要があるため
        // すり抜けを行う場合このタイミングでreturnする
        if (this._character.isThrough() || this._character.isDebugThrough()) return collisionResults;
        collisionResults = collisionResults.concat(this.checkCollisionCharacters(x, y, d));
        return collisionResults;
    }

    // characterRealPosModeがfalseの場合はキャラクターの衝突判定に整数座標を使用する
    // この機能は経路探索のためにマス単位での衝突判定を可能にすることを主な目的としている
    setCharacterRealPosMode(realPosMode) {
        this._characterRealPosMode = realPosMode;
    }

    isCharacterRealPosMode() {
        return this._characterRealPosMode;
    }

    checkCollisionMass(x, y, d) {
        let collisionResults = [];
        let x1, y1, x2, y2;
        const targetRect = { x: x, y: y, width: this._character.width(), height: this._character.height() };
        switch (d) {
        case 8:
            x1 = Math.floor(x);
            x2 = Math.ceil(x) + Math.ceil(this._character.width() - 1);
            y1 = Math.floor(y);
            y2 = y1;
            break;
        case 6:
            x1 = Math.ceil(x) + Math.ceil(this._character.width() - 1);
            x2 = x1;
            y1 = Math.floor(y);
            y2 = Math.ceil(y) + Math.ceil(this._character.height() - 1);
            break;
        case 2:
            x1 = Math.floor(x);
            x2 = Math.ceil(x) + Math.ceil(this._character.width() - 1);
            y1 = Math.ceil(y) + Math.ceil(this._character.height() - 1);
            y2 = y1;
            break;
        case 4:
            x1 = Math.floor(x);
            x2 = x1;
            y1 = Math.floor(y);
            y2 = Math.ceil(y) + Math.ceil(this._character.height() - 1);
            break;
        }

        for (let ix = x1; ix <= x2; ix++) {
            for (let iy = y1; iy <= y2; iy++) {
                const massRect = { x: ix, y: iy, width: 1, height: 1 };
                if (!this.checkPassMass(ix, iy, d) && this.isCollidedRect(targetRect, d, massRect)) {
                    const collisionResult = new CollisionResult(targetRect, massRect);
                    collisionResults.push(collisionResult);
                }
            }
        }

        if (collisionResults.length > 0) return collisionResults;
        const cliffCollisionResult = this.checkCollisionCliff(targetRect, x, y, x1, y1, x2, y2, d);
        collisionResults = collisionResults.concat(cliffCollisionResult);

        return collisionResults;
    }

    checkCollisionCliff(targetRect, x, y, x1, y1, x2, y2, d) {
        switch (d) {
        case 8:
            return this.checkCollisionXCliff(targetRect, x, x1, x2, y1, d);
        case 6:
            return this.checkCollisionYCliff(targetRect, y, y1, y2, x1, d);
        case 2:
            return this.checkCollisionXCliff(targetRect, x, x1, x2, y1, d);
        case 4:
            return this.checkCollisionYCliff(targetRect, y, y1, y2, x1, d);
        }
        return [];
    }

    checkCollisionXCliff(targetRect, x, x1, x2, y1, d) {
        if (x1 === x2) return [];
        if (!this.checkPassMass(x1, y1, 4) && !this.checkPassMass(x2, y1, 6)) {
            let massRect;
            if (x - x1 > this._character.minTouchWidth()) {
                massRect = { x: x1, y: y1, width: 1, height: 1 };
            } else {
                massRect = { x: x2, y: y1, width: 1, height: 1 };
            }
            if (this.isCollidedRect(targetRect, d, massRect)) {
                const collisionResult = new CollisionResult(targetRect, massRect);
                return [collisionResult];
            }
        }
        return [];
    }

    checkCollisionYCliff(targetRect, y, y1, y2, x1, d) {
        if (y1 === y2) return [];
        if (!this.checkPassMass(x1, y1, 8) && !this.checkPassMass(x1, y2, 2)) {
            let massRect;
            if (y - y1 > this._character.minTouchHeight()) {
                massRect = { x: x1, y: y1, width: 1, height: 1 };
            } else {
                massRect = { x: x1, y: y2, width: 1, height: 1 };
            }
            if (this.isCollidedRect(targetRect, d, massRect)) {
                const collisionResult = new CollisionResult(targetRect, massRect);
                return [collisionResult];
            }
        }
        return [];
    }

    checkCollisionCharacters(x, y, d) {
        return [];
    }

    checkPassMass(x, y, d) {
        const x2 = $gameMap.roundX(x);
        const y2 = $gameMap.roundY(y);
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (this._character.isThrough() || this._character.isDebugThrough()) {
            return true;
        }
        if (this.isMassCollisionNoTarget(x, y, d)) return true;
        const prevPoint = DotMoveUtils.prevPointWithDirection({ x: x2, y: y2 }, d);
        if (!this._character.isMapPassable(prevPoint.x, prevPoint.y, d)) {
            return false;
        }
        return true;
    }

    // キャラクターの位置が小数の場合、逆方向のマスの通行判定が正しく取得できないため、衝突判定対象外とする
    isMassCollisionNoTarget(x, y, d) {
        switch (d) {
        case 8:
            if (this._character._realY + this._character.height() <= y + 1) {
                return true;
            }
            break;
        case 6:
            if (this._character._realX >= x) {
                return true;
            }
            break;
        case 2:
            if (this._character._realY >= y) {
                return true;
            }
            break;
        case 4:
            if (this._character._realX + this._character.width() <= x + 1) {
                return true;
            }
            break;
        }
        return false;
    }

    checkPlayer(x, y, d) {
        const collisionResults = [];
        if (!$gamePlayer.isThrough()) {
            const result = this.checkCharacter(x, y, d, $gamePlayer);
            if (result) collisionResults.push(result);
        }
        return collisionResults;
    }

    checkFollowers(x, y, d) {
        const collisionResults = [];
        for (const follower of $gamePlayer._followers.data()) {
            if (!follower.isThrough()) {
                const result = this.checkCharacter(x, y, d, follower);
                if (result) collisionResults.push(result);
            }
        }
        return collisionResults;
    }

    checkEvents(x, y, d, notCollisionEventIds = []) {
        const collisionResults = [];
        for (const event of DotMoveUtils.enteringMassesEvents(x, y, this._character.width(), this._character.height())) {
            if (event.isNormalPriority() && !event.isThrough() && !notCollisionEventIds.includes(event.eventId())) {
                const result = this.checkCharacter(x, y, d, event);
                if (result) collisionResults.push(result);
            }
        }
        return collisionResults;
    }

    checkOtherEvents(x, y, d) {
        return this.checkEvents(x, y, d, []);
    }

    checkVehicles(x, y, d) {
        const collisionResults = [];
        const boat = $gameMap.boat();
        const ship = $gameMap.ship();
        if (boat._mapId === $gameMap.mapId() && !$gamePlayer.isInBoat() && !boat.isThrough()) {
            const result = this.checkCharacter(x, y, d, boat);
            if (result) collisionResults.push(result);
        }
        if (ship._mapId === $gameMap.mapId() && !$gamePlayer.isInShip() && !ship.isThrough()) {
            const result = this.checkCharacter(x, y, d, ship);
            if (result) collisionResults.push(result);
        }
        return collisionResults;
    }

    checkCharacter(x, y, d, character) {
        // Over pass考慮
        if (this._character.isHigherPriority() !== character.isHigherPriority()) return null;

        let cx = this.isCharacterRealPosMode() ? character._realX : character._x;
        let cy = this.isCharacterRealPosMode() ? character._realY : character._y;
        if ($gameMap.isLoopHorizontal() || $gameMap.isLoopVertical()) {
            if ($gameMap.isLoopHorizontal()) {
                if (cx < this._character.width() && x >= $gameMap.width() - this._character.width()) {
                    cx = $gameMap.width() - cx;
                } else if (cx >= $gameMap.width() - character.width() && x < character.width()) {
                    cx = cx - $gameMap.width();
                }
            }
            if ($gameMap.isLoopVertical()) {
                if (cy < this._character.height() && y >= $gameMap.height() - this._character.height()) {
                    cy = $gameMap.height() - cy;
                } else if (cy >= $gameMap.height() - character.height() && y < character.height()) {
                    cy = cy - $gameMap.height();
                }
            }
        }

        const targetRect = { x: x, y: y, width: this._character.width(), height: this._character.height() };
        const characterRect = { x: cx, y: cy, width: character.width(), height: character.height() };
        if (this.isCollidedRect(targetRect, d, characterRect)) {
            return new CollisionResult(targetRect, characterRect);
        }
        return null;
    }

    isCollidedRect(targetRect, d, collisionRect) {
        let x = targetRect.x;
        let y = targetRect.y;
        let w = targetRect.width;
        let h = targetRect.height;
        switch (d) {
        case 8:
            h /= 2;
            break;
        case 6:
            x += w / 2;
            w /= 2;
            break;
        case 2:
            y += h / 2;
            h /= 2;
            break;
        case 4:
            w /= 2;
            break;
        }
        const targetRect2 = { x: x, y: y, width: w, height: h };
        return DotMoveUtils.isCollidedRect(targetRect2, collisionRect);
    }
}


class PlayerCollisionChecker extends CharacterCollisionChecker {
    checkCollisionCharacters(x, y, d) {
        let collisionResults = [];
        collisionResults = collisionResults.concat(this.checkOtherEvents(x, y, d));
        collisionResults = collisionResults.concat(this.checkVehicles(x, y, d));
        return collisionResults;
    }
}


class EventCollisionChecker extends CharacterCollisionChecker {
    initialize(character) {
        super.initialize(character);
        // マップイベントのキャッシュ更新用に移動前の座標と変更前のサイズを保持する
        this._lastRealX = character._realX;
        this._lastRealY = character._realY;
        this._lastWidth = 1;
        this._lastHeight = 1;
    }

    checkCollisionCharacters(x, y, d) {
        let collisionResults = [];
        collisionResults = collisionResults.concat(this.checkPlayer(x, y, d));
        if ($gamePlayer._followers.isVisible()) collisionResults = collisionResults.concat(this.checkFollowers(x, y, d));
        collisionResults = collisionResults.concat(this.checkOtherEvents(x, y, d));
        collisionResults = collisionResults.concat(this.checkVehicles(x, y, d));
        return collisionResults;
    }

    checkPlayer(x, y, d) {
        if (!this._character.isNormalPriority()) return [];
        return super.checkPlayer(x, y, d);
    }

    checkOtherEvents(x, y, d) {
        const notCollisionEventIds = [this._character.eventId()];
        return this.checkEvents(x, y, d, notCollisionEventIds);
    }

    initMapEventCache() {
        const x = this._character._realX;
        const y = this._character._realY;
        const width = this._character.width();
        const height = this._character.height();
        const masses = DotMoveUtils.mapEventCacheMasses(x, y, width, height);
        for (const mass of masses) {
            $gameTemp.addMapEventCache(mass, this._character);
        }
    }

    updateMapEventCache() {
        const realX = this._character._realX;
        const realY = this._character._realY;
        const width = this._character.width();
        const height = this._character.height();
        if (this._lastRealX !== realX || this._lastRealY !== realY || this._lastWidth !== width || this._lastHeight !== height) {
            const beforeMasses = DotMoveUtils.mapEventCacheMasses(this._lastRealX, this._lastRealY, this._lastWidth, this._lastHeight);
            const afterMasses = DotMoveUtils.mapEventCacheMasses(realX, realY, width, height);
            for (const afterMass of afterMasses) {
                if (!beforeMasses.includes(afterMass)) {
                    $gameTemp.addMapEventCache(afterMass, this._character);
                }
            }
            for (const beforeMass of beforeMasses) {
                if (!afterMasses.includes(beforeMass)) {
                    $gameTemp.removeMapEventCache(beforeMass, this._character);
                }
            }
            this._lastRealX = realX;
            this._lastRealY = realY;
            this._lastWidth = width;
            this._lastHeight = height;
        }
    }
}


class FollowerCollisionChecker extends CharacterCollisionChecker {
    checkCollisionCharacters(x, y, d) {
        let collisionResults = [];
        collisionResults = collisionResults.concat(this.checkOtherEvents(x, y, d));
        collisionResults = collisionResults.concat(this.checkVehicles(x, y, d));
        return collisionResults;
    }

    // フォロワーの移動を滑らかにするために衝突判定の座標を調整する
    // 本来は迂回処理で対応したいが、迂回処理は入れると重くなるため使用しない
    checkCollision(x, y, d) {
        const margin = this._character.distancePerFrame() / 4;
        const correctedPoint = this.correctMarginPoint({ x: x, y: y }, margin);
        return super.checkCollision(correctedPoint.x, correctedPoint.y, d);
    }

    correctMarginPoint(point, margin) {
        const correctedPoint = { x: point.x, y: point.y };
        const xFloat = point.x - Math.floor(point.x);
        if (xFloat <= margin) {
            correctedPoint.x = Math.floor(point.x);
        } else if ((1 - xFloat) <= margin) {
            correctedPoint.x = Math.ceil(point.x);
        }
        const yFloat = point.y - Math.floor(point.y);
        if (yFloat <= margin) {
            correctedPoint.y = Math.floor(point.y);
        } else if ((1 - yFloat) <= margin) {
            correctedPoint.y = Math.ceil(point.y);
        }
        return correctedPoint;
    }
}


// 衝突判定を元にキャラクターの座標を更新する。
// 座標以外の状態は変更しない。
class CharacterController {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize(character, collisionChecker) {
        this._character = character;
        this._collisionChecker = collisionChecker;
    }

    dotMoveByDirection(direction) {
        if (direction === 0) return false;
        return this.dotMoveByDeg(DotMoveUtils.direction2deg(direction));
    }

    dotMoveByDeg(deg) {
        const direction = DotMoveUtils.deg2direction(deg);
        const distance = this.calcDistance(deg);
        return this.dotMoveByDistance(direction, distance);
    }

    dotMoveByDistance(direction, distance) {
        let movedPoint = null;
        switch (direction) {
        case 8:
            movedPoint = this.calcUp(distance);
            break;
        case 9:
            movedPoint = this.calcUpRight(distance);
            break;
        case 6:
            movedPoint = this.calcRight(distance);
            break;
        case 3:
            movedPoint = this.calcRightDown(distance);
            break;
        case 2:
            movedPoint = this.calcDown(distance);
            break;
        case 1:
            movedPoint = this.calcDownLeft(distance);
            break;
        case 4:
            movedPoint = this.calcLeft(distance);
            break;
        case 7:
            movedPoint = this.calcLeftUp(distance);
            break;
        }
        const realPoint = { x: this._character._realX, y: this._character._realY };
        const margin = this._character.distancePerFrame() / 256;
        let moved = true;
        if (this.reachPoint(realPoint, movedPoint, margin)) moved = false;
        movedPoint.x = $gameMap.roundX(movedPoint.x);
        movedPoint.y = $gameMap.roundY(movedPoint.y);
        this._character.setPositionAndRoundIntXy(movedPoint.x, movedPoint.y);
        return moved;
    }

    checkCharacter(x, y, direction, character) {
        return this._collisionChecker.checkCharacter(x, y, direction, character);
    }

    checkCharacterStepDir(x, y, direction, character) {
        const deg = DotMoveUtils.direction2deg(direction);
        const dis = this.calcDistance(deg);
        const x2 = x + dis.x;
        const y2 = y + dis.y;
        return this.checkCharacter(x2, y2, direction, character);
    }

    checkOtherEvents(x, y, d, isCharacterRealPos = true) {
        this._collisionChecker.setCharacterRealPosMode(isCharacterRealPos);
        const collisionResults = this._collisionChecker.checkOtherEvents(x, y, d);
        this._collisionChecker.setCharacterRealPosMode(true);
        return collisionResults;
    }

    checkVehicles(x, y, d, isCharacterRealPos = true) {
        this._collisionChecker.setCharacterRealPosMode(isCharacterRealPos);
        const collisionResults = this._collisionChecker.checkVehicles(x, y, d);
        this._collisionChecker.setCharacterRealPosMode(true);
        return collisionResults;
    }

    checkPlayer(x, y, d, isCharacterRealPos = true) {
        this._collisionChecker.setCharacterRealPosMode(isCharacterRealPos);
        const collisionResults = this._collisionChecker.checkPlayer(x, y, d);
        this._collisionChecker.setCharacterRealPosMode(true);
        return collisionResults;
    }

    calcUp(dis) {
        const target = this._character.collisionRect();
        if (dis.x < 0) {
            dis = this.correctLeftDistance(target, dis);
        } else if (dis.x > 0) {
            dis = this.correctRightDistance(target, dis);
        }
        const collisionResults = this.checkCollision(target.x + dis.x, target.y + dis.y, 8);
        dis = this.correctUpDistance(target, dis);
        target.y += dis.y;
        dis = this.slideDistance(dis, target, collisionResults, 315, 45, "x");
        target.x += dis.x;
        return { x: target.x, y: target.y };
    }

    calcRight(dis) {
        const target = this._character.collisionRect();
        if (dis.y < 0) {
            dis = this.correctUpDistance(target, dis);
        } else if (dis.y > 0) {
            dis = this.correctDownDistance(target, dis);
        }
        const collisionResults = this.checkCollision(target.x + dis.x, target.y + dis.y, 6);
        dis = this.correctRightDistance(target, dis);
        target.x += dis.x;
        dis = this.slideDistance(dis, target, collisionResults, 45, 135, "y");
        target.y += dis.y;
        return { x: target.x, y: target.y };
    }

    calcDown(dis) {
        const target = this._character.collisionRect();
        if (dis.x < 0) {
            dis = this.correctLeftDistance(target, dis);
        } else if (dis.x > 0) {
            dis = this.correctRightDistance(target, dis);
        }
        const collisionResults = this.checkCollision(target.x + dis.x, target.y + dis.y, 2);
        dis = this.correctDownDistance(target, dis);
        target.y += dis.y;
        dis = this.slideDistance(dis, target, collisionResults, 225, 135, "x");
        target.x += dis.x;
        return { x: target.x, y: target.y };
    }

    calcLeft(dis) {
        const target = this._character.collisionRect();
        if (dis.y < 0) {
            dis = this.correctUpDistance(target, dis);
        } else if (dis.y > 0) {
            dis = this.correctDownDistance(target, dis);
        }
        const collisionResults = this.checkCollision(target.x + dis.x, target.y + dis.y, 4);
        dis = this.correctLeftDistance(target, dis);
        target.x += dis.x;
        dis = this.slideDistance(dis, target, collisionResults, 315, 225, "y");
        target.y += dis.y;
        return { x: target.x, y: target.y };
    }

    calcUpRight(dis) {
        if (this._character.direction() === 8) {
            if (this._character.height() === 1) return this.calcUp(dis);
        } else if (this._character.direction() === 6) {
            if (this._character.width() === 1) return this.calcRight(dis);
        }
        const target = this._character.collisionRect();
        dis = this.correctUpDistance(target, dis);
        target.y += dis.y;
        dis = this.correctRightDistance(target, dis);
        target.x += dis.x;
        return { x: target.x, y: target.y };
    }

    calcRightDown(dis) {
        if (this._character.direction() === 6) {
            if (this._character.width() === 1) return this.calcRight(dis);
        } else if (this._character.direction() === 2) {
            if (this._character.height() === 1) return this.calcDown(dis);
        }
        const target = this._character.collisionRect();
        dis = this.correctRightDistance(target, dis);
        target.x += dis.x;
        dis = this.correctDownDistance(target, dis);
        target.y += dis.y;
        return { x: target.x, y: target.y };
    }

    calcDownLeft(dis) {
        if (this._character.direction() === 2) {
            if (this._character.height() === 1) return this.calcDown(dis);
        } else if (this._character.direction() === 4) {
            if (this._character.width() === 1) return this.calcLeft(dis);
        }
        const target = this._character.collisionRect();
        dis = this.correctDownDistance(target, dis);
        target.y += dis.y;
        dis = this.correctLeftDistance(target, dis);
        target.x += dis.x;
        return { x: target.x, y: target.y };
    }

    calcLeftUp(dis) {
        if (this._character.direction() === 4) {
            if (this._character.width() === 1) return this.calcLeft(dis);
        } else if (this._character.direction() === 8) {
            if (this._character.height() === 1) return this.calcUp(dis);
        }
        const target = this._character.collisionRect();
        dis = this.correctLeftDistance(target, dis);
        target.x += dis.x;
        dis = this.correctUpDistance(target, dis);
        target.y += dis.y;
        return { x: target.x, y: target.y };
    }

    correctUpDistance(target, distance) {
        return this.correctDistance(target, distance, 8);
    }

    correctRightDistance(target, distance) {
        return this.correctDistance(target, distance, 6);
    }

    correctDownDistance(target, distance) {
        return this.correctDistance(target, distance, 2);
    }

    correctLeftDistance(target, distance) {
        return this.correctDistance(target, distance, 4);
    }

    // 衝突判定を行い、衝突矩形から衝突した長さを取得してその分だけ距離を戻す
    // 衝突矩形が複数ある場合は最も衝突距離が長い分だけ距離を戻す
    correctDistance(target, distance, dir) {
        const axis = dir === 8 || dir === 2 ? "y" : "x";
        const correctedDistance = { x: distance.x, y: distance.y };
        if (distance[axis] === 0) return correctedDistance;
        let nextX = target.x;
        let nextY = target.y;
        if (axis === "x") {
            nextX += distance.x;
        } else {
            nextY += distance.y;
        }
        const collisionResults = this.checkCollision(nextX, nextY, dir);
        if (collisionResults.length === 0) return correctedDistance;
        const len = this.getMaxCollisionLength(collisionResults, axis);
        // 衝突距離が移動距離より長い場合、移動距離分だけ移動させる
        if (len <= Math.abs(distance[axis])) {
            const sign = dir === 8 || dir === 4 ? 1 : -1;
            correctedDistance[axis] += len * sign;
        } else {
            correctedDistance[axis] -= distance[axis];
        }
        return correctedDistance;
    }

    getMaxCollisionLength(collisionResults, axis) {
        const lens = collisionResults.map(result => {
            const len = result.getCollisionLength(axis);
            // 移動した距離が極小であった場合、自分の位置とは異なる場所の衝突矩形を取得する場合がある
            // この場合は衝突の長さが大きな値となるため、閾値(0.75)を超える場合は長さ取得の対象外とする
            return len > 0.75 ? 0 : len;
        });
        return Math.max(...lens);
    }

    // 衝突距離がキャラの移動距離以上であれば移動距離分スライドを行う
    // 衝突距離がキャラの移動距離未満であれば衝突距離分スライドを行う
    slideDistance(dis, target, collisionResults, deg1, deg2, axis) {
        const newDis = { x: dis.x, y: dis.y };
        if (this.canSlide(collisionResults)) {
            const len = collisionResults[0].getCollisionLength(axis);
            const diagDis = target[axis] < collisionResults[0].collisionRect[axis] ? this.calcDistance(deg1) : this.calcDistance(deg2);
            if (len < Math.abs(diagDis[axis])) {
                newDis[axis] = diagDis[axis] < 0 ? -len : len;
            } else if (len <= this.getSlideLength(axis)) {
                newDis[axis] = diagDis[axis];
            } else {
                return newDis;
            }
            let dir;
            if (axis === "x") {
                dir = diagDis[axis] < 0 ? 4 : 6;
            } else {
                dir = diagDis[axis] < 0 ? 8 : 2;
            }
            return this.correctDistance(target, newDis, dir);
        }
        return newDis;
    }

    // 衝突矩形が1つだけ、または全ての衝突矩形の座標が同じである場合、キャラをスライドさせる
    canSlide(collisionResults) {
        if (collisionResults.length === 0) {
            return false;
        } else if (collisionResults.length === 1) {
            return true;
        } else {
            const collisionRectX = collisionResults[0].collisionRect.x;
            const collisionRectY = collisionResults[0].collisionRect.y;
            return collisionResults.every(result => {
                return result.collisionRect.x === collisionRectX && result.collisionRect.y === collisionRectY;
            });
        }
    }

    calcDistance(deg) {
        return DotMoveUtils.calcDistance(deg, this._character.distancePerFrame());
    }

    checkCollision(x, y, dir) {
        return this._collisionChecker.checkCollision(x, y, dir);
    }

    slideLengthX() {
        return this._character.minTouchWidth();
    }

    slideLengthY() {
        return this._character.minTouchHeight();
    }

    getSlideLength(axis) {
        if (axis === "x") {
            return this.slideLengthX();
        } else {
            return this.slideLengthY();
        }
    }

    reachPoint(realPoint, targetPoint, margin) {
        if (Math.abs(realPoint.x - targetPoint.x) <= margin &&
            Math.abs(realPoint.y - targetPoint.y) <= margin) {
                return true;
        }
        return false;
    }
}


class PlayerController extends CharacterController {
    initialize(character) {
        super.initialize(character, new PlayerCollisionChecker(character));
    }
}


class EventController extends CharacterController {
    initialize(character) {
        super.initialize(character, new EventCollisionChecker(character));
    }

    initMapEventCache() {
        this._collisionChecker.initMapEventCache();
    }

    updateMapEventCache() {
        this._collisionChecker.updateMapEventCache();
    }
}


class FollowerController extends CharacterController {
    initialize(character) {
        super.initialize(character, new FollowerCollisionChecker(character));
    }

    slideLengthX() {
        const len = super.slideLengthX();
        return len + len / 2;
    }

    slideLengthY() {
        const len = super.slideLengthY();
        return len + len / 2;
    }
}


// CharacterControllerを用いてキャラクターの座標を更新し、
// それに合わせてキャラクターの各種状態を更新する。
class CharacterMover {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize(character) {
        this._character = character;
        this._controller = new CharacterController(character, new CharacterCollisionChecker(character));
        this._moverData = character.moverData();
        this._width = 1;
        this._height = 1;
        this._offsetX = 0;
        this._offsetY = 0;
    }

    update() {
        this.clearMovedFlagFromCharacterMoverUpdate();
        if (this._moverData.targetCount > 0) {
            this.moveProcess();
        }
        if (this._moverData.targetCount === 0) {
            this._moverData.moving = false;
            this._moverData.moveDeg = null;
            this._moverData.moveDir = null;
            if (this._moverData.setThroughReserve != null) {
                this._character._through = this._moverData.setThroughReserve;
                this._moverData.setThroughReserve = null;
            }
            if (this._moverData.setMoveSpeedReserve != null) {
                this._character._moveSpeed = this._moverData.setMoveSpeedReserve;
                this._moverData.setMoveSpeedReserve = null;
            }
            this._character.refreshBushDepth();
        }
    }

    width() {
        return this._width;
    }

    height() {
        return this._height;
    }

    offsetX() {
        return this._offsetX;
    }

    offsetY() {
        return this._offsetY;
    }

    checkCharacter(x, y, direction, character) {
        return this._controller.checkCharacter(x, y, direction, character);
    }

    checkCharacterStepDir(x, y, direction, character) {
        return this._controller.checkCharacterStepDir(x, y, direction, character);
    }

    isCollidedWithEvents(x, y) {
        const margin = 0.5;
        const collisionResults = this._controller.checkOtherEvents(x, y, this._character.direction(), false);
        if (collisionResults.length > 0) {
            if (collisionResults.length > 1) return true;
            if (collisionResults[0].collisionLengthX() >= margin || collisionResults[0].collisionLengthY() >= margin) return true;
        }
        return false;
    }

    isCollidedWithVehicles(x, y) {
        const margin = 0.5;
        const collisionResults = this._controller.checkVehicles(x, y, this._character.direction(), false);
        if (collisionResults.length > 0) {
            if (collisionResults.length > 1) return true;
            if (collisionResults[0].collisionLengthX() >= margin || collisionResults[0].collisionLengthY() >= margin) return true;
        }
        return false;
    }

    // Game_Player#updateでCharacterMover#updateがGame_Player#moveByInputの後にコールされるため移動済みフラグのクリアをメソッド化する
    clearMovedFlagFromCharacterMoverUpdate() {
        this.clearMovedFlag();
    }

    clearMovedFlag() {
        this._moverData.moved = false;
    }

    // 移動が行われた場合、ここで毎フレーム移動処理を行う
    moveProcess() {
        let moved;
        if (this._moverData.targetCount === 0) return;
        if (this._moverData.moveDeg != null) {
            moved = this._controller.dotMoveByDeg(this._moverData.moveDeg);
        } else {
            moved = this._controller.dotMoveByDirection(this._moverData.moveDir);
        }
        if (moved) {
            this._moverData.moved = true;
            this._moverData.moving = true;
            this._character.setMovementSuccess(true);
            this._character.incrementTotalDpf();
            if (this._moverData.targetCount > 0) this._moverData.targetCount--;
        } else {
            this._character.setMovementSuccess(false);
            this._moverData.moving = false;
            this._moverData.targetCount = 0;
        }
        this._character.checkEventTriggerTouchFront(this._character.direction());
    }

    startMassMove(fromPoint, targetPoint) {
        const far = DotMoveUtils.calcFar(fromPoint, targetPoint);
        this._moverData.targetCount = Math.round(far / this._character.distancePerFrame());
        this.moveProcess();
    }

    dotMoveByDirection(direction) {
        this.setDirection(direction);
        this._moverData.targetCount = 1;
        this._moverData.moveDir = direction;
        this.moveProcess();
    }

    dotMoveByDeg(deg) {
        this.setDirection(DotMoveUtils.deg2direction4(deg, this._character.direction()));
        this._moverData.targetCount = 1;
        this._moverData.moveDeg = deg;
        this.moveProcess();
    }

    // はしご考慮
    setDirection(d) {
        if (this._character.isOnLadder()) {
            this._character.setDirection(8);
        } else {
            this._character.setDirection(d);
        }
    }

    isMoving() {
        return this._moverData.moving;
    }

    isMoved() {
        return this._moverData.moved;
    }

    moveByDirection(d, moveUnit) {
        if (d % 2 === 0) {
            return this.moveStraight(d, moveUnit);
        } else if (d === 1 || d === 3 || d === 7 || d === 9) {
            const [horz, vert] = DotMoveUtils.direction2HorzAndVert(d);
            this.moveDiagonally(horz, vert, moveUnit);
        }
    }

    moveStraight(d, moveUnit) {
        const fromPoint =  { x: this._character._realX, y: this._character._realY };
        const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, d, moveUnit);
        this._moverData.moveDir = d;
        this.setDirection(d);
        this.startMassMove(fromPoint, targetPoint);
    }

    moveDiagonally(horz, vert, moveUnit) {
        if (this._character._direction === this._character.reverseDir(horz)) {
            this.setDirection(horz);
        }
        if (this._character._direction === this._character.reverseDir(vert)) {
            this.setDirection(vert);
        }
        if (vert === 8 && horz === 6) {
            this._moverData.moveDir = 9;
        } else if (vert === 2 && horz === 6) {
            this._moverData.moveDir = 3;
        } else if (vert === 2 && horz === 4) {
            this._moverData.moveDir = 1;
        } else if (vert === 8 && horz === 4) {
            this._moverData.moveDir = 7;
        }
        const fromPoint =  { x: this._character._realX, y: this._character._realY };
        const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, this._moverData.moveDir, moveUnit);
        this.startMassMove(fromPoint, targetPoint);
    }

    moveToTarget(targetPoint) {
        const fromPoint = { x: this._character._realX, y: this._character._realY };
        const deg = DotMoveUtils.calcDeg(fromPoint, targetPoint);
        this._moverData.moveDeg = deg;
        const dir = DotMoveUtils.deg2direction4(deg);
        this.setDirection(dir);
        this.startMassMove(fromPoint, targetPoint);
    }

    // 移動が完了してからスルー状態を設定する
    setThrough(through) {
        if (!this.isMoving()) {
            this._character._through = through;
        } else {
            this._moverData.setThroughReserve = through;
        }
    }

    // 移動が完了してから移動速度の変更を反映する
    setMoveSpeed(moveSpeed) {
        if (!this.isMoving()) {
            this._character._moveSpeed = moveSpeed;
        } else {
            this._moverData.setMoveSpeedReserve = moveSpeed;
        }
    };
}


class PlayerMover extends CharacterMover {
    initialize(character) {
        super.initialize(character);
        this._controller = new PlayerController(character);
    }

    // CharacterMover#updateで移動済みフラグがクリアされないようにする
    clearMovedFlagFromCharacterMoverUpdate() {
    }
}


class EventMover extends CharacterMover {
    initialize(character) {
        super.initialize(character);
        this._controller = new EventController(character);
        this._width = null;
        this._height = null;
        this._offsetX = null;
        this._offsetY = null;
        this._widthArea = null;
        this._heightArea = null;
    }

    width() {
        if (this._width == null) {
            this._width = EventParamParser.getWidth(this._character);
        }
        return super.width();
    }

    height() {
        if (this._height == null) {
            this._height = EventParamParser.getHeight(this._character);
        }
        return super.height();
    }

    offsetX() {
        if (this._offsetX == null) {
            this._offsetX = EventParamParser.getOffsetX(this._character);
        }
        return super.offsetX();
    }

    offsetY() {
        if (this._offsetY == null) {
            this._offsetY = EventParamParser.getOffsetY(this._character);
        }
        return super.offsetY();
    }

    widthArea() {
        if (this._widthArea == null) {
            this._widthArea = EventParamParser.getWidthArea(this._character);
        }
        return this._widthArea;
    }

    heightArea() {
        if (this._heightArea == null) {
            this._heightArea = EventParamParser.getHeightArea(this._character);
        }
        return this._heightArea;
    }

    update() {
        super.update();
        this._controller.updateMapEventCache();
    }

    initMapEventCache() {
        this._controller.initMapEventCache();
    }

    isCollidedWithPlayerCharacters(x, y) {
        const margin = 0.5;
        const collisionResults = this._controller.checkPlayer(x, y, this._character.direction(), false);
        if (collisionResults.length > 0) {
            if (collisionResults[0].collisionLengthX() >= margin || collisionResults[0].collisionLengthY() >= margin) return true;
        }
        return false;
    }
}


class FollowerMover extends CharacterMover {
    initialize(character) {
        super.initialize(character);
        this._controller = new FollowerController(character);
    }
}


const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this._totalDpf = 0; // 歩数計算のために使用
    this._moveUnit = 1; // 移動単位
    this.initMoverData();
};

// CharacterMoverのデータのうちセーブデータに保持する必要のあるものを持たせる
Game_CharacterBase.prototype.initMoverData = function() {
    this._moverData = {};
    this._moverData.moved = false;
    this._moverData.targetCount = 0;
    this._moverData.moving = false;
    this._moverData.setThroughReserve = null;
    this._moverData.setMoveSpeedReserve = null;
    this._moverData.moveDeg = null;
    this._moverData.moveDir = null;
};

Game_CharacterBase.prototype.makeMover = function() {
    return new CharacterMover(this);
};

Game_CharacterBase.prototype.mover = function() {
    return $gameTemp.mover(this);
};

Game_CharacterBase.prototype.moverData = function() {
    if (this._moverData  == null) this.initMoverData();
    return this._moverData;
};

const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
    _Game_CharacterBase_update.call(this);
    this.mover().update();
};

// 座標の補正は行わない
Game_CharacterBase.prototype.updateMove = function() {
};

Game_CharacterBase.prototype.isMoving = function() {
    return this.mover().isMoving();
};

Game_CharacterBase.prototype.isMoved = function() {
    return this.mover().isMoved();
};

Game_CharacterBase.prototype.moveUnit = function() {
    return this._moveUnit;
};

Game_CharacterBase.prototype.setMoveUnit = function(moveUnit) {
    this._moveUnit = moveUnit;
};

Game_CharacterBase.prototype.incrementTotalDpf = function() {
    this._totalDpf += this.distancePerFrame();
    if (this._totalDpf >= 1) {
        this.increaseSteps();
        this._totalDpf = 0;
    }
};

Game_CharacterBase.prototype.moveStraight = function(d) {
    this.mover().moveStraight(d, this._moveUnit);
};

Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
    this.mover().moveDiagonally(horz, vert, this._moveUnit);
};

Game_CharacterBase.prototype.setDirection = function(d) {
    if (!this.isDirectionFixed() && d) {
        this._direction = DotMoveUtils.deg2direction4(DotMoveUtils.direction2deg(d), this._direction);
    }
    this.resetStopCount();
};

Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
    const d2 = this.reverseDir(d);
    const nextPoint = DotMoveUtils.nextPointWithDirection({ x, y }, d);
    return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(nextPoint.x, nextPoint.y, d2);
};

Game_CharacterBase.prototype.setPositionAndRoundIntXy = function(x, y) {
    this.setPosition(x, y);
    // ループマップでsetPositionを行うと整数座標が範囲外の値になる場合があるため、それを防ぐ
    if ($gameMap.isLoopHorizontal()) this._x %= $gameMap.width();
    if ($gameMap.isLoopVertical()) this._y %= $gameMap.height();
};

const _Game_CharacterBase_jump = Game_CharacterBase.prototype.jump;
Game_CharacterBase.prototype.jump = function(xPlus, yPlus) {
    // ループマップで加算後の整数座標がループ実施前の値になるようにする
    this.setPosition(this._realX, this._realY);
    _Game_CharacterBase_jump.call(this, xPlus, yPlus);
};

Game_CharacterBase.prototype.setThrough = function(through) {
    this.mover().setThrough(through);
};

Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed) {
    this.mover().setMoveSpeed(moveSpeed);
};

Game_CharacterBase.prototype.width = function() {
    return this.mover().width();
};

Game_CharacterBase.prototype.height = function() {
    return this.mover().height();
};

Game_CharacterBase.prototype.offsetX = function() {
    return this.mover().offsetX();
};

Game_CharacterBase.prototype.offsetY = function() {
    return this.mover().offsetY();
};

Game_CharacterBase.prototype.centerRealX = function() {
    return this._realX + this.width() / 2;
};

Game_CharacterBase.prototype.centerRealY = function() {
    return this._realY + this.height() / 2;
};

// タッチ幅(キャラクターとのタッチ判定に必要な幅)を取得する。
// タッチ幅はキャラクターのスライドやイベント起動用の衝突判定に使用する。
Game_CharacterBase.prototype.minTouchWidth = function() {
    const width = this.width();
    return width >= 1 ? 0.5 : width / 2;
};

Game_CharacterBase.prototype.minTouchHeight = function() {
    const height = this.height();
    return height >= 1 ? 0.5 : height / 2;
};

// スクロール座標にオフセットを反映させる
Game_CharacterBase.prototype.scrolledX = function() {
    return $gameMap.adjustX(this._realX + this.offsetX());
};

Game_CharacterBase.prototype.scrolledY = function() {
    return $gameMap.adjustY(this._realY + this.offsetY());
};

Game_CharacterBase.prototype.collisionRect = function() {
    return { x: this._realX, y: this._realY, width: this.width(), height: this.height() };
};

// OverpassTile.jsで再定義される
Game_CharacterBase.prototype.isHigherPriority = function() {
    return undefined;
};

Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
    const x2 = $gameMap.roundXWithDirection(x, horz);
    const y2 = $gameMap.roundYWithDirection(y, vert);
    if (this.canPass(x, y, vert) && this.canPass(x, y2, horz)) {
        if (this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
            return true;
        }
    }
    return false;
};

Game_CharacterBase.prototype.isCollidedWithEvents = function(x, y) {
    return this.mover().isCollidedWithEvents(x, y);
};

Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y) {
    return this.mover().isCollidedWithVehicles(x, y);
};

Game_CharacterBase.prototype.calcDeg = function(targetCharacter) {
    const fromPoint = { x: this.centerRealX(), y: this.centerRealY() };
    const targetPoint = { x: targetCharacter.centerRealX(), y: targetCharacter.centerRealY() };
    return DotMoveUtils.calcDeg(fromPoint, targetPoint);
};

Game_CharacterBase.prototype.calcFar = function(targetCharacter) {
    const fromPoint = { x: this.centerRealX(), y: this.centerRealY() };
    const targetPoint = { x: targetCharacter.centerRealX(), y: targetCharacter.centerRealY() };
    return DotMoveUtils.calcFar(fromPoint, targetPoint);
};


// 8方向A*経路探索を行い最適ノードと初期ノードを返す
Game_Character.prototype.computeRoute = function(goalX, goalY, searchLimit = this.searchLimit()) {
    const mapWidth = $gameMap.width();
    const nodeList = [];
    const openList = [];
    const closedList = [];
    const start = {};
    let best = start;

    if (this.x === goalX && this.y === goalY) {
        return [null, null];
    }

    start.parent = null;
    start.x = this.x;
    start.y = this.y;
    start.g = 0;
    start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
    nodeList.push(start);
    openList.push(start.y * mapWidth + start.x);

    while (nodeList.length > 0) {
        let bestIndex = 0;
        for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i].f < nodeList[bestIndex].f) {
                bestIndex = i;
            }
        }

        const current = nodeList[bestIndex];
        const x1 = current.x;
        const y1 = current.y;
        const pos1 = y1 * mapWidth + x1;
        const g1 = current.g;

        nodeList.splice(bestIndex, 1);
        openList.splice(openList.indexOf(pos1), 1);
        closedList.push(pos1);

        if (current.x === goalX && current.y === goalY) {
            best = current;
            break;
        }

        if (g1 >= searchLimit) {
            continue;
        }

        for (let direction = 1; direction <= 9; direction++) {
            if (direction === 5) continue;
            const [horz, vert] = DotMoveUtils.direction2HorzAndVert(direction);
            const x2 = $gameMap.roundXWithDirection(x1, horz);
            const y2 = $gameMap.roundYWithDirection(y1, vert);
            const pos2 = y2 * mapWidth + x2;

            if (closedList.includes(pos2)) {
                continue;
            }
            if (direction % 2 === 0) {
                if (!this.canPass(x1, y1, direction)) {
                    continue;
                }
            } else {
                if (!this.canPassDiagonally(x1, y1, horz, vert)) {
                    continue;
                }
            }

            const g2 = g1 + (direction % 2 === 0 ? 1 : DIALOG_COST);
            const index2 = openList.indexOf(pos2);

            if (index2 < 0 || g2 < nodeList[index2].g) {
                let neighbor = {};
                if (index2 >= 0) {
                    neighbor = nodeList[index2];
                } else {
                    nodeList.push(neighbor);
                    openList.push(pos2);
                }
                neighbor.parent = current;
                neighbor.x = x2;
                neighbor.y = y2;
                neighbor.g = g2;
                neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                    best = neighbor;
                }
            }
        }
    }

    return [best, start];
};

Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
    const [best, start] = this.computeRoute(goalX, goalY);
    if (!best) return 0;

    let node = best;
    while (node.parent && node.parent !== start) {
        node = node.parent;
    }
    const deltaX1 = $gameMap.deltaX(node.x, start.x);
    const deltaY1 = $gameMap.deltaY(node.y, start.y);
    if (deltaX1 === 0 && deltaY1 < 0) {
        return 8;
    } else if (deltaX1 > 0 && deltaY1 < 0) {
        return 9;
    } else if (deltaX1 > 0 && deltaY1 === 0) {
        return 6;
    } else if (deltaX1 > 0 && deltaY1 > 0) {
        return 3;
    } else if (deltaX1 === 0 && deltaY1 > 0) {
        return 2;
    } else if (deltaX1 < 0 && deltaY1 > 0) {
        return 1;
    } else if (deltaX1 < 0 && deltaY1 === 0) {
        return 4;
    } else if (deltaX1 < 0 && deltaY1 < 0) {
        return 7;
    }

    const deltaX2 = this.deltaXFrom(goalX);
    const deltaY2 = this.deltaYFrom(goalY);
    if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
        if (deltaX2 > 0 && deltaY2 < 0) {
            return 3;
        } else if (deltaX2 > 0 && deltaY2 === 0) {
            return 4;
        } else if (deltaX2 > 0 && deltaY2 > 0) {
            return 7;
        } else if (deltaX2 < 0 && deltaY2 > 0) {
            return 9;
        } else if (deltaX2 < 0 && deltaY2 === 0) {
            return 6;
        } else if (deltaX2 < 0 && deltaY2 < 0) {
            return 3;
        }
    } else if (deltaY2 !== 0) {
        if (deltaY2 < 0 && deltaX2 < 0) {
            return 3;
        } else if (deltaY2 < 0 && deltaX2 === 0) {
            return 2;
        } else if (deltaY2 < 0 && deltaX2 > 0) {
            return 1;
        } else if (deltaY2 > 0 && deltaX2 > 0) {
            return 7;
        } else if (deltaY2 > 0 && deltaX2 === 0) {
            return 8;
        } else if (deltaY2 > 0 && deltaX2 < 0) {
            return 9;
        }
    }
    return 0;
};

Game_Character.prototype.updateRoutineMove = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
    } else {
        // 移動中でない場合、ルート更新を行う
        if (!this.isMoving()) {
            this.setMovementSuccess(true);
            const command = this._moveRoute.list[this._moveRouteIndex];
            if (command) {
                this.processMoveCommand(command);
                this.advanceMoveRouteIndex();
            }
        }
    }
};

Game_Character.prototype.moveRandom = function() {
    const d = 2 + Math.randomInt(4) * 2;
    // canPassは行わない
    this.moveStraight(d);
};

Game_Character.prototype.dotMoveByDeg = function(deg) {
    this.mover().dotMoveByDeg(deg);
};

Game_Character.prototype.moveByDirection = function(direction) {
    this.mover().moveByDirection(direction, this._moveUnit);
};

Game_Character.prototype.dotMoveToPlayer = function() {
    const deg = this.calcDeg($gamePlayer);
    this.dotMoveByDeg(deg);
};

Game_Character.prototype.moveToTarget = function(x, y) {
    this.mover().moveToTarget({ x, y });
};

Game_Character.prototype.deltaRealXFrom = function(x) {
    return $gameMap.deltaX(this.centerRealX(), x);
};

Game_Character.prototype.deltaRealYFrom = function(y) {
    return $gameMap.deltaY(this.centerRealY(), y);
};

// 整数座標ではなく実数座標で処理するように変更
Game_Character.prototype.moveTowardCharacter = function(character) {
    const sx = this.deltaRealXFrom(character.centerRealX());
    const sy = this.deltaRealYFrom(character.centerRealY());
    if (Math.abs(sx) > Math.abs(sy)) {
        this.moveStraight(sx > 0 ? 4 : 6);
        if (!this.isMovementSucceeded() && sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
        }
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
        if (!this.isMovementSucceeded() && sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6);
        }
    }
};

Game_Character.prototype.moveAwayFromCharacter = function(character) {
    const sx = this.deltaRealXFrom(character.centerRealX());
    const sy = this.deltaRealYFrom(character.centerRealY());
    if (Math.abs(sx) > Math.abs(sy)) {
        this.moveStraight(sx > 0 ? 6 : 4);
        if (!this.isMovementSucceeded() && sy !== 0) {
            this.moveStraight(sy > 0 ? 2 : 8);
        }
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 2 : 8);
        if (!this.isMovementSucceeded() && sx !== 0) {
            this.moveStraight(sx > 0 ? 6 : 4);
        }
    }
};

Game_Character.prototype.turnTowardCharacter = function(character) {
    if (this.x === character.x && this.y === character.y) return;
    const sx = this.deltaRealXFrom(character.centerRealX());
    const sy = this.deltaRealYFrom(character.centerRealY());
    if (Math.abs(sx) > Math.abs(sy)) {
        this.setDirection(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
        this.setDirection(sy > 0 ? 8 : 2);
    }
};

Game_Character.prototype.turnAwayFromCharacter = function(character) {
    if (this.x === character.x && this.y === character.y) return;
    const sx = this.deltaRealXFrom(character.centerRealX());
    const sy = this.deltaRealYFrom(character.centerRealY());
    if (Math.abs(sx) > Math.abs(sy)) {
        this.setDirection(sx > 0 ? 6 : 4);
    } else if (sy !== 0) {
        this.setDirection(sy > 0 ? 2 : 8);
    }
};


const _Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
    _Game_Player_initMembers.call(this);
    this._needCountProcess = false;
    this._gatherStart = false;
    // 船から陸地に移動しているか否かを管理するフラグ
    this._shipOrBoatTowardingLand = false;
};

Game_Player.prototype.makeMover = function() {
    return new PlayerMover(this);
};

Game_Player.prototype.isMapPassable = function(x, y, d) {
    const vehicle = this.vehicle();
    if (vehicle) {
        return vehicle.isMapPassable(x, y, d);
    } else {
        return Game_Character.prototype.isMapPassable.call(this, x, y, d);
    }
};

Game_Player.prototype.executeMove = function(direction) {
    this.mover().dotMoveByDirection(direction);
};

Game_Player.prototype.getInputDirection = function() {
    return Input.dir8;
};

Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
        let direction = this.getInputDirection();
        if (direction > 0) {
            $gameTemp.clearDestination();
            this.executeMove(direction);
        } else if ($gameTemp.isDestinationValid()) {
            const x = $gameTemp.destinationX();
            const y = $gameTemp.destinationY();
            direction = this.findDirectionTo(x, y);
            if (direction > 0) this.mover().moveByDirection(direction, 1);
        }
    }
};

Game_Player.prototype.forceMoveOnVehicle = function() {
    this._dashing = false;
    this.setMoveSpeed(4);
    this.setThrough(true);
    const point = { x: this.vehicle()._realX, y: this.vehicle()._realY };
    this.mover().moveToTarget(point);
    this.setThrough(false);
};

Game_Player.prototype.forceMoveOffAirship = function() {
    this.setMoveSpeed(4);
    // 乗り物から降りた時にハマらないように整数座標に着陸する
    const targetPoint = { x: this.x, y: this.y };
    // リセットした乗り物の向きにプレイヤーを合わせる
    this.setDirection(this.vehicle().direction());
    // 整数座標への着地中は飛行船とプレイヤーの向きを固定化
    // 固定化OFFはupdateVehicleGetOffで実施する
    this.vehicle().setDirectionFix(true);
    this.setDirectionFix(true);
    this.mover().moveToTarget(targetPoint);
};

Game_Player.prototype.forceMoveOffShipOrBoat = function() {
    this.setMoveSpeed(4);
    this.setThrough(true);
    // 乗り物から降りた時にハマらないように整数座標に着陸する
    const fromPoint = { x: this.x, y: this.y };
    const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, this._direction);
    this.mover().moveToTarget(targetPoint);
    this.setThrough(false);
};

Game_Player.prototype.update = function(sceneActive) {
    this.mover().clearMovedFlag();
    const lastScrolledX = this.scrolledX();
    const lastScrolledY = this.scrolledY();
    this.updateDashing();
    if (sceneActive) {
        this.moveByInput();
    }
    // wasMovingの取得タイミングをmoveByInputの後に変更
    const wasMoving = this.isMoving();
    Game_Character.prototype.update.call(this);
    this.updateScroll(lastScrolledX, lastScrolledY);
    this.updateVehicle();
    if (!this.isMoving()) {
        this.updateNonmoving(wasMoving, sceneActive);
    }
    if (this._needCountProcess) this.updateCountProcess(sceneActive);
    this._followers.update();
    this.updateTouchPoint();
};

Game_Player.prototype.updateTouchPoint = function() {
    const x = $gameTemp.destinationX();
    const y = $gameTemp.destinationY();
    if (x != null && y != null) {
        if (x === this.x && y === this.y) {
            this.moveToTarget(this.x, this.y);
            $gameTemp.clearDestination();
        }
    }
};

const _Game_Player_increaseSteps = Game_Player.prototype.increaseSteps;
Game_Player.prototype.increaseSteps = function() {
    _Game_Player_increaseSteps.call(this);
    // 歩数が増加した場合、歩数増加時の処理をupdateで実行するため、
    // ここでフラグをtrueにしておく
    this._needCountProcess = true;
};

Game_Player.prototype.updateCountProcess = function(sceneActive) {
    if ($gameMap.isEventRunning()) return;
    $gameParty.onPlayerWalk();
    if ($gameMap.setupStartingEvent()) {
        return;
    }
    if (sceneActive && this.triggerAction()) {
        return;
    }
    this.updateEncounterCount();
    this._needCountProcess = false;
};

Game_Player.prototype.updateNonmoving = function(wasMoving, sceneActive) {
    if ($gameMap.isEventRunning()) return;
    if (wasMoving) {
        // 一度起動した足元のイベントをすぐに起動しない
        const disableHereEventRect = $gameMap.disableHereEventRect();
        if (!(disableHereEventRect && DotMoveUtils.isCollidedRect(this.collisionRect(), disableHereEventRect))) {
            $gameMap.setDisableHereEventRect(null);
        }
        this.checkEventTriggerHere([1, 2]);
        if ($gameMap.setupStartingEvent()) {
            return;
        }
    }
    if (sceneActive && this.triggerAction()) {
        return;
    }
    if (!wasMoving) {
        $gameTemp.clearDestination();
    }
};

// 場所移動してすぐの座標にある足元のイベントを起動しないようにする
const _Game_Player_reserveTransfer = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
    $gameMap.setDisableHereEventRect({ x, y, width: 1, height: 1 });
    _Game_Player_reserveTransfer.call(this, mapId, x, y, d, fadeType);
};

Game_Player.prototype.getOnVehicle = function() {
    const vehicleType = this.checkRideVehicles();
    if (vehicleType) {
        this._vehicleType = vehicleType;
        this._vehicleGettingOn = true;
        this.forceMoveOnVehicle();
        $gameMap.setDisableHereEventRect(this.vehicle().collisionRect());
        this.gatherFollowers();
    }
    return this._vehicleGettingOn;
};

Game_Player.prototype.checkRideVehicles = function() {
    const dir = this.direction();
    const airship = $gameMap.airship();
    const ship = $gameMap.ship();
    const boat = $gameMap.boat();
    let airshipResult = null;
    let shipResult = null;
    let boatResult = null;
    if (airship._mapId === $gameMap.mapId() && !airship.isThrough()) {
        airshipResult = this.mover().checkCharacter(this._realX, this._realY, dir, airship);
    }
    if (airshipResult && airshipResult.collisionLengthX() >= this.minTouchWidth() && airshipResult.collisionLengthY() >= this.minTouchHeight()) {
        return "airship";
    } else {
        const nextPoint = DotMoveUtils.nextPointWithDirection({ x: this._realX, y: this._realY }, this.direction());
        if (ship._mapId === $gameMap.mapId() && !ship.isThrough()) {
            shipResult = this.mover().checkCharacter(nextPoint.x, nextPoint.y, dir, ship);
        }
        if (shipResult && shipResult.collisionLengthX() >= this.minTouchWidth() && shipResult.collisionLengthY() >= this.minTouchHeight()) {
            return "ship";
        } else {
            if (boat._mapId === $gameMap.mapId() && !boat.isThrough()) {
                boatResult = this.mover().checkCharacter(nextPoint.x, nextPoint.y, dir, boat);
            }
            if (boatResult && boatResult.collisionLengthX() >= this.minTouchWidth() && boatResult.collisionLengthY() >= this.minTouchHeight()) {
                return "boat";
            }
        }
    }
    return null;
};

Game_Player.prototype.getOffVehicle = function() {
    if (this.isInAirship()) {
        return this.getOffAirship();
    } else {
        return this.getOffShipOrBoat();
    }
};

Game_Player.prototype.getOffAirship = function() {
    if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
        this.getOffVehicleLastPhase();
    }
    return this._vehicleGettingOff;
};

Game_Player.prototype.getOffShipOrBoat = function() {
    if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
        this.setDirectionFix(true);
        this.setMoveSpeed(4);
        this._shipOrBoatTowardingLand = true;
        this.setThrough(true);
        const point = { x: this.x, y: this.y };
        this.mover().moveToTarget(point);
        this.setThrough(false);
    }
    return false;
};

Game_Player.prototype.getOffVehicleLastPhase = function() {
    this._followers.synchronize(this.x, this.y, this.direction());
    this.vehicle().getOff();
    if (this.isInAirship()) {
        this.forceMoveOffAirship();
    } else {
        this.forceMoveOffShipOrBoat();
        this.setTransparent(false);
    }
    this._vehicleGettingOff = true;
    this.setThrough(false);
    this.makeEncounterCount();
};

Game_Player.prototype.updateTowardLandShipOrBoat = function() {
    this.vehicle().syncWithPlayer();
    if (!this.isMoving()) {
        this._shipOrBoatTowardingLand = false;
        this.setDirectionFix(false);
        this.getOffVehicleLastPhase();
    }
};

Game_Player.prototype.updateVehicle = function() {
    if (this._shipOrBoatTowardingLand) {
        this.updateTowardLandShipOrBoat();
    } else if (this.isInVehicle() && !this.areFollowersGathering()) {
        if (this._vehicleGettingOn) {
            this.updateVehicleGetOn();
        } else if (this._vehicleGettingOff) {
            this.updateVehicleGetOff();
        } else {
            this.vehicle().syncWithPlayer();
        }
    }
};

Game_Player.prototype.updateVehicleGetOff = function() {
     // 飛行船着地中はプレイヤーと飛行船の位置を同期させる
    if (this.isInAirship()) {
        this.vehicle().syncWithPlayer();
    }
    if (this._gatherStart) {
        if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
            // 飛行船着地に完了した場合、正面を向く
            if (this.isInAirship()) {
                this.vehicle().setDirectionFix(false);
                this.setDirectionFix(false);
                this.setDirection(2);
            }
            // 整数座標への移動完了後は確実に座標を整数に設定する
            this.setPosition(this.x, this.y);
            this._vehicleGettingOff = false;
            this._vehicleType = "walk";
            this.setTransparent(false);
            this._gatherStart = false;
        }
    } else {
        if (!this.isMoving()) {
            this.gatherFollowers();
            this._gatherStart = true;
            $gameMap.setDisableHereEventRect({ x: this.x, y: this.y, width: this.width(), height: this.height() });
        }
    }
};

Game_Player.prototype.isCollidedWithVehicles = function(x, y) {
    if (this.isInBoat()) {
        return $gameMap.ship().posNt(x, y);
    } else if (this.isInShip()) {
        return $gameMap.boat().posNt(x, y);
    }
    return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
};

Game_Player.prototype.moveForward = function() {
    this.moveStraight(this.direction());
};

Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if ($gameMap.isEventRunning()) return;
    for (const event of DotMoveUtils.enteringMassesEvents(x, y, this.width(), this.height())) {
        if (event.isCollidedDisableHereEventRect()) continue;
        const result = this.mover().checkCharacter(x, y, this._direction, event);
        if (!result) continue;
        if (result.collisionLengthX() >= event.widthArea() && result.collisionLengthY() >= event.heightArea()) {
            if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                $gameMap.setDisableHereEventRect(event.collisionRect());
                event.start();
            }
        }
    }
};

Game_Player.prototype.startMapEventFront = function(x, y, d, triggers, normal, isTouch) {
    if ($gameMap.isEventRunning()) return;
    if (isTouch && (this.isThrough() || this.isDebugThrough())) return;
    const dpf = this.distancePerFrame();
    const deg = DotMoveUtils.direction2deg(d);
    const dis = DotMoveUtils.calcDistance(deg, dpf);
    const x2 = x + dis.x;
    const y2 = y + dis.y;
    for (const event of DotMoveUtils.enteringMassesEvents(x2, y2, this.width(), this.height())) {
        const result = this.mover().checkCharacter(x2, y2, d, event);
        if (!result) continue;
        const axis = this._direction === 8 || this._direction === 2 ? "x" : "y";
        const area = axis === "x" ? event.widthArea() : event.heightArea();
        const otherAxis = axis === "y" ? "x" : "y";
        const otherAxisLen = isTouch ? dpf * 0.75 : 0;
        if (result.getCollisionLength(axis) >= area && result.getCollisionLength(otherAxis) >= otherAxisLen) {
            if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                if (isTouch && event.isThrough()) continue;
                event.start();
            }
        }
    }
};

Game_Player.prototype.checkEventTriggerTouchFront = function(d) {
    if (this.canStartLocalEvents()) {
        // トリガー  0: 決定ボタン 1: プレイヤーから接触 2: イベントから接触
        this.startMapEventFront(this._realX, this._realY, d, [1, 2], true, true);
    }
};

Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(this._realX, this._realY, triggers, false);
    }
};

Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
        const direction = this.direction();
        this.startMapEventFront(this._realX, this._realY, this._direction, triggers, true, false);
        const currentPoint = { x: this._realX, y: this._realY };
        const nextPoint = DotMoveUtils.nextPointWithDirection(currentPoint, direction);
        const x2 = Math.round(nextPoint.x);
        const y2 = Math.round(nextPoint.y);
        if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
            this.startMapEventFront(nextPoint.x, nextPoint.y, this._direction, triggers, true, false);
        }
    }
};

// プレイヤーの場合は処理をしない
Game_Player.prototype.dotMoveToPlayer = function() {
};


Game_Event.prototype.makeMover = function() {
    return new EventMover(this);
};

Game_Event.prototype.widthArea = function() {
    return this.mover().widthArea();
};

Game_Event.prototype.heightArea = function() {
    return this.mover().heightArea();
};

Game_Event.prototype.isCollidedDisableHereEventRect = function() {
    const eventRect = this.collisionRect();
    const disableHereEventRect = $gameMap.disableHereEventRect();
    if (disableHereEventRect && DotMoveUtils.isCollidedRect(eventRect, disableHereEventRect)) {
        const result = new CollisionResult(eventRect, disableHereEventRect);
        if (result.collisionLengthX() >= this.widthArea() && result.collisionLengthY() >= this.heightArea()) {
            return true;
        }
    }
    return false;
};

Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y) {
    return this.mover().isCollidedWithPlayerCharacters(x, y);
};

Game_Event.prototype.checkEventTriggerTouchFront = function(d) {
    if ($gameMap.isEventRunning()) return;
    if ($gamePlayer.isThrough()) return;
    if (this._trigger === 2) {
        const result = this.mover().checkCharacterStepDir(this._realX, this._realY, d, $gamePlayer);
        if (!result) return;
        const axis = this._direction === 8 || this._direction === 2 ? "x" : "y";
        const playerMinTouchWidthOrHeight = axis === "x" ? $gamePlayer.minTouchWidth() : $gamePlayer.minTouchHeight();
        const eventMinTouchWidthOrHeight = axis === "x" ? this.minTouchWidth() : this.minTouchHeight();
        const minTouchWidthOrHeight = Math.min(playerMinTouchWidthOrHeight, eventMinTouchWidthOrHeight);
        const otherAxis = axis === "y" ? "x" : "y";
        const otherAxisLen = this.distancePerFrame() * 0.75;
        if (result.getCollisionLength(axis) >= minTouchWidthOrHeight && result.getCollisionLength(otherAxis) >= otherAxisLen) {
            if (!this.isJumping() && this.isNormalPriority()) {
                this.start();
            }
        }
    }
};

// 未使用だが元々の定義として存在するため処理を用意する
Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
    if ($gameMap.isEventRunning()) return;
    if (this._trigger === 2) {
        const result = this.mover().checkCharacter(x, y, this._direction, $gamePlayer);
        if (!result) return;
        const minTouchWidth = Math.min($gamePlayer.minTouchWidth(), this.minTouchWidth());
        const minTouchHeight = Math.min($gamePlayer.minTouchHeight(), this.minTouchHeight());
        if (result.collisionLengthX() >= minTouchWidth && result.collisionLengthY() >= minTouchHeight) {
            if (!this.isJumping() && this.isNormalPriority()) {
                this.start();
            }
        }
    }
};


if (Utils.RPGMAKER_NAME === "MV") {
    Game_Followers.prototype.data = function() {
        return this._data.clone();
    };
};

Game_Follower.prototype.makeMover = function() {
    return new FollowerMover(this);
};

// プレイヤーがスルー状態の場合、フォロワーのスルー状態にする
const _Game_Follower_isThrough = Game_Follower.prototype.isThrough;
Game_Follower.prototype.isThrough = function() {
    const result = _Game_Follower_isThrough.call(this);
    return result || $gamePlayer.isThrough();
};

Game_Follower.prototype.isDebugThrough = function() {
    return $gamePlayer.isDebugThrough();
};

Game_Follower.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    // フォロワーの移動速度はchaseCharacterで設定するため、ここでは設定しない
    this.setOpacity($gamePlayer.opacity());
    this.setBlendMode($gamePlayer.blendMode());
    this.setWalkAnime($gamePlayer.hasWalkAnime());
    this.setStepAnime($gamePlayer.hasStepAnime());
    this.setDirectionFix($gamePlayer.isDirectionFixed());
    this.setTransparent($gamePlayer.isTransparent());
};

Game_Follower.prototype.chaseCharacter = function(character) {
    if (this.isJumping()) return;
    const deg = this.calcDeg(character);
    const far = this.calcFar(character);
    if (far >= 1) {
        if (far >= 4) {
            // 前のキャラとの距離が4以上離れている場合はすり抜けを行う
            this.setThrough(true);
            this.dotMoveByDeg(deg);
        } else {
            // 前のキャラとの距離が1以上離れている場合は360度移動を行う
            this.setThrough(false);
            this.dotMoveByDeg(deg);
        }
        this.setMoveSpeed(this.calcFollowerSpeed(far));
    }
};

Game_Follower.prototype.gatherCharacter = function(character) {
    this.setThrough(true);
    if (this.isGathered()) {
        this.setPositionAndRoundIntXy(character._realX, character._realY);
        this.setThrough(false);
    } else {
        this.setMoveSpeed($gamePlayer.moveSpeed());
        const deg = this.calcDeg(character);
        this.dotMoveByDeg(deg);
    }
};

Game_Follower.prototype.calcFollowerSpeed = function(precedingCharacterFar) {
    if (precedingCharacterFar >= 2) {
        return $gamePlayer.realMoveSpeed() + 1;
    } else if (precedingCharacterFar >= 1.5) {
        return $gamePlayer.realMoveSpeed();
    } else if (precedingCharacterFar >= 1) {
        return $gamePlayer.realMoveSpeed() - 1;
    } else {
        return 0;
    }
};

Game_Follower.prototype.isGathered = function() {
    if (this.isMoving()) return false;
    const margin = this.distancePerFrame();
    const result = this.mover().checkCharacter(this._realX, this._realY, this.direction(), $gamePlayer);
    return result && result.collisionLengthX() >= (1 - margin) && result.collisionLengthY() >= (1 - margin);
};


const _Game_Followers_initialize = Game_Followers.prototype.initialize;
Game_Followers.prototype.initialize = function() {
    _Game_Followers_initialize.call(this);
    this._gatherCount = 0; // gatherタイムアウト監視用
};

Game_Followers.prototype.update = function() {
    if (this.areGathering()) {
        this.updateGather();
    } else {
        this.updateMove();
    }
    for (const follower of this._data) {
        follower.update();
    }
};

Game_Followers.prototype.updateGather = function() {
    if (this.areGathered()) {
        this._gathering = false;
    } else {
        for (let i = this._data.length - 1; i >= 0; i--) {
            const precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
            this._data[i].gatherCharacter(precedingCharacter);
        }
    }
};

const _Game_Followers_gather = Game_Followers.prototype.gather;
Game_Followers.prototype.gather = function() {
    _Game_Followers_gather.call(this);
    this._gatherCount = 0;
};

const _Game_Followers_areGathering = Game_Followers.prototype.areGathering;
Game_Followers.prototype.areGathering = function() {
    this._gatherCount++;
    return _Game_Followers_areGathering.call(this);
};

Game_Followers.prototype.areGathered = function() {
    // 600フレーム経過してもgatherが終了しない場合、フリーズ回避のために強制的にgatherを終了する
    if (this._gatherCount >= 600) {
        this._gatherCount = 0;
        return true;
    }
    // MVにはGame_Follower#isGatheredがないためGame_Followers#areGatheredの処理を再定義する
    return this.visibleFollowers().every(follower => follower.isGathered());
};


const _Game_Vehicle_getOn = Game_Vehicle.prototype.getOn;
Game_Vehicle.prototype.getOn = function() {
    _Game_Vehicle_getOn.call(this);
    $gamePlayer.setPositionAndRoundIntXy(this._realX, this._realY);
};


const _Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    // なるべくドット移動関連の変数をセーブデータに持たせないため、ムーバーはGame_Tempに保持する。
    this._movers = new Map();
    // イベントとの衝突判定を高速化するため、マスごとにイベントを管理する
    this._mapEventsCache = null;
};

Game_Temp.prototype.mover = function(character) {
    if (this._movers.get(character)) return this._movers.get(character);
    const mover = character.makeMover();
    this._movers.set(character, mover);
    return mover;
};

Game_Temp.prototype.clearMovers = function() {
    this._movers = new Map();
};

Game_Temp.prototype.setupMapEventsCache = function(width, height) {
    const mapEventsCache = new Array(width * height);
    this._mapEventsCache = mapEventsCache;
};

Game_Temp.prototype.mapEventsCache = function() {
    return this._mapEventsCache;
};

Game_Temp.prototype.addMapEventCache = function(mass, event) {
    if (!this._mapEventsCache[mass]) this._mapEventsCache[mass] = [];
    if (!this._mapEventsCache[mass].includes(mass)) {
        this._mapEventsCache[mass].push(event);
    }
};

Game_Temp.prototype.removeMapEventCache = function(mass, event) {
    if (this._mapEventsCache[mass]) {
        this._mapEventsCache[mass] = this._mapEventsCache[mass].filter(evt => evt !== event);
    }
};

return {
    EventParamParser: EventParamParser,
    DotMoveUtils: DotMoveUtils,
    CollisionResult: CollisionResult,
    CharacterCollisionChecker: CharacterCollisionChecker,
    PlayerCollisionChecker: PlayerCollisionChecker,
    EventCollisionChecker: EventCollisionChecker,
    FollowerCollisionChecker: FollowerCollisionChecker,
    CharacterController: CharacterController,
    PlayerController: PlayerController,
    EventController: EventController,
    FollowerController: FollowerController,
    CharacterMover: CharacterMover,
    PlayerMover: PlayerMover,
    EventMover: EventMover,
    FollowerMover: FollowerMover,
};

})();
