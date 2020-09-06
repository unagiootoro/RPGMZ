/*:
@target MZ
@plugindesc 装備シーン拡張 v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/EquipScene_Extension.js

@param LayoutMode
@type number
@default 2
@desc 0: デフォルト  1: 装備スロットと装備アイテムを同時表示  2: 装備アイテムを2行で表示

@param ActorFaceHeight
@type number
@default 43
@desc LayoutMode = 2のときのアクターの顔グラフィックの高さを指定します。

@param DefaultEquipSlots
@default [1, 2, 3, 4, 5]
@desc デフォルトの装備スロットです。スロット順に装備タイプIDを指定します。

@param WeaponTypes
@type number
@default [1]
@desc 武器の装備タイプIDの一覧を指定します。

@param DualWieldSlot
@type number
@default 1
@desc 二刀流の場合に書き換えるスロットのインデックスを指定します。(例)2番目のスロットを書き換える場合は1を指定

@param WeaponTypeWhenDualWield
@type number
@default 1
@desc 二刀流時に書き換える装備タイプIDを指定します。

@help
装備シーンを拡張するプラグインです。
このプラグインを導入することで、装備画面のレイアウト変更と装備スロットの拡張ができるようになります。

[レイアウト変更]
LayoutModeを設定することで、装備スロットと装備アイテムを同時表示するようにレイアウトを変更します。
LayoutModeに1を設定した場合は、ステータス画面はそのままで、装備アイテムは1行で表示します。
LayoutModeに2を設定した場合は、ステータス画面を縮小し、装備アイテムを2行で表示します。

[装備スロット拡張]
装備スロットごとに装備タイプを割り当てる機能です。
この機能を使用することで、装飾品を複数装備したり、系統の異なる武器を複数装備したりすることができるようになります。

■装備スロットの設定
プラグインパラメータ「DefaultEquipSlots」を設定することで、装備スロットを設定します。

■キャラ個別の装備スロットの設定
アクター/職業/ステートのいずれかのメモ欄に
<EquipSlots: 装備スロット>
と記載することで、キャラごとに個別の装備スロットを設定することができます。
装備スロットにはプラグインパラメータ「DefaultEquipSlots」と同じ形式で設定します。
(設定例)
<EquipSlots: [1, 2, 3, 4, 5]>

■複数系統の武器
プラグインパラメータ「WeaponTypes」で武器系統を複数設定することができます。
これによって、防具が身体、頭、盾と分かれているのと同じように武器も系統ごとに分けることができるようになります。
(設定例)
[1, 2]

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const EquipScenePluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];

(() => {
"use strict";

const parseNumberArray = (params, paramName) => {
    const errorMessage = `プラグインパラメータ「${paramName}」の読み込みに失敗しました。`
    try {
        const param = params[paramName]
        const slots = eval(param);
        for (const i of slots) {
            if (typeof i !== "number") throw new Error();
        }
        return slots;
    } catch(e) {
        console.log(`ERROR: ${e}`);
        throw new Error(errorMessage);
    }
};

const params = PluginManager.parameters(EquipScenePluginName);
const LayoutMode = parseInt(params["LayoutMode"]);
const ActorFaceHeight = parseInt(params["ActorFaceHeight"]);
const DualWieldSlot = parseInt(params["DualWieldSlot"]);
const DefaultEquipSlots = parseNumberArray(params, "DefaultEquipSlots");
const WeaponTypes = parseNumberArray(params, "WeaponTypes");
const WeaponTypeWhenDualWield = parseInt(params["WeaponTypeWhenDualWield"]);


// Change equip layout.
const _Scene_Equip_start = Scene_Equip.prototype.start;
Scene_Equip.prototype.start = function() {
    _Scene_Equip_start.call(this);
    if (LayoutMode >= 1) this._itemWindow.show();
};

Scene_Equip.prototype.slotWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const wx = this.statusWidth();
    const wy = commandWindowRect.y + commandWindowRect.height;
    const ww = Graphics.boxWidth - this.statusWidth();
    let wh = this.mainAreaHeight() - commandWindowRect.height;
    if (LayoutMode >= 1) wh = 244;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.itemWindowRect = function() {
    const slotWindowRect = this.slotWindowRect();
    if (LayoutMode === 1) {
        const wx = slotWindowRect.x;
        const wy = slotWindowRect.y + slotWindowRect.height;
        const ww = slotWindowRect.width;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    } else if (LayoutMode === 2) {
        const wx = 0;
        const wy = slotWindowRect.y + slotWindowRect.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    } else {
        return slotWindowRect;
    }
};

Scene_Equip.prototype.statusWindowRect = function() {
    const itemWindowRect = this.itemWindowRect();
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = this.statusWidth();
    let wh;
    if (LayoutMode === 2) {
        wh = this.mainAreaHeight() - itemWindowRect.height;
    } else {
        wh = this.mainAreaHeight();
    }
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.onSlotOk = function() {
    if (LayoutMode >= 1) {
        this._slotWindow.deactivate();
    } else {
        this._slotWindow.hide();
        this._itemWindow.show();
    }
    this._itemWindow.activate();
    this._itemWindow.select(0);
};

Scene_Equip.prototype.onSlotCancel = function() {
    this._slotWindow.deselect();
    this._commandWindow.activate();
};

Scene_Equip.prototype.onItemOk = function() {
    SoundManager.playEquip();
    this.executeEquipChange();
    if (LayoutMode >= 1) {
        this._itemWindow.deactivate();
        this._itemWindow.deselect();
        this._slotWindow.activate();
    } else {
        this.hideItemWindow();
    }
    this._slotWindow.refresh();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
};

Scene_Equip.prototype.onItemCancel = function() {
    if (LayoutMode >= 1) {
        this._itemWindow.deactivate();
        this._itemWindow.deselect();
        this._slotWindow.activate();
    } else {
        this.hideItemWindow();
    }
};


Window_EquipItem.prototype.maxCols = function() {
    if (LayoutMode === 2) return 2;
    return 1;
};

Window_EquipStatus.prototype.drawActorName = function(actor, x, y, width) {
    if (LayoutMode <= 1) return Window_StatusBase.prototype.drawActorName.call(this, ...arguments);
    width = width || 168;
    this.changeTextColor(ColorManager.hpColor(actor));
    this.drawText(actor.name(), x, y, width, "right");
};

Window_EquipStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        const nameRect = this.itemLineRect(0);
        this.drawActorName(this._actor, nameRect.x, 0, nameRect.width);
        let faceHeight = ImageManager.faceHeight;
        if (LayoutMode === 2) faceHeight = ActorFaceHeight;
        let faceY = nameRect.height;
        if (LayoutMode === 2) faceY = nameRect.y;
        this.drawActorFace(this._actor, nameRect.x, faceY, ImageManager.faceWidth, faceHeight);
        this.drawAllParams();
    }
};

Window_EquipStatus.prototype.paramY = function(index) {
    if (LayoutMode === 2) {
        return Math.floor(this.lineHeight() * (index + 2));
    } else {
        const faceHeight = ImageManager.faceHeight;
        return faceHeight + Math.floor(this.lineHeight() * (index + 1.5));
    }
};

Scene_Equip.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    if (LayoutMode >= 1) {
        this._itemWindow.deselect();
        this._itemWindow.deactivate();
    } else {
        this.hideItemWindow();
    }
    this._slotWindow.deselect();
    this._slotWindow.deactivate();
    this._commandWindow.activate();
};


// Extend equip slots.
Game_Actor.prototype.baseEquipSlots = function() {
    if (this.actor().meta.EquipSlots) {
        return JSON.parse(this.actor().meta.EquipSlots);
    } else if (this.currentClass().meta.EquipSlots) {
        return JSON.parse(this.currentClass().meta.EquipSlots);
    } else if (this.states().some(state => state.meta.EquipSlots)) {
        const state = this.states().find(state => state.meta.EquipSlots);
        return JSON.parse(state.meta.EquipSlots);
    } else {
        return DefaultEquipSlots.concat();
    }
};

Game_Actor.prototype.equipSlots = function() {
    const slots = this.baseEquipSlots();
    if (slots.length >= 2 && this.isDualWield()) {
        slots[DualWieldSlot] = WeaponTypeWhenDualWield;
    }
    return slots;
};

Window_StatusBase.prototype.actorSlotName = function(actor, index) {
    const slots = actor.equipSlots();
    return $dataSystem.equipTypes[slots[index]];
};


// Setting weapon type.
Game_Actor.prototype.isWeaponType = function(equipType) {
    return WeaponTypes.includes(equipType);
};

Game_Actor.prototype.initEquips = function(equips) {
    const slots = this.equipSlots();
    const maxSlots = slots.length;
    this._equips = [];
    for (let i = 0; i < maxSlots; i++) {
        this._equips[i] = new Game_Item();
    }
    for (let j = 0; j < equips.length; j++) {
        if (j < maxSlots) {
            this._equips[j].setEquip(this.isWeaponType(slots[j]), equips[j]);
        }
    }
    this.releaseUnequippableItems(true);
    this.refresh();
};

Game_Actor.prototype.changeEquipById = function(etypeId, itemId) {
    const slotId = etypeId - 1;
    if (this.isWeaponType(this.equipSlots()[slotId])) {
        this.changeEquip(slotId, $dataWeapons[itemId]);
    } else {
        this.changeEquip(slotId, $dataArmors[itemId]);
    }
};

})();
