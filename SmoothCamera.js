/*:
@target MZ
@plugindesc なめらかカメラ v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SmoothCamera.js
@help
画面スクロールのためのカメラ移動をなめらかに行うプラグインです。

【使用方法】
基本的に導入するだけで使用できます。

【スムーズカメラの有効/無効切り替え】
プラグインパラメータ「スムーズカメラ有効可スイッチID」にスイッチを指定すると、
そのスイッチのON/OFFでスムーズカメラの有効/無効を切り替えることができるようになります。

【スクロール速度の変更】
スクロール速度を変更したい場合、プラグインパラメータ「基本スクロール除数」を変更してください。
「基本スクロール除数」を大きな値にするとスクロールが遅くなり、小さな値にするとスクロールが早くなります。
スクロール速度の詳細な仕様については以下の【スクロール距離の計算式】を参照してください。

【スクロール距離の計算式】
※スクロールの挙動をカスタマイズしたい人向けの情報です。

スクロールの距離については以下の計算式で求められます。
・スクロール係数 = 基本スクロール除数 / プレイヤーとディスプレイの距離
・Xスクロール距離 = カメラとプレイヤーのX距離 / スクロール係数
・Yスクロール距離 = カメラとプレイヤーのY距離 / スクロール係数

なお、プレイヤーとディスプレイの距離については以下の条件を満たすものとします。
・最小スクロール距離 <= プレイヤーとディスプレイの距離 <= 最大スクロール距離

@param EnableSmoothCameraSwitchId
@text スムーズカメラ有効可スイッチID
@type switch
@default 0
@desc
スムーズカメラの有効/無効を切り替えるスイッチIDを指定します。0だと常に有効になります。

@param MaxScrollFar
@text 最大スクロール距離
@type number
@default 8
@desc
最大スクロール距離を指定します。

@param MinScrollFar
@text 最小スクロール距離
@type number
@default 2
@desc
最小スクロール距離を指定します。

@param BaseScrollDiv
@text 基本スクロール除数
@type number
@default 32
@desc
基本スクロール除数を指定します。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const NullNullCameraPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {
"use strict";


const params = PluginManager.parameters(NullNullCameraPluginName);
const PP = {
    EnableSmoothCameraSwitchId: parseInt(params.EnableSmoothCameraSwitchId),
    MaxScrollFar: parseInt(params.MaxScrollFar),
    MinScrollFar: parseInt(params.MinScrollFar),
    BaseScrollDiv: parseInt(params.BaseScrollDiv),
};


class CameraUtils {
    static isSmoothCamera() {
        if (PP.EnableSmoothCameraSwitchId > 0) {
            return $gameSwitches.value(PP.EnableSmoothCameraSwitchId);
        }
        return true;
    }

    static xToHorz(x) {
        if (x < 0) {
            return 4;
        } else if (x > 0) {
            return 6;
        }
        return 0;
    }

    static yToVert(y) {
        if (y < 0) {
            return 8;
        } else if (y > 0) {
            return 2;
        }
        return 0;
    }
}

const _Game_Player_updateScroll = Game_Player.prototype.updateScroll;
Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
    if (CameraUtils.isSmoothCamera()) {
        this.updateSmoothScroll(PP.MinScrollFar, PP.MaxScrollFar, PP.BaseScrollDiv);
    } else {
        _Game_Player_updateScroll.call(this, lastScrolledX, lastScrolledY);
    }
};

Game_Player.prototype.updateSmoothScroll = function(minFar, maxFar, div) {
    const centerX = $gamePlayer._realX - $gamePlayer.centerX();
    const centerY = $gamePlayer._realY - $gamePlayer.centerY();
    const xDiff = centerX - $gameMap.displayX();
    const yDiff = centerY - $gameMap.displayY();
    const horz = CameraUtils.xToHorz(xDiff);
    const vert = CameraUtils.yToVert(yDiff);
    let far = Math.sqrt(xDiff**2 + yDiff**2);
    if (far < minFar) far = minFar;
    if (far > maxFar) far = maxFar;
    const per = div / far;
    $gameMap.doScroll(horz, Math.abs(xDiff / per));
    $gameMap.doScroll(vert, Math.abs(yDiff / per));
};

window.CameraUtils = CameraUtils;

})();
