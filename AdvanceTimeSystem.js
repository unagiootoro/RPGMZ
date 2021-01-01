/*:
@target MV MZ
@plugindesc 時間経過システム ver1.2.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/AdvanceTimeSystem.js

@param TimezoneVariableID
@type number
@default 1
@desc
時間帯を管理する変数のID
変数の値は、(0:朝、1:昼、2:夕方、3:夜、4:深夜、5:夜明け)を意味します。

@param EnableAdvanceTimeSwitchID
@type number
@default 0
@desc
時間経過を許可/禁止を設定するスイッチID

@param MorningSteps
@type number
@default 90
@desc 朝の時間の長さ(単位は歩数)

@param NoonSteps
@type number
@default 180
@desc 昼の時間の長さ(単位は歩数)

@param EveningSteps
@type number
@default 90
@desc 夕方の時間の長さ(単位は歩数)

@param NightSteps
@type number
@default 120
@desc 夜の時間の長さ(単位は歩数)

@param LateNightSteps
@type number
@default 120
@desc 深夜の時間の長さ(単位は歩数)

@param DawnSteps
@type number
@default 120
@desc 夜明けの時間の長さ(単位は歩数)

@param MorningTint
@type string
@default [-34, -34, 0, 34]
@desc 朝の画面の色調を[Red, Green, Blue, Gray]の形式で指定

@param NoonTint
@type string
@default [0, 0, 0, 0]
@desc 昼の画面の色調を[Red, Green, Blue, Gray]の形式で指定

@param EveningTint
@type string
@default [68, -34, -34, 0]
@desc 夕方の画面の色調を[Red, Green, Blue, Gray]の形式で指定

@param NightTint
@type string
@default [-68, -68, 0, 68]
@desc 夜の画面の色調を[Red, Green, Blue, Gray]の形式で指定

@param LateNightTint
@type string
@default [-136, -136, 0, 136]
@desc 深夜の画面の色調を[Red, Green, Blue, Gray]の形式で指定

@param DawnTint
@type string
@default [-68, -68, 0, 68]
@desc 夜明けの画面の色調を[Red, Green, Blue, Gray]の形式で指定

@param FadeFrame
@type number
@default 60
@desc 画面の色調変更のフレームを指定

@command DisableTimeEffect
@text DisableTimeEffect
@desc 時間帯の色調変更を無効化します。

@command EnableTimeEffect
@text EnableTimeEffect
@desc 時間帯の色調変更を有効化します。


@help
歩くたびに時間が経過する古典的な時間経過システムを導入するプラグインです。
時間帯には、朝(Morning)、昼(Noon)、夕方(Evening)、夜(Night)、深夜(LateNight)、夜明け(Dawn)を使用できます。

[使用方法]
時間の経過を許可するマップのメモ欄に、
<AdvanceTimeMap>
と記述してください。


夜専用BGMを流したいマップでは、
<NightBgm: ["BGMファイル名", ピッチ、ボリューム、パン]>
と記述することで、夜に専用BGMを流すことができます。
例えば、インポートした"night-bgm"という夜専用BGMをセットしたい場合は、
<NightBgm: ["night-bgm", 90, 100, 0]>
となります。

なお、ボリューム、ピッチ、パンについては省略可能です。
省略した場合、それぞれ通常時のBGMのときのものと同じ値が設定されます。

時間による画面の色調変更を適用したくないマップを作ることもできます。
例えば、建物の中では画面の色調変更を適用しない場合、
該当のマップのメモ欄に
<NoEffectMap>
と記述してください。


イベントから時間帯を変更したい場合、スクリプトに
$gameMap.changeTimezone(変更する時間帯の値, 色調変更のフレーム数);
と記述してください。
なお、色調変更のフレーム数については、省略可能です。
色調変更のフレーム数を省略した場合、プラグインパラメータで指定した色調変更のフレーム数が指定されます。

例えば、時間帯を夜に変更したい場合は、
$gameMap.changeTimezone(3);
となります。

1フレームで時間帯を朝に変更したい場合は、
$gameMap.changeTimezone(0, 1);
となります。


時間帯によって出現する敵グループを設定したい場合、
敵グループ名に、
<時間帯>敵グループ名
と指定します。時間帯は、英語表記で指定してください。
例えば、深夜にのみ、こうもり２匹を出現させたい場合、
敵グループ名は、
<LateNight>こうもり*2
となります。


時間帯の色調変更を禁止する場合、プラグインコマンド「DisableTimeEffect」を実行してください。
逆に時間帯の色調変更を許可する場合、プラグインコマンド「EnableTimeEffect」を実行してください。
ツクールMVの場合は以下の形式でプラグインコマンドを実行できます。
・時間帯の色調変更を禁止
AdvanceTimeSystem DisableTimeEffect
・時間帯の色調変更を許可
AdvanceTimeSystem EnableTimeEffect

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const AdvanceTimeSystemPluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];

(() => {
"use strict";

const params = PluginManager.parameters(AdvanceTimeSystemPluginName);
const TimezoneVariableID = parseInt(params["TimezoneVariableID"]);
const EnableAdvanceTimeSwitchID = parseInt(params["EnableAdvanceTimeSwitchID"]);

const MorningSteps = parseInt(params["MorningSteps"]);
const NoonSteps = parseInt(params["NoonSteps"]);
const EveningSteps = parseInt(params["EveningSteps"]);
const NightSteps = parseInt(params["NightSteps"]);
const LateNightSteps = parseInt(params["LateNightSteps"]);
const DawnSteps = parseInt(params["DawnSteps"]);

const MorningTint = JSON.parse(params["MorningTint"]);
const NoonTint = JSON.parse(params["NoonTint"]);
const EveningTint = JSON.parse(params["EveningTint"]);
const NightTint = JSON.parse(params["NightTint"]);
const LateNightTint = JSON.parse(params["LateNightTint"]);
const DawnTint = JSON.parse(params["DawnTint"]);

const FadeFrame = parseInt(params["FadeFrame"]);

const Morning = 0;
const Noon = 1;
const Evening = 2;
const Night = 3;
const LateNight = 4;
const Dawn = 5;

let $timezoneDatas = null;

class Timezone {
    constructor(steps, tint) {
        this._steps = steps;
        this._tint = tint;
    }

    get steps() { return this._steps }; 
    get tint() { return this._tint }; 
}

//class Game_Map
Game_Map.prototype.getNextTimezoneSteps = function() {
    return $timezoneDatas[this.nowTimezone()].steps;
};

const _Game_Map_initialize = Game_Map.prototype.initialize
Game_Map.prototype.initialize = function() {
    _Game_Map_initialize.call(this);
    this._nightBgm = undefined;
    this._isAdvanceTimeMap = undefined;
    this._noEffectMap = false;
    this.createTimezoneDatas();
    this._lastTimezone = this.nowTimezone() - 1;
    this._nextTimezoneSteps = this.getNextTimezoneSteps();
};

Game_Map.prototype.createTimezoneDatas = function() {
    $timezoneDatas = {};
    $timezoneDatas[Morning] = new Timezone(MorningSteps, MorningTint);
    $timezoneDatas[Noon] = new Timezone(NoonSteps, NoonTint);
    $timezoneDatas[Evening] = new Timezone(EveningSteps, EveningTint);
    $timezoneDatas[Night] = new Timezone(NightSteps, NightTint);
    $timezoneDatas[LateNight] = new Timezone(LateNightSteps, LateNightTint);
    $timezoneDatas[Dawn] = new Timezone(DawnSteps, DawnTint);
}

Game_Map.prototype.getTimezoneValue = function(timezoneName) {
    switch (timezoneName) {
    case "Morning":
        return Morning;
    case "Noon":
        return Noon;
    case "Evening":
        return Evening;
    case "Night":
        return Night;
    case "LateNight":
        return LateNight;
    case "Dawn":
        return Dawn;
    }
    return null;
}

const _Game_Map_setup = Game_Map.prototype.setup
Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId);
    this._nightBgm = undefined;
    this._isAdvanceTimeMap = undefined;
    if ($dataMap.meta.NoEffectMap) {
        this.disableTimeEffect();
    } else {
        this.enableTimeEffect();
    }
};

Game_Map.prototype.enableTimeEffect = function() {
    this._noEffectMap = false;
    $gameScreen.startTint($timezoneDatas[this.nowTimezone()].tint, 1);
};

Game_Map.prototype.disableTimeEffect = function() {
    this._noEffectMap = true;
    $gameScreen.startTint([0, 0, 0, 0], 1);
};

Game_Map.prototype.nowTimezone = function() {
    return $gameVariables.value(TimezoneVariableID);
};

Game_Map.prototype.changeTimezone = function(timezone, fadeFrame = FadeFrame) {
    $gameVariables.setValue(TimezoneVariableID, timezone);
    if (!this._noEffectMap) $gameScreen.startTint($timezoneDatas[timezone].tint, fadeFrame);
    this._nextTimezoneSteps = this.getNextTimezoneSteps();
};

Game_Map.prototype.firstTimezone = function() {
    return Morning;
}

Game_Map.prototype.lastTimezone = function() {
    return Dawn;
}

Game_Map.prototype.advanceTimezone = function() {
    if (this.nowTimezone() < this.lastTimezone()) {
        this.changeTimezone(this.nowTimezone() + 1);
    } else {
        this.changeTimezone(this.firstTimezone());
    }
};

Game_Map.prototype.advanceTime = function() {
    this._nextTimezoneSteps--;
    if (this._nextTimezoneSteps === 0) this.advanceTimezone();
};

Game_Map.prototype.encounterList = function() {
    return $dataMap.encounterList.filter((encounter) => {
        const encounterTimezone = this.getEncounterTimezone(encounter);
        if (encounterTimezone) {
            if (encounterTimezone === this.nowTimezone()) return true;
            return false;
        }
        return true;
    });
};

Game_Map.prototype.getEncounterTimezone = function(encounter) {
    const troop = $dataTroops[encounter.troopId]
    if (troop.name.match(/^<(.+)>/)) return this.getTimezoneValue(RegExp.$1)
    return null;
};

Game_Map.prototype.autoplay = function() {
    if ($dataMap.autoplayBgm) {
        if ($gamePlayer.isInVehicle()) {
            $gameSystem.saveWalkingBgm2();
        } else {
            if (this.nowTimezone() >= Night && this.nightBgm()) {
                AudioManager.playBgm(this.nightBgm());
            } else {
                AudioManager.playBgm($dataMap.bgm);
            }
        }
    }
    if ($dataMap.autoplayBgs) AudioManager.playBgs($dataMap.bgs);
};

Game_Map.prototype.nightBgm = function() {
    if (this._nightBgm === undefined) {
        if ($dataMap.meta.NightBgm) {
            const bgmData = JSON.parse($dataMap.meta.NightBgm);
            const name = bgmData[0];
            const pitch = (bgmData[1] ? bgmData[1] : $dataMap.bgm.pitch);
            const volume = (bgmData[2] ? bgmData[2] : $dataMap.bgm.volume);
            const pan = (bgmData[3] ? bgmData[3] : $dataMap.bgm.pan);
            const bgm = {
                name: name,
                pitch: pitch,
                volume: volume,
                pan: pan
            };
            this._nightBgm = bgm;
        } else {
            this._nightBgm = null;
        }
    }
    return this._nightBgm;
};

Game_Map.prototype.isAdvanceTimeMap = function() {
    if (this._isAdvanceTimeMap === undefined) {
        if ($dataMap.meta.AdvanceTimeMap) {
            this._isAdvanceTimeMap = true;
        } else {
            this._isAdvanceTimeMap = false;
        }
    }
    return this._isAdvanceTimeMap;
};

Game_Map.prototype.isEnableAdvanceTime = function() {
    if (this._noEffectMap) return false;
    if (EnableAdvanceTimeSwitchID === 0) return true;
    return $gameSwitches.value(EnableAdvanceTimeSwitchID);
};

// class Game_Player
const _Game_Player_increaseSteps = Game_Player.prototype.increaseSteps
Game_Player.prototype.increaseSteps = function() {
    _Game_Player_increaseSteps.call(this);
    if ($gameMap.isAdvanceTimeMap() && $gameMap.isEnableAdvanceTime()) $gameMap.advanceTime();
};


// Register plugin command.
if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(AdvanceTimeSystemPluginName, "EnableTimeEffect", () => {
        $gameMap.enableTimeEffect();
    });

    PluginManager.registerCommand(AdvanceTimeSystemPluginName, "DisableTimeEffect", () => {
        $gameMap.disableTimeEffect();
    });
} else {
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command !== "AdvanceTimeSystem") return;
        switch (args[0]) {
        case "EnableTimeEffect":
            $gameMap.enableTimeEffect();
            break;
        case "DisableTimeEffect":
            $gameMap.disableTimeEffect();
            break;
        }
    };
}

})();
