/*:
@target MV MZ
@plugindesc アイテム合成プラグイン v1.2.4
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/AlchemySystem.js

@param EnabledMenuAlchemy
@type boolean
@default true
@desc
trueを設定すると、メニューに合成コマンドを追加します。

@param EnabledAlchemySwitchId
@type switch
@default 0
@desc
メニューの合成の有効/無効を切り替えるスイッチのIDを指定します。0を指定すると、常に合成コマンドは有効になります。

@param EnabledCategoryWindow
@type boolean
@default true
@desc
trueを設定すると、カテゴリウィンドウを表示します。

@param EnabledGoldWindow
@type boolean
@default true
@desc
trueを設定すると、合成画面に現在の所持ゴールドとアイテム合成に必要なゴールドを表示します。

@param DisplayKeyItemCategory
@type boolean
@default false
@desc
trueを設定すると、合成時のカテゴリ選択画面で大事なもの欄を表示します。

@param MaxNumMakeItem
@type number
@default 999
@desc
一度に合成可能なアイテム数の最大値を指定します。

@param MaxMaterials
@type number
@default 3
@desc
合成に使用する素材の種類の最大値を指定します。

@param MakeItemSeFileName
@type file
@dir audio/se
@default Heal5
@desc
アイテムを合成したときに再生するSEのファイル名を指定します。

@param MakeItemSeVolume
@type number
@default 90
@desc
アイテムを合成したときに再生するSEのvolumeを指定します。

@param MakeItemSePitch
@type number
@default 100
@desc
アイテムを合成したときに再生するSEのpitchを指定します。

@param MakeItemSePan
@type number
@default 0
@desc
アイテムを合成したときに再生するSEのpanを指定します。

@param MenuAlchemyText
@type string
@default 合成
@desc
メニューに表示する合成の文言を指定します。

@param NeedMaterialText
@type string
@default 必要素材：
@desc
必要素材を表示する際の文言を指定します。

@param NeedPriceText
@type string
@default 必要経費：
@desc
必要経費を表示する際の文言を指定します。

@param TargetItemText
@type string
@default 生成アイテム：
@desc
生成アイテムを表示する際の文言を指定します。

@command StartAlchemyScene
@text 合成シーン開始
@desc 合成シーンを開始します。

@help
シンプルなアイテム合成機能を導入するプラグインです。

[使用方法]
アイテムの合成はレシピを入手することによって可能となります。
レシピは通常のアイテムとして持たせることによって、レシピに登録されたアイテムが合成できるようになります。

■レシピの作成
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

■合成シーンの開始
プラグインコマンドで「StartAlchemyScene」を実行すると、合成シーンを開始します。
ツクールMVの場合、次のコマンドを入力してください。
AlchemySystem StartAlchemyScene

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const AlchemySystemPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

const AlchemyClassAlias = (() => {
"use strict";

const params = PluginManager.parameters(AlchemySystemPluginName);

const EnabledMenuAlchemy = (params["EnabledMenuAlchemy"] === "true" ? true : false);
const EnabledAlchemySwitchId = parseInt(params["EnabledAlchemySwitchId"]);
const EnabledCategoryWindow = (params["EnabledCategoryWindow"] === "true" ? true : false);
const EnabledGoldWindow = (params["EnabledGoldWindow"] === "true" ? true : false);
const DisplayKeyItemCategory = (params["DisplayKeyItemCategory"] === "true" ? true : false);

const MaxNumMakeItem = parseInt(params["MaxNumMakeItem"]);
const MaxMaterials = parseInt(params["MaxMaterials"]);

const MakeItemSeFileName = params["MakeItemSeFileName"];
const MakeItemSeVolume = parseInt(params["MakeItemSeVolume"]);
const MakeItemSePitch = parseInt(params["MakeItemSePitch"]);
const MakeItemSePan = parseInt(params["MakeItemSePan"]);

const MenuAlchemyText = params["MenuAlchemyText"];
const NeedMaterialText = params["NeedMaterialText"];
const NeedPriceText = params["NeedPriceText"];
const TargetItemText = params["TargetItemText"];


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

class ItemInfo {
    constructor(type, id) {
        this._type = type;
        this._id = id;
    }

    get type() { return this._type; }
    set type(_type) { this._type = _type; }
    get id() { return this._id; }
    set id(_id) { this._id = _id; }

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
        return itemInfo.partyItemCount();
    }

    maxMakeItemCount() {
        const targetItem = this.targetItemData();
        const maxRemainingCount = $gameParty.maxItems(targetItem) - $gameParty.numItems(targetItem);
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
            $gameParty.gainItem(material.itemInfo.itemData(), -material.count * targetItemCount);
        }
        $gameParty.gainGold(-this._price * targetItemCount);
        $gameParty.gainItem(this.targetItemData(), targetItemCount);
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
            const matchData = item.note.match(/<recipe>(.+)<\/recipe>/s);
            if (!matchData) continue;
            const recipeData = JSON.parse("{" + matchData[1] + "}");
            const materials = {};
            for (const materialData of recipeData.material) {
                const itemInfo = new ItemInfo(materialData[0], materialData[1]);
                const material = new Material(itemInfo, materialData[2]);
                materials[itemInfo.tag()] = material;
            }
            const targetItemInfo = new ItemInfo(recipeData.target[0], recipeData.target[1]);
            const price = recipeData.price ? recipeData.price : 0;
            $recipes.push(new AlchemyRecipe(materials, price, targetItemInfo));
        }
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
            this._recipes = $recipes.filter((recipe) => {
                return recipe.targetItemInfo().type === this._category;
            });
        } else {
            this._recipes = $recipes;
        }
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
            this.addCommand(TextManager.item,    "item");
            this.addCommand(TextManager.weapon,  "weapon");
            this.addCommand(TextManager.armor,   "armor");
            if (DisplayKeyItemCategory) this.addCommand(TextManager.keyItem, "keyItem");
        }
    };

    needsCommand(name) {
        if (!DisplayKeyItemCategory && name === "keyItem") return false;
        return super.needsCommand(name);
    }

    maxCols() {
        if (!DisplayKeyItemCategory) return 3;
        return super.maxCols();
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
        this.drawText($gameParty.numItems(this._recipe.targetItemData()), x, y, width, "right");
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
    ItemInfo: ItemInfo,
    Material: Material,
    AlchemyRecipe: AlchemyRecipe,
    Scene_Alchemy: Scene_Alchemy,
    Window_SelectRecipes: Window_SelectRecipes,
    Window_AlchemyCategory: Window_AlchemyCategory,
    Window_AlchemyNumber: Window_AlchemyNumber,
    Window_RecipeDetail: Window_RecipeDetail,
}

})();
