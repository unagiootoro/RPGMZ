/*:
@target MV MZ
@plugindesc Dot movement system enhancement v1.0.1
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem_FunctionEx.js
@help
It is a plug-in that extends the functions of the dot movement system.
Add the following features.
・ Change player size
・ Adjustment of movement speed
・ Addition of acceleration
・ Addition of inertia
・ Press an event
・ Change of behavior when immersing in an event
・ Jump with collision detection

【How to use】
■ Change player size
Change the size of the player by setting the plug-in parameter "player information".

■ Adjustment of movement speed
You will be able to specify any movement speed.
You can also add acceleration and inertia to the movement.
・ Adjustment of movement speed
In the setting of the movement route
this.setDpf(movement speed);
Specify. The moving speed specifies the moving speed per frame.

(Example) When moving 0.01 squares per frame
this.setDpf(0.01);

If you want to cancel the movement speed adjustment and reflect the movement speed specified by the event command,
this.setDpf(null);
Specify.

■ Addition of acceleration
Acceleration is valid only when the movement speed is adjusted.
To specify the acceleration
this.setAcc(maximum acceleration, degree of influence);
Specify.

(Example) Acceleration between 20 frames, maximum acceleration at 3x speed
this.setAcc(20, 3);

■ Addition of inertia
To specify inertia
this.setInertia;
Specify.
Specify a value of 1 or more for inertia.
This value will continue to decrease every frame by the specified value from the current acceleration.
When set to 1, acceleration and inertia increase / decrease are the same.

(Example) When decelerating 2 times in 1 frame
this.setInertia(2);

■ Press an event
Add the ability to press an event.
In the memo field of the event to be pushed
<PushableEvent>
Please describe.

■ Changes in behavior when immersing yourself in an event
By setting the plugin command "ThroughIfCollided" to true
If you're into an event, make sure it slips through.

■ Jump with collision detection
Jump with collision detection.
Write the following script in the movement route setting.
this.smartJump (addition value in the X-axis direction, addition value in the Y-axis direction, maximum jump height (optional));
* The maximum jump height can be omitted. If omitted, 10 applies.
* The presence or absence of slip-through can be omitted. If omitted, no slip-through is applied.

(Example) When jumping 2 to the left and 3.5 to the top
this.smartJump (2, -3.5);


@param PlayerInfo
@text player information
@type struct <CharacterInfo>
@default {"Width": "1", "Height": "1", "OffsetX": "0", "OffsetY": "0", "SlideLengthX": "0.5", "SlideLengthY": "0.5" }
@desc
Specify various information of the player.

@param FollowerInfo
@text follower information
@type struct <CharacterInfo>
@default {"Width": "1", "Height": "1", "OffsetX": "0", "OffsetY": "0", "SlideLengthX": "0.75", "SlideLengthY": "0.75" }
@desc
Specify various information of followers.

@param ThroughIfCollided
@text slip through when an event collides
@type boolean
@default true
@desc
Setting true allows you to bypass conflicted events.

【License】
This plugin is available under the terms of the MIT license.
*/

/*~struct~CharacterInfo:
@param Width
@text width
@type number
@decimals 2
@default 1
@desc
Specify the width of the character.

@param Height
@text height
@type number
@decimals 2
@default 1
@desc
Specify the width of the character.

@param OffsetX
@text offset X
@type number
@decimals 2
@ min -1000
@default 0
@desc
Specifies the display offset of the character along the X axis.

@param OffsetY
@text offset Y
@type number
@decimals 2
@ min -1000
@default 0
@desc
Specifies the display offset in the Y-axis direction of the character.

@param SlideLengthX
@text X-axis slide length
@type number
@decimals 2
@default 0.5
@desc
Specifies the slide length of the character in the X-axis direction.

@param SlideLengthY
@text Y-axis slide length
@type number
@decimals 2
@default 0.5
@desc
Specifies the slide length of the character in the Y-axis direction.
*/

/*:ja
@target MV MZ
@plugindesc ドット移動システム機能拡張 v1.0.1
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem_FunctionEx.js
@help
ドット移動システムの機能を拡張するプラグインです。
次の機能を追加します。
・プレイヤーサイズの変更
・移動速度の調整
・加速度の追加
・慣性の追加
・イベントを押す
・イベントめり込み時の挙動の変更
・当たり判定付きジャンプ

【使用方法】
■ プレイヤーサイズの変更
プラグインパラメータ「プレイヤー情報」の設定によりプレイヤーのサイズを変更します。

■ 移動速度の調整
任意の移動速度を指定できるようになります。
また、移動に加速度と慣性をつけることができます。
・移動速度の調整
移動ルートの設定で
this.setDpf(移動速度);
と指定します。移動速度は1フレーム当たりの移動速度を指定します。

(例) 1フレーム当たり0.01マス移動する場合
this.setDpf(0.01);

なお、移動速度の調整をキャンセルしてイベントコマンドで指定する移動速度を反映する場合、
this.setDpf(null);
と指定します。

■ 加速度の追加
加速度は移動速度の調整を行っている場合のみ有効になります。
加速度を指定するには、
this.setAcc(最大加速度, 影響度);
と指定します。

(例) 20フレーム間加速、最高加速で3倍速の場合
this.setAcc(20, 3);

■ 慣性の追加
慣性を指定するには
this.setInertia(慣性);
と指定します。
慣性には1以上の値を指定してください。
この値が現在の加速度から指定した値だけ毎フレーム減り続けることになります。
1を設定した場合は加速と慣性の増減は同じになります。

(例) 1フレームに2減速する場合
this.setInertia(2);

■ イベントを押す
イベントを押す機能を追加します。
押される側のイベントのメモ欄に
<PushableEvent>
と記載してください。

■ イベントめり込み時の挙動の変更
プラグインコマンド「ThroughIfCollided」をtrueに設定することで、
イベントにめり込んでいる場合はそのイベントはすり抜けられるようにします。

■ 当たり判定付きジャンプ
当たり判定付きでジャンプを行います。
移動ルートの設定で以下のスクリプトを記述します。
this.smartJump(X軸方向の加算値, Y軸方向の加算値, 最大のジャンプする高さ(省略可));
※最大のジャンプする高さは省略可能です。省略した場合、10が適用されます。
※すり抜け有無は省略可能です。省略した場合、すり抜け無しが適用されます。

(例) 左方向に2、上方向に3.5ジャンプさせる場合
this.smartJump(2, -3.5);


@param PlayerInfo
@text プレイヤー情報
@type struct<CharacterInfo>
@default {"Width":"1","Height":"1","OffsetX":"0","OffsetY":"0","SlideLengthX":"0.5","SlideLengthY":"0.5"}
@desc
プレイヤーの各種情報を指定します。

@param FollowerInfo
@text フォロワー情報
@type struct<CharacterInfo>
@default {"Width":"1","Height":"1","OffsetX":"0","OffsetY":"0","SlideLengthX":"0.75","SlideLengthY":"0.75"}
@desc
フォロワーの各種情報を指定します。

@param ThroughIfCollided
@text イベント衝突時すり抜け
@type boolean
@default true
@desc
trueを設定すると衝突済みのイベントをすり抜けられるようになります。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

/*~struct~CharacterInfo:ja
@param Width
@text 横幅
@type number
@decimals 2
@default 1
@desc
キャラクターの横幅を指定します。

@param Height
@text 縦幅
@type number
@decimals 2
@default 1
@desc
キャラクターの横幅を指定します。

@param OffsetX
@text オフセットX
@type number
@decimals 2
@min -1000
@default 0
@desc
キャラクターのX軸方向の表示オフセットを指定します。

@param OffsetY
@text オフセットY
@type number
@decimals 2
@min -1000
@default 0
@desc
キャラクターのY軸方向の表示オフセットを指定します。

@param SlideLengthX
@text X軸スライド長
@type number
@decimals 2
@default 0.5
@desc
キャラクターのX軸方向のスライド長を指定します。

@param SlideLengthY
@text Y軸スライド長
@type number
@decimals 2
@default 0.5
@desc
キャラクターのY軸方向のスライド長を指定します。
*/

const DotMoveSystem_FunctionExPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {
"use strict";

for (const className in DotMoveSystemClassAlias) {
    this[className] = DotMoveSystemClassAlias[className];
}


class PluginParamsParser {
    static parse(params, typeData, predictEnable = true) {
        return new PluginParamsParser(predictEnable).parse(params, typeData);
    }

    constructor(predictEnable = true) {
        this._predictEnable = predictEnable;
    }

    parse(params, typeData, loopCount = 0) {
        if (++loopCount > 255) throw new Error("endless loop error");
        const result = {};
        for (const name in typeData) {
            if (params[name] === "" || params[name] === undefined) {
                result[name] = null;
            } else {
                result[name] = this.convertParam(params[name], typeData[name], loopCount);
            }
        }
        if (!this._predictEnable) return result;
        if (typeof params === "object" && !(params instanceof Array)) {
            for (const name in params) {
                if (result[name]) continue;
                const param = params[name];
                const type = this.predict(param);
                result[name] = this.convertParam(param, type, loopCount);
            }
        }
        return result;
    }

    convertParam(param, type, loopCount) {
        if (typeof type === "string") {
            return this.cast(param, type);
        } else if (typeof type === "object" && type instanceof Array) {
            const aryParam = JSON.parse(param);
            if (type[0] === "string") {
                return aryParam.map(strParam => this.cast(strParam, type[0]));
            } else {
                return aryParam.map(strParam => this.parse(JSON.parse(strParam), type[0]), loopCount);
            }
        } else if (typeof type === "object") {
            return this.parse(JSON.parse(param), type, loopCount);
        } else {
            throw new Error(`${type} is not string or object`);
        }
    }

    cast(param, type) {
        switch(type) {
        case "any":
            if (!this._predictEnable) throw new Error("Predict mode is disable");
            return this.cast(param, this.predict(param));
        case "string":
            return param;
        case "number":
            if (param.match(/^\-?\d+\.\d+$/)) return parseFloat(param);
            return parseInt(param);
        case "boolean":
            return param === "true";
        default:
            throw new Error(`Unknow type: ${type}`);
        }
    }

    predict(param) {
        if (param.match(/^\-?\d+$/) || param.match(/^\-?\d+\.\d+$/)) {
            return "number";
        } else if (param === "true" || param === "false") {
            return "boolean";
        } else {
            return "string";
        }
    }
}


const typeDefine = {
    PlayerInfo: {},
    FollowerInfo: {},
};
const PP = PluginParamsParser.parse(PluginManager.parameters(DotMoveSystem_FunctionExPluginName), typeDefine);


/*
 * ● 初期化処理
 */
const _CharacterMover_initialize = CharacterMover.prototype.initialize;
CharacterMover.prototype.initialize = function(character) {
    _CharacterMover_initialize.call(this, character);
    this._lastDirection = character.direction();
    this._changeDirectionCount = 0;
    this._direction8 = this._character.direction();
};

const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this._dpf = null;
    this._acceleration = 0;
    this._inertia = 1;
    this._accelerationPlus = null;
    this._maxAcceleration = null;
    this._jumpXPlus = null;
    this._jumpYPlus = null;
};


const _Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
    _Game_Player_initMembers.call(this);
    this._width = PP.PlayerInfo.Width;
    this._height = PP.PlayerInfo.Height;
    this._offsetX = PP.PlayerInfo.OffsetX;
    this._offsetY = PP.PlayerInfo.OffsetY;
    this._slideLengthX = PP.PlayerInfo.SlideLengthX;
    this._slideLengthY = PP.PlayerInfo.SlideLengthY;
};


const _Game_Follower_initMembers = Game_Follower.prototype.initMembers;
Game_Follower.prototype.initMembers = function() {
    _Game_Follower_initMembers.call(this);
    this._width = PP.FollowerInfo.Width;
    this._height = PP.FollowerInfo.Height;
    this._offsetX = PP.FollowerInfo.OffsetX;
    this._offsetY = PP.FollowerInfo.OffsetY;
    this._slideLengthX = PP.FollowerInfo.SlideLengthX;
    this._slideLengthY = PP.FollowerInfo.SlideLengthY;
};

/*
 * ● 更新処理
 */
const _CharacterMover_update = CharacterMover.prototype.update;
CharacterMover.prototype.update = function() {
    _CharacterMover_update.call(this);
    // TODO: 斜め慣性処理を実装する
    // this.updateChangeDirection();
};

const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
    if (this.isJumping() && this.isSmartJumping()) this.updateSmartJump();
    if (this.isNeedUpdateAcceleration()) this.updateAcceleration();
    _Game_CharacterBase_update.call(this);
};

/*
 * ● プレイヤーサイズの変更機能
 */
const CharacterInfo = {
    width() {
        return this._width;
    },

    height() {
        return this._height;
    },

    offsetX() {
        return this._offsetX;
    },

    offsetY() {
        return this._offsetY;
    },

    slideLengthX() {
        return this._slideLengthX;
    },

    slideLengthY() {
        return this._slideLengthY;
    },
};

Object.assign(Game_Player.prototype, CharacterInfo);
Object.assign(Game_Follower.prototype, CharacterInfo);

/*
 * ● 移動速度の調整
 */
CharacterMover.prototype.updateChangeDirection = function() {
    if (!this._reserveChangeDirection) return;
    const direction = this._lastDirection;
    if (direction !== this._character.direction()) {
        this._changeDirectionCount++;
        if (this._changeDirectionCount >= 3) {
            this._reserveChangeDirection = false;
            const deg = DotMoveUtils.direction2deg(direction);
            const direction4 = DotMoveUtils.deg2direction4(deg, this._character.direction());
            this.setDirection8(direction);
            this.setDirection(direction4);
            this._reserveSetDirection = null;
        }
    }
};


CharacterMover.prototype.setDirection8 = function(direction8) {
    this._direction8 = direction8;
};

CharacterMover.prototype.direction8 = function() {
    return this._direction8;
};

CharacterMover.prototype.dotMoveByDeg = function(deg, opt = { changeDir: true }) {
    if (opt.changeDir) {
        const direction = DotMoveUtils.deg2direction(deg);
        this.changeDirectionWhenDotMove(direction);
    }
    this._moverData.targetCount = 1;
    this._moverData.moveDeg = deg;
    this.moveProcess();
};

CharacterMover.prototype.dotMoveByDirection = function(direction, opt = { changeDir: true }) {
    if (opt.changeDir) {
        this.changeDirectionWhenDotMove(direction);
    }
    this._moverData.targetCount = 1;
    this._moverData.moveDir = direction;
    this.moveProcess();
};

CharacterMover.prototype.changeDirectionWhenDotMove = function(direction) {
    if (this._lastDirection !== direction) {
        this._lastDirection = direction;
        this._changeDirectionCount = 0;
        this._reserveChangeDirection = true;
        this.setDirection8(direction);
        const deg = DotMoveUtils.direction2deg(direction);
        const direction4 = DotMoveUtils.deg2direction4(deg, this._character.direction());
        this.setDirection(direction4);
    }
};


Game_CharacterBase.prototype.originDistancePerFrame = Game_CharacterBase.prototype.distancePerFrame;

Game_CharacterBase.prototype.distancePerFrame = function() {
    const isNeedUpdateAcceleration = this.isNeedUpdateAcceleration();
    if (this._dpf == null) return this.originDistancePerFrame();
    if (isNeedUpdateAcceleration && this._moverData.targetCount > 1) return this.originDistancePerFrame();
    const dashMul = this._dashing ? 2 : 1;
    if (isNeedUpdateAcceleration) {
        const acc = 1 + this._acceleration / this._maxAcceleration * this._accelerationPlus;
        return this._dpf * acc * dashMul;
    } else {
        return this._dpf * dashMul;
    }
};

Game_CharacterBase.prototype.setDpf = function(dpf) {
    this._dpf = dpf;
};

Game_CharacterBase.prototype.setAcc = function(maxAcc, accPlus) {
    this._maxAcceleration = maxAcc;
    this._accelerationPlus = accPlus;
};

Game_CharacterBase.prototype.setInertia = function(inertia) {
    this._inertia = inertia;
};

Game_CharacterBase.prototype.isNeedUpdateAcceleration = function() {
    return this._dpf != null && this._maxAcceleration != null && this._accelerationPlus != null;
};

Game_CharacterBase.prototype.updateAcceleration = function() {
    if ($gameMap.isEventRunning()) {
        this.cancelAcceleration();
    } else {
        if (this.isMoved()) {
            if (this._acceleration < this._maxAcceleration) {
                this._acceleration++;
            }
        } else {
            if (this._acceleration > 0) {
                this._acceleration -= this._inertia;
                if (this._acceleration < 0) this._acceleration = 0;
                this.mover().dotMoveByDirection(this.mover().direction8(), { changeDir: false });
            }
        }
    }
};

Game_CharacterBase.prototype.cancelAcceleration = function() {
    this._acceleration = 0;
};


Game_Player.prototype.distancePerFrame = function() {
    if (this.isInVehicle()) return this.originDistancePerFrame();
    return Game_CharacterBase.prototype.distancePerFrame.call(this);
};

Game_Player.prototype.isNeedUpdateAcceleration = function() {
    if (this.isInVehicle()) return false;
    return Game_CharacterBase.prototype.isNeedUpdateAcceleration.call(this);
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
                this.cancelAcceleration();
            }
        }
    }
};


Game_Follower.prototype.distancePerFrame = function() {
    if ($gamePlayer.isInVehicle()) return this.originDistancePerFrame();
    return Game_CharacterBase.prototype.distancePerFrame.call(this);
};

Game_Follower.prototype.isNeedUpdateAcceleration = function() {
    if ($gamePlayer.isInVehicle()) return false;
    return Game_CharacterBase.prototype.isNeedUpdateAcceleration.call(this);
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
        if ($gamePlayer._dpf) {
            this.setDpf(this.calcFollowerDpf(far));
        } else {
            this.setDpf(null);
            this.setMoveSpeed(this.calcFollowerSpeed(far));
        }
    }
};

Game_Follower.prototype.calcFollowerDpf = function(precedingCharacterFar) {
    if (precedingCharacterFar >= 2) {
        return $gamePlayer.distancePerFrame() * 2;
    } else if (precedingCharacterFar >= 1.5) {
        return $gamePlayer.distancePerFrame();
    } else if (precedingCharacterFar >= 1) {
        return $gamePlayer.distancePerFrame() / 2;
    } else {
        return 0;
    }
};


const _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function() {
    _Scene_Map_callMenu.call(this);
    $gamePlayer.cancelAcceleration();
};

/*
 * ● イベントを押す
 */
const _PlayerMover_moveProcess = PlayerMover.prototype.moveProcess;
PlayerMover.prototype.moveProcess = function() {
    // プレイヤー移動の前にイベントを動かし、その後でプレイヤーを動かす
    this.eventPushProcess();
    _PlayerMover_moveProcess.call(this);
};

PlayerMover.prototype.eventPushProcess = function() {
    const x = this._character._realX;
    const y = this._character._realY;
    const width = this._character.width();
    const height = this._character.height();
    const dpf = this._character.distancePerFrame();
    const margin = dpf / 2;
    const dir = this._character.direction();
    const dis = DotMoveUtils.calcDistance(DotMoveUtils.direction2deg(dir), dpf);
    const x2 = x + dis.x;
    const y2 = y + dis.y;
    for (const event of DotMoveUtils.enteringMassesEvents(x2, y2, width, height)) {
        if (!event.event().meta.PushableEvent) continue;
        const result = this.checkCharacter(x2, y2, dir, event);
        if (!(result && result.collisionLengthX() >= margin && result.collisionLengthY() >= margin)) continue;
        event.mover().dotMoveByDirection(dir);
    }
};

/*
 * ● イベントと既に衝突している場合、そのイベントはすり抜けられるようにする
 */
CharacterCollisionChecker.prototype.checkEventsPrepare = function(notCollisionEventIds) {
    const collidedEvents = [];
    const x = this._character._realX;
    const y = this._character._realY;
    const width = this._character.width();
    const height = this._character.height();
    const margin = this._character.distancePerFrame();
    const events = DotMoveUtils.enteringMassesEvents(x, y, width, height);
    for (const event of events) {
        if (event.isNormalPriority() && !event.isThrough() && !notCollisionEventIds.includes(event.eventId())) {
            const result = this.checkCharacter(x, y, this._character.direction(), event);
            if (result && result.collisionLengthX() >= margin && result.collisionLengthY() >= margin) collidedEvents.push(event);
        }
    }
    return collidedEvents.map(event => event.eventId());
};

const _CharacterCollisionChecker_checkEvents = CharacterCollisionChecker.prototype.checkEvents;
CharacterCollisionChecker.prototype.checkEvents = function(x, y, d, notCollisionEventIds = []) {
    if (PP.ThroughIfCollided) {
        const collidedEventIds = this.checkEventsPrepare(notCollisionEventIds);
        notCollisionEventIds = notCollisionEventIds.concat(collidedEventIds);
    }
    return _CharacterCollisionChecker_checkEvents.call(this, x, y, d, notCollisionEventIds)
};

FollowerCollisionChecker.prototype.checkEventsPrepare = function(notCollisionEventIds) {
    return [];
};

/*
 * ● 当たり判定付きジャンプ
 */
Game_CharacterBase.prototype.smartJump = function(xPlus, yPlus, baseJumpPeak = 10) {
    this._jumpXPlus = xPlus;
    this._jumpYPlus = yPlus;
    if (Math.abs(xPlus) > Math.abs(yPlus)) {
        if (xPlus !== 0) {
            this.setDirection(xPlus < 0 ? 4 : 6);
        }
    } else {
        if (yPlus !== 0) {
            this.setDirection(yPlus < 0 ? 8 : 2);
        }
    }
    const distance = Math.round(Math.sqrt(xPlus**2 + yPlus**2));
    this._jumpPeak = baseJumpPeak + distance - this._moveSpeed;
    this._jumpCount = this._jumpPeak * 2;
    this.resetStopCount();
    this.straighten();
};

Game_CharacterBase.prototype.isSmartJumping = function() {
    return this._jumpXPlus != null && this._jumpYPlus != null;
};

const _Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
Game_CharacterBase.prototype.updateJump = function() {
    if (!this.isSmartJumping()) _Game_CharacterBase_updateJump.call(this);
};

Game_CharacterBase.prototype.updateSmartJump = function() {
    this._jumpCount--;
    const x = this._realX + this._jumpXPlus / (this._jumpPeak * 2);
    const y = this._realY + this._jumpYPlus / (this._jumpPeak * 2);
    const dis = { x: x - this._realX, y: y - this._realY };
    this.mover()._controller.dotMoveByDistance(this.direction(), dis);
    if (this._jumpCount === 0) {
        this._jumpXPlus = null;
        this._jumpYPlus = null;
        this.setPosition(this._realX, this._realY);
    }
};

})();
