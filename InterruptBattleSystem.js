/*:
@plugindesc その場で行動する戦闘システム v1.4.0
@author うなぎおおとろ(twitter https://twitter.com/unagiootoro8388)

@help
自分のターンが来た時にコマンドを入力できるようにするプラグインです。

[使用方法]
このプラグインは、導入するだけで使用できます。

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

(() => {
"use strict";

/* static class BattleManager */
const _BattleManager_initMembers = BattleManager.initMembers;
BattleManager.initMembers = function() {
    _BattleManager_initMembers.call(this);
    this._actorCommandSelected = false;
    this._firstInputPartyCommandFinished = false;
    this._turnStarted = false;
};

BattleManager.firstInputPartyCommandFinish = function() {
    this._firstInputPartyCommandFinished = true;
}

BattleManager.isFirstInputPartyCommandFinished = function() {
    return this._firstInputPartyCommandFinished;
}

BattleManager.startInputPhase = function() {
    this._phase = "input";
};

BattleManager.setActor = function(actor) {
    if (Utils.RPGMAKER_NAME === "MV") {
        this._actorIndex = $gameParty.members().indexOf(actor);
    } else {
        this._currentActor = actor;
    }
};

BattleManager.setActorCommandSelected = function(actorCommandSelected) {
    this._actorCommandSelected = actorCommandSelected;
};

BattleManager.isActorCommandSelected = function() {
    return this._actorCommandSelected;
};

if (Utils.RPGMAKER_NAME === "MZ") {
    BattleManager.isInputting = function() {
        return this._phase === "input";
    };
}

if (Utils.RPGMAKER_NAME === "MZ") {

    BattleManager.processTurn = function() {
        const subject = this._subject;
        const action = subject.currentAction();
        if (action) {
            if (subject instanceof Game_Actor) {
                this.actorPrepareAction();
            } else {
                this.enemyPrepareAction();
            }
        } else {
            this.endAction();
            this._subject = null;
        }
    };

} else {

    BattleManager.processTurn = function() {
        const subject = this._subject;
        const action = subject.currentAction();
        if (action) {
            if (subject instanceof Game_Actor) {
                this.actorPrepareAction();
            } else {
                this.enemyPrepareAction();
            }
        } else {
            subject.onAllActionsEnd();
            this.refreshStatus();
            this._logWindow.displayAutoAffectedStatus(subject);
            this._logWindow.displayCurrentState(subject);
            this._logWindow.displayRegeneration(subject);
            this._subject = this.getNextSubject();
        }
    };

}

BattleManager.actorPrepareAction = function() {
    const subject = this._subject;
    const action = subject.currentAction();
    if (this._actorCommandSelected) {
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
        this._actorCommandSelected = false;
    } else {
        action.prepare();
        if (action.item()) {
            this._actorCommandSelected = true;
        } else {
            this.setActor(subject);
            this.startInputPhase();
        }
    }
};

BattleManager.enemyPrepareAction = function() {
    const subject = this._subject;
    const action = subject.currentAction();
    action.prepare();
    if (action.isValid()) {
        this.startAction();
    }
    subject.removeCurrentAction();
};

BattleManager.resumeTurn = function() {
    this._phase = "turn";
    if (Utils.RPGMAKER_NAME === "MV") {
        this.clearActor();
    }
    this._logWindow.startTurn();
};

const _BattleManager_endTurn = BattleManager.endTurn;
BattleManager.endTurn = function() {
    _BattleManager_endTurn.call(this);
    this._turnStarted = false;
};

BattleManager.selectNextCommand = function() {
    if (this._turnStarted) {
        this.resumeTurn();
    } else {
        this.startTurn();
        this._turnStarted = true;
    }
};


/* class Scene_Battle */
const _Scene_Battle_commandFight = Scene_Battle.prototype.commandFight;
Scene_Battle.prototype.commandFight = function() {
    if (BattleManager.isFirstInputPartyCommandFinished()) {
        this.changeInputWindow();
    } else {
        _Scene_Battle_commandFight.call(this);
    }
    BattleManager.firstInputPartyCommandFinish();
};

const _Scene_Battle_commandEscape = Scene_Battle.prototype.commandEscape;
Scene_Battle.prototype.commandEscape = function() {
    BattleManager.setActorCommandSelected(false);
    _Scene_Battle_commandEscape.call(this);
};

if (Utils.RPGMAKER_NAME === "MV") {
    Scene_Battle.prototype.updateBattleProcess = function() {
        if (!this.isAnyInputWindowActive() || BattleManager.isAborting() || BattleManager.isBattleEnd()) {
            BattleManager.update();
            if (!BattleManager.isActorCommandSelected()) this.changeInputWindow();
        }
    };
}

if (Utils.RPGMAKER_NAME === "MZ") {
    Scene_Battle.prototype.updateInputWindowVisibility = function() {
        if ($gameMessage.isBusy()) {
            this.closeCommandWindows();
            this.hideSubInputWindows();
        } else if (this.needsInputWindowChange()) {
            this.changeInputWindow();
        }
    };
}

if (Utils.RPGMAKER_NAME === "MZ") {
    Scene_Battle.prototype.needsInputWindowChange = function() {
        const windowActive = this.isAnyInputWindowActive();
        const inputting = BattleManager.isInputting();
        if (windowActive && inputting) {
            return false;
        }
        return !BattleManager.isActorCommandSelected();
    };    
}


Scene_Battle.prototype.selectPreviousCommand = function() {
    this.startPartyCommandSelection();
};

Scene_Battle.prototype.changeInputWindow = function() {
    if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {
            this.startActorCommandSelection();
        } else {
            if (BattleManager.isFirstInputPartyCommandFinished()) {
                this.selectNextCommand();
            } else {
                this.startPartyCommandSelection();
            }
        }
    } else {
        this.endCommandSelection();
    }
};

const _Scene_Battle_selectNextCommand = Scene_Battle.prototype.selectNextCommand;
Scene_Battle.prototype.selectNextCommand = function() {
    _Scene_Battle_selectNextCommand.call(this);
    if (BattleManager.actor()) {
        BattleManager.setActorCommandSelected(true);
    }
};

})();
