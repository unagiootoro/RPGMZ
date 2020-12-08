/*:
@target MV MZ
@plugindesc 連続魔法 v1.2.0
@author うなぎおおとろ

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
一回の行動で連続で魔法を使用できるようになるステート/武器/防具/スキルを作成可能にするプラグインです。
ドラクエの山彦の帽子みたいなのを作ることができます。

[使い方]
連続魔法を可能にしたいステート/武器/防具/スキルのメモ欄に
<DoubleMagic>
と記述してください。

<DoubleMagic>を記載したのが、ステート/武器/防具/スキルのいずれかによって
連続魔法が使用可能になるタイミングが異なります。
ステートに記載した場合は、当該ステートになっている間、連続魔法が可能になります。
武器/防具に記載した場合は、当該武器/防具を装備している間、連続魔法が可能になります。
スキルに記載した場合、当該スキルを習得していれば連続魔法が可能になります。

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const DoubleMagicPluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];

(() => {
"use strict";

const params = PluginManager.parameters(DoubleMagicPluginName);
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

Game_Battler.prototype.isContinuousMagic = function() {
    for (const stateId of this._states) {
        if ($dataStates[stateId].meta.DoubleMagic) return true;
    }
    return false;
};


/* class Game_Actor */
Game_Actor.prototype.isContinuousMagic = function() {
    const result = Game_Battler.prototype.isContinuousMagic.call(this);
    if (result) return true;
    for (const equip of this._states) {
        if (equip.meta.DoubleMagic) return true;
    }
    for (const skillId of this._skills) {
        if ($dataSkills[skillId].meta.DoubleMagic) return true;
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
    if (this.subject().isContinuousMagic()) {
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
    this.push('addText', UseConstnuousMagicMessage);
    if (this._methods.length === numMethods) {
        this.push('wait');
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
})();
