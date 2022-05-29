/*:
@target MV MZ
@plugindesc Dot movement system v1.10.0
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem.js
@help
It is a plugin that allows you to move in dot units.

【How to use】
Basically, it can be used just by installing it, but more detailed control is possible by setting the following contents.

■ Setting of movement unit
In the move route script
this.setMoveUnit (Movement unit (decimal between 0 and 1));
By writing, you can specify the movement unit per step.
For example, to move an event half a step
this.setMoveUnit(0.5);
It is described as.

■ Move to any angle in dot units
In the move route script
this.dotMoveByDeg (angle (integer from 0 to 359));
By writing, you can move in the direction of the angle specified in dot units.

■ Move the event in the direction of the player in dot units
In the move route script
this.dotMoveToPlayer();
By writing, you can move the event in the direction of the player in dot units.

■ Move to the specified coordinates
In the move route script
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

Game_CharacterBase#moveByDirection(direction)
Moves in the direction of the character direction in the movement unit specified by setMoveUnit.

Game_CharacterBase#stopMove()
Stops the movement of the character.

Game_CharacterBase#resumeMove()
Resume the movement of the character.

Game_CharacterBase#cancelMove()
Cancels the movement of the character to a specific point by moveToTarget etc.

Game_CharacterBase#checkCharacter(character)
Checks if it collides with the character specified by the argument, and if it collides, returns a CollisionResult object.

Game_CharacterBase#checkHitCharacters(targetCharacterClass = null)
Checks for collisions with all characters and returns an array of CollisionResult objects.
If you specify a character class for targetCharacterClass,
Only the instance of the corresponding character class is subject to collision detection.

【License】
This plugin is available under the terms of the MIT license.
*/

/*:ja
@target MV MZ
@plugindesc ドット移動システム v1.10.0
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

Game_CharacterBase#moveByDirection(direction)
キャラクターdirectionの方向にsetMoveUnitで指定した移動単位で移動させます。

Game_CharacterBase#stopMove()
キャラクターの移動を停止します。

Game_CharacterBase#resumeMove()
キャラクターの移動を再開します。

Game_CharacterBase#cancelMove()
moveToTargetなどによって行われているキャラクターの特定地点への移動をキャンセルします。

Game_CharacterBase#checkCharacter(character)
引数で指定したcharacterと衝突しているかをチェックし、衝突していればCollisionResultオブジェクトを返します。

Game_CharacterBase#checkHitCharacters(targetCharacterClass = null)
全てのキャラクターと衝突しているかをチェックし、CollisionResultオブジェクトの配列を返します。
targetCharacterClassにキャラクタークラスを指定した場合は、
該当のキャラクタークラスのインスタンスのみ衝突判定の対象とします。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const DotMoveSystemPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

const DotMoveSystemClassAlias = (() => {
"use strict";

const DIAGONAL_COST = 1 / Math.sin(Math.PI / 4);
const MARGIN_UNIT = 65536;
const MOVED_MARGIN_UNIT = Math.sqrt(MARGIN_UNIT);

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
        const data = { note };
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


class AStarNode {
    get parent() { return this._parent; }
    set parent(_parent) { this._parent = _parent; }
    get x() { return this._x; }
    get y() { return this._y; }
    get f() { return this._f; }
    set f(_f) { this._f = _f; }
    get g() { return this._g; }
    set g(_g) { this._g = _g; }
    get closed() { return this._closed; }
    set closed(_closed) { this._closed = _closed; }

    constructor(...args) {
        this.initialize(...args);
    }

    initialize(parent, x, y, f, g, closed = false) {
        this._parent = parent;
        this._x = x;
        this._y = y;
        this._f = f;
        this._g = g;
        this._closed = closed;
    }
}


class AStarUtils {
    // 8方向A*経路探索を行い最適ノードと初期ノードを返す
    static computeRoute(character, startX, startY, goalX, goalY, searchLimit) {
        if (startX === goalX && startY === goalY) {
            return [null, null];
        }

        const openList = [];
        const nodes = {};

        const start = new AStarNode(null, startX, startY, $gameMap.distance(startX, startY, goalX, goalY), 0);
        const posStart = startY * $gameMap.width() + startX;
        openList.push(posStart);
        nodes[posStart] = start;
        let best = start;

        while (openList.length > 0) {
            let openListIdx1 = 0;
            if (openList.length > 1) {
                for (let i = 1; i < openList.length; i++) {
                    const nodeA = nodes[openList[i]];
                    const nodeB = nodes[openList[openListIdx1]];
                    if (nodeA.f < nodeB.f) openListIdx1 = i;
                }
            }

            const pos1 = openList[openListIdx1];
            const node1 = nodes[pos1];
            const x1 = node1.x;
            const y1 = node1.y;
            const g1 = node1.g;

            if (x1 === goalX && y1 === goalY) return [node1, start];

            if (node1.g >= searchLimit) return [best, start];

            node1.closed = true;
            openList.splice(openListIdx1, 1);

            for (let direction = 1; direction <= 9; direction++) {
                if (direction === 5) continue;

                const [horz, vert] = DotMoveUtils.direction2HorzAndVert(direction);
                const x2 = $gameMap.roundXWithDirection(x1, horz);
                const y2 = $gameMap.roundYWithDirection(y1, vert);
                const pos2 = y2 * $gameMap.width() + x2;
                let node2 = nodes[pos2];

                if (node2 && node2.closed) continue;

                let successPass = true;
                if (direction % 2 === 0) {
                    if (!character.canPass(x1, y1, direction)) {
                        successPass = false;
                    }
                } else {
                    if (!character.canPassDiagonally(x1, y1, horz, vert)) {
                        successPass = false;
                    }
                }
                if (!successPass) {
                    if (x2 === goalX && y2 === goalY) {
                        if (direction % 2 === 0) {
                            if (character.canPass(x1, y1, direction, { needCheckCharacters: false })) {
                                return [node1, start];
                            }
                        } else {
                            if (character.canPass(x1, y1, horz) || character.canPass(x1, y1, vert)) {
                                if (character.canPassDiagonally(x1, y1, horz, vert, { needCheckCharacters: false })) {
                                    return [node1, start];
                                }
                            }
                        }
                    }
                    continue;
                }

                const cost = direction % 2 === 0 ? 1 : DIAGONAL_COST;
                const g2 = g1 + cost;
                const f2 = g2 + $gameMap.distance(x2, y2, goalX, goalY);

                const openListIdx2 = openList.indexOf(pos2);
                if (openListIdx2 < 0) {
                    node2 = new AStarNode(node1, x2, y2, f2, g2);
                    nodes[pos2] = node2;
                    openList.push(pos2);
                } else if (f2 < node2.f) {
                    node2.f = f2;
                    node2.g = g2;
                    node2.parent = node1;
                    openList.splice(openListIdx2, 1);
                    openList.push(pos2);
                }

                if (node2.f - node2.g < best.f - best.g) best = node2;
            }
        }

        return [best, start];
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

    static isFloatLt(left, right, margin = 1.0 / MARGIN_UNIT) {
        if (left <= right - margin) return true;
        if (left <= right + margin) return true;
        return false;
    }

    static isFloatGt(left, right, margin = 1.0 / MARGIN_UNIT) {
        if (left >= right - margin) return true;
        if (left >= right + margin) return true;
        return false;
    }

    static calcDistance(deg, dpf) {
        const rad = this.deg2rad(deg);
        let disX = dpf * Math.cos(rad);
        let disY = dpf * Math.sin(rad);
        disX = Math.round(disX * MARGIN_UNIT) / MARGIN_UNIT;
        disY = Math.round(disY * MARGIN_UNIT) / MARGIN_UNIT;
        return new Point(disX, disY);
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
        return new Point(x, y);
    }

    static prevPointWithDirection(point, direction, unit = 1) {
        let x = point.x;
        let y = point.y;
        const [xSign, ySign] = this.direction2XYSign(direction);
        x -= xSign * unit;
        y -= ySign * unit;
        x = $gameMap.roundX(x);
        y = $gameMap.roundY(y);
        return new Point(x, y);
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

    static horzAndVert2Direction(horz, vert) {
        if (vert === 8 && horz === 6) {
            return 9;
        } else if (vert === 2 && horz === 6) {
            return 3;
        } else if (vert === 2 && horz === 4) {
            return 1;
        } else if (vert === 8 && horz === 4) {
            return 7;
        }
        return 0;
    }

    static checkCollidedRect(rect1, rect2, collisionObjectType, collisionObject) {
        if (DotMoveUtils.isCollidedRect(rect1, rect2)) {
            const result = new CollisionResult(rect1, rect2, collisionObjectType, collisionObject);
            if (result.collisionLengthX() > 0 && result.collisionLengthY() > 0) return result;
        }
        return null;
    }

    static isCollidedRect(rect1, rect2) {
        if ((rect1.x > rect2.x && rect1.x < (rect2.x + rect2.width) || (rect1.x + rect1.width) > rect2.x && (rect1.x + rect1.width) < rect2.x + rect2.width || rect2.x >= rect1.x && (rect2.x + rect2.width) <= (rect1.x + rect1.width)) &&
            (rect1.y > rect2.y && rect1.y < (rect2.y + rect2.height) || (rect1.y + rect1.height) > rect2.y && (rect1.y + rect1.height) < rect2.y + rect2.height || rect2.y >= rect1.y && (rect2.y + rect2.height) <= (rect1.y + rect1.height))) {
                return true;
        }
        return false;
    }

    static mapCharactersCacheMasses(x, y, width, height) {
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
}


// バージョンIDが同じ場合、Game_Map#setupはコールされないため、マップ遷移時の初期化処理はここで実施する
const _Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    // マップ遷移時に全てのムーバーをクリアする(メモリリーク対策)
    $gameTemp.clearMovers();
    // マップ遷移時にマップのイベント配置の初期設定を行う
    $gameMap.initAllMapCharactersCache();
    // マップ遷移時にプレイヤーと既に衝突しているイベントは起動対象外にする
    $gamePlayer.initCollideTriggerEventIds();
};


Game_Map.prototype.initAllMapCharactersCache = function() {
    // ループ時を考慮して実際のマップサイズ+1の幅の領域を確保する
    $gameTemp.setupMapCharactersCache(this.width() + 1, this.height() + 1);
    $gamePlayer.mover().initMapCharactersCache();
    $gameMap.boat().mover().initMapCharactersCache();
    $gameMap.ship().mover().initMapCharactersCache();
    $gameMap.airship().mover().initMapCharactersCache();
    for (const event of this.events()) {
        event.mover().initMapCharactersCache();
    }
    for (const follower of $gamePlayer.followers().data()) {
        follower.mover().initMapCharactersCache();
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
        return (xDis - yDis) + yDis * DIAGONAL_COST;
    } else {
        return (yDis - xDis) + xDis * DIAGONAL_COST;
    }
};


class CollisionResult {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize(targetRect, collisionRect, collisionObjectType, collisionObject) {
        this._targetRect = targetRect;
        this._collisionRect = collisionRect;
        this._collisionObjectType = collisionObjectType;
        this._collisionObject = collisionObject;
        const margin = 1.0 / MARGIN_UNIT;
        const rightCollisionLength = this.calcRightCollisionLength();
        const leftCollisionLength = this.calcLeftCollisionLength();
        const upCollisionLength = this.calcUpCollisionLength();
        const downCollisionLength = this.calcDownCollisionLength();
        this._rightCollisionLength = rightCollisionLength < margin ? 0 : rightCollisionLength;
        this._leftCollisionLength = leftCollisionLength < margin ? 0 : leftCollisionLength;
        this._upCollisionLength = upCollisionLength < margin ? 0 : upCollisionLength;
        this._downCollisionLength = downCollisionLength < margin ? 0 : downCollisionLength;
    }

    get targetRect() { return this._targetRect; }
    get collisionRect() { return this._collisionRect; }
    get collisionObjectType() { return this._collisionObjectType; }
    get collisionObject() { return this._collisionObject; }

    getCollisionLength(axis) {
        if (axis === "x") {
            return this.collisionLengthX();
        } else {
            return this.collisionLengthY();
        }
    }

    getCollisionLengthByDirection(dir) {
        switch (dir) {
        case 8:
            return this.upCollisionLength();
        case 6:
            return this.rightCollisionLength();
        case 2:
            return this.downCollisionLength();
        case 4:
            return this.leftCollisionLength();
        }
    }

    collisionLengthX() {
        const leftCollisionLength = this.leftCollisionLength();
        const rightCollisionLength = this.rightCollisionLength();
        if (leftCollisionLength < rightCollisionLength) {
            return leftCollisionLength;
        } else {
            return rightCollisionLength;
        }
    }

    collisionLengthY() {
        const upCollisionLength = this.upCollisionLength();
        const downCollisionLength = this.downCollisionLength();
        if (upCollisionLength < downCollisionLength) {
            return upCollisionLength;
        } else {
            return downCollisionLength;
        }
    }

    upCollisionLength() {
        return this._upCollisionLength;
    }

    rightCollisionLength() {
        return this._rightCollisionLength;
    }

    downCollisionLength() {
        return this._downCollisionLength;
    }

    leftCollisionLength() {
        return this._leftCollisionLength;
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

    calcUpCollisionLength() {
        if (this._targetRect.y < this._collisionRect.y + this._collisionRect.height) {
            return this._targetRect.y + this._targetRect.height - this._collisionRect.y;
        } else {
            return this._targetRect.height;
        }
    }

    calcRightCollisionLength() {
        if (this._collisionRect.x + this._collisionRect.width < this._targetRect.x + this._targetRect.width) {
            return this._collisionRect.x + this._collisionRect.width - this._targetRect.x;
        } else {
            return this._targetRect.width;
        }
    }

    calcDownCollisionLength() {
        if (this._collisionRect.y + this._collisionRect.height < this._targetRect.y + this._targetRect.height) {
            return this._collisionRect.y + this._collisionRect.height - this._targetRect.y;
        } else {
            return this._targetRect.height;
        }
    }

    calcLeftCollisionLength() {
        if (this._targetRect.x < this._collisionRect.x + this._collisionRect.width) {
            return this._targetRect.x + this._targetRect.width - this._collisionRect.x;
        } else {
            return this._targetRect.width;
        }
    }
}


class MapCharactersCache {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize(width, height) {
        this._cache = new Array(width * height);
    }

    massCharacters(mass) {
        if (this._cache[mass] == null) return [];
        return this._cache[mass];
    }

    addMapCharactersCache(mass, character) {
        if (this._cache[mass] == null) this._cache[mass] = [];
        if (!this._cache[mass].includes(character)) {
            this._cache[mass].push(character);
        }
    }

    removeMapCharactersCache(mass, character) {
        if (this._cache[mass] != null) {
            this._cache[mass] = this._cache[mass].filter(chr => chr !== character);
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
        // マップイベントのキャッシュ更新用に移動前の座標と変更前のサイズを保持する
        const point = character.positionPoint();
        this._lastRect = new Rectangle(point.x, point.y, 1, 1);
    }

    checkCollision(x, y, d) {
        let collisionResults = [];
        collisionResults.push(...this.checkCollisionMasses(x, y, d));
        // マップの範囲有効判定をマスの衝突確認で実施する必要があるため
        // すり抜けを行う場合このタイミングでreturnする
        if (this._character.isThrough() || this._character.isDebugThrough()) return collisionResults;
        collisionResults.push(...this.checkCollisionCharacters(x, y, d));
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

    checkCollisionMasses(x, y, d) {
        let collisionResults = [];
        const targetRect = new Rectangle(x, y, this._character.width(), this._character.height());

        const x1 = Math.floor(x);
        const x2 = Math.ceil(x + this._character.width()) - 1;
        const y1 = Math.floor(y);
        const y2 = Math.ceil(y + this._character.height()) - 1;

        for (let ix = x1; ix <= x2; ix++) {
            for (let iy = y1; iy <= y2; iy++) {
                collisionResults.push(...this.checkCollisionMass(targetRect, d, ix, iy));
            }
        }

        if (collisionResults.length > 0) return collisionResults;
        const cliffCollisionResult = this.checkCollisionCliff(targetRect, x1, y1, x2, y2, d);
        collisionResults.push(...cliffCollisionResult);

        return collisionResults;
    }

    checkCollisionMass(targetRect, d, ix, iy) {
        const massRect = new Rectangle(ix, iy, 1, 1);
        if (!this.checkPassMass(ix, iy, d)) {
            const point = this._character.positionPoint();
            const result = this.checkCollidedRectOverComplement(point.x, point.y, d, targetRect, massRect, "mass", null);
            if (result) return [result];
        }
        return [];
    }

    checkCollisionCliff(targetRect, x1, y1, x2, y2, d) {
        switch (d) {
        case 8:
            return this.checkCollisionXCliff(targetRect, x1, x2, y1, d);
        case 6:
            return this.checkCollisionYCliff(targetRect, y1, y2, x2, d);
        case 2:
            return this.checkCollisionXCliff(targetRect, x1, x2, y2, d);
        case 4:
            return this.checkCollisionYCliff(targetRect, y1, y2, x1, d);
        }
        return [];
    }

    checkCollisionXCliff(targetRect, x1, x2, iy, d) {
        if (x1 === x2) return [];
        const results = [];
        for (let ix = x1; ix < x2; ix++) {
            if (!this.checkPassMass(ix, iy, 4) && !this.checkPassMass(ix + 1, iy, 6)) {
                const point = this._character.positionPoint();
                const massRect1 = new Rectangle(ix, iy, 1, 1);
                const massRect2 = new Rectangle(ix + 1, iy, 1, 1);
                const result1 = this.checkCollidedRectOverComplement(point.x, point.y, d, targetRect, massRect1, "mass", null);
                const result2 = this.checkCollidedRectOverComplement(point.x, point.y, d, targetRect, massRect2, "mass", null);
                if (result1 && result2) {
                    if (result1.collisionLengthX() > result2.collisionLengthX()) {
                        results.push(result2);
                    } else {
                        results.push(result1);
                    }
                }
            }
        }
        return results;
    }

    checkCollisionYCliff(targetRect, y1, y2, ix, d) {
        if (y1 === y2) return [];
        const results = [];
        for (let iy = y1; iy < y2; iy++) {
            if (!this.checkPassMass(ix, iy, 8) && !this.checkPassMass(ix, iy + 1, 2)) {
                const point = this._character.positionPoint();
                const massRect1 = new Rectangle(ix, iy, 1, 1);
                const massRect2 = new Rectangle(ix, iy + 1, 1, 1);
                const result1 = this.checkCollidedRectOverComplement(point.x, point.y, d, targetRect, massRect1, "mass", null);
                const result2 = this.checkCollidedRectOverComplement(point.x, point.y, d, targetRect, massRect2, "mass", null);
                if (result1 && result2) {
                    if (result1.collisionLengthY() > result2.collisionLengthY()) {
                        results.push(result2);
                    } else {
                        results.push(result1);
                    }
                }
            }
        }
        return results;
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
        const prevPoint = DotMoveUtils.prevPointWithDirection(new Point(x2, y2), d);
        if (!this._character.isMapPassable(prevPoint.x, prevPoint.y, d)) {
            return false;
        }
        return true;
    }

    // キャラクターの位置が小数の場合、逆方向のマスの通行判定が正しく取得できないため、衝突判定対象外とする
    isMassCollisionNoTarget(x, y, d) {
        const point = this._character.positionPoint();
        switch (d) {
        case 8:
            if (point.y + this._character.height() <= y + 1) {
                return true;
            }
            break;
        case 6:
            if (point.x >= x) {
                return true;
            }
            break;
        case 2:
            if (point.y >= y) {
                return true;
            }
            break;
        case 4:
            if (point.x + this._character.width() <= x + 1) {
                return true;
            }
            break;
        }
        return false;
    }

    checkHitCharacters(x, y, d, targetCharacterClass = null) {
        const collisionResults = [];
        for (const character of this.enteringMassesCharacters(x, y, targetCharacterClass)) {
            const result = this.checkCharacter(x, y, d, character, { overComplementMode: true });
            if (result) collisionResults.push(result);
        }
        return collisionResults;
    }

    checkPlayer(x, y, d) {
        const collisionResults = [];
        for (const player of this.enteringMassesCharacters(x, y, Game_Player)) {
            if (!player.isThrough()) {
                const result = this.checkCharacter(x, y, d, player, { overComplementMode: true });
                if (result) collisionResults.push(result);
            }
        }
        return collisionResults;
    }

    checkFollowers(x, y, d) {
        const collisionResults = [];
        for (const follower of this.enteringMassesCharacters(x, y, Game_Follower)) {
            if (!follower.isThrough()) {
                const result = this.checkCharacter(x, y, d, follower, { overComplementMode: true });
                if (result) collisionResults.push(result);
            }
        }
        return collisionResults;
    }

    checkEvents(x, y, d, notCollisionEventIds = []) {
        const collisionResults = [];
        for (const event of this.enteringMassesCharacters(x, y, Game_Event)) {
            if (event.isNormalPriority() && !event.isThrough() && !notCollisionEventIds.includes(event.eventId())) {
                const result = this.checkCharacter(x, y, d, event, { overComplementMode: true });
                if (result) collisionResults.push(result);
            }
        }
        return collisionResults;
    }

    checkVehicles(x, y, d) {
        const collisionResults = [];
        const boat = $gameMap.boat();
        const ship = $gameMap.ship();
        for (const vehicle of this.enteringMassesCharacters(x, y, Game_Vehicle)) {
            if (vehicle === boat) {
                if (boat._mapId === $gameMap.mapId() && !$gamePlayer.isInBoat() && !boat.isThrough()) {
                    const result = this.checkCharacter(x, y, d, boat, { overComplementMode: true });
                    if (result) collisionResults.push(result);
                }
            } else if (vehicle === ship) {
                if (ship._mapId === $gameMap.mapId() && !$gamePlayer.isInShip() && !ship.isThrough()) {
                    const result = this.checkCharacter(x, y, d, ship, { overComplementMode: true });
                    if (result) collisionResults.push(result);
                }
            }
        }
        return collisionResults;
    }

    enteringMassesCharacters(x, y, targetCharacterClass = null) {
        const characters = [];
        const masses = DotMoveUtils.mapCharactersCacheMasses(x, y, this._character.width(), this._character.height());
        const mapCharactersCache = $gameTemp.mapCharactersCache();
        for (const massIdx of masses) {
            const massCharacters = mapCharactersCache.massCharacters(massIdx);
            for (const character of massCharacters) {
                if (this._character === character) continue;
                if (targetCharacterClass && !(character instanceof targetCharacterClass)) continue;
                if (!characters.includes(character)) characters.push(character);
            }
        }
        return characters;
    }

    checkCharacter(x, y, d, character, opt = { origX: null, origY: null, overComplementMode: false }) {
        const realPoint = this._character.positionPoint();
        let origX = opt.origX == null ? realPoint.x : opt.origX;
        let origY = opt.origY == null ? realPoint.y : opt.origY;
        const overComplementMode = opt.overComplementMode == null ? false : opt.overComplementMode;

        const characterRealPoint = character.positionPoint();
        let cx = this.isCharacterRealPosMode() ? characterRealPoint.x : character.x;
        let cy = this.isCharacterRealPosMode() ? characterRealPoint.y : character.y;

        if ($gameMap.isLoopHorizontal()) {
            if (cx < this._character.width() && x >= $gameMap.width() - this._character.width()) {
                cx += $gameMap.width();
            } else if (cx >= $gameMap.width() - character.width() && x < character.width()) {
                x += $gameMap.width();
                origX += $gameMap.width();
            }
        }
        if ($gameMap.isLoopVertical()) {
            if (cy < this._character.height() && y >= $gameMap.height() - this._character.height()) {
                cy += $gameMap.height();
            } else if (cy >= $gameMap.height() - character.height() && y < character.height()) {
                y += $gameMap.height();
                origY += $gameMap.height();
            }
        }

        const targetRect = new Rectangle(x, y, this._character.width(), this._character.height());
        const characterRect = new Rectangle(cx, cy, character.width(), character.height());
        if (overComplementMode) {
            return this.checkCollidedRectOverComplement(origX, origY, d, targetRect, characterRect, "character", character);
        } else {
            return DotMoveUtils.checkCollidedRect(targetRect, characterRect, "character", character);
        }
    }

    checkCollidedRectOverComplement(origX, origY, d, targetRect, collisionRect, collisionObjectType, collisionObject) {
        targetRect = new Rectangle(targetRect.x, targetRect.y, targetRect.width, targetRect.height);
        collisionRect = new Rectangle(collisionRect.x, collisionRect.y, collisionRect.width, collisionRect.height);
        switch (d) {
        case 8:
            if (DotMoveUtils.isFloatGt(origY, collisionRect.y + collisionRect.height) && targetRect.y < collisionRect.y) {
                collisionRect.height += collisionRect.y - targetRect.y;
                collisionRect.y = targetRect.y;
            }
            if (DotMoveUtils.isFloatGt(origY, collisionRect.y + collisionRect.height) && targetRect.y + targetRect.height < collisionRect.y + collisionRect.height) {
                targetRect.height += (collisionRect.y + collisionRect.height) - (targetRect.y + targetRect.height);
            }
            break;
        case 6:
            if (DotMoveUtils.isFloatLt(origX + targetRect.width, collisionRect.x) && targetRect.x + targetRect.width > collisionRect.x + collisionRect.width) {
                collisionRect.width += (targetRect.x + targetRect.width) - (collisionRect.x + collisionRect.width);
            }
            if (DotMoveUtils.isFloatLt(origX + targetRect.width, collisionRect.x) && targetRect.x > collisionRect.x) {
                targetRect.width += targetRect.x - collisionRect.x;
                targetRect.x = collisionRect.x;
            }
            break;
        case 2:
            if (DotMoveUtils.isFloatLt(origY + targetRect.height, collisionRect.y) && targetRect.y + targetRect.height > collisionRect.y + collisionRect.height) {
                collisionRect.height += (targetRect.y + targetRect.height) - (collisionRect.y + collisionRect.height);
            }
            if (DotMoveUtils.isFloatLt(origY + targetRect.height, collisionRect.y) && targetRect.y > collisionRect.y) {
                targetRect.height += targetRect.y - collisionRect.y;
                targetRect.y = collisionRect.y;
            }
            break;
        case 4:
            if (DotMoveUtils.isFloatGt(origX, collisionRect.x + collisionRect.width) && targetRect.x < collisionRect.x) {
                collisionRect.width += collisionRect.x - targetRect.x;
                collisionRect.x = targetRect.x;
            }
            if (DotMoveUtils.isFloatGt(origX, collisionRect.x + collisionRect.width) && targetRect.x + targetRect.width < collisionRect.x + collisionRect.width) {
                targetRect.width += (collisionRect.x + collisionRect.width) - (targetRect.x + targetRect.width);
            }
            break;
        }
        return DotMoveUtils.checkCollidedRect(targetRect, collisionRect, collisionObjectType, collisionObject);
    }

    initMapCharactersCache() {
        const rect = this._character.collisionRect();
        const masses = DotMoveUtils.mapCharactersCacheMasses(rect.x, rect.y, rect.width, rect.height);
        const mapCharactersCache = $gameTemp.mapCharactersCache();
        for (const mass of masses) {
            mapCharactersCache.addMapCharactersCache(mass, this._character);
        }
    }

    updateMapCharactersCache() {
        const rect = this._character.collisionRect();
        const mapCharactersCache = $gameTemp.mapCharactersCache();
        if (this._lastRect.x !== rect.x || this._lastRect.y !== rect.y || this._lastRect.width !== rect.width || this._lastRect.height !== rect.height) {
            const beforeMasses = DotMoveUtils.mapCharactersCacheMasses(this._lastRect.x, this._lastRect.y, this._lastRect.width, this._lastRect.height);
            const afterMasses = DotMoveUtils.mapCharactersCacheMasses(rect.x, rect.y, rect.width, rect.height);
            for (const afterMass of afterMasses) {
                if (!beforeMasses.includes(afterMass)) {
                    mapCharactersCache.addMapCharactersCache(afterMass, this._character);
                }
            }
            for (const beforeMass of beforeMasses) {
                if (!afterMasses.includes(beforeMass)) {
                    mapCharactersCache.removeMapCharactersCache(beforeMass, this._character);
                }
            }
            this._lastRect = rect;
        }
    }
}


class PlayerCollisionChecker extends CharacterCollisionChecker {
    checkCollisionCharacters(x, y, d) {
        let collisionResults = [];
        collisionResults.push(...this.checkEvents(x, y, d));
        collisionResults.push(...this.checkVehicles(x, y, d));
        return collisionResults;
    }
}


class EventCollisionChecker extends CharacterCollisionChecker {
    checkCollisionCharacters(x, y, d) {
        let collisionResults = [];
        collisionResults.push(...this.checkPlayer(x, y, d));
        if ($gamePlayer.followers().isVisible()) collisionResults.push(...this.checkFollowers(x, y, d));
        collisionResults.push(...this.checkEvents(x, y, d));
        collisionResults.push(...this.checkVehicles(x, y, d));
        return collisionResults;
    }

    checkPlayer(x, y, d) {
        if (!this._character.isNormalPriority()) return [];
        return super.checkPlayer(x, y, d);
    }

    checkFollowers(x, y, d) {
        if (!this._character.isNormalPriority()) return [];
        return super.checkFollowers(x, y, d);
    }
}


class FollowerCollisionChecker extends CharacterCollisionChecker {
    checkCollisionCharacters(x, y, d) {
        let collisionResults = [];
        collisionResults.push(...this.checkEvents(x, y, d));
        collisionResults.push(...this.checkVehicles(x, y, d));
        return collisionResults;
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
        const realPoint = this._character.positionPoint();
        const margin = this._character.distancePerFrame() / MOVED_MARGIN_UNIT;
        let moved = true;
        if (this.reachPoint(realPoint, movedPoint, margin)) moved = false;
        movedPoint.x = $gameMap.roundX(movedPoint.x);
        movedPoint.y = $gameMap.roundY(movedPoint.y);
        this._character.setPositionPoint(movedPoint);
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

    checkHitCharacters(x, y, direction, targetCharacterClass = null) {
        return this._collisionChecker.checkHitCharacters(x, y, direction, targetCharacterClass);
    }

    checkHitCharactersStepDir(x, y, direction, targetCharacterClass = null) {
        const deg = DotMoveUtils.direction2deg(direction);
        const dis = this.calcDistance(deg);
        const x2 = x + dis.x;
        const y2 = y + dis.y;
        return this._collisionChecker.checkHitCharacters(x2, y2, direction, targetCharacterClass);
    }

    checkEvents(x, y, d, isCharacterRealPos = true) {
        this._collisionChecker.setCharacterRealPosMode(isCharacterRealPos);
        const collisionResults = this._collisionChecker.checkEvents(x, y, d);
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
        const collisionResults = this.checkCollision(target.x, target.y + dis.y, 8);
        if (this.canSlide(collisionResults, 4)) {
            return this.calcLeftUpWithSlide(dis);
        } else if (this.canSlide(collisionResults, 6)) {
            return this.calcUpRightWithSlide(dis);
        }
        if (dis.x < 0) {
            return this.calcLeftUpWithoutSlide(dis);
        } else {
            return this.calcUpRightWithoutSlide(dis);
        }
    }

    calcRight(dis) {
        const target = this._character.collisionRect();
        const collisionResults = this.checkCollision(target.x + dis.x, target.y, 6);
        if (this.canSlide(collisionResults, 8)) {
            return this.calcUpRightWithSlide(dis);
        } else if (this.canSlide(collisionResults, 2)) {
            return this.calcRightDownWithSlide(dis);
        }
        if (dis.y < 0) {
            return this.calcUpRightWithoutSlide(dis);
        } else {
            return this.calcRightDownWithoutSlide(dis);
        }
    }

    calcDown(dis) {
        const target = this._character.collisionRect();
        const collisionResults = this.checkCollision(target.x, target.y + dis.y, 2);
        if (this.canSlide(collisionResults, 4)) {
            return this.calcDownLeftWithSlide(dis);
        } else if (this.canSlide(collisionResults, 6)) {
            return this.calcRightDownWithSlide(dis);
        }
        if (dis.x < 0) {
            return this.calcDownLeftWithoutSlide(dis);
        } else {
            return this.calcRightDownWithoutSlide(dis);
        }
    }

    calcLeft(dis) {
        const target = this._character.collisionRect();
        const collisionResults = this.checkCollision(target.x + dis.x, target.y, 4);
        if (this.canSlide(collisionResults, 8)) {
            return this.calcLeftUpWithSlide(dis);
        } else if (this.canSlide(collisionResults, 2)) {
            return this.calcDownLeftWithSlide(dis);
        }
        if (dis.y < 0) {
            return this.calcLeftUpWithoutSlide(dis);
        } else {
            return this.calcDownLeftWithoutSlide(dis);
        }
    }

    calcUpRight(dis) {
        return this.calcUpRightWithSlide(dis, this.needDiagonalSlideX(), this.needDiagonalSlideY());
    }

    calcRightDown(dis) {
        return this.calcRightDownWithSlide(dis, this.needDiagonalSlideX(), this.needDiagonalSlideY());
    }

    calcDownLeft(dis) {
        return this.calcDownLeftWithSlide(dis, this.needDiagonalSlideX(), this.needDiagonalSlideY());
    }

    calcLeftUp(dis) {
        return this.calcLeftUpWithSlide(dis, this.needDiagonalSlideX(), this.needDiagonalSlideY());
    }

    calcUpRightWithSlide(dis, enableSlideX = true, enableSlideY = true) {
        if (enableSlideX) {
            const target = this._character.collisionRect();
            const collisionResults1 = this.checkCollision(target.x, target.y + dis.y, 8);
            if (this.canSlide(collisionResults1, 6)) {
                dis = this.slideDistance(dis, target, collisionResults1, 45, "x", 6);
                const slidedTarget = new Point(target.x + dis.x, target.y);
                dis = this.correctUpDistance(slidedTarget, dis);
                return new Point(target.x + dis.x, target.y + dis.y);
            }
        }

        if (enableSlideY) {
            const target = this._character.collisionRect();
            const collisionResults2 = this.checkCollision(target.x + dis.x, target.y, 6);
            if (this.canSlide(collisionResults2, 8)) {
                dis = this.slideDistance(dis, target, collisionResults2, 45, "y", 8);
                const slidedTarget = new Point(target.x, target.y + dis.y);
                dis = this.correctRightDistance(slidedTarget, dis);
                return new Point(target.x + dis.x, target.y + dis.y);
            }
        }

        return this.calcUpRightWithoutSlide(dis);
    }

    calcRightDownWithSlide(dis, enableSlideX = true, enableSlideY = true) {
        if (enableSlideY) {
            const target = this._character.collisionRect();
            const collisionResults1 = this.checkCollision(target.x + dis.x, target.y, 6);
            if (this.canSlide(collisionResults1, 2)) {
                dis = this.slideDistance(dis, target, collisionResults1, 135, "y", 2);
                const slidedTarget = new Point(target.x, target.y + dis.y);
                dis = this.correctRightDistance(slidedTarget, dis);
                return new Point(target.x + dis.x, target.y + dis.y);
            }
        }

        if (enableSlideX) {
            const target = this._character.collisionRect();
            const collisionResults2 = this.checkCollision(target.x, target.y + dis.y, 2);
            if (this.canSlide(collisionResults2, 6)) {
                dis = this.slideDistance(dis, target, collisionResults2, 135, "x", 6);
                const slidedTarget = new Point(target.x + dis.x, target.y);
                dis = this.correctDownDistance(slidedTarget, dis);
                return new Point(target.x + dis.x, target.y + dis.y);
            }
        }

        return this.calcRightDownWithoutSlide(dis);
    }

    calcDownLeftWithSlide(dis, enableSlideX = true, enableSlideY = true) {
        if (enableSlideY) {
            const target = this._character.collisionRect();
            const collisionResults1 = this.checkCollision(target.x + dis.x, target.y, 4);
            if (this.canSlide(collisionResults1, 2)) {
                dis = this.slideDistance(dis, target, collisionResults1, 225, "y", 2);
                const slidedTarget = new Point(target.x, target.y + dis.y);
                dis = this.correctLeftDistance(slidedTarget, dis);
                return new Point(target.x + dis.x, target.y + dis.y);
            }
        }

        if (enableSlideX) {
            const target = this._character.collisionRect();
            const collisionResults2 = this.checkCollision(target.x, target.y + dis.y, 2);
            if (this.canSlide(collisionResults2, 4)) {
                dis = this.slideDistance(dis, target, collisionResults2, 225, "x", 4);
                const slidedTarget = new Point(target.x + dis.x, target.y);
                dis = this.correctDownDistance(slidedTarget, dis);
                return new Point(target.x + dis.x, target.y + dis.y);
            }
        }

        return this.calcDownLeftWithoutSlide(dis);
    }

    calcLeftUpWithSlide(dis, enableSlideX = true, enableSlideY = true) {
        if (enableSlideY) {
            const target = this._character.collisionRect();
            const collisionResults1 = this.checkCollision(target.x + dis.x, target.y, 4);
            if (this.canSlide(collisionResults1, 8)) {
                dis = this.slideDistance(dis, target, collisionResults1, 315, "y", 8);
                const slidedTarget = new Point(target.x, target.y + dis.y);
                dis = this.correctLeftDistance(slidedTarget, dis);
                return new Point(target.x + dis.x, target.y + dis.y);
            }
        }

        if (enableSlideX) {
            const target = this._character.collisionRect();
            const collisionResults2 = this.checkCollision(target.x, target.y + dis.y, 8);
            if (this.canSlide(collisionResults2, 4)) {
                dis = this.slideDistance(dis, target, collisionResults2, 315, "x", 4);
                const slidedTarget = new Point(target.x + dis.x, target.y);
                dis = this.correctUpDistance(slidedTarget, dis);
                return new Point(target.x + dis.x, target.y + dis.y);
            }
        }

        return this.calcLeftUpWithoutSlide(dis);
    }

    calcUpRightWithoutSlide(dis) {
        const target = this._character.collisionRect();
        dis = this.correctUpDistance(target, dis);
        target.y += dis.y;
        dis = this.correctRightDistance(target, dis);
        target.x += dis.x;
        return new Point(target.x, target.y);
    }

    calcRightDownWithoutSlide(dis) {
        const target = this._character.collisionRect();
        dis = this.correctRightDistance(target, dis);
        target.x += dis.x;
        dis = this.correctDownDistance(target, dis);
        target.y += dis.y;
        return new Point(target.x, target.y);
    }

    calcDownLeftWithoutSlide(dis) {
        const target = this._character.collisionRect();
        dis = this.correctDownDistance(target, dis);
        target.y += dis.y;
        dis = this.correctLeftDistance(target, dis);
        target.x += dis.x;
        return new Point(target.x, target.y);
    }

    calcLeftUpWithoutSlide(dis) {
        const target = this._character.collisionRect();
        dis = this.correctLeftDistance(target, dis);
        target.x += dis.x;
        dis = this.correctUpDistance(target, dis);
        target.y += dis.y;
        return new Point(target.x, target.y);
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
        const correctedDistance = new Point(distance.x, distance.y);
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
        // 距離を戻すため、逆方向の衝突幅を取得する。
        const dir2 = this._character.reverseDir(dir);
        const len = this.getMaxCollisionLength(collisionResults, dir2);
        // 衝突距離が移動距離より長い場合、移動距離分だけ移動させる
        if (len <= Math.abs(distance[axis])) {
            const sign = dir === 8 || dir === 4 ? 1 : -1;
            correctedDistance[axis] += len * sign;
        } else {
            correctedDistance[axis] -= distance[axis];
        }
        return correctedDistance;
    }

    getMaxCollisionLength(collisionResults, dir) {
        const lens = collisionResults.map(result => result.getCollisionLengthByDirection(dir));
        return Math.max(...lens);
    }

    // 衝突距離がキャラの移動距離以上であれば移動距離分スライドを行う
    // 衝突距離がキャラの移動距離未満であれば衝突距離分スライドを行う
    slideDistance(dis, target, collisionResults, deg, axis, dir4) {
        const newDis = new Point(dis.x, dis.y);
        const len = collisionResults[0].getCollisionLengthByDirection(dir4);
        const diagDis = this.calcDistance(deg);
        if (len < Math.abs(diagDis[axis])) {
            newDis[axis] = diagDis[axis] < 0 ? -len : len;
        } else if (len <= this.getSlideLength(axis)) {
            newDis[axis] = diagDis[axis];
        } else {
            return newDis;
        }
        return this.correctDistance(target, newDis, dir4);
    }

    canSlide(collisionResults, dir) {
        if (collisionResults.length === 0) return false;
        const collisionLength = Math.max(...collisionResults.map(result => result.getCollisionLengthByDirection(dir)));
        const axis = this._direction === 8 || this._direction === 2 ? "y" : "x";
        if (collisionLength <= this.getSlideLength(axis)) {
            return true;
        }
        return false;
    }

    needDiagonalSlideX() {
        return false;
    }

    needDiagonalSlideY() {
        return false;
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

    initMapCharactersCache() {
        this._collisionChecker.initMapCharactersCache();
    }

    updateMapCharactersCache() {
        this._collisionChecker.updateMapCharactersCache();
    }
}


class PlayerController extends CharacterController {
    initialize(character) {
        super.initialize(character, new PlayerCollisionChecker(character));
    }

    needDiagonalSlideX() {
        if (this._character.width() === 1) {
            return true;
        }
        return false;
    }

    needDiagonalSlideY() {
        if (this._character.height() === 1) {
            return true;
        }
        return false;
    }
}


class EventController extends CharacterController {
    initialize(character) {
        super.initialize(character, new EventCollisionChecker(character));
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

    needDiagonalSlideX() {
        if (this._character.width() === 1) {
            return true;
        }
        return true;
    }

    needDiagonalSlideY() {
        if (this._character.height() === 1) {
            return true;
        }
        return false;
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
            if (!this.isMoved()) this.moveProcess();
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
        this._controller.updateMapCharactersCache();
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

    stopMove() {
        this._moverData.stopping = true;
    }

    resumeMove() {
        this._moverData.stopping = false;
    }

    cancelMove() {
        this._moverData.targetCount = 0;
    }

    checkCollision(x, y, direction) {
        return this._controller.checkCollision(x, y, direction);
    }

    checkCharacter(x, y, direction, character) {
        return this._controller.checkCharacter(x, y, direction, character);
    }

    checkCharacterStepDir(x, y, direction, character) {
        return this._controller.checkCharacterStepDir(x, y, direction, character);
    }

    checkHitCharacters(x, y, direction, targetCharacterClass = null) {
        return this._controller.checkHitCharacters(x, y, direction, targetCharacterClass);
    }

    checkHitCharactersStepDir(x, y, direction, targetCharacterClass = null) {
        return this._controller.checkHitCharactersStepDir(x, y, direction, targetCharacterClass);
    }

    isCollidedWithEvents(x, y, d) {
        const collisionResults = this._controller.checkEvents(x, y, d, false);
        for (const result of collisionResults) {
            if (result.collisionLengthX() >= this._character.minTouchWidth() || result.collisionLengthY() >= this._character.minTouchHeight()) {
                return true;
            }
        }
        return false;
    }

    isCollidedWithVehicles(x, y, d) {
        const collisionResults = this._controller.checkVehicles(x, y, d, false);
        for (const result of collisionResults) {
            if (result.collisionLengthX() >= this._character.minTouchWidth() || result.collisionLengthY() >= this._character.minTouchHeight()) {
                return true;
            }
        }
        return false;
    }

    initMapCharactersCache() {
        this._controller.initMapCharactersCache();
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
        if (this._moverData.stopping) return;
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
            this.cancelMove();
        }
        this._character.checkEventTriggerTouchFront(this._character.direction());
    }

    startMove(targetCount, moveDeg, moveDir) {
        this._moverData.targetCount = targetCount;
        this._moverData.moveDir = moveDir;
        this._moverData.moveDeg = moveDeg;
        this.moveProcess();
    }

    calcTargetCount(fromPoint, targetPoint) {
        const far = DotMoveUtils.calcFar(fromPoint, targetPoint);
        return Math.round(far / this._character.distancePerFrame());
    }

    dotMoveByDirection(direction) {
        const deg = DotMoveUtils.direction2deg(direction);
        const direction4 = DotMoveUtils.deg2direction4(deg, this._character.direction());
        this.setDirection(direction4);
        this.startMove(1, null, direction);
    }

    dotMoveByDeg(deg) {
        const direction4 = DotMoveUtils.deg2direction4(deg, this._character.direction());
        this.setDirection(direction4);
        this.startMove(1, deg, null);
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
        if (this._moverData.stopping) return false;
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
        const fromPoint = this._character.positionPoint();
        const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, d, moveUnit);
        this.setDirection(d);
        const targetCount = this.calcTargetCount(fromPoint, targetPoint);
        this.startMove(targetCount, null, d);
    }

    moveDiagonally(horz, vert, moveUnit) {
        if (this._character.direction() === this._character.reverseDir(horz)) {
            this.setDirection(horz);
        }
        if (this._character.direction() === this._character.reverseDir(vert)) {
            this.setDirection(vert);
        }
        const d = DotMoveUtils.horzAndVert2Direction(horz, vert);
        const fromPoint = this._character.positionPoint();
        const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, d, moveUnit);
        const targetCount = this.calcTargetCount(fromPoint, targetPoint);
        this.startMove(targetCount, null, d);
    }

    moveToTarget(targetPoint) {
        const fromPoint = this._character.positionPoint();
        const deg = DotMoveUtils.calcDeg(fromPoint, targetPoint);
        const dir = DotMoveUtils.deg2direction4(deg, this._character.direction());
        this.setDirection(dir);
        const targetCount = this.calcTargetCount(fromPoint, targetPoint);
        this.startMove(targetCount, deg, null);
    }

    // 移動完了後のスルー状態設定を予約する
    setThrough(through) {
        this._moverData.setThroughReserve = through;
    }

    // 移動完了後の移動速度変更を予約する
    setMoveSpeed(moveSpeed) {
        this._moverData.setMoveSpeedReserve = moveSpeed;
    }
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
        this._width = EventParamParser.getWidth(character);
        this._height = EventParamParser.getHeight(character);
        this._offsetX = EventParamParser.getOffsetX(character);
        this._offsetY = EventParamParser.getOffsetY(character);
        this._widthArea = EventParamParser.getWidthArea(character);
        this._heightArea = EventParamParser.getHeightArea(character);
    }

    widthArea() {
        return this._widthArea;
    }

    heightArea() {
        return this._heightArea;
    }

    isCollidedWithPlayerCharacters(x, y, d) {
        const collisionResults = this._controller.checkPlayer(x, y, d, false);
        for (const result of collisionResults) {
            if (result.collisionLengthX() >= this._character.minTouchWidth() || result.collisionLengthY() >= this._character.minTouchHeight()) {
                return true;
            }
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


// CharacterMoverのデータのうちセーブデータに保持する必要のあるものを持たせる
class MoverData {
    get moved() { return this._moved; }
    set moved(_moved) { this._moved = _moved; }
    get targetCount() { return this._targetCount; }
    set targetCount(_targetCount) { this._targetCount = _targetCount; }
    get moving() { return this._moving; }
    set moving(_moving) { this._moving = _moving; }
    get setThroughReserve() { return this._setThroughReserve; }
    set setThroughReserve(_setThroughReserve) { this._setThroughReserve = _setThroughReserve; }
    get setMoveSpeedReserve() { return this._setMoveSpeedReserve; }
    set setMoveSpeedReserve(_setMoveSpeedReserve) { this._setMoveSpeedReserve = _setMoveSpeedReserve; }
    get moveDeg() { return this._moveDeg; }
    set moveDeg(_moveDeg) { this._moveDeg = _moveDeg; }
    get moveDir() { return this._moveDir; }
    set moveDir(_moveDir) { this._moveDir = _moveDir; }
    get stopping() { return this._stopping; }
    set stopping(_stopping) { this._stopping = _stopping; }

    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        this._moved = false;
        this._targetCount = 0;
        this._moving = false;
        this._setThroughReserve = null;
        this._setMoveSpeedReserve = null;
        this._moveDeg = null;
        this._moveDir = null;
        this._stopping = false;
    }
}


const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this._totalDpf = 0; // 歩数計算のために使用
    this._moveUnit = 1; // 移動単位
    this._moverData = new MoverData();
};

Game_CharacterBase.prototype.makeMover = function() {
    return new CharacterMover(this);
};

Game_CharacterBase.prototype.mover = function() {
    return $gameTemp.mover(this);
};

Game_CharacterBase.prototype.moverData = function() {
    if (this._moverData  == null) this._moverData = new MoverData();
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

Game_CharacterBase.prototype.positionPoint = function() {
    return new Point(this._realX, this._realY);
};

Game_CharacterBase.prototype.centerPositionPoint = function() {
    return new Point(this.centerRealX(), this.centerRealY())
};

Game_CharacterBase.prototype.setPositionPoint = function(point) {
    // 座標補正
    const x = Math.round(point.x * MARGIN_UNIT) / MARGIN_UNIT;
    const y = Math.round(point.y * MARGIN_UNIT) / MARGIN_UNIT;
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

// 移動が完了してからスルー状態を設定する
Game_CharacterBase.prototype.setThrough = function(through) {
    if (!this.isMoving()) {
        this._through = through;
    } else {
        this.mover().setThrough(through);
    }
};

// 移動が完了してから移動速度の変更を反映する
Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed) {
    if (!this.isMoving()) {
        this._moveSpeed = moveSpeed;
    } else {
        this.mover().setMoveSpeed(moveSpeed);
    }
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
    return new Rectangle(this._realX, this._realY, this.width(), this.height());
};

Game_CharacterBase.prototype.canPass = function(x, y, d, opt = { needCheckCharacters: true }) {
    const x2 = $gameMap.roundXWithDirection(x, d);
    const y2 = $gameMap.roundYWithDirection(y, d);
    if (!$gameMap.isValid(x2, y2)) {
        return false;
    }
    if (this.isThrough() || this.isDebugThrough()) {
        return true;
    }
    if (!this.isMapPassable(x, y, d)) {
        return false;
    }
    if (opt.needCheckCharacters) {
        if (this.isCollidedWithCharacters(x2, y2, d)) {
            return false;
        }
    }
    return true;
};

Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert, opt = { needCheckCharacters: true }) {
    const x2 = $gameMap.roundXWithDirection(x, horz);
    const y2 = $gameMap.roundYWithDirection(y, vert);
    if (this.canPass(x, y, vert, opt) && this.canPass(x, y2, horz, opt)) {
        if (this.canPass(x, y, horz, opt) && this.canPass(x2, y, vert, opt)) {
            return true;
        }
    }
    return false;
};

Game_CharacterBase.prototype.isCollidedWithEvents = function(x, y, d = this.direction()) {
    return this.mover().isCollidedWithEvents(x, y, d);
};

Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y, d = this.direction()) {
    return this.mover().isCollidedWithVehicles(x, y, d);
};

Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y, d = this.direction()) {
    return this.isCollidedWithEvents(x, y, d) || this.isCollidedWithVehicles(x, y, d);
};

Game_CharacterBase.prototype.calcDeg = function(targetCharacter) {
    return DotMoveUtils.calcDeg(this.centerPositionPoint(), targetCharacter.centerPositionPoint());
};

Game_CharacterBase.prototype.calcFar = function(targetCharacter) {
    return DotMoveUtils.calcFar(this.centerPositionPoint(), targetCharacter.centerPositionPoint());
};

Game_CharacterBase.prototype.stopMove = function() {
    return this.mover().stopMove();
};

Game_CharacterBase.prototype.resumeMove = function() {
    return this.mover().resumeMove();
};

Game_CharacterBase.prototype.cancelMove = function() {
    return this.mover().cancelMove();
};

Game_CharacterBase.prototype.checkCharacter = function(character) {
    return this.mover().checkCharacter(this._realX, this._realY, this._direction, character);
};

Game_CharacterBase.prototype.checkHitCharacters = function(targetCharacterClass = null) {
    return this.mover().checkHitCharacters(this._realX, this._realY, this._direction, targetCharacterClass);
};


Game_Character.prototype.findDirectionTo = function(goalX, goalY, searchLimit = this.searchLimit()) {
    const [best, start] = AStarUtils.computeRoute(this, this.x, this.y, goalX, goalY, searchLimit);
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
    this.mover().moveToTarget(new Point(x, y));
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
    this._shipOrBoatTowardingLand = false; // 船から陸地に移動しているか否かを管理するフラグ
    this._getOffVehicleIntPos = false; // 乗り物から降りる際に整数座標に着地するか否かを管理するフラグ
    this._collideTriggerEventIds = [];
    this._moveSpeedBeforeGetOnVehicle = this._moveSpeed;
};

Game_Player.prototype.makeMover = function() {
    return new PlayerMover(this);
};

Game_Player.prototype.isMapPassable = function(x, y, d) {
    const vehicle = this.vehicle();
    if (vehicle) {
        return vehicle.isMapPassable(x, y, d);
    } else {
        if (this._shipOrBoatTowardingLand) {
            // 船から着陸中の場合は、陸から海の方向への当たり判定のみを行うようにする
            const d2 = this.reverseDir(d);
            const nextPoint = DotMoveUtils.nextPointWithDirection(new Point(x, y), d);
            return $gameMap.isPassable(nextPoint.x, nextPoint.y, d2);
        }
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
        const direction = this.getInputDirection();
        if (direction > 0) {
            $gameTemp.clearDestination();
            $gameTemp.setBeforeTouchMovedPoint(null);
            this.executeMove(direction);
        } else if ($gameTemp.isDestinationValid()) {
            this.startTouchMove();
        }
    }
};

const _Game_Player_jump = Game_Player.prototype.jump;
Game_Player.prototype.jump = function(xPlus, yPlus) {
    this.initCollideTriggerEventIds(this.x + xPlus, this.y + yPlus);
    _Game_Player_jump.call(this, xPlus, yPlus);
};

Game_Player.prototype.startTouchMove = function() {
    const x = $gameTemp.destinationX();
    const y = $gameTemp.destinationY();
    const direction = this.findDirectionTo(x, y);
    if (direction > 0) {
        const beforeTouchMovedPoint = $gameTemp.beforeTouchMovedPoint();
        const currentPoint = new Point(this.x, this.y);
        const nextPoint = DotMoveUtils.nextPointWithDirection(currentPoint, direction);
        if (!beforeTouchMovedPoint || !(beforeTouchMovedPoint.x === nextPoint.x && beforeTouchMovedPoint.y === nextPoint.y)) {
            if (x === nextPoint.x && y === nextPoint.y) {
                this.mover().moveToTarget(nextPoint);
            } else {
                this.mover().moveByDirection(direction, 1);
            }
            $gameTemp.setBeforeTouchMovedPoint(currentPoint);
        }
    }
};

Game_Player.prototype.forceMoveOnVehicle = function() {
    this._dashing = false;
    this.setMoveSpeed(4);
    this.setThrough(true);
    const point = this.vehicle().positionPoint();
    this.mover().moveToTarget(point);
    this.setThrough(false);
};

Game_Player.prototype.forceMoveOffAirship = function() {
    this.setMoveSpeed(4);
    // リセットした乗り物の向きにプレイヤーを合わせる
    this.setDirection(this.vehicle().direction());
    // 整数座標への着地中は飛行船とプレイヤーの向きを固定化
    // 固定化OFFはupdateVehicleGetOffで実施する
    this.vehicle().setDirectionFix(true);
    this.setDirectionFix(true);
    if (this._getOffVehicleIntPos) {
        // 乗り物から降りた時にハマらないように整数座標に着陸する
        const targetPoint = new Point(this.x, this.y);
        this.mover().moveToTarget(targetPoint);
    }
};

Game_Player.prototype.forceMoveOffShipOrBoat = function() {
    this.setMoveSpeed(4);
    this.setThrough(true);
    let fromPoint;
    if (this._getOffVehicleIntPos) {
        // 乗り物から降りた時にハマらないように整数座標に着陸する
        fromPoint = new Point(this.x, this.y);
    } else {
        fromPoint = this.positionPoint();
    }
    const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, this.direction());
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
    this.updateRemoveCollideTriggerEventIds();
    this.updateScroll(lastScrolledX, lastScrolledY);
    this.updateVehicle();
    if (!this.isMoving()) {
        this.updateNonmoving(wasMoving, sceneActive);
    }
    if (this._needCountProcess) this.updateCountProcess(sceneActive);
    this.followers().update();
};

Game_Player.prototype.updateRemoveCollideTriggerEventIds = function() {
    if (this.isMoving() || this.isJumping()) return; // 船から降りた場合やジャンプ先のイベントを起動対象外にする
    for (const eventId of this._collideTriggerEventIds) {
        const event = $gameMap.event(eventId);
        if (event) {
            const result = this.checkCharacter(event);
            if (result && result.collisionLengthX() >= event.widthArea() && result.collisionLengthY() >= event.heightArea()) {
                continue;
            }
        }
        this._collideTriggerEventIds = this._collideTriggerEventIds.filter(id => id !== eventId);
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
    if ($gameMap.isEventRunning()) {
        this.initCollideTriggerEventIds();
    } else {
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
            $gameTemp.setBeforeTouchMovedPoint(null);
        }
    }
};

Game_Player.prototype.initCollideTriggerEventIds = function(x = this._realX, y = this._realY) {
    this._collideTriggerEventIds = [];
    for (const result of this.mover().checkHitCharacters(x, y, this._direction, Game_Event)) {
        const event = result.collisionObject;
        const eventId = event.eventId();
        if (result.collisionLengthX() >= event.widthArea() && result.collisionLengthY() >= event.heightArea()) {
            this._collideTriggerEventIds.push(eventId);
        }
    }
};

Game_Player.prototype.getOnVehicle = function() {
    if (this._vehicleType !== "walk") return false;
    const vehicleType = this.checkRideVehicles();
    if (vehicleType) {
        this._vehicleType = vehicleType;
        this._vehicleGettingOn = true;
        this._moveSpeedBeforeGetOnVehicle = this.moveSpeed();
        this.forceMoveOnVehicle();
        const point = this.vehicle().positionPoint();
        this.initCollideTriggerEventIds(point.x, point.y);
        this.gatherFollowers();
    }
    return this._vehicleGettingOn;
};

Game_Player.prototype.checkRideVehicles = function() {
    const airship = $gameMap.airship();
    const ship = $gameMap.ship();
    const boat = $gameMap.boat();
    let airshipResult = null;
    let shipResult = null;
    let boatResult = null;
    if (airship._mapId === $gameMap.mapId() && !airship.isThrough()) {
        airshipResult = this.checkCharacter(airship);
    }
    if (airshipResult && airshipResult.collisionLengthX() >= this.minTouchWidth() && airshipResult.collisionLengthY() >= this.minTouchHeight()) {
        return "airship";
    } else {
        const nextPoint = DotMoveUtils.nextPointWithDirection(this.positionPoint(), this.direction());
        if (ship._mapId === $gameMap.mapId() && !ship.isThrough()) {
            shipResult = this.mover().checkCharacter(nextPoint.x, nextPoint.y, this.direction(), ship);
        }
        if (shipResult && shipResult.collisionLengthX() >= this.minTouchWidth() && shipResult.collisionLengthY() >= this.minTouchHeight()) {
            return "ship";
        } else {
            if (boat._mapId === $gameMap.mapId() && !boat.isThrough()) {
                boatResult = this.mover().checkCharacter(nextPoint.x, nextPoint.y, this.direction(), boat);
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
        if (this.isGetOffCollided(this.positionPoint())) {
            if (this.isGetOffCollided(new Point(this.x, this.y))) return this._vehicleGettingOff;
            this._getOffVehicleIntPos = true;
        }

        this.getOffVehicleLastPhase();
    }
    return this._vehicleGettingOff;
};

Game_Player.prototype.getOffShipOrBoat = function() {
    const d = this.direction();
    if (this.vehicle().isLandOk(this.x, this.y, d)) {
        this._shipOrBoatTowardingLand = true;

        const x = (d === 8 || d === 2) ? this._realX : this.x;
        const y = (d === 6 || d === 4) ? this._realY : this.y;
        let point = new Point(x, y);

        const nextPoint = DotMoveUtils.nextPointWithDirection(point, d);
        if (this.isGetOffCollided(nextPoint)) {
            // 着陸座標で衝突が発生する場合は整数座標に着陸する
            const intPoint = new Point(this.x, this.y);
            const nextIntPoint = DotMoveUtils.nextPointWithDirection(intPoint, d);
            const results = this.mover().checkCollision(intPoint.x, intPoint.y, d);
            if (results.length > 0 || this.isGetOffCollided(nextIntPoint)) {
                this._shipOrBoatTowardingLand = false;
                return false;
            }
            this._getOffVehicleIntPos = true;
            point = intPoint;
        }

        this.setDirectionFix(true);
        this.setMoveSpeed(4);
        this.setThrough(true);
        this.mover().moveToTarget(point);
        this.setThrough(false);
    }
    return false;
};

Game_Player.prototype.isGetOffCollided = function(point) {
    const tmpVehicleType = this._vehicleType;
    const tmpThrough = this._through;
    this._vehicleType = "walk";
    this._through = false;
    const results = this.mover().checkCollision(point.x, point.y, this.direction());
    this._vehicleType = tmpVehicleType;
    this._through = tmpThrough;
    return results.length > 0;
};

Game_Player.prototype.getOffVehicleLastPhase = function() {
    for (const follower of this.followers().data()) {
        follower.setDirectionFix(false);
    }
    if (this._getOffVehicleIntPos) {
        this.followers().synchronize(this.x, this.y, this.direction());
    } else {
        this.followers().synchronize(this._realX, this._realY, this.direction());
    }

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
        if (this._getOffVehicleIntPos) {
            // 整数座標への移動完了後は確実に座標を整数に設定する
            this.setPositionPoint(new Point(this.x, this.y));
            this.vehicle().syncWithPlayer();
        } else {
            // 船で実数座標に着陸した場合の座標調整を実施する
            const d = this.direction();
            const x = (d === 8 || d === 2) ? this._realX : this.x;
            const y = (d === 6 || d === 4) ? this._realY : this.y;
            this.setPositionPoint(new Point(x, y));
        }
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
            if (this._getOffVehicleIntPos) {
                // 整数座標への移動完了後は確実に座標を整数に設定する
                this.setPositionPoint(new Point(this.x, this.y));
            }
            if (this.isInAirship()) {
                this.vehicle().syncWithPlayer();
                // 飛行船着地に完了した場合、正面を向く
                this.vehicle().setDirectionFix(false);
                this.setDirectionFix(false);
                this.setDirection(2);
                for (const follower of this.followers().data()) {
                    follower.setDirectionFix(false);
                    follower.setDirection(this.direction());
                }
            }
            this._vehicleGettingOff = false;
            this._vehicleType = "walk";
            this.setMoveSpeed(this._moveSpeedBeforeGetOnVehicle);
            this.setTransparent(false);
            this._gatherStart = false;
            this._getOffVehicleIntPos = false;
        }
    } else {
        if (!this.isMoving()) {
            this.gatherFollowers();
            this._gatherStart = true;
            this.initCollideTriggerEventIds(this._realX, this._realY);
        }
    }
};

Game_Player.prototype.moveForward = function() {
    this.moveStraight(this.direction());
};

Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if ($gameMap.isEventRunning()) return;
    const hasDecideTrigger = triggers.includes(0);
    for (const result of this.mover().checkHitCharacters(x, y, this._direction, Game_Event)) {
        const event = result.collisionObject;
        const eventId = event.eventId();
        if (!hasDecideTrigger) {
            if (this._collideTriggerEventIds.includes(eventId)) continue;
        }
        if (result.collisionLengthX() >= event.widthArea() && result.collisionLengthY() >= event.heightArea()) {
            if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                if (!hasDecideTrigger) {
                    if (!this._collideTriggerEventIds.includes(eventId)) {
                        this._collideTriggerEventIds.push(eventId);
                    }
                }
                event.start();
            }
        }
    }
};

Game_Player.prototype.startMapEventFront = function(x, y, d, triggers, normal, isTouch) {
    if ($gameMap.isEventRunning()) return;
    if (isTouch && (this.isThrough() || this.isDebugThrough())) return;
    const dpf = this.distancePerFrame();
    for (const result of this.mover().checkHitCharactersStepDir(x, y, d, Game_Event)) {
        const event = result.collisionObject;
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
        if ($gameMap.isAnyEventStarting()) return;
        let currentPoint = new Point(this._realX, this._realY);
        while (true) {
            let nextPoint = DotMoveUtils.nextPointWithDirection(currentPoint, direction);
            let nextX = Math.round(nextPoint.x);
            let nextY = Math.round(nextPoint.y);
            if ($gameMap.isCounter(nextX, nextY)) {
                this.startMapEventFront(nextPoint.x, nextPoint.y, this._direction, triggers, true, false);
                if ($gameMap.isAnyEventStarting()) break;
            } else {
                break;
            }
            currentPoint = nextPoint;
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

Game_Event.prototype.isCollidedWithCharacters = function(x, y, d = this.direction()) {
    return (
        Game_Character.prototype.isCollidedWithCharacters.call(this, x, y, d) ||
        this.isCollidedWithPlayerCharacters(x, y, d)
    );
};

Game_Event.prototype.isCollidedWithEvents = function(x, y, d = this.direction()) {
    return Game_CharacterBase.prototype.isCollidedWithEvents.call(this, x, y, d);
};

Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y, d = this.direction()) {
    return this.mover().isCollidedWithPlayerCharacters(x, y, d);
};

Game_Event.prototype.checkEventTriggerTouchFront = function(d) {
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
                if (!$gameMap.isEventRunning()) this.start();
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



const _Game_Follower_initialize = Game_Follower.prototype.initialize;
Game_Follower.prototype.initialize = function(memberIndex) {
    _Game_Follower_initialize.call(this, memberIndex);
    this.setThrough(false);
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
    if (this.isMoving()) return;
    if (this.isTransparent()) return;
    const far = this.calcFar(character);
    if (far >= 1) {
        this.changeFollowerSpeed(far);
        if (far >= 5) {
            // 前のキャラとの距離が5以上離れている場合はすり抜けを行う
            this.setThrough(true);
            const deg = this.calcDeg(character);
            this.dotMoveByDeg(deg);
        } else if (far >= 3 && this.isVisible()) {
            // 前のキャラとの距離が3以上離れている、かつフォロワーが可視状態の場合は経路探索を行う
            this.setThrough(false);
            const dir = this.findDirectionTo(character.x, character.y, 6);
            this.mover().moveByDirection(dir, 1);
        } else {
            // 前のキャラとの距離が1以上離れている場合は360度移動を行う
            this.setThrough(false);
            const deg = this.calcDeg(character);
            this.dotMoveByDeg(deg);
        }
    }
};

Game_Follower.prototype.gatherCharacter = function(character) {
    this.setThrough(true);
    if (this.isGathered()) {
        this.setPositionPoint(character.positionPoint());
        this.setThrough(false);
    } else {
        this.setMoveSpeed($gamePlayer.moveSpeed());
        const deg = this.calcDeg(character);
        this.dotMoveByDeg(deg);
    }
};

Game_Follower.prototype.changeFollowerSpeed = function(precedingCharacterFar) {
    this.setMoveSpeed(this.calcFollowerSpeed(precedingCharacterFar));
};

Game_Follower.prototype.calcFollowerSpeed = function(precedingCharacterFar) {
    if (precedingCharacterFar >= 4) {
        return $gamePlayer.realMoveSpeed() + 1;
    } else if (precedingCharacterFar >= 2) {
        return $gamePlayer.realMoveSpeed() + 0.5;
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
    const margin = this.distancePerFrame() / 2;
    const result = this.checkCharacter($gamePlayer);
    if (!result) return false;
    return result.collisionLengthX() >= ($gamePlayer.width() - margin) && result.collisionLengthY() >= ($gamePlayer.height() - margin);
};


const _Game_Followers_initialize = Game_Followers.prototype.initialize;
Game_Followers.prototype.initialize = function() {
    _Game_Followers_initialize.call(this);
    this._gatherCount = 0; // gatherタイムアウト監視用
};

if (Utils.RPGMAKER_NAME === "MV") {
    Game_Followers.prototype.data = function() {
        return this._data.clone();
    };
}

Game_Followers.prototype.update = function() {
    for (const follower of this._data) {
        follower.update();
    }
    if (this.areGathering()) {
        this.updateGather();
    } else {
        this.updateMove();
    }
};

Game_Followers.prototype.updateMove = function() {
    for (let i = 0; i < this._data.length; i++) {
        const precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
        this._data[i].chaseCharacter(precedingCharacter);
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
    $gamePlayer.setPositionPoint(this.positionPoint());
};


const _Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    // なるべくドット移動関連の変数をセーブデータに持たせないため、ムーバーはGame_Tempに保持する。
    this._movers = new Map();
    // イベントとの衝突判定を高速化するため、マスごとにイベントを管理する
    this._mapCharactersCache = null;
    // タッチ移動時に移動前後で移動先のマスが変化する場合に移動処理がループする現象に対応する
    this._beforeTouchMovedPoint = null;
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

Game_Temp.prototype.setupMapCharactersCache = function(width, height) {
    this._mapCharactersCache = new MapCharactersCache(width, height);
};

Game_Temp.prototype.mapCharactersCache = function() {
    return this._mapCharactersCache;
};

Game_Temp.prototype.beforeTouchMovedPoint = function() {
    return this._beforeTouchMovedPoint;
};

Game_Temp.prototype.setBeforeTouchMovedPoint = function(point) {
    this._beforeTouchMovedPoint = point;
};

// セーブデータに保持するクラスをwindowオブジェクトに登録する
window.MoverData = MoverData;

return {
    EventParamParser,
    AStarNode,
    AStarUtils,
    DotMoveUtils,
    CollisionResult,
    MapCharactersCache,
    CharacterCollisionChecker,
    PlayerCollisionChecker,
    EventCollisionChecker,
    FollowerCollisionChecker,
    CharacterController,
    PlayerController,
    EventController,
    FollowerController,
    CharacterMover,
    PlayerMover,
    EventMover,
    FollowerMover,
    MoverData,
};

})();
