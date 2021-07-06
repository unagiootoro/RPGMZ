/*:
@target MV MZ
@plugindesc Skill Tree Layout Extension v1.2.3
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SkillTree_LayoutEx.js

@help
Extend the layout of the skill tree.
By installing this plugin, you will be able to:
-Display the skill name on the skill tree icon
-Display a background image on the skill tree icon
-Add an image to the icon when learning skills
-Display an icon in the skill tree type options
・ Display background image in skill tree scene

[Display skill name on skill tree icon]
Apply "icon_ex" to the icon information.
When using an icon ["icon_ex", icon background image, iconIndex]
iconIndex ... Index of the icon to use
            iconIndex is optional. If omitted, the icon set for the skill will be used.
Icon Background image ... Specify the file name of the background image or the index of the background.
                 When specifying the index, [Background image file name, X-axis index, Y-axis index]
                 Specify in the format of.
fileName ... The file name of the image. Import the images into the "img / pictures" folder.

[Display icon in skill tree type choice]
By adding icon information to the type information in the skill tree type setting, the icon will be displayed in the options.
In this case, the type information is set in the following format.

[Type type, type name, type description, type enabled / disabled, icon index]
Type Type ... Sets a unique identifier to identify the type in the skill derivation settings.
Type name ... Set the type name to be displayed in the type list window.
Type Description ... Sets the type description to display in the Type List window.
Type Enabled / Disabled ... Specify true to enable the type, false to disable it.
Icon index ... Index of the icon to use

[license]
This plugin is available under the terms of the MIT license.

@param IconXOfs
@type number
@default 5
@desc
Specifies the X coordinate offset of the icon.

@param OpenedImage
@type struct <OpenedImage>
@desc
Set the image to be added to the acquired skill.

@param ChangeOpenedTextColor
@type boolean
@default true
@desc
Set to true to change the text color of acquired skills.

@param IconFontSize
@type number
@default 20
@desc
Specifies the font size of the skill's characters.

@param BackgroundImage
@type struct <BackgroundImage>
@desc
Set the background image of the skill tree scene.
*/

/*~struct~OpenedImage:
@param EnableOpenedImage
@type boolean
@default false
@desc
Set to true to add an image to the acquired skill.

@param FileName
@type file
@dir img
@desc
Specify the file name of the image to be added to the acquired skill.

@param XOfs
@type number
@default 0
@desc
Specifies the X coordinate offset of the image to add to the acquired skill.

@param YOfs
@type number
@default 0
@desc
Specifies the Y coordinate offset of the image to add to the acquired skill.
*/

/*~struct~BackgroundImage:
@param FileName
@type file
@dir img
@desc
Specifies the file name of the background image of the skill tree scene.

@param BackgroundImage2
@type struct <BackgroundImage2>[]
@dir img
@desc
Skill Tree Specifies the file name of the image to add to the background image of the scene.

@param BackgroundImage2XOfs
@type number
@default 240
@desc
Specifies the X coordinate offset of the image to add to the background image of the skill tree scene.

@param BackgroundImage2YOfs
@type number
@default 300
@desc
Skill Tree Specifies the Y coordinate offset of the image to add to the background image of the scene.
*/

/*~struct~BackgroundImage2:
@param FileName
@type file
@dir img
@desc
Specifies the file name of the background image of the skill tree scene.

@param ActorId
@type actor
@desc
Specify the actor ID.
*/


/*:ja
@target MV MZ
@plugindesc スキルツリー レイアウト拡張 v1.2.3
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SkillTree_LayoutEx.js

@help
スキルツリーのレイアウトを拡張します。
このプラグインを導入することによって、次のことができるようになります。
・スキルツリーのアイコンにスキル名を表示
・スキルツリーのアイコンに背景画像を表示
・スキル習得時にアイコンに画像を追加
・スキルツリータイプの選択肢にアイコンを表示
・スキルツリーシーンで背景画像を表示

[スキルツリーのアイコンにスキル名を表示]
アイコン情報に"icon_ex"を適用します。
アイコンを使用する場合 ["icon_ex", アイコン背景画像, iconIndex]
iconIndex...使用するアイコンのインデックス
            iconIndexは省略可能です。省略した場合、スキルに設定されているアイコンが使用されます。
アイコン背景画像...背景画像のファイル名、または背景のインデックスを指定します。
                 インデックス指定を行う場合、[背景画像のファイル名、X軸インデックス、Y軸インデックス]
                 の形式で指定します。
fileName...画像のファイル名。画像は、「img/pictures」フォルダにインポートしてください。

[スキルツリータイプの選択肢にアイコンを表示]
スキルツリーのタイプの設定で、タイプ情報にアイコン情報を追加することで、選択肢にアイコンが表示されるようになります。
この場合、タイプ情報は次の形式で設定します。

[タイプ種別, タイプ名, タイプの説明, タイプ有効/無効, アイコンのインデックス]
タイプ種別...スキルの派生設定でタイプを識別するためのユニークな識別子を設定します。
タイプ名...タイプ一覧のウィンドウに表示するタイプ名を設定します。
タイプの説明...タイプ一覧のウィンドウに表示するタイプの説明を設定します。
タイプ有効/無効...タイプを有効にする場合は、trueを、無効にする場合は、falseを指定します。
アイコンのインデックス...使用するアイコンのインデックス

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。

@param IconXOfs
@type number
@default 5
@desc
アイコンのX座標オフセットを指定します。

@param OpenedImage
@type struct<OpenedImage>
@desc
習得済みスキルに追加する画像を設定します。

@param ChangeOpenedTextColor
@type boolean
@default true
@desc
trueを設定すると、習得済みスキルの文字の色を変更します。

@param IconFontSize
@type number
@default 20
@desc
スキルの文字のフォントサイズを指定します。

@param BackgroundImage
@type struct<BackgroundImage>
@desc
スキルツリーシーンの背景画像を設定します。
*/

/*~struct~OpenedImage:
@param EnableOpenedImage
@type boolean
@default false
@desc
trueを設定すると、習得済みスキルに画像を追加します。

@param FileName
@type file
@dir img
@desc
習得済みスキルに追加する画像のファイル名を指定します。

@param XOfs
@type number
@default 0
@desc
習得済みスキルに追加する画像のX座標オフセットを指定します。

@param YOfs
@type number
@default 0
@desc
習得済みスキルに追加する画像のY座標オフセットを指定します。
*/

/*~struct~BackgroundImage:
@param FileName
@type file
@default {"FileName":"","BackgroundImage2":"[]","BackgroundImage2XOfs":"240","BackgroundImage2YOfs":"300"}
@dir img
@desc
スキルツリーシーンの背景画像のファイル名を指定します。

@param BackgroundImage2
@type struct<BackgroundImage2>[]
@default []
@dir img
@desc
スキルツリーシーンの背景画像に追加する画像のファイル名を指定します。

@param BackgroundImage2XOfs
@type number
@default 240
@desc
スキルツリーシーンの背景画像に追加する画像のX座標オフセットを指定します。

@param BackgroundImage2YOfs
@type number
@default 300
@desc
スキルツリーシーンの背景画像に追加する画像のY座標オフセットを指定します。
*/

/*~struct~BackgroundImage2:
@param FileName
@type file
@dir img
@desc
スキルツリーシーンの背景画像のファイル名を指定します。

@param ActorId
@type actor
@desc
アクターIDを指定します。
*/

const SkillTree_LayoutExPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

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

const typeDefine = {
    OpenedImage: {},
    BackgroundImage: {
        BackgroundImage2: [{}]
    },
};
const params = PluginParamsParser.parse(PluginManager.parameters(SkillTree_LayoutExPluginName), typeDefine);

const OpenedImage = params.OpenedImage;
const BackgroundImage = params.BackgroundImage;
const ChangeOpenedTextColor = params.ChangeOpenedTextColor;
const IconXOfs = params.IconXOfs;
const IconFontSize = params.IconFontSize;

const skillTreeParams = PluginParamsParser.parse(PluginManager.parameters(SkillTreePluginName), {});
const IconWidth = skillTreeParams.IconWidth;
const IconHeight = skillTreeParams.IconHeight;
const ViewRectColor = skillTreeParams.ViewRectColor;
const ViewRectOfs = skillTreeParams.ViewRectOfs;

const SkillTreeNodeInfo = SkillTreeClassAlias.SkillTreeNodeInfo;
const SkillTreeNode = SkillTreeClassAlias.SkillTreeNode;
const SkillTreeTopNode = SkillTreeClassAlias.SkillTreeTopNode;
const SkillDataType = SkillTreeClassAlias.SkillDataType;
const SkillTreeMapLoader = SkillTreeClassAlias.SkillTreeMapLoader;
const SkillTreeConfigLoadError = SkillTreeClassAlias.SkillTreeConfigLoadError;
const SkillTreeConfigLoader = SkillTreeClassAlias.SkillTreeConfigLoader;
const SkillTreeData = SkillTreeClassAlias.SkillTreeData;
const SkillTreeManager = SkillTreeClassAlias.SkillTreeManager;
const Scene_SkillTree = SkillTreeClassAlias.Scene_SkillTree;
const Window_TypeSelect = SkillTreeClassAlias.Window_TypeSelect;
const Window_ActorInfo = SkillTreeClassAlias.Window_ActorInfo;
const Window_SkillTreeNodeInfo = SkillTreeClassAlias.Window_SkillTreeNodeInfo;
const Window_SkillTree = SkillTreeClassAlias.Window_SkillTree;
const Window_NodeOpen = SkillTreeClassAlias.Window_NodeOpen;
const SkillTreeView = SkillTreeClassAlias.SkillTreeView;

const _Scene_SkillTree_isReady = Scene_SkillTree.prototype.isReady;
Scene_SkillTree.prototype.isReady = function() {
    if (!_Scene_SkillTree_isReady.call(this)) return false;
    if (OpenedImage.FileName) {
        const openedImage = ImageManager.loadBitmap("img/", OpenedImage.FileName);
        if (!openedImage.isReady()) return false;
    }
    if (BackgroundImage.FileName) {
        const backgroundImage1 = ImageManager.loadBitmap("img/", BackgroundImage.FileName);
        if (!backgroundImage1.isReady()) return false;
    }
    for (const img2 of BackgroundImage.BackgroundImage2) {
        if (img2.FileName) {
            const backgroundImage2 = ImageManager.loadBitmap("img/", img2.FileName);
            if (!backgroundImage2.isReady()) return false;
        }
    }
    return true;
};

SkillTreeNodeInfo.prototype.iconBitmap = function(opened) {
    if (this._iconData[0] === "img") {
        return ImageManager.loadPicture(this._iconData[1]);
    } else if (this._iconData[0] === "icon") {
        let iconIndex;
        if (this._iconData.length >= 2) {
            iconIndex = this._iconData[1];
        } else {
            iconIndex = this.skill().iconIndex;
        }
        return this.trimIconset(iconIndex);
    } else if (this._iconData[0] === "icon_ex") {
        return this.iconExBitmap(opened);
    }
    throw new Error(`Unknown ${this._iconData[0]}`);
};

SkillTreeNodeInfo.prototype.iconExBitmap = function(opened) {
    let iconIndex;
    if (this._iconData.length >= 3) {
        iconIndex = this._iconData[2];
    } else {
        iconIndex = this.skill().iconIndex;
    }
    const iconBitmap = this.trimIconset(iconIndex);
    const dstBitmap = new Bitmap(IconWidth, IconHeight);
    const dx = IconXOfs;
    let dy = (IconHeight - 32) / 2;
    if (IconHeight % 2 !== 0) dy -= 1;
    if (this._iconData.length >= 2 && this._iconData[1]) {
        if (typeof this._iconData[1] === "string") {
            const backBitmap = ImageManager.loadPicture(this._iconData[1]);
            if (!backBitmap.isReady()) return backBitmap;
            dstBitmap.blt(backBitmap, 0, 0, IconWidth, IconHeight, 0, 0);
        } else {
            const backBitmap = ImageManager.loadPicture(this._iconData[1][0]);
            if (!backBitmap.isReady()) return backBitmap;
            const x = this._iconData[1][1] * IconWidth;
            const y = this._iconData[1][2] * IconHeight;
            dstBitmap.blt(backBitmap, x, y, IconWidth, IconHeight, 0, 0);
        }
    }
    dstBitmap.blt(iconBitmap, 0, 0, 32, 32, dx, dy);
    const textWidth = IconWidth - 32 - dx - IconXOfs;
    if (Utils.RPGMAKER_NAME === "MZ") {
        dstBitmap.fontFace = $gameSystem.mainFontFace();
    }
    dstBitmap.fontSize = IconFontSize;
    const iconTextSpace = 5;
    if (ChangeOpenedTextColor && opened) {
        const tmpTextColor = dstBitmap.textColor;
        dstBitmap.textColor = this.crisisColor();
        dstBitmap.drawText(this.skill().name, 32 + dx + iconTextSpace, dy, textWidth, 32, "left");
        dstBitmap.textColor = tmpTextColor;
    } else {
        dstBitmap.drawText(this.skill().name, 32 + dx + iconTextSpace, dy, textWidth, 32, "left");
    }
    return dstBitmap;
};

SkillTreeNodeInfo.prototype.crisisColor = function() {
    if (Utils.RPGMAKER_NAME === "MZ") return ColorManager.crisisColor();
    const dummyWindow = new Window_Base(0, 0, 0, 0);
    return dummyWindow.crisisColor();
}

SkillTreeNode.prototype.iconBitmap = function() {
    return this._info.iconBitmap(this.isOpened());
}

SkillTreeView.prototype.viewDrawNode = function(bitmap) {
    for (const node of Object.values(this._skillTreeManager.getAllNodes())) {
        let [px, py] = SkillTreeView.getPixelXY(node.point);
        if (node.isSelectable()) {
            this.drawIcon(bitmap, node.iconBitmap(), px, py);
        } else {
            this.drawIcon(bitmap, node.iconBitmap(), px, py, 96);
        }
        if (node.isOpened()) {
            if (OpenedImage.EnableOpenedImage) {
                const x = px + OpenedImage.XOfs;
                const y = py + OpenedImage.YOfs;
                const openedImage = ImageManager.loadBitmap("img/", OpenedImage.FileName);
                bitmap.blt(openedImage, 0, 0, openedImage.width, openedImage.height, x, y);
            } else {
                const x = px - ViewRectOfs;
                const y = py - ViewRectOfs;
                const width = IconWidth + ViewRectOfs * 2;
                const height = IconHeight + ViewRectOfs * 2;
                this.drawRect(bitmap, ViewRectColor, x, y, width, height);
            }
        }
    }
}

SkillTreeConfigLoader.prototype.loadTypes = function(actorId) {
    let cfgTypes = null;
    let typesArray = [];
    for (let cfg of this._configData.skillTreeTypes) {
        if (cfg.actorId === actorId) {
            cfgTypes = cfg.types;
            break;
        }
    }
    if (!cfgTypes) throw new SkillTreeConfigLoadError(`Missing types from actorId:${actorId}`);
    for (let cfgType of cfgTypes) {
        const enabled = (cfgType.length === 3 ? true : cfgType[3]);
        const type = new SkillDataType(cfgType[0], actorId, cfgType[1], cfgType[2], enabled);
        type.setIconIndex(cfgType[4] ? cfgType[4] : null);
        typesArray.push(type);
    }
    return typesArray;
};

SkillDataType.prototype.setIconIndex = function(iconIndex) {
    this._iconIndex = iconIndex;
};

SkillDataType.prototype.iconIndex = function() {
    return this._iconIndex;
};

Window_TypeSelect.prototype.drawItem = function(index) {
    let rect;
    if (Utils.RPGMAKER_NAME === "MZ") {
        rect = this.itemLineRect(index);
    } else {
        rect = this.itemRectForText(index);
    }
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    const iconIndex = this._types[index].iconIndex();
    if (iconIndex) {
        this.drawItemName({ name: this.commandName(index), iconIndex: iconIndex }, rect.x, rect.y);
    } else {
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, this.itemTextAlign());
    }
};

Scene_SkillTree.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    if (BackgroundImage.FileName) {
        const bitmap1 = ImageManager.loadBitmap("img/", BackgroundImage.FileName);
        this._backgroundSprite.bitmap = bitmap1;
        const sprite = new Sprite();
        sprite.x = BackgroundImage.BackgroundImage2XOfs;
        sprite.y = BackgroundImage.BackgroundImage2YOfs;
        this._backgroundSprite.addChild(sprite);
        this._backgroundSprite2 = sprite;
        this.addChild(this._backgroundSprite);
    } else {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this.addChild(this._backgroundSprite);
        this.setBackgroundOpacity(192);
    }
};

Scene_SkillTree.prototype.getBackgroundImage2 = function(actorId) {
    const img2 = BackgroundImage.BackgroundImage2.find(img2 => img2.ActorId === actorId);
    if (img2) return ImageManager.loadBitmap("img/", img2.FileName);
    return null;
};

const _Scene_SkillTree_updateActor = Scene_SkillTree.prototype.updateActor;
Scene_SkillTree.prototype.updateActor = function() {
    _Scene_SkillTree_updateActor.call(this);
    this.updateBackgroundImage2();
};

Scene_SkillTree.prototype.updateBackgroundImage2 = function() {
    if (!this._backgroundSprite2) return;
    const backgroundImage2 = this.getBackgroundImage2($gameParty.menuActor().actorId());
    if (backgroundImage2) this._backgroundSprite2.bitmap = backgroundImage2;
};

})();
