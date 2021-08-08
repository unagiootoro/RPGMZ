/*:
@target MZ
@plugindesc のこぎりトランジション v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SawTransition.js
@help
ザーッと画面が切り替わるようなトランジションを提供するプラグインです。

【使用方法】
■ 場所移動時にトランジションする場合
マップで場所移動する前にプラグインコマンド「マップ変更トランジション開始」を実行してください。

■ イベントでトランジションを実行する場合
画面をブラックアウトするにはプラグインコマンド「エフェクトアウトトランジション開始」を実行してください。
ブラックアウトした後、再び画面を表示するには「エフェクトイントランジション開始」を実行してください。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@param SawTransitionSpeed
@text のこぎりトランジション速度
@type number
@default 64
@desc トランジションの速度をフレーム単位で指定します。

@param SawTransitionImageWidth
@text のこぎりトランジション画像横幅
@type number
@default 300
@desc のこぎりトランジション画像の横幅を指定します。


@command StartTransitionEffectIn
@text エフェクトイントランジション開始
@desc エフェクトイントランジションを開始します。


@command StartTransitionEffectOut
@text エフェクトアウトトランジション開始
@desc エフェクトアウトトランジションを開始します。


@command MapChangeStartTransition
@text マップ変更トランジション開始
@desc マップ変更トランジションを開始します。
*/

const SawTransitionPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {
"use strict";

class Xorshift128 {
    constructor(seed) {
        this.x = 123456789;
        this.y = 362436069;
        this.z = 521288629;
        this.w = seed;
    }

    xor128() {
        var t = this.x ^ (this.x << 11);
        this.x = this.y;
        this.y = this.z;
        this.z = this.w;
        this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
        return this.w;
    }

    rand(obj) {
        var abs = Math.abs(this.xor128());
        if(typeof obj === "number"){
            return abs % obj;
        }
        return (abs % (obj.max - obj.min + 1)) + obj.min;
    }
}


const PP = {};
const params = PluginManager.parameters(SawTransitionPluginName);
PP.SawTransitionSpeed = parseInt(params["SawTransitionSpeed"]);
PP.SawTransitionImageWidth = parseInt(params["SawTransitionImageWidth"]);


PluginManager.registerCommand(SawTransitionPluginName, "StartTransitionEffectIn", function(args) {
    $gameTemp.setMapChangeEffectSignal("effectIn");
});

PluginManager.registerCommand(SawTransitionPluginName, "StartTransitionEffectOut", function(args) {
    $gameTemp.setMapChangeEffectSignal("effectOut");
});

PluginManager.registerCommand(SawTransitionPluginName, "MapChangeStartTransition", function(args) {
    $gameTemp.setMapChangeEffectSignal("effectOut");
    $gameTemp.setMapTransferTransitionSignal(true);
});


ImageManager.loadTransitionImage = function() {
    if (!this._transitionImageCache) {
        this._createTransitionImage();
    }
    return this._transitionImageCache;
};

ImageManager._createTransitionImage = function() {
    const bitmap = new Bitmap(Graphics.width + 300, Graphics.height);
    bitmap.fillRect(300, 0, Graphics.width, bitmap.height, "#000000");
    const xorshift = new Xorshift128(65535);
    for (let y = 0; y < Graphics.height; y++) {
        const x = xorshift.rand(300);
        bitmap.fillRect(x, y, 300 - x, 1, "#000000");
    }
    this._transitionImageCache = bitmap;
};


// signal: none, effectOut, effectIn
Game_Temp.prototype.setMapChangeEffectSignal = function(signal) {
    this._mapChangeEffectSignal = signal;
};

Game_Temp.prototype.getMapChangeEffectSignal = function() {
    return this._mapChangeEffectSignal;
};

// signal: true, false
Game_Temp.prototype.setMapTransferTransitionSignal = function(signal) {
    this._mapTransferTransitionSignal = signal;
};

Game_Temp.prototype.getMapTransferTransitionSignal = function() {
    return this._mapTransferTransitionSignal;
};


const _Scene_Map_create = Scene_Map.prototype.create;
Scene_Map.prototype.create = function() {
    _Scene_Map_create.call(this);
    this._mapChangeEffectPhase = "none";
};

Scene_Map.prototype.startMapChangeEffectOut = function() {
    this._spriteset.startMapChangeEffectOut();
    this._mapChangeEffectPhase = "effectOut";
};

Scene_Map.prototype.startMapChangeEffectIn = function() {
    this._spriteset.startMapChangeEffectIn();
    this._mapChangeEffectPhase = "effectIn";
};

const _Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    // 場所移動トランジションの場合はここでeffectIn開始
    if ($gameTemp.getMapTransferTransitionSignal() && $gameTemp.getMapChangeEffectSignal() === "effectIn") {
        $gameTemp.setMapChangeEffectSignal(null);
        this.startMapChangeEffectIn();
        $gameTemp.setMapTransferTransitionSignal(false);
    }
};

const _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    if (this._mapChangeEffectPhase === "none") {
        let canUpdate = true;
        if ($gameTemp.getMapChangeEffectSignal() === "effectOut") {
            $gameTemp.setMapChangeEffectSignal(null);
            this.startMapChangeEffectOut();
            canUpdate = false;
        } else if ($gameTemp.getMapChangeEffectSignal() === "effectIn") {
            // 場所移動トランジションでない場合はここでeffectIn開始
            if (!$gameTemp.getMapTransferTransitionSignal()) {
                $gameTemp.setMapChangeEffectSignal(null);
                this.startMapChangeEffectIn();
                canUpdate = false;
            }
        }
        if (canUpdate) {
            _Scene_Map_update.call(this);
        } else {
            Scene_Message.prototype.update.call(this);
        }
    } else {
        Scene_Message.prototype.update.call(this);
        if (this._mapChangeEffectPhase === "effectOut") {
            if (!this._spriteset.isMapChangeEffectShowing()) {
                this._mapChangeEffectPhase = "none";
                if ($gameTemp.getMapTransferTransitionSignal()) {
                    $gameTemp.setMapChangeEffectSignal("effectIn");
                }
            }
        } else if (this._mapChangeEffectPhase === "effectIn") {
            if (!this._spriteset.isMapChangeEffectShowing()) {
                this._mapChangeEffectPhase = "none";
            }
        }
    }
};


class MapChangeEffectController {
    constructor(sprite) {
        this._sprite = sprite;
        this._mapChangeEffectPhase = "none";
        if ($gameTemp.getMapChangeEffectSignal() !== "effectIn") {
            sprite.hide();
        }
    }

    update() {
        if (!this.isMapChangeEffectShowing()) return;
        if (this._mapChangeEffectPhase === "effectOut") {
            this._sprite.x -= PP.SawTransitionSpeed;
            if (this._sprite.x < this.transitionFadeoutEndX()) {
                this._sprite.x = this.transitionFadeoutEndX();
                this._mapChangeEffectPhase = "none";
            }
        } else if (this._mapChangeEffectPhase === "effectIn") {
            this._sprite.x += PP.SawTransitionSpeed;
            if (this._sprite.x > this.transitionFadeoutStartX()) {
                this._sprite.x = this.transitionFadeoutStartX();
                this._mapChangeEffectPhase = "none";
            }
        }
    }

    startMapChangeEffectOut() {
        this._sprite.x = this.transitionFadeoutStartX();
        this._mapChangeEffectPhase = "effectOut";
        this._sprite.show();
    }

    startMapChangeEffectIn() {
        this._sprite.x = this.transitionFadeoutEndX();
        this._mapChangeEffectPhase = "effectIn";
        this._sprite.show();
    }

    isMapChangeEffectShowing() {
        return this._mapChangeEffectPhase !== "none";
    }

    transitionFadeoutStartX() {
        return Graphics.width + PP.SawTransitionImageWidth;
    }

    transitionFadeoutEndX() {
        return -PP.SawTransitionImageWidth;
    }
}


const _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function() {
    _Spriteset_Map_createUpperLayer.call(this);
    this.createMapChangeEffectSprite();
};

Spriteset_Map.prototype.createMapChangeEffectSprite = function() {
    const sprite = new Sprite();
    const bitmap = ImageManager.loadTransitionImage();
    sprite.bitmap = bitmap;
    this._mapChangeEffectSprite = sprite;
    this.addChild(sprite);
    this._mapChangeEffectSpriteController = new MapChangeEffectController(sprite);
};

const _Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
    _Spriteset_Map_update.call(this);
    this._mapChangeEffectSpriteController.update();
};

Spriteset_Map.prototype.startMapChangeEffectOut = function() {
    this._mapChangeEffectSpriteController.startMapChangeEffectOut();
};

Spriteset_Map.prototype.startMapChangeEffectIn = function() {
    this._mapChangeEffectSpriteController.startMapChangeEffectIn();
};

Spriteset_Map.prototype.isMapChangeEffectShowing = function() {
    return this._mapChangeEffectSpriteController.isMapChangeEffectShowing();
};

})();
