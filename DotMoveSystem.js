/*:
@target MV MZ
@plugindesc ドット移動システム v1.2.2
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem.js
@help
ドット単位での移動が可能になるプラグインです。

【使用方法】
基本的に導入するだけで使用可能ですが、以下の内容を設定することでより詳細な制御が可能になります。

■移動単位の設定
移動ルートのスクリプトで
this.setMoveUnit(移動単位(0～1の間の小数));
と記載することで、一歩あたりの移動単位を指定することができます。
例えば、イベントを半歩移動させるには
this.setMoveUnit(0.5);
と記載します。

■ドット単位で任意の角度に移動させる
移動ルートのスクリプトで
this.dotMoveByDeg(角度(0～359の整数));
と記載することで、ドット単位で指定した角度の方向へ移動させることができます。

■ドット単位でイベントをプレイヤーの方向に移動させる
移動ルートのスクリプトで
this.dotMoveToPlayer();
と記載することで、イベントをドット単位でプレイヤーの方向に移動させることができます。

■指定の座標に移動させる
移動ルートのスクリプトで
this.moveToTarget(X座標, Y座標);
と記載することで、指定した座標に向けて移動させることができます。
(途中で壁などに衝突した場合は到達座標がずれます。)

■イベント接触判定の設定
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

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const DotMoveSystemClassAlias = (() => {
"use strict";

const PLAYER_SLIDE_LENGTH = 0.5;
const EVENT_SLIDE_LENGTH = 0.5;
const FOLLOWER_SLIDE_LENGTH = 0.75;
const TOUCH_MODE = 1;

class EventParamParser {
    static getArea(event) {
        let widthArea = 0.5;
        let heightArea = 0.5;
        const note = this.getNote(event);
        const data = { note: note };
        DataManager.extractMetadata(data);
        if (data.meta.widthArea) widthArea = parseFloat(data.meta.widthArea);
        if (data.meta.heightArea) heightArea = parseFloat(data.meta.heightArea);
        return { width: widthArea, height: heightArea };
    }

    static getNote(event) {
        const page0List = event.event().pages[0].list;
        if (page0List.length > 0 && page0List[0].code === 108) {
            return page0List[0].parameters[0];
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
        if (deg < 0) deg = 360 + deg;
        deg %= 360;
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

    static deg2direction4(deg, direction) {
        if (deg < 0) deg = 360 + deg;
        deg %= 360;
        const t = Math.round(deg / 45);
        if (t === 0 || t === 8) {
            return 8;
        } else if (t === 1) {
            if (direction === 8) return 8;
            return 6;
        } else if (t === 2) {
            return 6;
        } else if (t === 3) {
            if (direction === 6) return 6;
            return 2;
        } else if (t === 4) {
            return 2;
        } else if (t === 5) {
            if (direction === 2) return 2;
            return 4;
        } else if (t === 6) {
            return 4;
        } else if (t === 7) {
            if (direction === 4) return 4;
            return 8;
        } else {
            throw new Error(`${deg} is not found`);
        }
    }

    static rad2deg(rad) {
        return (rad * 180 / Math.PI) + 90;
    }

    static deg2rad(deg) {
        return (deg - 90) * Math.PI / 180;
    }

    static calcMargin(moveSpeed) {
        if (moveSpeed < 0) moveSpeed = 0;
        const minDpf = 0.0025;
        return minDpf * Math.pow(2, moveSpeed);
    }

    static calcDistance(deg, dpf) {
        const rad = DotMoveUtils.deg2rad(deg);
        let disX = dpf * Math.cos(rad);
        let disY = dpf * Math.sin(rad);
        const unit = 2**16;
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
        return DotMoveUtils.rad2deg(rad);
    }

    static calcFar(fromPoint, targetPoint) {
        const xDiff = $gameMap.deltaX(targetPoint.x, fromPoint.x);
        const yDiff = $gameMap.deltaY(targetPoint.y, fromPoint.y);
        if (xDiff === 0 && yDiff === 0) return 0;
        return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    }

    static reachPoint(realPoint, targetPoint, margin) {
        if (Math.abs(realPoint.x - targetPoint.x) <= margin &&
            Math.abs(realPoint.y - targetPoint.y) <= margin) {
                return true;
        }
        return false;
    }

    static nextPointWithDirection(point, direction, unit = 1) {
        let x = point.x;
        let y = point.y;
        const xySign = this.xySign(direction);
        x += xySign.x * unit;
        y += xySign.y * unit;
        x = $gameMap.roundX(x);
        y = $gameMap.roundY(y);
        return { x, y };
    }

    static prevPointWithDirection(point, direction, unit = 1) {
        let x = point.x;
        let y = point.y;
        const xySign = this.xySign(direction);
        x -= xySign.x * unit;
        y -= xySign.y * unit;
        x = $gameMap.roundX(x);
        y = $gameMap.roundY(y);
        return { x, y };
    }

    static xySign(direction) {
        let x = 0;
        let y = 0;
        switch (direction) {
        case 8:
            y = -1;
            break;
        case 9:
            y = -1;
            x = 1;
            break;
        case 6:
            x = 1;
            break;
        case 3:
            y = 1;
            x = 1;
            break;
        case 2:
            y = 1;
            break;
        case 1:
            y = 1;
            x = -1;
            break;
        case 4:
            x = -1;
            break;
        case 7:
            y = -1;
            x = -1;
            break;
        }
        return { x, y };
    }

    static isCollidedRect(rect1, rect2) {
        if ((rect1.x > rect2.x && rect1.x < (rect2.x + rect2.width) || (rect1.x + rect1.width) > rect2.x && (rect1.x + rect1.width) < rect2.x + rect2.width || rect2.x >= rect1.x && (rect2.x + rect2.width) <= (rect1.x + rect1.width)) &&
            (rect1.y > rect2.y && rect1.y < (rect2.y + rect2.height) || (rect1.y + rect1.height) > rect2.y && (rect1.y + rect1.height) < rect2.y + rect2.height || rect2.y >= rect1.y && (rect2.y + rect2.height) <= (rect1.y + rect1.height))) {
                return true;
        }
        return false;
    }
}


// マイナス値に対応
Game_Map.prototype.roundX = function(x) {
    if (this.isLoopHorizontal()) {
        if (x < 0) x = this.width() + x;
        return x.mod(this.width());
    } else {
        return x;
    }
};

Game_Map.prototype.roundY = function(y) {
    if (this.isLoopVertical()) {
        if (y < 0) y = this.height() + y;
        return y.mod(this.height());
    } else {
        return y;
    }
};

// マップ移動時に全てのムーバーをクリアする(メモリリーク対策)
const _Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId);
    $gameTemp.clearMovers();
};


class CollisionResult {
    constructor(targetRect, collisionRect) {
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
    constructor(character) {
        this._character = character;
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

    checkCollisionMass(x, y, d) {
        const collisionResults = [];
        let x1, y1, x2, y2;
        switch (d) {
        case 8:
            x1 = Math.floor(x);
            x2 = Math.ceil(x);
            y1 = Math.floor(y);
            y2 = y1;
            break;
        case 6:
            x1 = Math.ceil(x);
            x2 = x1;
            y1 = Math.floor(y);
            y2 = Math.ceil(y);
            break;
        case 2:
            x1 = Math.floor(x);
            x2 = Math.ceil(x);
            y1 = Math.ceil(y);
            y2 = y1;
            break;
        case 4:
            x1 = Math.floor(x);
            x2 = x1;
            y1 = Math.floor(y);
            y2 = Math.ceil(y);
            break;
        }
        for (let ix = x1; ix <= x2; ix++) {
            for (let iy = y1; iy <= y2; iy++) {
                const ix2 = $gameMap.roundX(ix);
                const iy2 = $gameMap.roundY(iy);
                if (!this.checkMass(ix2, iy2, d) && this.isCollidedMass(x, y, d, ix, iy, 1, 1)) {
                    const collisionResult = new CollisionResult({x: x, y: y, width: 1, height: 1}, { x: ix, y: iy, width: 1, height: 1 });
                    collisionResults.push(collisionResult);
                }
            }
        }
        return collisionResults;
    }

    checkCollisionCharacters(x, y, d) {
        return [];
    }

    checkMass(x, y, d) {
        if (!$gameMap.isValid(x, y)) {
            return false;
        }
        if (this._character.isThrough() || this._character.isDebugThrough()) {
            return true;
        }
        const prevPoint = DotMoveUtils.prevPointWithDirection({x, y}, d);
        if (!this._character.isMapPassable(prevPoint.x, prevPoint.y, d)) {
            return false;
        }
        return true;
    }

    checkPlayer(x, y, d) {
        const collisionResults = [];
        const result = this.checkCharacter(x, y, d, $gamePlayer);
        if (result) collisionResults.push(result);
        return collisionResults;
    }

    checkFollowers(x, y, d) {
        const collisionResults = [];
        for (const follower of $gamePlayer._followers.data()) {
            const result = this.checkCharacter(x, y, d, follower);
            if (result) collisionResults.push(result);
        }
        return collisionResults;
    }

    checkEvents(x, y, d) {
        const collisionResults = [];
        for (const event of $gameMap.events()) {
            if (event.isNormalPriority() && !event.isThrough()) {
                const result = this.checkCharacter(x, y, d, event);
                if (result) collisionResults.push(result);
            }
        }
        return collisionResults;
    }

    checkVehicles(x, y, d) {
        const collisionResults = [];
        if ($gameMap.boat()._mapId === $gameMap.mapId() && !$gamePlayer.isInBoat()) {
            const result = this.checkCharacter(x, y, d, $gameMap.boat());
            if (result) collisionResults.push(result);
        }
        if ($gameMap.ship()._mapId === $gameMap.mapId() && !$gamePlayer.isInShip()) {
            const result = this.checkCharacter(x, y, d, $gameMap.ship());
            if (result) collisionResults.push(result);
        }
        return collisionResults;
    }

    checkCharacter(x, y, d, character) {
        if (this.isCollidedCharacter(x, y, d, character._realX, character._realY)) {
            return new CollisionResult({x: x, y: y, width: 1, height: 1}, { x: character._realX, y: character._realY, width: 1, height: 1 });
        } else if ($gameMap.isLoopHorizontal() || $gameMap.isLoopVertical()) {
            let cx = character._realX;
            let cy = character._realY;
            if ($gameMap.isLoopHorizontal()) {
                if (cx <= 1) {
                    cx = $gameMap.width() - cx;
                } else if (cx >= $gameMap.width() - 1) {
                    cx = cx - $gameMap.width();
                }
            }
            if ($gameMap.isLoopVertical()) {
                if (cy <= 1) {
                    cy = $gameMap.height() - cy;
                } else if (cy >= $gameMap.height() - 1) {
                    cy = cy - $gameMap.height();
                }
            }
            if (this.isCollidedCharacter(x, y, d, cx, cy)) {
                return new CollisionResult({x: x, y: y, width: 1, height: 1}, { x: cx, y: cy, width: 1, height: 1 });
            }
        }
    }

    isCollidedMass(x, y, d, mx, my, mw, mh) {
        let x2 = x;
        let y2 = y;
        let w = 1;
        let h = 1;
        switch (d) {
        case 8:
            h = 0.5;
            break;
        case 6:
            x2 += 0.5;
            w = 0.5;
            break;
        case 2:
            y2 += 0.5;
            h = 0.5;
            break;
        case 4:
            w = 0.5;
            break;
        }
        const rect1 = { x: x2, y: y2, width: w, height: h };
        const rect2 = { x: mx, y: my, width: mw, height: mh };
        return DotMoveUtils.isCollidedRect(rect1, rect2);
    }

    isCollidedCharacter(x, y, d, cx, cy) {
        let x2 = x;
        let y2 = y;
        let w = 1;
        let h = 1;
        switch (d) {
        case 8:
            h = 0.5;
            break;
        case 6:
            x2 += 0.5;
            w = 0.5;
            break;
        case 2:
            y2 += 0.5;
            h = 0.5;
            break;
        case 4:
            w = 0.5;
            break;
        }
        const rect1 = { x: x2, y: y2, width: w, height: h };
        const rect2 = { x: cx, y: cy, width: 1, height: 1 };
        return DotMoveUtils.isCollidedRect(rect1, rect2);
    }
}

class PlayerCollisionChecker extends CharacterCollisionChecker {
    checkCollisionCharacters(x, y, d) {
        let collisionResults = [];
        collisionResults = collisionResults.concat(this.checkEvents(x, y, d));
        collisionResults = collisionResults.concat(this.checkVehicles(x, y, d));
        return collisionResults;
    }
}

class EventCollisionChecker extends CharacterCollisionChecker {
    checkCollisionCharacters(x, y, d) {
        let collisionResults = [];
        collisionResults = collisionResults.concat(this.checkPlayer(x, y, d));
        if ($gamePlayer._followers.isVisible()) collisionResults = collisionResults.concat(this.checkFollowers(x, y, d));
        collisionResults = collisionResults.concat(this.checkOtherEvents(x, y, d));
        collisionResults = collisionResults.concat(this.checkVehicles(x, y, d));
        return collisionResults;
    }

    checkOtherEvents(x, y, d) {
        const collisionResults = [];
        for (const event of $gameMap.events()) {
            if (event.isNormalPriority() && this._character.event().id !== event.event().id) {
                const result = this.checkCharacter(x, y, d, event);
                if (result) collisionResults.push(result);
            }
        }
        return collisionResults;
    }
}

class FollowerCollisionChecker extends CharacterCollisionChecker {
    checkCollisionCharacters(x, y, d) {
        let collisionResults = [];
        collisionResults = collisionResults.concat(this.checkEvents(x, y, d));
        collisionResults = collisionResults.concat(this.checkVehicles(x, y, d));
        return collisionResults;
    }

    // フォロワーの移動を滑らかにするために衝突判定の座標を調整する
    checkCollision(x, y, d) {
        const margin = DotMoveUtils.calcMargin(this._character.realMoveSpeed() - 2);
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
    constructor(character, collisionChecker) {
        this._character = character;
        this._collisionChecker = collisionChecker;
    }

    dotMoveByDirection(direction) {
        return this.dotMoveByDeg(DotMoveUtils.direction2deg(direction));
    }

    dotMoveByDeg(deg) {
        const direction = DotMoveUtils.deg2direction(deg);
        let movedPoint = null;
        switch (direction) {
        case 8:
            movedPoint = this.calcUp(deg);
            break;
        case 9:
            movedPoint = this.calcUpRight(deg);
            break;
        case 6:
            movedPoint = this.calcRight(deg);
            break;
        case 3:
            movedPoint = this.calcRightDown(deg);
            break;
        case 2:
            movedPoint = this.calcDown(deg);
            break;
        case 1:
            movedPoint = this.calcDownLeft(deg);
            break;
        case 4:
            movedPoint = this.calcLeft(deg);
            break;
        case 7:
            movedPoint = this.calcLeftUp(deg);
            break;
        }
        const realPoint = { x: this._character._realX, y: this._character._realY };
        const margin = DotMoveUtils.calcMargin(this._character.realMoveSpeed() - 2);
        let moved = true;
        if (DotMoveUtils.reachPoint(realPoint, movedPoint, margin)) moved = false;
        movedPoint.x = $gameMap.roundX(movedPoint.x);
        movedPoint.y = $gameMap.roundY(movedPoint.y);
        this._character._realX = movedPoint.x;
        this._character._realY = movedPoint.y;
        this._character._x = Math.round(this._character._realX);
        this._character._y = Math.round(this._character._realY);
        return moved;
    }

    checkCharacter(x, y, direction, character) {
        return this._collisionChecker.checkCharacter(x, y, direction, character);
    }

    checkCharacterFront(x, y, direction, character) {
        const dis = this.calcDistance(DotMoveUtils.direction2deg(direction));
        const x2 = x + dis.x;
        const y2 = y + dis.y;
        return this._collisionChecker.checkCharacter(x2, y2, direction, character);
    }

    calcUp(deg) {
        const target = this.characterTarget();
        let dis = this.calcDistance(deg);
        const collisionResults = this.checkCollision(target.x + dis.x, target.y + dis.y, 8);
        dis = this.correctUpDistance(target, dis);
        target.y += dis.y;
        if (dis.x < 0) {
            dis = this.correctLeftDistance(target, dis);
        } else if (dis.x > 0) {
            dis = this.correctRightDistance(target, dis);
        }
        dis = this.slideDistance(dis, target, collisionResults, 315, 45, "x");
        target.x += dis.x;
        return { x: target.x, y: target.y };
    }

    calcRight(deg) {
        const target = this.characterTarget();
        let dis = this.calcDistance(deg);
        const collisionResults = this.checkCollision(target.x + dis.x, target.y + dis.y, 6);
        dis = this.correctRightDistance(target, dis);
        target.x += dis.x;
        if (dis.y < 0) {
            dis = this.correctUpDistance(target, dis);
        } else if (dis.y > 0) {
            dis = this.correctDownDistance(target, dis);
        }
        dis = this.slideDistance(dis, target, collisionResults, 45, 135, "y");
        target.y += dis.y;
        return { x: target.x, y: target.y };
    }

    calcDown(deg) {
        const target = this.characterTarget();
        let dis = this.calcDistance(deg);
        const collisionResults = this.checkCollision(target.x + dis.x, target.y + dis.y, 2);
        dis = this.correctDownDistance(target, dis);
        target.y += dis.y;
        if (dis.x < 0) {
            dis = this.correctLeftDistance(target, dis);
        } else if (dis.x > 0) {
            dis = this.correctRightDistance(target, dis);
        }
        dis = this.slideDistance(dis, target, collisionResults, 225, 135, "x");
        target.x += dis.x;
        return { x: target.x, y: target.y };
    }

    calcLeft(deg) {
        const target = this.characterTarget();
        let dis = this.calcDistance(deg);
        const collisionResults = this.checkCollision(target.x + dis.x, target.y + dis.y, 4);
        dis = this.correctLeftDistance(target, dis);
        target.x += dis.x;
        if (dis.y < 0) {
            dis = this.correctUpDistance(target, dis);
        } else if (dis.y > 0) {
            dis = this.correctDownDistance(target, dis);
        }
        dis = this.slideDistance(dis, target, collisionResults, 315, 225, "y");
        target.y += dis.y;
        return { x: target.x, y: target.y };
    }

    calcUpRight(deg) {
        const target = this.characterTarget();
        let dis = this.calcDistance(deg);
        dis = this.correctUpDistance(target, dis);
        target.y += dis.y;
        dis = this.correctRightDistance(target, dis);
        target.x += dis.x;
        return { x: target.x, y: target.y };
    }

    calcRightDown(deg) {
        const target = this.characterTarget();
        let dis = this.calcDistance(deg);
        dis = this.correctRightDistance(target, dis);
        target.x += dis.x;
        dis = this.correctDownDistance(target, dis);
        target.y += dis.y;
        return { x: target.x, y: target.y };
    }

    calcDownLeft(deg) {
        const target = this.characterTarget();
        let dis = this.calcDistance(deg);
        dis = this.correctDownDistance(target, dis);
        target.y += dis.y;
        dis = this.correctLeftDistance(target, dis);
        target.x += dis.x;
        return { x: target.x, y: target.y };
    }

    calcLeftUp(deg) {
        const target = this.characterTarget();
        let dis = this.calcDistance(deg);
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
        const nextTarget = { x: target.x, y: target.y, width: target.width, height: target.height };
        nextTarget[axis] += distance[axis];
        const collisionResults = this.checkCollision(nextTarget.x, nextTarget.y, dir);
        if (collisionResults.length === 0) return correctedDistance;
        const len = this.getMaxCollisionLength(collisionResults, axis);
        // 本来このタイミングで衝突距離が0.5以上になることはないが、もしなった場合は移動距離を0にする
        if (len > 0.5) return axis === "x" ? { x: 0, y: distance.y } : { x: distance.x, y: 0 };
        const sign = dir === 8 || dir === 4 ? 1 : -1;
        correctedDistance[axis] += len * sign;
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

    // 衝突矩形が1つだけの場合、キャラをスライドさせる
    // 衝突距離がキャラの移動距離以上であれば移動距離分スライドを行う
    // 衝突距離がキャラの移動距離未満であれば衝突距離分スライドを行う
    slideDistance(dis, target, collisionResults, deg1, deg2, axis) {
        const newDis = { x: dis.x, y: dis.y };
        if (collisionResults.length === 1) {
            const len = collisionResults[0].getCollisionLength(axis);
            const diagDis = target[axis] < collisionResults[0].collisionRect[axis] ? this.calcDistance(deg1) : this.calcDistance(deg2);
            if (len < Math.abs(diagDis[axis])) {
                newDis[axis] = diagDis[axis] < 0 ? -len : len;
            } else if (len < this.slideLength()) {
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

    calcDistance(deg) {
        return DotMoveUtils.calcDistance(deg, this._character.distancePerFrame());
    }

    checkCollision(x, y, dir) {
        if (!this._collisionChecker) throw new Error("this._collisionChecker is null");
        return this._collisionChecker.checkCollision(x, y, dir);
    }

    characterTarget() {
        return { x: this._character._realX, y: this._character._realY, width: 1, height: 1 };
    }

    slideLength() {
        return 0;
    }
}

class PlayerController extends CharacterController {
    constructor(character) {
        super(character, new PlayerCollisionChecker(character));
    }

    slideLength() {
        return PLAYER_SLIDE_LENGTH;
    }
}

class EventController extends CharacterController {
    constructor(character) {
        super(character, new EventCollisionChecker(character));
    }

    slideLength() {
        return EVENT_SLIDE_LENGTH;
    }
}

class FollowerController extends CharacterController {
    constructor(character) {
        super(character, new FollowerCollisionChecker(character));
    }

    slideLength() {
        return FOLLOWER_SLIDE_LENGTH;
    }
}


// CharacterControllerを用いてキャラクターの座標を更新し、
// それに合わせてキャラクターの各種状態を更新する。
class CharacterMover {
    constructor(character) {
        this._character = character;
        this._controller = new CharacterController(character, new CharacterCollisionChecker(character));
        this._targetCount = 0;
        this._moving = false;
        this._setThroughReserve = null;
        this._setMoveSpeedReserve = null;
        this._moveDeg = null;
        this._moveDir = null;
        this._gatherStart = false;
    }

    update() {
        if (this._targetCount > 0) {
            this.massMoveProcess();
        }
        if (this._targetCount === 0) {
            this._moving = false;
            this._moveDeg = null;
            this._moveDir = null;
            if (this._setThroughReserve != null) {
                this._character._through = this._setThroughReserve;
                this._setThroughReserve = null;
            }
            if (this._setMoveSpeedReserve != null) {
                this._character._moveSpeed = this._setMoveSpeedReserve;
                this._setMoveSpeedReserve = null;
            }
            this._character.refreshBushDepth();
        }
    }

    checkCharacter(x, y, direction, character) {
        return this._controller.checkCharacter(x, y, direction, character);
    }

    checkCharacterFront(x, y, direction, character) {
        return this._controller.checkCharacterFront(x, y, direction, character);
    }

    // マス単位移動が行われた場合、ここで毎フレーム移動処理を行う
    massMoveProcess() {
        let moved;
        if (this._targetCount === 0) return;
        if (this._moveDeg != null) {
            moved = this._controller.dotMoveByDeg(this._moveDeg);
        } else {
            moved = this._controller.dotMoveByDirection(this._moveDir);
        }
        if (moved) {
            this._moving = true;
            this._character.setMovementSuccess(true);
            this._character.incrementTotalDpf();
            if (this._targetCount > 0) this._targetCount--;
        } else {
            this._character.setMovementSuccess(false);
            this._character.checkEventTriggerTouchFront(this._character._direction);
            this._moving = false;
            this._targetCount = 0;
        }
    }

    startMassMove(fromPoint, targetPoint) {
        const far = DotMoveUtils.calcFar(fromPoint, targetPoint);
        this._targetCount = Math.floor(far / this._character.distancePerFrame());
        this.massMoveProcess();
    }

    dotMoveByDirection(direction) {
        this.setDirection(direction);
        this._targetCount = 1;
        this._moveDir = direction;
        this.massMoveProcess();
    }

    dotMoveByDeg(deg) {
        this.setDirection(DotMoveUtils.deg2direction4(deg, this._character.direction()));
        this._targetCount = 1;
        this._moveDeg = deg;
        this.massMoveProcess();
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
        return this._moving;
    }

    moveStraight(d, moveUnit) {
        const fromPoint =  { x: this._character._realX, y: this._character._realY };
        const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, d, moveUnit);
        this._moveDir = d;
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
            this._moveDir = 9;
        } else if (vert === 2 && horz === 6) {
            this._moveDir = 3;
        } else if (vert === 2 && horz === 4) {
            this._moveDir = 1;
        } else if (vert === 8 && horz === 4) {
            this._moveDir = 7;
        }
        const fromPoint =  { x: this._character._realX, y: this._character._realY };
        const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, this._moveDir, moveUnit);
        this.startMassMove(fromPoint, targetPoint);
    }

    moveToTarget(targetPoint) {
        const fromPoint =  { x: this._character._realX, y: this._character._realY };
        const deg = DotMoveUtils.calcDeg(fromPoint, targetPoint);
        this._moveDeg = deg;
        const dir = DotMoveUtils.deg2direction4(deg);
        this.setDirection(dir);
        this.startMassMove(fromPoint, targetPoint);
    }

    // 移動が完了してからスルー状態を設定する
    setThrough(through) {
        if (!this.isMoving()) {
            this._character._through = through;
        } else {
            this._setThroughReserve = through;
        }
    }

    // 移動が完了してから移動速度の変更を反映する
    setMoveSpeed(moveSpeed) {
        if (!this.isMoving()) {
            this._character._moveSpeed = moveSpeed;
        } else {
            this._setMoveSpeedReserve = moveSpeed;
        }
    };
}

class PlayerMover extends CharacterMover {
    constructor(character) {
        super(character);
        this._controller = new PlayerController(character);
    }
}


class EventMover extends CharacterMover {
    constructor(character) {
        super(character);
        this._controller = new EventController(character);
    }
}


class FollowerMover extends CharacterMover {
    constructor(character) {
        super(character);
        this._controller = new FollowerController(character);
    }
}


const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this._totalDpf = 0; // 歩数計算のために使用
    this._moveUnit = 1; // 移動単位
};

Game_CharacterBase.prototype.makeMover = function() {
    return new CharacterMover(this);
};

Game_CharacterBase.prototype.mover = function() {
    return $gameTemp.mover(this);
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

Game_CharacterBase.prototype.pos = function(x, y) {
    const realPoint = { x: this._x, y: this._y };
    const targetPoint = { x, y };
    const margin = DotMoveUtils.calcMargin(this.realMoveSpeed() - 1);
    return DotMoveUtils.reachPoint(realPoint, targetPoint, margin);
};

Game_CharacterBase.prototype.setThrough = function(through) {
    this.mover().setThrough(through);
};

Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed) {
    this.mover().setMoveSpeed(moveSpeed);
};


Game_Character.prototype.updateRoutineMove = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
    } else {
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

Game_Character.prototype.advanceMoveRouteIndex = function() {
    var moveRoute = this._moveRoute;
    if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
        var numCommands = moveRoute.list.length - 1;
        this._moveRouteIndex++;
        if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
            this._moveRouteIndex = 0;
        }
    }
};

Game_Character.prototype.moveRandom = function() {
    const d = 2 + Math.randomInt(4) * 2;
    // canPassは行わない
    // if (this.canPass(this.x, this.y, d)) {
    //     this.moveStraight(d);
    // }
    this.moveStraight(d);
};

Game_Character.prototype.dotMoveByDeg = function(deg) {
    this.mover().dotMoveByDeg(deg);
};

Game_Character.prototype.dotMoveToPlayer = function() {
    const fromPoint = { x: this._realX, y: this._realY };
    const targetPoint = { x: $gamePlayer._realX, y: $gamePlayer._realY };
    const deg = DotMoveUtils.calcDeg(fromPoint, targetPoint);
    this.mover().dotMoveByDeg(deg);
};

Game_Character.prototype.moveToTarget = function(x, y) {
    this.mover().moveToTarget({ x, y});
};



const _Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
    _Game_Player_initMembers.call(this);
    this._needCountProcess = false;
    this._gatherStart = false;
    // 足元のイベント起動を禁止する座標
    // 少し移動しただけで何度も足元のイベントが起動されるのと
    // 場所移動時に足元のイベントが起動されるのを防ぐために使用
    this._disableHereEventPoint = null;
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
        let dotMove = true;
        let direction = this.getInputDirection();
        if (direction > 0) {
            $gameTemp.clearDestination();
        } else if ($gameTemp.isDestinationValid()) {
            const x = $gameTemp.destinationX();
            const y = $gameTemp.destinationY();
            if (TOUCH_MODE === 0) {
                direction = this.findDirectionTo(x, y);
                dotMove = false;
            } else if (TOUCH_MODE === 1) {
                const fromPoint = { x: this._realX, y: this._realY };
                const targetPoint = { x, y };
                const deg = DotMoveUtils.calcDeg(fromPoint, targetPoint);
                this.mover().dotMoveByDeg(deg);
                return;
            }
        }
        if (direction > 0) {
            if (dotMove) {
                this.executeMove(direction);
            } else {
                this.moveStraight(direction);
            }
        }
    }
};

Game_Player.prototype.forceMoveOnVehicle = function() {
    this.setThrough(true);
    const point = { x: this.vehicle()._realX, y: this.vehicle()._realY };
    this.mover().moveToTarget(point);
    this.setThrough(false);
};

Game_Player.prototype.forceMoveOffVehicle = function() {
    this.setThrough(true);
    // 乗り物から降りた時にハマらないように整数座標に着陸する
    const fromPoint = { x: this.x, y: this.y };
    const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, this._direction);
    this.mover().moveToTarget(targetPoint);
    this.setThrough(false);
};

Game_Player.prototype.update = function(sceneActive) {
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
    if (TOUCH_MODE === 1) this.updateTouchPoint();
};

Game_Player.prototype.updateTouchPoint = function() {
    const realPoint = { x: this._realX, y: this._realY };
    const x = $gameTemp.destinationX();
    const y = $gameTemp.destinationY();
    if (x != null && y != null) {
        const targetPoint = { x, y };
        const margin = DotMoveUtils.calcMargin(this.realMoveSpeed());
        if (DotMoveUtils.reachPoint(realPoint, targetPoint, margin)) {
            $gameTemp.clearDestination();
        }
    }
}

const _Game_Player_increaseSteps = Game_Player.prototype.increaseSteps;
Game_Player.prototype.increaseSteps = function() {
    _Game_Player_increaseSteps.call(this);
    // 歩数が増加した場合、歩数増加時の処理をupdateで実行するため、
    // ここでフラグをtrueにしておく
    this._needCountProcess = true;
};

Game_Player.prototype.updateCountProcess = function(sceneActive) {
    if (!$gameMap.isEventRunning()) {
        $gameParty.onPlayerWalk();
        if ($gameMap.setupStartingEvent()) {
            return;
        }
        if (sceneActive && this.triggerAction()) {
            return;
        }
        this.updateEncounterCount();
        this._needCountProcess = false;
    }
};

Game_Player.prototype.updateNonmoving = function(wasMoving, sceneActive) {
    if (!$gameMap.isEventRunning()) {
        if (wasMoving) {
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
    }
};

// 場所移動してすぐの座標にある足元のイベントを起動しないようにする
const _Game_Player_reserveTransfer = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
    this._disableHereEventPoint = { x, y };
    _Game_Player_reserveTransfer.call(this, mapId, x, y, d, fadeType);
};

Game_Player.prototype.getOnVehicle = function() {
    const direction = this.direction();
    const x1 = this._x;
    const y1 = this._y;
    const nextPoint = DotMoveUtils.nextPointWithDirection({ x: x1, y: y1 }, direction);
    const x2 = nextPoint.x;
    const y2 = nextPoint.y;
    if ($gameMap.airship().pos(x1, y1)) {
        this._vehicleType = "airship";
    } else if ($gameMap.ship().pos(x2, y2)) {
        this._vehicleType = "ship";
    } else if ($gameMap.boat().pos(x2, y2)) {
        this._vehicleType = "boat";
    }
    if (this.isInVehicle()) {
        this._vehicleGettingOn = true;
        if (!this.isInAirship()) {
            this.forceMoveOnVehicle();
        }
        this.gatherFollowers();
    }
    return this._vehicleGettingOn;
};

Game_Player.prototype.getOffVehicle = function() {
    if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
        if (this.isInAirship()) {
            this.setDirection(2);
        }
        this._followers.synchronize(this.x, this.y, this.direction());
        this.vehicle().getOff();
        if (!this.isInAirship()) {
            this.forceMoveOffVehicle();
            this.setTransparent(false);
        }
        this._vehicleGettingOff = true;
        this.setMoveSpeed(4);
        this.setThrough(false);
        this.makeEncounterCount();
    }
    return this._vehicleGettingOff;
};

Game_Player.prototype.updateVehicle = function() {
    if (this.isInVehicle() && !this.areFollowersGathering()) {
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
    if (this._gatherStart) {
        if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
            this._vehicleGettingOff = false;
            this._vehicleType = "walk";
            this.setTransparent(false);
            this._gatherStart = false;
        }
    } else {
        if (!this.isMoving()) {
            this.gatherFollowers();
            this._gatherStart = true;
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
    if (!$gameMap.isEventRunning()) {
        for (const event of $gameMap.events()) {
            const result = event.mover().checkCharacter(x, y, this._direction, event);
            if (!result) continue;
            const area = EventParamParser.getArea(event);
            if (result.collisionLengthX() >= area.width && result.collisionLengthY() >= area.height) {
                if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                    this._disableHereEventPoint = { x: this.x, y: this.y };
                    event.start();
                }
            }
        }
    }
};

Game_Player.prototype.startMapEventFront = function(x, y, d, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
        for (const event of $gameMap.events()) {
            const result = event.mover().checkCharacterFront(x, y, d, event);
            const axis = this._direction === 8 || this._direction === 2 ? "x" : "y";
            const area = EventParamParser.getArea(event);
            if (result && result.getCollisionLength(axis) >= area.width) {
                if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                    event.start();
                }
            }
        }
    }
};

Game_Player.prototype.checkEventTriggerTouchFront = function(d) {
    if (this.canStartLocalEvents()) {
        // トリガー  0: 決定ボタン 1: プレイヤーから接触 2: イベントから接触
        this.startMapEventFront(this._realX, this._realY, d, [1, 2], true);
    }
};

Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    // 一度起動した足元のイベントをすぐに起動しない
    if (this._disableHereEventPoint && (this.x === this._disableHereEventPoint.x && this.y === this._disableHereEventPoint.y)) {
        return;
    }
    this._disableHereEventPoint = null;
    if (this.canStartLocalEvents()) {
        this.startMapEvent(this._realX, this._realY, triggers, false);
    }
};

Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
        const direction = this.direction();
        this.startMapEventFront(this._realX, this._realY, this._direction, triggers, true);
        const currentPoint = { x: this._realX, y: this._realY };
        const nextPoint = DotMoveUtils.nextPointWithDirection(currentPoint, direction);
        const x2 = Math.round(nextPoint.x);
        const y2 = Math.round(nextPoint.y);
        if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
            this.startMapEventFront(nextPoint.x, nextPoint.y, this._direction, triggers, true);
        }
    }
};

// プレイヤーの場合は処理をしない
Game_Player.prototype.dotMoveToPlayer = function() {
};


const _Game_Event_initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function() {
    _Game_Event_initMembers.call(this);
};

Game_Event.prototype.makeMover = function() {
    return new EventMover(this);
};

Game_Event.prototype.checkEventTriggerTouchFront = function(d) {
    if (!$gameMap.isEventRunning()) {
        if (this._trigger === 2) {
            const result = this.mover().checkCharacterFront(this._realX, this._realY, d, $gamePlayer);
            const axis = this._direction === 8 || this._direction === 2 ? "x" : "y";
            if (result && result.getCollisionLength(axis) >= 0.5) {
                if (!this.isJumping() && this.isNormalPriority()) {
                    this.start();
                }
            }
        }
    }
};

Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
    if (!$gameMap.isEventRunning()) {
        if (this._trigger === 2) {
            const result = this.mover().checkCharacter(x, y, this._direction, $gamePlayer);
            const axis = this._direction === 8 || this._direction === 2 ? "x" : "y";
            if (result && result.getCollisionLength(axis) >= 0.5) {
                if (!this.isJumping() && this.isNormalPriority()) {
                    this.start();
                }
            }
        }
    }
};


const _Game_Follower_initMembers = Game_Follower.prototype.initMembers;
Game_Follower.prototype.initMembers = function() {
    _Game_Follower_initMembers.call(this);
    this._moveSpeed = 4;
};

if (Utils.RPGMAKER_NAME === "MV") {
    Game_Followers.prototype.data = function() {
        return this._data.clone();
    };
}

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
    // this.setMoveSpeed($gamePlayer.realMoveSpeed());
    this.setOpacity($gamePlayer.opacity());
    this.setBlendMode($gamePlayer.blendMode());
    this.setWalkAnime($gamePlayer.hasWalkAnime());
    this.setStepAnime($gamePlayer.hasStepAnime());
    this.setDirectionFix($gamePlayer.isDirectionFixed());
    this.setTransparent($gamePlayer.isTransparent());
};

Game_Follower.prototype.chaseCharacter = function(character) {
    const realFromPoint = { x: this._realX, y: this._realY };
    const realTargetPoint = { x: character._realX, y: character._realY };
    const deg = DotMoveUtils.calcDeg(realFromPoint, realTargetPoint);
    const far = DotMoveUtils.calcFar(realFromPoint, realTargetPoint);
    if (far >= 1) {
        if (far >= 4) {
            // 前のキャラとの距離が4以上離れている場合はすり抜けを行う
            this.setThrough(true);
        } else {
            this.setThrough(false);
        }
        this.mover().dotMoveByDeg(deg);
        this.setMoveSpeed(this.calcFollowerSpeed(far));
    }
};

Game_Follower.prototype.gatherCharacter = function(character) {
    const realFromPoint = { x: this._realX, y: this._realY };
    const realTargetPoint = { x: character._realX, y: character._realY };
    this.setThrough(true);
    const margin = DotMoveUtils.calcMargin(this.realMoveSpeed() - 2);
    if (DotMoveUtils.reachPoint(realFromPoint, realTargetPoint, margin)) {
        this._realX = character._realX;
        this._realY = character._realY;
        this._x = Math.round(this._realX);
        this._y = Math.round(this._realY);
        this.setThrough(false);
    } else {
        this.setMoveSpeed($gamePlayer.moveSpeed());
        const deg = DotMoveUtils.calcDeg(realFromPoint, realTargetPoint);
        this.mover().dotMoveByDeg(deg);
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
}

Game_Follower.prototype.isGathered = function() {
    return !this.isMoving() && this.pos($gamePlayer.x, $gamePlayer.y);
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

const _Game_Followers_areGathered = Game_Followers.prototype.areGathered;
Game_Followers.prototype.areGathered = function() {
    // 480フレーム経過してもgatherが終了しない場合、フリーズ回避のために強制的にgatherを終了する
    if (this._gatherCount >= 480) {
        this._gatherCount = 0;
        return true;
    }
    return _Game_Followers_areGathered.call(this);
};

// なるべくドット移動関連の変数をセーブデータに持たせないため、
// ムーバーはGame_Tempに保持する。
const _Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    this._movers = new Map();
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
}

})();
