/*:
@target MZ
@plugindesc virtual stick v1.0.0
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem.js
@help
It is a plugin that introduces a virtual stick.

【How to use】
By changing the "stick mode" of the plug-in parameter
・ Move in 4 directions
・ Move in 8 directions
・ 360 degree movement
You can choose one of them.

If you choose to move in 8 directions or 360 degrees, you need to install the following plug-ins.
・ 8-direction movement: A plug-in that supports diagonal movement, or a dot movement plug-in
・ 8-direction movement: Dot movement plug-in
* For plug-ins that support diagonal movement
  We have confirmed the operation with "Yami_8DirEx.js" and "HalfMove.js".

When used in combination with other mobile plug-ins, this plug-in is
Please install below other mobile plugins.

【License】
This plugin is available under the terms of the MIT license.


@param STICK_MODE
@text stick mode
@type number
@default 0
@desc
Specifies the mode of the virtual stick.
0: 4 directions move 1: 8 directions move 2: 360 degrees move

@param PAD_SIZE
@text pad size
@type number
@ default 128
@desc
Specifies the size of the virtual stick.

@param STICK_SIZE
@text stick size
@type number
@default 64
@desc
Specifies the stick size of the virtual stick.

@param MARGIN
@text margin
@type number
@default 8
@desc
Specifies the pad center judgment margin.

@param PAD_IMAGE_FILE_NAME
@text pad image file name
@type file
@dir img
@desc
Specify the file name of the pad image.

@param STICK_IMAGE_FILE_NAME
@text stick image file name
@type file
@dir img
@desc
Specify the file name of the stick image.
*/

/*:ja
@target MZ
@plugindesc 仮想スティック v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem.js
@help
仮想スティックを導入するプラグインです。

【使用方法】
プラグインパラメータの「スティックモード」を変更することで、
・4方向移動
・8方向移動
・360度移動
のいずれかを選択することができます。

8方向移動または360度移動を選択する場合は下記のプラグインの導入が必要です。
・8方向移動: 斜め移動に対応したプラグイン、またはドット移動プラグイン
・360度移動: ドット移動プラグイン
※斜め移動に対応したプラグインについては
  「Yami_8DirEx.js」「HalfMove.js」で動作確認をしています。

なお、他の移動系プラグインと併用する場合、このプラグインは
他の移動系プラグインよりも下に導入してください。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@param STICK_MODE
@text スティックモード
@type number
@default 0
@desc
仮想スティックのモードを指定します。
0: 4方向移動  1: 8方向移動  2: 360度移動

@param PAD_SIZE
@text パッドサイズ
@type number
@default 128
@desc
仮想スティックのサイズを指定します。

@param STICK_SIZE
@text スティックサイズ
@type number
@default 64
@desc
仮想スティックのスティックのサイズを指定します。

@param MARGIN
@text マージン
@type number
@default 8
@desc
パッド中央判定のマージンを指定します。

@param PAD_IMAGE_FILE_NAME
@text パッド画像ファイル名
@type file
@dir img
@desc
パッド画像のファイル名を指定します。

@param STICK_IMAGE_FILE_NAME
@text スティック画像ファイル名
@type file
@dir img
@desc
スティック画像のファイル名を指定します。
*/

const VirtualPadPluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];

let $virtualPad = null;

(() => {
"use strict";

const params = PluginManager.parameters(VirtualPadPluginName)

const STICK_MODE = parseInt(params["STICK_MODE"]);
const PAD_SIZE = parseInt(params["PAD_SIZE"]);
const STICK_SIZE = parseInt(params["STICK_SIZE"]);
const MARGIN = parseInt(params["MARGIN"]);
const PAD_IMAGE_FILE_NAME = params["PAD_IMAGE_FILE_NAME"];
const STICK_IMAGE_FILE_NAME = params["STICK_IMAGE_FILE_NAME"];

class VirtualPad {
    constructor() {
        this.reset();
    }

    reset() {
        this._virtualPadTouched = false;
        this._touchActionResult = false;
        this._visible = false;
        this._point = null;
        this._deg = null;
    }

    isVisible() {
        return this._visible;
    }

    open(point) {
        if (this._point) {
            const far = this.calcFar(this._point, point);
            if (far >= MARGIN) {
                this._deg = this.calcDeg(this._point, point);
            } else {
                this._deg = null;
            }
        } else {
            this._visible = true;
            this._point = point;
        }
    }

    close() {
        this._visible = false;
        this._point = null;
        this._deg = null;
    }

    point() {
        return this._point;
    }

    deg() {
        return this._deg;
    }

    dir4() {
        if (!this._deg) return 0;
        const deg = this._deg;
        if ((deg >= 315 && deg < 360) || (deg >= 0 && deg < 45)) {
            return 8;
        } else if (deg >= 45 && deg < 135) {
            return 6;
        } else if (deg >= 135 && deg < 225) {
            return 2;
        } else if (deg >= 225 && deg < 315) {
            return 4;
        }
        throw new Error(`${deg} is invalid`);
    }

    dir8() {
        if (!this._deg) return 0;
        const deg = this._deg;
        if ((deg >= 337.5 && deg < 360) || (deg >= 0 && deg < 22.5)) {
            return 8;
        } else if (deg >= 22.5 && deg < 67.5) {
            return 9;
        } else if (deg >= 67.5 && deg < 112.5) {
            return 6;
        } else if (deg >= 112.5 && deg < 157.5) {
            return 3;
        } else if (deg >= 157.5 && deg < 202.5) {
            return 2;
        } else if (deg >= 202.5 && deg < 247.5) {
            return 1;
        } else if (deg >= 247.5 && deg < 292.5) {
            return 4;
        } else if (deg >= 292.5 && deg < 337.5) {
            return 7;
        }
        throw new Error(`${deg} is invalid`);
    }

    touchActionResult() {
        return this._touchActionResult;
    }

    setTouchActionResult(result) {
        this._touchActionResult = result;
    }

    virtualPadTouched() {
        return this._virtualPadTouched;
    }

    setVirtualPadTouched(touched) {
        this._virtualPadTouched = touched;
    }

    calcDeg(fromPoint, newPoint) {
        const ox = newPoint.x - fromPoint.x;
        const oy = newPoint.y - fromPoint.y;
        const rad = Math.atan2(oy, ox);
        let deg =  rad / Math.PI * 180 + 90;
        if (deg > 360) deg = deg % 360;
        if (deg < 0) {
            let rdeg = -deg;
            if (rdeg > 360) rdeg = rdeg % 360;
            deg = 360 - rdeg;
        }
        return deg;
    }

    calcFar(fromPoint, newPoint) {
        const xDiff = newPoint.x - fromPoint.x;
        const yDiff = newPoint.y - fromPoint.y;
        if (xDiff === 0 && yDiff === 0) return 0;
        return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    }
}

const _DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    _DataManager_createGameObjects.call(this);
    $virtualPad = new VirtualPad();
};

const _Scene_Map_create = Scene_Map.prototype.create;
Scene_Map.prototype.create = function() {
    _Scene_Map_create.call(this);
    $virtualPad.reset();
};

const _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    $virtualPad.setVirtualPadTouched(false);
    _Scene_Map_update.call(this);
    this.updateVirtualPad();
};

Scene_Map.prototype.updateVirtualPad = function() {
    if ($gameMap.isEventRunning() || this.isBusy()) {
        $virtualPad.close();
    } else {
        if ($virtualPad.virtualPadTouched()) {
            const screenX = TouchInput.x;
            const screenY = TouchInput.y;
            $virtualPad.open({ x: screenX, y: screenY });
        } else {
            $virtualPad.close();
        }
    }
};

// ドット移動対応時のタッチポイント到達時にDestinationをクリアする処理を無効化
Game_Player.prototype.updateTouchPoint = function() {
}

// 仮想パッド表示フラグをONにする
const _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
Scene_Map.prototype.processMapTouch = function() {
    if (TouchInput.isPressed() && !this.isAnyButtonPressed()) {
        $virtualPad.setVirtualPadTouched(true);
    }
    // 従来の処理はイベント起動に必要なため、そのまま残す
    _Scene_Map_processMapTouch.call(this);
};


Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
        let direction = this.getInputDirection();
        if (direction === 0) {
            if (STICK_MODE === 1) {
                direction = $virtualPad.dir8();
            } else if (STICK_MODE === 2) {
                const deg = $virtualPad.deg();
                if (typeof DotMoveSystemPluginName !== "undefined") {
                    if (deg != null) this.dotMoveByDeg(deg);
                } else {
                    throw new Error("DotMoveSystem.js is not installed.");
                }
            } else {
                direction = $virtualPad.dir4();
            }
        }
        if (direction > 0) {
            // Yami_8DirEx.jsとの併用に対応
            if (typeof Game_Player.prototype.processMoveByInput !== "undefined") {
                this.processMoveByInput(direction);
            } else {
                this.executeMove(direction);
            }   
        }
    }
};

// 事前に設定しておいたDestinationに応じて振り向き、イベントがあれば起動する
// イベントを起動しなかった場合は振り向きをキャンセルする
const _Game_Player_triggerTouchAction = Game_Player.prototype.triggerTouchAction;
Game_Player.prototype.triggerTouchAction = function() {
    const currentDir = $gamePlayer.direction();
    const x = $gameTemp.destinationX();
    const y = $gameTemp.destinationY();
    if (y < $gamePlayer.y) {
        $gamePlayer.setDirection(8);
    } else if (x > $gamePlayer.x) {
        $gamePlayer.setDirection(6);
    } else if (y > $gamePlayer.y) {
        $gamePlayer.setDirection(2);
    } else if (x < $gamePlayer.x) {
        $gamePlayer.setDirection(4);
    }
    const touchActionResult = _Game_Player_triggerTouchAction.call(this);
    $virtualPad.setTouchActionResult(touchActionResult);
    if (touchActionResult) {
        // タッチでアクションを実行したときは仮想パッドを表示しない
        $virtualPad.setVirtualPadTouched(false);
        return true;
    } else {
        $gameTemp.clearDestination();
        $gamePlayer.setDirection(currentDir);
    }
};

class Sprite_VirtualPad extends Sprite {
    initialize() {
        super.initialize();
        this._stickSprite = null;
        this.createBitmap();
        this.createStick();
        this.hide();
    }

    update() {
        super.update();
        if ($virtualPad.isVisible()) {
            this.show();
            const point = $virtualPad.point();
            const pad = this.padding();
            this.x = point.x - this.bitmap.width / 2 - pad;
            this.y = point.y - this.bitmap.height / 2 - pad;
            const deg = $virtualPad.deg();
            if (deg == null) {
                this.moveStickToCenter(deg);
            } else {
                this.moveStickByDeg(deg);
            }
        } else {
            this.hide();
        }
    }

    createBitmap() {
        if (PAD_IMAGE_FILE_NAME) {
            this.bitmap = ImageManager.loadBitmap("img/", PAD_IMAGE_FILE_NAME);
        } else {
            this.createDefaultBitmap();
        }
    }

    createDefaultBitmap() {
        this.bitmap = new Bitmap(PAD_SIZE, PAD_SIZE);
        const ctx = this.bitmap._context;
        const pad = this.padding();
        const cx = this.bitmap.width / 2;
        const cy = this.bitmap.height / 2;
        const r = this.bitmap.width / 2 - pad;
        const beginRad = 0;
        const endRad = 2 * Math.PI;

        ctx.arc(cx, cy, r, beginRad, endRad, false);
        ctx.strokeStyle = "#0000aa";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "#0000ff";
        ctx.fill();
    }

    createStick() {
        this._stickSprite = new Sprite_Stick();
        this.addChild(this._stickSprite);
    }

    show() {
        super.show();
        this._stickSprite.show();
    }

    hide() {
        super.hide();
        this._stickSprite.hide();
    }

    moveStickToCenter() {
        const pad = this.padding();
        const cx = this.bitmap.width / 2;
        const cy = this.bitmap.height / 2;
        const x = cx - this._stickSprite.width / 2 + pad;
        const y = cy - this._stickSprite.height / 2 + pad;
        this._stickSprite.x = x;
        this._stickSprite.y = y;
    }

    moveStickByDeg(deg) {
        this.moveStickToCenter();
        const rad = (deg - 90) / 180 * Math.PI;
        const pad = this.padding();
        const pad2 = this._stickSprite.padding();
        const r = this.bitmap.width / 2 - pad;
        const r2 = this._stickSprite.bitmap.width / 2 - pad2;
        const diffX = Math.cos(rad) * r;
        const diffY = Math.sin(rad) * r;
        const diffX2 = Math.cos(rad) * r2;
        const diffY2 = Math.sin(rad) * r2;
        this._stickSprite.x += diffX - diffX2 - pad2;
        this._stickSprite.y += diffY - diffY2 - pad2;
    }

    padding() {
        return 4;
    }
}

class Sprite_Stick extends Sprite {
    initialize() {
        super.initialize();
        this.createBitmap();
    }

    update() {
        super.update();
    }

    createBitmap() {
        if (STICK_IMAGE_FILE_NAME) {
            this.bitmap = ImageManager.loadBitmap("img/", STICK_IMAGE_FILE_NAME);
        } else {
            this.createDefaultBitmap();
        }
    }

    createDefaultBitmap() {
        this.bitmap = new Bitmap(STICK_SIZE, STICK_SIZE);
        const ctx = this.bitmap._context;
        const pad = this.padding();
        const cx = this.bitmap.width / 2;
        const cy = this.bitmap.height / 2;
        const r = this.bitmap.width / 2 - pad;
        const beginRad = 0;
        const endRad = 2 * Math.PI;

        ctx.arc(cx, cy, r, beginRad, endRad, false);
        ctx.strokeStyle = "#0000aa";
        ctx.lineWidth = 1;
        ctx.stroke();

        const grdCx = this.bitmap.width / 3 * 2;
        const grdCy = this.bitmap.height / 3;
        const grd = ctx.createRadialGradient(grdCx, grdCy, 0, cx, cy, r);
        grd.addColorStop(0, "#ffffff");
        grd.addColorStop(0.25, "#aaaaff");
        grd.addColorStop(1, "#0000ff");

        ctx.fillStyle = grd;
        ctx.fill();
    }

    padding() {
        return 4;
    }
};

const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
    _Spriteset_Map_createLowerLayer.call(this);
    this.createVirtualPad();
};

Spriteset_Map.prototype.createVirtualPad = function() {
    this._virtualPadSprite = new Sprite_VirtualPad();
    this._baseSprite.addChild(this._virtualPadSprite);
};

// 仮想パッドを表示するときはDestination矩形を表示しない
Sprite_Destination.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if ($gameTemp.isDestinationValid() && $virtualPad.touchActionResult()) {
        this.updatePosition();
        this.updateAnimation();
        this.visible = true;
    } else {
        this._frameCount = 0;
        this.visible = false;
    }
};

})();
