/*:
@target MV MZ
@plugindesc アナログスティック拡張 v1.1.2
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/AnalogStickEx.js

@help
アナログスティックに対応するプラグインです。
左右のアナログスティックの角度と倒された強さを
プラグインコマンドで取得することができるようになります。
また、ドット移動システムと併用することで360度移動することも可能になります。

【使用方法】
■ アナログスティックの状態の取得
プラグインコマンド「スティック状態取得」を実行することで
スティックの角度と倒れた強さを取得することができます。
角度は0～359度、強さは0～1000の値となります。

ツクールMVの場合は下記のプラグインコマンドを実行してください。
AnalogStickEx GetStickState left or right スティックの角度を格納する変数ID 倒れた強さを格納する変数ID
(例) 右スティックの状態を取得し、角度を変数ID1に倒れた強さを変数ID2に格納する場合
AnalogStickEx GetStickState right 1 2

■ スクリプトからアナログスティックの状態を取得する
以下のスクリプトによってスティックの状態を取得できます。
const [rad, power] = Input.leftStick; // 左スティックの状態を取得
または
const [rad, power] = Input.rightStick; // 右スティックの状態を取得

このとき、radはスティックの方向をラジアンで取得したもの、
powerはスティックが倒された強さ(0.0～1.0)を表します。

■ ドット移動システムとの併用
基本的に導入するだけで使用可能です。
ドット移動システム、仮想スティックと併用する場合、以下の順に導入してください。
・ドット移動システム
・仮想スティック
・アナログスティック拡張

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@param EnabledMove360SwitchId
@text 360度移動有効化スイッチID
@type switch
@default 0
@desc
360度移動機能の有効/無効を判定するスイッチIDを指定します。

@param EnabledStickDashSwitchId
@text スティックダッシュ有効化スイッチID
@type switch
@default 0
@desc
スティックの強弱によってダッシュする機能の有効/無効を判定するスイッチIDを指定します。


@command GetStickState
@text スティック状態取得
@desc
スティックの状態を取得します。

@arg LeftOrRight
@text 左or右
@type select
@option 左
@value left
@option 右
@value right
@default left
@desc
左右どちらのスティックの情報を取得するかを設定します。

@arg StickDegVariableId
@text スティック角度変数
@type variable
@default 0
@desc
スティックの角度を格納する変数を指定します。角度の範囲は0～359です。

@arg StickPowerVariableId
@text スティックパワー変数
@type variable
@default 0
@desc
スティックを倒したパワーを格納する変数を指定します。パワーの範囲は0～1000です。
*/

const AnalogStickExPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {

const params = PluginManager.parameters(AnalogStickExPluginName);
const PP = {
    EnabledMove360SwitchId: parseInt(params["EnabledMove360SwitchId"]),
    EnabledStickDashSwitchId: parseInt(params["EnabledStickDashSwitchId"]),
};

const getStickStatePC = (leftOrRight, stickDegVariableId, stickPowerVariableId) => {
    let rad, power;
    if (leftOrRight === "left") {
        [rad, power] = Input.leftStick;
    } else if (leftOrRight === "right") {
        [rad, power] = Input.rightStick;
    } else {
        throw new Error(`LeftOrRight(${leftOrRight}) is invalid.`);
    }
    let deg = AnalogStickUtils.rad2deg(rad);
    deg = AnalogStickUtils.degNormalization(Math.round(deg));
    const intPower = Math.round(power * 1000);
    if (stickDegVariableId > 0) $gameVariables.setValue(stickDegVariableId, deg);
    if (stickPowerVariableId > 0) $gameVariables.setValue(stickPowerVariableId, intPower);
};

if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(AnalogStickExPluginName, "GetStickState", (args) => {
        const leftOrRight = args.LeftOrRight;
        const stickDegVariableId = parseInt(args.StickDegVariableId);
        const stickPowerVariableId = parseInt(args.StickPowerVariableId);
        getStickStatePC(leftOrRight, stickDegVariableId, stickPowerVariableId);
    });
}

const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command !== AnalogStickExPluginName) return;
    switch (args[0]) {
    case "GetStickState":
        const leftOrRight = args[1];
        const stickDegVariableId = parseInt(args[2]);
        const stickPowerVariableId = parseInt(args[3]);
        getStickStatePC(leftOrRight, stickDegVariableId, stickPowerVariableId);
        break;
    }
};


const _Input_clear = Input.clear;
Input.clear = function() {
    _Input_clear.call(this);
    this._analogStickState = {};
};

const _Input__updateGamepadState = Input._updateGamepadState;
Input._updateGamepadState = function(gamepad) {
    _Input__updateGamepadState.call(this, gamepad);
    const axes = gamepad.axes;
    if (axes.length >= 4) {
        this._analogStickState["stick_left_x"] = axes[0];
        this._analogStickState["stick_left_y"] = axes[1];
        this._analogStickState["stick_right_x"] = axes[2];
        this._analogStickState["stick_right_y"] = axes[3];
    }
};

Input._getStickState = function(stickType) {
    let x, y;
    if (stickType === "leftStick") {
        x = this._analogStickState["stick_left_x"];
        y = this._analogStickState["stick_left_y"];
    } else if (stickType === "rightStick") {
        x = this._analogStickState["stick_right_x"];
        y = this._analogStickState["stick_right_y"];
    } else {
        return [0, 0];
    }
    let rad = Math.atan2(y, x);
    if (Number.isNaN(rad)) rad = 0;
    let power = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    power = power > 1 ? 1 : power;
    return [rad, power];
}

Object.defineProperty(Input, "leftStick", {
    get: function() {
        return this._getStickState("leftStick");
    },
    configurable: true
});

Object.defineProperty(Input, "rightStick", {
    get: function() {
        return this._getStickState("rightStick");
    },
    configurable: true
});

let STICK_MODE;
if (typeof VirtualPadPluginName !== "undefined") {
    const virtualPadPluginParams = PluginManager.parameters(VirtualPadPluginName)
    STICK_MODE = parseInt(virtualPadPluginParams["STICK_MODE"]);
}

class AnalogStickUtils {
    static degNormalization(deg) {
        if (deg >= 360) deg = deg % 360;
        if (deg < 0) {
            let rdeg = -deg;
            if (rdeg > 360) rdeg = rdeg % 360;
            deg = 360 - rdeg;
        }
        return deg;
    }

    static rad2deg(rad) {
        return (rad * 180 / Math.PI) + 90;
    }

    static deg2rad(deg) {
        return (deg - 90) * Math.PI / 180;
    }
}

class DotMoveAnalogStickUtils {
    static getAnalogStickInput() {
        const [rad, power] = Input.leftStick;
        const deg = AnalogStickUtils.rad2deg(rad);
        return [deg, power];
    }

    static isEnabledStickDash() {
        if (PP.EnabledStickDashSwitchId === 0) return true;
        return $gameSwitches.value(PP.EnabledStickDashSwitchId);
    }

    static isEnabledMove360() {
        if (PP.EnabledMove360SwitchId === 0) return true;
        return $gameSwitches.value(PP.EnabledMove360SwitchId);
    }
}


Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
        let direction = this.getInputDirection();
        let [deg, power] = DotMoveAnalogStickUtils.getAnalogStickInput();

        let margin;
        if (DotMoveAnalogStickUtils.isEnabledStickDash()) {
            margin = 0.25;
        } else {
            margin = 0.5;
        }

        if (power >= margin) {
            $gameTemp.clearDestination();
            if (typeof DotMoveSystemPluginName !== "undefined") {
                if (DotMoveAnalogStickUtils.isEnabledStickDash()) {
                    if (power >= 0.9) {
                        this._dashing = true;
                    } else {
                        this._dashing = false;
                    }
                }

                if (DotMoveAnalogStickUtils.isEnabledMove360()) {
                    this.dotMoveByDeg(deg);
                } else {
                    direction = DotMoveUtils.deg2direction(deg);
                    this.executeMove(direction);
                }
            }
            return;
        } else if (direction > 0) {
            $gameTemp.clearDestination();
        } else {
            if (typeof VirtualPadPluginName !== "undefined") {
                if (STICK_MODE === 1) {
                    direction = $virtualPad.dir8();
                } else if (STICK_MODE === 2) {
                    deg = $virtualPad.deg();
                    if (typeof DotMoveSystemPluginName !== "undefined") {
                        if (deg != null) this.dotMoveByDeg(deg);
                    } else {
                        throw new Error("DotMoveSystem.js is not installed.");
                    }
                } else {
                    direction = $virtualPad.dir4();
                }
            } else {
                if ($gameTemp.isDestinationValid()) {
                    const x = $gameTemp.destinationX();
                    const y = $gameTemp.destinationY();
                    direction = this.findDirectionTo(x, y);
                }
            }
        }
        if (direction > 0) {
            // Yami_8DirEx.jsとの併用に対応
            if (typeof Game_Player.prototype.processMoveByInput !== "undefined") {
                this.processMoveByInput(direction);
            } else {
                this.executeMove(direction);
            }   
        }
    }
};

window.AnalogStickUtils = AnalogStickUtils;
window.DotMoveAnalogStickUtils = DotMoveAnalogStickUtils;

})();
