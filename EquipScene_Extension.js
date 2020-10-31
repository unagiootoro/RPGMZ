/*:
@target MZ
@plugindesc 装備シーン拡張 v1.3.0
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
@type string
@default [1, 2, 3, 4, 5]
@desc デフォルトの装備スロットです。スロット順に装備タイプIDを指定します。

@param WeaponTypes
@type string
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

@param NotMultiEquipWeapon
@type number[]
@default []
@desc 複数装備を禁止する武器タイプIDを指定します。

@param NotMultiEquipArmor
@type number[]
@default []
@desc 複数装備を禁止する防具タイプIDを指定します。

@param RemoveEquipText
@type string
@default 外す
@desc 武器を外すときの空枠に表示する文言を指定します。

@param RemoveEquipIconIndex
@type number
@default 0
@desc 武器を外すときの空枠に表示するアイコンを指定します。

@param DisableCommandWindow
@type boolean
@default false
@desc trueを設定すると最強装備等を表示するウィンドウを非表示にします。

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
(プラグインパラメータ「WeaponTypes」の設定例)
[1, 2]

次に武器に武器タイプを持たせます。
武器のメモ欄に
<WeaponType: 武器タイプID>
という形式で記載します。この設定を記載しなかった場合、武器タイプIDは1になります。
(武器タイプIDの設定例)
<WeaponType: 2>

■同じタイプの武器/防具の装備を禁止する
この機能は、二刀流のキャラは両手剣を複数装備できないようにしたい場合などに使用します。
プラグインパラメータ「NotMultiEquipWeapon」または「NotMultiEquipArmor」に
複数装備を禁止する武器/防具タイプIDを記載すると、
該当するタイプIDを持つ武器/防具は複数装備ができなくなります。

また次の設定を行うことで、武器/防具単位で装備共存禁止の設定を行うことができるようになります。
武器のメモ欄に
<NotMultiEquipWeaponIds: [武器ID1, 武器ID2, ...]>
または防具のメモ欄に
<NotMultiEquipArmorIds: [防具ID1, 防具ID2, ...]>
と記載することで装備共存禁止の設定ができるようになります。

例えば、武器ID1と武器ID2の共存禁止設定を行う場合、
武器ID1のメモ欄に
<NotMultiEquipWeaponIds: [2]>
武器ID2のメモ欄に
<NotMultiEquipWeaponIds: [1]>
と記載します。装備共存禁止の設定が片方だけにならないように注意してください。

■一つだけ装備可能な武器/防具を設定する
武器または防具のメモ欄に
<UniqueEquip>
と記載することで、一つだけ装備可能な武器/防具を設定することができます。

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
            if (typeof i !== "number") {
                if (typeof i === "string") {
                    slots[i] = parseInt(i);
                } else {
                    throw new Error();
                }
            }
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
const NotMultiEquipWeapon = parseNumberArray(params, "NotMultiEquipWeapon");
const NotMultiEquipArmor = parseNumberArray(params, "NotMultiEquipArmor");
const RemoveEquipText = params["RemoveEquipText"];
const RemoveEquipIconIndex = parseInt(params["RemoveEquipIconIndex"]);
const DisableCommandWindow = params["DisableCommandWindow"] === "true" ? true : false;

// Change equip layout.
Scene_Equip.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_EquipCommand(rect);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler("equip", this.commandEquip.bind(this));
    this._commandWindow.setHandler("optimize", this.commandOptimize.bind(this));
    this._commandWindow.setHandler("clear", this.commandClear.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this._commandWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._commandWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

const _Scene_Equip_createSlotWindow = Scene_Equip.prototype.createSlotWindow;
Scene_Equip.prototype.createSlotWindow = function() {
    _Scene_Equip_createSlotWindow.call(this);
    this._slotWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._slotWindow.setHandler("pageup", this.previousActor.bind(this));
    if (DisableCommandWindow) {
        this._slotWindow.setHandler("cancel", this.popScene.bind(this));
    }
};

const _Scene_Equip_start = Scene_Equip.prototype.start;
Scene_Equip.prototype.start = function() {
    _Scene_Equip_start.call(this);
    if (LayoutMode >= 1) this._itemWindow.show();
    if (DisableCommandWindow) {
        this._slotWindow.select(0);
        this._slotWindow.activate();
    } else {
        this._commandWindow.activate();
    }
};

const _Scene_Equip_update = Scene_Equip.prototype.update;
Scene_Equip.prototype.update = function() {
    _Scene_Equip_update.call(this);
    if (this._slotWindow.active || this._itemWindow.active) {
        this._itemWindow.setDrawState("draw");
    } else {
        this._itemWindow.setDrawState("undraw");
    }
};

const _Scene_Equip_createCommandWindow = Scene_Equip.prototype.createCommandWindow;
Scene_Equip.prototype.createCommandWindow = function() {
    if (!DisableCommandWindow) _Scene_Equip_createCommandWindow.call(this);
};

const _Scene_Equip_commandWindowRect = Scene_Equip.prototype.commandWindowRect;
Scene_Equip.prototype.commandWindowRect = function() {
    const rect = _Scene_Equip_commandWindowRect.call(this);
    if (DisableCommandWindow) {
        rect.height = 0;
    }
    return rect;
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

Scene_Equip.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    if (LayoutMode >= 1) {
        this._itemWindow.deselect();
        this._itemWindow.deactivate();
    } else {
        this.hideItemWindow();
    }
    if (DisableCommandWindow) {
        this._slotWindow.select(0);
        this._slotWindow.activate();
    } else {
        this._slotWindow.deselect();
        this._slotWindow.deactivate();
        this._commandWindow.activate();
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
        nameRect.width = this.width - ImageManager.faceWidth - this.padding * 2;
        this.drawActorName(this._actor, ImageManager.faceWidth, 0, nameRect.width);
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

const _Window_EquipItem_initialize = Window_EquipItem.prototype.initialize;
Window_EquipItem.prototype.initialize = function(rect) {
    _Window_EquipItem_initialize.call(this, rect);
    this._drawState = "undraw";
}

// drawState is "undraw" or "draw".
Window_EquipItem.prototype.setDrawState = function(drawState) {
    if (this._drawState !== drawState) {
        this._drawState = drawState;
        this.refresh();
    }
}

Window_EquipItem.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    } else {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        const removeEquip = { name: RemoveEquipText, iconIndex: RemoveEquipIconIndex };
        this.drawItemName(removeEquip, rect.x, rect.y, rect.width - numberWidth);
    }
};

const _Window_EquipItem_makeItemList = Window_EquipItem.prototype.makeItemList;
Window_EquipItem.prototype.makeItemList = function() {
    if (this._drawState === "draw") {
        _Window_EquipItem_makeItemList.call(this);
    } else {
        this._data = [];
    }
};

// Extend equip slots.
const _Scene_Boot_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.call(this);
    DataManager.setupWeaponTypes();
};

DataManager.setupWeaponTypes = function() {
    for (let i = 1; i < $dataWeapons.length; i++) {
        const weapon = $dataWeapons[i];
        if (weapon.meta.WeaponType) weapon.etypeId = parseInt(weapon.meta.WeaponType);
    }
};

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

Game_Actor.prototype.canMultiEquipWeaponByWeaponTypeId = function(weapon) {
    if (!NotMultiEquipWeapon.includes(weapon.wtypeId)) return true;
    const equipWeapon = this._equips.filter(equip => DataManager.isWeapon(equip.object()))
                                    .map(data => data.object());
    return equipWeapon.filter(weapon => NotMultiEquipWeapon.includes(weapon.wtypeId)).length === 0;
};

Game_Actor.prototype.canMultiEquipWeaponByItemId = function(weapon) {
    if (!weapon.meta.NotMultiEquipWeaponIds) return true;
    const notMultiEquipWeaponIds = JSON.parse(weapon.meta.NotMultiEquipWeaponIds);
    const equipWeapon = this._equips.filter(equip => DataManager.isWeapon(equip.object()))
                                    .map(data => data.object());
    return equipWeapon.filter(weapon => notMultiEquipWeaponIds.includes(weapon.id)).length === 0;
};

Game_Actor.prototype.canMultiEquipArmorByArmorTypeId = function(armor) {
    if (!NotMultiEquipArmor.includes(armor.atypeId)) return true;
    const equipArmor = this._equips.filter(equip => DataManager.isArmor(equip.object()))
                                   .map(data => data.object());
    return equipArmor.filter(armor => NotMultiEquipArmor.includes(armor.atypeId)).length === 0;
};

Game_Actor.prototype.canMultiEquipArmorByItemId = function(armor) {
    if (!armor.meta.NotMultiEquipArmorIds) return true;
    const notMultiEquipArmorIds = JSON.parse(armor.meta.NotMultiEquipArmorIds);
    const equipArmor = this._equips.filter(equip => DataManager.isArmor(equip.object()))
                                   .map(data => data.object());
    return equipArmor.filter(armor => notMultiEquipArmorIds.includes(armor.id)).length === 0;
};

Game_Actor.prototype.canEquipUniqueItem = function(item) {
    if (item.meta.UniqueEquip && this.isEquipped(item)) return false;
    return true;
};

Game_Actor.prototype.canMultiEquip = function(item) {
    if (!this.canEquipUniqueItem(item)) return false;
    if (DataManager.isWeapon(item)) {
        return this.canMultiEquipWeaponByWeaponTypeId(item) && this.canMultiEquipWeaponByItemId(item);
    } else {
        return this.canMultiEquipArmorByArmorTypeId(item) && this.canMultiEquipArmorByItemId(item);
    }
};

Game_Actor.prototype.bestEquipItem = function(slotId) {
    const etypeId = this.equipSlots()[slotId];
    const items = $gameParty
        .equipItems()
        .filter(item => item.etypeId === etypeId && this.canEquip(item) && this.canMultiEquip(item));
    let bestItem = null;
    let bestPerformance = -1000;
    for (let i = 0; i < items.length; i++) {
        const performance = this.calcEquipItemPerformance(items[i]);
        if (performance > bestPerformance) {
            bestPerformance = performance;
            bestItem = items[i];
        }
    }
    return bestItem;
};

Window_StatusBase.prototype.actorSlotName = function(actor, index) {
    const slots = actor.equipSlots();
    return $dataSystem.equipTypes[slots[index]];
};

// Prohibit the equipment of multiple same items.
const _Window_EquipItem_includes = Window_EquipItem.prototype.includes;
Window_EquipItem.prototype.includes = function(item) {
    const result = _Window_EquipItem_includes.call(this, item);
    if (!item) return result;
    if (!result) return false;
    return this._actor.canMultiEquip(item);
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
