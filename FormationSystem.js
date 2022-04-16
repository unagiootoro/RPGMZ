/*:
@target MZ
@plugindesc formation system v1.2.0
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/FormationSystem.js
@help
It is a plugin that introduces the formation system.


【Overview】
In this plugin, some formations are stocked in advance from the menu screen,
You can select and apply one of the formations stocked during the battle.
You can change the formation at any time during the battle.


【Method of operation】
・ Setting the formation to be used during battle
By opening the "Tactics" menu from the menu screen,
Customize the formation slots available during battle.

Of the formations in the slot, the formation with the E mark is the formation currently adopted.
The formation you are currently using can be changed to another formation by pressing the Shift key.

・ Change of formation during battle
During combat, a "tactical" command is added to the party command.
When this command is selected, the formations set in the slot are selected.
You can change the formation to apply.


【How to use】
■ Creation of formation
Edit the plugin parameter "Formation Datas" to create a formation.
In formation setting, there are two ways to set the position of each actor.
・ Enter the coordinates using a mathematical formula
It is a method to specify the X coordinate and the Y coordinate. You can use mathematical formulas for the coordinates.
Also, if you use the word index in the formula, the corresponding actor will start from the beginning.
It will be replaced with a numerical value indicating the number. (It will be 0, 1, 2 ... from the beginning)
When using this method, specify 0 for the map ID of the plug-in parameter.

-Read coordinates from the map
It is a method to regard the event placed on the map as the position of each actor.
Create an event on the target map and enter the order from the beginning of the corresponding actor in the memo column.
(Example) When setting the position of the first actor
Create an event and put it in the memo field
0
Described as.

The created formations are assigned IDs in the form of (0, 1, 2, ...) in the order in which the plug-in parameters are registered.
Of these, the formation with ID0 is used as the default formation.

■ Setting additional effects for formations
Additional effects for formations are created by states.
Specify the state to apply for each position of each actor in the formation,
Set the content of the additional effect to the state.

■ Invalid formation
You can create states that negate the additional effects of formations.
In the memo field of the state
<FormationInvalid>
If there is even one actor in that state,
The additional effects of the formation are negated.

■ About the acquisition of formation
You can learn formations by using the plugin parameter "LearnFormation".
On the contrary, you can forget the formation by using "Forget Formation".


【License】
This plugin is available under the terms of the MIT license.

@param FormationDatas
@text formation data
@type struct<FormationData>[]
@default []
@desc
Set formation data.

@param NumEquipFormationSlots
@text Number of formation slots
@type number
@default 3
@desc
Specifies the number of formations that can be set.

@param EnabledBattleFormationChange
@text Enable formation change during battle
@on valid
@off invalid
@type boolean
@default true
@desc
Set to true to enable formation changes during battle.

@param EnabledFormationMenuSwitchId
@text formation menu display switch
@type switch
@default 0
@desc
Specify the switch to switch whether to display the formation menu.

@param ChangeFormationSlotSe
@text Formation slot change SE
@type struct<SE>
@default {"FileName": "Decision5", "Volume": "90", "Pitch": "100", "Pan": "0"}
@desc
Specifies the SE to play when changing formation slots.

@param ChangeCurrentFormationSe
@text Formation change SE
@type struct<SE>
@default {"FileName": "Decision5", "Volume": "90", "Pitch": "100", "Pan": "0"}
@desc
Specifies the SE to play when the formation used is changed.

@param BattleFormationXOfs
@text Combat formation X coordinate offset
@type number
@default 360
@desc
Specifies the X coordinate offset to the starting point of the formation in battle.

@param BattleFormationYOfs
@text Combat formation Y coordinate offset
@type number
@default 100
@desc
Specifies the Y coordinate offset to the start of the formation in battle.

@param WindowSize
@text Window size
@type struct<WindowSize>
@default {"FormationListHeight":"216"}
@desc
Set the size of various windows.

@param ShiftButton
@text shift button
@type struct <ShiftButton>
@default {"ButtonSetX": "8", "ButtonSetW": "2"}
@desc
Set the shift button information.

@param Text
@text Display text
@type struct<Text>
@default {"MenuFormationText":"tactics","EquipFormationList":"Available formations","HasFormationList":"All formations","EmptySlot":"------"}
@desc
Sets the text used in the game.


@command StartFormationScene
@text Formation scene start
@desc Starts the formation scene.


@command LearnFormation
@text Formation acquisition
@desc Learn formations.

@arg FormationId
@text Formation ID
@type number
@desc Specify the formation ID to learn.

@arg VariableId
@text variable ID
@type variable
@desc Specify the variable ID that stores the formation ID to be learned.


@command ForgetFormation
@text formation forgetting
@desc Forget the formation.

@arg FormationId
@text Formation ID
@type number
@default 0
@desc Specify the formation ID to forget.

@arg VariableId
@text variable ID
@type variable
@default 0
@desc Specifies the variable ID that stores the formation ID to forget.


@command ChangeEquipFormations
@text Equipment formation change
@desc Change the formation you are equipped with.

@arg EquipSlotIndex
@text Equipment formation slot
@type number
@desc Specifies the formation slot to change. If -1 is specified, the equipment formation of the slot will be removed.

@arg HasFormationId
@text Formation ID in possession
@type number
@desc Specify the formation ID you have.


@command ChangeFormation
@text Current formation change
@desc Change the current formation.

@arg SlotIndex
@text Equipment formation slot
@type number
@desc Specifies the formation slot to change.
*/


/*~struct~FormationData:
@param Name
@text formation name
@type string
@desc
Specify the formation name.

@param IconIndex
@text icon
@type number
@desc
Specify the formation icon.

@param Description
@text Formation description
@type multiline_string
@desc
Specifies the formation description.

@param Positions
@text position
@type struct<Position>[]
@desc
Specify the position of each actor.

@param MapId
@text map ID
@type number
@desc
Specifies the map ID to read the position.
*/


/*~struct~Position:
@param X
@text X coordinates
@type string
@desc
Specifies the X coordinate of the actor.

@param Y
@text Y coordinates
@type string
@desc
Specifies the Y coordinate of the actor.

@param StateId
@text state ID
@type state
@desc
Specify the state ID to be assigned when applying the formation.
*/


/*~struct~SE:
@param FileName
@text SE filename
@type file
@dir audio / se
@default Decision5
@desc
Specify the file name of the SE to play.

@param Volume
@text SE volume
@type number
@default 90
@desc
Specify the volume of SE to be played.

@param Pitch
@text SE pitch
@type number
@default 100
@desc
Specify the pitch of the SE to play.

@param Pan
@text SE phase
@type number
@default 0
@desc
Specify the pan of the SE to play.
*/


/*~struct~WindowSize:
@param FormationListHeight
@text Formation list height
@type number
@default 216
@desc
Specifies the vertical width of the formation list window.
*/


/*~struct~ShiftButton:
@param ButtonSetX
@text button set X
@type string
@default 8
@desc
Specifies the X position of the shift button on the button set. (Unit: 48px)

@param ButtonSetW
@text button set W
@type string
@default 2
@desc
Specifies the width of the shift button on the button set. (Unit: 48px)
*/


/*~struct~Text:
@param MenuFormationText
@text Menu display text
@type string
@default tactics
@desc
Specifies the name of the formation change to add to the menu and battle.

@param EquipFormationList
@text Available formations
@type string
@default Available formations
@desc
Specifies the name of the formation that can be used.

@param HasFormationList
@text All formations
@type string
@default All formations
@desc
Specify the names of all formations.

@param EmptySlot
@text empty slot
@type string
@default ------
@desc
Specifies the text to display in the empty slot.
*/


/*:ja
@target MZ
@plugindesc 陣形システム v1.2.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/FormationSystem.js
@help
陣形システムを導入するプラグインです。

【概要】
このプラグインでは、メニュー画面からいくつかの陣形を事前にストックしておいて、
戦闘中にストックしておいた陣形の中から一つを選んで適用することができます。
陣形の変更は、戦闘中のどのタイミングでも行うことができます。


【操作方法】
・戦闘中に使用する陣形の設定
メニュー画面から「戦術」メニューを開くことで、
戦闘中に使用可能な陣形のスロットをカスタマイズします。

スロットにある陣形のうち、Eマークがついている陣形は、現在採用している陣形になります。
現在採用している陣形は、Shiftキーを押すことで別の陣形に変更することができます。

・戦闘中における陣形の変更
戦闘中では、パーティコマンドに「戦術」コマンドが追加されます。
このコマンドを選択すると、スロットに設定されている陣形の中から
適用する陣形を変更することができます。


【使用方法】
■陣形の作成
プラグインパラメータ「FormationDatas」を編集して、陣形を作成します。
陣形の設定では各アクターのポジションの設定には、次の二つの方法があります。
・数式で座標を入力する
　　X座標とY座標を指定する方法です。座標には数式を使うことができます。
　　また、数式内でindexというワードを使用すると、該当するアクターが先頭から
　　何番目かを表す数値に置き換えられます。(先頭から0, 1, 2...という値になります)
　　この方法を使用する場合、プラグインパラメータのマップIDには0を指定してください。

・マップから座標を読み込む
　　マップに配置されたイベントを各アクターのポジションと見立てる方法です。
　　対象のマップにイベントを作成し、メモ欄に該当するアクターの先頭からの順番を記載します。
　　(例)先頭のアクターのポジションを設定する場合
　　イベントを作成し、メモ欄に
　　0
　　と記載します。

作成した陣形は、プラグインパラメータの登録順に(0, 1, 2, ...)という形でIDが振られます。
このうち、ID0の陣形についてはデフォルトの陣形として使用されます。

陣形のポジションは戦闘に参加するアクターの数だけ用意する必要があります。
例えば4人戦闘に参加させる場合、4人分のポジションの登録が必要となります。
なお、1～3人が戦闘に参加するといった場合は3人分のポジションの登録が必要です。

■陣形の追加効果の設定
陣形の追加効果はステートによって作成します。
陣形の各アクターのポジションごとに適用するステートを指定し、
ステートに追加効果の内容を設定します。

■陣形無効
陣形の追加効果を無効化するステートを作成することができます。
ステートのメモ欄に
<FormationInvalid>
と記載すると、そのステートにかかったアクターが一人でもいる場合、
陣形の追加効果が無効化されます。

■陣形の習得について
プラグインパラメータ「LearnFormation」を使用することで、陣形を習得することができます。
逆に「ForgetFormation」を使用することで、陣形を忘れることができます。


【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@param FormationDatas
@text 陣形データ
@type struct<FormationData>[]
@default []
@desc
陣形データを設定します。

@param NumEquipFormationSlots
@text 陣形スロット数
@type number
@default 3
@desc
セットできる陣形数を指定します。

@param EnabledBattleFormationChange
@text 戦闘中の陣形変更有効化
@on 有効
@off 無効
@type boolean
@default true
@desc
trueを設定すると、戦闘中の陣形変更を有効化します。

@param EnabledFormationMenuSwitchId
@text 陣形メニュー表示スイッチ
@type switch
@default 0
@desc
陣形メニュー表示有無を切り替えるスイッチを指定します。

@param ChangeFormationSlotSe
@text 陣形スロット変更SE
@type struct<SE>
@default {"FileName":"Decision5","Volume":"90","Pitch":"100","Pan":"0"}
@desc
陣形のスロットを変更したときに再生するSEを指定します。

@param ChangeCurrentFormationSe
@text 使用陣形変更SE
@type struct<SE>
@default {"FileName":"Decision5","Volume":"90","Pitch":"100","Pan":"0"}
@desc
使用する陣形を変更したときに再生するSEを指定します。

@param BattleFormationXOfs
@text 戦闘陣形X座標オフセット
@type number
@default 360
@desc
戦闘での陣形の開始地点までのX座標オフセットを指定します。

@param BattleFormationYOfs
@text 戦闘陣形Y座標オフセット
@type number
@default 100
@desc
戦闘での陣形の開始地点までのY座標オフセットを指定します。

@param WindowSize
@text ウィンドウサイズ
@type struct<WindowSize>
@default {"FormationListHeight":"216"}
@desc
各種ウィンドウのサイズを設定します。

@param ShiftButton
@text シフトボタン
@type struct<ShiftButton>
@default {"ButtonSetX":"8","ButtonSetW":"2"}
@desc
シフトボタンの情報設定します。

@param Text
@text 表示テキスト
@type struct<Text>
@default {"MenuFormationText":"戦術","EquipFormationList":"使用可能な陣形","HasFormationList":"全ての陣形","EmptySlot":"------"}
@desc
ゲーム中で使用されるテキストを設定します。


@command StartFormationScene
@text 陣形シーン開始
@desc 陣形シーンを開始します。


@command LearnFormation
@text 陣形習得
@desc 陣形を習得します。

@arg FormationId
@text 陣形ID
@type number
@desc 習得する陣形IDを指定します。

@arg VariableId
@text 変数ID
@type variable
@desc 習得する陣形IDが格納された変数IDを指定します。


@command ForgetFormation
@text 陣形忘却
@desc 陣形を忘れます。

@arg FormationId
@text 陣形ID
@type number
@default 0
@desc 忘れる陣形IDを指定します。

@arg VariableId
@text 変数ID
@type variable
@default 0
@desc 忘れる陣形IDが格納された変数IDを指定します。


@command ChangeEquipFormations
@text 装備陣形変更
@desc 装備中の陣形を変更します。

@arg EquipSlotIndex
@text 装備陣形スロット
@type number
@desc 変更する陣形スロットを指定します。-1を指定した場合、スロットの装備陣形を外します。

@arg HasFormationId
@text 所持している陣形ID
@type number
@desc 所持している陣形IDを指定します。


@command ChangeFormation
@text 現在陣形変更
@desc 現在の陣形を変更します。

@arg SlotIndex
@text 装備陣形スロット
@type number
@desc 変更する陣形のスロットを指定します。
*/


/*~struct~FormationData:ja
@param Name
@text 陣形名
@type string
@desc
陣形名を指定します。

@param IconIndex
@text アイコン
@type number
@desc
陣形のアイコンを指定します。

@param Description
@text 陣形の説明
@type multiline_string
@desc
陣形の説明を指定します。

@param Positions
@text ポジション
@type struct<Position>[]
@desc
各アクターのポジションを指定します。

@param MapId
@text マップID
@type number
@desc
ポジションを読み込むマップIDを指定します。
*/


/*~struct~Position:ja
@param X
@text X座標
@type string
@desc
アクターのX座標を指定します。

@param Y
@text Y座標
@type string
@desc
アクターのY座標を指定します。

@param StateId
@text ステートID
@type state
@desc
陣形適用時に付与するステートIDを指定します。
*/


/*~struct~SE:ja
@param FileName
@text SEファイル名
@type file
@dir audio/se
@default Decision5
@desc
再生するSEのファイル名を指定します。

@param Volume
@text SE音量
@type number
@default 90
@desc
再生するSEのvolumeを指定します。

@param Pitch
@text SEピッチ
@type number
@default 100
@desc
再生するSEのpitchを指定します。

@param Pan
@text SE位相
@type number
@default 0
@desc
再生するSEのpanを指定します。
*/


/*~struct~WindowSize:ja
@param FormationListHeight
@text 陣形リスト縦幅
@type number
@default 216
@desc
陣形リストウィンドウの縦幅を指定します。
*/


/*~struct~ShiftButton:ja
@param ButtonSetX
@text ボタンセットX
@type string
@default 8
@desc
シフトボタンのボタンセット上でのX位置を指定します。(単位: 48px)

@param ButtonSetW
@text ボタンセットW
@type string
@default 2
@desc
シフトボタンのボタンセット上での横幅を指定します。(単位: 48px)
*/


/*~struct~Text:ja
@param MenuFormationText
@text メニュー表示テキスト
@type string
@default 戦術
@desc
メニューと戦闘に追加する陣形変更の名称を指定します。

@param EquipFormationList
@text 使用可能な陣形
@type string
@default 使用可能な陣形
@desc
使用可能な陣形の名称を指定します。

@param HasFormationList
@text 全ての陣形
@type string
@default 全ての陣形
@desc
全ての陣形の名称を指定します。

@param EmptySlot
@text 空スロット
@type string
@default ------
@desc
空スロットに表示するテキストを指定します。
*/

const FormationSystemPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

let $dataFormations = null;

const FormationSystemClassAlias = (() => {
"use strict";

const MapLoaders = {};


// Common library.
class HttpResponse {
    constructor(result, xhr, event) {
        this._result = result;
        this._xhr = xhr;
        this._event = event;
    }

    result() {
        return this._result;
    }

    status() {
        return this._xhr.status;
    }

    response() {
        return this._xhr.response;
    }
}

class HttpRequest {
    static get(path, opt = { mimeType: null }, responseCallback) {
        const req = new HttpRequest(path, "GET", opt, responseCallback);
        req.send();
        return req;
    }

    static post(path, params, opt = { mimeType: null }, responseCallback) {
        const req = new HttpRequest(path, "POST", opt, responseCallback);
        req.send(params);
        return req;
    }

    constructor(path, method, opt = { mimeType: null }, responseCallback) {
        this._path = path;
        this._method = method;
        this._responseCallback = responseCallback;
        this._mimeType = opt.mimeType;
    }

    send(params = null) {
        const xhr = new XMLHttpRequest();
        xhr.open(this._method, this._path);
        if (this._mimeType) xhr.overrideMimeType(this._mimeType);
        let json = null;
        if (params) json = JSON.stringify(params);
        xhr.addEventListener("load", (e) => {
            this._responseCallback(new HttpResponse("load", xhr, e));
        });
        xhr.addEventListener("error", (e) => {
            this._responseCallback(new HttpResponse("error", xhr, e));
        });
        xhr.send(json);
    }
}


class PluginParamsParser {
    static parse(params, typeData, predictEnable = true) {
        return new PluginParamsParser(predictEnable).parse(params, typeData);
    }

    constructor(predictEnable = true) {
        this._predictEnable = predictEnable;
    }

    parse(params, typeData, loopCount = 0) {
        if (++loopCount > 255) throw new Error("endless loop error");
        const result = {};
        for (const name in typeData) {
            if (params[name] === "" || params[name] === undefined) {
                result[name] = null;
            } else {
                result[name] = this.convertParam(params[name], typeData[name], loopCount);
            }
        }
        if (!this._predictEnable) return result;
        if (typeof params === "object" && !(params instanceof Array)) {
            for (const name in params) {
                if (result[name]) continue;
                const param = params[name];
                const type = this.predict(param);
                result[name] = this.convertParam(param, type, loopCount);
            }
        }
        return result;
    }

    convertParam(param, type, loopCount) {
        if (typeof type === "string") {
            return this.cast(param, type);
        } else if (typeof type === "object" && type instanceof Array) {
            const aryParam = JSON.parse(param);
            if (type[0] === "string") {
                return aryParam.map(strParam => this.cast(strParam, type[0]));
            } else {
                return aryParam.map(strParam => this.parse(JSON.parse(strParam), type[0]), loopCount);
            }
        } else if (typeof type === "object") {
            return this.parse(JSON.parse(param), type, loopCount);
        } else {
            throw new Error(`${type} is not string or object`);
        }
    }

    cast(param, type) {
        switch(type) {
        case "any":
            if (!this._predictEnable) throw new Error("Predict mode is disable");
            return this.cast(param, this.predict(param));
        case "string":
            return param;
        case "number":
            if (param.match(/^\-?\d+\.\d+$/)) return parseFloat(param);
            return parseInt(param);
        case "boolean":
            return param === "true";
        default:
            throw new Error(`Unknow type: ${type}`);
        }
    }

    predict(param) {
        if (param.match(/^\-?\d+$/) || param.match(/^\-?\d+\.\d+$/)) {
            return "number";
        } else if (param === "true" || param === "false") {
            return "boolean";
        } else {
            return "string";
        }
    }
}


class SpriteMover {
    constructor(sprite, moveSpeed) {
        this._moveSpeed = moveSpeed;
        this._sprite = sprite;
        this._targetX = null;
        this._targetY = null;
        this._moving = false;
    }

    get moveSpeed() { return this._moveSpeed }
    set moveSpeed(_moveSpeed) { this._moveSpeed = _moveSpeed; }

    update() {
        if (this._moving) this.updateMove();
    }

    updateMove() {
        const sprite = this._sprite;
        const oy = this._targetY - sprite.y;
        const ox = this._targetX - sprite.x;
        const rad = Math.atan2(oy, ox);
        const disX = this._moveSpeed * Math.cos(rad);
        const disY = this._moveSpeed * Math.sin(rad);
        sprite.x += disX;
        sprite.y += disY;
        if ((disX < 0 && sprite.x + disX < this._targetX) || (disX > 0 && sprite.x + disX > this._targetX)) sprite.x = this._targetX;
        if ((disY < 0 && sprite.y + disY < this._targetY) || (disY > 0 && sprite.y + disY > this._targetY)) sprite.y = this._targetY;
        if (sprite.x === this._targetX && sprite.y === this._targetY) this._moving = false;
    }

    isMoving() {
        return this._moving;
    }

    isBusy() {
        return this.isMoving();
    }

    startMove(targetPoint) {
        this._targetX = targetPoint.x;
        this._targetY = targetPoint.y;
        this._moving = true;
    }

    fastMove(targetPoint) {
        this._sprite.x = targetPoint.x;
        this._sprite.y = targetPoint.y;
        this._moving = false;
    }

    forceEndMove() {
        this._sprite.x = this._targetX;
        this._sprite.y = this._targetY;
        this._moving = false;
    }
}

class Window_DataList extends Window_Selectable {
    initialize(rect) {
        super.initialize(rect);
        this.refresh();
        this.select(0);
        this.activate();
    }

    maxItems() {
        return this._list.length;
    }

    clearCommandList() {
        this._list = [];
    }

    makeCommandList() {
    }

    addData(data) {
        this._list.push(data);
    }

    currentData() {
        return this.index() >= 0 ? this.dataAt(this.index()) : null;
    }

    dataAt(index) {
        return this._list[index];
    }

    drawItem(index) {
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        this.drawText(this.dataAt(index).toString(), rect.x, rect.y, rect.width, align);
    }

    itemTextAlign() {
        return "center";
    }

    isOkEnabled() {
        return true;
    }

    refresh() {
        this.clearCommandList();
        this.makeCommandList();
        super.refresh();
    }
}

class WindowModule_DataListTitle {
    static get TITLE_HEIGHT() { return 56; }

    static createTitleSprite() {
        const bitmap = new Bitmap(this.width - this.padding * 2, WindowModule_DataListTitle.TITLE_HEIGHT);
        bitmap.fontFace = $gameSystem.mainFontFace();
        bitmap.fontSize = $gameSystem.mainFontSize();
        this._titleSprite = new Sprite(bitmap);
        this._titleSprite.x = this.padding;
        this._titleSprite.y = this.padding;
        this.addChild(this._titleSprite);
    }

    static drawTitle(title) {
        if (!this._titleSprite) return;
        const bitmap = this._titleSprite.bitmap;
        const rect = this.itemLineRect(0);
        bitmap.clear();
        bitmap.drawText(title, rect.x, this.padding, rect.width, rect.height, "left");
        const x = rect.x;
        const y = this.padding + rect.height;
        const width = rect.width;
        const height = 5;
        const outlineColor = this.contents.outlineColor;
        const mainColor = this.systemColor()
        bitmap.fillRect(x, y, width, height, outlineColor);
        bitmap.fillRect(x + 1, y + 1, width - 2, height - 2, mainColor);
    }

    static _updateClientArea() {
        const pad = this._padding;
        this._clientArea.move(pad, pad);
        this._clientArea.x = pad - this.origin.x;
        this._clientArea.y = pad - this.origin.y + WindowModule_DataListTitle.TITLE_HEIGHT;
        if (this.innerWidth > 0 && this.innerHeight > 0) {
            this._clientArea.visible = this.isOpen();
        } else {
            this._clientArea.visible = false;
        }
    }

    static innerHeight() {
        return Math.max(0, this._height - this._padding * 2 - WindowModule_DataListTitle.TITLE_HEIGHT);
    }

    static isTouchedInsideFrame() {
        const touchPos = new Point(TouchInput.x, TouchInput.y);
        const localPos = this.worldTransform.applyInverse(touchPos);
        return this.innerRect.contains(localPos.x, localPos.y - this._titleSprite.bitmap.height);
    }

    static hitTest(x, y) {
        if (this.innerRect.contains(x, y - this._titleSprite.bitmap.height)) {
            const cx = this.origin.x + x - this.padding;
            const cy = this.origin.y + y - this.padding;
            const topIndex = this.topIndex();
            for (let i = 0; i < this.maxVisibleItems(); i++) {
                const index = topIndex + i;
                if (index < this.maxItems()) {
                    const rect = this.itemRect(index);
                    rect.y += this._titleSprite.bitmap.height;
                    if (rect.contains(cx, cy)) {
                        return index;
                    }
                }
            }
        }
        return -1;
    };
}

// Parse plugin parameters.
const typeDefine = {
    FormationDatas: [{
        Name: "string",
        IconIndex: "number",
        Description: "string",
        Positions: [{
            X: "string",
            Y: "string",
        }],
    }],
    ChangeFormationSlotSe: {},
    ChangeCurrentFormationSe: {},
    WindowSize: {},
    Text: {},
    ShiftButton: {},
};

const params = PluginParamsParser.parse(PluginManager.parameters(FormationSystemPluginName), typeDefine);

const FormationDatas = params.FormationDatas;
const NumEquipFormationSlots = params.NumEquipFormationSlots;
const EnabledBattleFormationChange = params.EnabledBattleFormationChange;
const BattleFormationXOfs = params.BattleFormationXOfs;
const BattleFormationYOfs = params.BattleFormationYOfs;
const EnabledFormationMenuSwitchId = params.EnabledFormationMenuSwitchId;
const ChangeFormationSlotSe = params.ChangeFormationSlotSe;
const ChangeCurrentFormationSe = params.ChangeCurrentFormationSe;
const WindowSize = params.WindowSize;
const Text = params.Text;
const ShiftButton = params.ShiftButton;


class FormationData {
    static fromParam(id, param) {
        const positionDatas = [];
        let index = 0;
        for (const positionParam of param.Positions) {
            const x = eval(positionParam.X);
            const y = eval(positionParam.Y);
            positionDatas.push({ x: x, y: y, stateId: positionParam.StateId });
            index++;
        }
        return new FormationData(id, param.Name, param.IconIndex, param.Description, positionDatas, param.MapId);
    }

    constructor(id, name, iconIndex, description, positions, mapId) {
        this._id = id;
        this._name = name;
        this._iconIndex = iconIndex;
        this._description = description;
        this._positions = positions;
        this._mapId = mapId;
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get iconIndex() { return this._iconIndex; }
    get description() { return this._description; }
    get positions() { return this._positions; }
    get mapId() { return this._mapId; }

    set positions(_positions) { this._positions = _positions; }

    position(actorId) {
        const i = $gameParty.members().map(actor => actor.actorId()).indexOf(actorId);
        if (i === -1) throw new Error(`actorId: ${actorId} is not found`);
        return this._positions[i];
    }
}

class Sprite_ShiftButton extends Sprite_Button {
    initialize() {
        super.initialize("shift");
    }

    buttonData() {
        const buttonTable = {
            shift: { x: ShiftButton.ButtonSetX, w: ShiftButton.ButtonSetW }
        };
        return buttonTable[this._buttonType];
    }
}

class Scene_Formation extends Scene_MenuBase {
    create() {
        super.create();
        this.createAllWindow();
    }

    start() {
        super.start();
        this._equipFormationListWindow.activate();
        this.changeFormation(true);
    }

    createButtons() {
        super.createButtons();
        if (ConfigManager.touchUI) {
            this.createShiftButton();
        }
    }

    createShiftButton() {
        if (ConfigManager.touchUI) {
            this._shiftButton = new Sprite_ShiftButton();
            this._shiftButton.x += 8;
            this._shiftButton.y += 8;
            this.addChild(this._shiftButton);
        }
    }

    // Create window
    createAllWindow() {
        this.createHelpWindow();
        this.createEquipFormationListWindow();
        this.createHasFormationListWindow();
        this.createFormationDetailWindow();
    }

    createEquipFormationListWindow() {
        this._equipFormationListWindow = new Window_EquipFormationList(this.equipFormationListWindowRect());
        this._equipFormationListWindow.setHelpWindow(this._helpWindow);
        this._equipFormationListWindow.setHandler("ok", this.onEquipFormationListOk.bind(this));
        this._equipFormationListWindow.setHandler("cancel", this.onEquipFormationListCancel.bind(this));
        this._equipFormationListWindow.setHandler("select", this.onEquipFormationListSelect.bind(this));
        this._equipFormationListWindow.setHandler("shift", this.onEquipFormationListShift.bind(this));
        this.addWindow(this._equipFormationListWindow);
    }

    createHasFormationListWindow() {
        this._hasFormationListWindow = new Window_HasFormationList(this.hasFormationListWindowRect());
        this._hasFormationListWindow.setHelpWindow(this._helpWindow);
        this._hasFormationListWindow.setHandler("ok", this.onHasFormationListOk.bind(this));
        this._hasFormationListWindow.setHandler("cancel", this.onHasFormationListCancel.bind(this));
        this._hasFormationListWindow.setHandler("select", this.onHasFormationListSelect.bind(this));
        this.addWindow(this._hasFormationListWindow);
    }

    createFormationDetailWindow() {
        this._formationDetailWindow = new Window_FormationDetail(this.formationDetailWindowRect());
        this.addWindow(this._formationDetailWindow);
    }

    // Window rect
    equipFormationListWindowRect() {
        const w = this.mainCommandWidth();
        const h = WindowSize.FormationListHeight;
        const x = (this.isRightInputMode() ? Graphics.boxWidth - w : 0);
        const y = this.mainAreaTop();
        return new Rectangle(x, y, w, h);
    }

    hasFormationListWindowRect() {
        const equipFormationListWindowRect = this.equipFormationListWindowRect();
        const x = equipFormationListWindowRect.x;
        const y = equipFormationListWindowRect.y + equipFormationListWindowRect.height;
        const w = equipFormationListWindowRect.width;
        const h = this.mainAreaBottom() - y;
        return new Rectangle(x, y, w, h);
    }

    formationDetailWindowRect() {
        const equipFormationListWindowRect = this.equipFormationListWindowRect();
        const x = (this.isRightInputMode() ? 0 : equipFormationListWindowRect.x + equipFormationListWindowRect.width);
        const y = equipFormationListWindowRect.y;
        const w = Graphics.boxWidth - (this.isRightInputMode() ? equipFormationListWindowRect.width : x);
        const h = this.mainAreaHeight();
        return new Rectangle(x, y, w, h);
    }

    helpAreaHeight() {
        return this.calcWindowHeight(3, false);
    }

    // Define window handlers
    onEquipFormationListOk() {
        this.change_EquipFormationListWindow_To_HasFormationListWindow();
    }

    onEquipFormationListCancel() {
        this.popScene();
    }

    onEquipFormationListSelect() {
        this.changeFormation();
    }

    onEquipFormationListShift() {
        if (this._equipFormationListWindow.active) {
            const changed = $gameParty.changeCurrentSlot(this._equipFormationListWindow.index());
            if (!changed) return;
            this._equipFormationListWindow.refresh();
            this.playChangeCurrentFormationSe();
        }
    }

    onHasFormationListOk() {
        const hasFormation = this._hasFormationListWindow.currentData();
        $gameParty.changeEquipFormations(this._equipFormationListWindow.index(), hasFormation);
        this.change_HasFormationListWindow_To_EquipFormationListWindow();
        this.changeFormation();
    }

    onHasFormationListCancel() {
        this.change_HasFormationListWindow_To_EquipFormationListWindow();
        this.changeFormation();
    }

    onHasFormationListSelect() {
        this.changeFormation();
    }

    // Change window
    change_EquipFormationListWindow_To_HasFormationListWindow() {
        this._equipFormationListWindow.deactivate();
        this._equipFormationListWindow.refresh();
        this._hasFormationListWindow.activate();
        this._hasFormationListWindow.select(0);
        this._hasFormationListWindow.refresh();
        this._hasFormationListWindow.callUpdateHelp();
    }

    change_HasFormationListWindow_To_EquipFormationListWindow() {
        this._hasFormationListWindow.deactivate();
        this._hasFormationListWindow.deselect();
        this._hasFormationListWindow.refresh();
        this._equipFormationListWindow.activate();
        this._equipFormationListWindow.refresh();
        this._equipFormationListWindow.callUpdateHelp();
    }

    // Change formation
    changeFormation(fast = false) {
        let formation;
        if (this._equipFormationListWindow.active) {
            formation = this._equipFormationListWindow.formation();
        } else if (this._hasFormationListWindow.active) {
            formation = this._hasFormationListWindow.formation();
        }
        this._formationDetailWindow.changeFormation(formation, fast);
    }

    playChangeCurrentFormationSe() {
        if (ChangeCurrentFormationSe.FileName === "") return;
        const se = {
            name: ChangeCurrentFormationSe.FileName,
            pan: ChangeCurrentFormationSe.Pan,
            pitch: ChangeCurrentFormationSe.Pitch,
            volume: ChangeCurrentFormationSe.Volume,
        }
        AudioManager.playSe(se);
    }
}

class Window_FormationList extends Window_DataList {
    initialize(rect) {
        super.initialize(rect);
        this.deactivate();
    }

    select(index) {
        super.select(index);
        if (this.active && index >= 0) this.callHandler("select");
    }

    formation() {
        return this.currentData();
    }

    drawItem(index) {
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        const formation = this.dataAt(index);
        if (formation) {
            this.drawItemName(formation, rect.x, rect.y, rect.width);
        } else {
            this.drawText(Text.EmptySlot, rect.x, rect.y, rect.width, "center");
        }
    }

    updateHelp() {
        const visibleTitle = (this._helpWindow.height >= 128 ? true : false);
        if (this.formation()) {
            const title = (visibleTitle ? `\\C[1]【${this.formation().name}】\\C[0]\n` : "");
            const text = `${title}${this.formation().description}`;
            this._helpWindow.setText(text);
        } else {
            this._helpWindow.setText("");
        }
    }
}

class Window_EquipFormationList extends Window_FormationList {
    initialize(rect) {
        super.initialize(rect);
        this.createTitleSprite();
        this.refresh();
    }

    createTitleSprite() {
        WindowModule_DataListTitle.createTitleSprite.call(this);
    }

    refresh() {
        this.drawTitle(Text.EquipFormationList)
        super.refresh();
    }

    drawTitle(title) {
        WindowModule_DataListTitle.drawTitle.call(this, title);
    }

    update() {
        super.update();
        if (Input.isTriggered("shift")) this.callHandler("shift");
    }

    makeCommandList() {
        for (const formation of $gameParty.equipFormations()) {
            this.addData(formation);
        }
    }

    drawItem(index) {
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        const formation = this.dataAt(index);
        if (formation) {
            this.drawItemName(formation, rect.x + 32, rect.y, rect.width - 32);
            if ($gameParty.currentFormation() && formation.id === $gameParty.currentFormation().id) {
                this.drawText("Ｅ", rect.x, rect.y, rect.width, "left");
            }
        } else {
            this.drawText(Text.EmptySlot, rect.x, rect.y, rect.width, "center");
        }
    }

    _updateClientArea() {
        WindowModule_DataListTitle._updateClientArea.call(this);
    }

    isTouchedInsideFrame() {
        return WindowModule_DataListTitle.isTouchedInsideFrame.call(this);
    }

    hitTest(x, y) {
        return WindowModule_DataListTitle.hitTest.call(this, x, y);
    }
}

Object.defineProperty(Window_EquipFormationList.prototype, "innerHeight", {
    get: function() {
        return WindowModule_DataListTitle.innerHeight.call(this);
    },
    configurable: true
});

class Window_HasFormationList extends Window_FormationList {
    initialize(rect) {
        super.initialize(rect);
        this.createTitleSprite();
        this.deselect();
        this.refresh();
    }

    createTitleSprite() {
        WindowModule_DataListTitle.createTitleSprite.call(this);
    }

    refresh() {
        this.drawTitle(Text.HasFormationList)
        super.refresh();
    }

    drawTitle(title) {
        WindowModule_DataListTitle.drawTitle.call(this, title);
    }

    makeCommandList() {
        for (const formation of $gameParty.hasFormations()) {
            this.addData(formation);
        }
    }

    maxItems() {
        return super.maxItems() + 1;
    }

    playOkSound() {
        this.playChangeFormationSlotSe();
    }

    playChangeFormationSlotSe() {
        if (ChangeFormationSlotSe.FileName === "") return;
        const se = {
            name: ChangeFormationSlotSe.FileName,
            pan: ChangeFormationSlotSe.Pan,
            pitch: ChangeFormationSlotSe.Pitch,
            volume: ChangeFormationSlotSe.Volume,
        }
        AudioManager.playSe(se);
    }

    _updateClientArea() {
        WindowModule_DataListTitle._updateClientArea.call(this);
    }

    isTouchedInsideFrame() {
        return WindowModule_DataListTitle.isTouchedInsideFrame.call(this);
    }

    hitTest(x, y) {
        return WindowModule_DataListTitle.hitTest.call(this, x, y);
    }
}

Object.defineProperty(Window_HasFormationList.prototype, "innerHeight", {
    get: function() {
        return WindowModule_DataListTitle.innerHeight.call(this);
    },
    configurable: true
});

class ActorPosition {
    constructor(actorId, sprite) {
        this._actorId = actorId;
        this._sprite = sprite;
        const currentPosition = $gameParty.currentFormation().position(actorId);
        this._point = { x: currentPosition.x, y: currentPosition.y };
        this._mover = new SpriteMover(this._point, 8);
    }

    get sprite() { return this._sprite };

    actor() {
        $gameActors.actor(this._actorId);
    }

    update(mode) {
        this._mover.update();
        if (mode === "menu") {
            this._sprite._homeX = this._point.x;
            this._sprite._homeY = this._point.y;
        } else if (mode === "battle") {
            this._sprite._homeX = this._point.x + BattleFormationXOfs;
            this._sprite._homeY = this._point.y + BattleFormationYOfs;
        }
    }

    changePosition(newPoint) {
        this._mover.startMove(newPoint);
    }

    fastChangePosition(newPoint) {
        this._mover.fastMove(newPoint);
    }
}

class FormationController {
    // mode: "menu" or "battle"
    constructor(actorSprites, mode) {
        this._actorPositions = {};
        this._mode = mode;
        this._actorSprites = null;
        this._lastFormation = null;
        this.reset(actorSprites);
    }

    // Generate a position from an actor sprite.
    reset(actorSprites) {
        this._actorSprites = actorSprites;
        this.createActorPositions();
    }

    createActorPositions() {
        for (let i = 0; i < $gameParty.battleMembers().length; i++) {
            const actor = $gameParty.members()[i];
            const actorId = actor.actorId();
            if (!(actorId in this._actorPositions)) {
                const sprite = this._actorSprites[i];
                this._actorPositions[actorId] = new ActorPosition(actorId, sprite);
            }
        }
    }

    update() {
        if (!this._lastFormation) return;
        for (let i = 0; i < $gameParty.battleMembers().length; i++) {
            const actor = $gameParty.members()[i];
            const position = this._actorPositions[actor.actorId()];
            // If an actor has just been added, it will not be updated because there is no position.
            if (!position) return;
            position.update(this._mode);
        }
    }

    changeFormation(newFormation, fast = false) {
        if (!newFormation) newFormation = this.defaultFormation();
        this._lastFormation = newFormation;
        for (let i = 0; i < $gameParty.battleMembers().length; i++) {
            const actor = $gameParty.members()[i];
            const actorId = actor.actorId();
            const position = this._actorPositions[actorId];
            // If there is no position, it is set by setActorHome, so it is not set here.
            if (!position) return;
            if (fast) {
                position.fastChangePosition(newFormation.position(actorId));
            } else {
                position.changePosition(newFormation.position(actorId));
            }
        }
    }

    defaultFormation() {
        return $dataFormations[0];
    }
}

class Window_FormationDetail extends Window_Selectable {
    initialize(rect) {
        super.initialize(rect);
        this._formationData = null;
        this._actorSprites = [];
        this.createActorSprites();
        this._formationController = new FormationController(this._actorSprites, "menu");
    }

    createActorSprites() {
        for (let i = 0; i < $gameParty.battleMembers().length; i++) {
            const actor = $gameParty.members()[i];
            const sprite = new Sprite_MenuFormationActor(actor);
            sprite.startMotion("walk");
            this._actorSprites.push(sprite);
            this.addChild(sprite);
        }
    }

    update() {
        super.update();
        this._formationController.update();
    }

    changeFormation(newFormation, fast = false) {
        this._formationController.changeFormation(newFormation, fast);
        this._formationData = newFormation;
    }
}

class Sprite_MenuFormationActor extends Sprite_Actor {
    updateMove() {
    }

    setActorHome(index) {
        const formation = $gameParty.currentFormation();
        const actor = $gameParty.members()[index];
        const position = formation.position(actor.actorId());
        this.setHome(position.x, position.y);
    }

    startMove(x, y, duration) {
    }
}


// Party formation.
const _Game_Party_initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
    _Game_Party_initialize.call(this);
    this.initFormations();
    this._currentFormationSlot = 0;
    this._equipFormationIds = new Array(NumEquipFormationSlots);
    this._equipFormationIds[0] = 0;
    this._hasFormationIds = [];
};

Game_Party.prototype.initFormations = function() {
    $dataFormations = [];
    for (let i = 0; i < FormationDatas.length; i++) {
        $dataFormations.push(FormationData.fromParam(i, FormationDatas[i]));
    }
    for (const id in MapLoaders) {
        const formation = $dataFormations[id];
        const mapLoader = MapLoaders[id];
        mapLoader.setupPositions(formation);
    }
};

Game_Party.prototype.learnFormation = function(formationId) {
    if (this._equipFormationIds.includes(formationId) || this._hasFormationIds.includes(formationId)) return;
    this._hasFormationIds.push(formationId);
};

Game_Party.prototype.forgetFormation = function(formationId) {
    this._equipFormationIds = this._equipFormationIds.map(id => id === formationId ? null : id);
    this._hasFormationIds = this._hasFormationIds.filter(id => id !== formationId);
};

Game_Party.prototype.currentFormation = function() {
    const formationId = this._equipFormationIds[this._currentFormationSlot];
    return (typeof formationId === "number") ? $dataFormations[formationId] : $dataFormations[0];
};

Game_Party.prototype.equipFormations = function() {
    return this._equipFormationIds.map(id => $dataFormations[id]);
};

Game_Party.prototype.hasFormations = function() {
    return this._hasFormationIds.map(id => $dataFormations[id]);
};

Game_Party.prototype.changeEquipFormations = function(slotIndex, targetFormation) {
    const equipFormationId = this._equipFormationIds[slotIndex];
    const hasFormationId = (targetFormation ? targetFormation.id : null);
    this._equipFormationIds[slotIndex] = hasFormationId;
    if (hasFormationId != null) this.changeCurrentSlot(slotIndex);
    if (hasFormationId != null) this._hasFormationIds = this._hasFormationIds.filter(id => id !== hasFormationId);
    if (equipFormationId != null) this._hasFormationIds.push(equipFormationId);
};

Game_Party.prototype.changeCurrentSlot = function(slotIndex) {
    if (slotIndex === this._currentFormationSlot || this._equipFormationIds[slotIndex] == null) return false;
    this._currentFormationSlot = slotIndex;
    return true;
};


// Battle formation.
class Window_BattleFormationList extends Window_FormationList {
    initialize(rect) {
        super.initialize(rect);
        this.hide();
        this.deactivate();
        this.refresh();
    }

    maxCols() {
        return 2;
    }

    makeCommandList() {
        const formations = $gameParty.equipFormations().filter(formation => formation);
        for (const formation of formations) {
            this.addData(formation);
        }
    }

    update() {
        super.update();
    }
}

Sprite_Actor.prototype.setActorHome = function(index) {
    const formation = $gameParty.currentFormation();
    const actor = $gameParty.members()[index];
    const position = formation.position(actor.actorId());
    this.setHome(position.x + BattleFormationXOfs, position.y + BattleFormationYOfs);
};

Window_PartyCommand.prototype.insertCommand = function(index, name, symbol, enabled = true, ext = null) {
    const command = { name: name, symbol: symbol, enabled: enabled, ext: ext };
    this._list.splice(index, 0, command);
};

const _Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
Window_PartyCommand.prototype.makeCommandList = function() {
    _Window_PartyCommand_makeCommandList.call(this);
    if (EnabledBattleFormationChange) this.insertCommand(1, Text.MenuFormationText, "battleFormation");
};

const _Scene_Battle_create = Scene_Battle.prototype.create;
Scene_Battle.prototype.create = function() {
    _Scene_Battle_create.call(this);
    this._formationController = new FormationController(this._spriteset._actorSprites, "battle");
    BattleManager.setFormationController(this._formationController);
};

const _Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    _Scene_Battle_update.call(this);
    this._formationController.update();
};

const _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
Scene_Battle.prototype.createPartyCommandWindow = function() {
    _Scene_Battle_createPartyCommandWindow.call(this);
    this._partyCommandWindow.setHandler("battleFormation", this.commandBattleFormation.bind(this));
};

const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    _Scene_Battle_createAllWindows.call(this);
    this.createBattleFormationListWindow();
};

Scene_Battle.prototype.createBattleFormationListWindow = function() {
    const rect = this.battleFormationListWindowRect();
    this._battleFormationListWindow = new Window_BattleFormationList(rect);
    this._battleFormationListWindow.setHelpWindow(this._helpWindow);
    this._battleFormationListWindow.setHandler("ok", this.onBattleFormationListOk.bind(this));
    this._battleFormationListWindow.setHandler("cancel", this.onBattleFormationListCancel.bind(this));
    this._battleFormationListWindow.setHandler("select", this.onBattleFormationListSelect.bind(this));
    this.addWindow(this._battleFormationListWindow);
};

Scene_Battle.prototype.battleFormationListWindowRect = function() {
    return this.skillWindowRect();
};

Scene_Battle.prototype.commandBattleFormation = function() {
    this._formationController.reset(this._spriteset._actorSprites);
    this._battleFormationListWindow.refresh();
    this.change_PartyCommandWindow_To_BattleFormationListWindow();
}

Scene_Battle.prototype.onBattleFormationListOk = function() {
    this.change_BattleFormationListWindow_To_PartyCommandWindow();
};

Scene_Battle.prototype.onBattleFormationListCancel = function() {
    this.change_BattleFormationListWindow_To_PartyCommandWindow();
};

Scene_Battle.prototype.onBattleFormationListSelect = function() {
    const slotIndex = this._battleFormationListWindow.index();
    BattleManager.changeFormation(slotIndex);
};

Scene_Battle.prototype.change_PartyCommandWindow_To_BattleFormationListWindow = function() {
    this._partyCommandWindow.hide();
    this._partyCommandWindow.deactivate();
    this._helpWindow.show();
    this._battleFormationListWindow.show();
    this._battleFormationListWindow.activate();
};

Scene_Battle.prototype.change_BattleFormationListWindow_To_PartyCommandWindow = function() {
    this._helpWindow.hide();
    this._battleFormationListWindow.hide();
    this._battleFormationListWindow.deactivate();
    this._partyCommandWindow.show();
    this._partyCommandWindow.activate();
};

BattleManager.setFormationController = function(formationController) {
    this._formationController = formationController;
};

BattleManager.changeFormation = function(slotIndex) {
    FormationStateUtils.clearFormationEffect();
    $gameParty.changeCurrentSlot(slotIndex);
    const newFormation = $gameParty.currentFormation();
    this._formationController.changeFormation(newFormation);
    FormationStateUtils.applyFormationEffect();
};


// Apply formation effect.
class FormationStateUtils {
    static isInvalidState(stateId) {
        const state = $dataStates[stateId];
        return state.meta.FormationInvalid;
    }

    static isChangeValid(erasedStateId) {
        return FormationStateUtils.isInvalidState(erasedStateId) && !FormationStateUtils.isFormationInvalid();
    }

    static applyFormationEffect() {
        for (const actor of $gameParty.battleMembers()) {
            actor.applyFormationEffect();
        }
    }
    
    static clearFormationEffect() {
        for (const actor of $gameParty.battleMembers()) {
            actor.clearFormationEffect();
        }
    }
    
    static isFormationInvalid() {
        for (const actor of $gameParty.battleMembers()) {
            if (actor.isFormationInvalidStateAdded()) return true;
        }
        return false;
    }
}

Game_Actor.prototype.isBattleStarted = function() {
    return this.actorId() && $gameParty.battleMembers().map(actor => actor.actorId()).includes(this.actorId());
}

const _Game_Actor_onBattleStart = Game_Actor.prototype.onBattleStart;
Game_Actor.prototype.onBattleStart = function(advantageous) {
    _Game_Actor_onBattleStart.call(this, advantageous);
    this.applyFormationEffect();
};

const _Game_Actor_onBattleEnd = Game_Actor.prototype.onBattleEnd;
Game_Actor.prototype.onBattleEnd = function() {
    _Game_Actor_onBattleEnd.call(this);
    this.clearFormationEffect();
};

Game_Actor.prototype.applyFormationEffect = function() {
    if (!this.isBattleStarted()) return;
    const formation = $gameParty.currentFormation();
    if (!(SceneManager._scene instanceof Scene_Battle)) return;
    if (FormationStateUtils.isFormationInvalid()) return;
    const position = formation.position(this.actorId());
    if (position.stateId && this.hp > 0) {
        // revive直後はisAliveがtrueにならないためaddStateではなくaddNewStateを使用
        // addStateで行う処理は陣形ステートには無関係のためaddNewStateで問題なし
        this.addNewState(position.stateId);
    }
};

Game_Actor.prototype.clearFormationEffect = function() {
    if (!this.isBattleStarted()) return;
    const formation = $gameParty.currentFormation();
    const position = formation.position(this.actorId());
    if (position.stateId) this.eraseState(position.stateId);
};

const _Game_Actor_revive = Game_Actor.prototype.revive;
Game_Actor.prototype.revive = function() {
    _Game_Actor_revive.call(this);
    this.applyFormationEffect();
};

const _Game_Actor_clearStates = Game_Actor.prototype.clearStates;
Game_Actor.prototype.clearStates = function() {
    _Game_Actor_clearStates.call(this);
    if (!this.isBattleStarted()) return;
    this.applyFormationEffect();
};

const _Game_Actor_addNewState = Game_Actor.prototype.addNewState;
Game_Actor.prototype.addNewState = function(stateId) {
    _Game_Actor_addNewState.call(this, stateId);
    if (!this.isBattleStarted()) return;
    if (this.isFormationInvalidStateAdded()) FormationStateUtils.clearFormationEffect();
};

const _Game_Actor_eraseState = Game_Actor.prototype.eraseState;
Game_Actor.prototype.eraseState = function(stateId) {
    _Game_Actor_eraseState.call(this, stateId);
    if (!this.isBattleStarted()) return;
    if (FormationStateUtils.isChangeValid(stateId)) FormationStateUtils.applyFormationEffect();
};

Game_Actor.prototype.isFormationInvalidStateAdded = function() {
    if (!this.isBattleStarted()) return false;
    for (const stateId of this._states) {
        if (FormationStateUtils.isInvalidState(stateId)) return true;
    }
    return false;
};


// Add FormationSystem to menu command.
const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    _Window_MenuCommand_addOriginalCommands.call(this);
    if (Text.MenuFormationText !== "") this.addCommand(Text.MenuFormationText, "battleFormation", this.isEnabledBattleFormationMenu());
};

Window_MenuCommand.prototype.isEnabledBattleFormationMenu = function() {
    if (EnabledFormationMenuSwitchId === 0) return true;
    return $gameSwitches.value(EnabledFormationMenuSwitchId);
};

const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler("battleFormation", this.battleFormation.bind(this));
};

Scene_Menu.prototype.battleFormation = function() {
    SceneManager.push(Scene_Formation);
};


// Load map data.
class FormationMapLoader {
    constructor() {
        this._response = null;
    }

    isLoading() {
        return !this._response;
    }

    setupPositions(formation) {
        const mapData = this.mapData();
        const originPositions = formation.positions;
        formation.positions = new Array(originPositions.length);
        for (let i = 1; i < mapData.events.length; i++) {
            const event = mapData.events[i];
            if (event.note.match(/\d+/)) {
                const stateId = originPositions[parseInt(event.note)].stateId;
                const newPosition = { x: event.x * 32, y: event.y * 48, stateId: stateId };
                formation.positions[parseInt(event.note)] = newPosition;
            }
        }
    }

    mapData() {
        if (this.isLoading()) return null;
        return JSON.parse(this._response);
    }

    loadMap(mapId) {
        this._response = null;
        const filename = "Map%1.json".format(mapId.padZero(3));
        HttpRequest.get(`data/${filename}`, { mimeType: "application/json" }, (res) => {
            if (res.result() === "error") {
                throw new Error(`Unknow file: ${filename}`);
            } else if (res.status() === 200) {
                this._response = res.response();
            } else {
                throw new Error(`Load failed: ${filename}`);
            }
        });
    }
}

const _Scene_Boot_create = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function() {
    _Scene_Boot_create.call(this);
    this.loadFormationMap();
}

const _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    if (!_Scene_Boot_isReady.call(this)) return false;
    for (const mapLoader of Object.values(MapLoaders)) {
        if (mapLoader.isLoading()) return false;
    }
    return true;
};

Scene_Boot.prototype.loadFormationMap = function() {
    let i = 0;
    for (const formationParam of FormationDatas) {
        if (formationParam.MapId) {
            const mapLoader = new FormationMapLoader();
            mapLoader.loadMap(formationParam.MapId);
            MapLoaders[i] = mapLoader;
        }
        i++;
    }
};


// Register plugin command.
PluginManager.registerCommand(FormationSystemPluginName, "StartFormationScene", () => {
    SceneManager.push(Scene_Formation);
});

PluginManager.registerCommand(FormationSystemPluginName, "LearnFormation", args => {
    const params = PluginParamsParser.parse(args, { FormationId: "number", VariableId: "number" });
    const formationId = (params.VariableId ? $gameVariables.value(params.VariableId) : params.FormationId);
    $gameParty.learnFormation(formationId);
});

PluginManager.registerCommand(FormationSystemPluginName, "ForgetFormation", args => {
    const params = PluginParamsParser.parse(args, { FormationId: "number", VariableId: "number" });
    const formationId = (params.VariableId ? $gameVariables.value(params.VariableId) : params.FormationId);
    $gameParty.forgetFormation(formationId);
});

PluginManager.registerCommand(FormationSystemPluginName, "ChangeEquipFormations", args => {
    const params = PluginParamsParser.parse(args, { EquipSlotIndex: "number", HasFormationId: "number" });
    const equipSlotIndex = params.EquipSlotIndex;
    const targetFormation = params.HasFormationId >= 0 ? $dataFormations[params.HasFormationId] : null;
    $gameParty.changeEquipFormations(equipSlotIndex, targetFormation);
});

PluginManager.registerCommand(FormationSystemPluginName, "ChangeFormation", args => {
    const params = PluginParamsParser.parse(args, { SlotIndex: "number" });
    if ($gameParty.inBattle()) {
        BattleManager.changeFormation(params.SlotIndex);
    } else {
        $gameParty.changeCurrentSlot(params.SlotIndex);
    }
});


// Define class alias.
return {
    FormationData: FormationData,
    Scene_Formation: Scene_Formation,
    Window_DataList: Window_DataList,
    Window_FormationList: Window_FormationList,
    Window_EquipFormationList: Window_EquipFormationList,
    Window_HasFormationList: Window_HasFormationList,
    ActorPosition: ActorPosition,
    FormationController: FormationController,
    Window_FormationDetail: Window_FormationDetail,
    Sprite_MenuFormationActor: Sprite_MenuFormationActor,
    Window_BattleFormationList: Window_BattleFormationList,
}

})();
