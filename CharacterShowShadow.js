"use strict";
/*:
@target MZ
@plugindesc キャラクター影表示 v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/CharacterShowShadow.js
@help
シンプルな影表示機能を導入するプラグインです。

【使用方法】
影を表示させたいキャラクターをプラグインパラメータ「影表示キャラクターリスト」に
登録すると、そのキャラクターは影が表示されるようになります。
影表示キャラクターリストには「キャラクターファイル名」と
「キャラクターインデックス」を指定する必要があり、
それぞれ次の内容を指定します。

[キャラクターファイル名]
影表示対象のキャラクターの画像ファイル名を指定します。

[キャラクターインデックス]
4*2のキャラクターが登録された画像を使用する場合、どの位置の画像を
使用するかを0~7までの数値で指定します。0~3までが1列目となり、
4~7までが2列目となります。
-1を指定した場合、全てのインデックスを影表示の対象とします。
単体のキャラクター画像(ファイル名の先頭に$がつくもの)の場合、
この設定値は使用されません。


また、イベントのメモ欄またはイベント1ページ目の最初の注釈に
<showShadow>
と記載すると「影表示キャラクターリスト」の設定にかかわらず
影表示を行います。逆に影を非表示にするには
<hideShadow>
と記載します。

スクリプトから影表示/非表示を切り替えることも可能です。
移動ルートのスクリプトで
this.showShadow();
と記載することで影表示を行うことができます。非表示にする場合は
this.hideShadow();
と記載してください。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@param ShowShadowCharacterList
@text 影表示キャラクターリスト
@type struct<ShowShadowCharacter>[]
@default []
@desc
影表示を行うキャラクターの一覧を登録します。

@param ShadowImageFileName
@text 影画像ファイル名
@type file
@dir img
@default system/Shadow1
@desc
影画像のファイル名を指定します。

@param ShadowYOffset
@text 影Y座標オフセット
@type number
@default 6
@desc
影画像のY座標オフセットを指定します。
*/
/*~struct~ShowShadowCharacter:ja
@param CharacterFileName
@text キャラクターファイル名
@type file
@dir img/characters
@desc
キャラクターのファイル名を指定します。

@param CharacterIndex
@text キャラクターインデックス
@type number
@default -1
@min -1
@desc
キャラクターのインデックスを指定します。-1を指定すると全インデックスを対象にします。
*/
const SimpleShadowPluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "SimpleShadow";
var SimpleShadow;
(function (SimpleShadow) {
    class PluginParamsParser {
        constructor(predictEnable = true) {
            this._predictEnable = predictEnable;
        }
        static parse(params, typeData, predictEnable = true) {
            return new PluginParamsParser(predictEnable).parse(params, typeData);
        }
        parse(params, typeData, loopCount = 0) {
            if (++loopCount > 255)
                throw new Error("endless loop error");
            const result = {};
            for (const name in typeData) {
                if (params[name] === "" || params[name] === undefined) {
                    result[name] = null;
                }
                else {
                    result[name] = this.convertParam(params[name], typeData[name], loopCount);
                }
            }
            if (!this._predictEnable)
                return result;
            if (typeof params === "object" && !(params instanceof Array)) {
                for (const name in params) {
                    if (result[name])
                        continue;
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
            }
            else if (typeof type === "object" && type instanceof Array) {
                const aryParam = JSON.parse(param);
                if (type[0] === "string") {
                    return aryParam.map((strParam) => this.cast(strParam, type[0]));
                }
                else {
                    return aryParam.map((strParam) => this.parse(JSON.parse(strParam), type[0]), loopCount);
                }
            }
            else if (typeof type === "object") {
                return this.parse(JSON.parse(param), type, loopCount);
            }
            else {
                throw new Error(`${type} is not string or object`);
            }
        }
        cast(param, type) {
            switch (type) {
                case "any":
                    if (!this._predictEnable)
                        throw new Error("Predict mode is disable");
                    return this.cast(param, this.predict(param));
                case "string":
                    return param;
                case "number":
                    if (param.match(/^\-?\d+\.\d+$/))
                        return parseFloat(param);
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
            }
            else if (param === "true" || param === "false") {
                return "boolean";
            }
            else {
                return "string";
            }
        }
    }
    const typeDefine = {
        ShowShadowCharacterList: [{}]
    };
    const PP = PluginParamsParser.parse(PluginManager.parameters(SimpleShadowPluginName), typeDefine);
    function mixin(dest, src) {
        for (const name of Object.getOwnPropertyNames(src.prototype)) {
            if (name === "constructor")
                continue;
            const value = Object.getOwnPropertyDescriptor(src.prototype, name) || Object.create(null);
            Object.defineProperty(dest.prototype, name, value);
        }
    }
    class Game_CharacterBase_Mixin extends Game_CharacterBase {
        initMembers() {
            Game_CharacterBase_Mixin._initMembers.call(this);
            this._needShadow = false;
        }
        setImage(characterName, characterIndex) {
            Game_CharacterBase_Mixin._setImage.call(this, characterName, characterIndex);
            this._needShadow = this.checkIncludedShowShadowCharacterList();
        }
        isNeedShadow() {
            return this._needShadow;
        }
        showShadow() {
            this._needShadow = true;
        }
        hideShadow() {
            this._needShadow = false;
        }
        shadowScreenX() {
            return this.screenX();
        }
        ;
        shadowScreenY() {
            const th = $gameMap.tileHeight();
            return Math.floor(this.scrolledY() * th + th - this.shiftY() + PP.ShadowYOffset);
        }
        ;
        shadowScreenZ() {
            return this.screenZ() - 1;
        }
        ;
        checkIncludedShowShadowCharacterList() {
            for (const showShadowCharacter of PP.ShowShadowCharacterList) {
                if (showShadowCharacter.CharacterFileName === this._characterName &&
                    (showShadowCharacter.CharacterIndex < 0 || ImageManager.isBigCharacter(this._characterName) || showShadowCharacter.CharacterIndex === this._characterIndex)) {
                    return true;
                }
            }
            return false;
        }
    }
    Game_CharacterBase_Mixin._initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase_Mixin._setImage = Game_CharacterBase.prototype.setImage;
    mixin(Game_CharacterBase, Game_CharacterBase_Mixin);
    class Game_Event_Mixin extends Game_Event {
        initialize(mapId, eventId) {
            Game_Event_Mixin._initialize.call(this, mapId, eventId);
            if (this.event().meta.showShadow) {
                this._needShadow = true;
            }
            else if (this.event().meta.hideShadow) {
                this._needShadow = false;
            }
        }
    }
    Game_Event_Mixin._initialize = Game_Event.prototype.initialize;
    mixin(Game_Event, Game_Event_Mixin);
    class Sprite_Shadow extends Sprite {
        constructor(...args) {
            super(...args);
        }
        initialize(character) {
            super.initialize();
            this.bitmap = ImageManager.loadBitmap("img/", PP.ShadowImageFileName);
            this.anchor.x = 0.5;
            this.anchor.y = 1;
            this._character = character;
            this.updatePosition();
        }
        update() {
            super.update();
            this.updatePosition();
            this.updateVisible();
        }
        character() {
            return this._character;
        }
        updatePosition() {
            this.x = this._character.shadowScreenX();
            this.y = this._character.shadowScreenY();
            this.z = this._character.shadowScreenZ();
        }
        updateVisible() {
            this.visible = this._character.isNeedShadow();
        }
    }
    SimpleShadow.Sprite_Shadow = Sprite_Shadow;
    class Sprite_Character_Mixin extends Sprite_Character {
        character() {
            return this._character;
        }
    }
    mixin(Sprite_Character, Sprite_Character_Mixin);
    class Spriteset_Map_Mixin extends Spriteset_Map {
        initialize() {
            // NOTE: createLowerLayerがsuper.initializeのコンテキストでコールされるため先に初期化する。
            this._characterShadowSprites = [];
            Spriteset_Map_Mixin._initialize.call(this);
        }
        update() {
            Spriteset_Map_Mixin._update.call(this);
            this.updateCharacterShadows();
        }
        createLowerLayer() {
            Spriteset_Map_Mixin._createLowerLayer.call(this);
            this.updateCharacterShadows();
        }
        updateCharacterShadows() {
            const spriteCharacters = this._characterSprites.map(sprite => sprite.character());
            const shadowSpriteCharacter = this._characterShadowSprites.map(sprite => sprite.character());
            for (const characterSprite of this._characterSprites) {
                const character = characterSprite.character();
                if (!shadowSpriteCharacter.includes(character)) {
                    const shadowSprite = new Sprite_Shadow(character);
                    this._tilemap.addChild(shadowSprite);
                    this._characterShadowSprites.push(shadowSprite);
                }
            }
            for (const shadowSprite of this._characterShadowSprites.concat()) {
                const character = shadowSprite.character();
                if (!spriteCharacters.includes(character)) {
                    this._tilemap.removeChild(shadowSprite);
                    this._characterShadowSprites = this._characterShadowSprites.filter(sprite => sprite === shadowSprite);
                }
            }
        }
    }
    Spriteset_Map_Mixin._createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map_Mixin._initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map_Mixin._update = Spriteset_Map.prototype.update;
    mixin(Spriteset_Map, Spriteset_Map_Mixin);
})(SimpleShadow || (SimpleShadow = {}));
