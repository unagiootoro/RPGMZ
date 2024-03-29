/*:
@target MV MZ
@plugindesc virtual stick v1.1.4
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/VirtualStickController.js
@help
It is a plugin that introduces a virtual stick.

【How to use】
By changing the "stick mode" of the plug-in parameter
・ Move in 4 directions
・ Move in 8 directions
・ 360 degree movement
You can choose one of them.

If you choose to move in 8 directions or 360 degrees, you need to install the following plug-ins.
・ 8-direction movement: A plug-in that supports diagonal movement, or a dot movement plug-in
・ 8-direction movement: Dot movement plug-in
* For plug-ins that support diagonal movement
  We have confirmed the operation with "Yami_8DirEx.js" and "HalfMove.js".

When used in combination with other mobile plug-ins, this plug-in is
Please install below other mobile plugins.

【License】
This plugin is available under the terms of the MIT license.


@param STICK_MODE
@text stick mode
@type number
@default 0
@desc
Specifies the mode of the virtual stick.
0: 4 directions move 1: 8 directions move 2: 360 degrees move

@param PAD_SIZE
@text pad size
@type number
@ default 128
@desc
Specifies the size of the virtual stick.

@param STICK_SIZE
@text stick size
@type number
@default 64
@desc
Specifies the stick size of the virtual stick.

@param MARGIN
@text margin
@type number
@default 8
@desc
Specifies the pad center judgment margin.

@param ALWAYS_DUSH
@text always dash
@type boolean
@default false
@desc
If set to true, pad movement will always be a dash.

@param PAD_IMAGE_FILE_NAME
@text pad image file name
@type file
@dir img
@desc
Specify the file name of the pad image.

@param STICK_IMAGE_FILE_NAME
@text stick image file name
@type file
@dir img
@desc
Specify the file name of the stick image.

@param PAD_STROKE_COLOR
@text Pad border color
@type string
@default #0000aa
@desc
Specifies the color of the pad border.

@param PAD_FILL_COLOR
@text Pad fill color
@type string
@default #0000ff
@desc
Specifies the color of the pad fill.

@param PAD_OPACITY
@text pad transparency
@type number
@default 64
@desc
Specify the transparency of the pad from 0 to 255.

@param STICK_STROKE_COLOR
@text Stick border color
@type string
@default #0000aa
@desc
Specifies the color of the stick border.

@param STICK_FILL_GRAD1_COLOR
@text Stick fill gradient start
@type string
@default #ffffff
@desc
Stick fill Specifies the color at which the gradient starts.

@param STICK_FILL_GRAD2_COLOR
@text Stick fill gradient middle
@type string
@default #aaaaff
@desc
Stick fill gradient Specifies a color in the middle.

@param STICK_FILL_GRAD3_COLOR
@text Stick fill gradient end
@type string
@default #0000ff
@desc
Stick fill Specifies the color at the end of the gradient.
*/
/*:ja
@target MV MZ
@plugindesc 仮想スティック v1.1.4
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/VirtualStickController.js
@help
仮想スティックを導入するプラグインです。

【使用方法】
プラグインパラメータの「スティックモード」を変更することで、
・4方向移動
・8方向移動
・360度移動
のいずれかを選択することができます。

8方向移動または360度移動を選択する場合は下記のプラグインの導入が必要です。
・8方向移動: 斜め移動に対応したプラグイン、またはドット移動プラグイン
・360度移動: ドット移動プラグイン
※斜め移動に対応したプラグインについては
  「Yami_8DirEx.js」「HalfMove.js」で動作確認をしています。

なお、他の移動系プラグインと併用する場合、このプラグインは
他の移動系プラグインよりも下に導入してください。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@param STICK_MODE
@text スティックモード
@type number
@default 0
@desc
仮想スティックのモードを指定します。
0: 4方向移動  1: 8方向移動  2: 360度移動

@param PAD_SIZE
@text パッドサイズ
@type number
@default 128
@desc
仮想スティックのサイズを指定します。

@param STICK_SIZE
@text スティックサイズ
@type number
@default 64
@desc
仮想スティックのスティックのサイズを指定します。

@param MARGIN
@text マージン
@type number
@default 8
@desc
パッド中央判定のマージンを指定します。

@param ALWAYS_DUSH
@text 常時ダッシュ
@type boolean
@default false
@desc
trueを設定するとパッド移動が常にダッシュになります。

@param PAD_IMAGE_FILE_NAME
@text パッド画像ファイル名
@type file
@dir img
@desc
パッド画像のファイル名を指定します。

@param STICK_IMAGE_FILE_NAME
@text スティック画像ファイル名
@type file
@dir img
@desc
スティック画像のファイル名を指定します。

@param PAD_STROKE_COLOR
@text パッド枠線色
@type string
@default #0000aa
@desc
パッドの枠線の色を指定します。

@param PAD_FILL_COLOR
@text パッド塗りつぶし色
@type string
@default #0000ff
@desc
パッドの塗りつぶしの色を指定します。

@param PAD_OPACITY
@text パッド透明度
@type number
@default 64
@desc
パッドの透明度を0～255で指定します。

@param STICK_STROKE_COLOR
@text スティック枠線色
@type string
@default #0000aa
@desc
スティックの枠線の色を指定します。

@param STICK_FILL_GRAD1_COLOR
@text スティック塗りつぶしグラデーション開始
@type string
@default #ffffff
@desc
スティックの塗りつぶしグラデーション開始の色を指定します。

@param STICK_FILL_GRAD2_COLOR
@text スティック塗りつぶしグラデーション中間
@type string
@default #aaaaff
@desc
スティックの塗りつぶしグラデーション中間の色を指定します。

@param STICK_FILL_GRAD3_COLOR
@text スティック塗りつぶしグラデーション終端
@type string
@default #0000ff
@desc
スティックの塗りつぶしグラデーション終端の色を指定します。
*/

declare interface Game_Player {
    updateTouchPoint(): void;
    getInputDeg(): number | null;    
}

declare interface Scene_Map {
    updateVirtualStick(): void;
}

declare interface Spriteset_Map {
    _virtualStickSprite: VirtualStick.Sprite_VirtualStick;

    createVirtualStick(): void;
}


const VirtualStickPluginName = document.currentScript ? decodeURIComponent((document.currentScript as HTMLScriptElement).src.match(/^.*\/(.+)\.js$/)![1]) : "VirtualStickController";

let $virtualStickController!: VirtualStick.VirtualStickController;

namespace VirtualStick {
    const params = PluginManager.parameters(VirtualStickPluginName)

    const STICK_MODE = parseInt(params["STICK_MODE"]);
    const PAD_SIZE = parseInt(params["PAD_SIZE"]);
    const STICK_SIZE = parseInt(params["STICK_SIZE"]);
    const MARGIN = parseInt(params["MARGIN"]);
    const ALWAYS_DUSH = params["ALWAYS_DUSH"] === "true";
    const PAD_IMAGE_FILE_NAME = params["PAD_IMAGE_FILE_NAME"];
    const STICK_IMAGE_FILE_NAME = params["STICK_IMAGE_FILE_NAME"];
    const PAD_STROKE_COLOR = params["PAD_STROKE_COLOR"];
    const PAD_FILL_COLOR = params["PAD_FILL_COLOR"];
    const PAD_OPACITY = params["PAD_OPACITY"];
    const STICK_STROKE_COLOR = params["STICK_STROKE_COLOR"];
    const STICK_FILL_GRAD1_COLOR = params["STICK_FILL_GRAD1_COLOR"];
    const STICK_FILL_GRAD2_COLOR = params["STICK_FILL_GRAD2_COLOR"];
    const STICK_FILL_GRAD3_COLOR = params["STICK_FILL_GRAD3_COLOR"];


    type VirtualStickState = "open" | "closing" | "close";


    export class VirtualStickController {
        protected static CLOSING_WAIT_TIME = 4;

        protected _VirtualStickTouched!: boolean;
        protected _touchActionResult!: boolean;
        protected _visible!: boolean;
        protected _point!: Point | null;
        protected _deg!: number | null;
        protected _state!: VirtualStickState;
        protected _remainClosingWaitTime!: number;

        constructor() {
            this.reset();
        }

        update(): void {
            if (this._state === "closing") this.updateClosing();
        }

        updateClosing(): void {
            if (this._remainClosingWaitTime > 0) {
                this._remainClosingWaitTime--;
                if (this._remainClosingWaitTime === 0) {
                    this._visible = false;
                    this._point = null;
                    this._deg = null;
                    this._state = "close";
                }
            }
        }

        reset(): void {
            this._VirtualStickTouched = false;
            this._touchActionResult = false;
            this._visible = false;
            this._point = null;
            this._deg = null;
            this._state = "close";
            this._remainClosingWaitTime = 0;
        }

        isVisible(): boolean {
            return this._visible;
        }

        open(point: Point): void {
            this._state = "open";
            if (this._point) {
                const far = this.calcFar(this._point, point);
                if (far >= MARGIN) {
                    this._deg = this.calcDeg(this._point, point);
                } else {
                    this._deg = null;
                }
            } else {
                this._visible = true;
                this._point = point;
            }
        }

        close(): void {
            if (this._state === "open") {
                this._remainClosingWaitTime = VirtualStickController.CLOSING_WAIT_TIME;
                this._state = "closing";
            }
        }

        point(): Point | null {
            return this._point;
        }

        deg(): number | null {
            return this._deg;
        }

        dir4(): number {
            if (!this._deg) return 0;
            const deg = this._deg;
            if ((deg >= 315 && deg < 360) || (deg >= 0 && deg < 45)) {
                return 8;
            } else if (deg >= 45 && deg < 135) {
                return 6;
            } else if (deg >= 135 && deg < 225) {
                return 2;
            } else if (deg >= 225 && deg < 315) {
                return 4;
            }
            throw new Error(`${deg} is invalid`);
        }

        dir8(): number {
            if (!this._deg) return 0;
            const deg = this._deg;
            if ((deg >= 337.5 && deg < 360) || (deg >= 0 && deg < 22.5)) {
                return 8;
            } else if (deg >= 22.5 && deg < 67.5) {
                return 9;
            } else if (deg >= 67.5 && deg < 112.5) {
                return 6;
            } else if (deg >= 112.5 && deg < 157.5) {
                return 3;
            } else if (deg >= 157.5 && deg < 202.5) {
                return 2;
            } else if (deg >= 202.5 && deg < 247.5) {
                return 1;
            } else if (deg >= 247.5 && deg < 292.5) {
                return 4;
            } else if (deg >= 292.5 && deg < 337.5) {
                return 7;
            }
            throw new Error(`${deg} is invalid`);
        }

        touchActionResult(): boolean {
            return this._touchActionResult;
        }

        setTouchActionResult(result: boolean): void {
            this._touchActionResult = result;
        }

        virtualStickTouched(): boolean {
            return this._VirtualStickTouched;
        }

        setVirtualStickTouched(touched: boolean): void {
            this._VirtualStickTouched = touched;
        }

        calcDeg(fromPoint: Point, newPoint: Point): number {
            const ox = newPoint.x - fromPoint.x;
            const oy = newPoint.y - fromPoint.y;
            const rad = Math.atan2(oy, ox);
            let deg = rad / Math.PI * 180 + 90;
            if (deg > 360) deg = deg % 360;
            if (deg < 0) {
                let rdeg = -deg;
                if (rdeg > 360) rdeg = rdeg % 360;
                deg = 360 - rdeg;
            }
            return deg;
        }

        calcFar(fromPoint: Point, newPoint: Point): number {
            const xDiff = newPoint.x - fromPoint.x;
            const yDiff = newPoint.y - fromPoint.y;
            if (xDiff === 0 && yDiff === 0) return 0;
            return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        }
    }

    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        $virtualStickController = new VirtualStickController();
    };

    const _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _Scene_Map_create.call(this);
        $virtualStickController.reset();
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        $virtualStickController.setVirtualStickTouched(false);
        _Scene_Map_update.call(this);
        this.updateVirtualStick();
    };

    Scene_Map.prototype.updateVirtualStick = function() {
        $virtualStickController.update();
        if ($gameMap.isEventRunning() || this.isBusy()) {
            $virtualStickController.close();
        } else {
            if ($virtualStickController.virtualStickTouched()) {
                const screenX = TouchInput.x;
                const screenY = TouchInput.y;
                $virtualStickController.open(new Point(screenX, screenY));
            } else {
                $virtualStickController.close();
            }
        }
    };

    // 仮想パッド表示フラグをONにする
    const _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function(this: Scene_Map) {
        // DotMoveSystem_DecideTriggerExPluginName.jsとの併用に対応する
        if (typeof DotMoveSystem_DecideTriggerExPluginName !== "undefined") {
            const startEvent = this.checkCharacterEventStarted();
            if (startEvent) return;
        }

        if (Utils.RPGMAKER_NAME === "MZ") {
            if (TouchInput.isPressed() && !this.isAnyButtonPressed()) {
                $virtualStickController.setVirtualStickTouched(true);
            }
        } else {
            if (TouchInput.isPressed()) {
                $virtualStickController.setVirtualStickTouched(true);
            }
        }

        // 従来の処理はイベント起動に必要なため、そのまま残す
        _Scene_Map_processMapTouch.call(this);
    };


    // ドット移動対応時のタッチポイント到達時にDestinationをクリアする処理を無効化
    Game_Player.prototype.updateTouchPoint = function() {
    };

    Game_Player.prototype.updateDashing = function(this: Game_Player) {
        if (this.isMoving()) {
            return;
        }
        if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
            if (ALWAYS_DUSH) {
                this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
            } else {
                this._dashing = this.isDashButtonPressed();
            }
        } else {
            this._dashing = false;
        }
    };

    Game_Player.prototype.getInputDeg = function() {
        return null;
    };

    Game_Player.prototype.moveByInput = function() {
        if (!this.isMoving() && this.canMove()) {
            let direction = this.getInputDirection();
            let deg: number | null = this.getInputDeg();
            if (direction > 0) {
                $gameTemp.clearDestination();
            } else if (deg != null) {
                $gameTemp.clearDestination();
                if (typeof DotMoveSystemPluginName !== "undefined") {
                    this.dotMoveByDeg(deg);
                }
            } else {
                if (STICK_MODE === 1) {
                    direction = $virtualStickController.dir8();
                } else if (STICK_MODE === 2) {
                    deg = $virtualStickController.deg();
                    if (typeof DotMoveSystemPluginName !== "undefined") {
                        if (deg != null) this.dotMoveByDeg(deg);
                    } else {
                        throw new Error("DotMoveSystem.js is not installed.");
                    }
                } else {
                    direction = $virtualStickController.dir4();
                }
            }
            if (direction > 0) {
                // Yami_8DirEx.jsとの併用に対応
                if (typeof (Game_Player.prototype as any).processMoveByInput !== "undefined") {
                    (this as any).processMoveByInput(direction);
                } else {
                    this.executeMove(direction);
                }
            }
        }
    };

    // 事前に設定しておいたDestinationに応じて振り向き、イベントがあれば起動する
    // イベントを起動しなかった場合は振り向きをキャンセルする
    const _Game_Player_triggerTouchAction = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function() {
        const currentDir = $gamePlayer.direction();
        const x = $gameTemp.destinationX();
        const y = $gameTemp.destinationY();
        if (y < $gamePlayer.y) {
            $gamePlayer.setDirection(8);
        } else if (x > $gamePlayer.x) {
            $gamePlayer.setDirection(6);
        } else if (y > $gamePlayer.y) {
            $gamePlayer.setDirection(2);
        } else if (x < $gamePlayer.x) {
            $gamePlayer.setDirection(4);
        }
        const touchActionResult = _Game_Player_triggerTouchAction.call(this);
        $virtualStickController.setTouchActionResult(touchActionResult);
        if (touchActionResult) {
            // タッチでアクションを実行したときは仮想パッドを表示しない
            $virtualStickController.setVirtualStickTouched(false);
            return true;
        } else {
            $gameTemp.clearDestination();
            $gamePlayer.setDirection(currentDir);
        }
        return false;
    };

    let spriteClass;
    if (Utils.RPGMAKER_NAME === "MZ") {
        spriteClass = Sprite;
    } else {
        // @ts-ignore // MV Compatible
        spriteClass = Sprite_Base;
    }

    export class Sprite_VirtualStick extends spriteClass {
        initialize(): void {
            super.initialize();
            this._stickSprite = null;
            this.createBitmap();
            this.createStick();
            this.hide();
        }

        update(): void {
            super.update();
            if ($virtualStickController.isVisible()) {
                this.show();
                const point = $virtualStickController.point();
                const pad = this.padding();
                this.x = point!.x - this.bitmap.width / 2 - pad;
                this.y = point!.y - this.bitmap.height / 2 - pad;
                const deg = $virtualStickController.deg();
                if (deg == null) {
                    this.moveStickToCenter();
                } else {
                    this.moveStickByDeg(deg);
                }
            } else {
                this.hide();
            }
        }

        createBitmap(): void {
            if (PAD_IMAGE_FILE_NAME) {
                this.bitmap = ImageManager.loadBitmap("img/", PAD_IMAGE_FILE_NAME);
            } else {
                this.createDefaultBitmap();
            }
        }

        createDefaultBitmap(): void {
            this.bitmap = new Bitmap(PAD_SIZE, PAD_SIZE);
            const ctx = this.bitmap._context;
            const pad = this.padding();
            const cx = this.bitmap.width / 2;
            const cy = this.bitmap.height / 2;
            const r = this.bitmap.width / 2 - pad;
            const beginRad = 0;
            const endRad = 2 * Math.PI;

            ctx.arc(cx, cy, r, beginRad, endRad, false);
            ctx.strokeStyle = PAD_STROKE_COLOR;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = PAD_OPACITY / 255.0;
            ctx.fillStyle = PAD_FILL_COLOR;
            ctx.fill();
        }

        createStick(): void {
            this._stickSprite = new Sprite_Stick();
            this.addChild(this._stickSprite);
        }

        show(): void {
            super.show();
            this._stickSprite.show();
        }

        hide(): void {
            super.hide();
            this._stickSprite.hide();
        }

        moveStickToCenter(): void {
            const pad = this.padding();
            const cx = this.bitmap.width / 2;
            const cy = this.bitmap.height / 2;
            const x = cx - this._stickSprite.width / 2 + pad;
            const y = cy - this._stickSprite.height / 2 + pad;
            this._stickSprite.x = x;
            this._stickSprite.y = y;
        }

        moveStickByDeg(deg: number): void {
            this.moveStickToCenter();
            const rad = (deg - 90) / 180 * Math.PI;
            const pad = this.padding();
            const pad2 = this._stickSprite.padding();
            const r = this.bitmap.width / 2 - pad;
            const r2 = this._stickSprite.bitmap.width / 2 - pad2;
            const diffX = Math.cos(rad) * r;
            const diffY = Math.sin(rad) * r;
            const diffX2 = Math.cos(rad) * r2;
            const diffY2 = Math.sin(rad) * r2;
            this._stickSprite.x += diffX - diffX2 - pad2;
            this._stickSprite.y += diffY - diffY2 - pad2;
        }

        padding(): number {
            return 4;
        }
    }

    export class Sprite_Stick extends spriteClass {
        initialize(): void {
            super.initialize();
            this.createBitmap();
        }

        update(): void {
            super.update();
        }

        createBitmap(): void {
            if (STICK_IMAGE_FILE_NAME) {
                this.bitmap = ImageManager.loadBitmap("img/", STICK_IMAGE_FILE_NAME);
            } else {
                this.createDefaultBitmap();
            }
        }

        createDefaultBitmap(): void {
            this.bitmap = new Bitmap(STICK_SIZE, STICK_SIZE);
            const ctx = this.bitmap._context;
            const pad = this.padding();
            const cx = this.bitmap.width / 2;
            const cy = this.bitmap.height / 2;
            const r = this.bitmap.width / 2 - pad;
            const beginRad = 0;
            const endRad = 2 * Math.PI;

            ctx.arc(cx, cy, r, beginRad, endRad, false);
            ctx.strokeStyle = STICK_STROKE_COLOR;
            ctx.lineWidth = 1;
            ctx.stroke();

            const grdCx = this.bitmap.width / 3;
            const grdCy = this.bitmap.height / 3;
            const grd = ctx.createRadialGradient(grdCx, grdCy, 0, cx, cy, r);
            grd.addColorStop(0, STICK_FILL_GRAD1_COLOR);
            grd.addColorStop(0.25, STICK_FILL_GRAD2_COLOR);
            grd.addColorStop(1, STICK_FILL_GRAD3_COLOR);

            ctx.fillStyle = grd;
            ctx.fill();
        }

        padding(): number {
            return 4;
        }
    }

    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createVirtualStick();
    };

    Spriteset_Map.prototype.createVirtualStick = function(this: Spriteset_Map) {
        this._virtualStickSprite = new Sprite_VirtualStick();
        this._baseSprite.addChild(this._virtualStickSprite as any);
    };

    // 仮想パッドを表示するときはDestination矩形を表示しない
    Sprite_Destination.prototype.update = function(this: Sprite_Destination) {
        Sprite.prototype.update.call(this);
        if ($gameTemp.isDestinationValid() && $virtualStickController.touchActionResult()) {
            this.updatePosition();
            this.updateAnimation();
            this.visible = true;
        } else {
            this._frameCount = 0;
            this.visible = false;
        }
    };
}
