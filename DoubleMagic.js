/*:
@target MV MZ
@plugindesc 連続魔法
@author うなぎおおとろ(twitter https://twitter.com/unagiootoro8388)

@param MagicSkillTypeId
@type number
@default 1
@desc
「魔法」のスキルタイプIDを指定します。

@param EnableUseConstnuousMagicMessage
@type boolean
@default true
@desc
trueを指定すると、2回目の魔法発動時のメッセージを変更します。

@param UseConstnuousMagicMessage
@type string
@default 呪文がやまびとなってこだます！！
@desc
2回目の魔法発動時のメッセージを指定します。

@help
一回の行動で連続で魔法を使用できるようになるステートを作成可能にするプラグインです。
FFの連続魔みたいなのを作ることができます。
また、「ステート付与装備」プラグインと併用すれば、ドラクエの山彦の帽子みたいなものを作ることもできます。

[使い方]
連続魔法を可能にしたいステートのメモ欄に
<DoubleMagic>
と記述してください。

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。

[更新履歴]
v1.1.0 プラグインパラメータを変更
v1.0.0 新規作成
*/
{
    "use strict";

    const pluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];
    const params = PluginManager.parameters(pluginName);
    const MagicSkillTypeId = parseInt(params["MagicSkillTypeId"]);
    const EnableUseConstnuousMagicMessage = (params["EnableUseConstnuousMagicMessage"] === "true" ? true : false);
    const UseConstnuousMagicMessage = params["UseConstnuousMagicMessage"];

    /* class Game_Battler */
    const _Game_Battler_removeCurrentAction = Game_Battler.prototype.removeCurrentAction
    Game_Battler.prototype.removeCurrentAction = function() {
        const action = this.currentAction();
        action.reduceContinuousActionCount();
        if (action.continuousActionCount() === 0) {
            _Game_Battler_removeCurrentAction.call(this);
        }
    };


    /* class Game_Actor */
    Game_Actor.prototype.isContinuousMagic = function() {
        for (let stateId of this._states) {
            if ($dataStates[stateId].meta.DoubleMagic) {
                return true;
            }
        }
        return false;
    };


    /* class Game_Action */
    const _Game_Action_initialize = Game_Action.prototype.initialize;
    Game_Action.prototype.initialize = function(subject, forcing) {
        _Game_Action_initialize.call(this, subject, forcing);
        this._continuousActionCount = 1;
        this._maxContinuousActionCount = 1;
    };

    const _Game_Action_setSkill = Game_Action.prototype.setSkill;
    Game_Action.prototype.setSkill = function(skillId) {
        _Game_Action_setSkill.call(this, skillId);
        if (this.subject() instanceof Game_Actor && this.subject().isContinuousMagic()) {
            if (this.item().stypeId === MagicSkillTypeId) {
                this._continuousActionCount = 2;
                this._maxContinuousActionCount = 2;
            }
        }
    };

    Game_Action.prototype.continuousActionCount = function() {
        return this._continuousActionCount;
    };

    Game_Action.prototype.reduceContinuousActionCount = function() {
        this._continuousActionCount -= 1;
    };

    Game_Action.prototype.isFirstAction = function() {
        return this._maxContinuousActionCount === this._continuousActionCount;
    }


    /* class Window_BattleLog */
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        const item = action.item();
        if (action.isFirstAction()) {
            this.push("performActionStart", subject, action);
            this.push("waitForMovement");
        }
        this.push("performAction", subject, action);   
        this.push("showAnimation", subject, targets.clone(), item.animationId);
        if (action.isFirstAction() || !EnableUseConstnuousMagicMessage) {
            this.displayAction(subject, item);
        } else {
            this.displayConstinuousAction(subject, item);
        }
    };

    Window_BattleLog.prototype.displayConstinuousAction = function(subject, item) {
        const numMethods = this._methods.length;
        this.push("addText", UseConstnuousMagicMessage);
        if (this._methods.length === numMethods) {
            this.push("wait");
        }
    };

    Window_BattleLog.prototype.endAction = function(subject) {
        const action = subject.currentAction();
        this.push("waitForNewLine");
        this.push("clear");
        if (!action) {
            this.push("performActionEnd", subject);
        }
    };
};
