/*:
@target MZ
@plugindesc Shop screen expansion v1.0.5
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/ShopScene_Extension.js

@help
A plugin that expands the information display screen for weapons / armor in the shop.
By installing this plug-in, the increase values ​​of various parameters will be displayed.

【Method of operation】
You can switch the actor whose information is displayed by touching the left / right key or the arrow image.
You can also switch actors by directly touching the actor's image.

【License】
This plugin is available under the terms of the MIT license.

@param ActorCharacterSpace
@text Space between actors
@type number
@default 24
@desc
Specify the space width between the actor images on the shop screen.

@param ActorCharacterBeginOfs
@text Actor start offset
@type number
@default 32
@desc
Specify the coordinate offset when displaying the actor image on the shop screen.

@param MaxVisibleActors
@text Maximum number of display actors
@type number
@default 4
@desc
Specify the maximum number of actors that can be displayed at one time on the shop screen.

@param EnableActorArrow
@text Actor arrow display enabled
@type boolean
@default true
@desc
Arrow to switch actors Set whether to display the image.

@param VisibleEquipMode
@text Equipped item display mode
@type number
@default 1
@desc
Specifies the display mode of the equipped item. (0: Do not show 1: Show only current equipment 2: Show current and new equipment)

@param StatusWidth
@text status window width
@type number
@default 352
@desc
Specifies the width of the status window on the shop screen.

@param NoneItemText
@text No equiped item text
@type string
@default None
@desc
Specifies the text to display when there are no currently equipped items on the shop screen.
*/

/*:ja
@target MZ
@plugindesc ショップ画面拡張 v1.0.5
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/ShopScene_Extension.js

@help
ショップの武器/防具の情報表示画面を拡張するプラグインです。
このプラグインを導入することで、
各種パラメータの上昇値が表示されるようになります。

【操作方法】
左右キーまたは矢印画像タッチで情報を表示する対象のアクターを
切り替えることができます。
また、アクターの画像を直接タッチすることでもアクターの切り替えが可能です。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@param ActorCharacterSpace
@text アクター間スペース
@type number
@default 24
@desc
ショップ画面でアクター画像間のスペース幅を指定します。

@param ActorCharacterBeginOfs
@text アクター開始オフセット
@type number
@default 32
@desc
ショップ画面でアクター画像を表示する際の座標オフセットを指定します。

@param MaxVisibleActors
@text 最大表示アクター数
@type number
@default 4
@desc
ショップ画面で一度に表示可能な最大アクター数を指定します。

@param EnableActorArrow
@text アクター矢印表示有効
@type boolean
@default true
@desc
アクターを切り替える矢印画像の表示有無を設定します。

@param VisibleEquipMode
@text 装備中アイテム表示モード
@type number
@default 1
@desc
装備中アイテムの表示モードを指定します。(0: 表示しない  1: 現在の装備のみ表示  2: 現在と新規の装備を表示)

@param StatusWidth
@text ステータスウィンドウ幅
@type number
@default 352
@desc
ショップ画面のステータスウィンドウの横幅を指定します。

@param NoneItemText
@text 装備アイテムなし時テキスト
@type string
@default なし
@desc
ショップ画面で現在装備中のアイテムがない場合に表示するテキストを指定します。
*/

const ShopScene_ExtensionPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {
"use strict";

const params = PluginManager.parameters(ShopScene_ExtensionPluginName);
const ActorCharacterSpace = parseInt(params["ActorCharacterSpace"]);
const ActorCharacterBeginOfs = parseInt(params["ActorCharacterBeginOfs"]);
const MaxVisibleActors = parseInt(params["MaxVisibleActors"]);
const EnableActorArrow = (params["EnableActorArrow"] === "true" ? true : false);
const VisibleEquipMode = parseInt(params["VisibleEquipMode"]);
const StatusWidth = parseInt(params["StatusWidth"]);
const NoneItemText = params["NoneItemText"];

const _Scene_Shop_update = Scene_Shop.prototype.update;
Scene_Shop.prototype.update = function() {
    _Scene_Shop_update.call(this);
    if (this._buyWindow.active) {
        this._statusWindow.setEnableChangeActor(true);
    } else {
        this._statusWindow.setEnableChangeActor(false);
    }
};

Scene_Shop.prototype.statusWidth = function() {
    return StatusWidth;
};

class TriangleDrawer {
    constructor(bitmap) {
        this._bitmap = bitmap;
    }

    drawTriangle(x1, y1, x2, y2, x3, y3, strokeColor, fillColor) {
        const ctx = this._bitmap._context;
        ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineTo(x3, y3);
		ctx.closePath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
		ctx.stroke();
		ctx.fillStyle = fillColor;
		ctx.fill();
    }
}

class Sprite_ActorCharacter extends Sprite_Clickable {
    get actor() { return this._actor; }

    initialize(actor, clickHandler) {
        super.initialize();
        this._actor = actor;
        this._clickHandler = clickHandler;
        this._opacityBitmap = null;
        this._holdState = null;
        this._holdPSize = { pw: 0, ph: 0 };
    }

    update() {
        super.update();
        if (this._holdState != null) {
            const { enabled, equipState } = this._holdState;
            const updated = this.updateBitmap(enabled, equipState);
            if (updated) this._holdState = null;
        }
    }

    // equipState is "none" or "cannot" or "equipped" or "up" or "down"
    changeEquipState(enabled, equipState) {
        this._holdState = { enabled, equipState };
    }

    updateBitmap(enabled, equipState) {
        const opacity = enabled ? 255 : 128;

        const characterBitmap = ImageManager.loadCharacter(this._actor.characterName());
        if (!characterBitmap.isReady()) return false;
        const big = ImageManager.isBigCharacter(this._actor.characterName());
        const pw = characterBitmap.width / (big ? 3 : 12);
        const ph = characterBitmap.height / (big ? 4 : 8);

        let holdPSizeChanged = false;
        if (this._holdPSize.pw != pw || this._holdPSize.ph != ph) {
            holdPSizeChanged = true;
            this._holdPSize.pw = pw;
            this._holdPSize.ph = ph;
        }

        const n = big ? 0: this._actor.characterIndex();
        const sx = ((n % 4) * 3 + 1) * pw;
        const sy = Math.floor(n / 4) * 4 * ph;

        if (!this._opacityBitmap || holdPSizeChanged) this._opacityBitmap = new Bitmap(pw, ph);
        this._opacityBitmap.clear();
        this._opacityBitmap.paintOpacity = opacity;
        this._opacityBitmap.blt(characterBitmap, sx, sy, pw, ph, 0, 0);

        if (!this.bitmap || holdPSizeChanged) this.bitmap = new Bitmap(pw, ph);
        this.bitmap.clear();
        this.bitmap.blt(this._opacityBitmap, 0, 0, pw, ph, 0, 0);

        this.bitmap.fontFace = $gameSystem.mainFontFace();
        switch (equipState) {
        case "cannot":
            this.bitmap.fontSize = 24;
            this.bitmap.textColor = "#ff0000";
            this.bitmap.drawText("×", 32, 32, 16, 16);
            break;
        case "equipped":
            this.bitmap.fontSize = 20;
            this.bitmap.textColor = "#ffffff";
            this.bitmap.drawText("Ｅ", 32, 32, 16, 16);
            break;
        case "up":
            this.drawUpTriangle(32, 32, 16, 16, "#000000", "#00ff00");
            break;
        case "down":
            this.drawDownTriangle(32, 32, 16, 16, "#000000", "#ff6666");
            break;
        }
        return true;
    }

    onClick() {
        this._clickHandler(this._actor);
    }

    drawUpTriangle(x, y, width, height, strokeColor, fillColor) {
        const w = width - 4;
        const h = height - 4;
        const ofs = 2;
        const x1 = x + w / 2 + ofs;
        const y1 = y + ofs;
        const x2 = x + ofs;
        const y2 = y + h + ofs;
        const x3 = x + w + ofs;
        const y3 = y2;
        this.drawTriangle(x1, y1, x2, y2, x3, y3, strokeColor, fillColor);
    }

    drawDownTriangle(x, y, width, height, strokeColor, fillColor) {
        const w = width - 4;
        const h = height - 4;
        const ofs = 2;
        const x1 = x + w / 2 + ofs;
        const y1 = y + h + ofs;
        const x2 = x + ofs;
        const y2 = y + ofs;
        const x3 = x + w + ofs;
        const y3 = y2;
        this.drawTriangle(x1, y1, x2, y2, x3, y3, strokeColor, fillColor);
    }

    drawTriangle(x1, y1, x2, y2, x3, y3, strokeColor, fillColor) {
        new TriangleDrawer(this.bitmap).drawTriangle(x1, y1, x2, y2, x3, y3, strokeColor, fillColor);
    }
}

class Sprite_Arrow extends Sprite_Clickable {
    initialize(clickHandler) {
        super.initialize();
        this._clickHandler = clickHandler;
        this.createBitmap();
    }

    onClick() {
        this._clickHandler(this._actor);
    }

    createBitmap() {
    }

    drawTriangle(x1, y1, x2, y2, x3, y3, strokeColor, fillColor) {
        new TriangleDrawer(this.bitmap).drawTriangle(x1, y1, x2, y2, x3, y3, strokeColor, fillColor);
    }
}

class Sprite_LeftArrow extends Sprite_Arrow {
    createBitmap() {
        this.bitmap = new Bitmap(24, 24);
        const w = 12;
        const h = 12;
        const x1 = 8;
        const y1 = 8 + h / 2;
        const x2 = x1 + w;
        const y2 = 8;
        const x3 = x2;
        const y3 = 8 + h;
        this.drawTriangle(x1, y1, x2, y2, x3, y3, "#000000", "#ffffff");
    }
}

class Sprite_RightArrow extends Sprite_Arrow {
    createBitmap() {
        this.bitmap = new Bitmap(24, 24);
        const w = 12;
        const h = 12;
        const x1 = 8 + w;
        const y1 = 8 + h / 2;
        const x2 = 8;
        const y2 = 8;
        const x3 = x2;
        const y3 = 8 + h;
        this.drawTriangle(x1, y1, x2, y2, x3, y3, "#000000", "#ffffff");
    }
}

const _Window_ShopStatus_initialize = Window_ShopStatus.prototype.initialize;
Window_ShopStatus.prototype.initialize = function(rect) {
    _Window_ShopStatus_initialize.call(this, rect);
    this._actorIndex = 0;
    this._actor = $gameParty.members()[0];
    this._enableChangeActor = false;
    this._currentEquippedItem = null;
    this.createActorSprites();
    if (EnableActorArrow) this.createActorArrowSprites();
};

Window_ShopStatus.prototype.createActorSprites = function() {
    this._actorSprites = [];
    for (const actor of $gameParty.members()) {
        const sprite = new Sprite_ActorCharacter(actor, this.clickActor.bind(this));
        this._actorSprites.push(sprite);
        this.addChild(sprite);
    }
};

Window_ShopStatus.prototype.createActorArrowSprites = function() {
    this._leftActorArrowSprite = new Sprite_LeftArrow(this.cursorLeft.bind(this, true));
    this.addChild(this._leftActorArrowSprite);
    this._rightActorArrowSprite = new Sprite_RightArrow(this.cursorRight.bind(this, true));
    this.addChild(this._rightActorArrowSprite);
};

Window_ShopStatus.prototype.setEnableChangeActor = function(enableChangeActor) {
    this._enableChangeActor = enableChangeActor;
};

Window_ShopStatus.prototype.updateActorIndex = function(index) {
    const lastIndex = this._actorIndex;
    this._actorIndex = index;
    this._actor = $gameParty.members()[this._actorIndex];
    if (this._actorIndex !== lastIndex) {
        this.playCursorSound();
        this.refresh();
    }
}

// ページ切り替えは使用しない
Window_ShopStatus.prototype.isPageChangeRequested = function() {
    return false;
};

Window_ShopStatus.prototype.isCursorMovable = function() {
    return (
        this._enableChangeActor && 
        !this._cursorFixed &&
        !this._cursorAll &&
        this._item &&
        this.isEquipItem()
    );
};

Window_ShopStatus.prototype.refresh = function() {
    this.contents.clear();
    if (!this._item) return;
    const x = this.itemPadding();
    this.drawPossession(x, 0);
    this.hideActorCharacters();
    if (EnableActorArrow) this.hideActorCursors();
    if (this.isEquipItem()) {
        const y = this.lineHeight();
        this.drawEquipInfo(x, y);
    }
};

Window_ShopStatus.prototype.clickActor = function(actor) {
    if (!this._enableChangeActor) return;
    const index = $gameParty.members().map(a => a.actorId()).indexOf(actor.actorId());
    if (index === -1) throw new Error(`actorId: ${actor.actorId()} is not found`);
    this.updateActorIndex(index);
};

Window_ShopStatus.prototype.processCursorMove = function() {
    if (Input.isRepeated("right")) {
        this.cursorRight(Input.isTriggered("right"));
    }
    if (Input.isRepeated("left")) {
        this.cursorLeft(Input.isTriggered("left"));
    }
};

Window_ShopStatus.prototype.cursorRight = function(triggered) {
    if (!this.isCursorMovable()) return;
    let index = this._actorIndex + 1;
    if (index >= $gameParty.members().length) {
        index = triggered ? 0 : this._actorIndex;
    }
    this.updateActorIndex(index);
};

Window_ShopStatus.prototype.cursorLeft = function(triggered) {
    if (!this.isCursorMovable()) return;
    let index = this._actorIndex - 1;
    if (index < 0) {
        index = triggered ? $gameParty.members().length - 1 : 0;
    }
    this.updateActorIndex(index);
};

Window_ShopStatus.prototype.drawEquipInfo = function(x, y) {
    this.drawActorEquipInfo(x, y, this._actor);
};

Window_ShopStatus.prototype.drawActorEquipInfo = function(x, y, actor) {
    this._currentEquippedItem = this.currentEquippedItem(actor, this._item.etypeId);
    const width = this.innerWidth - x - this.itemPadding();
    const halfWindowWidth = Math.floor(width / 2);
    this.resetTextColor();

    // Draw equip item
    if (VisibleEquipMode === 1) {
        // Draw actor name
        this.drawText(actor.name(), x, y, halfWindowWidth);

        // Draw item
        this.drawCurrentItem(x + halfWindowWidth, y, halfWindowWidth);
        y += this.lineHeight() * 3 + 8;

        // Draw characters
        this.setupActorCharacters(x + ActorCharacterBeginOfs, y - this.lineHeight() * 1.5);
        if (EnableActorArrow) this.setupActorCursors(y - this.lineHeight() * 1.5);
    } else if (VisibleEquipMode === 2) {
        // Draw actor name
        this.drawText(actor.name(), x, y, width);

        // Draw item
        const halfRightArrowWidth = this.rightArrowWidth() / 2;
        const itemNameWidth = halfWindowWidth - halfRightArrowWidth;
        y += this.lineHeight();
        this.drawCurrentItem(x, y, itemNameWidth);
        this.drawItemName(this._item, x + halfWindowWidth + this.rightArrowWidth(), y, itemNameWidth - halfRightArrowWidth);
        this.drawRightArrow(x + halfWindowWidth, y);
        y += this.lineHeight() * 2 + 8;

        // Draw characters
        this.setupActorCharacters(x + ActorCharacterBeginOfs, y - this.lineHeight());
        if (EnableActorArrow) this.setupActorCursors(y - this.lineHeight());
    } else {
        // Draw actor
        this.drawText(actor.name(), x, y, width);

        // Draw characters
        y += this.lineHeight() * 3 + 8;
        this.setupActorCharacters(x + ActorCharacterBeginOfs, y - this.lineHeight() * 1.5);
        if (EnableActorArrow) this.setupActorCursors(y - this.lineHeight() * 1.5);
    }
    y += 8;

    // Draw params
    this.drawAllParams(x, y);
};

Window_ShopStatus.prototype.drawCurrentItem = function(x, y, width) {
    if (this._currentEquippedItem) {
        this.drawItemName(this._currentEquippedItem, x, y, width);
    } else {
        this.drawText(NoneItemText, x, y, width);
    }
};

// アクタースプライトの座標を設定
Window_ShopStatus.prototype.setupActorCharacters = function(x, y) {
    let actorBegin;
    let actorEnd;
    if (this._actorIndex < MaxVisibleActors) {
        actorBegin = 0;
        actorEnd = $gameParty.members().length < MaxVisibleActors
                   ? $gameParty.members().length - 1
                   : MaxVisibleActors - 1;
    } else {
        actorBegin = this._actorIndex - MaxVisibleActors + 1;
        actorEnd = this._actorIndex;
    }
    for (let i = actorBegin; i <= actorEnd; i++) {
        const actorSprite = this._actorSprites[i];
        actorSprite.x = x;
        actorSprite.y = y;
        actorSprite.show();
        if (i !== this._actorIndex) {
            actorSprite.changeEquipState(false, this.getActorEquipState(actorSprite.actor));
        } else {
            actorSprite.changeEquipState(true, this.getActorEquipState(actorSprite.actor));
        }
        x += 48 + ActorCharacterSpace;
    }
};

Window_ShopStatus.prototype.hideActorCharacters = function() {
    for (let i = 0; i < $gameParty.members().length; i++) {
        const actorSprite = this._actorSprites[i];
        actorSprite.hide();
    }
};

Window_ShopStatus.prototype.getActorEquipState = function(actor) {
    const currentEquippedItem = this.currentEquippedItem(actor, this._item.etypeId);
    if (!actor.canEquip(this._item)) {
        return "cannot";
    } else if (this._item && currentEquippedItem && this._item.id === currentEquippedItem.id) {
        return "equipped";
    } else if (this.paramsDiff(actor, this._item, currentEquippedItem) > 0) {
        return "up";
    } else if (this.paramsDiff(actor, this._item, currentEquippedItem) < 0) {
        return "down";
    }
    return "none";
};

// アクター切り替え矢印スプライトの座標を設定
Window_ShopStatus.prototype.setupActorCursors = function(y) {
    this._leftActorArrowSprite.show();
    this._leftActorArrowSprite.x = this.padding;
    this._leftActorArrowSprite.y = y + 16;
    this._rightActorArrowSprite.show();
    this._rightActorArrowSprite.x = this.width - this.padding - this._rightActorArrowSprite.width;
    this._rightActorArrowSprite.y = y + 16;
};

Window_ShopStatus.prototype.hideActorCursors = function() {
    this._leftActorArrowSprite.hide();
    this._rightActorArrowSprite.hide();
};

Window_ShopStatus.prototype.drawAllParams = function(x, y) {
    for (let i = 0; i < 6; i++) {
        this.drawItem(x, y, 2 + i);
        y += this.lineHeight();
    }
};

Window_ShopStatus.prototype.drawItem = function(x, y, paramId) {
    const paramX = this.paramX();
    const paramWidth = this.paramWidth();
    const rightArrowWidth = this.rightArrowWidth();
    this.drawParamName(x, y, paramId);
    if (this._actor) this.drawCurrentParam(paramX, y, paramId);
    this.drawRightArrow(paramX + paramWidth, y);
    this.drawNewParam(paramX + paramWidth + rightArrowWidth, y, paramId);
};

Window_ShopStatus.prototype.drawParamName = function(x, y, paramId) {
    const width = this.paramX() - this.itemPadding() * 2;
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(TextManager.param(paramId), x, y, width);
};

Window_ShopStatus.prototype.drawCurrentParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
    this.resetTextColor();
    this.drawText(this._actor.param(paramId), x, y, paramWidth, "right");
};

Window_ShopStatus.prototype.drawRightArrow = function(x, y) {
    const rightArrowWidth = this.rightArrowWidth();
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("\u2192", x, y, rightArrowWidth, "center");
};

Window_ShopStatus.prototype.newEquipValue = function(actor, paramId, newItem, oldItem) {
    return actor.param(paramId) + newItem.params[paramId] - (oldItem ? oldItem.params[paramId] : 0);
};

// 全てのパラメータについて差分を取得
Window_ShopStatus.prototype.paramsDiff = function(actor, newItem, oldItem) {
    const paramIds = [];
    for (let i = 0; i < 6; i++) {
        paramIds.push(i + 2);
    }
    return paramIds.reduce((total, paramId) => {
        const newValue = this.newEquipValue(actor, paramId, newItem, oldItem);
        const diffValue = newValue - actor.param(paramId);
        return total + diffValue;
    }, 0);
};

Window_ShopStatus.prototype.drawNewParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
    if (this._actor.canEquip(this._item)) {
        const newValue = this.newEquipValue(this._actor, paramId, this._item, this._currentEquippedItem);
        const diffvalue = newValue - this._actor.param(paramId);
        this.changeTextColor(ColorManager.paramchangeTextColor(diffvalue));
        this.drawText(newValue, x, y, paramWidth, "right");
    } else {
        this.resetTextColor();
        this.changePaintOpacity(false);
        this.drawText("--", x, y, paramWidth, "right");
        this.changePaintOpacity(true);
    }
};

Window_ShopStatus.prototype.rightArrowWidth = function() {
    return 32;
};

Window_ShopStatus.prototype.paramWidth = function() {
    return 48;
};

Window_ShopStatus.prototype.paramX = function() {
    const itemPadding = this.itemPadding();
    const rightArrowWidth = this.rightArrowWidth();
    const paramWidth = this.paramWidth();
    return this.innerWidth - itemPadding - paramWidth * 2 - rightArrowWidth;
};

})();
