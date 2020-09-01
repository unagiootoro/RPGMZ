/*:
@target MV MZ
@plugindesc ステート付与装備 v1.0.2
@author うなぎおおとろ(twitter https://twitter.com/unagiootoro8388)
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/EquipState.js

@help
アイテムを装備している間、ステートを付与するプラグインです。
このプラグインを使用することで、装備すると常に混乱するようなアイテムを作ることができます。

[使い方]
武器/防具のメモ欄に、
<EquipState: ステートID>
と入力すると装備している間、ステートIDに該当するステートにすることができます。
例えば、<EquipState: 4>と記述すると、装備している間、ID4のステートを付与します。
また、<EquipState: [4, 5]>と指定することで、複数のステートを付与することもできます。

※注意
ステートを付与する装備を初期装備に指定すると、ステートが反映されません。
初期装備のステートは、「全回復」コマンドを実行させることで反映させられるため、
ステート付与装備を初期装備に指定する場合は、ゲーム開始時に「全回復」コマンドを実行してください。

[SimplePassiveSkillMZ.jsとの連携(MZ限定)]
ツクールMZの準公式プラグイン「SimplePassiveSkillMZ.js」と連携することで、
パッシブスキル取得時にステートを付与することができます。
この機能を使用する場合、パッシブスキルで設定した武器または防具のメモ欄に
<EquipState: ステートID>
と入力くしてください。

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。
*/
{
    "use strict";

    /* class Game_Item */
    Game_Item.prototype.equipStatesId = function() {
        const itemData = this.object();
        if (!itemData || !this.isEquipItem()) return null;
        if (!itemData.meta.EquipState) return [];
        const stateId = JSON.parse(itemData.meta.EquipState);
        if (typeof stateId === "number") return [stateId];
        return stateId;
    };


    /* class Game_Actor */
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._equipStatesId = [];
    };

    const _Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        _Game_Actor_changeEquip.call(this, slotId, item);
        this.updateEquipStates();
    };

    const _Game_Actor_forceChangeEquip = Game_Actor.prototype.forceChangeEquip;
    Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
        _Game_Actor_forceChangeEquip.call(this, slotId, item);
        this.updateEquipStates();
    };

    const _Game_Actor_clearStates = Game_Actor.prototype.clearStates;
    Game_Actor.prototype.clearStates = function() {
        _Game_Actor_clearStates.call(this);
        this.updateEquipStates();
    };

    Game_Actor.prototype.allEquipItems = function() {
        if (!this._equips) return null;
        const equipItems = this._equips.concat();
        if (typeof DataManager.processPassiveSkill !== "undefined") {
            if (!this._skills) return null;
            for (const skillId of this._skills) {
                const skill = $dataSkills[skillId];
                if (skill && skill.passive) equipItems.push(skill.passive);
            }
        }
        return equipItems;
    }

    Game_Actor.prototype.updateEquipStates = function() {
        let equipStatesId = [];
        const equipItems = this.allEquipItems();
        if (!equipItems) return;
        console.log(equipItems);
        for (const equip of this.allEquipItems()) {
            if (!equip.equipStatesId()) continue;
            equipStatesId = equipStatesId.concat(equip.equipStatesId());
        }
        for (const stateId of equipStatesId) {
            if (this.isStateAddable(stateId)) this.addState(stateId);
        }
        for (const stateId of this._equipStatesId) {
            if (equipStatesId.indexOf(stateId) === -1) {
                this.eraseState(stateId);
            }
        }
        this._equipStatesId = equipStatesId;
    };

    const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Actor.prototype.onBattleEnd = function() {
        _Game_Battler_onBattleEnd.call(this);
        this.updateEquipStates();
    }

    const _Game_Actor_learnSkill = Game_Actor.prototype.learnSkill;
    Game_Actor.prototype.learnSkill = function(skillId) {
        _Game_Actor_learnSkill.call(this, skillId);
        this.updateEquipStates();
    }

    const _Game_Actor_forgetSkill = Game_Actor.prototype.forgetSkill;
    Game_Actor.prototype.forgetSkill = function(skillId) {
        _Game_Actor_forgetSkill.call(this, skillId);
        this.updateEquipStates();
    }
}
