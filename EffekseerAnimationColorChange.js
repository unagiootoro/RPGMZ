/*:
@target MZ
@plugindesc Effekseer Animation Color Change v1.0.3
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/EffekseerAnimationColorChange.js
@help
This is a plugin to change the color of Effekseer animation.

【How to use】
In the name of the animation
<color: red, green, blue, gray>
Please specify the color tone of the animation in the form of .

(Example) When setting the color tone to red 255
<color: 255, 0, 0, 0>

【License】
This plugin is available under the terms of the MIT license.


@param AnimationNameParseErrorMessage
@text animation name parse error message
@type string
@default The name of animation ID (%1) is invalid.
@desc
Error message when parsing animation name fails. There is no need to change this parameter.
*/

/*:ja
@target MZ
@plugindesc Effekseerアニメーションカラー変更 v1.0.3
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/EffekseerAnimationColorChange.js
@help
Effekseerアニメーションのカラーを変更するプラグインです。

【使用方法】
アニメーションの名前欄に
<color: red, green, blue, gray>
の形式でアニメーションの色調を指定してください。

(例) 赤255で色調を設定する場合
<color: 255, 0, 0, 0>

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@param AnimationNameParseErrorMessage
@text アニメーション名パースエラーメッセージ
@type string
@default アニメーションID(%1)の名前が不正です。
@desc
アニメーション名のパースに失敗した場合のエラーメッセージです。このパラメータを変更する必要はありません。
*/

const EffekseerAnimationColorChangePluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {
"use strict";

const params = PluginManager.parameters(EffekseerAnimationColorChangePluginName)
const AnimationNameParseErrorMessage = params["AnimationNameParseErrorMessage"];

const _Sprite_Animation_initMembers = Sprite_Animation.prototype.initMembers;
Sprite_Animation.prototype.initMembers = function() {
    _Sprite_Animation_initMembers.call(this);
    this._effectsColorFilter = null;
    this._renderTexture = null;
};

const _Sprite_Animation_update = Sprite_Animation.prototype.update;
Sprite_Animation.prototype.update = function() {
    _Sprite_Animation_update.call(this);
    if (this._effectsColorFilter) this.updateEffectsBackTexture();
};

Sprite_Animation.prototype.setupColor = function(backSprite, tone) {
    if (!backSprite) return;
    this.createDummyBitmap();
    this.createEffekseerColorFilters(backSprite);
    this._effectsColorFilter.setColorTone(tone);
};

Sprite_Animation.prototype.createDummyBitmap = function() {
    this.bitmap = new Bitmap(Graphics.width, Graphics.height);
};

Sprite_Animation.prototype.createEffekseerColorFilters = function(backSprite) {
    if (!this.filters) this.filters = [];
    this._effectsColorFilter = new EffectsColorFilter();
    this.filters.push(this._effectsColorFilter);
    this._backSprite = backSprite;
};

Sprite_Animation.prototype.updateEffectsBackTexture = function() {
    if (!this._renderTexture) {
        this._renderTexture = PIXI.RenderTexture.create(Graphics.width, Graphics.height);
    }
    const renderer = Graphics.app.renderer;
    renderer.render(this._backSprite, this._renderTexture);
    this._effectsColorFilter.uniforms.uSamplerBack = this._renderTexture;
};

const _Sprite_Animation_destroy = Sprite_Animation.prototype.destroy;
Sprite_Animation.prototype.destroy = function(options) {
    _Sprite_Animation_destroy.call(this, options);
    if (this.bitmap) this.bitmap.destroy();
    if (this._renderTexture) this._renderTexture.destroy({ destroyBase: true });
};


const _Spriteset_Base_initialize = Spriteset_Base.prototype.initialize;
Spriteset_Base.prototype.initialize = function() {
    _Spriteset_Base_initialize.call(this);
    // 競合対策
    if (!this._effectsSprite) this._effectsSprite = null;
};

const _Spriteset_Base_createAnimationSprite = Spriteset_Base.prototype.createAnimationSprite;
Spriteset_Base.prototype.createAnimationSprite = function(
    targets, animation, mirror, delay
) {
    _Spriteset_Base_createAnimationSprite.call(this, targets, animation, mirror, delay);
    if (!this.isMVAnimation(animation)) {
        const sprite = this._animationSprites[this._animationSprites.length - 1];
        const tone = this.parseAnimationNameColor(animation);
        if (tone) {
            sprite.setupColor(this.getBackSprite(), tone);
            sprite.updateEffectsBackTexture();
        }
    }
};

// アニメーション表示用のバックスプライトを取得する。
// Spriteset_Map及びSpriteset_Battleでオーバーライドする。
Spriteset_Base.prototype.getBackSprite = function() {
    return null;
};

// エフェクト表示に使用するスプライトを生成する。
// このスプライトはコンテナとしてのみ使用するためサイズの設定は不要であるが、
// MVアニメーションを画面全体に表示する際にサイズを参照するため設定している。
Spriteset_Base.prototype.createEffectsSprite = function() {
    this._effectsSprite = new Sprite();
    this._effectsSprite.setFrame(0, 0, Graphics.width, Graphics.height);
    this._baseSprite.addChild(this._effectsSprite);
    this._effectsContainer = this._effectsSprite;
};

Spriteset_Base.prototype.parseAnimationNameColor = function(animation) {
    const matchData = animation.name.match(/\<color\:(.+?)\>/);
    if (!matchData) return null;
    const strNote = matchData[1];
    try {
        const tone = JSON.parse(`[${strNote}]`);
        return tone;
    } catch(e) {
        console.error(e);
        throw new Error(AnimationNameParseErrorMessage.format(animation.id));
    }
};


// Effekseerアニメーション表示用のコンテナの上にEffekseerアニメーションを乗せる
Spriteset_Map.prototype.createTilemap = function() {
    const tilemap = new Tilemap();
    tilemap.tileWidth = $gameMap.tileWidth();
    tilemap.tileHeight = $gameMap.tileHeight();
    tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    tilemap.verticalWrap = $gameMap.isLoopVertical();
    this._baseSprite.addChild(tilemap);
    this.createEffectsSprite();
    this._tilemap = tilemap;
    this.loadTileset();
};

Spriteset_Map.prototype.getBackSprite = function() {
    return this._tilemap._lowerLayer;
};


// Effekseerアニメーション表示用のコンテナの上にEffekseerアニメーションを乗せる
Spriteset_Battle.prototype.createBattleback = function() {
    this._back1Sprite = new Sprite_Battleback(0);
    this._back2Sprite = new Sprite_Battleback(1);
    this._battleContainerSprite = new Sprite();
    this._battleContainerSprite.addChild(this._back1Sprite);
    this._battleContainerSprite.addChild(this._back2Sprite);
};

Spriteset_Battle.prototype.createBattleField = function() {
    const width = Graphics.boxWidth;
    const height = Graphics.boxHeight;
    const x = (Graphics.width - width) / 2;
    const y = (Graphics.height - height) / 2;
    this._battleField = new Sprite();
    this._battleField.setFrame(0, 0, width, height);
    this._battleField.x = x;
    this._battleField.y = y - this.battleFieldOffsetY();
    this._battleContainerSprite.addChild(this._battleField);
    this._baseSprite.addChild(this._battleContainerSprite);
    this.createEffectsSprite();
};

Spriteset_Battle.prototype.getBackSprite = function() {
    return this._battleContainerSprite;
};


Sprite_Battler.prototype.createDamageSprite = function() {
    const last = this._damages[this._damages.length - 1];
    const sprite = new Sprite_Damage();
    if (last) {
        sprite.x = last.x + 8;
        sprite.y = last.y - 16;
    } else {
        sprite.x = this.x + this.damageOffsetX();
        sprite.y = this.y + this.damageOffsetY();
    }
    sprite.setup(this._battler);
    this._damages.push(sprite);
    const spriteset = SceneManager._scene._spriteset;
    const baseSprite = spriteset._baseSprite;
    baseSprite.addChild(sprite);
};


class EffectsColorFilter extends ColorFilter {
    initialize() {
        super.initialize();
        this.uniforms.uSamplerBack = 0;
    }

    _fragmentSrc() {
        const src = `
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float hue;
            uniform vec4 colorTone;
            uniform vec4 blendColor;
            uniform float brightness;
            uniform sampler2D uSamplerBack; // タイルマップのテクスチャ

            vec3 rgbToHsl(vec3 rgb) {
                float r = rgb.r;
                float g = rgb.g;
                float b = rgb.b;
                float cmin = min(r, min(g, b));
                float cmax = max(r, max(g, b));
                float h = 0.0;
                float s = 0.0;
                float l = (cmin + cmax) / 2.0;
                float delta = cmax - cmin;
                if (delta > 0.0) {
                    if (r == cmax) {
                        h = mod((g - b) / delta + 6.0, 6.0) / 6.0;
                    } else if (g == cmax) {
                        h = ((b - r) / delta + 2.0) / 6.0;
                    } else {
                        h = ((r - g) / delta + 4.0) / 6.0;
                    }
                    if (l < 1.0) {
                        s = delta / (1.0 - abs(2.0 * l - 1.0));
                    }
                }
                return vec3(h, s, l);
            }

            vec3 hslToRgb(vec3 hsl) {
                float h = hsl.x;
                float s = hsl.y;
                float l = hsl.z;
                float c = (1.0 - abs(2.0 * l - 1.0)) * s;
                float x = c * (1.0 - abs((mod(h * 6.0, 2.0)) - 1.0));
                float m = l - c / 2.0;
                float cm = c + m;
                float xm = x + m;
                if (h < 1.0 / 6.0) {
                    return vec3(cm, xm, m);
                } else if (h < 2.0 / 6.0) {
                    return vec3(xm, cm, m);
                } else if (h < 3.0 / 6.0) {
                    return vec3(m, cm, xm);
                } else if (h < 4.0 / 6.0) {
                    return vec3(m, xm, cm);
                } else if (h < 5.0 / 6.0) {
                    return vec3(xm, m, cm);
                } else {
                    return vec3(cm, m, xm);
                }
            }

            void main() {
                vec4 sample = texture2D(uSampler, vTextureCoord);
                vec4 sampleBack = texture2D(uSamplerBack, vTextureCoord); // タイルマップのsample
                float a = sample.a;
                vec3 hsl = rgbToHsl(sample.rgb);
                hsl.x = mod(hsl.x + hue / 360.0, 1.0);
                hsl.y = hsl.y * (1.0 - colorTone.a / 255.0);
                vec3 rgb = hslToRgb(hsl);

                // エフェクト表示箇所にタイルマップのピクセルを加算する
                float r = rgb.r + sampleBack.rgb.r * a;
                float g = rgb.g + sampleBack.rgb.g * a;
                float b = rgb.b + sampleBack.rgb.b * a;

                float r2 = colorTone.r / 255.0;
                float g2 = colorTone.g / 255.0;
                float b2 = colorTone.b / 255.0;
                float r3 = blendColor.r / 255.0;
                float g3 = blendColor.g / 255.0;
                float b3 = blendColor.b / 255.0;
                float i3 = blendColor.a / 255.0;
                float i1 = 1.0 - i3;
                r = clamp((r / a + r2) * a, 0.0, 1.0);
                g = clamp((g / a + g2) * a, 0.0, 1.0);
                b = clamp((b / a + b2) * a, 0.0, 1.0);
                r = clamp(r * i1 + r3 * i3 * a, 0.0, 1.0);
                g = clamp(g * i1 + g3 * i3 * a, 0.0, 1.0);
                b = clamp(b * i1 + b3 * i3 * a, 0.0, 1.0);
                r = r * brightness / 255.0;
                g = g * brightness / 255.0;
                b = b * brightness / 255.0;
                gl_FragColor = vec4(r, g, b, a);
            }
        `
        return src;
    }
}

})();
