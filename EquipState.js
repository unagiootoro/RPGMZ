/*:
@target MV MZ
@plugindesc ステート付与装備
@author うなぎおおとろ(twitter https://twitter.com/unagiootoro8388)

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

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。

[更新履歴]
v1.1.0 メモ欄の記載内容を変更
v1.0.0 新規作成
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

    Game_Actor.prototype.updateEquipStates = function() {
        if (!this._equips) return;
        let equipStatesId = [];
        for (const equip of this._equips) {
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
}
