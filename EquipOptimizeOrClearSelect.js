/*:
@target MZ
@plugindesc 装備時の最強装備/すべて外すに選択肢を表示 v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/EquipOptimizeOrClearSelect.js
@help
装備時の最強装備/すべて外すに選択肢を表示させることで、誤操作を防ぐプラグインです。

【使用方法】
このプラグインは導入するだけで使用可能です。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@param WindowSize
@text ウィンドウのサイズ
@type struct<WindowSize>
@default {"SelectWindowWidth":"360","SelectWindowHeight":"160"}
@desc
各種ウィンドウのサイズを設定します。

@param Text
@text 表示テキスト
@type struct<Text>
@default {"OptimizeSelectWindowHelpText":"最強装備を行いますか？","OptimizeSelectWindowYesText":"はい","OptimizeSelectWindowNoText":"いいえ","ClearSelectWindowHelpText":"全ての装備を外しますか？","ClearSelectWindowYesText":"はい","ClearSelectWindowNoText":"いいえ"}
@desc
ゲーム中で使用されるテキストを設定します。
*/


/*~struct~WindowSize:
@param SelectWindowWidth
@text 選択肢ウィンドウ横幅
@type number
@default 360
@desc
選択肢ウィンドウの横幅を指定します。

@param SelectWindowHeight
@text 選択肢ウィンドウ縦幅
@type number
@default 160
@desc
選択肢ウィンドウの縦幅を指定します。
*/


/*~struct~Text:
@param OptimizeSelectWindowHelpText
@text 最強装備選択肢ウィンドウ説明テキスト
@type string
@default 最強装備を行いますか？
@desc
最強装備の選択肢ウィンドウに表示する説明テキストを指定します。

@param OptimizeSelectWindowYesText
@text 最強装備選択肢ウィンドウYesテキスト
@type string
@default はい
@desc
最強装備の選択肢ウィンドウに表示するYesの選択肢のテキストを指定します。

@param OptimizeSelectWindowNoText
@text 最強装備選択肢ウィンドウNoテキスト
@type string
@default いいえ
@desc
最強装備の選択肢ウィンドウに表示するNoの選択肢のテキストを指定します。

@param ClearSelectWindowHelpText
@text 装備クリア選択肢ウィンドウ説明テキスト
@type string
@default 全ての装備を外しますか？
@desc
装備クリアの選択肢ウィンドウに表示する説明テキストを指定します。

@param ClearSelectWindowYesText
@text 装備クリアウィンドウYesテキスト
@type string
@default はい
@desc
装備クリアの選択肢ウィンドウに表示するYesの選択肢のテキストを指定します。

@param ClearSelectWindowNoText
@text 選択肢ウィンドウNoテキスト
@type string
@default いいえ
@desc
装備クリアの選択肢ウィンドウに表示するNoの選択肢のテキストを指定します。
*/

const EquipOptimizeOrClearSelectPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

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


const typeDefine = {
    WindowSize: {},
    Text: {},
};
const PP = PluginParamsParser.parse(PluginManager.parameters(EquipOptimizeOrClearSelectPluginName), typeDefine);


class Window_SelectYesOrNo extends Window_Command {
    initialize(rect, opt) {
        this._yesText = opt.yesText;
        this._noText = opt.noText;
        this._helpText = opt.helpText;
        super.initialize(rect);
        this.deactivate();
        this.hide();
        this.close();
    }

    makeCommandList() {
        this.addCommand(this._yesText, "yes");
        this.addCommand(this._noText, "no");
    }

    drawAllItems() {
        const rect = this.itemLineRect(-1);
        this.drawText(this._helpText, rect.x, rect.y, rect.width);
        super.drawAllItems();
    }

    itemRect(index) {
        const rect = super.itemRect(index + 1);
        return rect;
    }

    playOkSound() {
        if (this.currentSymbol() === "yes") return;
        super.playOkSound();
    }
}


const _Scene_Equip_create = Scene_Equip.prototype.create;
Scene_Equip.prototype.create = function() {
    _Scene_Equip_create.call(this);
    this.createOptimizeSelectYesOrNoWindow();
    this.createClearSelectYesOrNoWindow();
};

Scene_Equip.prototype.createOptimizeSelectYesOrNoWindow = function() {
    const opt = { yesText: PP.Text.OptimizeSelectWindowYesText, noText: PP.Text.OptimizeSelectWindowNoText, helpText: PP.Text.OptimizeSelectWindowHelpText};
    this._optimizeSelectYesOrNoWindow = new Window_SelectYesOrNo(this.selectYesOrNoWindowRect(), opt);
    this._optimizeSelectYesOrNoWindow.setHandler("yes", this.optimizeSelectYesOrNoWindowYes.bind(this));
    this._optimizeSelectYesOrNoWindow.setHandler("no", this.optimizeSelectYesOrNoWindowNo.bind(this));
    this._optimizeSelectYesOrNoWindow.setHandler("cancel", this.optimizeSelectYesOrNoWindowNo.bind(this));
    this.addWindow(this._optimizeSelectYesOrNoWindow);
};

Scene_Equip.prototype.createClearSelectYesOrNoWindow = function() {
    const opt = { yesText: PP.Text.ClearSelectWindowYesText, noText: PP.Text.ClearSelectWindowNoText, helpText: PP.Text.ClearSelectWindowHelpText};
    this._clearSelectYesOrNoWindow = new Window_SelectYesOrNo(this.selectYesOrNoWindowRect(), opt);
    this._clearSelectYesOrNoWindow.setHandler("yes", this.clearSelectYesOrNoWindowYes.bind(this));
    this._clearSelectYesOrNoWindow.setHandler("no", this.clearSelectYesOrNoWindowNo.bind(this));
    this._clearSelectYesOrNoWindow.setHandler("cancel", this.clearSelectYesOrNoWindowNo.bind(this));
    this.addWindow(this._clearSelectYesOrNoWindow);
};

Scene_Equip.prototype.selectYesOrNoWindowRect = function() {
    const width = PP.WindowSize.SelectWindowWidth;
    const height = PP.WindowSize.SelectWindowHeight;
    const x = Graphics.boxWidth / 2 - width / 2;
    const y = Graphics.boxHeight / 2 - height / 2;
    return new Rectangle(x, y, width, height);
};

Scene_Equip.prototype.originCommandOptimize = Scene_Equip.prototype.commandOptimize;
Scene_Equip.prototype.originCommandClear = Scene_Equip.prototype.commandClear;

Scene_Equip.prototype.commandOptimize = function() {
    this.change_CommandWindow_To_OptimizeSelectYesOrNoWindow();
};

Scene_Equip.prototype.commandClear = function() {
    this.change_CommandWindow_To_ClearSelectYesOrNoWindow();
};

Scene_Equip.prototype.optimizeSelectYesOrNoWindowYes = function() {
    this.originCommandOptimize();
    this.change_OptimizeSelectYesOrNoWindow_To_CommandWindow();
};

Scene_Equip.prototype.optimizeSelectYesOrNoWindowNo = function() {
    this.change_OptimizeSelectYesOrNoWindow_To_CommandWindow();
};

Scene_Equip.prototype.clearSelectYesOrNoWindowYes = function() {
    this.originCommandClear();
    this.change_ClearSelectYesOrNoWindow_To_CommandWindow();
};

Scene_Equip.prototype.clearSelectYesOrNoWindowNo = function() {
    this.change_ClearSelectYesOrNoWindow_To_CommandWindow();
};

Scene_Equip.prototype.change_CommandWindow_To_OptimizeSelectYesOrNoWindow = function() {
    this._commandWindow.deactivate();
    this._optimizeSelectYesOrNoWindow.select(0);
    this._optimizeSelectYesOrNoWindow.show();
    this._optimizeSelectYesOrNoWindow.activate();
    this._optimizeSelectYesOrNoWindow.open();
};

Scene_Equip.prototype.change_OptimizeSelectYesOrNoWindow_To_CommandWindow = function() {
    this._optimizeSelectYesOrNoWindow.hide();
    this._optimizeSelectYesOrNoWindow.deactivate();
    this._optimizeSelectYesOrNoWindow.close();
    this._commandWindow.activate();
};

Scene_Equip.prototype.change_CommandWindow_To_ClearSelectYesOrNoWindow = function() {
    this._commandWindow.deactivate();
    this._clearSelectYesOrNoWindow.select(0);
    this._clearSelectYesOrNoWindow.show();
    this._clearSelectYesOrNoWindow.activate();
    this._clearSelectYesOrNoWindow.open();
};

Scene_Equip.prototype.change_ClearSelectYesOrNoWindow_To_CommandWindow = function() {
    this._clearSelectYesOrNoWindow.hide();
    this._clearSelectYesOrNoWindow.deactivate();
    this._clearSelectYesOrNoWindow.close();
    this._commandWindow.activate();
};

})();
