/*:
@target MZ
@plugindesc リングコマンドメニュー v1.1.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/RingCommandMenu.js
@help
リングコマンドメニューを導入するプラグインです。

【使用方法】
基本的に導入するだけで使用できますが、プラグインパラメータ「MainMenuCommands」を編集することで
よりリングコマンドをカスタマイズすることができます。

■メインメニューコマンドの編集について
メインメニューコマンドに一覧に表示するコマンドを登録します。

■コマンドタイプについて
コマンドタイプではコマンドをどのように扱うかを指定します。
これを設定することでコマンド実行前にアクターの選択を行うか、またはサブコマンドの一覧を開くかを設定することができます。
normal: シーンを開く
selectActor: アクターを選択してからシーンを開く
subMenu: サブコマンドの一覧を開く


【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@param MainMenuCommands
@text メインメニューコマンド
@type struct<MenuCommand>[]
@default ["{\"CommandType\":\"normal\",\"Text\":\"アイテム\",\"IconIndex\":\"208\",\"Image\":\"\",\"Script\":\"SceneManager.push(Scene_Item);\",\"SubMenuCommands\":\"\"}","{\"CommandType\":\"selectActor\",\"Text\":\"スキル\",\"IconIndex\":\"79\",\"Image\":\"\",\"Script\":\"SceneManager.push(Scene_Skill);\",\"SubMenuCommands\":\"\"}","{\"CommandType\":\"selectActor\",\"Text\":\"装備\",\"IconIndex\":\"96\",\"Image\":\"\",\"Script\":\"SceneManager.push(Scene_Equip);\",\"SubMenuCommands\":\"\"}","{\"CommandType\":\"selectActor\",\"Text\":\"ステータス\",\"IconIndex\":\"89\",\"Image\":\"\",\"Script\":\"SceneManager.push(Scene_Status);\",\"SubMenuCommands\":\"\"}","{\"CommandType\":\"normal\",\"Text\":\"オプション\",\"IconIndex\":\"129\",\"Image\":\"\",\"Script\":\"SceneManager.push(Scene_Options);\",\"SubMenuCommands\":\"\"}","{\"CommandType\":\"normal\",\"Text\":\"セーブ\",\"IconIndex\":\"121\",\"Image\":\"\",\"Script\":\"SceneManager.push(Scene_Save);\",\"SubMenuCommands\":\"\"}","{\"CommandType\":\"normal\",\"Text\":\"ゲーム終了\",\"IconIndex\":\"75\",\"Image\":\"\",\"Script\":\"SceneManager.push(Scene_GameEnd);\",\"SubMenuCommands\":\"\"}"]
@desc
メインメニューに表示するコマンドの一覧を指定します。

@param SelectActorCommands
@text アクター選択コマンド
@type struct<SelectActorCommand>[]
@default []
@desc
アクター選択のアクターコマンドを指定します。

@param OpenSe
@text 開始SE
@type struct<SE>
@default {"FileName":"Magic1","Volume":"90","Pitch":"100","Pan":"0"}
@desc
リングコマンドメニューを開始するときのSEを指定します。

@param CloseSe
@text 終了SE
@type struct<SE>
@default {"FileName":"Magic2","Volume":"90","Pitch":"100","Pan":"0"}
@desc
リングコマンドメニューを終了するときのSEを指定します。

@param BackGroundOpacity
@text 背景不透明度
@type number
@default 192
@desc
リングコマンドメニューの背景の不透明度を指定します。

@param InOutSpeed
@text 開閉スピード
@type number
@default 8
@desc
リングコマンドの開閉スピードを指定します。

@param RotationSpeed
@text 回転スピード
@type number
@default 11
@desc
リングコマンドの回転スピードを指定します。

@param StartFar
@text 開始距離
@type number
@default 300
@desc
リングコマンドのオープン開始距離を指定します。

@param EndFar
@text 終了距離
@type number
@default 70
@desc
リングコマンドのオープン終了距離を指定します。
*/

/*~struct~MenuCommand:
@param CommandType
@text コマンドタイプ
@type string
@default normal
@desc
コマンドの用途(normal, selectActor, subMenu)を指定します。

@param Text
@text テキスト
@type string
@desc
メニューに表示するテキストを指定します。

@param IconIndex
@text アイコン番号
@type number
@default 0
@desc
リングコマンドのアイコン番号を指定します。

@param Image
@text 画像
@type file
@dir img/pictures
@desc
リングコマンドの画像を指定します。

@param Script
@text スクリプト
@type multiline_string
@desc
リングコマンド選択時に実行するスクリプトを記述します。

@param SubMenuCommands
@text サブメニューコマンド
@type struct<MenuCommand>[]
@desc
サブメニューとして表示するコマンドの一覧を指定します。
*/

/*~struct~SE:
@param FileName
@type file
@dir audio/se
@desc
再生するSEのファイル名を指定します。

@param Volume
@type number
@default 90
@desc
再生するSEのvolumeを指定します。

@param Pitch
@type number
@default 100
@desc
再生するSEのpitchを指定します。

@param Pan
@type number
@default 0
@desc
再生するSEのpanを指定します。
*/


/*~struct~SelectActorCommand:
@param ActorId
@text アクターID
@type actor
@desc
アクター選択用のアクターIDを指定します。

@param Image
@text 画像
@type file
@dir img/pictures
@desc
アクター選択用のアクターの画像を指定します。
*/

const RingCommandMenuPluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];

const RingCommandMenuClassAlias = (() => {
"use strict";

const RING_COMMAND_OFFSET_Y = -32;

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


// MV Compatible
if (Utils.RPGMAKER_NAME === "MV") {
    TouchInput._onMouseMove = function(event) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (this._mousePressed) {
            this._onMove(x, y);
        } else if (Graphics.isInsideCanvas(x, y)) {
            this._onHover(x, y);
        }
    };

    TouchInput._onHover = function(x, y) {
        this._events.hovered = true;
        this._x = x;
        this._y = y;
    };

    const _TouchInput_update = TouchInput.update;
    TouchInput.update = function() {
        _TouchInput_update.call(this);
        this._hovered = this._events.hovered;
        this._events.hovered = false;
    };

    TouchInput.isHovered = function() {
        return this._hovered;
    };


    var Sprite_ClickableMV = function() {
        this.initialize(...arguments);
    };

    Sprite_ClickableMV.prototype = Object.create(Sprite_Base.prototype);
    Sprite_ClickableMV.prototype.constructor = Sprite_ClickableMV;

    Sprite_ClickableMV.prototype.initialize = function() {
        Sprite_Base.prototype.initialize.call(this);
        this._pressed = false;
        this._hovered = false;
    };

    Sprite_ClickableMV.prototype.update = function() {
        Sprite_Base.prototype.update.call(this);
        this.processTouch();
    };

    Sprite_ClickableMV.prototype.processTouch = function() {
        if (this.isClickEnabled()) {
            if (this.isBeingTouched()) {
                if (!this._hovered && TouchInput.isHovered()) {
                    this._hovered = true;
                    this.onMouseEnter();
                }
                if (TouchInput.isTriggered()) {
                    this._pressed = true;
                    this.onPress();
                }
            } else {
                if (this._hovered) {
                    this.onMouseExit();
                }
                this._pressed = false;
                this._hovered = false;
            }
            if (this._pressed && TouchInput.isReleased()) {
                this._pressed = false;
                this.onClick();
            }
        } else {
            this._pressed = false;
            this._hovered = false;
        }
    };

    Sprite_ClickableMV.prototype.isPressed = function() {
        return this._pressed;
    };

    Sprite_ClickableMV.prototype.isClickEnabled = function() {
        return this.worldVisible;
    };

    Sprite_ClickableMV.prototype.isBeingTouched = function() {
        const touchPos = new Point(TouchInput.x, TouchInput.y);
        const localPos = this.worldTransform.applyInverse(touchPos);
        return this.hitTest(localPos.x, localPos.y);
    };

    Sprite_ClickableMV.prototype.hitTest = function(x, y) {
        const rect = new Rectangle(
            -this.anchor.x * this.width,
            -this.anchor.y * this.height,
            this.width,
            this.height
        );
        return rect.contains(x, y);
    };

    Sprite_ClickableMV.prototype.onMouseEnter = function() {
        //
    };

    Sprite_ClickableMV.prototype.onMouseExit = function() {
        //
    };

    Sprite_ClickableMV.prototype.onPress = function() {
        //
    };

    Sprite_ClickableMV.prototype.onClick = function() {
        //
    };
}

let SpriteMVMZ;
let Sprite_ClickableMVMZ;
if (Utils.RPGMAKER_NAME === "MZ") {
    SpriteMVMZ = Sprite;
    Sprite_ClickableMVMZ = Sprite_Clickable;
} else {
    SpriteMVMZ = Sprite_Base;
    Sprite_ClickableMVMZ = Sprite_ClickableMV;
}


const typeDefine = {
    MainMenuCommands: [{}],
    OpenSe: {},
    CloseSe: {},
    SelectActorCommands: [{}],
};
const PP = PluginParamsParser.parse(PluginManager.parameters(RingCommandMenuPluginName), typeDefine);

const $ringCommnadDatas = [];

class RingCommandData {
    get commandType() { return this._commandType; }
    get text() { return this._text; }
    get iconIndex() { return this._iconIndex; }
    get image() { return this._image; }
    get script() { return this._script; }
    get subCommands() { return this._subCommands; }
    get internalIndex() { return this._internalIndex; }

    static fromParam(param, internalIndex) {
        if (param.CommandType === "subMenu") {
            const subCommands = JSON.parse(param.SubMenuCommands).map((strSubMenuCommandParam, i) => {
                if (strSubMenuCommandParam === "") return null;
                const subMenuCommandParam = PluginParamsParser.parse(JSON.parse(strSubMenuCommandParam), {});
                return RingCommandData.fromParam(subMenuCommandParam, i);
            }).filter(command => !!command);
            return new this(param.CommandType, param.Text, param.IconIndex, param.Image, param.Script, subCommands, internalIndex);
        } else {
            return new this(param.CommandType, param.Text, param.IconIndex, param.Image, param.Script, null, internalIndex);
        }
    }

    constructor(commandType, text, iconIndex, image, script, subCommands, internalIndex) {
        this._commandType = commandType;
        this._text = text;
        this._iconIndex = iconIndex;
        this._image = image;
        this._script = script;
        this._subCommands = subCommands;
        this._internalIndex = internalIndex;
    }
}

PP.MainMenuCommands.forEach((param, i) => {
    const data = RingCommandData.fromParam(param, i++);
    $ringCommnadDatas.push(data);
});


Game_Temp.prototype.setRingCommandManager = function(manager) {
    this._ringCommandManager = manager;
};

Game_Temp.prototype.ringCommandManager = function() {
    return this._ringCommandManager;
};


class Sprite_RingCommand extends Sprite_ClickableMVMZ {
    get rotateSpeed() { return this._rotateSpeed; }
    set rotateSpeed(_rotateSpeed) { this._rotateSpeed = _rotateSpeed; }

    get homeX() { return this._homeX; }
    set homeX(_homeX) { this._homeX = _homeX; }

    get homeY() { return this._homeY; }
    set homeY(_homeY) { this._homeY = _homeY; }

    get deg() { return this._deg; }
    set deg(_deg) {
        this._deg = this.degNormalization(_deg);
        this.move(this._deg, this._far);
    }

    get far() { return this._far; }
    set far(_far) {
        this._far = _far;
        this.move(this._deg, this._far);
    }

    get data() { return this._data; }

    initialize(homeX, homeY, data, opt = { mouseEnterCbk: null, mouseExitCbk: null, clickCbk: null }) {
        super.initialize();
        this._homeX = homeX;
        this._homeY = homeY;
        this._data = data;
        this._mouseEnterCbk = opt.mouseEnterCbk;
        this._mouseExitCbk = opt.mouseExitCbk;
        this._clickCbk = opt.clickCbk;
        this._deg = 0;
        this._degPlused = 0;
        this._baseDeg = 0;
        this._far = 0;
        this._targetDegPlus = null;
        this._rotateSpeed = 4;
        this._rotateWay = 1;
        this.move(0, 0);
        this.bitmap = new Bitmap(32, 32);
        this.createBitmap(data);
        this.hide();
    }

    createBitmap(data) {
        if (data.image) {
            this.bitmap = ImageManager.loadPicture(data.image);
        } else {
            if (data.commandType === "actorData") {
                this.createActorIcon($gameParty.members()[data.internalIndex]);
            } else {
                const iconIndex = data.iconIndex;
                this.bitmap = this.trimIconset(iconIndex);
            }
        }
    }

    trimIconset(iconIndex) {
        const srcBitmap = ImageManager.loadSystem("IconSet");
        const dstBitmap = new Bitmap(32, 32);
        const sx = iconIndex % 16 * 32;
        const sy = Math.floor(iconIndex / 16) * 32;
        dstBitmap.blt(srcBitmap, sx, sy, 32, 32, 0, 0);
        return dstBitmap;
    }

    createActorIcon(actor) {
        this._actor = actor;
        this.updateActorImage();
    }

    updateActorImage() {
        if (!this._actor) return;
        const characterName = this._actor.characterName();
        const characterIndex = this._actor.characterIndex();
        const characterBitmap = ImageManager.loadCharacter(characterName);
        if (!characterBitmap.isReady()) return;
        const dstBitmap = new Bitmap(48, 32);
        this.actorImageDrawCharacter(dstBitmap, characterBitmap, characterName, characterIndex);
        this.bitmap = dstBitmap;
    }

    actorImageDrawCharacter(dstBitmap, characterBitmap, characterName, characterIndex) {
        const big = ImageManager.isBigCharacter(characterName);
        const pw = characterBitmap.width / (big ? 3 : 12);
        const ph = characterBitmap.height / (big ? 4 : 8);
        const n = big ? 0: characterIndex;
        const sx = ((n % 4) * 3 + 1) * pw;
        const sy = Math.floor(n / 4) * 4 * ph;
        dstBitmap.blt(characterBitmap, sx, sy, pw, ph, 0, 0);
    }

    update() {
        super.update();
        if (this._targetDegPlus != null) this.updateRotation();
    }

    updateRotation() {
        this._degPlused += this._rotateSpeed * this._rotateWay;
        let isEnd;
        if (this._rotateWay > 0) {
            isEnd = this._degPlused >= this._targetDegPlus;
        } else {
            isEnd = this._degPlused <= this._targetDegPlus;
        }
        if (isEnd) {
            this._deg = this.degNormalization(this._baseDeg + this._targetDegPlus);
            this._targetDegPlus = null;
        } else {
            this._deg = this.degNormalization(this._baseDeg + this._degPlused);
        }
        this.move(this._deg, this._far);
    }

    isBusy() {
        return !!this._targetDegPlus;
    }

    // way: "left" or "right"
    startRotationAbs(absDeg, way) {
        let degPlus = 0;
        if (way === "left") {
            if (absDeg > this._deg) {
                degPlus = absDeg - this._deg;
            } else if (absDeg < this._deg) {
                degPlus = 360 - this._deg + absDeg;
            }
        } else if (way === "right") {
            if (this._deg > absDeg) {
                degPlus = absDeg - this._deg;
            } else if (this._deg < absDeg) {
                degPlus = -(this._deg + 360 - absDeg);
            }
        }
        this.startRotation(degPlus);
    }

    startRotation(degPlus) {
        this._targetDegPlus = degPlus;
        this._degPlused = 0;
        this._baseDeg = this._deg;
        if (degPlus > 0) {
            this._rotateWay = 1;
        } else {
            this._rotateWay = -1;
        }
    }

    stopRotation() {
        this._rotateWay = null;
        this._targetDegPlus = null;
    }

    move(deg, far) {
        const rad = this.deg2rad(deg);
        const disX = Math.round(far * Math.cos(rad));
        const disY = Math.round(far * Math.sin(rad));
        this.x = this._homeX + disX;
        this.y = this._homeY + disY;
    }

    rad2deg(rad) {
        return (rad * 180 / Math.PI) + 90;
    }

    deg2rad(deg) {
        return (deg - 90) * Math.PI / 180;
    }

    degNormalization(deg) {
        if (deg >= 360) deg = deg % 360;
        if (deg < 0) {
            let rdeg = -deg;
            if (rdeg > 360) rdeg = rdeg % 360;
            deg = 360 - rdeg;
        }
        return deg;
    }

    onMouseEnter() {
        if (this._mouseEnterCbk && !this.isBusy()) this._mouseEnterCbk(this);
    }

    onMouseExit() {
        if (this._mouseExitCbk && !this.isBusy()) this._mouseExitCbk(this);
    }

    onClick() {
        if (this._clickCbk && !this.isBusy()) this._clickCbk(this);
    }
}


class RingCommandSpriteController {
    constructor() {
        this._sprites = null;
        this._baseSprite = null;
        this._baseMinFar = PP.EndFar;
        this._baseMaxFar = PP.StartFar;
        this._minFar = this._baseMinFar;
        this._maxFar = this._baseMaxFar;
        this._baseRotateSpeed = PP.RotationSpeed;
        this._inOutSpeed = PP.InOutSpeed;
        this._rotateSpeed = this._baseRotateSpeed;
        this._state = "none";
        this._currentIndex = 0;
        this._startDeg = 0;
        this._marginFar = 0;
    }

    reset(sprites, index) {
        this._sprites = sprites;
        this._baseSprite = this._sprites[index];
        this._rotateSpeed = this._baseRotateSpeed;
        this._state = "none";
        this._currentIndex = index;
    }

    startOutCenter() {
        this.startRotation("outCenter", this._baseMinFar, this._baseMaxFar, this._baseMinFar, false);
    }

    startInCenter() {
        this.startRotation("inCenter", this._baseMinFar, this._baseMaxFar, this._baseMaxFar, true);
    }

    startOutCenter2() {
        this.startRotation("outCenter", 0, this._baseMinFar, 0, true);
    }

    startInCenter2() {
        this.startRotation("inCenter", 0, this._baseMinFar, this._baseMinFar, false);
    }

    startRotation(changeState, minFar, maxFar, startFar, lastCycleSync) {
        this._state = changeState;
        this._minFar = minFar;
        this._maxFar = maxFar;
        this._lastCycled = false;
        this._lastCycleSync = lastCycleSync;
        this._sprites.forEach((sprite, i) => {
            sprite.deg = this.calcIndexDeg(i);
            sprite.far = startFar;
        });
    }

    update() {
        switch (this._state) {
        case "outCenter":
            this.updateOutCenter();
            break;
        case "inCenter":
            this.updateInCenter();
            break;
        case "changeIndex":
            this.updateChangeIndex();
            break;
        }
    }

    isBusy() {
        return this._state != "none";
    }

    calcIndexDeg(index) {
        const space = 360 / this._sprites.length;
        const deg = space * index;
        return deg;
    }

    calcRelativeIndexDeg(index) {
        let relIndex = index - this._currentIndex;
        if (relIndex >= this._sprites.length) {
            relIndex = relIndex - this._sprites.length;
        }
        return this.calcIndexDeg(relIndex);
    }

    updateOutCenter() {
        if (this._baseSprite.far >= this._maxFar - this._marginFar) {
            if (this._lastCycled) {
                if (this._lastCycleSync) {
                    if (!this._baseSprite.isBusy()) {
                        this._state = "none";
                    }
                } else {
                    this._state = "none";
                }
            } else {
                this._lastCycled = true;
                if (this._baseSprite.deg > 0) {
                    const rotationDeg = 360 - this._baseSprite.deg;
                    this._sprites.forEach((sprite, i) => {
                        sprite.startRotation(rotationDeg);
                        sprite.far = this._maxFar;
                    });
                }
            }
        } else {
            if (!this._baseSprite.isBusy()) {
                const speedPer = (this._baseSprite.far - this._minFar) / (this._maxFar - this._minFar);
                for (const sprite of this._sprites) {
                    sprite.rotateSpeed = this._baseRotateSpeed - (this._baseRotateSpeed / 2) * speedPer;
                    sprite.startRotation(360);
                }
            }
            for (const sprite of this._sprites) {
                if (this._baseSprite.far < this._maxFar) {
                    sprite.far += this._inOutSpeed;
                } else {
                    sprite.far = this._maxFar;
                }
            }
        }
    }

    updateInCenter() {
        if (this._baseSprite.far <= this._minFar + this._marginFar) {
            if (this._lastCycled) {
                if (this._lastCycleSync) {
                    if (!this._baseSprite.isBusy()) {
                        this._state = "none";
                    }
                } else {
                    this._state = "none";
                }
            } else {
                this._lastCycled = true;
                if (this._baseSprite.deg > 0) {
                    const rotationDeg = 360 - this._baseSprite.deg;
                    this._sprites.forEach((sprite, i) => {
                        sprite.startRotation(rotationDeg);
                        sprite.far = this._minFar;
                    });
                }
            }
        } else {
            if (!this._baseSprite.isBusy()) {
                const speedPer = (this._baseSprite.far - this._minFar) / (this._maxFar - this._minFar);
                this._sprites.forEach((sprite, i) => {
                    sprite.rotateSpeed = (this._baseRotateSpeed / 2) + (this._baseRotateSpeed / 2) * speedPer;
                    sprite.startRotation(360);
                });
            }
            for (const sprite of this._sprites) {
                if (this._baseSprite.far > this._minFar) {
                    sprite.far -= this._inOutSpeed;
                } else {
                    sprite.far = this._minFar;
                }
            }
        }
    }

    startChangeNextCommand() {
        let index = this._currentIndex + 1;
        let rotationDeg;
        if (index >= this._sprites.length) {
            index = index - this._sprites.length;
            rotationDeg = this.calcIndexDeg(1);
        } else {
            rotationDeg = this.calcRelativeIndexDeg(index);
        }
        this.startChangeCommand(index, rotationDeg);
    }

    startChangePrevCommand() {
        let index = this._currentIndex - 1;
        let rotationDeg;
        if (index < 0) {
            index = this._sprites.length + index;
            rotationDeg = -this.calcIndexDeg(1);
        } else {
            rotationDeg = this.calcRelativeIndexDeg(index);
        }
        this.startChangeCommand(index, rotationDeg);
    }

    startChangeCommand(targetIndex, rotationDeg) {
        this._baseSprite = this._sprites[this._currentIndex];
        for (const sprite of this._sprites) {
            sprite.startRotation(rotationDeg);
        }
        this._currentIndex = targetIndex;
        this._state = "changeIndex";
    }

    updateChangeIndex() {
        const busySprite = this._sprites.find(sprite => sprite.isBusy());
        if (!busySprite) {
            this._state = "none";
        }
    }
}


class Sprite_RingCommandLabel extends SpriteMVMZ {
    static get LABEL_WIDTH() { return 120; }
    static get LABEL_HEIGHT() { return 32; }

    initialize() {
        super.initialize();
        this.x = 0;
        this.y = 0;
        this.bitmap = new Bitmap(Sprite_RingCommandLabel.LABEL_WIDTH, Sprite_RingCommandLabel.LABEL_HEIGHT);
        if (Utils.RPGMAKER_NAME === "MZ") {
            this.bitmap.fontFace = $gameSystem.mainFontFace();
        }
        this.bitmap.fontSize = 24;
        this._labelWidth = 0;
        this.hide();
    }

    setLabel(labelText) {
        this._labelWidth = this.bitmap.measureTextWidth(labelText);
        this.bitmap.clear();
        this.bitmap.drawText(labelText, 0, 0, this.width, this.height, "left");
    }

    labelWidth() {
        return this._labelWidth;
    }
}


class Sprite_RingCommandCursor extends SpriteMVMZ {
    static get PADDING() { return 4; }

    initialize(ringCommandSpriteWidth, ringCommandSpriteHeight) {
        super.initialize();
        this._createCursorSprite();
        const cursorWidth = ringCommandSpriteWidth + Sprite_RingCommandCursor.PADDING * 2;
        const cursorHeight = ringCommandSpriteHeight + Sprite_RingCommandCursor.PADDING * 2;
        this._cursorRect = new Rectangle(0, 0, cursorWidth, cursorHeight);
        this.contentsOpacity = 255;
        this.cursorVisible = true;
        this.active = true;
        this._animationCount = 0;
        this._refreshCursor();
        this.loadWindowskin();
        this.hide();
    }

    update() {
        super.update();
        if (this.visible) {
            this._animationCount++;
            this._updateCursor();
        }
    }

    show() {
        super.show();
        for (const child of this.children) {
            child.show();
        }
    }

    hide() {
        super.hide();
        for (const child of this.children) {
            child.hide();
        }
    }

    loadWindowskin() {
        this._windowskin = ImageManager.loadSystem("Window");
        this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));
    }

    _onWindowskinLoad() {
        this._refreshCursor();
    }

    _createCursorSprite() {
        for (let i = 0; i < 9; i++) {
            this.addChild(new SpriteMVMZ());
        }
    }

    _refreshCursor() {
        const drect = this._cursorRect.clone();
        const srect = { x: 96, y: 96, width: 32, height: 32 };
        const m = 4;
        for (const child of this.children) {
            child.bitmap = this._windowskin;
        }
        this._setRectPartsGeometry(this, srect, drect, m);
    }

    _setRectPartsGeometry(sprite, srect, drect, m) {
        const sx = srect.x;
        const sy = srect.y;
        const sw = srect.width;
        const sh = srect.height;
        const dx = drect.x;
        const dy = drect.y;
        const dw = drect.width;
        const dh = drect.height;
        const smw = sw - m * 2;
        const smh = sh - m * 2;
        const dmw = dw - m * 2;
        const dmh = dh - m * 2;
        const children = sprite.children;
        sprite.setFrame(0, 0, dw, dh);
        sprite.move(dx, dy);
        // corner
        children[0].setFrame(sx, sy, m, m);
        children[1].setFrame(sx + sw - m, sy, m, m);
        children[2].setFrame(sx, sy + sw - m, m, m);
        children[3].setFrame(sx + sw - m, sy + sw - m, m, m);
        children[0].move(0, 0);
        children[1].move(dw - m, 0);
        children[2].move(0, dh - m);
        children[3].move(dw - m, dh - m);
        // edge
        children[4].move(m, 0);
        children[5].move(m, dh - m);
        children[6].move(0, m);
        children[7].move(dw - m, m);
        children[4].setFrame(sx + m, sy, smw, m);
        children[5].setFrame(sx + m, sy + sw - m, smw, m);
        children[6].setFrame(sx, sy + m, m, smh);
        children[7].setFrame(sx + sw - m, sy + m, m, smh);
        children[4].scale.x = dmw / smw;
        children[5].scale.x = dmw / smw;
        children[6].scale.y = dmh / smh;
        children[7].scale.y = dmh / smh;
        // center
        if (children[8]) {
            children[8].setFrame(sx + m, sy + m, smw, smh);
            children[8].move(m, m);
            children[8].scale.x = dmw / smw;
            children[8].scale.y = dmh / smh;
        }
        for (const child of children) {
            child.visible = dw > 0 && dh > 0;
        }
    }

    _updateCursor() {
        this.alpha = this._makeCursorAlpha();
        this.visible = this.cursorVisible;
        this._cursorRect.x = this.x;
        this._cursorRect.y = this.y;
    }

    _makeCursorAlpha() {
        const blinkCount = this._animationCount % 40;
        const baseAlpha = this.contentsOpacity / 255;
        if (this.active) {
            if (blinkCount < 20) {
                return baseAlpha - blinkCount / 32;
            } else {
                return baseAlpha - (40 - blinkCount) / 32;
            }
        }
        return baseAlpha;
    }
}


class RingCommandDataStatus {
    constructor(datas) {
        this._datas = datas;
        this._index = 0;
    }

    datas() {
        return this._datas;
    }

    index() {
        return this._index;
    }

    setIndex(index) {
        this._index = index;
    }

    currentData() {
        return this._datas[this._index];
    }

    next() {
        if (this._index >= this._datas.length - 1) {
            this._index = 0;
        } else {
            this._index++;
        }
    }

    prev() {
        if (this._index <= 0) {
            this._index = this._datas.length - 1;
        } else {
            this._index--;
        }
    }

    getDataIndex(data) {
        if (data.commandType === "actorData") {
            return data.internalIndex;
        } else {
            return this._datas.indexOf(data);
        }
    }
}


class RingCommandManager {
    constructor() {
        this._cursorMoveFrame = 0;
        this._maxCursorMoveFrame = 8;
        this._holdDataStatus = [];
    }

    hasHoldDatas() {
        return this._holdDataStatus.length > 0;
    }

    addDatas(datas) {
        this._holdDataStatus.push(new RingCommandDataStatus(datas, 0));
    }

    backDatas() {
        this._holdDataStatus.pop();
    }

    lastDataStatus() {
        return this._holdDataStatus[this._holdDataStatus.length - 1];
    }

    update() {
        if (this._cursorMoveFrame > 0) this._cursorMoveFrame--;
    }

    execCommand(data) {
        const commandType = data.commandType;
        switch (commandType) {
        case "actorData":
            const actor = $gameParty.members()[data.internalIndex];
            $gameParty.setMenuActor(actor);
            const subjectData = this._holdDataStatus[this._holdDataStatus.length - 2].currentData();
            eval(subjectData.script);
            break;
        case "normal":
            eval(data.script);
            break;
        }
        return commandType;
    }

    inputCancelKey() {
        this.backDatas();
    }

    inputLeftKey() {
        if (this._cursorMoveFrame === 0) {
            this._cursorMoveFrame = this._maxCursorMoveFrame;
            this.lastDataStatus().next();
            return true;
        }
        return false;
    }

    inputRightKey() {
        if (this._cursorMoveFrame === 0) {
            this._cursorMoveFrame = this._maxCursorMoveFrame;
            this.lastDataStatus().prev();
            return true;
        }
        return false;
    }

    inputOkKey() {
        return this.execCommand(this.currentData());
    }

    datas() {
        return this.lastDataStatus().datas();
    }

    index() {
        return this.lastDataStatus().index();
    }

    currentData() {
        return this.lastDataStatus().currentData();
    }

    getRingCommandSpriteIndex(sprite) {
        return this.lastDataStatus().getDataIndex(sprite.data);
    }

    changeIndex(index) {
        this.lastDataStatus().setIndex(index);
    }
}


Scene_Map.prototype.callMenu = function() {
    SceneManager.push(Scene_RingCommandMenu);
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};


class Scene_RingCommandMenu extends Scene_MenuBase {
    create() {
        this._spriteset = new Spriteset_RingCommandMenu();
        this.addChild(this._spriteset);
        super.create();
        this._spriteset.setBackground(this._backgroundSprite);
        this._ringCommandMenuState = "none";
        this._needLabelUpdate = true;
        this._holdClickRotationSprite = null;
        this._preloadingImageObjects = [];

        const mouseEnterCbk = this.ringCommandSpriteMouseEnterCbk.bind(this);
        const mouseExitCbk = this.ringCommandSpriteMouseExitCbk.bind(this);
        const clickCbk = this.ringCommandSpriteClickCbk.bind(this);
        this._spriteset.addRingCommandSpriteCallback("mouseEnterCbk", mouseEnterCbk);
        this._spriteset.addRingCommandSpriteCallback("mouseExitCbk", mouseExitCbk);
        this._spriteset.addRingCommandSpriteCallback("clickCbk", clickCbk);

        if (!$gameTemp.ringCommandManager()) {
            const ringCommandManager = new RingCommandManager();
            $gameTemp.setRingCommandManager(ringCommandManager);
        }

        this.preloadImages();
    }

    createBackground() {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new SpriteMVMZ();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        const backGroundOpacity = PP.BackGroundOpacity == null ? 192 : PP.BackGroundOpacity;
        this.setBackgroundOpacity(backGroundOpacity);
    }

    isReady() {
        const result = super.isReady();
        if (!result) return false;
        for (const img of this._preloadingImageObjects) {
            if (!img.isReady()) return false;
        }
        return true;
    }

    preloadImages() {
        for (const data of $ringCommnadDatas) {
            this._preloadingImageObjects.push(ImageManager.loadPicture(data.image));
            if (data.subCommands) {
                for (const subData of data.subCommands) {
                    this._preloadingImageObjects.push(ImageManager.loadPicture(subData.image));
                }
            }
        }
    }

    start() {
        super.start();
        this.startRingCommandMenu();
    }

    isBusy() {
        if (this._ringCommandMenuState === "active") return this._spriteset.isRingCommandControllerBusy();
        return false;
    }

    startRingCommandMenu() {
        if ($gameTemp.ringCommandManager().hasHoldDatas()) {
            this._ringCommandMenuState = "restart";
        } else {
            $gameTemp.ringCommandManager().addDatas($ringCommnadDatas);
            this._ringCommandMenuState = "start";
        }
    }

    update() {
        super.update();
        this.updateCancelButton();
        this.updateRingCommand();
    }

    updateCancelButton() {
        if (Utils.RPGMAKER_NAME === "MZ") {
            this._cancelButton.visible = this._ringCommandMenuState === "active";
        }
    }

    createRingCommnadActorDatas() {
        return $gameParty.members().map(this.createRingiCommandActorData);
    }

    createRingiCommandActorData(actor, index) {
        let actorImageName = "";
        if (PP.SelectActorCommands) {
            for (const selectActorCommand of PP.SelectActorCommands) {
                console.log(selectActorCommand);
                if (selectActorCommand.ActorId === actor.actorId()) {
                    actorImageName = selectActorCommand.Image;
                }
            }
        }
        return new RingCommandData("actorData", actor.name(), 0, actorImageName, "", null, index);
    }

    updateRingCommand() {
        if (this._spriteset.isRingCommandControllerBusy()) return;
        this._waitCount--;
        if (this._waitCount > 0) return;
        if (this._ringCommandMenuState === "start") {
            this.processStart(false);
        } else if (this._ringCommandMenuState === "restart") {
            this.processStart(true);
        } else if (this._ringCommandMenuState === "active") {
            this.processActive();
        } else if (this._ringCommandMenuState == "closing") {
            this.processClosing();
        } else if (this._ringCommandMenuState === "transition") {
            this.processTransition();
        } else if (this._ringCommandMenuState === "clickRotation") {
            this.processClickRotation();
        }
    }

    processStart(isRestart) {
        this._spriteset.createRingCommandSprites($gameTemp.ringCommandManager().datas());
        this.playOpenSe();
        this._spriteset.ringCommandShow();
        if (isRestart) {
            this._spriteset.ringCommandSubStart();
        } else {
            this._spriteset.ringCommandStart();
        }
        this._ringCommandMenuState = "active";
    }

    processActive() {
        $gameTemp.ringCommandManager().update();        
        if (this._needLabelUpdate) {
            const label = $gameTemp.ringCommandManager().currentData().text;
            this._spriteset.ringCommandShowLabel(label);
            const index = $gameTemp.ringCommandManager().index();
            this._spriteset.ringCommandShowCursor(index);
            this._needLabelUpdate = false;
        }
        if (TouchInput.isCancelled()) {
            this.inputCancelKey();
        }
        if (Input.isTriggered("cancel")) {
            this.inputCancelKey();
        } else if (Input.isPressed("left")) {
            this.inputLeftKey();
        } else if (Input.isPressed("right")) {
            this.inputRightKey();
        } else if (Input.isTriggered("ok")) {
            this.inputOkKey();
        }
    }

    inputOkKey() {
        const result = $gameTemp.ringCommandManager().inputOkKey();
        this.postExecCommand(result);
    }

    inputCancelKey() {
        $gameTemp.ringCommandManager().inputCancelKey();
        if ($gameTemp.ringCommandManager().hasHoldDatas()) {
            this.playOpenSe();
            this._spriteset.ringCommandSubEnd();
            this._spriteset.ringCommandHideLabel();
            this._spriteset.ringCommandHideCursor();
            this._ringCommandMenuState = "transition";
        } else {
            this.playCloseSe();
            this._spriteset.ringCommandHideLabel();
            this._spriteset.ringCommandHideCursor();
            this._spriteset.ringCommandEnd();
            this._ringCommandMenuState = "closing";
        }
    }

    inputLeftKey() {
        const changed = $gameTemp.ringCommandManager().inputLeftKey();
        if (changed) {
            SoundManager.playCursor();
            this._spriteset.ringCommandPrev();
            this._needLabelUpdate = true;
        }
    }

    inputRightKey() {
        const changed = $gameTemp.ringCommandManager().inputRightKey();
        if (changed) {
            SoundManager.playCursor();
            this._spriteset.ringCommandNext();
            this._needLabelUpdate = true;
        }
    }

    processClosing() {
        this._ringCommandMenuState = "none";
        this._spriteset.ringCommandHide();
        this._spriteset.disposeRingCommandSprites();
        this.popScene();
    }

    processTransition() {
        this._ringCommandMenuState = "active";
        this._needLabelUpdate = true;
        this._spriteset.disposeRingCommandSprites();
        this._spriteset.createRingCommandSprites($gameTemp.ringCommandManager().datas());
        this._spriteset.ringCommandShow();
        this._spriteset.ringCommandSubStart();
    }

    processClickRotation() {
        this._ringCommandMenuState = "active";
        const index = $gameTemp.ringCommandManager().getRingCommandSpriteIndex(this._holdClickRotationSprite);
        $gameTemp.ringCommandManager().changeIndex(index);
        const result = $gameTemp.ringCommandManager().execCommand(this._holdClickRotationSprite.data);
        this.postExecCommand(result);
    }

    postExecCommand(execCommandResult) {
        let datas = null;
        switch (execCommandResult) {
        case "selectActor":
            datas = this.createRingCommnadActorDatas();
            break;
        case "subMenu":
            datas = $gameTemp.ringCommandManager().currentData().subCommands;
            break;
        }
        if (datas) {
            this.playOpenSe();
            this._spriteset.ringCommandSubEnd();
            this._spriteset.ringCommandHideLabel();
            this._spriteset.ringCommandHideCursor();
            $gameTemp.ringCommandManager().addDatas(datas);
            this._ringCommandMenuState = "transition";
        }
    }

    playOpenSe() {
        const se = {
            name: PP.OpenSe.FileName,
            pan: parseInt(PP.OpenSe.Pan),
            pitch: parseInt(PP.OpenSe.Pitch),
            volume: parseInt(PP.OpenSe.Volume),
        }
        AudioManager.playSe(se);
    }

    playCloseSe() {
        const se = {
            name: PP.CloseSe.FileName,
            pan: parseInt(PP.CloseSe.Pan),
            pitch: parseInt(PP.CloseSe.Pitch),
            volume: parseInt(PP.CloseSe.Volume),
        }
        AudioManager.playSe(se);
    }

    ringCommandSpriteMouseEnterCbk(sprite) {
        if (this._ringCommandMenuState === "active") {
            const index = $gameTemp.ringCommandManager().getRingCommandSpriteIndex(sprite);
            this._spriteset.ringCommandShowCursor(index);
            this._spriteset.ringCommandShowLabel(sprite.data.text);
        }
    }

    ringCommandSpriteMouseExitCbk(sprite) {
        if (this._ringCommandMenuState === "active") {
            const index = $gameTemp.ringCommandManager().index();
            this._spriteset.ringCommandShowCursor(index);
            this._spriteset.ringCommandShowLabel($gameTemp.ringCommandManager().currentData().text);
        }
    }

    ringCommandSpriteClickCbk(sprite) {
        if (this._ringCommandMenuState === "active") {
            this.waitStart(10);
            this._holdClickRotationSprite = sprite;
            this._ringCommandMenuState = "clickRotation";
            const index = $gameTemp.ringCommandManager().getRingCommandSpriteIndex(sprite);
            this._spriteset.ringCommandChange(index);
            this._spriteset.ringCommandShowCursor($gameTemp.ringCommandManager().index());
        }
    }

    waitStart(waitCount) {
        this._waitCount = waitCount;
    }
}


class Spriteset_RingCommandMenu extends Spriteset_Base {
    initialize() {
        super.initialize();
        this._ringCommandSpriteController = new RingCommandSpriteController();
        this._ringCommandSpriteCallbacks = {};
    }

    update() {
        super.update();
        if (this._ringCommandSpriteController) this._ringCommandSpriteController.update();
    }

    createUpperLayer() {
        super.createUpperLayer();
        this.createUpperLayerBaseSprite();
    }

    createUpperLayerBaseSprite() {
        this._upperLayerBaseSprite = new Sprite();
        this.addChild(this._upperLayerBaseSprite);
    }

    ringCommandCenterX() {
        return $gamePlayer.screenX();
    }

    ringCommandCenterY() {
        return $gamePlayer.screenY();
    }

    setBackground(background) {
        this._baseSprite.addChild(background);
    }

    addRingCommandSpriteCallback(name, cbk) {
        this._ringCommandSpriteCallbacks[name] = cbk;
    }

    createRingCommandSprites(datas) {
        this._ringCommandSprites = [];
        for (const data of datas) {
            const sprite = new Sprite_RingCommand(0, 0, data, this._ringCommandSpriteCallbacks);
            this._ringCommandSprites.push(sprite);
            this._upperLayerBaseSprite.addChild(sprite);
        }
        this._ringCommandLabel = new Sprite_RingCommandLabel();
        const baseRingCommandSprite = this._ringCommandSprites[0];
        this._ringCommandCursor = new Sprite_RingCommandCursor(baseRingCommandSprite.width, baseRingCommandSprite.height);
        this._upperLayerBaseSprite.addChild(this._ringCommandLabel);
        this._upperLayerBaseSprite.addChild(this._ringCommandCursor);
    }

    disposeRingCommandSprites() {
        for (const sprite of this._ringCommandSprites) {
            this._upperLayerBaseSprite.removeChild(sprite);
        }
        this._upperLayerBaseSprite.removeChild(this._ringCommandLabel);
        this._upperLayerBaseSprite.removeChild(this._ringCommandCursor);
        this._ringCommandSprites = [];
        this._ringCommandLabel = null;
        this._ringCommandCursor = null;
    }

    ringCommandShowLabel(label) {
        this._ringCommandLabel.setLabel(label);
        const baseRingCommandSprite = this._ringCommandSprites[0];
        const ofsX = -this._ringCommandLabel.labelWidth() / 2
        const ofsY = RING_COMMAND_OFFSET_Y - baseRingCommandSprite.height - baseRingCommandSprite.far;
        const x = this.ringCommandCenterX() + ofsX;
        const y = this.ringCommandCenterY() + ofsY;
        this._ringCommandLabel.x = x;
        this._ringCommandLabel.y = y;
        this._ringCommandLabel.show();
    }

    ringCommandHideLabel() {
        this._ringCommandLabel.hide();
    }

    ringCommandShowCursor(index) {
        const sprite = this._ringCommandSprites[index];
        this._ringCommandCursor.x = sprite.x - Sprite_RingCommandCursor.PADDING;
        this._ringCommandCursor.y = sprite.y - Sprite_RingCommandCursor.PADDING;
        this._ringCommandCursor.show();
    }

    ringCommandHideCursor() {
        this._ringCommandCursor.hide();
    }

    isRingCommandControllerBusy() {
        return this._ringCommandSpriteController.isBusy();
    }

    ringCommandShow() {
        const baseRingCommandSprite = this._ringCommandSprites[0];
        const ofsX = -baseRingCommandSprite.width / 2;
        const ofsY = RING_COMMAND_OFFSET_Y;
        const x = this.ringCommandCenterX() + ofsX;
        const y = this.ringCommandCenterY() + ofsY;
        for (const sprite of this._ringCommandSprites) {
            sprite.homeX = x;
            sprite.homeY = y;
            sprite.show();
        }
    }

    ringCommandStart() {
        this._ringCommandSpriteController.reset(this._ringCommandSprites, 0);
        this._ringCommandSpriteController.startInCenter();
    }

    ringCommandSubStart() {
        const index = $gameTemp.ringCommandManager().index();
        this._ringCommandSpriteController.reset(this._ringCommandSprites, index);
        this._ringCommandSpriteController.startOutCenter2();
    }

    ringCommandSubEnd() {
        this._ringCommandSpriteController.startInCenter2();
    }

    ringCommandHide() {
        for (const sprite of this._ringCommandSprites) {
            sprite.hide();
        }
    }

    ringCommandEnd() {
        this._ringCommandSpriteController.startOutCenter();
    }

    ringCommandNext() {
        this._ringCommandSpriteController.startChangeNextCommand();
    }

    ringCommandPrev() {
        this._ringCommandSpriteController.startChangePrevCommand();
    }

    ringCommandChange(targetIndex) {
        let rotationDeg = this._ringCommandSpriteController.calcRelativeIndexDeg(targetIndex);
        const sign = rotationDeg >= 0 ? 1 : -1;
        rotationDeg = Math.abs(rotationDeg);
        if (rotationDeg > 0) {
            if (rotationDeg >= 180) {
                rotationDeg = 360 - rotationDeg;
            } else {
                rotationDeg = -rotationDeg;
            }
        }
        this._ringCommandSpriteController.startChangeCommand(targetIndex, rotationDeg * sign);
    }
}

return {
    RingCommandData: RingCommandData,
    Sprite_RingCommand: Sprite_RingCommand,
    RingCommandSpriteController: RingCommandSpriteController,
    Sprite_RingCommandLabel: Sprite_RingCommandLabel,
    Sprite_RingCommandCursor: Sprite_RingCommandCursor,
    RingCommandDataStatus: RingCommandDataStatus,
    RingCommandManager: RingCommandManager,
    Scene_RingCommandMenu: Scene_RingCommandMenu,
    Spriteset_RingCommandMenu: Spriteset_RingCommandMenu,
}

})();
