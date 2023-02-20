/*:
@target MZ
@plugindesc character shadow display v1.0.3
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/CharacterShowShadow.js
@help
This plugin introduces a simple shadow display function.

【How to use】
Add the characters you want to display shadows to the plug-in parameter "Shadow display character list"
Once registered, the character will be able to display shadows.
In the shadow display character list, "character file name" and
You have to specify the "character index",
Specify the following for each:

[character file name]
Specify the image file name of the character for shadow display.

[Character Index]
When using an image with 4*2 characters registered, which position image
Specify whether to use it with a number from 0 to 7. 0 to 3 are the first row,
4 to 7 are the second row.
If -1 is specified, all indexes will be shadowed.
In the case of a single character image (those with $ at the beginning of the file name),
This setting is not used.


Also, in the notes section of the event or the first comment on the first page of the event
<showShadow>
Regardless of the setting of "Shadow display character list"
Show shadows. Conversely, to hide shadows
<hideShadow>
will be described.

It is also possible to switch the shadow display / non-display from the script.
In the travel route script
this.showShadow();
You can display shadows by writing If you want to hide
this.hideShadow();
Please write

【License】
This plugin is available under the terms of the MIT license.

@param ShowShadowCharacterList
@text shadow display character list
@type struct<ShowShadowCharacter>[]
@default[]
@desc
Register a list of characters for shadow display.

@param ShadowImageFileName
@text shadow image file name
@type file
@dir img
@default system/Shadow1
@desc
Specifies the file name of the shadow image.

@param ShadowYOffset
@text shadow Y coordinate offset
@type number
@default 6
@desc
Specifies the Y coordinate offset of the shadow image.
*/
/*~struct~ShowShadowCharacter:
@param CharacterFileName
@text character file name
@type file
@dir img/characters
@desc
Specifies the file name of the character.

@param CharacterIndex
@text character index
@type number
@default -1
@min-1
@desc
Specifies the character index. Specify -1 to target all indexes.
*/
/*:ja
@target MZ
@plugindesc キャラクター影表示 v1.0.3
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

declare interface Game_CharacterBase {
    _needShadowByShowShadowList: boolean;
    _needShadowByApi?: boolean;

    isNeedShadow(): boolean;
    showShadow(): void;
    hideShadow(): void;
    shadowScreenX(): number;
    shadowScreenY(): number;
    shadowScreenZ(): number;
}

declare interface Game_Event {
    _needShadowByMeta?: boolean;
}

declare interface Sprite_Character {
    character(): Game_CharacterBase;
}

const SimpleShadowPluginName = document.currentScript ? decodeURIComponent((document.currentScript as HTMLScriptElement).src.match(/^.*\/(.+)\.js$/)![1]) : "SimpleShadow";

namespace SimpleShadow {
    class PluginParamsParser {
        private _predictEnable: boolean;

        static parse(params: any, typeData: any, predictEnable: boolean = true) {
            return new PluginParamsParser(predictEnable).parse(params, typeData);
        }

        constructor(predictEnable = true) {
            this._predictEnable = predictEnable;
        }

        parse(params: any, typeData: any, loopCount: number = 0): any {
            if (++loopCount > 255) throw new Error("endless loop error");
            const result: any = {};
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

        convertParam(param: any, type: any, loopCount: number): any {
            if (typeof type === "string") {
                return this.cast(param, type);
            } else if (typeof type === "object" && type instanceof Array) {
                const aryParam = JSON.parse(param);
                if (type[0] === "string") {
                    return aryParam.map((strParam: string) => this.cast(strParam, type[0]));
                } else {
                    return aryParam.map((strParam: string) => this.parse(JSON.parse(strParam), type[0]), loopCount);
                }
            } else if (typeof type === "object") {
                return this.parse(JSON.parse(param), type, loopCount);
            } else {
                throw new Error(`${type} is not string or object`);
            }
        }

        cast(param: any, type: any): any {
            switch (type) {
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

        predict(param: any): string {
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
        ShowShadowCharacterList: [{}]
    };
    const PP = PluginParamsParser.parse(PluginManager.parameters(SimpleShadowPluginName), typeDefine);

    function mixin(dest: { prototype: any }, src: { prototype: any }) {
        for (const name of Object.getOwnPropertyNames(src.prototype)) {
            if (name === "constructor") continue;
            const value = Object.getOwnPropertyDescriptor(src.prototype, name) || Object.create(null);
            Object.defineProperty(dest.prototype, name, value);
        }
    }

    class Game_CharacterBase_Mixin extends Game_CharacterBase {
        static _initMembers = Game_CharacterBase.prototype.initMembers;
        static _setImage = Game_CharacterBase.prototype.setImage;

        initMembers() {
            Game_CharacterBase_Mixin._initMembers.call(this);
            this._needShadowByShowShadowList = false;
        }

        setImage(characterName: string, characterIndex: number): void {
            Game_CharacterBase_Mixin._setImage.call(this, characterName, characterIndex);
            this._needShadowByShowShadowList = this.checkIncludedShowShadowCharacterList();
        }

        isNeedShadow(): boolean {
            if (this._needShadowByApi != null) return this._needShadowByApi;
            return this._needShadowByShowShadowList;
        }

        showShadow(): void {
            this._needShadowByApi = true;
        }

        hideShadow(): void {
            this._needShadowByApi = false;
        }

        shadowScreenX(): number {
            return this.screenX();
        }

        shadowScreenY(): number {
            const th = $gameMap.tileHeight();
            return Math.floor(
                this.scrolledY() * th + th - this.shiftY() + PP.ShadowYOffset
            );
        }

        shadowScreenZ(): number {
            return this.screenZ() - 1;
        }

        private checkIncludedShowShadowCharacterList(): boolean {
            for (const showShadowCharacter of PP.ShowShadowCharacterList) {
                if (showShadowCharacter.CharacterFileName === this._characterName &&
                    (showShadowCharacter.CharacterIndex < 0 || ImageManager.isBigCharacter(this._characterName) || showShadowCharacter.CharacterIndex === this._characterIndex)) {
                    return true;
                }
            }
            return false;
        }
    }

    mixin(Game_CharacterBase, Game_CharacterBase_Mixin);

    class Game_Event_Mixin extends Game_Event {
        static _refresh = Game_Event.prototype.refresh;

        refresh(): void {
            Game_Event_Mixin._refresh.call(this);
            const values = this.getAnnotationValues(0);
            if (this.event().meta.showShadow || values.showShadow) {
                this._needShadowByMeta = true;
            } else if (this.event().meta.hideShadow || values.hideShadow) {
                this._needShadowByMeta = false;
            }
        }

        isNeedShadow(): boolean {
            if (this._needShadowByApi != null) return this._needShadowByApi;
            if (this._needShadowByMeta != null) return this._needShadowByMeta;
            return this._needShadowByShowShadowList;
        }

        getAnnotationValues(page: number): { [key: string]: string } {
            const note = this.getAnnotation(page);
            const data: any = { note };
            DataManager.extractMetadata(data);
            return data.meta;
        }

        getAnnotation(page: number): string {
            const eventData = this.event();
            if (eventData) {
                const noteLines = [];
                const pageList = eventData.pages[page].list;
                for (let i = 0; i < pageList.length; i++) {
                    if (pageList[i].code === 108 || pageList[i].code === 408) {
                        noteLines.push(pageList[i].parameters[0]);
                    } else {
                        break;
                    }
                }
                return noteLines.join("\n");
            }
            return "";
        }
    }

    mixin(Game_Event, Game_Event_Mixin);

    export class Sprite_Shadow extends Sprite {
        z!: number;
        private _character!: Game_CharacterBase;

        constructor(character: Game_CharacterBase);

        constructor(...args: any[]) {
            super(...args as []);
        }

        initialize(character: Game_CharacterBase) {
            super.initialize();
            this.hide();
            this.bitmap = ImageManager.loadBitmap("img/", PP.ShadowImageFileName);
            this.anchor.x = 0.5;
            this.anchor.y = 1;
            this._character = character;
            this.updatePosition();
        }

        update(): void {
            super.update();
            this.updatePosition();
            this.updateVisible();
        }

        character(): Game_CharacterBase {
            return this._character!;
        }

        updatePosition(): void {
            this.x = this._character.shadowScreenX();
            this.y = this._character.shadowScreenY();
            this.z = this._character.shadowScreenZ();
        }

        updateVisible(): void {
            this.visible = this._character.isNeedShadow();
            const spriteset = (SceneManager as any)._scene._spriteset;
            const characterSprite = spriteset.findTargetSprite(this._character);
            if (characterSprite && characterSprite.visible) {
                if (this._character.isNeedShadow()) {
                    this.visible = true;
                } else {
                    this.visible = false;
                }
            } else {
                this.visible = false;
            }
        }
    }

    class Sprite_Character_Mixin extends Sprite_Character {
        character(): Game_CharacterBase {
            return this._character!;
        }
    }

    mixin(Sprite_Character, Sprite_Character_Mixin);

    class Spriteset_Map_Mixin extends Spriteset_Map {
        static _createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
        static _initialize = Spriteset_Map.prototype.initialize;
        static _update = Spriteset_Map.prototype.update;

        private _characterShadowSprites!: Sprite_Shadow[];

        initialize(): void {
            // NOTE: createLowerLayerがsuper.initializeのコンテキストでコールされるため先に初期化する。
            this._characterShadowSprites = [];
            Spriteset_Map_Mixin._initialize.call(this);
        }

        update(): void {
            Spriteset_Map_Mixin._update.call(this);
            this.updateCharacterShadows();
        }

        createLowerLayer(): void {
            Spriteset_Map_Mixin._createLowerLayer.call(this);
            this.updateCharacterShadows();
        }

        updateCharacterShadows(): void {
            const spriteCharacters = this._characterSprites.map(sprite => sprite.character());
            const shadowSpriteCharacter = this._characterShadowSprites.map(sprite => sprite.character());

            for (const characterSprite of this._characterSprites) {
                const character = characterSprite.character();
                if (!shadowSpriteCharacter.includes(character)) {
                    this.createShadowSprite(character);
                }
            }
            for (const shadowSprite of this._characterShadowSprites.concat()) {
                const character = shadowSprite.character();
                if (!spriteCharacters.includes(character)) {
                    this.removeShadowSprite(shadowSprite);
                }
            }
        }

        private createShadowSprite(character: Game_CharacterBase): void {
            const shadowSprite = new Sprite_Shadow(character);
            this._tilemap.addChild(shadowSprite);
            this._characterShadowSprites.push(shadowSprite);
        }

        private removeShadowSprite(shadowSprite: Sprite_Shadow): void {
            this._tilemap.removeChild(shadowSprite);
            this._characterShadowSprites = this._characterShadowSprites.filter(sprite => sprite !== shadowSprite);
        }
    }

    mixin(Spriteset_Map, Spriteset_Map_Mixin);
}
