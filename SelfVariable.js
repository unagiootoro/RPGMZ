/*:
@target MV MZ
@plugindesc Self variable v1.0.0
@author unagiootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SelfVariable.js
@help
A plugin that introduces self-variables.

【How to use】
■ Basic usage
If you prefix the variable name with "$", the variable is treated as a self-variable.
Setting example: $ Self variable

Self-variables are managed on an event-by-event basis, similar to self-switching.
You can get and set the value of a self-variable on the editor in the same way as a normal variable.
You can do it.

■ Manipulate self-variables from plug-in commands
"Get self-variable value" and "Set self-variable value" of the plug-in command
By using self-variables from one event to another
It is also possible to operate.

Plugin commands can only be used when running on MZ.
In the case of MV, by using the function to operate self variables from the script
The same can be achieved.

■ Manipulate self variables from scripts
・Acquisition of self-variables
Example: To get the self-variable of ID3 of the map of ID1 and the event of ID2
$gameVariables.selfVariableValue([1, 2, 3])

・Self variable setting
Example: If you want to set the self-variable for ID3 to 100 for the event for ID2 in the map for ID1.
$gameVariables.selfVariableValue([1, 2, 3], 100)

Also, for those who understand the script to some extent, in Game_Event
The following methods are defined, so by using these,
It is possible to manipulate self-variables more easily.
・Game_Event#selfVariableValue(variableId)
Gets the self-variable specified by variableId for the target event.

・Game_Event#setSelfVariableValue(variableId, value)
Stores the value in the self-variable specified by variableId for the target event.

【Important point】
-Do not manipulate self variables from battle events on the editor.
Self variables are linked to map events, so from other than map events
If the variable is accessed via the event command, it will not operate normally.

-The following functions do not work properly due to specifications.
When using these functions, store them in normal variables once
Please move the value to the self variable.
- \v in text display
- Numerical input processing

【License】
This plugin is available under the terms of the MIT license.


@command GetSelfVariableValue
@text Self variable value acquisition
@desc Gets the value of a self-variable.

@arg MapId
@type number
@text map ID
@default 1
@desc Specify the map ID.

@arg EventId
@type number
@text Event ID
@default 1
@desc Specify the event ID.

@arg SelfVariableId
@type variable
@text Self variable ID
@default 1
@desc Specifies the self-variable ID.

@arg DestVariableId
@type variable
@text Storage variable ID
@default 2
@desc Specify the variable ID that stores the acquired self-variable value.


@command SetSelfVariableValue
@text Self variable value setting
@desc Set the value of the self variable.

@arg MapId
@type number
@text map ID
@default 1
@desc Specify the map ID.

@arg EventId
@type number
@text Event ID
@default 1
@desc Specify the event ID.

@arg SelfVariableId
@type variable
@text Self variable ID
@default 1
@desc Specifies the self-variable ID.

@arg Value
@type number
@text setting value
@default 0
@desc Specifies the value to set for the self-variable.

@arg SrcVariableId
@type variable
@text Setting value storage variable ID
@default 0
@desc Specify the variable ID that stores the value to be set in the self-variable. If you specify a direct value, specify 0 for this parameter.


@param SelfVariablePrefix
@type string
@text self-variable prefix
@default $
@desc Specifies the variable name prefix used to identify self-variables.

@param ErrorLanguage
@type string
@text error language
@default ja
@desc Specifies the language for displaying errors. Normally you do not need to change this parameter.
*/

/*:ja
@target MV MZ
@plugindesc セルフ変数 v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SelfVariable.js
@help
セルフ変数を導入するプラグインです。

【使用方法】
■ 基本的な使用法
変数名の先頭に「$」を付けると、その変数はセルフ変数として扱われます。
設定例: $セルフ変数

セルフ変数はセルフスイッチと同じようにイベントごとに管理されます。
セルフ変数の値の取得や設定は通常の変数と同じようにエディタ上で
行うことができます。

■ プラグインコマンドからセルフ変数を操作する
プラグインコマンドの「セルフ変数値取得」「セルフ変数値設定」を
使用することで、あるイベントから他のイベントのセルフ変数を
操作することも可能です。

プラグインコマンドはMZで動作させる場合のみ使用できます。
MVの場合はスクリプトからセルフ変数を操作させる機能を使用することで
同様のことが実現可能です。

■ スクリプトからセルフ変数を操作する
・セルフ変数の取得
例: ID1のマップの、ID2のイベントの、ID3のセルフ変数を取得する場合
$gameVariables.selfVariableValue([1, 2, 3])

・セルフ変数の設定
例: ID1のマップの、ID2のイベントの、ID3のセルフ変数に100を設定する場合
$gameVariables.selfVariableValue([1, 2, 3], 100)

また、ある程度スクリプトが分かる人向けですが、Game_Eventに
以下のメソッドを定義していますので、これらを使用することで
より簡単にセルフ変数を操作することが可能です。
・Game_Event#selfVariableValue(variableId)
対象のイベントについてvariableIdで指定したセルフ変数を取得します。

・Game_Event#setSelfVariableValue(variableId, value)
対象のイベントについてvariableIdで指定したセルフ変数にvalueを格納します。

【注意点】
・エディタ上で戦闘イベントからセルフ変数を操作しないでください。
　セルフ変数はマップイベントに紐づいていますので、マップイベント以外から
　イベントコマンド経由で変数にアクセスした場合、正常に動作しなくなります。

・以下の機能については仕様の都合上、正常に動作しません。
　これらの機能を使用する際は一旦通常の変数に格納してから
　セルフ変数に値を移すようにしてください。
　　- 文章表示における\v
　　- 数値入力の処理

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@command GetSelfVariableValue
@text セルフ変数値取得
@desc セルフ変数の値を取得します。

@arg MapId
@type number
@text マップID
@default 1
@desc マップIDを指定します。

@arg EventId
@type number
@text イベントID
@default 1
@desc イベントIDを指定します。

@arg SelfVariableId
@type variable
@text セルフ変数ID
@default 1
@desc セルフ変数IDを指定します。

@arg DestVariableId
@type variable
@text 格納先変数ID
@default 2
@desc 取得したセルフ変数の値を格納する変数IDを指定します。


@command SetSelfVariableValue
@text セルフ変数値設定
@desc セルフ変数の値を設定します。

@arg MapId
@type number
@text マップID
@default 1
@desc マップIDを指定します。

@arg EventId
@type number
@text イベントID
@default 1
@desc イベントIDを指定します。

@arg SelfVariableId
@type variable
@text セルフ変数ID
@default 1
@desc セルフ変数IDを指定します。

@arg Value
@type number
@text 設定値
@default 0
@desc セルフ変数に設定する値を指定します。

@arg SrcVariableId
@type variable
@text 設定値格納変数ID
@default 0
@desc セルフ変数に設定する値を格納した変数IDを指定します。直接値を指定する場合、このパラメータは0を指定してください。


@param SelfVariablePrefix
@type string
@text セルフ変数プレフィックス
@default $
@desc セルフ変数の識別に使用する変数名のプレフィックスを指定します。

@param ErrorLanguage
@type string
@text エラー言語
@default ja
@desc エラー表示の言語を指定します。通常このパラメータを変更する必要はありません。
*/

const SelfVariablePluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {
"use strict";

let globalActiveInterpreter = null;
let globalRefreshEvent = null;


const PP = PluginManager.parameters(SelfVariablePluginName);
const SelfVariablePrefix = PP.SelfVariablePrefix;
const ErrorLanguage = PP.ErrorLanguage;


class ErrorMessageManager {
    static invalidSelfVariableAccess(variableId) {
        if (ErrorLanguage === "ja") {
            return `不正なタイミングでのセルフ変数(ID:${variableId})へのアクセスが発生しました。`
        } else {
            return `An access to the self-variable(ID:${variableId}) occurred at an incorrect timing.`
        }
    }
}


/* static class PluginManager */
if (typeof PluginManager.registerCommand !== "undefined") {
    PluginManager.registerCommand(SelfVariablePluginName, "GetSelfVariableValue", function(args) {
        const mapId = parseInt(args.MapId);
        const eventId = parseInt(args.EventId);
        const selfVariableId = parseInt(args.SelfVariableId);
        const destVariableId = parseInt(args.DestVariableId);
        const key = [mapId, eventId, selfVariableId];
        const value = $gameVariables.selfVariableValue(key);
        $gameVariables.setValue(destVariableId, value);
    });

    PluginManager.registerCommand(SelfVariablePluginName, "SetSelfVariableValue", function(args) {
        const mapId = parseInt(args.MapId);
        const eventId = parseInt(args.EventId);
        const selfVariableId = parseInt(args.SelfVariableId);
        let value = parseInt(args.Value);
        const srcVariableId = parseInt(args.SrcVariableId);
        const key = [mapId, eventId, selfVariableId];
        if (srcVariableId > 0) {
            value = $gameVariables.value(srcVariableId);
        }
        $gameVariables.setSelfVariableValue(key, value);
    });
}


/* class Game_Variables */
const _Game_Variables_clear = Game_Variables.prototype.clear;
Game_Variables.prototype.clear = function() {
    _Game_Variables_clear.call(this);
    this._selfVariablesData = {};
};

const _Game_Variables_value = Game_Variables.prototype.value;
Game_Variables.prototype.value = function(variableId) {
    if (this.isSelfVariable(variableId)) {
        if (this._isDebugScene()) return 0;
        const key = this._currentSelfVariableKey(variableId);
        return this.selfVariableValue(key);
    }
    return _Game_Variables_value.call(this, variableId);
};

const _Game_Variables_setValue = Game_Variables.prototype.setValue;
Game_Variables.prototype.setValue = function(variableId, value) {
    if (this.isSelfVariable(variableId)) {
        if (this._isDebugScene()) return;
        const key = this._currentSelfVariableKey(variableId);
        this.setSelfVariableValue(key, value);
        return;
    }
    return _Game_Variables_setValue.call(this, variableId, value);
};

Game_Variables.prototype.isSelfVariable = function(variableId) {
    const name = $dataSystem.variables[variableId];
    if (!name) return false;
    const prefix = name.slice(0, SelfVariablePrefix.length);
    if (prefix === SelfVariablePrefix) return true;
    return false;
};

Game_Variables.prototype.selfVariableValue = function(key) {
    return this._selfVariablesData[key] || 0;
};

Game_Variables.prototype.setSelfVariableValue = function(key, value) {
    const variableId = key[2];
    if (variableId > 0 && variableId < $dataSystem.variables.length) {
        if (typeof value === "number") {
            value = Math.floor(value);
        }
        this._selfVariablesData[key] = value;
        this.onChange();
    }
};

Game_Variables.prototype._currentSelfVariableKey = function(variableId) {
    if (globalActiveInterpreter) {
        return globalActiveInterpreter.selfVariableKey(variableId);
    } else if (globalRefreshEvent) {
        return globalRefreshEvent.selfVariableKey(variableId);
    }
    throw new Error(ErrorMessageManager.invalidSelfVariableAccess(variableId));
};

Game_Variables.prototype._isDebugScene = function() {
    if (SceneManager._scene instanceof Scene_Debug) return true;
    return false;
};


/* class Game_Interpreter */
Game_Interpreter.prototype.selfVariableKey = function(variableId) {
    return [this._mapId, this._eventId, variableId];
};

const _Game_Interpreter_executeCommand = Game_Interpreter.prototype.executeCommand;
Game_Interpreter.prototype.executeCommand = function() {
    globalActiveInterpreter = this;
    const result = _Game_Interpreter_executeCommand.call(this);
    globalActiveInterpreter = null;
    return result;
};


/* class Game_Event */
Game_Event.prototype.selfVariableValue = function(variableId) {
    const key = this.selfVariableKey(variableId);
    return $gameVariables.selfVariableValue(key);
};

Game_Event.prototype.setSelfVariableValue = function(variableId, value) {
    const key = this.selfVariableKey(variableId);
    $gameVariables.setSelfVariableValue(key, value);
};

const _Game_Event_refresh = Game_Event.prototype.refresh;
Game_Event.prototype.refresh = function() {
    globalRefreshEvent = this;
    _Game_Event_refresh.call(this);
    globalRefreshEvent = null;
};

Game_Event.prototype.selfVariableKey = function(variableId) {
    return [$gameMap.mapId(), this.eventId(), variableId];
};

})();
