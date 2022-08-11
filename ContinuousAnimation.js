/*:
@target MZ
@plugindesc continuous animation v1.0.0
@author unagiootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/ContinuousAnimation.js
@help
The animation displayed on the map can be used for menus, battle scenes, etc.
It is a plug-in that continues to display even if it is sandwiched.

【How to use】
This plugin can be used just by installing it.

※Important point
Animation when resuming with the save data after saving
Continuous display is not supported.

【License】
This plugin is available under the terms of the MIT license.
*/

/*:ja
@target MZ
@plugindesc 継続アニメーション v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/ContinuousAnimation.js
@help
マップで表示中のアニメーションをメニューや戦闘などのシーンを
挟んでも継続して表示するプラグインです。

【使用方法】
このプラグインは導入するだけで使用可能です。

※注意点
セーブした後にそのセーブデータで再開した場合のアニメーションの
継続表示については非対応です。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

"use strict";

const ContinuousAnimation = {};

{
    class BaseAnimationBackupInfo {
        constructor(animationId, targets, mirror) {
            this._animationId = animationId;
            this._targets = targets;
            this._mirror = mirror;
        }

        get animationId() { return this._animationId; }
        get targets() { return this._targets; }
        get mirror() { return this._mirror; }
    }

    class MZAnimationBackupInfo extends BaseAnimationBackupInfo {
        constructor(animationId, targets, mirror, frameIndex, delay) {
            super(animationId, targets, mirror);
            this._frameIndex = frameIndex;
            this._delay = delay;
        }

        get frameIndex() { return this._frameIndex; }
        get delay() { return this._delay; }
    }

    class MVAnimationBackupInfo extends BaseAnimationBackupInfo {
        constructor(animationId, targets, mirror, duration) {
            super(animationId, targets, mirror);
            this._duration = duration;
        }

        get duration() { return this._duration; }
    }

    class AnimationBackupManager {
        static initialize() {
            this._backupInfos = [];
        }

        static backup(animationSprites) {
            for (const sprite of animationSprites) {
                const backupInfo = sprite.makeBackupInfo();
                if (backupInfo) this._backupInfos.push(backupInfo);
            }
        }

        static restore() {
            for (const backupInfo of this._backupInfos) {
                $gameTemp.requestContinueAnimation(backupInfo);
            }
            this._backupInfos = [];
        }
    }

    {
        const _initialize = Spriteset_Base.prototype.initialize;
        Spriteset_Base.prototype.initialize = function() {
            _initialize.call(this);
            this._lastAnimationRequest = {};
        };

        const _createAnimation = Spriteset_Base.prototype.createAnimation;
        Spriteset_Base.prototype.createAnimation = function(request) {
            this._lastAnimationRequest = request;
            _createAnimation.call(this, request);
        };

        const _createAnimationSprite = Spriteset_Base.prototype.createAnimationSprite;
        Spriteset_Base.prototype.createAnimationSprite = function(
            targets, animation, mirror, delay
        ) {
            _createAnimationSprite.call(this, targets, animation, mirror, delay);
            const backupInfo = this._lastAnimationRequest.backupInfo;
            if (!backupInfo) return;
            // createAnimationSpriteによって生成されたアニメーションSpriteを取得する。
            const sprite = this._animationSprites[this._animationSprites.length - 1];
            sprite.restoreBackupInfo(this._lastAnimationRequest.backupInfo);
        };
    }

    {
        const _initMembers = Sprite_Animation.prototype.initMembers;
        Sprite_Animation.prototype.initMembers = function() {
            _initMembers.call(this);
            this._restoreFrameIndex = 0;
        };

        Sprite_Animation.prototype.makeBackupInfo = function() {
            if (!this._playing) return null;
            return new MZAnimationBackupInfo(this._animation.id, this.targetObjects, this._mirror, this._frameIndex, this._delay);
        };

        Sprite_Animation.prototype.restoreBackupInfo = function(backupInfo) {
            this._restoreFrameIndex = backupInfo.frameIndex;
            this._delay = backupInfo.delay;
        };

        const _update = Sprite_Animation.prototype.update;
        Sprite_Animation.prototype.update = function() {
            if (this._restoreFrameIndex === 0) {
                _update.call(this);
            } else {
                Sprite.prototype.update.call(this);
                if (this._delay > 0) {
                    this._delay--;
                } else if (this._playing) {
                    if (!this._started && this.canStart()) {
                        if (this._effect) {
                            if (this._effect.isLoaded) {
                                this._handle = Graphics.effekseer.play(this._effect);
                                this._started = true;
                            } else {
                                EffectManager.checkErrors();
                            }
                        } else {
                            this._started = true;
                        }
                    }
                    if (this._started) {
                        for (let i = 0; i < this._restoreFrameIndex; i++) {
                            this.updateEffectGeometry();
                            SceneManager.updateEffekseer();
                        }
                        this._frameIndex = this._restoreFrameIndex;
                        this._restoreFrameIndex = 0;
                        this.updateEffectGeometry();
                        this.updateMain();
                        this.updateFlash();
                    }
                }
            }
        };
    }

    {
        Sprite_AnimationMV.prototype.makeBackupInfo = function() {
            return new MVAnimationBackupInfo(this._animation.id, this.targetObjects, this._mirror, this._duration);
        };

        Sprite_AnimationMV.prototype.restoreBackupInfo = function(backupInfo) {
            this._duration = backupInfo.duration;
        };
    }

    {
        // createSpritesetによってSpriteset_Mapの生成とupdateが行われるため、
        // それよりも前に継続アニメーションのリクエストを行う。
        const _createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
        Scene_Map.prototype.createDisplayObjects = function() {
            AnimationBackupManager.restore();
            _createDisplayObjects.call(this);
        };

        // シーンの終了を行う前にアニメーションのバックアップを行う。
        const _terminate = Scene_Map.prototype.terminate;
        Scene_Map.prototype.terminate = function() {
            this.backupAnimations();
            _terminate.call(this);
        };

        Scene_Map.prototype.backupAnimations = function() {
            const effectsContainer = this._spriteset._effectsContainer;
            const animationSprites = effectsContainer.children.filter(sprite => {
                return (sprite instanceof Sprite_Animation || sprite instanceof Sprite_AnimationMV);
            })
            AnimationBackupManager.backup(animationSprites);
        };
    }

    {
        Game_Temp.prototype.requestContinueAnimation = function(backupInfo) {
            const targets = backupInfo.targets;
            const animationId = backupInfo.animationId;
            const mirror = backupInfo.mirror;
            if ($dataAnimations[animationId]) {
                const request = { targets, animationId, mirror, backupInfo };
                this._animationQueue.push(request);
                for (const target of targets) {
                    if (target.startAnimation) {
                        target.startAnimation();
                    }
                }
            }
        };
    }

    AnimationBackupManager.initialize();

    ContinuousAnimation.BaseAnimationBackupInfo;
    ContinuousAnimation.MZAnimationBackupInfo;
    ContinuousAnimation.MVAnimationBackupInfo;
    ContinuousAnimation.AnimationBackupManager;    
}
