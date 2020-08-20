/*:
@target MZ
@plugindesc スキル発動待機時間をゲージに表示します。
@author うなぎおおとろ(twitter https://twitter.com/unagiootoro8388)

@param CastGaugeColor1
@type string
@default #ff0000
@desc
スキル発動待機ゲージのメインカラーを指定します。

@param CastGaugeColor2
@type string
@default #ffaaaa
@desc
スキル発動待機ゲージのサブカラーを指定します。

@help
スキル発動待機時間をゲージとして表示するプラグインです。
このプラグインは導入するだけで使用できます。

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。

[更新履歴]
v1.0.0 新規作成
*/

(() => {
    "use strict";

    const pluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];
    const params = PluginManager.parameters(pluginName);
    const CastGaugeColor1 = params["CastGaugeColor1"];
    const CastGaugeColor2 = params["CastGaugeColor2"];

    /* Sprite_Gauge */
    Sprite_Gauge.prototype.gaugeColor1 = function() {
        switch (this._statusType) {
            case "hp":
                return ColorManager.hpGaugeColor1();
            case "mp":
                return ColorManager.mpGaugeColor1();
            case "tp":
                return ColorManager.tpGaugeColor1();
            case "time":
                return ColorManager.ctGaugeColor1();
            case "cast":
                return CastGaugeColor1;
            default:
                return ColorManager.normalColor();
        }
    };

    Sprite_Gauge.prototype.gaugeColor2 = function() {
        switch (this._statusType) {
            case "hp":
                return ColorManager.hpGaugeColor2();
            case "mp":
                return ColorManager.mpGaugeColor2();
            case "tp":
                return ColorManager.tpGaugeColor2();
            case "time":
                return ColorManager.ctGaugeColor2();
            case "cast":
                return CastGaugeColor2;
            default:
                return ColorManager.normalColor();
        }
    };

    Sprite_Gauge.prototype.currentValue = function() {
        if (this._battler) {
            switch (this._statusType) {
                case "hp":
                    return this._battler.hp;
                case "mp":
                    return this._battler.mp;
                case "tp":
                    return this._battler.tp;
                case "time":
                    return this._battler.tpbChargeTime();
                case "cast":
                    return this._battler._tpbCastTime;
            }
        }
        return NaN;
    };

    Sprite_Gauge.prototype.currentMaxValue = function() {
        if (this._battler) {
            switch (this._statusType) {
            case "hp":
                return this._battler.mhp;
            case "mp":
                return this._battler.mmp;
            case "tp":
                return this._battler.maxTp();
            case "time":
                return 1;
            case "cast":
                return this._battler.tpbRequiredCastTime();
            }
        }
        return NaN;
    };

    Sprite_Gauge.prototype.gaugeX = function() {
        return (this._statusType === "time" || this._statusType === "cast") ? 0 : 30;
    };

    Sprite_Gauge.prototype.update = function() {
        Sprite.prototype.update.call(this);
        if (this._duration === 0) {
            if (this._battler._tpbState === "casting" && this._statusType === "time" && this.isNeedCast()) {
                this._statusType = "cast";
            } else if (this._battler._tpbState === "charging" && this._statusType === "cast") {
                this._statusType = "time";
            }
        }
        this.updateBitmap();
    };

    Sprite_Gauge.prototype.smoothness = function() {
        if (this.isNeedCast() && this._battler._tpbState === "casting") return 2;
        return (this._statusType === "time" || this._statusType === "cast") ? 5 : 20;
    };

    Sprite_Gauge.prototype.redraw = function() {
        this.bitmap.clear();
        const currentValue = this.currentValue();
        if (!isNaN(currentValue)) {
            this.drawGauge();
            if (this._statusType !== "time" && this._statusType !== "cast") {
                this.drawLabel();
                if (this.isValid()) {
                    this.drawValue();
                }
            }
        }
    };

    Sprite_Gauge.prototype.isNeedCast = function() {
        return this._battler.tpbRequiredCastTime() > 0;
    }
})();
