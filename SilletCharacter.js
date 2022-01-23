/*:
@target MZ
@plugindesc キャラクターシルエット v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SawTransition.js
@help
キャラクターのシルエットを表示するプラグインです。
プラグインコマンドでシルエットの表示/非表示を切り替えるだけでなく、
特定のリージョンや地形タグとの接触によりシルエット表示をすることも可能です。

【使用方法】
プラグインコマンド「シルエット表示開始」を実行することでシルエット表示を開始します。
このとき、プラグインコマンドのパラメータEventIdに0を指定すると
プラグインコマンドを実行したイベントを対象にします。
また、-1を指定するとプレイヤーを対象にし、-2以下の値を指定するとフォロワーを対象にします。

プラグインコマンド「シルエット表示終了」を実行するとシルエット表示を終了します。

特定の地形タグまたはリージョンIDの上にいるキャラクターをシルエット表示にしたい場合は、
プラグインパラメータ「シルエット表示地形タグ」または「シルエット表示リージョンID」を設定します。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@param SilletTerrainTag
@text シルエット表示地形タグ
@type number
@default 0
@desc シルエット表示を行う地形タグを指定します。0を表示するとこの機能は無効化されます。

@param SilletRegionId
@text シルエット表示リージョンID
@type number
@default 0
@desc シルエット表示を行うリージョンIDを指定します。0を表示するとこの機能は無効化されます。


@command StartSillet
@text シルエット表示開始
@desc シルエット表示を開始します。

@arg EventId
@type string
@default 0
@desc シルエット表示を行うイベントIDまたはイベント名を指定します。


@command EndSillet
@text シルエット表示終了
@desc シルエット表示を終了します。

@arg EventId
@type string
@default 0
@desc シルエット表示を終了するイベントIDまたはイベント名を指定します。
*/

const SilletCharacterPluguinName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

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


const typeDefine = {};
const PP = PluginParamsParser.parse(PluginManager.parameters(SilletCharacterPluguinName), typeDefine);


function searchCharacterById(eventIdOrName, interpreter) {
    if (eventIdOrName.match(/^\-?\d+$/)) {
        const eventId = parseInt(eventIdOrName);
        if (eventId === 0) {
            console.log(interpreter);
            return $gameMap.event(interpreter.eventId());
        } else if (eventId === -1) {
            return $gamePlayer;
        } else if (eventId <= -2) {
            return $gamePlayer.followers().data()[(eventId + 2) * -1];
        }
        return $gameMap.event(eventId);
    } else {
        return $gameMap.events().find(evt => evt.event().name === eventIdOrName);
    }
}

PluginManager.registerCommand(SilletCharacterPluguinName, "StartSillet", function(args) {
    const params = PluginParamsParser.parse(args, { EventId: "string" });
    const event = searchCharacterById(params.EventId, this);
    if (event) event.setForceSilletMode(true);
});

PluginManager.registerCommand(SilletCharacterPluguinName, "EndSillet", function(args) {
    const params = PluginParamsParser.parse(args, { EventId: "string" });
    const event = searchCharacterById(params.EventId, this);
    if (event) event.setForceSilletMode(false);
});


class SilletFilter extends PIXI.Filter {
    constructor(...args) {
        super(null, SilletFilter._fragmentSrc());
        this.initialize(...args);
    }

    static _fragmentSrc() {
        const src = `
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform bool isSillet;

            void main() {
                vec4 sample = texture2D(uSampler, vTextureCoord);
                float a = sample.a;
                if (isSillet) {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, a * 0.5);
                } else {
                    gl_FragColor = sample;
                }
            }
        `;
        return src;
    }

    initialize() {
        this.uniforms.isSillet = false;
    }

    setSillet(isSillet) {
        this.uniforms.isSillet = isSillet;
    }
}


const _Sprite_Character_initialize = Sprite_Character.prototype.initialize;
Sprite_Character.prototype.initialize = function(character) {
    _Sprite_Character_initialize.call(this, character);
    if (this.isNeedSilletFilter()) this.createSilletFilter();
};

const _Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
    _Sprite_Character_update.call(this);
    this._silletFilter.setSillet(this._character.isSilletMode());
};

Sprite_Character.prototype.createSilletFilter = function() {
    if (this.filters == null) this.filters = [];
    this._silletFilter = new SilletFilter();
    this.filters.push(this._silletFilter);
};

Sprite_Character.prototype.isNeedSilletFilter = function() {
    return this._character.isNeedSilletMode();
};


const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this._silletMode = false;
    this._forceSilletMode = false;
};

const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
    _Game_CharacterBase_update.call(this);
    if (this.isNeedSilletMode()) this.updateSilletMode();
};

const _Game_CharacterBase_screenZ = Game_CharacterBase.prototype.screenZ;
Game_CharacterBase.prototype.screenZ = function() {
    if (this.isSilletMode()) return 255;
    return _Game_CharacterBase_screenZ.call(this);
};

Game_CharacterBase.prototype.isNeedSilletMode = function() {
    return true;
};

Game_CharacterBase.prototype.isSilletMode = function() {
    return this._silletMode || this._forceSilletMode;
};

Game_CharacterBase.prototype.setForceSilletMode = function(mode) {
    this._forceSilletMode = mode;
};

Game_CharacterBase.prototype.updateSilletMode = function() {
    if ((PP.SilletTerrainTag > 0 && this.terrainTag() === PP.SilletTerrainTag) ||
        (PP.SilletRegionId > 0 && this.regionId() === PP.SilletRegionId)) {
        this._silletMode = true;
    } else {
        this._silletMode = false;
    }
};

})();
