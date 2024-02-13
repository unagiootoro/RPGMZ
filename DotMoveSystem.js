"use strict";
/*:
@target MV MZ
@plugindesc Dot movement system v2.2.4
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
this.dotMoveByDeg(angle (integer from 0 to 359));
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
<width: width (real numbers greater than or equal to 0.5)>

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

■ Setting the event slide length
When the character collides with the corner of the wall, it will move to the side where there is no corner.
If the character size is less than 1, half the size is applied to the slide width, and 0.5 is applied if it is 1 or more.

Also, after annotating the very first event command on the EV page on the first page of the event,
you can set the slide width of the event in more detail by writing the following content in the annotation.
・X axis slide length
<slideLengthX: Width (0 or more real number>

・Y axis slide length
<slideLengthY: Vertical width (0 or more real number)>

■ Change character size/display offset/slide width from script
By describing the following script in the movement route script
Character size/display offset/slide width can be changed.

・Horizontal size change
this.setWidth(width value);

・Vertical size change
this.setHeight(height value);

・Change the X coordinate display offset
this.setOffsetX(offset value);

・Change Y coordinate display offset
this.setOffsetY(offset value);

・Change the slide width in the X-axis direction
this.setSlideLengthX(slide width value);

・Change the slide width in the Y-axis direction
this.setSlideLengthY(slide width value);

・Change the contact range of the horizontal axis
this.setWidthArea(contact width value);

・Change the contact range of the vertical axis
this.setHeightArea(contact width value);

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
Stop character movement. If you move the character while stopped, it will automatically resume movement.

Game_CharacterBase#resumeMove()
Resume the movement of the character.

Game_CharacterBase#cancelMove()
Cancels the movement of the character to a specific point by moveToTarget etc.

Game_CharacterBase#checkCharacter(character)
Checks if it collides with the character specified by the argument, and if it collides, returns a CollisionResult object.

Game_CharacterBase#checkHitCharacters(targetCharacterClass)
Checks for collisions with all characters that match the character class specified
by targetCharacterClass, and returns an array of CollisionResult objects.

【License】
This plugin is available under the terms of the MIT license.
*/
/*:ja
@target MV MZ
@plugindesc ドット移動システム v2.2.4
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
<width: 横幅(0.5以上の実数)>

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

■ イベントのスライド幅の設定
キャラクターが壁の角に衝突したとき、角がない方にずらす動作を行いますが、
このときのずらしを許容する角との衝突幅をスライド幅と言います。
スライド幅はキャラクターのサイズが1未満であればサイズの半分が適用され、
1以上であれば0.5が適用されます。

また、イベントの1ページ目のEVページの一番最初のイベントコマンドを注釈にしたうえで、
注釈に以下の内容を記載することでイベントのスライド幅をより詳細に設定することができます。
・X軸方向のスライド幅
<slideLengthX: 横幅(0以上の実数>

・Y軸方向のスライド幅
<slideLengthY: 縦幅(0以上の実数)>

■ スクリプトからキャラクターのサイズ/表示オフセット/スライド幅を変更する
以下のスクリプトを移動ルートのスクリプトで記載することで
キャラクターのサイズ/表示オフセット/スライド幅を変更することができます。

・横方向サイズの変更
this.setWidth(横幅の値);

・縦方向サイズの変更
this.setHeight(縦幅の値);

・X座標表示オフセットの変更
this.setOffsetX(オフセットの値);

・Y座標表示オフセットの変更
this.setOffsetY(オフセットの値);

・X軸方向のスライド幅の変更
this.setSlideLengthX(スライド幅の値);

・Y軸方向のスライド幅の変更
this.setSlideLengthY(スライド幅の値);

・横軸の接触範囲の変更
this.setWidthArea(接触幅の値);

・縦軸の接触範囲の変更
this.setHeightArea(接触幅の値);

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
キャラクターの移動を停止します。停止中にキャラクターを移動した場合、自動的に移動を再開します。

Game_CharacterBase#resumeMove()
キャラクターの移動を再開します。

Game_CharacterBase#cancelMove()
moveToTargetなどによって行われているキャラクターの特定地点への移動をキャンセルします。

Game_CharacterBase#checkCharacter(character)
引数で指定したcharacterと衝突しているかをチェックし、衝突していればCollisionResultオブジェクトを返します。

Game_CharacterBase#checkHitCharacters(targetCharacterClass)
targetCharacterClassで指定したキャラクタークラスに該当する
全てのキャラクターと衝突しているかをチェックし、CollisionResultオブジェクトの配列を返します。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/
const DotMoveSystemPluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "DotMoveSystem";
var DotMoveSystem;
(function (DotMoveSystem) {
    class DotMovePoint {
        get x() { return this._x; }
        set x(_x) { this._x = _x; }
        get y() { return this._y; }
        set y(_y) { this._y = _y; }
        static fromDegAndFar(deg, far) {
            const rad = deg.toRad();
            const x = far * Math.cos(rad);
            const y = far * Math.sin(rad);
            return new DotMovePoint(x, y);
        }
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(x = 0, y = 0) {
            this._x = x;
            this._y = y;
        }
        clone() {
            return new DotMovePoint(this._x, this._y);
        }
        equals(point) {
            return this.x === point.x && this.y === point.y;
        }
        add(point) {
            return new DotMovePoint(this.x + point.x, this.y + point.y);
        }
        calcDeg(targetPoint) {
            const ox = $gameMap.deltaX(targetPoint.x, this.x);
            const oy = $gameMap.deltaY(targetPoint.y, this.y);
            const rad = Math.atan2(oy, ox);
            return Degree.fromRad(rad);
        }
        calcFar(targetPoint) {
            const xDiff = $gameMap.deltaX(targetPoint.x, this.x);
            const yDiff = $gameMap.deltaY(targetPoint.y, this.y);
            if (xDiff === 0 && yDiff === 0)
                return 0;
            return Math.sqrt(xDiff ** 2 + yDiff ** 2);
        }
    }
    DotMoveSystem.DotMovePoint = DotMovePoint;
    class DotMoveRectangle {
        get x() { return this._x; }
        set x(_x) { this._x = _x; }
        get y() { return this._y; }
        set y(_y) { this._y = _y; }
        get width() { return this._width; }
        set width(_width) { this._width = _width; }
        get height() { return this._height; }
        set height(_height) { this._height = _height; }
        get x2() { return this.x + this.width; }
        get y2() { return this.y + this.height; }
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(x = 0, y = 0, width = 0, height = 0) {
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
        }
        clone() {
            return new DotMoveRectangle(this._x, this._y, this._width, this._height);
        }
        equals(rect) {
            return this.x === rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height;
        }
        isCollidedRect(rect) {
            if ((this.x > rect.x && this.x < rect.x2 || this.x2 > rect.x && this.x2 < rect.x2 || rect.x >= this.x && rect.x2 <= this.x2) &&
                (this.y > rect.y && this.y < rect.y2 || this.y2 > rect.y && this.y2 < rect.y2 || rect.y >= this.y && rect.y2 <= this.y2)) {
                return true;
            }
            return false;
        }
        union(rect) {
            const x1 = this.x < rect.x ? this.x : rect.x;
            const x2 = this.x2 > rect.x2 ? this.x2 : rect.x2;
            const y1 = this.y < rect.y ? this.y : rect.y;
            const y2 = this.y2 > rect.y2 ? this.y2 : rect.y2;
            return new DotMoveRectangle(x1, y1, x2 - x1, y2 - y1);
        }
    }
    DotMoveSystem.DotMoveRectangle = DotMoveRectangle;
    class Degree {
        get value() {
            return this._value;
        }
        static fromDirection(direction) {
            switch (direction) {
                case 8:
                    return Degree.UP;
                case 9:
                    return Degree.UP_RIGHT;
                case 6:
                    return Degree.RIGHT;
                case 3:
                    return Degree.RIGHT_DOWN;
                case 2:
                    return Degree.DOWN;
                case 1:
                    return Degree.DOWN_LEFT;
                case 4:
                    return Degree.LEFT;
                case 7:
                    return Degree.LEFT_UP;
                default:
                    throw new Error(`${direction} is not found`);
            }
        }
        static fromRad(rad) {
            return new Degree((rad * 180 / Math.PI) + 90);
        }
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(value) {
            value %= 360;
            if (value < 0)
                value = 360 + value;
            this._value = value;
        }
        toRad() {
            return (this._value - 90) * Math.PI / 180;
        }
        toDirection8() {
            const t = Math.round(this._value / 45);
            if (t === 0 || t === 8) {
                return 8;
            }
            else if (t === 1) {
                return 9;
            }
            else if (t === 2) {
                return 6;
            }
            else if (t === 3) {
                return 3;
            }
            else if (t === 4) {
                return 2;
            }
            else if (t === 5) {
                return 1;
            }
            else if (t === 6) {
                return 4;
            }
            else if (t === 7) {
                return 7;
            }
            else {
                throw new Error(`${this._value} is not found`);
            }
        }
        toDirection4(lastDirection) {
            const t = Math.round(this._value / 45);
            if (t === 0 || t === 8) {
                return 8;
            }
            else if (t === 1) {
                if (lastDirection === 8)
                    return 8;
                return 6;
            }
            else if (t === 2) {
                return 6;
            }
            else if (t === 3) {
                if (lastDirection === 6)
                    return 6;
                return 2;
            }
            else if (t === 4) {
                return 2;
            }
            else if (t === 5) {
                if (lastDirection === 2)
                    return 2;
                return 4;
            }
            else if (t === 6) {
                return 4;
            }
            else if (t === 7) {
                if (lastDirection === 4)
                    return 4;
                return 8;
            }
            else {
                throw new Error(`${this._value} is not found`);
            }
        }
    }
    Degree.UP = new Degree(0);
    Degree.UP_RIGHT = new Degree(45);
    Degree.RIGHT = new Degree(90);
    Degree.RIGHT_DOWN = new Degree(135);
    Degree.DOWN = new Degree(180);
    Degree.DOWN_LEFT = new Degree(225);
    Degree.LEFT = new Degree(270);
    Degree.LEFT_UP = new Degree(315);
    DotMoveSystem.Degree = Degree;
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
    DotMoveSystem.AStarNode = AStarNode;
    class AStarUtils {
        // 8方向A*経路探索を行い最適ノードと初期ノードを返す
        static computeRoute(character, startX, startY, goalX, goalY, searchLimit) {
            if (startX === goalX && startY === goalY) {
                return undefined;
            }
            const openList = [];
            const nodes = {};
            const start = new AStarNode(undefined, startX, startY, $gameMap.distance(startX, startY, goalX, goalY), 0);
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
                        if (nodeA.f < nodeB.f)
                            openListIdx1 = i;
                    }
                }
                const pos1 = openList[openListIdx1];
                const node1 = nodes[pos1];
                const x1 = node1.x;
                const y1 = node1.y;
                const g1 = node1.g;
                if (x1 === goalX && y1 === goalY)
                    return { best: node1, start };
                if (node1.g >= searchLimit)
                    return { best, start };
                node1.closed = true;
                openList.splice(openListIdx1, 1);
                for (const direction of [8, 9, 6, 3, 2, 1, 4, 7]) {
                    const { horz, vert } = DotMoveUtils.direction2HorzAndVert(direction);
                    const x2 = $gameMap.roundXWithDirection(x1, horz);
                    const y2 = $gameMap.roundYWithDirection(y1, vert);
                    const pos2 = y2 * $gameMap.width() + x2;
                    let node2 = nodes[pos2];
                    if (node2 && node2.closed)
                        continue;
                    let successPass = false;
                    if (direction % 2 === 0) {
                        if (character.canPass(x1, y1, direction)) {
                            successPass = true;
                        }
                    }
                    else {
                        if (character.canPassDiagonally(x1, y1, horz, vert)) {
                            successPass = true;
                        }
                    }
                    if (!successPass) {
                        if (x2 === goalX && y2 === goalY) {
                            if (direction % 2 === 0) {
                                if (character.canPass(x1, y1, direction, { needCheckCharacters: false })) {
                                    return { best: node1, start };
                                }
                            }
                        }
                        continue;
                    }
                    const cost = direction % 2 === 0 ? 1 : DotMoveUtils.DIAGONAL_COST;
                    const g2 = g1 + cost;
                    const f2 = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                    const openListIdx2 = openList.indexOf(pos2);
                    if (openListIdx2 < 0) {
                        node2 = new AStarNode(node1, x2, y2, f2, g2);
                        nodes[pos2] = node2;
                        openList.push(pos2);
                    }
                    else if (f2 < node2.f) {
                        node2.f = f2;
                        node2.g = g2;
                        node2.parent = node1;
                        openList.splice(openListIdx2, 1);
                        openList.push(pos2);
                    }
                    if (node2.f - node2.g < best.f - best.g)
                        best = node2;
                }
            }
            return { best, start };
        }
    }
    DotMoveSystem.AStarUtils = AStarUtils;
    class MassInfo {
        get x() { return this._x; }
        get y() { return this._y; }
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(x, y) {
            this._x = x;
            this._y = y;
        }
    }
    DotMoveSystem.MassInfo = MassInfo;
    class MassRange {
        static fromRect(rect) {
            const x = Math.floor(rect.x);
            const y = Math.floor(rect.y);
            const x2 = Math.ceil(rect.x2) - 1;
            const y2 = Math.ceil(rect.y2) - 1;
            return new MassRange(x, y, x2, y2);
        }
        get x() { return this._x; }
        get y() { return this._y; }
        get x2() { return this._x2; }
        get y2() { return this._y2; }
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(x, y, x2, y2) {
            this._x = x;
            this._y = y;
            this._x2 = x2;
            this._y2 = y2;
        }
        masses() {
            const masses = new Set();
            for (let ix = this.x; ix <= this.x2; ix++) {
                for (let iy = this.y; iy <= this.y2; iy++) {
                    const ix2 = $gameMap.roundX(ix);
                    const iy2 = $gameMap.roundY(iy);
                    if ($gameMap.isValid(ix2, iy2)) {
                        const i = iy2 * $gameMap.width() + ix2;
                        masses.add(i);
                    }
                }
            }
            return masses;
        }
    }
    DotMoveSystem.MassRange = MassRange;
    class DotMoveUtils {
        static isFloatLt(left, right, margin = 1.0 / DotMoveUtils.MARGIN_UNIT) {
            if (left <= right - margin)
                return true;
            if (left <= right + margin)
                return true;
            return false;
        }
        static isFloatGt(left, right, margin = 1.0 / DotMoveUtils.MARGIN_UNIT) {
            if (left >= right - margin)
                return true;
            if (left >= right + margin)
                return true;
            return false;
        }
        static calcDistance(deg, far) {
            const dis = DotMovePoint.fromDegAndFar(deg, far);
            const marginUnit = DotMoveUtils.MARGIN_UNIT;
            dis.x = Math.round(dis.x * marginUnit) / marginUnit;
            dis.y = Math.round(dis.y * marginUnit) / marginUnit;
            return dis;
        }
        static nextPointWithDirection(point, direction, unit = 1) {
            let x = point.x;
            let y = point.y;
            const signPoint = this.direction2SignPoint(direction);
            x += signPoint.x * unit;
            y += signPoint.y * unit;
            x = $gameMap.roundX(x);
            y = $gameMap.roundY(y);
            return new DotMovePoint(x, y);
        }
        static prevPointWithDirection(point, direction, unit = 1) {
            let x = point.x;
            let y = point.y;
            const signPoint = this.direction2SignPoint(direction);
            x -= signPoint.x * unit;
            y -= signPoint.y * unit;
            x = $gameMap.roundX(x);
            y = $gameMap.roundY(y);
            return new DotMovePoint(x, y);
        }
        static direction2Axis(direction4) {
            if (direction4 === 4 || direction4 === 6) {
                return "x";
            }
            else if (direction4 === 8 || direction4 === 2) {
                return "y";
            }
            else {
                throw new Error(`${direction4} is not found`);
            }
        }
        static direction2SignPoint(direction) {
            const { horz, vert } = this.direction2HorzAndVert(direction);
            const xSign = horz === 4 ? -1 : horz === 6 ? 1 : 0;
            const ySign = vert === 8 ? -1 : vert === 2 ? 1 : 0;
            return new DotMovePoint(xSign, ySign);
        }
        static direction2HorzAndVert(direction) {
            let horz = 0, vert = 0;
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
            return { horz, vert };
        }
        static horzAndVert2Direction(horz, vert) {
            if (vert === 8 && horz === 6) {
                return 9;
            }
            else if (vert === 2 && horz === 6) {
                return 3;
            }
            else if (vert === 2 && horz === 4) {
                return 1;
            }
            else if (vert === 8 && horz === 4) {
                return 7;
            }
            return vert === 0 ? horz : vert;
        }
        static checkCollidedRect(rect1, rect2, targetObject) {
            if (rect1.isCollidedRect(rect2)) {
                const result = new CollisionResult(rect1, rect2, targetObject);
                if (result.collisionLengthX() > 0 && result.collisionLengthY() > 0)
                    return result;
            }
            return undefined;
        }
    }
    DotMoveUtils.DIAGONAL_COST = 1 / Math.sin(Math.PI / 4);
    DotMoveUtils.MARGIN_UNIT = 65536;
    DotMoveUtils.MOVED_MARGIN_UNIT = Math.sqrt(DotMoveUtils.MARGIN_UNIT);
    DotMoveSystem.DotMoveUtils = DotMoveUtils;
    class CollisionResult {
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(subjectRect, targetRect, targetObject) {
            this._subjectRect = subjectRect;
            this._targetRect = targetRect;
            this._targetObject = targetObject;
            const margin = 1.0 / DotMoveUtils.MARGIN_UNIT;
            const rightCollisionLength = this.calcRightCollisionLength();
            const leftCollisionLength = this.calcLeftCollisionLength();
            const upCollisionLength = this.calcUpCollisionLength();
            const downCollisionLength = this.calcDownCollisionLength();
            this._rightCollisionLength = rightCollisionLength < margin ? 0 : rightCollisionLength;
            this._leftCollisionLength = leftCollisionLength < margin ? 0 : leftCollisionLength;
            this._upCollisionLength = upCollisionLength < margin ? 0 : upCollisionLength;
            this._downCollisionLength = downCollisionLength < margin ? 0 : downCollisionLength;
        }
        get subjectRect() { return this._subjectRect; }
        get targetRect() { return this._targetRect; }
        get targetObject() { return this._targetObject; }
        getCollisionLength(axis) {
            if (axis === "x") {
                return this.collisionLengthX();
            }
            else {
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
                default:
                    return 0;
            }
        }
        collisionLengthX() {
            const leftCollisionLength = this.leftCollisionLength();
            const rightCollisionLength = this.rightCollisionLength();
            if (leftCollisionLength < rightCollisionLength) {
                return leftCollisionLength;
            }
            else {
                return rightCollisionLength;
            }
        }
        collisionLengthY() {
            const upCollisionLength = this.upCollisionLength();
            const downCollisionLength = this.downCollisionLength();
            if (upCollisionLength < downCollisionLength) {
                return upCollisionLength;
            }
            else {
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
        calcUpCollisionLength() {
            if (this._subjectRect.y < this._targetRect.y2) {
                return this._subjectRect.y2 - this._targetRect.y;
            }
            else {
                return this._subjectRect.height;
            }
        }
        calcRightCollisionLength() {
            if (this._targetRect.x2 < this._subjectRect.x2) {
                return this._targetRect.x2 - this._subjectRect.x;
            }
            else {
                return this._subjectRect.width;
            }
        }
        calcDownCollisionLength() {
            if (this._targetRect.y2 < this._subjectRect.y2) {
                return this._targetRect.y2 - this._subjectRect.y;
            }
            else {
                return this._subjectRect.height;
            }
        }
        calcLeftCollisionLength() {
            if (this._subjectRect.x < this._targetRect.x2) {
                return this._subjectRect.x2 - this._targetRect.x;
            }
            else {
                return this._subjectRect.width;
            }
        }
    }
    DotMoveSystem.CollisionResult = CollisionResult;
    class MapCharactersCache {
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(width, height) {
            this._cache = new Array(width * height);
        }
        massCharacters(mass) {
            return this._cache[mass];
        }
        addMapCharactersCache(mass, character) {
            if (this._cache[mass] == null)
                this._cache[mass] = new Set();
            this._cache[mass].add(character);
        }
        removeMapCharactersCache(mass, character) {
            if (this._cache[mass] != null)
                this._cache[mass].delete(character);
        }
    }
    DotMoveSystem.MapCharactersCache = MapCharactersCache;
    // キャラクターの衝突判定を実施する。
    class CharacterCollisionChecker {
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(character, opt = {}) {
            this._character = character;
            const pos = this._character.positionPoint();
            this._origX = opt.origX == null ? pos.x : opt.origX;
            this._origY = opt.origY == null ? pos.y : opt.origY;
            // overComplementModeがtrueの場合は衝突幅がキャラクターの幅を超える場合に衝突幅の修正を行う
            this._overComplementMode = opt.overComplementMode == null ? false : opt.overComplementMode;
            // throughIfCollidedがtrueの場合は既に衝突が発生していたときの衝突判定を無効にする
            this._throughIfCollided = opt.throughIfCollided == null ? false : opt.throughIfCollided;
        }
        checkCollision(x, y, d) {
            const collisionResults = [];
            collisionResults.push(...this.checkCollisionMasses(x, y, d));
            // マップの範囲有効判定をマスの衝突確認で実施する必要があるため
            // すり抜けを行う場合このタイミングでreturnする
            if (this._character.isThrough() || this._character.isDebugThrough())
                return collisionResults;
            collisionResults.push(...this.checkCollisionCharacters(x, y, d, Game_CharacterBase));
            return collisionResults;
        }
        checkHitCharacters(x, y, d, targetCharacterClass) {
            const collisionResults = [];
            for (const character of this.enteringMassesCharacters(x, y)) {
                if (!(character instanceof targetCharacterClass))
                    continue;
                const result = this.checkCharacter(x, y, d, character);
                if (result)
                    collisionResults.push(result);
            }
            return collisionResults;
        }
        checkCharacter(x, y, d, character) {
            const targetPos = character.positionPoint();
            const targetX = this._characterIntPosMode ? character.x : targetPos.x;
            const targetY = this._characterIntPosMode ? character.y : targetPos.y;
            const subjectRect = new DotMoveRectangle(x, y, this._character.width(), this._character.height());
            const targetRect = new DotMoveRectangle(targetX, targetY, character.width(), character.height());
            return this.checkCollidedRect(d, subjectRect, targetRect, character);
        }
        checkCollisionMasses(x, y, d) {
            const collisionResults = [];
            const subjectRect = new DotMoveRectangle(x, y, this._character.width(), this._character.height());
            const massRange = this.calcSubjectCharacterMassRange(x, y);
            for (let ix = massRange.x; ix <= massRange.x2; ix++) {
                for (let iy = massRange.y; iy <= massRange.y2; iy++) {
                    const ix2 = $gameMap.roundX(ix);
                    const iy2 = $gameMap.roundY(iy);
                    if (!this.isNoCheckMass(ix, iy, d, massRange)) {
                        collisionResults.push(...this.checkCollisionMass(subjectRect, d, ix2, iy2));
                    }
                }
            }
            if (collisionResults.length > 0)
                return collisionResults;
            const cliffCollisionResult = this.checkCollisionCliff(subjectRect, massRange, d);
            collisionResults.push(...cliffCollisionResult);
            return collisionResults;
        }
        // 最後尾のマスは衝突確認の対象外とする。
        isNoCheckMass(ix, iy, d, massRange) {
            switch (d) {
                case 8:
                    if (iy === massRange.y2)
                        return true;
                    break;
                case 6:
                    if (ix === massRange.x)
                        return true;
                    break;
                case 2:
                    if (iy === massRange.y)
                        return true;
                    break;
                case 4:
                    if (ix === massRange.x2)
                        return true;
                    break;
            }
            return false;
        }
        checkCollisionMass(subjectRect, d, ix, iy) {
            if (!this.checkPassMass(ix, iy, d)) {
                const massRect = new DotMoveRectangle(ix, iy, 1, 1);
                const result = this.checkCollidedRect(d, subjectRect.clone(), massRect, new MassInfo(ix, iy));
                if (result)
                    return [result];
            }
            return [];
        }
        checkCollisionCliff(subjectRect, massRange, d) {
            const x1 = massRange.x;
            const x2 = massRange.x2;
            const y1 = massRange.y;
            const y2 = massRange.y2;
            switch (d) {
                case 8:
                    if (y1 === y2)
                        return [];
                    return this.checkCollisionXCliff(subjectRect, x1, x2, y1, d);
                case 6:
                    if (x1 === x2)
                        return [];
                    return this.checkCollisionYCliff(subjectRect, y1, y2, x2, d);
                case 2:
                    if (y1 === y2)
                        return [];
                    return this.checkCollisionXCliff(subjectRect, x1, x2, y2, d);
                case 4:
                    if (x1 === x2)
                        return [];
                    return this.checkCollisionYCliff(subjectRect, y1, y2, x1, d);
            }
            return [];
        }
        checkCollisionXCliff(subjectRect, x1, x2, iy, d) {
            const results = [];
            const iy2 = $gameMap.roundY(iy);
            for (let ix = x1; ix < x2; ix++) {
                const ix2 = $gameMap.roundX(ix);
                if (!this.checkPassMass(ix2, iy2, 4) && !this.checkPassMass($gameMap.roundX(ix2 + 1), iy2, 6)) {
                    const massRect1 = new DotMoveRectangle(ix2, iy2, 1, 1);
                    const massRect2 = new DotMoveRectangle($gameMap.roundX(ix2 + 1), iy2, 1, 1);
                    const result1 = this.checkCollidedRect(d, subjectRect.clone(), massRect1, new MassInfo(massRect1.x, massRect1.y));
                    const result2 = this.checkCollidedRect(d, subjectRect.clone(), massRect2, new MassInfo(massRect2.x, massRect2.y));
                    if (result1 && result2) {
                        if (result1.collisionLengthX() > result2.collisionLengthX()) {
                            results.push(result2);
                        }
                        else {
                            results.push(result1);
                        }
                    }
                }
            }
            return results;
        }
        checkCollisionYCliff(subjectRect, y1, y2, ix, d) {
            const results = [];
            const ix2 = $gameMap.roundX(ix);
            for (let iy = y1; iy < y2; iy++) {
                const iy2 = $gameMap.roundY(iy);
                if (!this.checkPassMass(ix2, iy2, 8) && !this.checkPassMass(ix2, $gameMap.roundY(iy2 + 1), 2)) {
                    const massRect1 = new DotMoveRectangle(ix2, iy2, 1, 1);
                    const massRect2 = new DotMoveRectangle(ix2, $gameMap.roundY(iy2 + 1), 1, 1);
                    const result1 = this.checkCollidedRect(d, subjectRect.clone(), massRect1, new MassInfo(massRect1.x, massRect1.y));
                    const result2 = this.checkCollidedRect(d, subjectRect.clone(), massRect2, new MassInfo(massRect2.x, massRect2.y));
                    if (result1 && result2) {
                        if (result1.collisionLengthY() > result2.collisionLengthY()) {
                            results.push(result2);
                        }
                        else {
                            results.push(result1);
                        }
                    }
                }
            }
            return results;
        }
        checkCollisionCharacters(x, y, d, targetCharacterClass) {
            const collisionResults = [];
            for (const character of this.enteringMassesCharacters(x, y)) {
                if (!(character instanceof targetCharacterClass))
                    continue;
                if (this._character.checkCollisionTargetCharacter(x, y, d, character)) {
                    const result = this.checkCharacter(x, y, d, character);
                    if (result)
                        collisionResults.push(result);
                }
            }
            return collisionResults;
        }
        checkPassMass(ix, iy, d) {
            if (!$gameMap.isValid(ix, iy)) {
                return false;
            }
            if (this._character.isThrough() || this._character.isDebugThrough()) {
                return true;
            }
            const prevPoint = DotMoveUtils.prevPointWithDirection(new DotMovePoint(ix, iy), d);
            if (!this._character.isMapPassable(prevPoint.x, prevPoint.y, d)) {
                return false;
            }
            return true;
        }
        enteringMassesCharacters(x, y) {
            const characters = new Set();
            const massRange = this.calcSubjectCharacterMassRange(x, y);
            for (const massIdx of massRange.masses()) {
                const massCharacters = $gameTemp.mapCharactersCache().massCharacters(massIdx);
                if (massCharacters) {
                    for (const character of massCharacters) {
                        if (this._character === character)
                            continue;
                        characters.add(character);
                    }
                }
            }
            return characters;
        }
        calcSubjectCharacterMassRange(x, y) {
            const subjectRect = new DotMoveRectangle(x, y, this._character.width(), this._character.height());
            if (this._overComplementMode) {
                const subjectOrigRect = new DotMoveRectangle(this._origX, this._origY, subjectRect.width, subjectRect.height);
                if ($gameMap.isLoopHorizontal()) {
                    subjectOrigRect.x = $gameMap.roundX(subjectOrigRect.x);
                    if (subjectRect.x < subjectOrigRect.width && subjectOrigRect.x >= $gameMap.width() - subjectOrigRect.width) {
                        subjectRect.x += $gameMap.width();
                    }
                    else if (subjectRect.x >= $gameMap.width() - subjectRect.width && subjectOrigRect.x < subjectRect.width) {
                        subjectOrigRect.x += $gameMap.width();
                    }
                }
                if ($gameMap.isLoopVertical()) {
                    subjectOrigRect.y = $gameMap.roundY(subjectOrigRect.y);
                    if (subjectRect.y < subjectOrigRect.height && subjectOrigRect.y >= $gameMap.height() - subjectOrigRect.height) {
                        subjectRect.y += $gameMap.height();
                    }
                    else if (subjectRect.y >= $gameMap.height() - subjectRect.height && subjectOrigRect.y < subjectRect.height) {
                        subjectOrigRect.y += $gameMap.height();
                    }
                }
                return MassRange.fromRect(subjectOrigRect.union(subjectRect));
            }
            else {
                return MassRange.fromRect(subjectRect);
            }
        }
        // 本メソッドは高速化のために引数のsubjectRectおよびtargetRectを直接変更する
        checkCollidedRect(d, subjectRect, targetRect, targetObject) {
            let origX = this._origX;
            let origY = this._origY;
            if ($gameMap.isLoopHorizontal()) {
                subjectRect.x = $gameMap.roundX(subjectRect.x);
                if (targetRect.x < subjectRect.width && subjectRect.x >= $gameMap.width() - subjectRect.width) {
                    targetRect.x += $gameMap.width();
                }
                else if (targetRect.x >= $gameMap.width() - targetRect.width && subjectRect.x < targetRect.width) {
                    subjectRect.x += $gameMap.width();
                    origX += $gameMap.width();
                }
            }
            if ($gameMap.isLoopVertical()) {
                subjectRect.y = $gameMap.roundY(subjectRect.y);
                if (targetRect.y < subjectRect.height && subjectRect.y >= $gameMap.height() - subjectRect.height) {
                    targetRect.y += $gameMap.height();
                }
                else if (targetRect.y >= $gameMap.height() - targetRect.height && subjectRect.y < targetRect.height) {
                    subjectRect.y += $gameMap.height();
                    origY += $gameMap.height();
                }
            }
            // throughIfCollidedが有効の場合、既に衝突していれば衝突判定対象外とする。
            if (this._throughIfCollided) {
                const subjectOrigRect = new DotMoveRectangle(origX, origY, subjectRect.width, subjectRect.height);
                if (DotMoveUtils.checkCollidedRect(subjectOrigRect, targetRect, targetObject)) {
                    return undefined;
                }
            }
            if (this._overComplementMode) {
                return this.checkCollidedRectOverComplement(origX, origY, d, subjectRect, targetRect, targetObject);
            }
            else {
                return DotMoveUtils.checkCollidedRect(subjectRect, targetRect, targetObject);
            }
        }
        // 本メソッドは高速化のために引数のsubjectRectおよびtargetRectを直接変更する
        checkCollidedRectOverComplement(origX, origY, d, subjectRect, targetRect, targetObject) {
            switch (d) {
                case 8:
                    if (DotMoveUtils.isFloatGt(origY, targetRect.y2) && subjectRect.y < targetRect.y) {
                        targetRect.height += targetRect.y - subjectRect.y;
                        targetRect.y = subjectRect.y;
                    }
                    if (DotMoveUtils.isFloatGt(origY, targetRect.y2) && subjectRect.y2 < targetRect.y2) {
                        subjectRect.height += targetRect.y2 - subjectRect.y2;
                    }
                    break;
                case 6:
                    if (DotMoveUtils.isFloatLt(origX + subjectRect.width, targetRect.x) && subjectRect.x2 > targetRect.x2) {
                        targetRect.width += subjectRect.x2 - targetRect.x2;
                    }
                    if (DotMoveUtils.isFloatLt(origX + subjectRect.width, targetRect.x) && subjectRect.x > targetRect.x) {
                        subjectRect.width += subjectRect.x - targetRect.x;
                        subjectRect.x = targetRect.x;
                    }
                    break;
                case 2:
                    if (DotMoveUtils.isFloatLt(origY + subjectRect.height, targetRect.y) && subjectRect.y2 > targetRect.y2) {
                        targetRect.height += subjectRect.y2 - targetRect.y2;
                    }
                    if (DotMoveUtils.isFloatLt(origY + subjectRect.height, targetRect.y) && subjectRect.y > targetRect.y) {
                        subjectRect.height += subjectRect.y - targetRect.y;
                        subjectRect.y = targetRect.y;
                    }
                    break;
                case 4:
                    if (DotMoveUtils.isFloatGt(origX, targetRect.x2) && subjectRect.x < targetRect.x) {
                        targetRect.width += targetRect.x - subjectRect.x;
                        targetRect.x = subjectRect.x;
                    }
                    if (DotMoveUtils.isFloatGt(origX, targetRect.x2) && subjectRect.x2 < targetRect.x2) {
                        subjectRect.width += targetRect.x2 - subjectRect.x2;
                    }
                    break;
            }
            return DotMoveUtils.checkCollidedRect(subjectRect, targetRect, targetObject);
        }
    }
    DotMoveSystem.CharacterCollisionChecker = CharacterCollisionChecker;
    // マップキャラクターキャッシュを更新する。
    class MapCharacterCacheUpdater {
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(character) {
            this._character = character;
            // マップイベントのキャッシュ更新用に移動前の座標と変更前のサイズを保持する
            this._lastRect = undefined;
        }
        updateMapCharactersCache() {
            const rect = this._character.collisionRect();
            if (this._lastRect && this._lastRect.equals(rect))
                return;
            const mapCharactersCache = $gameTemp.mapCharactersCache();
            if (!mapCharactersCache)
                return;
            let beforeMasses;
            if (this._lastRect) {
                beforeMasses = MassRange.fromRect(this._lastRect).masses();
            }
            else {
                beforeMasses = new Set();
            }
            const afterMasses = MassRange.fromRect(rect).masses();
            for (const afterMass of afterMasses) {
                if (!beforeMasses.has(afterMass)) {
                    mapCharactersCache.addMapCharactersCache(afterMass, this._character);
                }
            }
            for (const beforeMass of beforeMasses) {
                if (!afterMasses.has(beforeMass)) {
                    mapCharactersCache.removeMapCharactersCache(beforeMass, this._character);
                }
            }
            this._lastRect = rect;
        }
        removeMapCharactersCache() {
            const mapCharactersCache = $gameTemp.mapCharactersCache();
            if (!mapCharactersCache)
                return;
            const rect = this._character.collisionRect();
            const masses = MassRange.fromRect(rect).masses();
            if (this._lastRect && !this._lastRect.equals(rect)) {
                for (const mass of MassRange.fromRect(this._lastRect).masses()) {
                    masses.add(mass);
                }
            }
            for (const mass of masses) {
                mapCharactersCache.removeMapCharactersCache(mass, this._character);
            }
        }
    }
    DotMoveSystem.MapCharacterCacheUpdater = MapCharacterCacheUpdater;
    // 衝突判定を元にキャラクターの座標を更新する。
    // 座標以外の状態は変更しない。
    class CharacterDotMoveProcess {
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(character) {
            this._character = character;
        }
        dotMoveByDeg(deg, dpf) {
            this._dpf = dpf;
            const distance = this.calcDistance(deg);
            let movedPoint = this.calcMovedPoint(deg.toDirection8(), distance);
            const realPoint = this._character.positionPoint();
            const margin = dpf / DotMoveUtils.MOVED_MARGIN_UNIT;
            let moved = true;
            if (this.reachPoint(realPoint, movedPoint, margin))
                moved = false;
            movedPoint.x = $gameMap.roundX(movedPoint.x);
            movedPoint.y = $gameMap.roundY(movedPoint.y);
            this._character.setPositionPoint(movedPoint);
            return moved;
        }
        calcMovedPoint(direction, distance) {
            switch (direction) {
                case 8:
                    return this.calcUp(distance);
                case 9:
                    return this.calcUpRight(distance);
                case 6:
                    return this.calcRight(distance);
                case 3:
                    return this.calcRightDown(distance);
                case 2:
                    return this.calcDown(distance);
                case 1:
                    return this.calcDownLeft(distance);
                case 4:
                    return this.calcLeft(distance);
                case 7:
                    return this.calcLeftUp(distance);
                default:
                    throw new Error(`${direction} is not found`);
            }
        }
        calcUp(dis) {
            const pos = this._character.positionPoint();
            const collisionResults = this.checkCollision(pos.x, pos.y + dis.y, 8);
            if (this.canSlide(collisionResults, 4)) {
                return this.calcSlideLeftWhenUp(pos, dis, collisionResults);
            }
            else if (this.canSlide(collisionResults, 6)) {
                return this.calcSlideRightWhenUp(pos, dis, collisionResults);
            }
            if (dis.x < 0) {
                return this.calcLeftUpWithoutSlide(dis);
            }
            else {
                return this.calcUpRightWithoutSlide(dis);
            }
        }
        calcRight(dis) {
            const pos = this._character.positionPoint();
            const collisionResults = this.checkCollision(pos.x + dis.x, pos.y, 6);
            if (this.canSlide(collisionResults, 8)) {
                return this.calcSlideUpWhenRight(pos, dis, collisionResults);
            }
            else if (this.canSlide(collisionResults, 2)) {
                return this.calcSlideDownWhenRight(pos, dis, collisionResults);
            }
            if (dis.y < 0) {
                return this.calcUpRightWithoutSlide(dis);
            }
            else {
                return this.calcRightDownWithoutSlide(dis);
            }
        }
        calcDown(dis) {
            const pos = this._character.positionPoint();
            const collisionResults = this.checkCollision(pos.x, pos.y + dis.y, 2);
            if (this.canSlide(collisionResults, 4)) {
                return this.calcSlideLeftWhenDown(pos, dis, collisionResults);
            }
            else if (this.canSlide(collisionResults, 6)) {
                return this.calcSlideRightWhenDown(pos, dis, collisionResults);
            }
            if (dis.x < 0) {
                return this.calcDownLeftWithoutSlide(dis);
            }
            else {
                return this.calcRightDownWithoutSlide(dis);
            }
        }
        calcLeft(dis) {
            const pos = this._character.positionPoint();
            const collisionResults = this.checkCollision(pos.x + dis.x, pos.y, 4);
            if (this.canSlide(collisionResults, 8)) {
                return this.calcSlideUpWhenLeft(pos, dis, collisionResults);
            }
            else if (this.canSlide(collisionResults, 2)) {
                return this.calcSlideDownWhenLeft(pos, dis, collisionResults);
            }
            if (dis.y < 0) {
                return this.calcLeftUpWithoutSlide(dis);
            }
            else {
                return this.calcDownLeftWithoutSlide(dis);
            }
        }
        calcUpRight(dis) {
            if (this._character.needDiagonalSlideX()) {
                const pos = this._character.positionPoint();
                const collisionResults1 = this.checkCollision(pos.x, pos.y + dis.y, 8);
                if (this.canSlide(collisionResults1, 6)) {
                    return this.calcSlideRightWhenUp(pos, dis, collisionResults1);
                }
            }
            if (this._character.needDiagonalSlideY()) {
                const pos = this._character.positionPoint();
                const collisionResults2 = this.checkCollision(pos.x + dis.x, pos.y, 6);
                if (this.canSlide(collisionResults2, 8)) {
                    return this.calcSlideUpWhenRight(pos, dis, collisionResults2);
                }
            }
            return this.calcUpRightWithoutSlide(dis);
        }
        calcRightDown(dis) {
            if (this._character.needDiagonalSlideY()) {
                const pos = this._character.positionPoint();
                const collisionResults1 = this.checkCollision(pos.x + dis.x, pos.y, 6);
                if (this.canSlide(collisionResults1, 2)) {
                    return this.calcSlideDownWhenRight(pos, dis, collisionResults1);
                }
            }
            if (this._character.needDiagonalSlideX()) {
                const pos = this._character.positionPoint();
                const collisionResults2 = this.checkCollision(pos.x, pos.y + dis.y, 2);
                if (this.canSlide(collisionResults2, 6)) {
                    return this.calcSlideRightWhenDown(pos, dis, collisionResults2);
                }
            }
            return this.calcRightDownWithoutSlide(dis);
        }
        calcDownLeft(dis) {
            if (this._character.needDiagonalSlideY()) {
                const pos = this._character.positionPoint();
                const collisionResults1 = this.checkCollision(pos.x + dis.x, pos.y, 4);
                if (this.canSlide(collisionResults1, 2)) {
                    return this.calcSlideDownWhenLeft(pos, dis, collisionResults1);
                }
            }
            if (this._character.needDiagonalSlideX()) {
                const pos = this._character.positionPoint();
                const collisionResults2 = this.checkCollision(pos.x, pos.y + dis.y, 2);
                if (this.canSlide(collisionResults2, 4)) {
                    return this.calcSlideLeftWhenDown(pos, dis, collisionResults2);
                }
            }
            return this.calcDownLeftWithoutSlide(dis);
        }
        calcLeftUp(dis) {
            if (this._character.needDiagonalSlideY()) {
                const pos = this._character.positionPoint();
                const collisionResults1 = this.checkCollision(pos.x + dis.x, pos.y, 4);
                if (this.canSlide(collisionResults1, 8)) {
                    return this.calcSlideUpWhenLeft(pos, dis, collisionResults1);
                }
            }
            if (this._character.needDiagonalSlideX()) {
                const pos = this._character.positionPoint();
                const collisionResults2 = this.checkCollision(pos.x, pos.y + dis.y, 8);
                if (this.canSlide(collisionResults2, 4)) {
                    return this.calcSlideLeftWhenUp(pos, dis, collisionResults2);
                }
            }
            return this.calcLeftUpWithoutSlide(dis);
        }
        calcSlideRightWhenUp(pos, dis, collisionResults) {
            dis = this.slideDistance(dis, pos, collisionResults, Degree.UP_RIGHT, 6);
            const slidedPos = new DotMovePoint(pos.x + dis.x, pos.y);
            dis = this.correctUpDistance(slidedPos, dis);
            return pos.add(dis);
        }
        calcSlideUpWhenRight(pos, dis, collisionResults) {
            dis = this.slideDistance(dis, pos, collisionResults, Degree.UP_RIGHT, 8);
            const slidedPos = new DotMovePoint(pos.x, pos.y + dis.y);
            dis = this.correctRightDistance(slidedPos, dis);
            return pos.add(dis);
        }
        calcSlideDownWhenRight(pos, dis, collisionResults) {
            dis = this.slideDistance(dis, pos, collisionResults, Degree.RIGHT_DOWN, 2);
            const slidedPos = new DotMovePoint(pos.x, pos.y + dis.y);
            dis = this.correctRightDistance(slidedPos, dis);
            return pos.add(dis);
        }
        calcSlideRightWhenDown(pos, dis, collisionResults) {
            dis = this.slideDistance(dis, pos, collisionResults, Degree.RIGHT_DOWN, 6);
            const slidedPos = new DotMovePoint(pos.x + dis.x, pos.y);
            dis = this.correctDownDistance(slidedPos, dis);
            return pos.add(dis);
        }
        calcSlideDownWhenLeft(pos, dis, collisionResults) {
            dis = this.slideDistance(dis, pos, collisionResults, Degree.DOWN_LEFT, 2);
            const slidedPos = new DotMovePoint(pos.x, pos.y + dis.y);
            dis = this.correctLeftDistance(slidedPos, dis);
            return pos.add(dis);
        }
        calcSlideLeftWhenDown(pos, dis, collisionResults) {
            dis = this.slideDistance(dis, pos, collisionResults, Degree.DOWN_LEFT, 4);
            const slidedPos = new DotMovePoint(pos.x + dis.x, pos.y);
            dis = this.correctDownDistance(slidedPos, dis);
            return pos.add(dis);
        }
        calcSlideUpWhenLeft(pos, dis, collisionResults) {
            dis = this.slideDistance(dis, pos, collisionResults, Degree.LEFT_UP, 8);
            const slidedPos = new DotMovePoint(pos.x, pos.y + dis.y);
            dis = this.correctLeftDistance(slidedPos, dis);
            return pos.add(dis);
        }
        calcSlideLeftWhenUp(pos, dis, collisionResults) {
            dis = this.slideDistance(dis, pos, collisionResults, Degree.LEFT_UP, 4);
            const slidedPos = new DotMovePoint(pos.x + dis.x, pos.y);
            dis = this.correctUpDistance(slidedPos, dis);
            return pos.add(dis);
        }
        calcUpRightWithoutSlide(dis) {
            const pos = this._character.positionPoint();
            dis = this.correctUpDistance(pos, dis);
            pos.y += dis.y;
            dis = this.correctRightDistance(pos, dis);
            pos.x += dis.x;
            return pos;
        }
        calcRightDownWithoutSlide(dis) {
            const pos = this._character.positionPoint();
            dis = this.correctRightDistance(pos, dis);
            pos.x += dis.x;
            dis = this.correctDownDistance(pos, dis);
            pos.y += dis.y;
            return pos;
        }
        calcDownLeftWithoutSlide(dis) {
            const pos = this._character.positionPoint();
            dis = this.correctDownDistance(pos, dis);
            pos.y += dis.y;
            dis = this.correctLeftDistance(pos, dis);
            pos.x += dis.x;
            return pos;
        }
        calcLeftUpWithoutSlide(dis) {
            const pos = this._character.positionPoint();
            dis = this.correctLeftDistance(pos, dis);
            pos.x += dis.x;
            dis = this.correctUpDistance(pos, dis);
            pos.y += dis.y;
            return pos;
        }
        correctUpDistance(pos, distance) {
            return this.correctDistance(pos, distance, 8);
        }
        correctRightDistance(pos, distance) {
            return this.correctDistance(pos, distance, 6);
        }
        correctDownDistance(pos, distance) {
            return this.correctDistance(pos, distance, 2);
        }
        correctLeftDistance(pos, distance) {
            return this.correctDistance(pos, distance, 4);
        }
        // 衝突判定を行い、衝突矩形から衝突した長さを取得してその分だけ距離を戻す
        // 衝突矩形が複数ある場合は最も衝突距離が長い分だけ距離を戻す
        correctDistance(pos, distance, dir) {
            const axis = DotMoveUtils.direction2Axis(dir);
            const correctedDistance = distance.clone();
            if (distance[axis] === 0)
                return correctedDistance;
            let nextX = pos.x;
            let nextY = pos.y;
            if (axis === "x") {
                nextX += distance.x;
            }
            else {
                nextY += distance.y;
            }
            const origX = $gameMap.roundX(pos.x);
            const origY = $gameMap.roundY(pos.y);
            const collisionResults = this.checkCollision(nextX, nextY, dir, { origX, origY, overComplementMode: true, throughIfCollided: true });
            if (collisionResults.length === 0)
                return correctedDistance;
            // 距離を戻すため、逆方向の衝突幅を取得する。
            const dir2 = this._character.reverseDir(dir);
            const len = this.getMaxCollisionLength(collisionResults, dir2);
            // 衝突距離が移動距離より長い場合、移動距離分だけ移動させる
            if (len <= Math.abs(distance[axis])) {
                const sign = dir === 8 || dir === 4 ? 1 : -1;
                correctedDistance[axis] += len * sign;
            }
            else {
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
        slideDistance(dis, pos, collisionResults, deg, dir) {
            const newDis = dis.clone();
            const len = collisionResults[0].getCollisionLengthByDirection(dir);
            const diagDis = this.calcDistance(deg);
            const axis = DotMoveUtils.direction2Axis(dir);
            if (len < Math.abs(diagDis[axis])) {
                newDis[axis] = diagDis[axis] < 0 ? -len : len;
            }
            else if (len <= this.getSlideLength(axis)) {
                newDis[axis] = diagDis[axis];
            }
            else {
                return newDis;
            }
            return this.correctDistance(pos, newDis, dir);
        }
        canSlide(collisionResults, dir) {
            if (collisionResults.length === 0)
                return false;
            const collisionLength = this.getMaxCollisionLength(collisionResults, dir);
            const axis = DotMoveUtils.direction2Axis(dir);
            if (collisionLength <= this.getSlideLength(axis)) {
                return true;
            }
            return false;
        }
        calcDistance(deg) {
            return DotMoveUtils.calcDistance(deg, this._dpf);
        }
        checkCollision(x, y, d, opt = {}) {
            const collisionChecker = new CharacterCollisionChecker(this._character, opt);
            return collisionChecker.checkCollision(x, y, d);
        }
        getSlideLength(axis) {
            if (axis === "x") {
                return this._character.slideLengthX();
            }
            else {
                return this._character.slideLengthY();
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
    DotMoveSystem.CharacterDotMoveProcess = CharacterDotMoveProcess;
    // CharacterControllerを用いてキャラクターの座標を更新し、
    // それに合わせてキャラクターの各種状態を更新する。
    class CharacterMover {
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(character) {
            this._character = character;
            this._moverData = character.moverData();
        }
        createCollisionChecker(opt = {}) {
            return new CharacterCollisionChecker(this._character, opt);
        }
        createDotMoveProcess() {
            return new CharacterDotMoveProcess(this._character);
        }
        // 移動が行われた場合、ここで毎フレーム移動処理を行う
        updateMove() {
            if (this._character.isMoved())
                return;
            if (this._moverData.stopping)
                return;
            if (!this.isMovingToTarget())
                return;
            this.continuousMoveProcess();
        }
        stopMove() {
            this._moverData.stopping = true;
        }
        resumeMove() {
            this._moverData.stopping = false;
        }
        cancelMove() {
            this._moverData.targetFar = 0;
        }
        isMovingToTarget() {
            return this._moverData.targetFar > 0;
        }
        checkCollision(x, y, direction) {
            return this.createCollisionChecker().checkCollision(x, y, direction);
        }
        checkCollisionCharacters(x, y, direction, targetCharacterClass) {
            return this.createCollisionChecker().checkCollisionCharacters(x, y, direction, targetCharacterClass);
        }
        checkCharacter(x, y, direction, character) {
            return this.createCollisionChecker().checkCharacter(x, y, direction, character);
        }
        checkCharacterStepDir(x, y, direction, character) {
            const deg = Degree.fromDirection(direction);
            const dis = DotMoveUtils.calcDistance(deg, this._character.distancePerFrame());
            const x2 = x + dis.x;
            const y2 = y + dis.y;
            return this.createCollisionChecker().checkCharacter(x2, y2, direction, character);
        }
        checkHitCharacters(x, y, direction, targetCharacterClass) {
            return this.createCollisionChecker().checkHitCharacters(x, y, direction, targetCharacterClass);
        }
        checkHitCharactersStepDir(x, y, direction, targetCharacterClass) {
            const deg = Degree.fromDirection(direction);
            const dis = DotMoveUtils.calcDistance(deg, this._character.distancePerFrame());
            const x2 = x + dis.x;
            const y2 = y + dis.y;
            return this.createCollisionChecker().checkHitCharacters(x2, y2, direction, targetCharacterClass);
        }
        continuousMoveProcess() {
            const dpf = this._character.distancePerFrame();
            const moved = this.createDotMoveProcess().dotMoveByDeg(new Degree(this._moverData.moveDeg), dpf);
            if (moved) {
                if (this._moverData.targetFar < dpf) {
                    this._moverData.targetFar = 0;
                }
                else {
                    this._moverData.targetFar -= dpf;
                }
            }
            else {
                this.cancelMove();
            }
            this._character.moveCallback(moved, dpf);
        }
        startContinuousMove(targetFar, moveDeg) {
            if (targetFar === 0)
                return;
            if (this._moverData.stopping)
                this.resumeMove();
            this._moverData.targetFar = targetFar;
            this._moverData.moveDeg = moveDeg.value;
            this.continuousMoveProcess();
        }
        dotMoveByDirection(direction, dpf = this._character.distancePerFrame()) {
            this.dotMoveByDeg(Degree.fromDirection(direction), dpf);
        }
        dotMoveByDeg(deg, dpf = this._character.distancePerFrame()) {
            if (this._moverData.stopping)
                this.resumeMove();
            this.setDirection(deg.toDirection4(this._character.direction()));
            const moved = this.createDotMoveProcess().dotMoveByDeg(deg, dpf);
            this._character.moveCallback(moved, dpf);
        }
        // はしご考慮
        setDirection(d) {
            if (this._character.isOnLadder()) {
                this._character.setDirection(8);
            }
            else {
                this._character.setDirection(d);
            }
        }
        moveByDirection(d, moveUnit) {
            if ([8, 6, 2, 4].includes(d)) {
                this.moveStraight(d, moveUnit);
            }
            else if ([9, 3, 1, 7].includes(d)) {
                const { horz, vert } = DotMoveUtils.direction2HorzAndVert(d);
                this.moveDiagonally(horz, vert, moveUnit);
            }
        }
        moveStraight(dir, moveUnit) {
            const fromPoint = this._character.positionPoint();
            const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, dir, moveUnit);
            this.setDirection(dir);
            const targetFar = fromPoint.calcFar(targetPoint);
            this.startContinuousMove(targetFar, Degree.fromDirection(dir));
        }
        moveDiagonally(horz, vert, moveUnit) {
            if (this._character.direction() === this._character.reverseDir(horz)) {
                this.setDirection(horz);
            }
            if (this._character.direction() === this._character.reverseDir(vert)) {
                this.setDirection(vert);
            }
            const dir = DotMoveUtils.horzAndVert2Direction(horz, vert);
            const fromPoint = this._character.positionPoint();
            const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, dir, moveUnit);
            const targetFar = fromPoint.calcFar(targetPoint);
            this.startContinuousMove(targetFar, Degree.fromDirection(dir));
        }
        moveToTarget(targetPoint) {
            const fromPoint = this._character.positionPoint();
            const deg = fromPoint.calcDeg(targetPoint);
            const dir = deg.toDirection4(this._character.direction());
            this.setDirection(dir);
            const targetFar = fromPoint.calcFar(targetPoint);
            this.startContinuousMove(targetFar, deg);
        }
    }
    DotMoveSystem.CharacterMover = CharacterMover;
    // CharacterMoverのデータのうちセーブデータに保持する必要のあるものを持たせる
    class MoverData {
        get targetFar() { return this._targetFar; }
        set targetFar(_targetFar) { this._targetFar = _targetFar; }
        get moveDeg() { return this._moveDeg; }
        set moveDeg(_moveDeg) { this._moveDeg = _moveDeg; }
        get stopping() { return this._stopping; }
        set stopping(_stopping) { this._stopping = _stopping; }
        constructor(...args) {
            this.initialize(...args);
        }
        initialize() {
            this._targetFar = 0;
            this._moveDeg = 0;
            this._stopping = false;
        }
    }
    DotMoveSystem.MoverData = MoverData;
    class CharacterDotMoveTempData {
        get mover() { return this._mover; }
        get mapCharacterCacheUpdater() { return this._mapCharacterCacheUpdater; }
        constructor(...args) {
            this.initialize(...args);
        }
        initialize(character) {
            this._mover = new CharacterMover(character);
            this._mapCharacterCacheUpdater = new MapCharacterCacheUpdater(character);
        }
    }
    DotMoveSystem.CharacterDotMoveTempData = CharacterDotMoveTempData;
    class PlayerDotMoveTempData extends CharacterDotMoveTempData {
        get collideTriggerEventIds() { return this._collideTriggerEventIds; }
        set collideTriggerEventIds(_collideTriggerEventIds) { this._collideTriggerEventIds = _collideTriggerEventIds; }
        constructor(character) {
            super(character);
        }
        initialize(character) {
            super.initialize(character);
            this._collideTriggerEventIds = [];
        }
    }
    DotMoveSystem.PlayerDotMoveTempData = PlayerDotMoveTempData;
    class EventDotMoveTempData extends CharacterDotMoveTempData {
        get width() { return this._width; }
        get height() { return this._height; }
        get offsetX() { return this._offsetX; }
        get offsetY() { return this._offsetY; }
        get widthArea() { return this._widthArea; }
        get heightArea() { return this._heightArea; }
        get slideLengthX() { return this._slideLengthX; }
        get slideLengthY() { return this._slideLengthY; }
        get eventTouchToPlayer() { return this._eventTouchToPlayer; }
        set eventTouchToPlayer(_eventTouchToPlayer) { this._eventTouchToPlayer = _eventTouchToPlayer; }
        constructor(character) {
            super(character);
        }
        initialize(character) {
            super.initialize(character);
            const values = character.getAnnotationValues(0);
            this._width = values.width != null ? parseFloat(values.width) : 1;
            this._height = values.height != null ? parseFloat(values.height) : 1;
            this._offsetX = values.offsetX != null ? parseFloat(values.offsetX) : 0;
            this._offsetY = values.offsetY != null ? parseFloat(values.offsetY) : 0;
            this._widthArea = values.widthArea != null ? parseFloat(values.widthArea) : 0.5;
            this._heightArea = values.heightArea != null ? parseFloat(values.heightArea) : 0.5;
            this._slideLengthX = values.slideLengthX != null ? parseFloat(values.slideLengthX) : 0.5;
            this._slideLengthY = values.slideLengthY != null ? parseFloat(values.slideLengthY) : 0.5;
            // イベントからプレイヤーに衝突してイベントを実行したときにONになる。
            this._eventTouchToPlayer = false;
        }
    }
    DotMoveSystem.EventDotMoveTempData = EventDotMoveTempData;
    class FollowerDotMoveTempData extends CharacterDotMoveTempData {
        get sameDirectionTotalDpf() { return this._sameDirectionTotalDpf; }
        set sameDirectionTotalDpf(_sameDirectionTotalDpf) { this._sameDirectionTotalDpf = _sameDirectionTotalDpf; }
        constructor(character) {
            super(character);
        }
        initialize(character) {
            super.initialize(character);
            this._sameDirectionTotalDpf = 0;
        }
    }
    DotMoveSystem.FollowerDotMoveTempData = FollowerDotMoveTempData;
    // バージョンIDが同じ場合、Game_Map#setupはコールされないため、マップ遷移時の初期化処理はここで実施する
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        // マップ遷移時に全てのキャラクターの一時データを初期化する(メモリリーク対策)
        $gameTemp.initCharacterTempDatas();
        // マップ遷移時にマップキャラクターのキャッシュをクリアする
        $gameMap.initMapCharactersCache();
        // マップ遷移時にプレイヤーと既に衝突しているイベントは起動対象外にする
        $gamePlayer.setupCollideTriggerEventIds();
    };
    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function (sceneActive) {
        for (const character of this.allCharacters()) {
            character.prepareUpdate();
        }
        _Game_Map_update.call(this, sceneActive);
        $gameTemp.removeUnusedCache();
    };
    Game_Map.prototype.initMapCharactersCache = function () {
        $gameTemp.setupMapCharactersCache(this.width(), this.height());
        for (const character of this.allCharacters()) {
            character.updateMapCharactersCache();
        }
    };
    Game_Map.prototype.allCharacters = function () {
        return new Set([$gamePlayer, $gameMap.boat(), $gameMap.ship(), $gameMap.airship(), ...this.events(), ...$gamePlayer.followers().data()]);
    };
    // マイナス値に対応
    Game_Map.prototype.roundX = function (x) {
        if (this.isLoopHorizontal()) {
            x %= this.width();
            if (x < 0)
                x = this.width() + x;
        }
        return x;
    };
    Game_Map.prototype.roundY = function (y) {
        if (this.isLoopVertical()) {
            y %= this.height();
            if (y < 0)
                y = this.height() + y;
        }
        return y;
    };
    Game_Map.prototype.distance = function (x1, y1, x2, y2) {
        const xDis = Math.abs(this.deltaX(x1, x2));
        const yDis = Math.abs(this.deltaY(y1, y2));
        if (xDis > yDis) {
            return (xDis - yDis) + yDis * DotMoveUtils.DIAGONAL_COST;
        }
        else {
            return (yDis - xDis) + xDis * DotMoveUtils.DIAGONAL_COST;
        }
    };
    const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function () {
        _Game_CharacterBase_initMembers.call(this);
        this._totalDpf = 0; // 歩数計算のために使用
        this._moveUnit = 1; // 移動単位
        this._moved = false;
        this._moving = false;
        this._clearMovedFlagRequested = false;
        this._moverData = new MoverData();
    };
    Game_CharacterBase.prototype.createDotMoveTempData = function () {
        return new CharacterDotMoveTempData(this);
    };
    Game_CharacterBase.prototype.dotMoveTempData = function () {
        return $gameTemp.characterTempData(this);
    };
    Game_CharacterBase.prototype.mover = function () {
        return this.dotMoveTempData().mover;
    };
    Game_CharacterBase.prototype.moverData = function () {
        if (this._moverData == null)
            this._moverData = new MoverData();
        return this._moverData;
    };
    Game_CharacterBase.prototype.width = function () {
        return this._width == null ? 1 : this._width;
    };
    Game_CharacterBase.prototype.setWidth = function (width) {
        this._width = width;
        this.updateMapCharactersCache();
    };
    Game_CharacterBase.prototype.height = function () {
        return this._height == null ? 1 : this._height;
    };
    Game_CharacterBase.prototype.setHeight = function (height) {
        this._height = height;
        this.updateMapCharactersCache();
    };
    Game_CharacterBase.prototype.offsetX = function () {
        return this._offsetX == null ? 0 : this._offsetX;
    };
    Game_CharacterBase.prototype.setOffsetX = function (offsetX) {
        this._offsetX = offsetX;
    };
    Game_CharacterBase.prototype.offsetY = function () {
        return this._offsetY == null ? 0 : this._offsetY;
    };
    Game_CharacterBase.prototype.setOffsetY = function (offsetY) {
        this._offsetY = offsetY;
    };
    Game_CharacterBase.prototype.slideLengthX = function () {
        return this._slideLengthX == null ? this.minTouchWidth() : this._slideLengthX;
    };
    Game_CharacterBase.prototype.setSlideLengthX = function (slideLengthX) {
        this._slideLengthX = slideLengthX;
    };
    Game_CharacterBase.prototype.slideLengthY = function () {
        return this._slideLengthY == null ? this.minTouchHeight() : this._slideLengthY;
    };
    Game_CharacterBase.prototype.setSlideLengthY = function (slideLengthY) {
        this._slideLengthY = slideLengthY;
    };
    Game_CharacterBase.prototype.needDiagonalSlideX = function () {
        return false;
    };
    Game_CharacterBase.prototype.needDiagonalSlideY = function () {
        return false;
    };
    const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function () {
        this.clearMovedFlagIfRequested();
        _Game_CharacterBase_update.call(this);
        this.updateMapCharactersCache();
        this.updatePostMove();
    };
    Game_CharacterBase.prototype.updateMove = function () {
        this.mover().updateMove();
    };
    Game_CharacterBase.prototype.updatePostMove = function () {
        if (!this.isMoving())
            return;
        if (!this.mover().isMovingToTarget()) {
            this._moving = false;
            if (this._setThroughReserve != null) {
                this._through = this._setThroughReserve;
                this._setThroughReserve = undefined;
            }
            if (this._setMoveSpeedReserve != null) {
                this._moveSpeed = this._setMoveSpeedReserve;
                this._setMoveSpeedReserve = undefined;
            }
            this.refreshBushDepth();
        }
    };
    Game_CharacterBase.prototype.isMoving = function () {
        return this._moving;
    };
    Game_CharacterBase.prototype.isMoved = function () {
        return this._moved;
    };
    Game_CharacterBase.prototype.moveUnit = function () {
        return this._moveUnit;
    };
    Game_CharacterBase.prototype.setMoveUnit = function (moveUnit) {
        this._moveUnit = moveUnit;
    };
    Game_CharacterBase.prototype.incrementTotalDpf = function (dpf) {
        this._totalDpf += dpf;
        if (this._totalDpf >= 1) {
            this.increaseSteps();
            this._totalDpf -= Math.floor(this._totalDpf);
        }
    };
    Game_CharacterBase.prototype.moveStraight = function (d) {
        this.mover().moveStraight(d, this._moveUnit);
    };
    Game_CharacterBase.prototype.moveDiagonally = function (horz, vert) {
        this.mover().moveDiagonally(horz, vert, this._moveUnit);
    };
    Game_CharacterBase.prototype.positionPoint = function () {
        return new DotMovePoint(this._realX, this._realY);
    };
    Game_CharacterBase.prototype.centerPositionPoint = function () {
        return new DotMovePoint(this.centerRealX(), this.centerRealY());
    };
    Game_CharacterBase.prototype.setPositionPoint = function (point) {
        // 座標補正
        const marginUnit = DotMoveUtils.MARGIN_UNIT;
        const x = Math.round(point.x * marginUnit) / marginUnit;
        const y = Math.round(point.y * marginUnit) / marginUnit;
        this.setPosition(x, y);
        // ループマップでsetPositionを行うと整数座標が範囲外の値になる場合があるため、それを防ぐ
        if ($gameMap.isLoopHorizontal())
            this._x %= $gameMap.width();
        if ($gameMap.isLoopVertical())
            this._y %= $gameMap.height();
    };
    const _Game_CharacterBase_jump = Game_CharacterBase.prototype.jump;
    Game_CharacterBase.prototype.jump = function (xPlus, yPlus) {
        // ループマップで加算後の整数座標がループ実施前の値になるようにする
        this.setPosition(this._realX, this._realY);
        _Game_CharacterBase_jump.call(this, xPlus, yPlus);
    };
    // 移動が完了してからスルー状態を設定する
    Game_CharacterBase.prototype.setThrough = function (through) {
        if (this.isMoving()) {
            this._setThroughReserve = through;
        }
        else {
            this._through = through;
        }
    };
    // 移動が完了してから移動速度の変更を反映する
    Game_CharacterBase.prototype.setMoveSpeed = function (moveSpeed) {
        if (this.isMoving()) {
            this._setMoveSpeedReserve = moveSpeed;
        }
        else {
            this._moveSpeed = moveSpeed;
        }
    };
    Game_CharacterBase.prototype.centerRealX = function () {
        return this._realX + this.width() / 2;
    };
    Game_CharacterBase.prototype.centerRealY = function () {
        return this._realY + this.height() / 2;
    };
    // タッチ幅(キャラクターとのタッチ判定に必要な幅)を取得する。
    // タッチ幅はキャラクターのスライドやイベント起動用の衝突判定に使用する。
    Game_CharacterBase.prototype.minTouchWidth = function () {
        const width = this.width();
        return width >= 1 ? 0.5 : width / 2;
    };
    Game_CharacterBase.prototype.minTouchHeight = function () {
        const height = this.height();
        return height >= 1 ? 0.5 : height / 2;
    };
    // スクロール座標にオフセットを反映させる
    Game_CharacterBase.prototype.scrolledX = function () {
        return $gameMap.adjustX(this._realX + this.offsetX());
    };
    Game_CharacterBase.prototype.scrolledY = function () {
        return $gameMap.adjustY(this._realY + this.offsetY());
    };
    Game_CharacterBase.prototype.collisionRect = function () {
        return new DotMoveRectangle(this._realX, this._realY, this.width(), this.height());
    };
    const _Game_CharacterBase_setPosition = Game_CharacterBase.prototype.setPosition;
    Game_CharacterBase.prototype.setPosition = function (x, y) {
        // 初回座標設定時は$gameMapと$dataMapが生成されないため、座標の丸めは行わない
        if ($gameMap && $dataMap) {
            x = $gameMap.roundX(x);
            y = $gameMap.roundY(y);
        }
        _Game_CharacterBase_setPosition.call(this, x, y);
        this.updateMapCharactersCache();
    };
    const _Game_CharacterBase_copyPosition = Game_CharacterBase.prototype.copyPosition;
    Game_CharacterBase.prototype.copyPosition = function (character) {
        _Game_CharacterBase_copyPosition.call(this, character);
        this.updateMapCharactersCache();
    };
    Game_CharacterBase.prototype.updateMapCharactersCache = function () {
        this.dotMoveTempData().mapCharacterCacheUpdater.updateMapCharactersCache();
    };
    Game_CharacterBase.prototype.removeMapCharactersCache = function () {
        this.dotMoveTempData().mapCharacterCacheUpdater.removeMapCharactersCache();
    };
    Game_CharacterBase.prototype.prepareUpdate = function () {
        this._clearMovedFlagRequested = true;
    };
    Game_CharacterBase.prototype.clearMovedFlagIfRequested = function () {
        if (this._clearMovedFlagRequested) {
            this._moved = false;
            this._clearMovedFlagRequested = false;
        }
    };
    Game_CharacterBase.prototype.moveCallback = function (moved, dpf) {
        if (moved) {
            this._moving = true;
            this._moved = true;
            this.setMovementSuccess(true);
            this.incrementTotalDpf(dpf);
        }
        else {
            this.setMovementSuccess(false);
        }
        this.checkEventTriggerTouchFront(this.direction());
    };
    Game_CharacterBase.prototype.canPass = function (x, y, d, opt = {}) {
        const needCheckCharacters = opt.needCheckCharacters == null ? true : opt.needCheckCharacters;
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
        if (needCheckCharacters) {
            if (this.isCollidedWithCharacters(x2, y2, d)) {
                return false;
            }
        }
        return true;
    };
    Game_CharacterBase.prototype.canPassDiagonally = function (x, y, horz, vert, opt = {}) {
        const x2 = $gameMap.roundXWithDirection(x, horz);
        const y2 = $gameMap.roundYWithDirection(y, vert);
        if (this.canPass(x, y, vert, opt) && this.canPass(x, y2, horz, opt)) {
            if (this.canPass(x, y, horz, opt) && this.canPass(x2, y, vert, opt)) {
                return true;
            }
        }
        return false;
    };
    Game_CharacterBase.prototype.isCollidedWithCharacters = function (x, y, d = this.direction()) {
        const collisionResults = this.mover().checkCollisionCharacters(x, y, d, Game_CharacterBase);
        if (collisionResults.length === 0)
            return false;
        let canSlide = true;
        const axis = DotMoveUtils.direction2Axis(d);
        if (axis === "x") {
            const collisionLength = Math.max(...collisionResults.map(result => result.collisionLengthY()));
            if (collisionLength > this.slideLengthY())
                canSlide = false;
        }
        else {
            const collisionLength = Math.max(...collisionResults.map(result => result.collisionLengthX()));
            if (collisionLength > this.slideLengthX())
                canSlide = false;
        }
        if (!canSlide) {
            const lens = collisionResults.map(result => result.getCollisionLengthByDirection(this.reverseDir(d)));
            const collisionLength = Math.max(...lens);
            if (axis === "x") {
                if (collisionLength > this.minTouchWidth())
                    return true;
            }
            else {
                if (collisionLength > this.minTouchHeight())
                    return true;
            }
        }
        return false;
    };
    Game_CharacterBase.prototype.calcDeg = function (targetCharacter) {
        return this.centerPositionPoint().calcDeg(targetCharacter.centerPositionPoint()).value;
    };
    Game_CharacterBase.prototype.calcFar = function (targetCharacter) {
        return this.centerPositionPoint().calcFar(targetCharacter.centerPositionPoint());
    };
    Game_CharacterBase.prototype.stopMove = function () {
        this._moving = false;
        return this.mover().stopMove();
    };
    Game_CharacterBase.prototype.resumeMove = function () {
        if (this.mover().isMovingToTarget())
            this._moving = true;
        return this.mover().resumeMove();
    };
    Game_CharacterBase.prototype.cancelMove = function () {
        return this.mover().cancelMove();
    };
    Game_CharacterBase.prototype.checkCharacter = function (character) {
        return this.mover().checkCharacter(this._realX, this._realY, this._direction, character);
    };
    Game_CharacterBase.prototype.checkHitCharacters = function (targetCharacterClass) {
        return this.mover().checkHitCharacters(this._realX, this._realY, this._direction, targetCharacterClass);
    };
    Game_CharacterBase.prototype.checkCollisionTargetCharacter = function (x, y, d, character) {
        return false;
    };
    Game_CharacterBase.prototype.checkCollisionTargetPlayer = function (x, y, d, player) {
        if (!player.isThrough())
            return true;
        return false;
    };
    Game_CharacterBase.prototype.checkCollisionTargetFollower = function (x, y, d, follower) {
        if (!follower.isThrough())
            return true;
        return false;
    };
    Game_CharacterBase.prototype.checkCollisionTargetEvent = function (x, y, d, event) {
        if (event.isNormalPriority() && !event.isThrough())
            return true;
        return false;
    };
    Game_CharacterBase.prototype.checkCollisionTargetVehicle = function (x, y, d, vehicle) {
        const boat = $gameMap.boat();
        const ship = $gameMap.ship();
        if (vehicle === boat) {
            if (boat.mapId() === $gameMap.mapId() && !$gamePlayer.isInBoat() && !boat.isThrough()) {
                return true;
            }
        }
        else if (vehicle === ship) {
            if (ship.mapId() === $gameMap.mapId() && !$gamePlayer.isInShip() && !ship.isThrough()) {
                return true;
            }
        }
        return false;
    };
    Game_Character.prototype.findDirectionTo = function (goalX, goalY, searchLimit = this.searchLimit()) {
        const result = AStarUtils.computeRoute(this, this.x, this.y, goalX, goalY, searchLimit);
        if (!result)
            return 0;
        const { best, start } = result;
        let node = best;
        while (node.parent && node.parent !== start) {
            node = node.parent;
        }
        const deltaX1 = $gameMap.deltaX(node.x, start.x);
        const deltaY1 = $gameMap.deltaY(node.y, start.y);
        if (deltaX1 === 0 && deltaY1 < 0) {
            return 8;
        }
        else if (deltaX1 > 0 && deltaY1 < 0) {
            return 9;
        }
        else if (deltaX1 > 0 && deltaY1 === 0) {
            return 6;
        }
        else if (deltaX1 > 0 && deltaY1 > 0) {
            return 3;
        }
        else if (deltaX1 === 0 && deltaY1 > 0) {
            return 2;
        }
        else if (deltaX1 < 0 && deltaY1 > 0) {
            return 1;
        }
        else if (deltaX1 < 0 && deltaY1 === 0) {
            return 4;
        }
        else if (deltaX1 < 0 && deltaY1 < 0) {
            return 7;
        }
        const deltaX2 = this.deltaXFrom(goalX);
        const deltaY2 = this.deltaYFrom(goalY);
        if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
            if (deltaX2 > 0 && deltaY2 < 0) {
                return 3;
            }
            else if (deltaX2 > 0 && deltaY2 === 0) {
                return 4;
            }
            else if (deltaX2 > 0 && deltaY2 > 0) {
                return 7;
            }
            else if (deltaX2 < 0 && deltaY2 > 0) {
                return 9;
            }
            else if (deltaX2 < 0 && deltaY2 === 0) {
                return 6;
            }
            else if (deltaX2 < 0 && deltaY2 < 0) {
                return 3;
            }
        }
        else if (deltaY2 !== 0) {
            if (deltaY2 < 0 && deltaX2 < 0) {
                return 3;
            }
            else if (deltaY2 < 0 && deltaX2 === 0) {
                return 2;
            }
            else if (deltaY2 < 0 && deltaX2 > 0) {
                return 1;
            }
            else if (deltaY2 > 0 && deltaX2 > 0) {
                return 7;
            }
            else if (deltaY2 > 0 && deltaX2 === 0) {
                return 8;
            }
            else if (deltaY2 > 0 && deltaX2 < 0) {
                return 9;
            }
        }
        return 0;
    };
    Game_Character.prototype.updateRoutineMove = function () {
        if (this._waitCount > 0) {
            this._waitCount--;
        }
        else {
            // 移動中でない場合、ルート更新を行う
            if (!this.isMoving()) {
                this.setMovementSuccess(true);
                if (this._moveRoute) {
                    const command = this._moveRoute.list[this._moveRouteIndex];
                    if (command) {
                        this.processMoveCommand(command);
                        this.advanceMoveRouteIndex();
                    }
                }
            }
        }
    };
    Game_Character.prototype.moveRandom = function () {
        const d = 2 + Math.randomInt(4) * 2;
        // canPassは行わない
        this.moveStraight(d);
    };
    Game_Character.prototype.dotMoveByDeg = function (deg) {
        this.mover().dotMoveByDeg(new Degree(deg));
    };
    Game_Character.prototype.moveByDirection = function (direction) {
        this.mover().moveByDirection(direction, this._moveUnit);
    };
    Game_Character.prototype.dotMoveToPlayer = function () {
        const deg = this.calcDeg($gamePlayer);
        this.dotMoveByDeg(deg);
    };
    Game_Character.prototype.moveToTarget = function (x, y) {
        this.mover().moveToTarget(new DotMovePoint(x, y));
    };
    Game_Character.prototype.deltaRealXFrom = function (x) {
        return $gameMap.deltaX(this.centerRealX(), x);
    };
    Game_Character.prototype.deltaRealYFrom = function (y) {
        return $gameMap.deltaY(this.centerRealY(), y);
    };
    // 整数座標ではなく実数座標で処理するように変更
    Game_Character.prototype.moveTowardCharacter = function (character) {
        const sx = this.deltaRealXFrom(character.centerRealX());
        const sy = this.deltaRealYFrom(character.centerRealY());
        if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 4 : 6);
            if (!this.isMovementSucceeded() && sy !== 0) {
                this.moveStraight(sy > 0 ? 8 : 2);
            }
        }
        else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
            if (!this.isMovementSucceeded() && sx !== 0) {
                this.moveStraight(sx > 0 ? 4 : 6);
            }
        }
    };
    Game_Character.prototype.moveAwayFromCharacter = function (character) {
        const sx = this.deltaRealXFrom(character.centerRealX());
        const sy = this.deltaRealYFrom(character.centerRealY());
        if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 6 : 4);
            if (!this.isMovementSucceeded() && sy !== 0) {
                this.moveStraight(sy > 0 ? 2 : 8);
            }
        }
        else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 2 : 8);
            if (!this.isMovementSucceeded() && sx !== 0) {
                this.moveStraight(sx > 0 ? 6 : 4);
            }
        }
    };
    Game_Character.prototype.turnTowardCharacter = function (character) {
        if (this.x === character.x && this.y === character.y)
            return;
        const sx = this.deltaRealXFrom(character.centerRealX());
        const sy = this.deltaRealYFrom(character.centerRealY());
        if (Math.abs(sx) > Math.abs(sy)) {
            this.setDirection(sx > 0 ? 4 : 6);
        }
        else if (sy !== 0) {
            this.setDirection(sy > 0 ? 8 : 2);
        }
    };
    Game_Character.prototype.turnAwayFromCharacter = function (character) {
        if (this.x === character.x && this.y === character.y)
            return;
        const sx = this.deltaRealXFrom(character.centerRealX());
        const sy = this.deltaRealYFrom(character.centerRealY());
        if (Math.abs(sx) > Math.abs(sy)) {
            this.setDirection(sx > 0 ? 6 : 4);
        }
        else if (sy !== 0) {
            this.setDirection(sy > 0 ? 2 : 8);
        }
    };
    const _Game_Player_initMembers = Game_Player.prototype.initMembers;
    Game_Player.prototype.initMembers = function () {
        _Game_Player_initMembers.call(this);
        this._needCountProcess = false;
        this._gatherStart = false;
        this._shipOrBoatTowardingLand = false; // 船から陸地に移動しているか否かを管理するフラグ
        this._getOffVehicleIntPos = false; // 乗り物から降りる際に整数座標に着地するか否かを管理するフラグ
        this._moveSpeedBeforeGetOnVehicle = this._moveSpeed;
    };
    Game_Player.prototype.createDotMoveTempData = function () {
        return new PlayerDotMoveTempData(this);
    };
    Game_Player.prototype.needDiagonalSlideX = function () {
        if (this.width() === 1) {
            return true;
        }
        return false;
    };
    Game_Player.prototype.needDiagonalSlideY = function () {
        if (this.height() === 1) {
            return true;
        }
        return false;
    };
    Game_Player.prototype.executeMove = function (direction) {
        this.mover().dotMoveByDirection(direction);
    };
    Game_Player.prototype.getInputDirection = function () {
        return Input.dir8;
    };
    Game_Player.prototype.moveByInput = function () {
        if (!this.isMoving() && this.canMove()) {
            const direction = this.getInputDirection();
            if (direction > 0) {
                $gameTemp.clearDestination();
                $gameTemp.setBeforeTouchMovedPoint(undefined);
                this.executeMove(direction);
            }
            else if ($gameTemp.isDestinationValid()) {
                this.startTouchMove();
            }
        }
    };
    Game_Player.prototype.startTouchMove = function () {
        const x = $gameTemp.destinationX();
        const y = $gameTemp.destinationY();
        const direction = this.findDirectionTo(x, y);
        if (direction > 0) {
            const beforeTouchMovedPoint = $gameTemp.beforeTouchMovedPoint();
            const currentPoint = new DotMovePoint(this.x, this.y);
            const nextPoint = DotMoveUtils.nextPointWithDirection(currentPoint, direction);
            if (!(beforeTouchMovedPoint && beforeTouchMovedPoint.equals(nextPoint))) {
                if (x === nextPoint.x && y === nextPoint.y) {
                    this.mover().moveToTarget(nextPoint);
                }
                else {
                    this.mover().moveByDirection(direction, 1);
                }
                $gameTemp.setBeforeTouchMovedPoint(currentPoint);
            }
        }
    };
    Game_Player.prototype.forceMoveOnVehicle = function () {
        this._dashing = false;
        this.setMoveSpeed(4);
        this.setThrough(true);
        const point = this.vehicle().positionPoint();
        this.mover().moveToTarget(point);
        this.setThrough(false);
    };
    Game_Player.prototype.forceMoveOffAirship = function () {
        this.setMoveSpeed(4);
        // リセットした乗り物の向きにプレイヤーを合わせる
        this.setDirection(this.vehicle().direction());
        // 整数座標への着地中は飛行船とプレイヤーの向きを固定化
        // 固定化OFFはupdateVehicleGetOffで実施する
        this.vehicle().setDirectionFix(true);
        this.setDirectionFix(true);
        if (this._getOffVehicleIntPos) {
            // 乗り物から降りた時にハマらないように整数座標に着陸する
            const targetPoint = new DotMovePoint(this.x, this.y);
            this.mover().moveToTarget(targetPoint);
        }
    };
    Game_Player.prototype.forceMoveOffShipOrBoat = function () {
        this.setMoveSpeed(4);
        this.setThrough(true);
        let fromPoint;
        if (this._getOffVehicleIntPos) {
            // 乗り物から降りた時にハマらないように整数座標に着陸する
            fromPoint = new DotMovePoint(this.x, this.y);
        }
        else {
            fromPoint = this.positionPoint();
        }
        const targetPoint = DotMoveUtils.nextPointWithDirection(fromPoint, this.direction());
        this.mover().moveToTarget(targetPoint);
        this.setThrough(false);
    };
    Game_Player.prototype.update = function (sceneActive) {
        this.clearMovedFlagIfRequested();
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
        if (this._needCountProcess)
            this.updateCountProcess(sceneActive);
        this.followers().update();
    };
    Game_Player.prototype.updateRemoveCollideTriggerEventIds = function () {
        if (this.isMoving() || this.isJumping())
            return; // 船から降りた場合やジャンプ先のイベントを起動対象外にする
        const tempData = this.dotMoveTempData();
        for (const eventId of tempData.collideTriggerEventIds) {
            const event = $gameMap.event(eventId);
            if (event) {
                const result = this.checkCharacter(event);
                if (result && result.collisionLengthX() >= event.widthArea() && result.collisionLengthY() >= event.heightArea()) {
                    continue;
                }
            }
            tempData.collideTriggerEventIds = tempData.collideTriggerEventIds.filter(id => id !== eventId);
        }
    };
    if (!Game_Player.prototype.hasOwnProperty("updateJump")) {
        Game_Player.prototype.updateJump = function () {
            Game_Character.prototype.updateJump.call(this);
        };
    }
    const _Game_Player_updateJump = Game_Player.prototype.updateJump;
    Game_Player.prototype.updateJump = function () {
        _Game_Player_updateJump.call(this);
        if (!this.isJumping())
            this.setupCollideTriggerEventIds();
    };
    const _Game_Player_increaseSteps = Game_Player.prototype.increaseSteps;
    Game_Player.prototype.increaseSteps = function () {
        _Game_Player_increaseSteps.call(this);
        // 歩数が増加した場合、歩数増加時の処理をupdateで実行するため、
        // ここでフラグをtrueにしておく
        this._needCountProcess = true;
    };
    Game_Player.prototype.updateCountProcess = function (sceneActive) {
        if ($gameMap.isEventRunning())
            return;
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
    Game_Player.prototype.updateNonmoving = function (wasMoving, sceneActive) {
        if ($gameMap.isEventRunning()) {
            this.setupCollideTriggerEventIds();
        }
        else {
            if (wasMoving) {
                if (!this._vehicleGettingOn) {
                    this.checkEventTriggerHere([1, 2]);
                }
                if ($gameMap.setupStartingEvent()) {
                    return;
                }
            }
            if (sceneActive && this.triggerAction()) {
                return;
            }
            if (!wasMoving) {
                $gameTemp.clearDestination();
                $gameTemp.setBeforeTouchMovedPoint(undefined);
            }
        }
    };
    Game_Player.prototype.setupCollideTriggerEventIds = function () {
        const tempData = this.dotMoveTempData();
        tempData.collideTriggerEventIds = [];
        for (const result of this.checkHitCharacters(Game_Event)) {
            const event = result.targetObject;
            const eventId = event.eventId();
            if (result.collisionLengthX() >= event.widthArea() && result.collisionLengthY() >= event.heightArea()) {
                tempData.collideTriggerEventIds.push(eventId);
            }
        }
    };
    Game_Player.prototype.getOnVehicle = function () {
        if (this._vehicleType !== "walk")
            return false;
        const vehicleType = this.checkRideVehicles();
        if (vehicleType) {
            this._vehicleType = vehicleType;
            this._vehicleGettingOn = true;
            this._moveSpeedBeforeGetOnVehicle = this.moveSpeed();
            this.forceMoveOnVehicle();
            this.gatherFollowers();
        }
        return this._vehicleGettingOn;
    };
    Game_Player.prototype.checkRideVehicles = function () {
        const airship = $gameMap.airship();
        const ship = $gameMap.ship();
        const boat = $gameMap.boat();
        let airshipResult;
        let shipResult;
        let boatResult;
        if (airship.mapId() === $gameMap.mapId() && !airship.isThrough()) {
            airshipResult = this.checkCharacter(airship);
        }
        if (airshipResult && airshipResult.collisionLengthX() >= this.minTouchWidth() && airshipResult.collisionLengthY() >= this.minTouchHeight()) {
            return "airship";
        }
        else {
            const nextPoint = DotMoveUtils.nextPointWithDirection(this.positionPoint(), this.direction());
            if (ship.mapId() === $gameMap.mapId() && !ship.isThrough()) {
                shipResult = this.mover().checkCharacter(nextPoint.x, nextPoint.y, this.direction(), ship);
            }
            if (shipResult && shipResult.collisionLengthX() >= this.minTouchWidth() && shipResult.collisionLengthY() >= this.minTouchHeight()) {
                return "ship";
            }
            else {
                if (boat.mapId() === $gameMap.mapId() && !boat.isThrough()) {
                    boatResult = this.mover().checkCharacter(nextPoint.x, nextPoint.y, this.direction(), boat);
                }
                if (boatResult && boatResult.collisionLengthX() >= this.minTouchWidth() && boatResult.collisionLengthY() >= this.minTouchHeight()) {
                    return "boat";
                }
            }
        }
        return undefined;
    };
    Game_Player.prototype.getOffVehicle = function () {
        if (this.isInAirship()) {
            return this.getOffAirship();
        }
        else {
            return this.getOffShipOrBoat();
        }
    };
    Game_Player.prototype.getOffAirship = function () {
        if (!this.checkAirshipLandOk(this.positionPoint())) {
            if (!this.checkAirshipLandOk(new DotMovePoint(this.x, this.y))) {
                return false;
            }
            this._getOffVehicleIntPos = true;
        }
        this.getOffVehicleLastPhase();
        return true;
    };
    Game_Player.prototype.getOffShipOrBoat = function () {
        const d = this.direction();
        this._shipOrBoatTowardingLand = true;
        const axis = DotMoveUtils.direction2Axis(d);
        const x = (axis === "y") ? this._realX : this.x;
        const y = (axis === "x") ? this._realY : this.y;
        let point = new DotMovePoint(x, y);
        if (!this.checkShipOrBoatLandOk(point)) {
            // 着陸座標で衝突が発生する場合は整数座標に着陸する
            const intPoint = new DotMovePoint(this.x, this.y);
            const results = this.mover().checkCollision(intPoint.x, intPoint.y, d);
            if (results.length > 0 || !this.checkShipOrBoatLandOk(intPoint)) {
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
        return true;
    };
    Game_Player.prototype.checkAirshipLandOk = function (pos) {
        const rect = new DotMoveRectangle(pos.x, pos.y, this.width(), this.height());
        const massRange = MassRange.fromRect(rect);
        for (let ix = massRange.x; ix <= massRange.x2; ix++) {
            for (let iy = massRange.y; iy <= massRange.y2; iy++) {
                if (!this.vehicle().isLandOk(ix, iy, this.direction()))
                    return false;
            }
        }
        return !this.isGetOffCollided(pos);
    };
    Game_Player.prototype.checkShipOrBoatLandOk = function (pos) {
        const rect = new DotMoveRectangle(pos.x, pos.y, this.width(), this.height());
        const massRange = MassRange.fromRect(rect);
        const d = this.direction();
        let x1 = massRange.x;
        let y1 = massRange.y;
        let x2 = massRange.x2;
        let y2 = massRange.y2;
        switch (d) {
            case 8:
                y2 = y1;
                break;
            case 6:
                x1 = x2;
                break;
            case 2:
                y1 = y2;
                break;
            case 4:
                x2 = x1;
                break;
        }
        for (let ix = x1; ix <= x2; ix++) {
            for (let iy = y1; iy <= y2; iy++) {
                if (!this.vehicle().isLandOk(ix, iy, d))
                    return false;
            }
        }
        const nextPos = DotMoveUtils.nextPointWithDirection(pos, d);
        return !this.isGetOffCollided(nextPos);
    };
    Game_Player.prototype.isGetOffCollided = function (pos) {
        const tmpVehicleType = this._vehicleType;
        const tmpThrough = this._through;
        this._vehicleType = "walk";
        this._through = false;
        const results = this.mover().checkCollision(pos.x, pos.y, this.direction());
        this._vehicleType = tmpVehicleType;
        this._through = tmpThrough;
        return results.length > 0;
    };
    Game_Player.prototype.getOffVehicleLastPhase = function () {
        for (const follower of this.followers().data()) {
            follower.setDirectionFix(false);
        }
        if (this._getOffVehicleIntPos) {
            this.followers().synchronize(this.x, this.y, this.direction());
        }
        else {
            this.followers().synchronize(this._realX, this._realY, this.direction());
        }
        this.vehicle().getOff();
        if (this.isInAirship()) {
            this.forceMoveOffAirship();
        }
        else {
            this.forceMoveOffShipOrBoat();
            this.setTransparent(false);
        }
        this._vehicleGettingOff = true;
        this.setThrough(false);
        this.makeEncounterCount();
    };
    Game_Player.prototype.updateTowardLandShipOrBoat = function () {
        this.vehicle().syncWithPlayer();
        if (!this.isMoving()) {
            if (this._getOffVehicleIntPos) {
                // 整数座標への移動完了後は確実に座標を整数に設定する
                this.setPositionPoint(new DotMovePoint(this.x, this.y));
            }
            else {
                // 船で実数座標に着陸した場合の座標調整を実施する
                const d = this.direction();
                const axis = DotMoveUtils.direction2Axis(d);
                const x = (axis === "y") ? this._realX : this.x;
                const y = (axis === "x") ? this._realY : this.y;
                this.setPositionPoint(new DotMovePoint(x, y));
            }
            this.vehicle().syncWithPlayer();
            this._shipOrBoatTowardingLand = false;
            this.setDirectionFix(false);
            this.getOffVehicleLastPhase();
        }
    };
    Game_Player.prototype.updateVehicle = function () {
        if (this._shipOrBoatTowardingLand) {
            this.updateTowardLandShipOrBoat();
        }
        else if (this.isInVehicle() && !this.areFollowersGathering()) {
            if (this._vehicleGettingOn) {
                this.updateVehicleGetOn();
            }
            else if (this._vehicleGettingOff) {
                this.updateVehicleGetOff();
            }
            else {
                this.vehicle().syncWithPlayer();
            }
        }
    };
    Game_Player.prototype.updateVehicleGetOff = function () {
        // 飛行船着地中はプレイヤーと飛行船の位置を同期させる
        if (this.isInAirship()) {
            this.vehicle().syncWithPlayer();
        }
        if (this._gatherStart) {
            if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
                if (this._getOffVehicleIntPos) {
                    // 整数座標への移動完了後は確実に座標を整数に設定する
                    this.setPositionPoint(new DotMovePoint(this.x, this.y));
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
        }
        else {
            if (!this.isMoving()) {
                this.gatherFollowers();
                this._gatherStart = true;
                this.setupCollideTriggerEventIds();
            }
        }
    };
    Game_Player.prototype.startMapEvent = function (x, y, triggers, normal) {
        if ($gameMap.isEventRunning())
            return;
        const tempData = this.dotMoveTempData();
        const hasDecideTrigger = triggers.includes(0);
        for (const result of this.mover().checkHitCharacters(x, y, this._direction, Game_Event)) {
            const event = result.targetObject;
            const eventId = event.eventId();
            if (!hasDecideTrigger) {
                if (tempData.collideTriggerEventIds.includes(eventId))
                    continue;
            }
            if (result.collisionLengthX() >= event.widthArea() && result.collisionLengthY() >= event.heightArea()) {
                if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                    if (!hasDecideTrigger) {
                        if (!tempData.collideTriggerEventIds.includes(eventId)) {
                            tempData.collideTriggerEventIds.push(eventId);
                        }
                    }
                    event.start();
                }
            }
        }
    };
    Game_Player.prototype.startMapEventFront = function (x, y, d, triggers, normal, isTouch) {
        if ($gameMap.isEventRunning())
            return;
        if (isTouch && (this.isThrough() || this.isDebugThrough()))
            return;
        const dpf = this.distancePerFrame();
        for (const result of this.mover().checkHitCharactersStepDir(x, y, d, Game_Event)) {
            const event = result.targetObject;
            const axis = DotMoveUtils.direction2Axis(d);
            const otherAxis = axis === "y" ? "x" : "y";
            const area = otherAxis === "x" ? event.widthArea() : event.heightArea();
            const otherAxisLen = isTouch ? dpf * 0.75 : 0;
            if (result.getCollisionLength(otherAxis) >= area && result.getCollisionLength(axis) >= otherAxisLen) {
                if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                    if (isTouch && event.isThrough())
                        continue;
                    event.start();
                }
            }
        }
    };
    Game_Player.prototype.triggerTouchAction = function () {
        if ($gameTemp.isDestinationValid()) {
            const direction = this.direction();
            const x1 = this.x;
            const y1 = this.y;
            const x2 = $gameMap.roundXWithDirection(x1, direction);
            const y2 = $gameMap.roundYWithDirection(y1, direction);
            const destX = $gameTemp.destinationX();
            const destY = $gameTemp.destinationY();
            if (destX === x1 && destY === y1) {
                return this.triggerTouchActionD1(x1, y1);
            }
            else if (destX === x2 && destY === y2) {
                return this.triggerTouchActionD2(x2, y2);
            }
            else {
                const axis = DotMoveUtils.direction2Axis(direction);
                if (axis === "x") {
                    if (destX !== x1)
                        return false;
                }
                else {
                    if (destY !== y1)
                        return false;
                }
                const dest = new DotMovePoint(destX, destY);
                const prev = DotMoveUtils.prevPointWithDirection(dest, direction);
                return this.triggerTouchActionD3(prev.x, prev.y);
            }
        }
        return false;
    };
    Game_Player.prototype.checkEventTriggerTouchFront = function (d) {
        if (this.canStartLocalEvents()) {
            // トリガー  0: 決定ボタン 1: プレイヤーから接触 2: イベントから接触
            this.startMapEventFront(this._realX, this._realY, d, [1, 2], true, true);
        }
    };
    Game_Player.prototype.checkEventTriggerHere = function (triggers) {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(this._realX, this._realY, triggers, false);
        }
    };
    Game_Player.prototype.checkEventTriggerThere = function (triggers) {
        if (this.canStartLocalEvents()) {
            const direction = this.direction();
            this.startMapEventFront(this._realX, this._realY, this._direction, triggers, true, false);
            if ($gameMap.isAnyEventStarting())
                return;
            let currentPoint = this.positionPoint();
            while (true) {
                let nextPoint = DotMoveUtils.nextPointWithDirection(currentPoint, direction);
                let nextX = Math.round(nextPoint.x);
                let nextY = Math.round(nextPoint.y);
                if ($gameMap.isCounter(nextX, nextY)) {
                    this.startMapEventFront(nextPoint.x, nextPoint.y, this._direction, triggers, true, false);
                    if ($gameMap.isAnyEventStarting())
                        break;
                }
                else {
                    break;
                }
                currentPoint = nextPoint;
            }
        }
    };
    // プレイヤーの場合は処理をしない
    Game_Player.prototype.dotMoveToPlayer = function () {
    };
    Game_Player.prototype.checkCollisionTargetCharacter = function (x, y, d, character) {
        if (character instanceof Game_Event) {
            return this.checkCollisionTargetEvent(x, y, d, character);
        }
        else if (character instanceof Game_Vehicle) {
            return this.checkCollisionTargetVehicle(x, y, d, character);
        }
        return false;
    };
    Game_Event.prototype.createDotMoveTempData = function () {
        return new EventDotMoveTempData(this);
    };
    Game_Event.prototype.width = function () {
        if (this._width != null)
            return this._width;
        return this.dotMoveTempData().width;
    };
    Game_Event.prototype.height = function () {
        if (this._height != null)
            return this._height;
        return this.dotMoveTempData().height;
    };
    Game_Event.prototype.offsetX = function () {
        if (this._offsetX != null)
            return this._offsetX;
        return this.dotMoveTempData().offsetX;
    };
    Game_Event.prototype.offsetY = function () {
        if (this._offsetY != null)
            return this._offsetY;
        return this.dotMoveTempData().offsetY;
    };
    Game_Event.prototype.slideLengthX = function () {
        if (this._slideLengthX != null)
            return this._slideLengthX;
        const slideLengthX = this.dotMoveTempData().slideLengthX;
        return slideLengthX == null ? this.minTouchWidth() : slideLengthX;
    };
    Game_Event.prototype.slideLengthY = function () {
        if (this._slideLengthY != null)
            return this._slideLengthY;
        const slideLengthY = this.dotMoveTempData().slideLengthY;
        return slideLengthY == null ? this.minTouchHeight() : slideLengthY;
    };
    Game_Event.prototype.widthArea = function () {
        if (this._widthArea != null)
            return this._widthArea;
        return this.dotMoveTempData().widthArea;
    };
    Game_Event.prototype.setWidthArea = function (widthArea) {
        this._widthArea = widthArea;
    };
    Game_Event.prototype.heightArea = function () {
        if (this._heightArea != null)
            return this._heightArea;
        return this.dotMoveTempData().heightArea;
    };
    Game_Event.prototype.setHeightArea = function (heightArea) {
        this._heightArea = heightArea;
    };
    Game_Event.prototype.getAnnotationValues = function (page) {
        const note = this.getAnnotation(page);
        const data = { note };
        DataManager.extractMetadata(data);
        return data.meta;
    };
    Game_Event.prototype.getAnnotation = function (page) {
        const eventData = this.event();
        if (eventData) {
            const noteLines = [];
            const pageList = eventData.pages[page].list;
            for (let i = 0; i < pageList.length; i++) {
                if (pageList[i].code === 108 || pageList[i].code === 408) {
                    noteLines.push(pageList[i].parameters[0]);
                }
                else {
                    break;
                }
            }
            return noteLines.join("\n");
        }
        return "";
    };
    Game_Event.prototype.isCollidedWithCharacters = function (x, y, d = this.direction()) {
        return Game_Character.prototype.isCollidedWithCharacters.call(this, x, y, d);
    };
    Game_Event.prototype.checkEventTriggerTouchFront = function (d) {
        if ($gamePlayer.isThrough())
            return;
        if (this._trigger === 2) {
            const result = this.mover().checkCharacterStepDir(this._realX, this._realY, d, $gamePlayer);
            if (!result)
                return;
            const axis = DotMoveUtils.direction2Axis(this._direction);
            const axisLen = this.distancePerFrame() * 0.75;
            const otherAxis = axis === "y" ? "x" : "y";
            const playerMinTouchWidthOrHeight = otherAxis === "x" ? $gamePlayer.minTouchWidth() : $gamePlayer.minTouchHeight();
            const eventWidthOrHeightArea = otherAxis === "x" ? this.widthArea() : this.heightArea();
            const widthOrHeightArea = Math.min(playerMinTouchWidthOrHeight, eventWidthOrHeightArea);
            if (result.getCollisionLength(otherAxis) >= widthOrHeightArea && result.getCollisionLength(axis) >= axisLen) {
                if (!this.isJumping() && this.isNormalPriority()) {
                    if (!$gameMap.isEventRunning()) {
                        this.dotMoveTempData().eventTouchToPlayer = true;
                        this.start();
                    }
                }
            }
        }
    };
    const _Game_Event_lock = Game_Event.prototype.lock;
    Game_Event.prototype.lock = function () {
        _Game_Event_lock.call(this);
        // イベントからプレイヤーに接触した場合、移動再開時に再びイベントが起動してしまうため、
        // この場合は移動の停止と再開を実施しない。
        if (!this.dotMoveTempData().eventTouchToPlayer) {
            this.stopMove();
        }
    };
    const _Game_Event_unlock = Game_Event.prototype.unlock;
    Game_Event.prototype.unlock = function () {
        _Game_Event_unlock.call(this);
        if (!this.dotMoveTempData().eventTouchToPlayer) {
            this.resumeMove();
        }
        this.dotMoveTempData().eventTouchToPlayer = false;
    };
    Game_Event.prototype.checkCollisionTargetCharacter = function (x, y, d, character) {
        if (character instanceof Game_Player) {
            return this.checkCollisionTargetPlayer(x, y, d, character);
        }
        else if (character instanceof Game_Follower) {
            if (character.isVisible()) {
                return this.checkCollisionTargetFollower(x, y, d, character);
            }
        }
        else if (character instanceof Game_Event) {
            return this.checkCollisionTargetEvent(x, y, d, character);
        }
        else if (character instanceof Game_Vehicle) {
            return this.checkCollisionTargetVehicle(x, y, d, character);
        }
        return false;
    };
    Game_Event.prototype.checkCollisionTargetPlayer = function (x, y, d, player) {
        if (!this.isNormalPriority())
            return false;
        return Game_Character.prototype.checkCollisionTargetPlayer(x, y, d, player);
    };
    Game_Event.prototype.checkCollisionTargetFollower = function (x, y, d, follower) {
        if (!this.isNormalPriority())
            return false;
        return Game_Character.prototype.checkCollisionTargetFollower(x, y, d, follower);
    };
    const _Game_Follower_initialize = Game_Follower.prototype.initialize;
    Game_Follower.prototype.initialize = function (memberIndex) {
        _Game_Follower_initialize.call(this, memberIndex);
        this.setThrough(false);
    };
    Game_Follower.prototype.createDotMoveTempData = function () {
        return new FollowerDotMoveTempData(this);
    };
    Game_Follower.prototype.slideLengthX = function () {
        if (this._slideLengthX != null)
            return this._slideLengthX;
        const len = this.minTouchWidth();
        return len + len / 2;
    };
    Game_Follower.prototype.slideLengthY = function () {
        if (this._slideLengthY != null)
            return this._slideLengthY;
        const len = this.minTouchHeight();
        return len + len / 2;
    };
    Game_Follower.prototype.needDiagonalSlideX = function () {
        if (this.width() === 1) {
            return true;
        }
        return false;
    };
    Game_Follower.prototype.needDiagonalSlideY = function () {
        if (this.height() === 1) {
            return true;
        }
        return false;
    };
    if (!Game_Follower.prototype.hasOwnProperty("isThrough")) {
        Game_Follower.prototype.isThrough = function () {
            return Game_Character.prototype.isThrough.call(this);
        };
    }
    const _Game_Follower_isThrough = Game_Follower.prototype.isThrough;
    Game_Follower.prototype.isThrough = function () {
        const result = _Game_Follower_isThrough.call(this);
        // プレイヤーがスルー状態の場合、フォロワーもスルー状態にする
        return result || $gamePlayer.isThrough();
    };
    Game_Follower.prototype.isDebugThrough = function () {
        return $gamePlayer.isDebugThrough();
    };
    Game_Follower.prototype.update = function () {
        Game_Character.prototype.update.call(this);
        // フォロワーの移動速度はchaseCharacterで設定するため、ここでは設定しない
        this.setOpacity($gamePlayer.opacity());
        this.setBlendMode($gamePlayer.blendMode());
        this.setWalkAnime($gamePlayer.hasWalkAnime());
        this.setStepAnime($gamePlayer.hasStepAnime());
        this.setDirectionFix($gamePlayer.isDirectionFixed());
        this.setTransparent($gamePlayer.isTransparent());
    };
    Game_Follower.prototype.chaseCharacter = function (character) {
        if (this.isJumping())
            return;
        if (this.isMoving())
            return;
        if (this.isTransparent())
            return;
        const far = this.calcFar(character);
        if (far >= 1) {
            this.changeFollowerSpeed(far);
            const tempData = this.dotMoveTempData();
            if (far >= 5) {
                // 前のキャラとの距離が5以上離れている場合はすり抜けを行う
                this.setThrough(true);
                const deg = this.calcDeg(character);
                this.dotMoveByDeg(deg);
                tempData.sameDirectionTotalDpf = 0;
            }
            else if (far >= 3 && this.isVisible()) {
                // 前のキャラとの距離が3以上離れている、かつフォロワーが可視状態の場合は経路探索を行う
                this.setThrough(false);
                const dir = this.findDirectionTo(character.x, character.y, 6);
                this.mover().moveByDirection(dir, 1);
                tempData.sameDirectionTotalDpf = 0;
            }
            else {
                // 前のキャラとの距離が1以上離れている場合は360度移動を行う
                this.setThrough(false);
                const deg = this.calcDeg(character);
                this.dotMoveByDeg(deg);
                if (this.isPrecedingCharacterNearDirection(character, deg)) {
                    tempData.sameDirectionTotalDpf += this.distancePerFrame();
                    if (tempData.sameDirectionTotalDpf >= 1) {
                        this.setDirection(character.direction());
                        tempData.sameDirectionTotalDpf = 0;
                    }
                }
                else {
                    tempData.sameDirectionTotalDpf = 0;
                }
            }
        }
    };
    Game_Follower.prototype.isPrecedingCharacterNearDirection = function (character, moveDeg) {
        const dir8 = (new Degree(moveDeg)).toDirection8();
        if (dir8 % 2 === 0) {
            if (dir8 === character.direction())
                return true;
        }
        else {
            switch (dir8) {
                case 9:
                    if (character.direction() === 8 || character.direction() === 6)
                        return true;
                    break;
                case 3:
                    if (character.direction() === 6 || character.direction() === 2)
                        return true;
                    break;
                case 1:
                    if (character.direction() === 2 || character.direction() === 4)
                        return true;
                    break;
                case 7:
                    if (character.direction() === 4 || character.direction() === 8)
                        return true;
                    break;
            }
        }
        return false;
    };
    Game_Follower.prototype.gatherCharacter = function (character) {
        this.setThrough(true);
        if (this.isGathered()) {
            this.setPositionPoint(character.positionPoint());
            this.setThrough(false);
        }
        else {
            this.setMoveSpeed($gamePlayer.moveSpeed());
            const deg = this.calcDeg(character);
            this.dotMoveByDeg(deg);
        }
    };
    Game_Follower.prototype.changeFollowerSpeed = function (precedingCharacterFar) {
        this.setMoveSpeed(this.calcFollowerSpeed(precedingCharacterFar));
    };
    Game_Follower.prototype.calcFollowerSpeed = function (precedingCharacterFar) {
        if (precedingCharacterFar >= 4) {
            return $gamePlayer.realMoveSpeed() + 1;
        }
        else if (precedingCharacterFar >= 2) {
            return $gamePlayer.realMoveSpeed() + 0.5;
        }
        else if (precedingCharacterFar >= 1.5) {
            return $gamePlayer.realMoveSpeed();
        }
        else if (precedingCharacterFar >= 1) {
            return $gamePlayer.realMoveSpeed() - 1;
        }
        else {
            return 0;
        }
    };
    Game_Follower.prototype.isGathered = function () {
        if (this.isMoving())
            return false;
        const margin = this.distancePerFrame() / 2;
        const result = this.checkCharacter($gamePlayer);
        if (!result)
            return false;
        return result.collisionLengthX() >= ($gamePlayer.width() - margin) && result.collisionLengthY() >= ($gamePlayer.height() - margin);
    };
    Game_Follower.prototype.checkCollisionTargetCharacter = function (x, y, d, character) {
        if (character instanceof Game_Event) {
            return this.checkCollisionTargetEvent(x, y, d, character);
        }
        else if (character instanceof Game_Vehicle) {
            return this.checkCollisionTargetVehicle(x, y, d, character);
        }
        return false;
    };
    const _Game_Followers_initialize = Game_Followers.prototype.initialize;
    Game_Followers.prototype.initialize = function () {
        _Game_Followers_initialize.call(this);
        this._gatherCount = 0; // gatherタイムアウト監視用
    };
    if (Utils.RPGMAKER_NAME === "MV") {
        Game_Followers.prototype.data = function () {
            return this._data.clone();
        };
    }
    Game_Followers.prototype.update = function () {
        if (this.areGathering()) {
            this.updateGather();
        }
        else {
            this.updateMove();
        }
        for (const follower of this._data) {
            follower.update();
        }
    };
    Game_Followers.prototype.updateMove = function () {
        for (let i = 0; i < this._data.length; i++) {
            const precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
            this._data[i].chaseCharacter(precedingCharacter);
        }
    };
    Game_Followers.prototype.updateGather = function () {
        if (this.areGathered()) {
            this._gathering = false;
        }
        else {
            for (let i = this._data.length - 1; i >= 0; i--) {
                const precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
                this._data[i].gatherCharacter(precedingCharacter);
            }
        }
    };
    const _Game_Followers_gather = Game_Followers.prototype.gather;
    Game_Followers.prototype.gather = function () {
        _Game_Followers_gather.call(this);
        this._gatherCount = 0;
    };
    const _Game_Followers_areGathering = Game_Followers.prototype.areGathering;
    Game_Followers.prototype.areGathering = function () {
        this._gatherCount++;
        return _Game_Followers_areGathering.call(this);
    };
    Game_Followers.prototype.areGathered = function () {
        // 600フレーム経過してもgatherが終了しない場合、フリーズ回避のために強制的にgatherを終了する
        if (this._gatherCount >= 600) {
            this._gatherCount = 0;
            return true;
        }
        // MVにはGame_Follower#isGatheredがないためGame_Followers#areGatheredの処理を再定義する
        return this.visibleFollowers().every(follower => follower.isGathered());
    };
    Game_Vehicle.prototype.mapId = function () {
        return this._mapId;
    };
    const _Game_Vehicle_getOn = Game_Vehicle.prototype.getOn;
    Game_Vehicle.prototype.getOn = function () {
        _Game_Vehicle_getOn.call(this);
        $gamePlayer.setPositionPoint(this.positionPoint());
        $gamePlayer.setupCollideTriggerEventIds();
    };
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function () {
        _Game_Temp_initialize.call(this);
        this._characterTempDatas = new Map();
        this._lastAllCharacters = new Set();
    };
    Game_Temp.prototype.characterTempData = function (character) {
        let tempData = this._characterTempDatas.get(character);
        if (tempData)
            return tempData;
        tempData = character.createDotMoveTempData();
        this._characterTempDatas.set(character, tempData);
        return tempData;
    };
    Game_Temp.prototype.initCharacterTempDatas = function () {
        this._characterTempDatas.clear();
        for (const character of $gameMap.allCharacters()) {
            const tempData = character.createDotMoveTempData();
            this._characterTempDatas.set(character, tempData);
        }
    };
    Game_Temp.prototype.setupMapCharactersCache = function (width, height) {
        this._mapCharactersCache = new MapCharactersCache(width, height);
    };
    // イベントとの衝突判定を高速化するため、マスごとにイベントを管理する
    Game_Temp.prototype.mapCharactersCache = function () {
        return this._mapCharactersCache;
    };
    // タッチ移動時に移動前後で移動先のマスが変化する場合に移動処理がループする現象に対応する
    Game_Temp.prototype.beforeTouchMovedPoint = function () {
        return this._beforeTouchMovedPoint;
    };
    Game_Temp.prototype.setBeforeTouchMovedPoint = function (point) {
        this._beforeTouchMovedPoint = point;
    };
    Game_Temp.prototype.removeUnusedCache = function () {
        const allCharacters = $gameMap.allCharacters();
        for (const character of this._lastAllCharacters) {
            if (!allCharacters.has(character)) {
                character.removeMapCharactersCache();
            }
        }
        for (const character of this._characterTempDatas.keys()) {
            if (!allCharacters.has(character)) {
                this._characterTempDatas.delete(character);
            }
        }
        this._lastAllCharacters = allCharacters;
    };
    // セーブデータに保持するクラスをwindowオブジェクトに登録する
    window.MoverData = MoverData;
})(DotMoveSystem || (DotMoveSystem = {}));
// v1.xとの互換性維持のために定義
const DotMoveSystemClassAlias = DotMoveSystem;
