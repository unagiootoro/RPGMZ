/*:
@target MZ
@plugindesc XY座標スクロール
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/XYScroll.js
@help
XY座標を指定してスクロールできるようにするプラグインです。
スクロールが完了するまでウェイトさせることも可能です。

【使用方法】
■スクロールの実行
プラグインコマンド「スクロール開始」を実行してスクロールを行います。

■スクリプトでスクロールを実行する
次のようにすることでスクリプトからスクロールを実行することもできます。
$gameMap.startScrollXY(x, y, scrollSpeed);

スクロールの完了有無は次のスクリプトで取得することができます。
$gameMap.isXyScrolling()

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@param SAVE_SCROLL_STATE
@text スクロール状態セーブ
@type boolean
@default false
@desc
trueを設定すると、スクロール状態をセーブデータに保存します。


@command StartScroll
@text スクロール開始
@desc
スクロールを開始します。

@arg X
@text X座標
@type number
@default 0
@desc
スクロール先のX座標を指定します。

@arg Y
@text Y座標
@type number
@default 0
@desc
スクロール先のY座標を指定します。

@arg SCROLL_SPEED
@text スクロール速度
@type number
@default 1
@decimals 2
@desc
スクロール速度を指定します。1フレームにスクロールするピクセル値を指定してください。

@arg WAIT_END_SCROLL
@text スクロール完了まで待機
@type boolean
@default false
@desc
trueを設定すると、スクロール完了まで待機します。
*/

const XYScrollPluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];

(() => {
"use strict";

const params = PluginManager.parameters(XYScrollPluginName)
const SAVE_SCROLL_STATE = params.SAVE_SCROLL_STATE === "true";

PluginManager.registerCommand(XYScrollPluginName, "StartScroll", function(args) {
    const x = parseInt(args.X);
    const y = parseInt(args.Y);
    const scrollSpeed = parseFloat(args.SCROLL_SPEED);
    const waitEndScroll = args.WAIT_END_SCROLL === "true"
    if (waitEndScroll) this._needXyScrollWait = true;
    $gameMap.startScrollXY(x, y, scrollSpeed);
});

class ScreenScroller {
    constructor() {
        this._scrollSpeed = 1;
        this._x = null;
        this._y = null;
        this._targetX = null;
        this._targetY = null;
        this._moving = false;
        this._scrollCount = 0;
    }

    update() {
        if (this._scrolling) this.updateScroll();
    }

    updateScroll() {
        const oy = this._targetY - this._y;
        const ox = this._targetX - this._x;
        const rad = Math.atan2(oy, ox);
        const disX = this._scrollSpeed * Math.cos(rad);
        const disY = this._scrollSpeed * Math.sin(rad);

        let horz = 0;
        let vert = 0;
        if (disX < 0) {
            horz = 4;
        } else {
            horz = 6;
        }
        if (disY < 0) {
            vert = 8;
        } else {
            vert = 2;
        }

        $gameMap.doScroll(horz, Math.abs(disX));
        $gameMap.doScroll(vert, Math.abs(disY));

        if (this._scrollCount <= 0) {
            this._scrolling = false;
        } else {
            this._scrollCount--;
        }
    }

    isScrolling() {
        return this._scrolling;
    }

    startScroll(fromPoint, targetPoint, scrollSpeed, endScrollCallback) {
        this._scrollSpeed = scrollSpeed;
        this._endScrollCallback = endScrollCallback;
        const far = this.calcFar(fromPoint, targetPoint);
        this._scrollCount = Math.round(far / scrollSpeed);
        this._x = fromPoint.x;
        this._y = fromPoint.y;
        this._targetX = targetPoint.x;
        this._targetY = targetPoint.y;
        this._scrolling = true;
    }

    calcFar(fromPoint, targetPoint) {
        const xDiff = $gameMap.deltaX(targetPoint.x, fromPoint.x);
        const yDiff = $gameMap.deltaY(targetPoint.y, fromPoint.y);
        return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    }
}

window.ScreenScroller = ScreenScroller;


const _Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    this._screenScroller = null;
};

Game_Temp.prototype.screenScroller = function() {
    if (!this._screenScroller) this._screenScroller = new ScreenScroller();
    return this._screenScroller;
};


const _Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    _Game_Map_initialize.call(this);
    if (SAVE_SCROLL_STATE) {
        this._screenScroller = new ScreenScroller();
    }
};

Game_Map.prototype.startScrollXY = function(x, y, scrollSpeed) {
    const centerX = x - $gamePlayer.centerX();
    const centerY = y - $gamePlayer.centerY();
    const fromPoint = { x: this._displayX, y: this._displayY };
    const targetPoint = { x: centerX, y: centerY }
    this.screenScroller().startScroll(fromPoint, targetPoint, scrollSpeed);
};

const _Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function(sceneActive) {
    _Game_Map_update.call(this, sceneActive);
    if (sceneActive) this.screenScroller().update();
};

Game_Map.prototype.isXyScrolling = function() {
    return this.screenScroller().isScrolling();
};

Game_Map.prototype.screenScroller = function() {
    if (SAVE_SCROLL_STATE) {
        return this._screenScroller;
    } else {
        return $gameTemp.screenScroller();
    }
};


const _Game_Interpreter_initialize = Game_Interpreter.prototype.initialize;
Game_Interpreter.prototype.initialize = function(depth) {
    _Game_Interpreter_initialize.call(this, depth);
    this._needXyScrollWait = false;
};

// XYスクロール完了待機が必要な場合、スクロール完了まで待機する
const _Game_Interpreter_command357 = Game_Interpreter.prototype.command357;
Game_Interpreter.prototype.command357 = function(params) {
    const pluginName = params[0];
    if (pluginName === XYScrollPluginName) {
        if (this._needXyScrollWait) {
            if ($gameMap.isXyScrolling()) {
                return false;
            } else {
                this._needXyScrollWait = false;
                return true;
            }
        } else {
            _Game_Interpreter_command357.call(this, params);
            if (this._needXyScrollWait) return false;
            return true;
        }
    } else {
        return _Game_Interpreter_command357.call(this, params);
    }
};

})();
