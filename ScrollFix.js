/*:
@target MZ
@plugindesc 画面スクロール固定化 v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/ScrollFix.js
@help
画面スクロール固定の有効/無効の切り替え機能を追加するプラグインです。

【使用方法】
プラグインコマンド「スクロール固定」を実行することでスクロールを
固定することができます。また、「スクロール固定解除」によって
スクロールの固定化を解除することができます。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@command ScrollFix
@text スクロール固定
@desc スクロールを固定します。

@arg Axis
@text 軸
@type select
@option X
@value X
@option Y
@value Y
@option X and Y
@value XAndY
@default XAndY
@desc スクロールを固定する軸を指定します。

@command ScrollUnFix
@text スクロール固定解除
@desc スクロールの固定を解除します。

@arg Axis
@text 軸
@type select
@option X
@value X
@option Y
@value Y
@option X and Y
@value XAndY
@default XAndY
@desc スクロールの固定を解除する軸を指定します。
*/

"use strict";

const ScrollFixPluginName = document.currentScript ? document.currentScript.src.match(/^.*\/(.+)\.js$/)[1] : "ScrollFix";

{
    function pluginCommandAxisToDirection(axis) {
        switch (axis) {
            case "X":
                return [6, 4];
            case "Y":
                return [8, 2];
        }
        return [8, 6, 2, 4];
    }

    PluginManager.registerCommand(ScrollFixPluginName, "ScrollFix", function(args) {
        const directions = pluginCommandAxisToDirection(args.Axis);
        $gameMap.setScrollFix(directions);
    });

    PluginManager.registerCommand(ScrollFixPluginName, "ScrollUnFix", function(args) {
        const directions = pluginCommandAxisToDirection(args.Axis);
        $gameMap.setUnScrollFix(directions);
    });


    const _Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.call(this);
        this._scrollFixedDirection = [];
    };

    Game_Map.prototype.setScrollFix = function(scrollFixedDirections) {
        for (const dir of scrollFixedDirections) {
            this._scrollFixedDirection[dir] = true;
        }
    };

    Game_Map.prototype.setUnScrollFix = function(scrollUnFixDirections) {
        for (const dir of scrollUnFixDirections) {
            this._scrollFixedDirection[dir] = false;
        }
    };

    Game_Map.prototype.checkScrollFixed = function(direction) {
        return !!this._scrollFixedDirection[direction];
    };

    const _Game_Map_scrollDown = Game_Map.prototype.scrollDown;
    Game_Map.prototype.scrollDown = function(distance) {
        if (this.checkScrollFixed(2)) return;
        _Game_Map_scrollDown.call(this, distance);
    };

    const _Game_Map_scrollLeft = Game_Map.prototype.scrollLeft;
    Game_Map.prototype.scrollLeft = function(distance) {
        if (this.checkScrollFixed(4)) return;
        _Game_Map_scrollLeft.call(this, distance);
    };

    const _Game_Map_scrollRight = Game_Map.prototype.scrollRight;
    Game_Map.prototype.scrollRight = function(distance) {
        if (this.checkScrollFixed(6)) return;
        _Game_Map_scrollRight.call(this, distance);
    };

    const _Game_Map_scrollUp = Game_Map.prototype.scrollUp;
    Game_Map.prototype.scrollUp = function(distance) {
        if (this.checkScrollFixed(8)) return;
        _Game_Map_scrollUp.call(this, distance);
    };
}
