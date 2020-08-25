/*:
@target MZ
@plugindesc スキル発動待機時間ゲージ表示プラグイン v1.0.1
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/TPB_CastGauge.js

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

    Sprite_Gauge.prototype.updateFlashing = function() {
        if (this._statusType === "time" || this._statusType === "cast") {
            this._flashingCount++;
            if (this._battler.isInputting()) {
                if (this._flashingCount % 30 < 15) {
                    this.setBlendColor(this.flashingColor1());
                } else {
                    this.setBlendColor(this.flashingColor2());
                }
            } else {
                this.setBlendColor([0, 0, 0, 0]);
            }
        }
    };

    Sprite_Gauge.prototype.smoothness = function() {
        if (this.isNeedCast() && this._battler._tpbState === "casting") return 1;
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

    const _Sprite_Gauge_gaugeRate = Sprite_Gauge.prototype.gaugeRate;
    Sprite_Gauge.prototype.gaugeRate = function() {
        if (this._statusType === "cast" && this._battler._tpbState === "acting") return 1;
        return _Sprite_Gauge_gaugeRate.call(this);
    };

    Sprite_Gauge.prototype.isNeedCast = function() {
        return this._battler.tpbRequiredCastTime() > 0;
    }
})();
