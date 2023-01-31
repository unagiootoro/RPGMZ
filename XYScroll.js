/*:
@target MZ
@plugindesc XY座標スクロール v1.2.1
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/XYScroll.js
@help
XY座標を指定してスクロールできるようにするプラグインです。
スクロールが完了するまでウェイトさせることも可能です。

【使用方法】
■スクロールの実行
プラグインコマンド「スクロール開始」を実行してスクロールを行います。

■相対座標へのスクロール
プラグインコマンド「相対スクロール開始」を実行すると
現在の画面表示位置からの相対座標へスクロールを行います。

■画面位置の記憶と記憶位置へのスクロール
プラグインコマンド「現在画面位置記憶」を実行することで
現在の画面の座標を記憶します。その後で「記憶位置にスクロール」を実行すると
先ほど記憶した画面位置へスクロールを行います。

■スクリプトでスクロールを実行する
次のようにすることでスクリプトからスクロールを実行することもできます。
$gameMap.startScrollXY(x, y, scrollSpeed);

相対座標によるスクロールの実行を行う場合は以下のように記述します。
$gameMap.startRelativeScrollXY(relX, relY, scrollSpeed);

現在の画面位置の記憶を行う場合は以下のように記述します。
$gameMap.saveDisplayPosition();

記憶した画面位置へのスクロールを行う場合は以下のように記述します。
$gameMap.scrollToSavedDisplayPosition(scrollSpeed);

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

@arg X_BY_VARIABLE_ID
@text X座標(変数指定)
@type variable
@default 0
@desc
スクロール先のX座標を変数で指定します。

@arg Y_BY_VARIABLE_ID
@text Y座標(変数指定)
@type variable
@default 0
@desc
スクロール先のY座標を変数で指定します。

@arg SCROLL_SPEED
@text スクロール速度
@type number
@default 1
@decimals 2
@desc
スクロール速度を指定します。1フレームにスクロールするマス数を指定してください。

@arg WAIT_END_SCROLL
@text スクロール完了まで待機
@type boolean
@default false
@desc
trueを設定すると、スクロール完了まで待機します。


@command StartRelativeScroll
@text 相対スクロール開始
@desc
相対スクロールを開始します。

@arg RELATIVE_X
@text 相対X座標
@type number
@min -255
@default 0
@desc
スクロール先のX座標を指定します。

@arg RELATIVE_Y
@text 相対Y座標
@type number
@min -255
@default 0
@desc
スクロール先のY座標を指定します。

@arg RELATIVE_X_BY_VARIABLE_ID
@text 相対X座標(変数指定)
@type variable
@default 0
@desc
スクロール先のX座標を変数で指定します。

@arg RELATIVE_Y_BY_VARIABLE_ID
@text 相対Y座標(変数指定)
@type variable
@default 0
@desc
スクロール先のY座標を変数で指定します。

@arg SCROLL_SPEED
@text スクロール速度
@type number
@default 1
@decimals 2
@desc
スクロール速度を指定します。1フレームにスクロールするマス数を指定してください。

@arg WAIT_END_SCROLL
@text スクロール完了まで待機
@type boolean
@default false
@desc
trueを設定すると、スクロール完了まで待機します。


@command SaveDisplayPosition
@text 現在画面位置記憶
@desc
現在のスクロール位置を記憶します。


@command ScrollToSavedDisplayPosition
@text 記憶位置にスクロール
@desc
現在画面位置記憶で記憶した位置にスクロールします。

@arg SCROLL_SPEED
@text スクロール速度
@type number
@default 1
@decimals 2
@desc
スクロール速度を指定します。1フレームにスクロールするマス数を指定してください。

@arg WAIT_END_SCROLL
@text スクロール完了まで待機
@type boolean
@default false
@desc
trueを設定すると、スクロール完了まで待機します。
*/

const XYScrollPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {
"use strict";

const params = PluginManager.parameters(XYScrollPluginName)
const SAVE_SCROLL_STATE = params.SAVE_SCROLL_STATE === "true";

PluginManager.registerCommand(XYScrollPluginName, "StartScroll", function(args) {
    let x = parseInt(args.X);
    let y = parseInt(args.Y);
    const xByVariableId = parseInt(args.X_BY_VARIABLE_ID);
    const yByVariableId = parseInt(args.Y_BY_VARIABLE_ID);
    if (xByVariableId > 0) {
        x = $gameVariables.value(xByVariableId);
    }
    if (yByVariableId > 0) {
        y = $gameVariables.value(yByVariableId);
    }
    const scrollSpeed = parseFloat(args.SCROLL_SPEED);
    const waitEndScroll = args.WAIT_END_SCROLL === "true";
    if (waitEndScroll) this._needXyScrollWait = true;
    $gameMap.startScrollXY(x, y, scrollSpeed);
});

PluginManager.registerCommand(XYScrollPluginName, "StartRelativeScroll", function(args) {
    let relX = parseInt(args.RELATIVE_X);
    let relY = parseInt(args.RELATIVE_Y);
    const relXByVariableId = parseInt(args.RELATIVE_X_BY_VARIABLE_ID);
    const relYByVariableId = parseInt(args.RELATIVE_Y_BY_VARIABLE_ID);
    if (relXByVariableId > 0) {
        relX = $gameVariables.value(relXByVariableId);
    }
    if (relYByVariableId > 0) {
        relY = $gameVariables.value(relYByVariableId);
    }
    const scrollSpeed = parseFloat(args.SCROLL_SPEED);
    const waitEndScroll = args.WAIT_END_SCROLL === "true";
    if (waitEndScroll) this._needXyScrollWait = true;
    $gameMap.startRelativeScrollXY(relX, relY, scrollSpeed);
});

PluginManager.registerCommand(XYScrollPluginName, "SaveDisplayPosition", function() {
    $gameMap.saveDisplayPosition();
});

PluginManager.registerCommand(XYScrollPluginName, "ScrollToSavedDisplayPosition", function(args) {
    const scrollSpeed = parseFloat(args.SCROLL_SPEED);
    const waitEndScroll = args.WAIT_END_SCROLL === "true";
    if (waitEndScroll) this._needXyScrollWait = true;
    $gameMap.scrollToSavedDisplayPosition(scrollSpeed);
});

class ScreenScroller {
    constructor() {
        this._scrollSpeed = 1;
        this._x = null;
        this._y = null;
        this._targetX = null;
        this._targetY = null;
        this._moving = false;
        this._targetFar = 0;
    }

    update() {
        if (this._scrolling) this.updateScroll();
    }

    updateScroll() {
        let speed;
        if (this._scrollSpeed < this._targetFar) {
            speed = this._scrollSpeed;
        } else {
            speed = this._targetFar;
        }

        const oy = this._targetY - this._y;
        const ox = this._targetX - this._x;
        const rad = Math.atan2(oy, ox);
        const disX = speed * Math.cos(rad);
        const disY = speed * Math.sin(rad);

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

        if (this._targetFar <= this._scrollSpeed) {
            this._scrolling = false;
            this._targetFar = 0;
        } else {
            this._targetFar -= this._scrollSpeed;
        }
    }

    isScrolling() {
        return this._scrolling;
    }

    startScroll(fromPoint, targetPoint, scrollSpeed, endScrollCallback) {
        this._scrollSpeed = scrollSpeed;
        this._endScrollCallback = endScrollCallback;
        const far = this.calcFar(fromPoint, targetPoint);
        this._targetFar = far;
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
    this._screenScroller = undefined;
    this._savedDisplayPosition = undefined;
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
    const fromPoint = new Point(this._displayX, this._displayY);
    const centerX = x - $gamePlayer.centerX();
    const centerY = y - $gamePlayer.centerY();
    const targetPoint = new Point(centerX, centerY);
    this.screenScroller().startScroll(fromPoint, targetPoint, scrollSpeed);
};

Game_Map.prototype.startRelativeScrollXY = function(relX, relY, scrollSpeed) {
    const fromPoint = new Point(this._displayX, this._displayY);
    const targetPoint = new Point(this._displayX + relX, this._displayY + relY);
    this.screenScroller().startScroll(fromPoint, targetPoint, scrollSpeed);
};

Game_Map.prototype.saveDisplayPosition = function() {
    this._savedDisplayPosition = new Point(this._displayX, this._displayY);
};

Game_Map.prototype.scrollToSavedDisplayPosition = function(scrollSpeed) {
    if (this._savedDisplayPosition) {
        const fromPoint = new Point(this._displayX, this._displayY);
        const targetPoint = new Point(this._savedDisplayPosition.x, this._savedDisplayPosition.y);
        this.screenScroller().startScroll(fromPoint, targetPoint, scrollSpeed);
    }
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
const _Game_Interpreter_updateWait = Game_Interpreter.prototype.updateWait;
Game_Interpreter.prototype.updateWait = function() {
    const result = _Game_Interpreter_updateWait.call(this);
    if (result) return true;
    return this.updateWait_XYScroll();
};

Game_Interpreter.prototype.updateWait_XYScroll = function() {
    if (this._needXyScrollWait) {
        if ($gameMap.isXyScrolling()) {
            return true;
        } else {
            this._needXyScrollWait = false;
            return false;
        }
    }
    return false;
};

})();
