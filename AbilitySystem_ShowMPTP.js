/*:
@target MZ
@plugindesc スキル付け替えシステム MP/TP表示 v1.0.1
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/AbilitySystem_ShowMPTP.js

@help
スキル付け替えシステムでスキル一覧に消費MP/TPを表示するためのパッチです。
このパッチはスキル付け替えシステムのコスト機能が無効のときのみ利用可能です。
コスト機能を有効化すると正しく動かなくなるので注意してください。

なお、このプラグインはAbilitySystem.jsよりも下に導入してください。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

(() => {
"use strict";

const Window_AbilitiesBase = AbilitySystemClassAlias.Window_AbilitiesBase;

Window_AbilitiesBase.prototype.drawSkill = function(index) {
    const skill = this.itemAt(index);
    const rect = this.itemLineRect(index);
    const costWidth = this.costWidth();
    this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
    this.drawSkillCost(skill, rect.x, rect.y, rect.width);
    this.changePaintOpacity(1);
    this.resetTextColor();
};

Window_AbilitiesBase.prototype.costWidth = function() {
    return this.textWidth("000");
};

Window_AbilitiesBase.prototype.drawSkillCost = function(skill, x, y, width) {
    if (this._actor.skillTpCost(skill) > 0) {
        this.changeTextColor(ColorManager.tpCostColor());
        this.drawText(this._actor.skillTpCost(skill), x, y, width, "right");
    } else if (this._actor.skillMpCost(skill) > 0) {
        this.changeTextColor(ColorManager.mpCostColor());
        this.drawText(this._actor.skillMpCost(skill), x, y, width, "right");
    }
};

})();
