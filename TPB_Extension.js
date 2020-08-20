/*:
@plugindesc TPB戦闘を拡張します。
@author うなぎおおとろ(twitter https://twitter.com/unagiootoro8388)

@param FastForwardSpeed
@type number
@default 2
@desc
Shiftキーが押されている間、ゲージ進行を早送りするスピードを設定します。

@param FastForwardAnimation
@type boolean
@default true
@desc
trueを設定すると、Shiftキーが押されている間、アニメーション表示を早送りします。

@param OpenActorCommandSeFileName
@type string
@default Flash2
@desc
アクターコマンドがオープンしたときに再生するSEのファイル名を指定します。

@param OpenActorCommandSeVolume
@type number
@default 90
@desc
アクターコマンドがオープンしたときに再生するSEのvolumeを指定します。

@param OpenActorCommandSePitch
@type number
@default 150
@desc
アクターコマンドがオープンしたときに再生するSEのpitchを指定します。

@param OpenActorCommandSePan
@type number
@default 0
@desc
アクターコマンドがオープンしたときに再生するSEのpanを指定します。

@param WaitSkillOrItemWindow
@type boolean
@default true
@desc
trueを設定すると、スキルまたはアイテムの選択時はゲージの進行を停止します。

@param WaitPartyWindow
@type boolean
@default true
@desc
trueを設定すると、パーティウィンドウが開いている間はゲージの進行を停止します。

@param FixedStatusWindow
@type boolean
@default true
@desc
trueを設定すると、ステータスウィンドウを固定します。

@help
TPB戦闘を拡張するプラグインです。
このプラグインは、次の機能を提供します。
・Shiftキーが押されている間、ゲージ進行とアニメーションの早送り
・アクターコマンドが表示されたときにSEを再生
・pageup/pagedownによるアクターの順方向/逆方向への切り替え
・初回パーティコマンドの表示を無効化
・パーティウィンドウでゲージ進行の許可/停止切り替え
・スキル/アイテム選択画面でゲージ進行の許可/停止切り替え
・ステータスウィンドウの固定化

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const TPBExParams = {};

(() => {
    "use strict";

    const pluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];
    const params = PluginManager.parameters(pluginName);
    TPBExParams.FastForwardSpeed = parseInt(params["FastForwardSpeed"]);
    TPBExParams.FastForwardAnimation = (params["FastForwardAnimation"] === "true" ? true : false);

    TPBExParams.OpenActorCommandSeFileName = params["OpenActorCommandSeFileName"];
    TPBExParams.OpenActorCommandSeVolume = parseInt(params["OpenActorCommandSeVolume"]);
    TPBExParams.OpenActorCommandSePitch = parseInt(params["OpenActorCommandSePitch"]);
    TPBExParams.OpenActorCommandSePan = parseInt(params["OpenActorCommandSePan"]);

    TPBExParams.WaitSkillOrItemWindow = (params["WaitSkillOrItemWindow"] === "true" ? true : false);
    TPBExParams.WaitPartyWindow = (params["WaitPartyWindow"] === "true" ? true : false);

    TPBExParams.FixedStatusWindow = (params["FixedStatusWindow"] === "true" ? true : false);

    // When the shift key pressed, TPB gauge is fast forward.
    BattleManager.isFastForward = function() {
        if (SceneManager._scene instanceof Scene_Battle) return Input.isPressed("shift");
        return false;
    };

    const _Game_Battler_tpbAcceleration = Game_Battler.prototype.tpbAcceleration;
    Game_Battler.prototype.tpbAcceleration = function() {
        const accelaration = _Game_Battler_tpbAcceleration.call(this);
        if (BattleManager.isFastForward()) return accelaration * TPBExParams.FastForwardSpeed;
        return accelaration;
    };


    // When the shift key pressed, Show animation is fast forward.
    const _Sprite_Animation_updateMain = Sprite_Animation.prototype.updateMain;
    Sprite_Animation.prototype.updateMain = function() {
        if (!TPBExParams.FastForwardAnimation) return _Sprite_Animation_updateMain.call(this);
        this.processSoundTimings();
        this.processFlashTimings();
        this._frameIndex++;
        if (BattleManager.isFastForward()) {
            this.processSoundTimings();
            this.processFlashTimings();
            this._frameIndex++;
        }
        this.checkEnd();
    };

    const _Sprite_Animation_updateEffectGeometry = Sprite_Animation.prototype.updateEffectGeometry;
    Sprite_Animation.prototype.updateEffectGeometry = function() {
        if (!TPBExParams.FastForwardAnimation) return _Sprite_Animation_updateEffectGeometry.call(this);
        const scale = this._animation.scale / 100;
        const r = Math.PI / 180;
        const rx = this._animation.rotation.x * r;
        const ry = this._animation.rotation.y * r;
        const rz = this._animation.rotation.z * r;
        if (this._handle) {
            this._handle.setLocation(0, 0, 0);
            this._handle.setRotation(rx, ry, rz);
            this._handle.setScale(scale, scale, scale);
            if (BattleManager.isFastForward()) {
                this._handle.setSpeed(this._animation.speed / 100 * 2);
            } else {
                this._handle.setSpeed(this._animation.speed / 100);
            }
        }
    };

    const _Sprite_AnimationMV_updateMain = Sprite_AnimationMV.prototype.updateMain;
    Sprite_AnimationMV.prototype.updateMain = function() {
        if (!TPBExParams.FastForwardAnimation) return _Sprite_AnimationMV_updateMain.call(this);
        if (this.isPlaying() && this.isReady()) {
            if (this._delay > 0) {
                this._delay--;
            } else {
                this.progressFrame();
                if (BattleManager.isFastForward()) this.progressFrame();
            }
        }
    };

    Sprite_AnimationMV.prototype.progressFrame = function() {
        this._duration--;
        this.updatePosition();
        if (this._duration % this._rate === 0) {
            this.updateFrame();
        }
        if (this._duration <= 0) {
            this.onEnd();
        }
    };

    /* class Scene_Battle */
    const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.call(this);
        this._actorCommandWindow.setHandler("pageup", this.previousActor.bind(this));
        this._actorCommandWindow.setHandler("pagedown", this.nextActor.bind(this));
    };

    Scene_Battle.prototype.canChangeActor = function() {
        const numCanInputMembers = $gameParty.battleMembers().filter(member => member.canInput()).length;
        return numCanInputMembers >= 2;
    };

    Scene_Battle.prototype.selectPreviousCommand = function(tpbForward = true) {
        if (!this.canChangeActor()) return;
        BattleManager.selectPreviousCommand(tpbForward);
        this.changeInputWindow();
    };

    Scene_Battle.prototype.nextActor = function() {
        this.selectPreviousCommand(true);
    };
    
    Scene_Battle.prototype.previousActor = function() {
        this.selectPreviousCommand(false);
    };

    Scene_Battle.prototype.isTimeActive = function() {
        const skillOrItemWindowActive = this._skillWindow.active || this._itemWindow.active;
        const partyCommandWindowActive = this._partyCommandWindow.active;
        if (BattleManager.isActiveTpb()) {
            if (TPBExParams.WaitSkillOrItemWindow && TPBExParams.WaitPartyWindow) {
                return !skillOrItemWindowActive && !partyCommandWindowActive;
            } else if (TPBExParams.WaitSkillOrItemWindow && !TPBExParams.WaitPartyWindow) {
                return !skillOrItemWindowActive;
            } else if (!TPBExParams.WaitSkillOrItemWindow && TPBExParams.WaitPartyWindow) {
                return !partyCommandWindowActive;
            }
            return true;
        } else {
            return !this.isAnyInputWindowActive();
        }
    };

    Scene_Battle.prototype.changeInputWindow = function() {
        this.hideSubInputWindows();
        if (BattleManager.isInputting()) {
            if (BattleManager.actor()) {
                if (!this._partyCommandWindow.active) this.startActorCommandSelection();
            } else {
                this.startPartyCommandSelection();
            }
        } else {
            this.endCommandSelection();
        }
    };

    Scene_Battle.prototype.commandFight = function() {
        this.endCommandSelection();
    };

    Scene_Battle.prototype.commandCancel = function() {
        this.startPartyCommandSelection();
    };

    const _Scene_Battle_statusWindowX = Scene_Battle.prototype.statusWindowX;
    Scene_Battle.prototype.statusWindowX = function() {
        if (!TPBExParams.FixedStatusWindow) return _Scene_Battle_statusWindowX.call(this);
        return this.statusWindowRect().x;
    };

    const _Scene_Battle_statusWindowRect = Scene_Battle.prototype.statusWindowRect;
    Scene_Battle.prototype.statusWindowRect = function() {
        if (!TPBExParams.FixedStatusWindow) return _Scene_Battle_statusWindowRect.call(this);
        const extra = 10;
        const ww = Graphics.boxWidth - 192;
        const wh = this.windowAreaHeight() + extra;
        const wx = 0;
        const wy = Graphics.boxHeight - wh + extra - 4;
        return new Rectangle(wx, wy, ww, wh);
    };

    /* static class BattleManager */
    const _BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        if (!this.isTpb()) throw new Error("This plugin can not used when turn battle.");
        _BattleManager_initMembers.call(this);
        this._tpbNeedsPartyCommand = false;
    };

    BattleManager.changeCurrentActor = function(forward) {
        let actor;
        if (forward) {
            actor = this.searchNextActor();
        } else {
            actor = this.searchPreviousActor();
        }
        this._currentActor = actor ? actor : null;
        this.startActorInput();
        // When the actor command is shown, SE is played.
        this.playActorInputSe();
    };

    BattleManager.playActorInputSe = function() {
        if (TPBExParams.OpenActorCommandSeFileName === "") return;
        const se = {
            name: TPBExParams.OpenActorCommandSeFileName,
            pan: TPBExParams.OpenActorCommandSePan,
            pitch: TPBExParams.OpenActorCommandSePitch,
            volume: TPBExParams.OpenActorCommandSeVolume,
        }
        AudioManager.playSe(se);
    };

    BattleManager.searchNextActor = function() {
        const members = $gameParty.battleMembers();
        const currentIndex = members.indexOf(this._currentActor);
        const startIndex = (currentIndex === -1 ? 0 : currentIndex + 1);
        for (let i = startIndex; i < members.length; i++) {
            const actor = members[i];
            if (actor.canInput()) return actor;
        }
        for (let i = 0; i < startIndex; i++) {
            const actor = members[i];
            if (actor.canInput()) return actor;
        }
        return null;
    };

    BattleManager.searchPreviousActor = function() {
        const members = $gameParty.battleMembers();
        const currentIndex = members.indexOf(this._currentActor);
        const startIndex = (currentIndex === -1 ? 0 : currentIndex - 1);
        for (let i = startIndex; i >= 0; i--) {
            const actor = members[i];
            if (actor.canInput()) return actor;
        }
        for (let i = members.length - 1; i > startIndex; i--) {
            const actor = members[i];
            if (actor.canInput()) return actor;
        }
        return null;
    };

    BattleManager.selectPreviousCommand = function(tpbForward = true) {
        if (this._currentActor) {
            if (this._currentActor.selectPreviousCommand()) {
                return;
            }
            this.cancelActorInput();
        }
        this.selectPreviousActor(tpbForward);
    };

    BattleManager.selectPreviousActor = function(tpbForward = true) {
        if (this.isTpb()) {
            this.changeCurrentActor(tpbForward);
            if (!this._currentActor) {
                this._inputting = $gameParty.canInput();
            }
        } else {
            this.changeCurrentActor(false);
        }
    };

    // Add pageup/pagedown button.
    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        this.updatePageButtons();
    };

    Scene_Battle.prototype.createPageButtons = function() {
        this._pageupButton = new Sprite_Button("pageup");
        this._pageupButton.x = 4;
        this._pageupButton.y = this.buttonY();
        const pageupRight = this._pageupButton.x + this._pageupButton.width;
        this._pagedownButton = new Sprite_Button("pagedown");
        this._pagedownButton.x = pageupRight + 4;
        this._pagedownButton.y = this.buttonY();
        this.addWindow(this._pageupButton);
        this.addWindow(this._pagedownButton);
        this._pageupButton.setClickHandler(this.previousActor.bind(this));
        this._pagedownButton.setClickHandler(this.nextActor.bind(this));
    };

    Scene_Battle.prototype.createButtons = function() {
        if (ConfigManager.touchUI) {
            this.createCancelButton();
            this.createPageButtons();
        }
    };

    Scene_Battle.prototype.updatePageButtons = function() {
        if (this._pageupButton && this._pagedownButton) {
            const enabled = this.arePageButtonsEnabled();
            this._pageupButton.visible = enabled;
            this._pagedownButton.visible = enabled;
        }
    };

    Scene_Battle.prototype.arePageButtonsEnabled = function() {
        return this.canChangeActor() && this._actorCommandWindow.active && this._actorCommandWindow.visible;
    };
})();
