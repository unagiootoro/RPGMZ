/*:
@target MV MZ
@plugindesc item composition plugin v2.1.0
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/AlchemySystem.js

@param EnabledMenuAlchemy
@text Enable composite menu
@type boolean
@default true
@desc
If set to true, add composite commands to the menu.

@param EnabledAlchemySwitchId
@text Enabled switch ID for composite menu.
@type switch
@default 0
@desc
Specifies the ID of the switch to enable/disable compositing of the menu. 0 means that the compositing command is always enabled.

@param EnabledCategoryWindow
@text Enabled to display category window.
@type boolean
@default true
@desc
If set to true, category window will be displayed.

@param EnabledGoldWindow
@text Enabled Gold Window display.
@type boolean
@default true
@desc
If set to true, the current gold and gold required for item synthesis will be displayed on the synthesis screen.

@param DisplayItemCategory
@text Item field display enabled
@type boolean
@default false
@desc
If true is set, the item field will be displayed on the category selection screen during compositing.

@param DisplayWeaponCategory
@text Weapon column display enabled
@type boolean
@default false
@desc
If set to true, the weapon column will be displayed on the category selection screen during composition.

@param DisplayArmorCategory
@text Armor column display enabled
@type boolean
@default false
@desc
If set to true, the armor column will be displayed on the category selection screen during compositing.

@param DisplayKeyItemCategory
@text Enable to display key item category.
@type boolean
@default false
@desc
If set to "true", display the important items column in the category selection screen when composing.

@param EnableIncludeEquipItem
@text Include equipment items in synthetic materials.
@type boolean
@default false
@desc
If set to true, equip items can be used as materials for compositing.

@param MaxNumMakeItem
@text Maximum number of items that can be created.
@type number
@default 999
@desc
Specifies the maximum number of items that can be synthesized at one time.

@param MaxMaterials
@text Maximum number of materials.
@type number
@default 3
@desc
Specifies the maximum number of material types to be used for compositing.

@param MakeItemSeFileName
@text Item synthesis SE file name.
@type file
@dir audio/se
@default Heal5
@desc
Specify the file name of the SE to be played when the item is synthesized.

@param MakeItemSeVolume
@text Item synthesis SE volume
@type number
@default 90
@desc
Specifies the SE volume to be played when the item is synthesized.

@param MakeItemSePitch
@text Item synthesis SE pitch.
@type number
@default 100
@desc
Specifies the pitch of the SE to be played when the item is synthesized.

@param MakeItemSePan
@text Make item composite SE pan.
@type number
@default 0
@desc
Specifies the pan of the SE to be played when the item is synthesized.

@param MenuAlchemyText
@text Composite menu text.
@type string
@default composite
@desc
Specify the composite text to be displayed in the menu.

@param NeedMaterialText
@text Required material text.
@type string
@default NeedMaterialText
@desc
Specify the text to be used when displaying the required material.

@param NeedPriceText
@text Required expense text.
@type string
@default NeedPriceText
@desc
Specify the text to be used when displaying the required expense.

@param TargetItemText
@text Generated item text.
@type string
@default Generated Item: @desc
@desc
Specifies the text to display when the generated item is displayed.

@param NoteParseErrorMessage
@text Note parse error message.
@type string
@default Failed to parse the note field. Contents of the relevant section:(%1)
@desc
Error message when parsing the memo field failed. There is no need to change this parameter.


@command StartAlchemyScene
@text Start synthesis scene.
@desc Start the synthesis scene.

@help
This plugin introduces a simple item synthesis function.

[How to use]
Items can be synthesized by obtaining a recipe.
If you have a recipe as a normal item, you will be able to synthesize the item registered in the recipe.

Creating a Recipe
In the memo field of the recipe item, enter the contents of the recipe in the following format.
<recipe>
"material": [material item information 1, material item information 2, ...].
"price": Required cost for synthesis
"target": Synthesis result item information
</recipe>

Material item information... This is the information of the material item.
                  It can be specified in the following format. ["identifier", ID, quantity].
                  Identifier... Identifier that indicates whether the item is a normal item, a weapon, or an armor.
                           It can be one of "item", "weapon", or "armor".
                  ID... Specify the ID of the item, weapon, or armor.
                  Qty... Specify the number of items required as materials.

Synthesis Cost... Specify the cost for synthesis.
                This item can be omitted. If you omit it, the cost will be 0 gold.

Synthesis result item information... Information about the item created as a result of the synthesis.
                     Specify in the following format. ["Identifier", ID].
                     Identifier... Identifier that indicates whether the item is a normal item, a weapon, or an armor.
                              It can be one of "item", "weapon", or "armor".
                     ID... Specify the ID of the item/weapon/armor.

For example, if you want to create a full potion (ID: 9) by combining a high potion (ID: 8) and two magic waters (ID: 10)
It should look like this Be careful of the comma at the end.
<recipe>
"material": [["item", 8, 1], ["item", 10, 2]],
"target": ["item", 9].
</recipe>

In addition to the above settings, if you want to set 100G as the required cost for the synthesis, you can write the following
<recipe>
"material": [["item", 8, 1], ["item", 10, 2]],
"price": 100,
"target": ["item", 9]]
</recipe>

It is also possible to target multiple items with one recipe.
Enter multiple <recipe> ～ </recipe> in the memo field as shown in the example below.
<recipe>
"material": [Material item information 1, Material item information 2, ...]
"price": Required cost of synthesis
"target": Synthesis result item information
</recipe>
<recipe>
"material": [Material item information 1, Material item information 2, ...]
"price": Required cost of synthesis
"target": Synthesis result item information
</recipe>

Start the composite scene
Execute the plugin command "StartAlchemyScene" to start the synthesis scene.
In the case of RPG Maker MV, enter the following command
AlchemySystem StartAlchemyScene

[License]
This plugin is available under the terms of the MIT license.
*/

/*:ja
@target MV MZ
@plugindesc アイテム合成プラグイン v2.1.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/AlchemySystem.js

@param RecipeInfos
@text レシピ情報
@type struct<RecipeInfo>[]
@desc
レシピ情報を指定します。

@param EnabledMenuAlchemy
@text 合成メニュー有効化
@type boolean
@default true
@desc
trueを設定すると、メニューに合成コマンドを追加します。

@param EnabledAlchemySwitchId
@text 合成メニュー有効化スイッチID
@type switch
@default 0
@desc
メニューの合成の有効/無効を切り替えるスイッチのIDを指定します。0を指定すると、常に合成コマンドは有効になります。

@param EnabledCategoryWindow
@text カテゴリウィンドウ表示有効化
@type boolean
@default true
@desc
trueを設定すると、カテゴリウィンドウを表示します。

@param EnabledGoldWindow
@text ゴールドウィンドウ表示有効化
@type boolean
@default true
@desc
trueを設定すると、合成画面に現在の所持ゴールドとアイテム合成に必要なゴールドを表示します。

@param DisplayItemCategory
@text アイテム欄表示有効化
@type boolean
@default true
@desc
trueを設定すると、合成時のカテゴリ選択画面でアイテム欄を表示します。

@param DisplayWeaponCategory
@text 武器欄表示有効化
@type boolean
@default true
@desc
trueを設定すると、合成時のカテゴリ選択画面で武器欄を表示します。

@param DisplayArmorCategory
@text 防具欄表示有効化
@type boolean
@default true
@desc
trueを設定すると、合成時のカテゴリ選択画面で防具欄を表示します。

@param DisplayKeyItemCategory
@text 大事なもの欄表示有効化
@type boolean
@default false
@desc
trueを設定すると、合成時のカテゴリ選択画面で大事なもの欄を表示します。

@param EnableIncludeEquipItem
@text 装備アイテムを合成素材に含む
@type boolean
@default false
@desc
trueを設定すると、装備アイテムを合成の素材に使えるようになります。

@param MaxNumMakeItem
@text 最大生成可能アイテム数
@type number
@default 999
@desc
一度に合成可能なアイテム数の最大値を指定します。

@param MaxMaterials
@text 素材最大数
@type number
@default 3
@desc
合成に使用する素材の種類の最大値を指定します。

@param MakeItemSeFileName
@text アイテム合成SEファイル名
@type file
@dir audio/se
@default Heal5
@desc
アイテムを合成したときに再生するSEのファイル名を指定します。

@param MakeItemSeVolume
@text アイテム合成SEボリューム
@type number
@default 90
@desc
アイテムを合成したときに再生するSEのvolumeを指定します。

@param MakeItemSePitch
@text アイテム合成SEピッチ
@type number
@default 100
@desc
アイテムを合成したときに再生するSEのpitchを指定します。

@param MakeItemSePan
@text アイテム合成SEパン
@type number
@default 0
@desc
アイテムを合成したときに再生するSEのpanを指定します。

@param MenuAlchemyText
@text 合成メニューテキスト
@type string
@default 合成
@desc
メニューに表示する合成の文言を指定します。

@param NeedMaterialText
@text 必要素材テキスト
@type string
@default 必要素材：
@desc
必要素材を表示する際の文言を指定します。

@param NeedPriceText
@text 必要経費テキスト
@type string
@default 必要経費：
@desc
必要経費を表示する際の文言を指定します。

@param TargetItemText
@text 生成アイテムテキスト
@type string
@default 生成アイテム：
@desc
生成アイテムを表示する際の文言を指定します。

@param NoteParseErrorMessage
@text メモ欄解析エラーメッセージ
@type string
@default メモ欄の解析に失敗しました。該当箇所の内容:(%1)
@desc
メモ欄の解析に失敗した場合のエラーメッセージです。このパラメータを変更する必要はありません。


@command StartAlchemyScene
@text 合成シーン開始
@desc 合成シーンを開始します。

@help
シンプルなアイテム合成機能を導入するプラグインです。

【使用方法】
アイテムの合成はレシピを入手することによって可能となります。
レシピは通常のアイテムとして持たせることによって、レシピに登録されたアイテムが合成できるようになります。

■ レシピの作成
レシピアイテムとレシピの情報の組み合わせをプラグインパラメータ「レシピ情報」で指定します。
レシピアイテムにアイテムとして持たせるアイテムIDを指定し、それに紐づくレシピをレシピ一覧に登録します。
レシピ一覧には複数のレシピを登録することができ、一つのレシピで複数の合成レシピを習得させることが可能です。

■ アイテム情報について
レシピではアイテム情報としてアイテムタイプ、アイテムID、武器ID、防具IDを指定する項目があります。
これはアイテムタイプとそれに紐づくアイテム/武器/防具のいずれかのIDを指定する必要があります。
それ以外のIDは指定せずに0のままにしても問題ありません。

■ 合成シーンの開始
プラグインコマンドで「StartAlchemyScene」を実行すると、合成シーンを開始します。
ツクールMVの場合、次のコマンドを入力してください。
AlchemySystem StartAlchemyScene

■ 旧バージョンとの互換性
旧バージョンはアイテムのメモ欄でレシピを指定していましたが、
この方法はプラグインパラメータでのレシピの設定と併用可能です。

===================== 以下の情報は旧バージョンでのレシピ指定方法です =====================
■ レシピの作成
レシピアイテムのメモ欄に以下の形式でレシピの内容を記載します。
<recipe>
"material": [素材アイテム情報1, 素材アイテム情報2, ...]
"price": 合成の必要経費
"target": 合成結果アイテム情報
</recipe>

素材アイテム情報...素材となるアイテムの情報です。
                  次の形式で指定します。 ["識別子", ID, 個数]
                  識別子...アイテムが通常アイテム/武器/防具のどれに該当するのかを表す識別子です。
                           "item", "weapon", "armor"のいずれかを指定します。
                  ID...通常アイテム/武器/防具のIDを指定します。
                  個数...素材として必要なアイテムの個数を指定します。

合成の必要経費...合成にかかる費用を設定します。
                この項目は省略可能です。省略した場合は0ゴールドになります。

合成結果アイテム情報...合成した結果として作成されるアイテムの情報です。
                     次の形式で指定します。 ["識別子", ID]
                     識別子...アイテムが通常アイテム/武器/防具のどれに該当するのかを表す識別子です。
                              "item", "weapon", "armor"のいずれかを指定します。
                     ID...通常アイテム/武器/防具のIDを指定します。

例えば、ハイポーション(ID: 8)1つとマジックウォーター(ID: 10)2つを合成してフルポーション(ID: 9)を作成する場合、
次のように記載します。末尾のカンマに気を付けてください。
<recipe>
"material": [["item", 8, 1], ["item", 10, 2]],
"target": ["item", 9]
</recipe>

上記の設定に加えて、合成の必要経費に100Gを設定する場合、次のように記載します。
<recipe>
"material": [["item", 8, 1], ["item", 10, 2]],
"price": 100,
"target": ["item", 9]
</recipe>

1つのレシピで複数のアイテムを対象にすることも可能です。
下記の例のようにメモ欄に複数の<recipe>～</recipe>を記載してください。
<recipe>
"material": [素材アイテム情報1, 素材アイテム情報2, ...]
"price": 合成の必要経費
"target": 合成結果アイテム情報
</recipe>
<recipe>
"material": [素材アイテム情報1, 素材アイテム情報2, ...]
"price": 合成の必要経費
"target": 合成結果アイテム情報
</recipe>


【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

/*~struct~RecipeInfo:ja
@param RecipeItem
@text レシピアイテム
@type item
@desc
レシピとなるアイテムIDを指定します。

@param Recipe
@text レシピ一覧
@type struct<Recipe>[]
@desc
レシピアイテムに登録するアイテムを指定します。

@param Memo
@text メモ
@type multiline_string
@desc
汎用的なメモ欄です。プラグイン内部では使用しません。
*/

/*~struct~Recipe:ja
@param Materials
@text 素材一覧
@type struct<Material>[]
@desc
素材となるアイテムを指定します。

@param Price
@text 必要経費
@type number
@default 0
@desc
合成の必要経費を指定します。

@param TargetItemInfo
@text 生成アイテム情報
@type struct<ItemInfo>
@desc
生成されるアイテムの情報を指定します。
*/

/*~struct~Material:ja
@param ItemInfo
@text アイテム情報
@type struct<ItemInfo>
@desc
アイテム情報を指定します。

@param NeedItems
@text 必要アイテム数
@type number
@default 1
@desc
素材として必要なアイテムの数を指定します。
*/

/*~struct~ItemInfo:ja
@param Type
@text アイテムタイプ
@type select
@option アイテム
@value Item
@option 武器
@value Weapon
@option 防具
@value Armor
@default Item
@desc
IDがアイテム/武器/防具のどれを使用するかを指定します。

@param ItemId
@text アイテムID
@type item
@default 0
@desc
アイテムのIDを指定します。Typeがアイテムでない場合は0を指定してください。

@param WeaponId
@text 武器ID
@type weapon
@default 0
@desc
武器のIDを指定します。Typeが武器でない場合は0を指定してください。

@param ArmorId
@text 防具ID
@type armor
@default 0
@desc
防具のIDを指定します。Typeが防具でない場合は0を指定してください。
*/

const AlchemySystemPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

const AlchemyClassAlias = (() => {
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
            if (params[name] === "" || params[name] === undefined) {
                result[name] = null;
            } else {
                result[name] = this.convertParam(params[name], typeData[name], loopCount);
            }
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
            if (type[0] === "string") {
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
            if (param.match(/^\-?\d+\.\d+$/)) return parseFloat(param);
            return parseInt(param);
        case "boolean":
            return param === "true";
        default:
            throw new Error(`Unknow type: ${type}`);
        }
    }

    predict(param) {
        if (param.match(/^\-?\d+$/) || param.match(/^\-?\d+\.\d+$/)) {
            return "number";
        } else if (param === "true" || param === "false") {
            return "boolean";
        } else {
            return "string";
        }
    }
}


const typeDefine = {
    RecipeInfos: [{
        Recipe: [{
            Materials: [{
                ItemInfo: {}
            }],
            TargetItemInfo: {}
        }]
    }]
};

const PP = PluginParamsParser.parse(PluginManager.parameters(AlchemySystemPluginName), typeDefine);

const EnabledMenuAlchemy = PP.EnabledMenuAlchemy;
const EnabledAlchemySwitchId = PP.EnabledAlchemySwitchId;
const EnabledCategoryWindow = PP.EnabledCategoryWindow;
const EnabledGoldWindow = PP.EnabledGoldWindow;
const DisplayItemCategory = PP.DisplayItemCategory == null ? true : PP.DisplayItemCategory;
const DisplayWeaponCategory = PP.DisplayWeaponCategory == null ? true : PP.DisplayWeaponCategory;
const DisplayArmorCategory = PP.DisplayArmorCategory == null ? true : PP.DisplayArmorCategory;
const DisplayKeyItemCategory = PP.DisplayKeyItemCategory;
const EnableIncludeEquipItem = PP.EnableIncludeEquipItem;

const MaxNumMakeItem = PP.MaxNumMakeItem;
const MaxMaterials = PP.MaxMaterials;

const MakeItemSeFileName = PP.MakeItemSeFileName;
const MakeItemSeVolume = PP.MakeItemSeVolume;
const MakeItemSePitch = PP.MakeItemSePitch;
const MakeItemSePan = PP.MakeItemSePan;

const MenuAlchemyText = PP.MenuAlchemyText;
const NeedMaterialText = PP.NeedMaterialText;
const NeedPriceText = PP.NeedPriceText;
const TargetItemText = PP.TargetItemText;
const NoteParseErrorMessage = PP.NoteParseErrorMessage;


// MV compatible
if (Utils.RPGMAKER_NAME === "MV") {
    Window_Base.prototype.drawRect = function(x, y, width, height) {
        const outlineColor = this.contents.outlineColor;
        const mainColor = this.contents.textColor;
        this.contents.fillRect(x, y, width, height, outlineColor);
        this.contents.fillRect(x + 1, y + 1, width - 2, height - 2, mainColor);
    };

    Window_Base.prototype.itemPadding = function() {
        return 8;
    };

    Window_Selectable.prototype.itemRectWithPadding = function(index) {
        const rect = this.itemRect(index);
        const padding = this.itemPadding();
        rect.x += padding;
        rect.width -= padding * 2;
        return rect;
    };

    Window_Selectable.prototype.itemLineRect = function(index) {
        const rect = this.itemRectWithPadding(index);
        const padding = (rect.height - this.lineHeight()) / 2;
        rect.y += padding;
        rect.height -= padding * 2;
        return rect;
    };

    Object.defineProperty(Window.prototype, "innerWidth", {
        get: function() {
            return Math.max(0, this._width - this._padding * 2);
        },
        configurable: true
    });

    Object.defineProperty(Window.prototype, "innerHeight", {
        get: function() {
            return Math.max(0, this._height - this._padding * 2);
        },
        configurable: true
    });

    Scene_Base.prototype.calcWindowHeight = function(numLines, selectable) {
        if (selectable) {
            return Window_Selectable.prototype.fittingHeight(numLines);
        } else {
            return Window_Base.prototype.fittingHeight(numLines);
        }
    };

    Scene_Base.prototype.mainCommandWidth = function() {
        return 240;
    };

    Scene_MenuBase.prototype.mainAreaTop = function() {
        return this.helpAreaHeight();;
    };

    Scene_MenuBase.prototype.mainAreaBottom = function() {
        return this.mainAreaTop() + this.mainAreaHeight();
    };

    Scene_MenuBase.prototype.mainAreaHeight = function() {
        return Graphics.boxHeight - this.helpAreaHeight();
    };

    Scene_MenuBase.prototype.helpAreaHeight = function() {
        return this.calcWindowHeight(2, false);
    };
}


let $recipes = null;

class PartyItemUtils {
    static partyItemCount(itemInfo) {
        let count = this._partyItemCountWithoutEquips(itemInfo);
        if (EnableIncludeEquipItem) {
            if (itemInfo.type === "weapon") {
                count += this._allPartyEquipWeapons().filter(item => item && item.id === itemInfo.id).length;
            } else if (itemInfo.type === "armor") {
                count += this._allPartyEquipArmors().filter(item => item && item.id === itemInfo.id).length;
            }
        }
        return count;
    }

    static _partyItemCountWithoutEquips(itemInfo) {
        return $gameParty.numItems(itemInfo.itemData());
    }

    static _allPartyEquipWeapons() {
        const equipSlotItems = $gameParty.members().flatMap(actor => actor._equips);
        const weaponItems = equipSlotItems.filter(item => item.isWeapon() && item.itemId() > 0);
        return weaponItems.map(item => item.object());
    }

    static _allPartyEquipArmors() {
        const equipSlotItems = $gameParty.members().flatMap(actor => actor._equips);
        const armorItems = equipSlotItems.filter(item => item.isArmor() && item.itemId() > 0);
        return armorItems.map(item => item.object());
    }

    static gainPartyItem(itemInfo, gainCount) {
        const itemData = itemInfo.itemData();
        if (gainCount > 0) {
            $gameParty.gainItem(itemData, gainCount);
        } else if (gainCount < 0) {
            if (EnableIncludeEquipItem && itemInfo.type !== "item") {
                const purgeCount = -gainCount;
                const partyItemCount = this.partyItemCount(itemInfo);
                if (purgeCount > partyItemCount) {
                    throw new Error(`purgeCount(${purgeCount}) is over all has item count(${partyItemCount})`);
                }
                const partyItemCountWithoutEquips = this._partyItemCountWithoutEquips(itemInfo);
                if (partyItemCountWithoutEquips >= purgeCount) {
                    $gameParty.gainItem(itemData, gainCount);
                } else {
                    if (partyItemCountWithoutEquips > 0) $gameParty.gainItem(itemData, -partyItemCountWithoutEquips);
                    this._purgePartyEquipItem(itemInfo, purgeCount - partyItemCountWithoutEquips);
                }
            } else {
                $gameParty.gainItem(itemData, gainCount);
            }
        }
    }

    static _purgePartyEquipItem(itemInfo, purgeCount) {
        if (purgeCount <= 0) return;
        for (const actor of $gameParty.members()) {
            for (let i = 0; i < actor._equips.length; i++) {
                let purgeFlag = false;
                if (itemInfo.type === "weapon") {
                    if (actor._equips[i].isWeapon() && itemInfo.id === actor._equips[i].itemId()) purgeFlag = true;
                } else if (itemInfo.type === "armor") {
                    if (actor._equips[i].isArmor() && itemInfo.id === actor._equips[i].itemId()) purgeFlag = true;
                }
                if (purgeFlag) {
                    actor._equips[i].setEquip("", 0);
                    purgeCount--;
                    if (purgeCount <= 0) return;
                }
            }
        }
    }
}

class ItemInfo {
    constructor(type, id) {
        this._type = type;
        this._id = id;
    }

    get type() { return this._type; }
    set type(_type) { this._type = _type; }
    get id() { return this._id; }
    set id(_id) { this._id = _id; }

    static fromParams(params) {
        let itemInfo;
        if (params.Type === "Item") {
            itemInfo = new ItemInfo("item", params.ItemId);
        } else if (params.Type === "Weapon") {
            itemInfo = new ItemInfo("weapon", params.WeaponId);
        } else if (params.Type === "Armor") {
            itemInfo = new ItemInfo("armor", params.ArmorId);
        } else {
            throw new Error(`Type ${params.Type} is unknown.`);
        }
        return itemInfo;
    }

    // Tag to completely specify the item.
    tag() {
        return `${this._type}_${this._id}`;
    }

    itemData() {
        switch (this._type) {
        case "item":
            return $dataItems[this._id];
        case "weapon":
            return $dataWeapons[this._id];
        case "armor":
            return $dataArmors[this._id];
        }
        throw new Error(`${this._type} is not found`);
    }

    partyItemCount() {
        let count;
        switch (this._type) {
        case "item":
            count = $gameParty._items[this._id];
            break;
        case "weapon":
            count = $gameParty._weapons[this._id];
            break;
        case "armor":
            count = $gameParty._armors[this._id];
            break;
        default:
            throw new Error(`${this._type} is not found`);
        }
        if (count) return count;
        return 0;
    }
}

class Material {
    constructor(itemInfo, count) {
        this._itemInfo = itemInfo;
        this._count = count;
    }

    get itemInfo() { return this._itemInfo; }
    set itemInfo(_itemInfo) { this._itemInfo = _itemInfo; }
    get count() { return this._count; }
    set count(_count) { this._count = _count; }
}

class AlchemyRecipe {
    static fromRecipeData(recipeData) {
        const materials = {};
        for (const materialData of recipeData.material) {
            const itemInfo = new ItemInfo(materialData[0], materialData[1]);
            const material = new Material(itemInfo, materialData[2]);
            materials[itemInfo.tag()] = material;
        }
        const targetItemInfo = new ItemInfo(recipeData.target[0], recipeData.target[1]);
        const price = recipeData.price ? recipeData.price : 0;
        return new AlchemyRecipe(materials, price, targetItemInfo);
    }

    static fromRecipeDataV2(recipeDataV2) {
        const materials = {};
        for (const materialData of recipeDataV2.Materials) {
            const itemInfo = ItemInfo.fromParams(materialData.ItemInfo);
            const material = new Material(itemInfo, materialData.NeedItems);
            materials[itemInfo.tag()] = material;
        }
        const targetItemInfo = ItemInfo.fromParams(recipeDataV2.TargetItemInfo);
        const price = recipeDataV2.Price;
        return new AlchemyRecipe(materials, price, targetItemInfo);
    }

    constructor(materials, price, targetItemInfo) {
        this._materials = materials;
        this._price = price;
        this._targetItemInfo = targetItemInfo;
    }

    materials() {
        return this._materials;
    }

    price() {
        return this._price;
    }

    targetItemInfo() {
        return this._targetItemInfo;
    }

    targetItemData() {
        return this._targetItemInfo.itemData();
    }

    needItemCount(itemInfo) {
        return this._materials[itemInfo.tag()].count;
    }

    hasItemCount(itemInfo) {
        return PartyItemUtils.partyItemCount(itemInfo);
    }

    maxMakeItemCount() {
        const targetItem = this.targetItemData();
        const maxRemainingCount = $gameParty.maxItems(targetItem) - PartyItemUtils.partyItemCount(this._targetItemInfo);
        if (maxRemainingCount <= 0) return 0;
        let makeItemCount = this.maxMakeItemCountNoLimit();
        if (makeItemCount > MaxNumMakeItem) makeItemCount = MaxNumMakeItem;
        return makeItemCount > maxRemainingCount ? maxRemainingCount : makeItemCount;
    }

    maxMakeItemCountNoLimit() {
        let minCount;
        minCount = (this._price > 0 ? Math.floor($gameParty.gold() / this._price) : MaxNumMakeItem);
        if (minCount === 0) return 0;
        for (const tag in this._materials) {
            const itemInfo = this._materials[tag].itemInfo;
            const count = Math.floor(this.hasItemCount(itemInfo) / this.needItemCount(itemInfo));
            if (count === 0) return 0;
            if (count < minCount) minCount = count;
        }
        return minCount;
    }

    canMakeItem() {
        return this.maxMakeItemCount() > 0;
    }

    makeItem(targetItemCount) {
        for (const tag in this._materials) {
            const material = this._materials[tag];
            PartyItemUtils.gainPartyItem(material.itemInfo, -material.count * targetItemCount);
        }
        $gameParty.gainGold(-this._price * targetItemCount);
        PartyItemUtils.gainPartyItem(this._targetItemInfo, targetItemCount);
    }
}

class Scene_Alchemy extends Scene_MenuBase {
    create() {
        super.create();
        this.createRecipes();
        this.createHelpWindow();
        this.createSelectRecipesWindow();
        this.createNumberWindow();
        if (EnabledCategoryWindow) this.createCategoryWindow();
        if (EnabledGoldWindow) this.createGoldWindow();
        this.createRecipeDetailWindow();
    }

    start() {
        super.start();
        this._windowSelectRecipes.open();
        this._windowRecipeDetail.open();
        this._helpWindow.show();
        if (EnabledCategoryWindow) {
            this._categoryWindow.open();
            this._categoryWindow.activate();
        } else {
            this._windowSelectRecipes.refresh();
            this._windowSelectRecipes.activate();
            this._windowSelectRecipes.select(0);
        }
    }

    createRecipes() {
        $recipes = [];
        for (const item of $gameParty.items()) {
            const recipeDatas = this.parseRecipeData(item);
            for (const recipeData of recipeDatas) {
                $recipes.push(AlchemyRecipe.fromRecipeData(recipeData));
            }
        }

        for (const item of $gameParty.items()) {
            for (const recipeInfo of PP.RecipeInfos) {
                if (item.id === recipeInfo.RecipeItem) {
                    for (const recipe of recipeInfo.Recipe) {
                        $recipes.push(AlchemyRecipe.fromRecipeDataV2(recipe));
                    }
                    break;
                }
            }
        }
    }

    parseRecipeData(item) {
        const recipeDatas = [];
        const reg = /<recipe>(.+?)<\/recipe>/sg;
        while (true) {
            const matchData = reg.exec(item.note);
            if (!matchData) break;
            const strNote = matchData[1];
            try {
                const recipeData = JSON.parse("{" + strNote + "}");
                recipeDatas.push(recipeData);
            } catch(e) {
                console.error(e);
                throw NoteParseErrorMessage.format(strNote);
            }
        }
        return recipeDatas;
    }

    createCategoryWindow() {
        this._categoryWindow = new Window_AlchemyCategory(this.categoryWindowRect());
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.setHandler("ok",     this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
        this._categoryWindow.setItemWindow(this._windowSelectRecipes);
        this._categoryWindow.deactivate();
        this.addWindow(this._categoryWindow);
    }

    createGoldWindow() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold_MZMV(rect);
        this.addWindow(this._goldWindow);
    }

    createSelectRecipesWindow() {
        this._windowSelectRecipes = new Window_SelectRecipes(this.selectRecipesWindowRect());
        this._windowSelectRecipes.setHandler("ok", this.selectRecipesOk.bind(this));
        this._windowSelectRecipes.setHandler("select", this.selectRecipesSelect.bind(this));
        this._windowSelectRecipes.setHandler("cancel", this.selectRecipesCancel.bind(this));
        this._windowSelectRecipes.setHelpWindow(this._helpWindow);
        this._windowSelectRecipes.refresh();
        this._windowSelectRecipes.close();
        this._windowSelectRecipes.deactivate();
        this._windowSelectRecipes.hideHelpWindow();
        this._windowSelectRecipes.show();
        this._helpWindow.hide();
        if (this._windowSelectRecipes.maxItems() > 0) this._windowSelectRecipes.select(0);
        this.addWindow(this._windowSelectRecipes);
    }

    createNumberWindow() {
        const rect = this.numberWindowRect();
        this._numberWindow = new Window_AlchemyNumber(rect);
        this._numberWindow.hide();
        this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
        this._numberWindow.setHandler("changeNumber", this.onNumberChange.bind(this));
        this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    }

    createRecipeDetailWindow() {
        this._windowRecipeDetail = new Window_RecipeDetail(this.recipeDetailWindowRect());
        this._windowRecipeDetail.setNumberWindow(this._numberWindow);
        this._windowRecipeDetail.refresh();
        this._windowRecipeDetail.close();
        this._windowRecipeDetail.deactivate();
        this._windowRecipeDetail.show();
        this.addWindow(this._windowRecipeDetail);
    }

    categoryWindowRect() {
        const goldWindowRect = this.goldWindowRect();
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = (EnabledGoldWindow ? Graphics.boxWidth - goldWindowRect.width : Graphics.boxWidth);
        const wh = (EnabledCategoryWindow || EnabledGoldWindow ? this.calcWindowHeight(1, true) : 0);
        return new Rectangle(wx, wy, ww, wh);
    }

    goldWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    }

    numberWindowRect() {
        return this.selectRecipesWindowRect();
    }

    selectRecipesWindowRect() {
        const categoryWindowRect = this.categoryWindowRect();
        const wx = 0;
        const wy = categoryWindowRect.y + categoryWindowRect.height;
        const ww = Math.floor(Graphics.boxWidth / 2);
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    }

    recipeDetailWindowRect() {
        const selectRecipesWindowRect = this.selectRecipesWindowRect();
        const wx = selectRecipesWindowRect.x + selectRecipesWindowRect.width;
        const wy = selectRecipesWindowRect.y;
        const ww = Graphics.boxWidth - wx;
        const wh = selectRecipesWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    }

    onCategoryOk() {
        this.changeCategoryWindowToSelectRecipesWindow();
    }

    onCategoryCancel() {
        this.popScene();
    }

    selectRecipesOk() {
        if (this._windowSelectRecipes.maxItems() === 0) return;
        const recipe = this._windowSelectRecipes.recipe();
        this._numberWindow.setup(recipe.targetItemData(), recipe.maxMakeItemCount(), 2);
        this.changeSelectRecipesWindowToNumberWindow();
    }

    selectRecipesCancel() {
        if (EnabledCategoryWindow) {
            this.changeSelectRecipesWindowToCategoryWindow();
        } else {
            this.popScene();
        }
    }

    selectRecipesSelect() {
        if (!this._windowRecipeDetail) return;
        const recipe = this._windowSelectRecipes.recipe();
        this._windowRecipeDetail.setRecipe(recipe);
        this._windowRecipeDetail.refresh();
    }

    onNumberOk() {
        const recipe = this._windowSelectRecipes.recipe();
        recipe.makeItem(this._numberWindow.number());
        if (EnabledGoldWindow) this._goldWindow.refresh();
        this.playMakeItemSe();
        this.changeNumberWindowToSelectRecipesWindow();
    }

    onNumberChange() {
        this._windowRecipeDetail.refresh();
    }

    onNumberCancel() {
        this.changeNumberWindowToSelectRecipesWindow();
    }

    playMakeItemSe() {
        if (MakeItemSeFileName === "") return;
        const se = {
            name: MakeItemSeFileName,
            pan: MakeItemSePan,
            pitch: MakeItemSePitch,
            volume: MakeItemSeVolume,
        }
        AudioManager.playSe(se);
    }

    changeCategoryWindowToSelectRecipesWindow() {
        this._categoryWindow.deactivate();
        this._windowSelectRecipes.refresh();
        this._windowSelectRecipes.activate();
        this._windowSelectRecipes.select(0);
    }

    changeSelectRecipesWindowToMakeItemYesOrNoWindow() {
        this._windowSelectRecipes.deactivate();
        this._windowSelectRecipes.refresh();
        this._windowMakeItemYesOrNo.open();
        this._windowMakeItemYesOrNo.activate();
    }

    changeSelectRecipesWindowToCategoryWindow() {
        this._windowSelectRecipes.deactivate();
        this._windowSelectRecipes.select(-1);
        this._windowSelectRecipes.refresh();
        this._categoryWindow.activate();
    }

    changeSelectRecipesWindowToNumberWindow() {
        this._windowSelectRecipes.deactivate();
        this._windowSelectRecipes.refresh();
        this._numberWindow.show();
        this._numberWindow.activate();
    }

    changeNumberWindowToSelectRecipesWindow() {
        this._numberWindow.hide();
        this._numberWindow.deactivate();
        this._numberWindow._number = 1;
        this._windowRecipeDetail.refresh();
        this._windowSelectRecipes.refresh();
        this._windowSelectRecipes.activate();
    }
}

class Window_SelectRecipes extends Window_Selectable {
    initialize(rect) {
        this._recipes = [];
        if (EnabledCategoryWindow) {
            this._category = "none";
        } else {
            this._category = null;
        }
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
            super.initialize(rect.x, rect.y, rect.width, rect.height);
        }
    }

    updateHelp() {
        if (!this.recipe()) return;
        this.setHelpWindowItem(this.recipe().targetItemData());
    }

    // This method is call by Window_AlchemyCategory.
    setCategory(category) {
        if (category !== this._category) {
            this._category = category;
            this.refresh();
        }
    }

    maxCols() {
        return 1;
    }

    maxItems() {
        return this._recipes.length;
    }

    isCurrentItemEnabled() {
        const recipe = this.recipe();
        if (!recipe) return false;
        return recipe.canMakeItem();
    }

    drawItem(index) {
        const recipe = this._recipes[index];
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(recipe.canMakeItem());
        this.drawItemName(recipe.targetItemData(), rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
    }

    numberWidth() {
        return this.textWidth('000');
    };

    makeItemList() {
        if (EnabledCategoryWindow) {
            this._recipes = this.recipesByCategory();
        } else {
            this._recipes = $recipes;
        }
    }

    recipesByCategory() {
        return $recipes.filter((recipe) => {
            if (recipe.targetItemInfo().type === "item") {
                if (this._category === "item") {
                    return recipe.targetItemInfo().itemData().itypeId === 1;
                } else if (this._category === "keyItem") {
                    return recipe.targetItemInfo().itemData().itypeId === 2;
                }
            } else {
                return recipe.targetItemInfo().type === this._category;
            }
        });
    }

    select(index) {
        super.select(index);
        this.callHandler("select");
    }

    selectLast() {
        this.select(this.maxItems() - 1);
    }

    refresh() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    }

    recipe() {
        if (this._recipes.length === 0) return null;
        return this._recipes[this.index()];
    }
}

class Window_AlchemyCategory extends Window_ItemCategory {
    initialize(rect) {
        this._windowRect = rect;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
            super.initialize(rect.x, rect.y, rect.width, rect.height);
        }
        this.x = rect.x;
        this.y = rect.y;
    }

    windowWidth() {
        return this._windowRect.width;
    }

    windowHeight() {
        return this._windowRect.height;
    }

    makeCommandList() {
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.makeCommandList();
        } else {
            if (DisplayItemCategory) this.addCommand(TextManager.item, "item");
            if (DisplayWeaponCategory) this.addCommand(TextManager.weapon, "weapon");
            if (DisplayArmorCategory) this.addCommand(TextManager.armor, "armor");
            if (DisplayKeyItemCategory) this.addCommand(TextManager.keyItem, "keyItem");
        }
    };

    needsCommand(name) {
        if (!DisplayItemCategory && name === "item") return false;
        if (!DisplayWeaponCategory && name === "weapon") return false;
        if (!DisplayArmorCategory && name === "armor") return false;
        if (!DisplayKeyItemCategory && name === "keyItem") return false;
        return super.needsCommand(name);
    }

    maxCols() {
        let cols = 4;
        if (!DisplayItemCategory) cols--;
        if (!DisplayWeaponCategory) cols--;
        if (!DisplayArmorCategory) cols--;
        if (!DisplayKeyItemCategory) cols--;
        return cols;
    }
}

class Window_Gold_MZMV extends Window_Gold {
    initialize(rect) {
        this._windowRect = rect;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
            super.initialize(rect.x, rect.y);
        }
    }

    windowWidth() {
        return this._windowRect.width;
    }

    windowHeight() {
        return this._windowRect.height;
    }
}

class Window_AlchemyNumber extends Window_ShopNumber {
    initialize(rect) {
        this._windowRect = rect;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
            super.initialize(rect.x, rect.y, rect.height);
        }
    }

    windowWidth() {
        return this._windowRect.width;
    }

    windowHeight() {
        return this._windowRect.height;
    }

    refresh() {
        Window_Selectable.prototype.refresh.call(this);
        if (Utils.RPGMAKER_NAME === "MZ") {
            this.drawItemBackground(0);
            this.drawCurrentItemName();
        } else {
            let width = this.innerWidth;
            const sign = "\u00d7";
            width = width - this.textWidth(sign) - this.itemPadding() * 2;
            width = width - this.cursorWidth() - this.itemPadding() * 2;
            this.drawItemName(this._item, 0, this.itemY(), width);
        }
        this.drawMultiplicationSign();
        this.drawNumber();
    }

    changeNumber(amount) {
        super.changeNumber(amount);
        this.callHandler("changeNumber");
    }
}

class Window_RecipeDetail extends Window_Base {
    initialize(rect) {
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
            super.initialize(rect.x, rect.y, rect.width, rect.height);
        }
        this._numberWindow = null;
    }

    setNumberWindow(numberWindow) {
        this._numberWindow = numberWindow
    }

    setRecipe(recipe) {
        this._recipe = recipe;
    }

    refresh() {
        if (this.contents) {
            this.contents.clear();
            this.draw();
        }
    }

    draw() {
        if (!this._recipe) return;
        this.drawPossession();
        this.drawMaterials();
        if (EnabledGoldWindow) this.drawTotalPrice();
        this.drawTargetItem();
    }

    drawPossession() {
        const x = this.itemPadding();
        const y = this.itemPadding();
        const width = this.innerWidth - this.itemPadding() - x;
        const possessionWidth = this.textWidth("0000");
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.possession, x, y, width - possessionWidth);
        this.resetTextColor();
        this.drawText(PartyItemUtils.partyItemCount(this._recipe.targetItemInfo()), x, y, width, "right");
    };

    drawMaterials() {
        const recipe = this._recipe;
        const width = this.innerWidth - this.itemPadding() * 2;
        const x = this.itemPadding();
        let y = this.itemPadding() + this.lineHeight();
        this.changeTextColor(this.systemColor());
        this.drawText(NeedMaterialText, x, y, width);
        y += this.lineHeight();
        this.drawHorzLine(y - 5);
        this.resetTextColor();
        for (const tag in recipe.materials()) {
            const material = recipe.materials()[tag];
            const needItemCount = recipe.needItemCount(material.itemInfo) * this._numberWindow.number();
            const hasItemCount = recipe.hasItemCount(material.itemInfo);
            const item = material.itemInfo.itemData();
            this.drawItemName(item, x, y, width - this.numberWidth());
            if (needItemCount <= hasItemCount) {
                this.changeTextColor(this.crisisColor());
            } else {
                this.changePaintOpacity(false);
            }
            this.drawItemNumber(needItemCount, hasItemCount, x, y, width);
            this.resetTextColor();
            this.changePaintOpacity(true);
            y += this.lineHeight();
        }
    }

    drawTotalPrice() {
        const x = this.itemPadding();
        const minY = this.totalPriceYOfs(MaxMaterials);
        let y = this.totalPriceYOfs(Object.keys(this._recipe.materials()).length);
        if (y < minY) y = minY;
        const currentUnit = TextManager.currencyUnit;
        const width = this.innerWidth - this.itemPadding() * 2;
        const goldText = `${this._recipe.price() * this._numberWindow.number()}`;
        this.changeTextColor(this.systemColor());
        this.drawText(NeedPriceText, x, y, width, "left");
        this.resetTextColor();
        this.drawText(goldText, x, y, width - this.textWidth(currentUnit), "right");
        this.changeTextColor(this.systemColor());
        this.drawText(currentUnit, x, y, width, "right");
        this.drawHorzLine(y + this.lineHeight() - 5);
        this.resetTextColor();
    }

    totalPriceYOfs(lines) {
        return this.itemPadding() + lines * this.lineHeight() + this.lineHeight() * 2 + 20;
    }

    drawItemNumber(needItemCount, hasItemCount, x, y, width) {
        this.drawText(`${needItemCount}/${hasItemCount}`, x, y, width, "right");
    }

    numberWidth() {
        return this.textWidth("000/000");
    }

    drawTargetItem() {
        const width = this.innerWidth - this.itemPadding() * 2;
        const x = this.itemPadding();
        let y;
        y = this.targetItemYOfs(Object.keys(this._recipe.materials()).length);
        const minY = this.targetItemYOfs(MaxMaterials);
        if (y < minY) y = minY;
        const item = this._recipe.targetItemData();
        this.changeTextColor(this.systemColor());
        this.drawText(TargetItemText, x, y, width);
        this.drawHorzLine(y + this.lineHeight() - 5);
        this.resetTextColor();
        this.drawItemName(item, x, y + this.lineHeight(), width);
    }

    targetItemYOfs(lines) {
        if (EnabledGoldWindow) {
            return this.totalPriceYOfs(lines) + this.lineHeight() + 20;
        } else {
            return this.totalPriceYOfs(lines);
        }
    }

    drawHorzLine(y) {
        const padding = this.itemPadding();
        const x = padding;
        const width = this.innerWidth - padding * 2;
        this.drawRect(x, y, width, 5);
    }

    crisisColor() {
        if (Utils.RPGMAKER_NAME === "MZ") {
            return ColorManager.crisisColor();
        } else {
            return super.crisisColor();
        }
    }
}

// Add alchemy to menu command.
const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    _Window_MenuCommand_addOriginalCommands.call(this);
    if (EnabledMenuAlchemy) this.addCommand(MenuAlchemyText, "alchemy", this.isEnabledAlchemy());
};

Window_MenuCommand.prototype.isEnabledAlchemy = function() {
    if (EnabledAlchemySwitchId === 0) return true;
    return $gameSwitches.value(EnabledAlchemySwitchId);
};

const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler("alchemy", this.alchemy.bind(this));
};

Scene_Menu.prototype.alchemy = function() {
    SceneManager.push(Scene_Alchemy);
};

// Register plugin command.
if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(AlchemySystemPluginName, "StartAlchemyScene", () => {
        SceneManager.push(Scene_Alchemy);
    });
} else {
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === "AlchemySystem" && args[0] === "StartAlchemyScene") {
            SceneManager.push(Scene_Alchemy);
        }
    };
}


// Define class alias.
return {
    PartyItemUtils,
    ItemInfo,
    Material,
    AlchemyRecipe,
    Scene_Alchemy,
    Window_SelectRecipes,
    Window_AlchemyCategory,
    Window_AlchemyNumber,
    Window_RecipeDetail,
}

})();
