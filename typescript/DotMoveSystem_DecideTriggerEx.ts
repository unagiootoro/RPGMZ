/*:
@target MV MZ
@plugindesc Dot movement system decision trigger extension v1.0.0
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem_DecideTriggerEx.js
@help
A plugin that extends the decision trigger extension of the dot moving system.
By using this plugin, the event triggered by the decision button
It becomes possible to set the bootable range.
You can also display a popup in the event when the player enters the launchable range.
Popup can be selected from balloon icon, icon, picture and window.

※ When installing this plugin, "DotMoveSystem.js v2.1.0" or later is required.

【How to use】
■ Popup display settings
By writing the following content in the annotation on page 0, when the event becomes determinable
You can show popups.

・Display icons
<popupIcon: icon number>
Example: To display the 4th icon
<popupIcon: 4>

・Display message window
<popupWindowText: Message to display>
Example: Displaying a message window called Test
<popupWindowText: test>

・Specify the font size of the window
<popupWindowTextFontSize: font size>
Example: Specifying a font size of 24 pixels
<popupWindowTextFontSize: 24>

・Specify the font name of the window
<popupWindowTextFontFace: font name>
Example: When specifying MS P Gothic
<popupWindowTextFontFace: MS PGothic>

・Specify window skin image
<popupWindowSkin: image file name>
Example: When specifying Window_Popup.png
<popupWindowSkin: Window_Popup>

Window skin images must be placed in the system folder.

・Display images
<popupImage: image file name>
Example: To display popup.png
<popupImage: popup>

Images should be placed in the picture folder.

・Display the balloon icon
<popupBalloon: balloon icon number>
Example: To display the first balloon icon
<popupBalloon: 1>

■ Change popup settings (MZ only)
By executing the plug-in command "Pop-up setting change",
You can change the popup settings.
For the "setting contents" of the parameter, set in the same format as when setting in the annotation.
*This function is limited to MZ. In the case of MV, it can be reconfigured by using the script below.

■ When changing popup display by script
By using a script, it is possible to change the event popup display later.

・Change to display icons
this.event().changePopupIcon(icon number);
Example: To display the 4th icon
this.event().changePopupIcon(4);

・Change to display the message window
this.event().changePopupWindowText(message to display);
Example: Displaying a message window called Test
this.event().changePopupWindowText("Test");

・Change the font size of the window
this.event().changePopupWindowTextFontSize(font size);
Example: When changing to 32 pixels
this.event().changePopupWindowTextFontSize(32);

・Change the font name of the window
this.event().changePopupWindowTextFontFace(message to display);
Example: When changing to MS P Gothic
this.event().changePopupWindowTextFontFace("MSPGothic");

・Change to display images
this.event().changePopupImage(image file name);
Example: To display popup.png
this.event().changePopupImage("popup");

・Change to display balloon icon
this.event().changePopupBalloon(balloon icon number);
Example: To display the first balloon icon
this.event().changePopupBalloon(1);

・Change the skin image of the message window
this.event().changePopupWindowSkin(message to display);
Example: When using a skin image with the file name "Window_MV"
this.event().changePopupWindowSkin("Window_MV");

・Clear the current popup settings
this.event().clearPopupSetting();

・Reflect changes in popup settings
this.event().applyPopupSetting();

※Note
The old settings remain in the state where the settings are changed by the script.
So run clearPopupSetting to clear old settings.
Also, since the settings are not reflected on the actual game screen as they are,
It is necessary to execute applyPopupSetting to reflect the setting change on the game screen.

【License】
This plugin is available under the terms of the MIT license.


@command ChangePopupParameter
@text popup parameter change
@desc Change popup display settings.

@arg EventId
@type number
@text setting
@desc
Specifies the event ID for which popup settings are to be changed. If 0 is specified, the event targeted for command execution is targeted.

@arg PopupParameter
@text popup parameter
@type struct<PopupParameter>
@desc
Specifies the popup parameter to change.


@param DecideTriggerAreaWidth
@text decision trigger area width
@type number
@decimals 2
@default 2
@desc
Specifies the width of the area in which decision triggers can be executed. Internally the area width is treated as the diameter of the circle.

@param DefaultPopupParameter
@text default popup parameter
@type struct<PopupParameter>
@default {"BalloonId":"0","IconNumber":"0","ImageFileName":"","WindowText":"","WindowTextFontSize":"0","WindowTextFontFace":"","WindowSkinFileName ":""}
@desc
Specify default popup parameters.
*/
/*~struct~PopupParameter:
@param BalloonId
@text Balloon ID
@type number
@default 0
@desc
Specify the balloon ID.

@param IconNumber
@text icon number
@type number
@default 0
@desc
Specifies the icon number.

@param ImageFileName
@text image filename
@type file
@dir img/pictures
@desc
Specifies the image file name.

@param WindowText
@text window text
@type string
@desc
Specifies the text to display in the window.

@param WindowTextFontSize
@text window text font size
@type number
@default 0
@desc
Specifies the font size of the text displayed in the window. Specify 0 to use the standard size.

@param WindowTextFontFace
@text window text font face
@type string
@desc
Specifies the font face of the text displayed in the window. If empty, use standard faces.

@param WindowSkinFileName
@text window skin filename
@type file
@dir img/system
@desc
Specifies the window skin file name. If empty, use standard Window.
*/
/*:ja
@target MV MZ
@plugindesc ドット移動システム 決定トリガー拡張 v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem_DecideTriggerEx.js
@help
ドット移動システムの決定トリガー拡張を拡張するプラグインです。
このプラグインを使用することで決定ボタンによって起動するイベントの
起動可能な範囲を設定することが可能になります。
また、プレイヤーが起動可能範囲に入った際にイベントにポップアップを表示することもできます。
ポップアップはフキダシアイコン、アイコン、ピクチャ、ウィンドウから選択することが可能です。

※ 本プラグインを導入する場合、「DotMoveSystem.js v2.1.0」以降が必要になります。

【使用方法】
■ ポップアップの表示設定について
0ページ目の注釈に以下の内容を記載することで、イベントが決定可能になった際に
ポップアップを表示することができます。

・アイコンを表示する
<popupIcon: アイコン番号>
例: 4番目のアイコンを表示する場合
<popupIcon: 4>

・メッセージウィンドウを表示する
<popupWindowText: 表示するメッセージ>
例: テストというメッセージウィンドウを表示する場合
<popupWindowText: テスト>

・ウィンドウのフォントサイズを指定する
<popupWindowTextFontSize: フォントサイズ>
例: 24ピクセルのフォントサイズを指定する場合
<popupWindowTextFontSize: 24>

・ウィンドウのフォント名を指定する
<popupWindowTextFontFace: フォント名>
例: ＭＳ Ｐゴシックを指定する場合
<popupWindowTextFontFace: ＭＳ Ｐゴシック>

・ウィンドウスキンの画像を指定する
<popupWindowSkin: 画像ファイル名>
例: Window_Popup.pngを指定する場合
<popupWindowSkin: Window_Popup>

ウィンドウスキンの画像はsystemフォルダに配置する必要があります。

・画像を表示する
<popupImage: 画像ファイル名>
例: popup.pngを表示する場合
<popupImage: popup>

画像はpictureフォルダに配置する必要があります。

・フキダシアイコンを表示する
<popupBalloon: フキダシアイコン番号>
例: 1番目のフキダシアイコンを表示する場合
<popupBalloon: 1>

■ ポップアップ設定の変更(MZ限定)
プラグインコマンド「ポップアップ設定変更」を実行することで、
ポップアップの設定を変更することができます。
パラメータの「設定内容」には、注釈で設定する際と同じ形式で設定を行ってください。
※本機能はMZ限定です。MVの場合は下記のスクリプトを使用することで再設定が可能です。

■ スクリプトでポップアップの表示を変更する場合
スクリプトを使用することで、イベントのポップアップ表示を後から変更することが可能です。

・アイコンを表示するように変更する
this.event().changePopupIcon(アイコン番号);
例: 4番目のアイコンを表示する場合
this.event().changePopupIcon(4);

・メッセージウィンドウを表示するように変更する
this.event().changePopupWindowText(表示するメッセージ);
例: テストというメッセージウィンドウを表示する場合
this.event().changePopupWindowText("テスト");

・ウィンドウのフォントサイズを変更する
this.event().changePopupWindowTextFontSize(フォントサイズ);
例: 32ピクセルに変更する場合
this.event().changePopupWindowTextFontSize(32);

・ウィンドウのフォント名を変更する
this.event().changePopupWindowTextFontFace(表示するメッセージ);
例: ＭＳ Ｐゴシックに変更する場合
this.event().changePopupWindowTextFontFace("ＭＳ Ｐゴシック");

・画像を表示するように変更する
this.event().changePopupImage(画像ファイル名);
例: popup.pngを表示する場合
this.event().changePopupImage("popup");

・フキダシアイコンを表示するように変更する
this.event().changePopupBalloon(フキダシアイコン番号);
例: 1番目のフキダシアイコンを表示する場合
this.event().changePopupBalloon(1);

・メッセージウィンドウのスキン画像を変更する
this.event().changePopupWindowSkin(表示するメッセージ);
例: ファイル名「Window_MV」というスキン画像を使用する場合
this.event().changePopupWindowSkin("Window_MV");

・現在のポップアップの設定をクリアする
this.event().clearPopupSetting();

・ポップアップ設定の変更を反映する
this.event().applyPopupSetting();

※注意
スクリプトで設定変更を行った状態では古い設定が残ったままになっています。
そのため、clearPopupSettingを実行して古い設定をクリアしてください。
また、そのままでは設定が実際のゲーム画面に反映されないため、
applyPopupSettingを実行して設定変更をゲーム画面に反映する必要があります。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@command ChangePopupParameter
@text ポップアップパラメータ変更
@desc ポップアップ表示の設定を変更します。

@arg EventId
@type number
@text 設定内容
@desc
ポップアップ設定を変更する対象のイベントIDを指定します。0を指定するとコマンド実行対象のイベントを対象にします。

@arg PopupParameter
@text ポップアップパラメータ
@type struct<PopupParameter>
@desc
変更するポップアップパラメータを指定します。


@param DecideTriggerAreaWidth
@text 決定トリガーエリア幅
@type number
@decimals 2
@default 2
@desc
決定トリガーが実行可能になるエリアの幅を指定します。内部的にはエリア幅は円の直径として扱われます。

@param DefaultPopupParameter
@text デフォルトポップアップパラメータ
@type struct<PopupParameter>
@default {"BalloonId":"0","IconNumber":"0","ImageFileName":"","WindowText":"","WindowTextFontSize":"0","WindowTextFontFace":"","WindowSkinFileName":""}
@desc
デフォルトのポップアップパラメータを指定します。
*/
/*~struct~PopupParameter:ja
@param BalloonId
@text フキダシID
@type number
@default 0
@desc
フキダシIDを指定します。

@param IconNumber
@text アイコン番号
@type number
@default 0
@desc
アイコン番号を指定します。

@param ImageFileName
@text 画像ファイル名
@type file
@dir img/pictures
@desc
画像ファイル名を指定します。

@param WindowText
@text ウィンドウテキスト
@type string
@desc
ウィンドウに表示するテキストを指定します。

@param WindowTextFontSize
@text ウィンドウテキストフォントサイズ
@type number
@default 0
@desc
ウィンドウに表示するテキストのフォントサイズを指定します。0を指定すると標準のサイズを使用します。

@param WindowTextFontFace
@text ウィンドウテキストフォントフェイス
@type string
@desc
ウィンドウに表示するテキストのフォントフェイスを指定します。空の場合は標準のフェイスを使用します。

@param WindowSkinFileName
@text ウィンドウスキンファイル名
@type file
@dir img/system
@desc
ウィンドウスキンファイル名を指定します。空の場合は標準のWindowを使用します。
*/

declare namespace DotMoveSystem {
    interface PlayerDotMoveTempData {
        get decideTriggerCollidedEventIds(): number[];
        set decideTriggerCollidedEventIds(_decideTriggerCollidedEventIds: number[]);
    }

    interface EventDotMoveTempData {
        get decideTriggerArea(): DotMoveSystem.DecideTriggerArea | undefined;
        set decideTriggerArea(_decideTriggerArea: DotMoveSystem.DecideTriggerArea | undefined);
    }
}

declare interface Game_Player {
    updateDecideTriggerEvent(): void;
    checkDecideTriggerEventProcess(): void;
    checkDecideTriggerEventInternal(x: number, y: number, d: number): number[];
    isTowardDirectionToCharacter(character: Game_CharacterBase): boolean;
    triggerButtonAction(): boolean;
    checkEventTriggerThere(triggers: number[], opt?: { isDecide?: boolean }): void;
    startMapEventDecideTriggerEx(): void;
    startMapDecideEventByTouch(event: Game_Event): void;
}

declare interface Game_Event {
    _popupDelayTime: number;
    _decidablePopupVisible: boolean;
    _popupIcon: number;
    _decidableBalloonId: number;
    _popupImageFileName: string;
    _popupWindowText: string;
    _popupWindowTextFontSize: number;
    _popupWindowTextFontFace: string;
    _popupWindowSkinFileName: string;

    changePopupParams(popupParams: DotMoveSystem.PopupParameter): void;
    updateDecideBalloon(): void;
    isNeedPopupObject(): boolean;
    setDecidablePopupVisible(visible: boolean): void;
    isDecidablePopupVisible(): boolean;
    popupIcon(): number;
    popupImageFileName(): string;
    popupWindowText(): string;
    popupWindowTextFontSize(): number;
    popupWindowTextFontFace(): string;
    popupWindowSkinFileName(): string;
    startPopupDelay(): void;
    isEventPageEmpty(page: number): boolean;
    checkNeedUpdatePopupObject(): boolean;
}

declare interface Sprite_Character {
    _pressed: boolean;

    character(): Game_CharacterBase;
    processTouch(): void;
    isPressed(): boolean;
    isClickEnabled(): boolean;
    isBeingTouched(): boolean;
    hitTest(x: number, y: number): void;
    onPress(): void;
    onClick(): void;
}

declare interface Scene_Map {
    checkCharacterEventStarted(): boolean;
}

declare interface Spriteset_Map {
    _popupObjects: Map<Game_Event, DotMoveSystem.IPopupObject>;

    characterSprites(): Sprite_Character[];
}

declare interface Game_Interpreter {
    event(): Game_Event;
}


const DotMoveSystem_DecideTriggerExPluginName = document.currentScript ? decodeURIComponent((document.currentScript as HTMLScriptElement).src.match(/^.*\/(.+)\.js$/)![1]) : "DotMoveSystem_DecideTriggerEx";

namespace DotMoveSystem {
    function mixin(dest: { prototype: any }, src: { prototype: any }) {
        for (const name of Object.getOwnPropertyNames(src.prototype)) {
            if (name === "constructor") continue;
            const value = Object.getOwnPropertyDescriptor(src.prototype, name) || Object.create(null);
            Object.defineProperty(dest.prototype, name, value);
        }
    }


    if (typeof PluginManager.registerCommand !== "undefined") {
        PluginManager.registerCommand(DotMoveSystem_DecideTriggerExPluginName, "ChangePopupParameter", function(this: Game_Interpreter, args: any) {
            const eventId = parseInt(args.EventId);
            const popupParams = PopupParameter.fromParams(JSON.parse(args.PopupParameter));
            let event;
            if (eventId === 0) {
                event = $gameMap.event(this.eventId());
            } else {
                event = $gameMap.event(eventId);
            }
            event.changePopupParams(popupParams);
        });
    }


    // MV Compatible
    if (Utils.RPGMAKER_NAME === "MV") {
        (Spriteset_Map.prototype as any).findTargetSprite = function(target: any) {
            return this._characterSprites.find((sprite: Sprite_Character) => sprite.checkCharacter(target));
        };

        Sprite_Character.prototype.checkCharacter = function(this: Sprite_Character, character) {
            return this._character === character;
        };

        Window_Base.prototype.textSizeEx = function(text) {
            if (text) {
                this.resetFontSettings();
                var textState: any = { index: 0, x: 0, y: 0, left: 0 };
                textState.undrawing = true;
                textState.text = this.convertEscapeCharacters(text);
                // @ts-ignore
                textState.height = this.calcTextHeight(textState, false);
                while (textState.index < textState.text.length) {
                    this.processCharacter(textState);
                }
                return { width: textState.x, height: textState.height };
            } else {
                return { width: 0, height: 0 };
            }
        };

        // @ts-ignore
        Window_Base.prototype.processNormalCharacter = function(textState) {
            var c = textState.text[textState.index++];
            var w = this.textWidth(c);
            if (!textState.undrawing) {
                this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
            }
            textState.x += w;
        };
    }


    export class PopupParameter {
        readonly balloonId: number;
        readonly iconNumber: number;
        readonly imageFileName: string;
        readonly windowText: string;
        readonly windowTextFontSize: number;
        readonly windowTextFontFace: string;
        readonly windowSkinFileName: string;

        static fromParams(params: any) {
            const balloonId: number | undefined = params.BalloonId != null ? parseInt(params.BalloonId) : undefined;
            const iconNumber: number = params.IconNumber;
            const imageFileName: string = params.ImageFileName;
            const windowText: string = params.WindowText;
            const windowTextFontSize: number | undefined = params.WindowTextFontSize != null ? parseInt(params.WindowTextFontSize) : undefined;
            const windowTextFontFace: string = params.WindowTextFontFace;
            const windowSkinFileName: string = params.WindowSkinFileName;
            return new PopupParameter(balloonId, iconNumber, imageFileName, windowText, windowTextFontSize, windowTextFontFace, windowSkinFileName);
        }

        constructor(
            balloonId?: number,
            iconNumber?: number,
            imageFileName?: string,
            windowText?: string,
            windowTextFontSize?: number,
            windowTextFontFace?: string,
            windowSkinFileName?: string
        ) {
            this.balloonId = balloonId != null ? balloonId : 0;
            this.iconNumber = iconNumber != null ? iconNumber : 0;
            this.imageFileName = imageFileName != null ? imageFileName : "";
            this.windowText = windowText != null ? windowText : "";
            this.windowTextFontSize = windowTextFontSize != null ? windowTextFontSize : 0;
            this.windowTextFontFace = windowTextFontFace != null ? windowTextFontFace : "";
            this.windowSkinFileName = windowSkinFileName != null ? windowSkinFileName : "";
        }
    }

    export class PluginParams {
        readonly decideTriggerAreaWidth: number;
        readonly defaultPopupParameter: PopupParameter;

        constructor() {
            const params = PluginManager.parameters(DotMoveSystem_DecideTriggerExPluginName);
            this.decideTriggerAreaWidth = parseFloat(params.DecideTriggerAreaWidth);
            if (params.DefaultPopupParameter) {
                this.defaultPopupParameter = PopupParameter.fromParams(JSON.parse(params.DefaultPopupParameter));
            } else {
                this.defaultPopupParameter = new PopupParameter();
            }
        }
    }

    const PP = new PluginParams();


    export class Circle {
        private _x!: number;
        private _y!: number;
        private _d!: number;

        get x() { return this._x; }
        set x(_x) { this._x = _x; }
        get y() { return this._y; }
        set y(_y) { this._y = _y; }
        get d() { return this._d; }
        set d(_d) { this._d = _d; }
        get r() { return this.d / 2; }

        constructor(...args: [number, number, number]) {
            this.initialize(...args);
        }

        initialize(x: number, y: number, d: number): void {
            this._x = x;
            this._y = y;
            this._d = d;
        }

        isCollidedCircle(circle: Circle): boolean {
            const pos = new DotMovePoint(this.x, this.y);
            const far = pos.calcFar(new DotMovePoint(circle.x, circle.y));
            return far < this.r + circle.r;
        }
    }

    export class DecideTriggerArea extends Game_Character {
        private _owner!: Game_Event;
        private _type!: string;

        get type() { return this._type }
        get owner() { return this._owner }

        constructor(type: string, owner: Game_Event);

        constructor(...args: any[]) {
            super(...args);
        }

        initialize(...args: any[]): void {
            const [type, owner] = args;
            super.initialize();
            this._type = type;
            this._owner = owner;
        }

        update(): void {
            super.update();
            const ownerPos = this._owner.positionPoint();
            const x = ownerPos.x - (this.width() - this._owner.width()) / 2;
            const y = ownerPos.y - (this.height() - this._owner.height()) / 2;
            this.setPositionPoint(new DotMovePoint(x, y));
        }

        width(): number {
            return PP.decideTriggerAreaWidth;
        }

        height(): number {
            return PP.decideTriggerAreaWidth;
        }
    }


    class PlayerDotMoveTempData_Mixin extends DotMoveSystem.PlayerDotMoveTempData {
        private static _initialize = PlayerDotMoveTempData.prototype.initialize;

        private _decideTriggerCollidedEventIds!: number[];

        initialize(): void {
            PlayerDotMoveTempData_Mixin._initialize.call(this);
            this._decideTriggerCollidedEventIds = [];
        }

        get decideTriggerCollidedEventIds() { return this._decideTriggerCollidedEventIds }
        set decideTriggerCollidedEventIds(_decideTriggerCollidedEventIds) { this._decideTriggerCollidedEventIds = _decideTriggerCollidedEventIds; }
    }

    mixin(PlayerDotMoveTempData, PlayerDotMoveTempData_Mixin);


    class EventDotMoveTempData_Mixin extends DotMoveSystem.EventDotMoveTempData {
        private _decideTriggerArea?: DecideTriggerArea;

        get decideTriggerArea() { return this._decideTriggerArea }
        set decideTriggerArea(_decideTriggerArea) { this._decideTriggerArea = _decideTriggerArea; }
    }

    mixin(EventDotMoveTempData, EventDotMoveTempData_Mixin);


    class Game_Player_Mixin extends Game_Player {
        static _update = Game_Player.prototype.update;
        static _checkEventTriggerThere = Game_Player.prototype.checkEventTriggerThere;

        update(sceneActive: boolean): void {
            Game_Player_Mixin._update.call(this, sceneActive);
            if (sceneActive) this.updateDecideTriggerEvent();
        }

        updateDecideTriggerEvent(): void {
            if ($gameMap.isEventRunning()) return;
            const tempData = this.dotMoveTempData<DotMoveSystem.PlayerDotMoveTempData>();
            const lastDecideTriggerCollidedEventIds = tempData.decideTriggerCollidedEventIds;
            this.checkDecideTriggerEventProcess();
            const decideTriggerCollidedEventIds = tempData.decideTriggerCollidedEventIds;
            for (const eventId of decideTriggerCollidedEventIds) {
                const event = $gameMap.event(eventId);
                if (!event) continue;
                event.setDecidablePopupVisible(true);
            }
            for (const eventId of lastDecideTriggerCollidedEventIds) {
                if (!decideTriggerCollidedEventIds.includes(eventId)) {
                    const event = $gameMap.event(eventId);
                    if (!event) continue;
                    event.setDecidablePopupVisible(false);
                }
            }
        }

        checkDecideTriggerEventProcess(): void {
            const eventIds: number[] = [];
            const dir = this.direction();

            eventIds.push(...this.checkDecideTriggerEventInternal(this._realX, this._realY, dir));

            let currentPoint = this.positionPoint();
            while (true) {
                let nextPoint = DotMoveUtils.nextPointWithDirection(currentPoint, dir);
                let nextX = Math.round(nextPoint.x);
                let nextY = Math.round(nextPoint.y);
                if ($gameMap.isCounter(nextX, nextY)) {
                    eventIds.push(...this.checkDecideTriggerEventInternal(nextX, nextY, dir));
                } else {
                    break;
                }
                currentPoint = nextPoint;
            }

            const uniqEventIds: number[] = [];
            for (const id of eventIds) {
                if (!uniqEventIds.includes(id)) uniqEventIds.push(id);
            }
            this.dotMoveTempData<DotMoveSystem.PlayerDotMoveTempData>().decideTriggerCollidedEventIds = uniqEventIds;
        }

        checkDecideTriggerEventInternal(x: number, y: number, d: number): number[] {
            const eventIds = [];
            for (const result of this.mover().checkHitCharacters(x, y, d)) {
                if (!(result.targetObject instanceof DecideTriggerArea)) continue;
                const event = result.targetObject.owner;
                if (!event) continue;
                if (!this.isTowardDirectionToCharacter(event)) continue;
                if (!(event.isTriggerIn([0]) && event.isNormalPriority())) continue;
                if (event.isEventPageEmpty(0)) continue;

                const subjectRect = result.subjectRect;
                const targetRect = result.targetRect;
                const circle1 = new Circle(subjectRect.x + subjectRect.width / 2, subjectRect.y + subjectRect.height / 2, 1);
                const circle2 = new Circle(targetRect.x + targetRect.width / 2, targetRect.y + targetRect.height / 2, PP.decideTriggerAreaWidth);
                if (!circle1.isCollidedCircle(circle2)) continue;

                eventIds.push(event.eventId());
            }

            for (const result of this.mover().checkHitCharacters(x, y, this._direction)) {
                if (!(result.targetObject instanceof Game_Event)) continue;
                const event = result.targetObject;
                if (!(event.isTriggerIn([0]) && !event.isNormalPriority())) continue;
                if (result.collisionLengthX() >= event.widthArea() && result.collisionLengthY() >= event.heightArea()) {
                    eventIds.push(event.eventId());
                }
            }

            return eventIds;
        }

        isTowardDirectionToCharacter(character: Game_CharacterBase): boolean {
            let towardDir;
            const sx = this.deltaRealXFrom(character.centerRealX());
            const sy = this.deltaRealYFrom(character.centerRealY());
            if (Math.abs(sx) > Math.abs(sy)) {
                towardDir = sx > 0 ? 4 : 6;
            } else {
                towardDir = sy > 0 ? 8 : 2;
            }
            return this._direction === towardDir;
        }

        triggerButtonAction(): boolean {
            if (Input.isTriggered("ok")) {
                if (this.getOnOffVehicle()) {
                    return true;
                }
                this.checkEventTriggerHere([0]);
                if ($gameMap.setupStartingEvent()) {
                    return true;
                }
                this.checkEventTriggerThere([0, 1, 2], { isDecide: true });
                if ($gameMap.setupStartingEvent()) {
                    return true;
                }
            }
            return false;
        }

        checkEventTriggerThere(triggers: number[], opt: { isDecide?: boolean } = {}): void {
            const isDecide = opt.isDecide ?? false;
            if (isDecide) {
                if (!this.canStartLocalEvents()) return;
                if (!triggers.includes(0)) return;
                this.startMapEventDecideTriggerEx();
            } else {
                Game_Player_Mixin._checkEventTriggerThere.call(this, triggers);
            }
        }

        startMapDecideEventByTouch(event: Game_Event) {
            if (!this.canStartLocalEvents()) return;
            if ($gameMap.isEventRunning()) return;
            const eventIds = this.dotMoveTempData<DotMoveSystem.PlayerDotMoveTempData>().decideTriggerCollidedEventIds;
            if (!eventIds.includes(event.eventId())) return;
            event.start();
        }

        startMapEventDecideTriggerEx(): void {
            if ($gameMap.isEventRunning()) return;
            const eventIds = this.dotMoveTempData<DotMoveSystem.PlayerDotMoveTempData>().decideTriggerCollidedEventIds;
            for (const eventId of eventIds) {
                const event = $gameMap.event(eventId);
                if (event) event.start();
            }
        }
    }

    mixin(Game_Player, Game_Player_Mixin);


    class Game_Event_Mixin extends Game_Event {
        private static _initMembers = Game_Event.prototype.initMembers;
        private static _refresh = Game_Event.prototype.refresh;
        private static _update = Game_Event.prototype.update;
        private static _createTempData = Game_Event.prototype.createDotMoveTempData;
        private static _start = Game_Event.prototype.start;

        private _needUpdatePopupObject!: boolean;
        private _popupSettingChanged!: boolean;

        initMembers(): void {
            Game_Event_Mixin._initMembers.call(this);
            this._popupDelayTime = 0;
            this._decidablePopupVisible = false;
            this._popupIcon = 0;
            this._decidableBalloonId = 0;
            this._popupImageFileName = "";
            this._popupWindowText = "";
            this._popupWindowTextFontSize = 0;
            this._popupWindowTextFontFace = "";
            this._popupWindowSkinFileName = "";
            this._popupSettingChanged = false;
        }

        update(): void {
            Game_Event_Mixin._update.call(this);
            if (this._decidableBalloonId > 0) this.updateDecideBalloon();
            if (this._popupDelayTime > 0) this._popupDelayTime--;
            const tempData = this.dotMoveTempData<DotMoveSystem.EventDotMoveTempData>();
            tempData.decideTriggerArea!.update();
        }

        changePopupIcon(iconIndex: number): void {
            this._popupIcon = iconIndex;
        }

        changePopupWindowText(text: string): void {
            this._popupWindowText = text;
        }

        changePopupImage(imageFileName: string): void {
            this._popupImageFileName = imageFileName;
        }

        changePopupBalloon(balloonId: number): void {
            this._decidableBalloonId = balloonId;
        }

        changePopupWindowSkin(windowSkinFileName: string): void {
            this._popupWindowSkinFileName = windowSkinFileName;
        }

        clearPopupSetting(): void {
            this.changePopupParams(new PopupParameter());
        }

        applyPopupSetting(): void {
            this.refresh();
            this._needUpdatePopupObject = true;
        }

        changePopupParams(popupParams: PopupParameter) {
            this._popupIcon = popupParams.iconNumber;
            this._decidableBalloonId = popupParams.balloonId;
            this._popupImageFileName = popupParams.imageFileName;
            this._popupWindowText = popupParams.windowText;
            this._popupWindowTextFontSize = popupParams.windowTextFontSize;
            this._popupWindowTextFontFace = popupParams.windowTextFontFace;
            this._popupWindowSkinFileName = popupParams.windowSkinFileName;
            this._needUpdatePopupObject = true;
        }

        checkNeedUpdatePopupObject(): boolean {
            if (this._needUpdatePopupObject) {
                this._needUpdatePopupObject = false;
                return true;
            }
            return false;
        }

        startPopupDelay(): void {
            this._popupDelayTime = 30;
        }

        updateDecideBalloon(): void {
            if (this.isDecidablePopupVisible()) {
                if (!this.isBalloonPlaying()) {
                    if (Utils.RPGMAKER_NAME === "MZ") {
                        $gameTemp.requestBalloon(this, this._decidableBalloonId);
                    } else {
                        // @ts-ignore // MV Compatible
                        this.requestBalloon(this._decidableBalloonId);
                    }
                }
            }
        }

        setDecidablePopupVisible(visible: boolean): void {
            this._decidablePopupVisible = visible;
        }

        isDecidablePopupVisible(): boolean {
            if ($gameMap.isEventRunning()) return false;
            if (this._popupDelayTime > 0) return false;
            return this._decidablePopupVisible;
        }

        popupIcon(): number {
            return this._popupIcon;
        }

        popupImageFileName(): string {
            return this._popupImageFileName;
        }

        popupWindowText(): string {
            return this._popupWindowText;
        }

        popupWindowTextFontSize(): number {
            return this._popupWindowTextFontSize;
        }

        popupWindowTextFontFace(): string {
            return this._popupWindowTextFontFace;
        }

        popupWindowSkinFileName(): string {
            return this._popupWindowSkinFileName;
        }

        refresh(): void {
            Game_Event_Mixin._refresh.call(this);
            if (!this._popupSettingChanged) {
                this._popupSettingChanged = true;
                this.resetPopupSetting();
            }
        }

        resetPopupSetting(): void {
            const notePopupIcon = this.getAnnotationValue("popupIcon", 0);
            if (notePopupIcon) this._popupIcon = parseInt(notePopupIcon);

            const notePopupBalloon = this.getAnnotationValue("popupBalloon", 0);
            if (notePopupBalloon) this._decidableBalloonId = parseInt(notePopupBalloon);

            const notePopupImage = this.getAnnotationValue("popupImage", 0);
            if (notePopupImage) this._popupImageFileName = notePopupImage.replace(/^\s+/, "");

            const notePopupWindowText = this.getAnnotationValue("popupWindowText", 0);
            if (notePopupWindowText) this._popupWindowText = notePopupWindowText.replace(/^\s+/, "");

            const notePopupWindowTextFontSize = this.getAnnotationValue("popupWindowTextFontSize", 0);
            if (notePopupWindowTextFontSize) this._popupWindowTextFontSize = parseInt(notePopupWindowTextFontSize);

            const notePopupWindowTextFontFace = this.getAnnotationValue("popupWindowTextFontFace", 0);
            if (notePopupWindowTextFontFace) this._popupWindowTextFontFace = notePopupWindowTextFontFace.replace(/^\s+/, "");

            const notePopupWindowSkin = this.getAnnotationValue("popupWindowSkin", 0);
            if (notePopupWindowSkin) {
                this._popupWindowSkinFileName = notePopupWindowSkin.replace(/^\s+/, "");
            } else {
                this._popupWindowSkinFileName = PP.defaultPopupParameter.windowSkinFileName;
            }

            const noteUnuseDefault = this.getAnnotationValue("unuseDefault", 0);

            if (!this.isNeedPopupObject() && this._decidableBalloonId === 0 && !noteUnuseDefault) {
                this._popupIcon = PP.defaultPopupParameter.iconNumber;
                this._decidableBalloonId = PP.defaultPopupParameter.balloonId;
                this._popupImageFileName = PP.defaultPopupParameter.imageFileName;
                this._popupWindowText = PP.defaultPopupParameter.windowText;
            }
        }

        createDotMoveTempData(): DotMoveSystem.EventDotMoveTempData {
            const tempData = Game_Event_Mixin._createTempData.call(this) as DotMoveSystem.EventDotMoveTempData;
            tempData.decideTriggerArea = new DecideTriggerArea("circle", this as unknown as Game_Event);
            return tempData;
        }

        isNeedPopupObject(): boolean {
            if (this._popupIcon > 0) return true;
            if (this._popupImageFileName !== "") return true;
            if (this._popupWindowText !== "") return true;
            return false;
        }

        start(): void {
            Game_Event_Mixin._start.call(this);
            this.startPopupDelay();
        }

        isEventPageEmpty(page: number): boolean {
            const eventData = this.event();
            if (eventData) {
                const pageList = eventData.pages[page].list;
                for (let i = 0; i < pageList.length; i++) {
                    if (!(pageList[i].code === 0 || pageList[i].code === 108 || pageList[i].code === 408)) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

    mixin(Game_Event, Game_Event_Mixin);


    class Game_Map_Mixin extends Game_Map {
        private static _allCharacters = Game_Map.prototype.allCharacters;

        allCharacters(): Game_CharacterBase[] {
            const characters: Game_CharacterBase[] = Game_Map_Mixin._allCharacters.call(this);
            for (const event of this.events()) {
                characters.push(event.dotMoveTempData<DotMoveSystem.EventDotMoveTempData>().decideTriggerArea!);
            }
            return characters;
        }
    }

    mixin(Game_Map, Game_Map_Mixin);


    let baseSpriteClass: new () => Sprite;
    if (Utils.RPGMAKER_NAME === "MZ") {
        baseSpriteClass = Sprite;
    } else {
        // @ts-ignore // MV Compatible
        baseSpriteClass = Sprite_Base;
    }

    export class Sprite_Icon extends baseSpriteClass {
        setIconIndex(iconIndex: number) {
            if (iconIndex > 0) {
                if (!this.bitmap) {
                    this.bitmap = ImageManager.loadSystem("IconSet");
                }
                const iconFrame = this.iconFrame(iconIndex);
                this.setFrame(iconFrame.x, iconFrame.y, iconFrame.width, iconFrame.height);
            } else {
                this.bitmap = null;
            }
        }

        iconFrame(iconIndex: number) {
            let pw, ph;
            if (Utils.RPGMAKER_NAME === "MZ") {
                pw = ImageManager.iconWidth;
                ph = ImageManager.iconHeight;
            } else {
                pw = 32;
                ph = 32;
            }
            const sx = (iconIndex % 16) * pw;
            const sy = Math.floor(iconIndex / 16) * ph;
            return new Rectangle(sx, sy, pw, ph);
        }
    }


    export interface IPopupObject {
        x: number;
        y: number;
        z?: number;
        width: number;
        height: number;
        show(): void;
        hide(): void;
    }


    export class Window_Popup extends Window_Base {
        private _text!: string;
        private _textFontSize!: number;
        private _textFontFace!: string;

        initialize(rect: Rectangle): void {
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            } else {
                // @ts-ignore // MV Compatible
                super.initialize(rect.x, rect.y, rect.width, rect.height);
            }
            this._text = "";
            this._textFontSize = 0;
            this._textFontFace = "";
            this.downArrowVisible = true;
        }

        get text() {
            return this._text;
        }

        set text(_text) {
            this._text = _text;
            this.refresh();
        }

        get textFontSize() {
            return this._textFontSize;
        }

        set textFontSize(_textFontSize) {
            this._textFontSize = _textFontSize;
            this.refresh();
        }

        get textFontFace() {
            return this._textFontFace;
        }

        set textFontFace(_textFontFace) {
            this._textFontFace = _textFontFace;
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            if (Utils.RPGMAKER_NAME === "MZ") {
                this.contentsBack.clear();
            }
            const { width, height } = this.textSizeEx(this._text);
            this.width = width + this.padding * 2;
            this.height = height + this.padding * 2;
            this.drawTextEx(this._text, 0, 0, this.width);
        }

        _refreshArrows() {
            super._refreshArrows();
            this._downArrowSprite.y += 16;
        }

        resetFontSettings(): void {
            this.contents.fontFace = this.realTextFontFace();
            this.contents.fontSize = this.realTextFontSize();
            this.resetTextColor();
        }

        realTextFontSize(): number {
            if (this._textFontSize === 0) {
                if (Utils.RPGMAKER_NAME === "MZ") {
                    return $gameSystem.mainFontSize();
                } else {
                    // @ts-ignore // MV Compatible
                    return this.standardFontSize();
                }
            }
            return this._textFontSize;
        }

        realTextFontFace(): string {
            if (this._textFontFace === "") {
                if (Utils.RPGMAKER_NAME === "MZ") {
                    return $gameSystem.mainFontFace();
                } else {
                    // @ts-ignore // MV Compatible
                    return this.standardFontFace();
                }
            }
            return this._textFontFace;
        }
    }


    class Sprite_Character_Mixin extends Sprite_Character {
        private static _initMembers = Sprite_Character.prototype.initMembers;
        private static _update = Sprite_Character.prototype.update;

        initMembers(): void {
            Sprite_Character_Mixin._initMembers.call(this);
            this._pressed = false;
        }

        update(): void {
            Sprite_Character_Mixin._update.call(this);
            this.processTouch();
        }

        character(): Game_CharacterBase {
            return this._character!;
        }

        processTouch() {
            if (this.isClickEnabled()) {
                if (this.isBeingTouched()) {
                    if (TouchInput.isTriggered()) {
                        this._pressed = true;
                        this.onPress();
                    }
                } else {
                    this._pressed = false;
                }
                if (this._pressed && TouchInput.isReleased()) {
                    this._pressed = false;
                    this.onClick();
                }
            } else {
                this._pressed = false;
            }
        }

        isPressed() {
            return this._pressed;
        }

        isClickEnabled() {
            return this.worldVisible;
        }

        isBeingTouched() {
            const touchPos = new Point(TouchInput.x, TouchInput.y);
            const localPos = this.worldTransform.applyInverse(touchPos);
            return this.hitTest(localPos.x, localPos.y);
        }

        hitTest(x: number, y: number) {
            const rect = new Rectangle(
                -this.anchor.x * this.width,
                -this.anchor.y * this.height,
                this.width,
                this.height
            );
            return rect.contains(x, y);
        }

        onPress() {
        }

        onClick() {
            if (this._character instanceof Game_Event) {
                $gamePlayer.startMapDecideEventByTouch(this._character);
                if (this._character._locked) {
                    $gameTemp.clearDestination();
                }
            }
        }
    }

    mixin(Sprite_Character, Sprite_Character_Mixin);


    class Scene_Map_Mixin extends Scene_Map {
        private static _processMapTouch = Scene_Map.prototype.processMapTouch;
        private static _onMapTouch = Scene_Map.prototype.onMapTouch;

        processMapTouch(): void {
            Scene_Map_Mixin._processMapTouch.call(this);
            const characterSprites = this._spriteset.characterSprites();
            for (const characterSprite of characterSprites) {
                characterSprite.processTouch();
            }
        }

        checkCharacterEventStarted(): boolean {
            const characterSprites = this._spriteset.characterSprites();
            let startEvent = false;
            const eventIds = $gamePlayer.dotMoveTempData<DotMoveSystem.PlayerDotMoveTempData>().decideTriggerCollidedEventIds;
            for (const characterSprite of characterSprites) {
                if (characterSprite.isPressed()) {
                    const character = characterSprite.character();
                    if ((character instanceof Game_Event) && eventIds.includes(character.eventId())) {
                        startEvent = true;
                    }
                }
            }
            return startEvent;
        }

        onMapTouch(): void {
            const startEvent = this.checkCharacterEventStarted();
            if (!startEvent) {
                // @ts-ignore
                if (typeof $virtualStickController !== "undefined") {
                    return;
                }
                Scene_Map_Mixin._onMapTouch.call(this);
            }
        }
    }

    mixin(Scene_Map, Scene_Map_Mixin);


    class Spriteset_Map_Mixin extends Spriteset_Map {
        static _initialize = Spriteset_Map.prototype.initialize;
        static _update = Spriteset_Map.prototype.update;

        initialize() {
            this._popupObjects = new Map();
            Spriteset_Map_Mixin._initialize.call(this);
        }

        update() {
            Spriteset_Map_Mixin._update.call(this);
            this.updatePopupObjects();
        }

        characterSprites() {
            return this._characterSprites;
        }

        updatePopupObjects(): void {
            const characters = this._characterSprites.map(sprite => sprite.character());
            const events = characters.filter(character => character instanceof Game_Event) as Game_Event[];
            for (const event of events) {
                if (!this._popupObjects.has(event)) {
                    if (event.isNeedPopupObject()) {
                        const popupObject = this.createPopupObject(event);
                        this._popupObjects.set(event, popupObject);
                        this._tilemap.addChild(popupObject as any);
                    }
                } else {
                    if (event.checkNeedUpdatePopupObject()) {
                        const oldPopupObject = this._popupObjects.get(event);
                        this._tilemap.removeChild(oldPopupObject as any);
                        this._popupObjects.delete(event);
                        if (event.isNeedPopupObject()) {
                            const newPopupObject = this.createPopupObject(event);
                            this._popupObjects.set(event, newPopupObject);
                            this._tilemap.addChild(newPopupObject as any);
                        }
                    }
                }
            }
            for (const event of this._popupObjects.keys()) {
                const popupObject = this._popupObjects.get(event);
                if (events.includes(event)) {
                    this.updatePopupObject(event, popupObject!);
                } else {
                    this._tilemap.removeChild(popupObject as any);
                    this._popupObjects.delete(event);
                }
            }
        }

        createPopupObject(event: Game_Event): IPopupObject {
            const popupIcon = event.popupIcon();
            const popupImageFileName = event.popupImageFileName();
            const popupWindowText = event.popupWindowText();
            const popupWindowSkinFileName = event.popupWindowSkinFileName();

            let popupObject: IPopupObject | undefined;
            if (popupIcon > 0) {
                const sprite = new Sprite_Icon();
                sprite.setIconIndex(popupIcon);
                sprite.hide();
                popupObject = sprite;
            } else if (popupImageFileName !== "") {
                const sprite = new baseSpriteClass();
                sprite.bitmap = ImageManager.loadPicture(popupImageFileName);
                sprite.hide();
                popupObject = sprite;
            } else if (popupWindowText !== "") {
                const rect = new Rectangle(0, 0, Graphics.boxWidth, 128);
                const window = new Window_Popup(rect);
                if (popupWindowSkinFileName !== "") {
                    window.windowskin = ImageManager.loadSystem(popupWindowSkinFileName);
                }
                window.text = popupWindowText;
                window.textFontSize = event.popupWindowTextFontSize();
                window.textFontFace = event.popupWindowTextFontFace();
                window.hide();
                popupObject = window;
            }
            if (!popupObject) throw new Error("Create popup object failed.");
            popupObject.z = 7;
            return popupObject;
        }

        updatePopupObject(event: Game_Event, popupObject: IPopupObject): void {
            if (event.isDecidablePopupVisible()) {
                const characterSprite = this.findTargetSprite(event);
                if (characterSprite && (characterSprite instanceof Sprite_Character)) {
                    popupObject.x = characterSprite.x - popupObject.width / 2;
                    popupObject.y = characterSprite.y - characterSprite.height - popupObject.height;
                    popupObject.show();
                }
            } else {
                popupObject.hide();
            }
        }
    }

    mixin(Spriteset_Map, Spriteset_Map_Mixin);


    class Game_Interpreter_Mixin extends Game_Interpreter {
        event(): Game_Event {
            return $gameMap.event(this._eventId);
        }
    }

    mixin(Game_Interpreter, Game_Interpreter_Mixin);
}
