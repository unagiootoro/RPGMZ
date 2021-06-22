/*:
@target MZ
@plugindesc Equipment scene expansion v1.4.1
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/EquipScene_Extension.js

@help
It is a plug-in that expands the equipment scene.
By installing this plug-in, you will be able to change the layout of the equipment screen and expand the equipment slot.

【Layout change】
By setting LayoutMode, you can change the layout so that equipment slots and equipment items are displayed at the same time.
If LayoutMode is set to 1, the status screen remains the same and equipment items are displayed in one line.
If LayoutMode is set to 2, the status screen will be reduced and equipment items will be displayed in 2 lines.


【Equipment slot expansion】
This function assigns an equipment type to each equipment slot.
By using this function, you will be able to equip multiple ornaments and multiple weapons of different systems.

■ Equipment slot settings
Set the equipment slot by setting the plug-in parameter "Default Equip Slots".

■ Setting equipment slots for individual characters
In the memo field of either actor / occupation / state
<EquipSlots: Equipment Slots>
By writing, you can set individual equipment slots for each character.
Set the equipment slot in the same format as the plug-in parameter "Default Equip Slots".
(Setting Example)
<EquipSlots: [1, 2, 3, 4, 5]>

■ Multiple types of weapons
You can set multiple weapon types with the plug-in parameter "Weapon Types".
This allows you to separate weapons by lineage, just as armor separates into body, head, and shield.
(Example of setting the plug-in parameter "Weapon Types")
[1, 2]

Next, give the weapon a weapon type.
In the memo field of the weapon
<WeaponType: Weapon Type ID>
It is described in the format. If you do not specify this setting, the weapon type ID will be 1.
(Weapon type ID setting example)
<WeaponType: 2>

■ Prohibit the equipment of the same type of weapon / armor
This function is used when you want to prevent dual wield characters from equipping multiple two-handed swords.
In the plugin parameter "NotMultiEquipWeapon" or "NotMultiEquipArmor"
If you list the weapon / armor type ID that prohibits multiple equipment,
Weapons / armor with the corresponding type ID cannot be equipped more than once.

Also, by making the following settings, you will be able to set equipment coexistence prohibition for each weapon / armor.
In the memo field of the weapon
<NotMultiEquipWeaponIds: [Weapon ID1, Weapon ID2, ...]>
Or in the memo field of the armor
<NotMultiEquipArmorIds: [Armor ID1, Armor ID2, ...]>
You can set the equipment coexistence prohibition by describing.

For example, when setting the coexistence prohibition of weapon ID1 and weapon ID2,
In the memo field of weapon ID1
<NotMultiEquipWeaponIds: [2]>
In the memo field of weapon ID2
<NotMultiEquipWeaponIds: [1]>
It is described as. Be careful not to set only one of the equipment coexistence prohibition settings.

■ Set only one weapon / armor that can be equipped
In the memo field of the weapon or armor
<UniqueEquip>
By writing, you can set only one weapon / armor that can be equipped.

■ Change of initial equipment
If you change the equipment slot from the default one, the contents of the initial equipment will not be reflected.
In that case, change the equipment by performing "Forced change" with the plug-in command "Change equipment slot".


【License】
This plugin is available under the terms of the MIT license.

@param LayoutMode
@type number
@default 2
@desc 0: Default 1: Show equipment slots and equipment items at the same time 2: Show equipment items in 2 lines

@param ActorFaceHeight
@type number
@default 43
Specifies the height of the actor's face graphic when @desc LayoutMode = 2.

@param DefaultEquipSlots
@type string
@default ["1","2","3","4","5"]
@desc This is the default equipment slot. Specify the equipment type ID in slot order.

@param WeaponTypes
@type string
@default ["1"]
@desc Specifies a list of weapon equipment type IDs.

@param DualWieldSlot
@type number
@default 1
@desc Specifies the index of the slot to be rewritten in the case of dual wield. (Example) Specify 1 to rewrite the second slot

@param WeaponTypeWhenDualWield
@type number
@default 1
@desc Specifies the equipment type ID to be rewritten during dual wield.

@param NotMultiEquipWeapon
@type number[]
@default []
@desc Specifies the weapon type ID that prohibits multiple equipment.

@param NotMultiEquipArmor
@type number[]
@default []
@desc Specifies the armor type ID that prohibits multiple equipment.

@param RemoveEquipText
@type string
@default remove
@desc Specifies the wording to be displayed in the empty frame when removing the weapon.

@param RemoveEquipIconIndex
@type number
@default 0
@desc Specifies the icon to display in the empty frame when removing the weapon.

@param DisableCommandWindow
@type boolean
@default false
When @desc true is set, the window that displays the strongest equipment etc. is hidden.


@command ChangeEquipSlot
@text Equipment slot change
@desc
Changes the equipment slot of the specified actor.

@arg ActorId
@text Actor ID
@type actor
@default 1
@desc
Specify the actor whose equipment slot is to be changed.

@arg SlotIndex
@text slot index
@type number
@default 0
@desc
Specifies the index of the equipment slot to change. (Sequential number from 0)

@arg WeaponId
@text Weapon ID
@type weapon
@default 0
@desc
Specify the weapon ID to change. If you want to change the armor, specify 0.

@arg ArmorId
@text Armor ID
@type armor
@default 0
@desc
Specify the armor ID to change. If you want to change the weapon, specify 0.

@arg ForceChange
@text forced change
@type boolean
@default false
@desc
If set to true, the equipment will be forcibly changed.
*/

/*:ja
@target MZ
@plugindesc 装備シーン拡張 v1.4.1
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/EquipScene_Extension.js

@help
装備シーンを拡張するプラグインです。
このプラグインを導入することで、装備画面のレイアウト変更と装備スロットの拡張ができるようになります。

【レイアウト変更】
LayoutModeを設定することで、装備スロットと装備アイテムを同時表示するようにレイアウトを変更します。
LayoutModeに1を設定した場合は、ステータス画面はそのままで、装備アイテムは1行で表示します。
LayoutModeに2を設定した場合は、ステータス画面を縮小し、装備アイテムを2行で表示します。


【装備スロット拡張】
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

■初期装備の変更
装備スロットをデフォルトのものから変更した場合、初期装備の内容が反映されなくなります。
その場合、プラグインコマンド「装備スロット変更」で「強制変更」を行うことで装備を変更してください。


【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@param LayoutMode
@type number
@default 2
@desc 0: デフォルト  1: 装備スロットと装備アイテムを同時表示  2: 装備アイテムを2行で表示

@param ActorFaceHeight
@type number
@default 43
@desc LayoutMode = 2のときのアクターの顔グラフィックの高さを指定します。

@param DefaultEquipSlots
@type number[]
@default ["1","2","3","4","5"]
@desc デフォルトの装備スロットです。スロット順に装備タイプIDを指定します。

@param WeaponTypes
@type number[]
@default ["1"]
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


@command ChangeEquipSlot
@text 装備スロット変更
@desc
指定したアクターの装備スロットを変更します。

@arg ActorId
@text アクターID
@type actor
@default 1
@desc
装備スロットを変更するアクターを指定します。

@arg SlotIndex
@text スロットインデックス
@type number
@default 0
@desc
変更する装備スロットのインデックスを指定します。(0からの連番)

@arg WeaponId
@text 武器ID
@type weapon
@default 0
@desc
変更する武器IDを指定します。防具を変更する場合、0を指定してください。

@arg ArmorId
@text 防具ID
@type armor
@default 0
@desc
変更する防具IDを指定します。武器を変更する場合、0を指定してください。

@arg ForceChange
@text 強制変更
@type boolean
@default false
@desc
trueを設定すると強制的に装備を変更します。
*/

const EquipScenePluginName = decodeURIComponent(document.currentScript.src).match(/^.*\/js\/plugins\/(.+).js$/)[1];

(() => {
"use strict";

class PluginParamsParser {
    static parse(params, typeData, predictEnable = true) {
        return new PluginParamsParser(predictEnable).parse(params, typeData);
    }

    constructor(predictEnable = true) {
        this._predictEnable = predictEnable;
    }

    parse(params, typeData, loopCount = 0) {
        if (++loopCount > 255) throw new Error("endless loop error");
        const result = {};
        for (const name in typeData) {
            result[name] = this.convertParam(params[name], typeData[name], loopCount);
        }
        if (!this._predictEnable) return result;
        if (typeof params === "object" && !(params instanceof Array)) {
            for (const name in params) {
                if (result[name]) continue;
                const param = params[name];
                const type = this.predict(param);
                result[name] = this.convertParam(param, type, loopCount);
            }
        }
        return result;
    }

    convertParam(param, type, loopCount) {
        if (typeof type === "string") {
            return this.cast(param, type);
        } else if (typeof type === "object" && type instanceof Array) {
            const aryParam = JSON.parse(param);
            if (typeof type[0] === "string") {
                return aryParam.map(strParam => this.cast(strParam, type[0]));
            } else {
                return aryParam.map(strParam => this.parse(JSON.parse(strParam), type[0]), loopCount);
            }
        } else if (typeof type === "object") {
            return this.parse(JSON.parse(param), type, loopCount);
        } else {
            throw new Error(`${type} is not string or object`);
        }
    }

    cast(param, type) {
        switch(type) {
        case "any":
            if (!this._predictEnable) throw new Error("Predict mode is disable");
            return this.cast(param, this.predict(param));
        case "string":
            return param;
        case "number":
            if (param.match(/\d+\.\d+/)) return parseFloat(param);
            return parseInt(param);
        case "boolean":
            return param === "true";
        default:
            throw new Error(`Unknow type: ${type}`);
        }
    }

    predict(param) {
        if (param.match(/^\d+$/) || param.match(/^\d+\.\d+$/)) {
            return "number";
        } else if (param === "true" || param === "false") {
            return "boolean";
        } else {
            return "string";
        }
    }
}

const typeData = {
    DefaultEquipSlots: ["any"],
    WeaponTypes: ["any"],
    NotMultiEquipWeapon: ["any"],
    NotMultiEquipArmor: ["any"],
};
const PP = PluginParamsParser.parse(PluginManager.parameters(EquipScenePluginName), typeData);

const LayoutMode = PP.LayoutMode;
const ActorFaceHeight = PP.ActorFaceHeight;
const DualWieldSlot = PP.DualWieldSlot;
const DefaultEquipSlots = PP.DefaultEquipSlots;
const WeaponTypes = PP.WeaponTypes;
const WeaponTypeWhenDualWield = PP.WeaponTypeWhenDualWield;
const NotMultiEquipWeapon = PP.NotMultiEquipWeapon;
const NotMultiEquipArmor = PP.NotMultiEquipArmor;
const RemoveEquipText = PP.RemoveEquipText;
const RemoveEquipIconIndex = PP.RemoveEquipIconIndex;
const DisableCommandWindow = PP.DisableCommandWindow;

// Register plugin commands.
PluginManager.registerCommand(EquipScenePluginName, "ChangeEquipSlot", function(args) {
    const params = PluginParamsParser.parse(args, {});
    const actorId = params.ActorId;
    const slotIndex = params.SlotIndex
    const weaponId = params.WeaponId;
    const armorId = params.ArmorId;
    const forceChange = params.ForceChange;
    const actor = $gameActors.actor(actorId);
    let item = null;
    if (weaponId > 0) {
        item = $dataWeapons[weaponId];
    } else if (armorId > 0) {
        item = $dataArmors[armorId];
    }
    if (!item) return;
    if (forceChange) {
        actor.forceChangeEquip(slotIndex, item);
    } else {
        actor.changeEquip(slotIndex, item);
    }
});


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
