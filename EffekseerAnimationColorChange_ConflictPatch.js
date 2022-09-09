/*:
@target MZ
@plugindesc Effekseerアニメーションカラー変更 競合回避用パッチ v1.0.2
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/EffekseerAnimationColorChange_ConflictPatch.js
@help
EffekseerAnimationColorChange.jsの競合回避用パッチプラグインです。

【使用方法】
以下の順番でプラグインを導入してください。
・MPP_Pseudo3DBattle.js
・EffekseerAnimationColorChange.js
・EffekseerAnimationColorChange_ConflictPatch.js

本パッチは以下のバージョンで動作確認を行っています。
・EffekseerAnimationColorChange.js v1.0.1
・MPP_Pseudo3DBattle.js 1.3.0

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

(() => {
"use strict";

if (typeof Spriteset_Battle.prototype.pseudo3dSprites !== "undefined") {
    Spriteset_Battle.prototype.pseudo3dSprites = function () {
        const damages = this._baseSprite.children.filter(sprite => sprite instanceof Sprite_Damage)
        return [...this._battleField.children, ...damages];
    };
}

if (typeof Spriteset_Battle.prototype.setupBattlebackEffectsOffset !== "undefined") {
    Spriteset_Battle.prototype.setupBattlebackEffectsOffset = function () {
        const { x, y } = this._battleField;
        this._back1Sprite.setEffectsOffset(x, y);
        this._back2Sprite.setEffectsOffset(x, y);
        if (this._back1FixSprite) {
            this._back1FixSprite.setEffectsOffset(x, y);
        }
    };
}

if (typeof Spriteset_Battle.prototype.pseudo3dSprites !== "undefined") {
    // MPP_Pseudo3DBattle.jsのスプライト変形によって合成用テクスチャとの間に差異が出るため、
    // BattleFieldは合成用テクスチャにレンダリングしないようにする。
    Spriteset_Battle.prototype.createBattleField = function() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        const x = (Graphics.width - width) / 2;
        const y = (Graphics.height - height) / 2;
        this._battleField = new Sprite();
        this._battleField.setFrame(0, 0, width, height);
        this._battleField.x = x;
        this._battleField.y = y - this.battleFieldOffsetY();
        this._baseSprite.addChild(this._battleContainerSprite);
        this._baseSprite.addChild(this._battleField);
        this.createEffectsSprite();
    };
}

})();
