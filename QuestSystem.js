/*:
@target MZ
@plugindesc クエストシステム v0.1.3
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/QuestSystem.js

@help
※このプラグインは現在開発中です。
クエストシステムを導入するプラグインです。

【使用方法】
■クエストの作成
クエストはプラグインパラメータ「QuestDatas」を編集することによって作成します。

■クエストの状態管理
各クエストは状態(未受注、報告済み など)を持ち、その状態は変数によって管理します。
変数の値が持つ意味は以下の通りです。
0: クエスト未登録
　　　登録されておらず、一覧に表示されないクエスト
1: クエスト未受注
　　　未受注のクエスト
2: クエスト進行中
　　　受注を行い、進行中のクエスト
3: クエスト報告可能
　　　依頼を達成し、報告可能となったクエスト
4: クエスト報告済み
　　　報告を行ったクエスト
5: クエスト失敗
　　　失敗したクエスト
6: クエスト期限切れ
　　　期限切れとなったクエスト
7: 隠しクエスト
　　　概要のみ分かる謎のクエスト

■クエストプラグインが行う状態管理について
クエストプラグインでは、次の状態管理のみを行います。
・クエストを受注したとき、状態を未受注から進行中にする
・クエストを報告したとき、状態を報告可から報告済みにする
・進行中のクエストをキャンセルしたとき、状態を進行中から未受注にする

上記以外の状態にする場合はイベントコマンドで変数の値を変更する必要があります。

■報酬の受け取り
クエストの報酬は、報告を行ったタイミングで受け取ります。

■クエストシーン開始
クエストシーンは次の二通りの方法によって開始することができます。
・メニューから「クエスト管理」を呼び出す
・プラグインコマンド「StartQuestScene」を実行する

この二つは主に次のように使い分けることを想定しています。
プラグインコマンド：依頼所のような施設を作り、そこでクエストの受注と報告を行う。
メニュー：各クエストの状況を確認する。

■クエストコマンド
クエストコマンドは、クエストの分類、およびクエストの受注と報告を行うための
コマンドを管理するために使用します。

クエストコマンドには以下の種類があります。
all: 全てのクエストを表示する
notOrdered: 未受注のクエストを表示する
ordering: 進行中のクエストを表示する
cancelOrder: 進行中のクエストについて、クエストの受注をキャンセルする
reportable: 報告可能なクエストについて、報告済みにして報酬を受け取る
reported: 報告済みのクエストを表示する
failed: 失敗したクエストを表示する
expired: 期限切れのクエストを表示する
hidden: 隠しクエストを表示する


【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@param QuestDatas
@type struct<QuestData>[]
@desc
クエストのデータを登録します。

@param EnabledQuestMenu
@type boolean
@default true
@desc
メニューへのクエスト管理画面の追加有無を指定します。

@param EnabledQuestMenuSwitchId
@type switch
@default 0
@desc
メニューのクエスト管理画面の有効/無効を判定するスイッチIDを指定します。

@param MenuCommands
@type string[]
@default ["all"]
@desc
メニューのクエスト管理画面で使用するフィルターコマンドを指定します。

@param DisplayDifficulty
@type boolean
@default true
@desc
クエスト難易度の表示有無を指定します。

@param DisplayPlace
@type boolean
@default true
@desc
クエストの依頼場所の表示有無を指定します。

@param DisplayTimeLimit
@type boolean
@default true
@desc
クエストの有効期限の表示有無を指定します。

@param UseFilterWindow
@type boolean
@default true
@desc
フィルターウィンドウの使用有無を指定します。

@param ShowFilterWindowAndListWindow
@type boolean
@default true
@desc
フィルターウィンドウとリストウィンドウの同時表示有無を設定します。

@param QuestOrderSe
@type struct<QuestOrderSe>
@desc
クエストを受注したときに再生するSEを設定します。

@param QuestReportMe
@type struct<QuestReportMe>
@desc
クエストを報告したときに再生するMEを設定します。

@param Text
@type struct<Text>
@desc
ゲーム中で使用されるテキストを設定します。

@param GoldIcon
@type number
@default 314
@desc
報酬欄に表示するゴールドのアイコンを設定します。


@command StartQuestScene
@text クエストシーン開始
@desc クエストシーンを開始します。

@arg QuestCommands
@type string[]
@text フィルターコマンド
@desc フィルターコマンドを指定します。


@command ChangeDetail
@text クエスト詳細変更
@desc クエストの詳細を変更します。

@arg VariableId
@type number
@text 変数ID
@desc 詳細を変更するクエストの変数IDを指定します。

@arg Detail
@type string
@text 詳細
@desc 変更するクエスト詳細を設定します。


@command ChangeRewards
@text 報酬変更
@desc クエストの報酬を変更します。

@arg VariableId
@type number
@text 変数ID
@desc 報酬を変更するクエストの変数IDを指定します。

@arg Rewards
@type struct<Reward>[]
@text 報酬
@desc 変更するクエストの報酬を設定します。
*/


/*~struct~QuestData:
@param VariableId
@type variable
@desc
クエストの状態を管理する変数を指定します。

@param Title
@type string
@desc
クエストのタイトルを指定します。

@param IconIndex
@type number
@desc
クエストのタイトルに表示するアイコンを指定します。

@param Requester
@type string
@desc
クエストの依頼者名を指定します。

@param Rewards
@type struct<Reward>[]
@desc
クエストの報酬を指定します。

@param Difficulty
@type string
@desc
クエストの難易度を指定します。

@param Place
@type string
@desc
クエストの場所を指定します。

@param TimeLimit
@type string
@desc
クエストの有効期限を指定します。

@param Detail
@type multiline_string
@desc
クエストの情報を指定します。

@param HiddenDetail
@type multiline_string
@desc
クエストが隠し状態のときの情報を指定します。
*/


/*~struct~Reward:
@param Type
@type string
@desc
報酬のタイプ(gold, item, weapon, armorのいずれか)を指定します。

@param GoldValue
@type number
@desc
報酬のタイプがゴールドの場合に入手するゴールドを指定します。

@param ItemId
@type number
@desc
報酬のタイプがアイテムの場合に入手するアイテムIDを指定します。

@param ItemCount
@type number
@desc
報酬のタイプがアイテムの場合に入手するアイテム数を指定します。
*/


/*~struct~QuestOrderSe:
@param FileName
@type file
@dir audio/se
@default Skill1
@desc
クエストを受注したときに再生するSEのファイル名を指定します。

@param Volume
@type number
@default 90
@desc
クエストを受注したときに再生するSEのvolumeを指定します。

@param Pitch
@type number
@default 100
@desc
クエストを受注したときに再生するSEのpitchを指定します。

@param Pan
@type number
@default 0
@desc
クエストを受注したときに再生するSEのpanを指定します。
*/


/*~struct~QuestReportMe:
@param FileName
@type file
@dir audio/me
@default Item
@desc
クエストを報告したときに再生するMEのファイル名を指定します。

@param Volume
@type number
@default 90
@desc
クエストを報告したときに再生するMEのvolumeを指定します。

@param Pitch
@type number
@default 100
@desc
クエストを報告したときに再生するMEのpitchを指定します。

@param Pan
@type number
@default 0
@desc
クエストを報告したときに再生するMEのpanを指定します。
*/


/*~struct~Text:
@param MenuQuestSystemText
@type string
@default クエスト確認
@desc
メニューに追加するクエスト管理画面の名称を指定します。

@param QuestOrderText
@type string
@default このクエストを受けますか？
@desc
クエストを受注する場合に表示するメッセージを指定します。

@param QuestOrderYesText
@type string
@default 受ける
@desc
クエスト受注Yesの場合に表示するメッセージを指定します。

@param QuestOrderNoText
@type string
@default 受けない
@desc
クエスト受注Noの場合に表示するメッセージを指定します。

@param QuestCancelText
@type string
@default このクエストをキャンセルしますか？
@desc
クエストをキャンセルする場合に表示するメッセージを指定します。

@param QuestCancelYesText
@type string
@default キャンセルする
@desc
クエスト受注キャンセルYesの場合に表示するメッセージを指定します。

@param QuestCancelNoText
@type string
@default キャンセルしない
@desc
クエスト受注キャンセルNoの場合に表示するメッセージを指定します。

@param QuestReportText
@type string
@default このクエストを報告しますか？
@desc
クエスト報告時に表示するメッセージを指定します。

@param QuestReportYesText
@type string
@default 報告する
@desc
クエスト報告Yesの場合に表示するメッセージを指定します。

@param QuestReportNoText
@type string
@default 報告しない
@desc
クエスト報告Noの場合に表示するメッセージを指定します。

@param NothingQuestText
@type string
@default 該当するクエストはありません。
@desc
該当するクエストがない場合に表示するメッセージを指定します。

@param GetRewardText
@type string
@default 報酬として次のアイテムを受け取りました。
@desc
報酬を受け取った時に表示するメッセージを指定します。

@param AllCommandText
@type string
@default 全クエスト
@desc
全クエストを表示する場合のコマンド名を指定します。

@param HiddenTitleText
@type string
@default ？？？？？？
@desc
隠しクエストのタイトルを指定します。

@param NotOrderedCommandText
@type string
@default クエストを受ける
@desc
未受注のテキストを指定します。

@param OrderingCommandText
@type string
@default 進行中のクエスト
@desc
受注中のテキストを指定します。

@param CancelCommandText
@type string
@default クエストのキャンセル
@desc
受注中のテキストを指定します。

@param ReportableCommandText
@type string
@default クエストを報告する
@desc
報告可能のコマンドのテキストを指定します。

@param ReportedCommandText
@type string
@default 報告済みのクエスト
@desc
報告済みのコマンドのテキストを指定します。

@param FailedCommandText
@type string
@default 失敗したクエスト
@desc
失敗のコマンドのテキストを指定します。

@param ExpiredCommandText
@type string
@default 期限切れのクエスト
@desc
期限切れのコマンドのテキストを指定します。

@param HiddenCommandText
@type string
@default 未知のクエスト
@desc
隠しのコマンドのテキストを指定します。

@param NotOrderedStateText
@type string
@default 未受注
@desc
未受注の状態のテキストを指定します。

@param OrderingStateText
@type string
@default 進行中
@desc
受注中の状態のテキストを指定します。

@param ReportableStateText
@type string
@default 報告可
@desc
報告可能の状態のテキストを指定します。

@param ReportedStateText
@type string
@default 報告済み
@desc
報告済みの状態のテキストを指定します。

@param FailedStateText
@type string
@default 失敗
@desc
失敗の状態のテキストを指定します。

@param ExpiredStateText
@type string
@default 期限切れ
@desc
期限切れの状態のテキストを指定します。

@param HiddenStateText
@type string
@default ？？？
@desc
隠しの状態のテキストを指定します。

@param RequesterText
@type string
@default 【依頼者】：
@desc
依頼者のテキストを指定します。

@param RewardText
@type string
@default 【報酬】：
@desc
報酬のテキストを指定します。

@param DifficultyText
@type string
@default 【難易度】：
@desc
難易度のテキストを指定します。

@param PlaceText
@type string
@default 【場所】：
@desc
場所のテキストを指定します。

@param TimeLimitText
@type string
@default 【期間】：
@desc
期間のテキストを指定します。
*/

const QuestSystemPluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];

const QuestSystemAlias = (() => {
"use strict";

class PluginParamsParser {
    constructor(predictEnable = true) {
        this._predictEnable = predictEnable;
    }

    parse(params, typeData, loopCount = 0) {
        if (++loopCount > 255) throw new Error("endless loop error");
        const result = {};
        for (const name in typeData) {
            result[name] = this.convertParam(params[name], typeData[name], loopCount);
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
            if (param.match(/\d+\.\d+/)) return parseFloat(param);
            return parseInt(param);
        case "boolean":
            return param === "true";
        default:
            throw new Error(`Unknow type: ${type}`);
        }
    }

    predict(param) {
        if (param.match(/^\d+$/) || param.match(/^\d+\.\d+$/)) {
            return "number";
        } else if (param === "true" || param === "false") {
            return "boolean";
        } else {
            return "string";
        }
    }
}

class ItemInfo {
    constructor(type, id) {
        this._type = type;
        this._id = id;
    }

    get type() { return this._type; }
    set type(_type) { this._type = _type; }
    get id() { return this._id; }
    set id(_id) { this._id = _id; }

    // Tag to completely specify the item.
    tag() {
        return `${this._type}_${this._id}`;
    }

    itemData() {
        switch (this._type) {
        case "item":
            return $dataItems[this._id];
        case "weapon":
            return $dataWeapons[this._id];
        case "armor":
            return $dataArmors[this._id];
        }
        throw new Error(`${this._type} is not found`);
    }
}

class RewardData {
    static fromParam(rewardParam) {
        if (rewardParam.Type === "gold") {
            return new RewardData("gold", { value: rewardParam.GoldValue });
        } else {
            const itemInfo = new ItemInfo(rewardParam.Type, rewardParam.ItemId);
            return new RewardData("item", { item: itemInfo, count: rewardParam.ItemCount });
        }
    }

    // type is "gold" or "item".
    // params is { value: number } or { item: ItemInfo, count: number }.
    constructor(type, params) {
        this._type = type;
        this._params = params;
    }

    get type() { return this._type; }
    get params() { return this._params };

    getReward() {
        if (this._type === "gold") {
            $gameParty.gainGold(this._params.value);
        } else {
            $gameParty.gainItem(this._params.item.itemData(), this._params.count);
        }
    }
}

class QuestData {
    static fromParam(questDataParam) {
        const variableId = questDataParam.VariableId;
        const title = questDataParam.Title;
        const iconIndex = questDataParam.IconIndex;
        const requester = questDataParam.Requester;
        const rewards = questDataParam.Rewards.map(rewardParam => {
            return RewardData.fromParam(rewardParam);
        });
        const difficulty = questDataParam.Difficulty;
        const place = questDataParam.Place;
        const timeLimit = questDataParam.TimeLimit;
        const detail = questDataParam.Detail;
        const hiddenDetail = questDataParam.HiddenDetail;
        return new QuestData(variableId, title, iconIndex, requester, rewards, difficulty, place, timeLimit, detail, hiddenDetail);
    }

    constructor(variableId, title, iconIndex, requester, rewards, difficulty, place, timeLimit, detail, hiddenDetail) {
        this._variableId = variableId;
        this._title = title;
        this._iconIndex = iconIndex;
        this._requester = requester;
        this._rewards = rewards;
        this._difficulty = difficulty;
        this._place = place;
        this._timeLimit = timeLimit;
        this._detail = detail;
        this._hiddenDetail = hiddenDetail;
    }

    get variableId() { return this._variableId; }
    get title() { return this._title; }
    get iconIndex() { return this._iconIndex; }
    get requester() { return this._requester; }
    get rewards() { return this._rewards; }
    get difficulty() { return this._difficulty; }
    get place() { return this._place; }
    get timeLimit() { return this._timeLimit; }
    get detail() { return this._detail; }
    get hiddenDetail() { return this._hiddenDetail; }

    set rewards(_rewards) { this._rewards = _rewards; }
    set detail(_detail) { this._detail = _detail; }

    state() {
        const data = STATE_LIST.find(data => data[1] === $gameVariables.value(this._variableId));
        return data ? data[0] : "none";
    }

    setState(state) {
        const data = STATE_LIST.find(data => data[0] === state);
        if (data) $gameVariables.setValue(this._variableId, data[1]);
    }

    getRewards() {
        for (const reward of this.rewards) {
            reward.getReward();
        }
    }

    stateText() {
        const data = STATE_LIST.find(data => data[0] === this.state());
        return data[2];
    }
}

const type = {
    MenuCommands: ["string"],
    QuestDatas: [{
        Rewards: [{}],
    }],
    QuestOrderSe: {},
    QuestReportMe: {},
    Text: {}
};

const params = new PluginParamsParser().parse(PluginManager.parameters(QuestSystemPluginName), type);

const EnabledQuestMenu = params.EnabledQuestMenu;
const EnabledQuestMenuSwitchId = params.EnabledQuestMenuSwitchId;
const MenuCommands = params.MenuCommands;
const DisplayDifficulty = params.DisplayDifficulty;
const DisplayPlace = params.DisplayPlace;
const DisplayTimeLimit = params.DisplayTimeLimit;
const UseFilterWindow = params.UseFilterWindow;
const ShowFilterWindowAndListWindow = params.ShowFilterWindowAndListWindow;
const GoldIcon = params.GoldIcon;

const QuestDatas = params.QuestDatas.map(questDataParam => {
    return QuestData.fromParam(questDataParam);
});

const QuestOrderSe = params.QuestOrderSe;
const QuestReportMe = params.QuestReportMe;
const Text = params.Text;

const STATE_LIST = [
    ["none", 0, ""],
    ["notOrdered", 1, Text.NotOrderedStateText, Text.NotOrderedCommandText],
    ["ordering", 2, Text.OrderingStateText, Text.OrderingCommandText],
    ["reportable", 3, Text.ReportableStateText, Text.ReportableCommandText],
    ["reported", 4, Text.ReportedStateText, Text.ReportedCommandText],
    ["failed", 5, Text.FailedStateText, Text.FailedCommandText],
    ["expired", 6, Text.ExpiredStateText, Text.ExpiredCommandText],
    ["hidden", 7, Text.HiddenStateText, Text.HiddenCommandText],
];

const COMMAND_TABLE = {
    "all": [null, Text.AllCommandText],
    "notOrdered": [["notOrdered"], Text.NotOrderedCommandText],
    "ordering": [["ordering", "reportable"], Text.OrderingCommandText],
    "cancelOrder": [["ordering"], Text.CancelCommandText],
    "reportable": [["reportable"], Text.ReportableCommandText],
    "reported": [["reported"], Text.ReportedCommandText],
    "failed": [["failed"], Text.FailedCommandText],
    "expired": [["expired"], Text.ExpiredCommandText],
    "hidden": [["hidden"], Text.HiddenCommandText],
};

class Scene_QuestSystem extends Scene_MenuBase {
    prepare(commandList) {
        this._commandList = commandList;
    }

    create() {
        super.create();
        if (UseFilterWindow) this.createQuestCommandWindow();
        this.createQuestListWindow();
        this.createQuestDetailWindow();
        this.createQuestOrderWindow();
        this.createQuestReportWindow();
        this.createQuestGetRewardWindow();
        this.createQuestCancelWindow();
    }

    start() {
        super.start();
        if (UseFilterWindow) {
            this._questCommandWindow.activate();
            this._questCommandWindow.select(0);
            this._questDetailWindow.setDrawState("undraw");
        } else {
            this._questListWindow.activate();
            this._questListWindow.select(0);
            this._questDetailWindow.setQuestData(QuestDatas.find(data => data.state() !== "none"));
            this._questDetailWindow.setDrawState("draw");
        }
        if (!ShowFilterWindowAndListWindow) {
            this._questListWindow.hide();
            this._questListWindow.deactivate();
        }
        this._questCommandWindow.refresh();
        this.resetQuestList();
    }

    update() {
        super.update();
    }

    createQuestCommandWindow() {
        this._questCommandWindow = new Window_QuestCommand(this.questCommandWindowRect(), this._commandList);
        this._questCommandWindow.setHandler("ok", this.onQuestCommandOk.bind(this));
        this._questCommandWindow.setHandler("cancel", this.onQuestCommandCancel.bind(this));
        this._questCommandWindow.setHandler("select", this.onQuestCommandSelect.bind(this));
        this.addWindow(this._questCommandWindow);
    }

    createQuestListWindow() {
        this._questListWindow = new Window_QuestList(this.questListWindowRect());
        this._questListWindow.setHandler("ok", this.onQuestListOk.bind(this));
        this._questListWindow.setHandler("cancel", this.onQuestListCancel.bind(this));
        this._questListWindow.setHandler("select", this.onQuestListSelect.bind(this));
        this.addWindow(this._questListWindow);
    }

    createQuestDetailWindow() {
        this._questDetailWindow = new Window_QuestDetail(this.questDetailWindowRect());
        this.addWindow(this._questDetailWindow);
    }

    createQuestOrderWindow() {
        this._questOrderWindow = new Window_QuestOrder(this.questOrderWindowRect());
        this._questOrderWindow.setHandler("yes", this.onQuestOrderOk.bind(this));
        this._questOrderWindow.setHandler("no", this.onQuestOrderCancel.bind(this));
        this._questOrderWindow.setHandler("cancel", this.onQuestOrderCancel.bind(this));
        this.addWindow(this._questOrderWindow);
    }

    createQuestReportWindow() {
        this._questReportWindow = new Window_QuestReport(this.questReportWindowRect());
        this._questReportWindow.setHandler("yes", this.onQuestReportOk.bind(this));
        this._questReportWindow.setHandler("no", this.onQuestReportCancel.bind(this));
        this._questReportWindow.setHandler("cancel", this.onQuestReportCancel.bind(this));
        this.addWindow(this._questReportWindow);
    }

    createQuestGetRewardWindow() {
        this._questGetRewardWindow = new Window_QuestGetReward(this.questGetRewardWindowRect());
        this._questGetRewardWindow.setHandler("ok", this.onQuestGetRewardOk.bind(this));
        this.addWindow(this._questGetRewardWindow);
    }

    createQuestCancelWindow() {
        this._questCancelWindow = new Window_QuestCancel(this.questCancelWindowRect());
        this._questCancelWindow.setHandler("yes", this.onQuestCancelOk.bind(this));
        this._questCancelWindow.setHandler("no", this.onQuestCancelCancel.bind(this));
        this._questCancelWindow.setHandler("cancel", this.onQuestCancelCancel.bind(this));
        this.addWindow(this._questCancelWindow);
    }

    // Window rectangle
    questCommandWindowRect() {
        const x = 0;
        let y = 0;
        if (!this.isBottomButtonMode()) y += this.buttonAreaHeight();
        const w = 300;
        let h = 200;
        if (this.isBottomButtonMode()) h -= this.buttonAreaHeight();
        if (!UseFilterWindow) return new Rectangle(x, y, w, 0);
        return new Rectangle(x, y, w, h);
    }

    questListWindowRect() {
        const questCommandWindowRect = this.questCommandWindowRect();
        const x = 0;
        let y = questCommandWindowRect.y + questCommandWindowRect.height;
        if (!ShowFilterWindowAndListWindow) y = questCommandWindowRect.y;
        const w = 300;
        let h = Graphics.boxHeight - y;
        if (this.isBottomButtonMode()) h -= this.buttonAreaHeight();
        return new Rectangle(x, y, w, h);
    }

    questDetailWindowRect() {
        const questCommandWindowRect = this.questCommandWindowRect();
        const questListWindowRect = this.questListWindowRect();
        const x = questListWindowRect.x + questListWindowRect.width;
        let y;
        if (UseFilterWindow && ShowFilterWindowAndListWindow) {
            y = questCommandWindowRect.y;
        } else {
            y = questListWindowRect.y;
        }
        const w = Graphics.boxWidth - x;
        let h;
        if (UseFilterWindow && ShowFilterWindowAndListWindow) {
            h = questCommandWindowRect.height + questListWindowRect.height;
        } else {
            h = questListWindowRect.height;
        }
        return new Rectangle(x, y, w, h);
    }

    questOrderWindowRect() {
        const w = 400;
        const h = 160;
        const x = Graphics.boxWidth / 2 - w / 2;
        const y = Graphics.boxHeight / 2 - h / 2;
        return new Rectangle(x, y, w, h);
    }

    questReportWindowRect() {
        return this.questOrderWindowRect();
    }

    questGetRewardWindowRect() {
        const w = 540;
        const h = 160;
        const x = Graphics.boxWidth / 2 - w / 2;
        const y = Graphics.boxHeight / 2 - h / 2;
        return new Rectangle(x, y, w, h);
    }

    questCancelWindowRect() {
        return this.questOrderWindowRect();
    }

    // Define window handlers
    onQuestCommandOk() {
        this.change_QuestCommandWindow_To_QuestListWindow();
        this.onQuestListSelect();
    }

    onQuestCommandCancel() {
        this.popScene();
    }

    onQuestCommandSelect() {
        this.resetQuestList();
    }

    onQuestListOk() {
        switch(this._questCommandWindow.currentSymbol()) {
        case "notOrdered":
            this.change_QuestListWindow_To_QuestOrderWindow();
            break;
        case "cancelOrder":
            this.change_QuestListWindow_To_QuestCancelWindow();
            break;
        case "reportable":
            this.change_QuestListWindow_To_QuestReportWindow();
            break;
        default:
            this._questListWindow.activate();
            break;
        }
    }

    onQuestListCancel() {
        if (UseFilterWindow) {
            this.change_QuestListWindow_To_QuestCommandWindow();
        } else {
            this.popScene();
        }
    }

    onQuestListSelect() {
        if (this._questListWindow.currentSymbol()) {
            this._questDetailWindow.setQuestData(this._questListWindow.questData());
        } else {
            this._questDetailWindow.setQuestData(null);
        }
        this._questDetailWindow.setDrawState("draw");
        this._questDetailWindow.refresh();
    }

    onQuestOrderOk() {
        const questData = this._questListWindow.questData();
        questData.setState("ordering");
        this.change_QuestOrderWindow_To_QuestListWindow();
        this.resetQuestList();
        this._questListWindow.select(0);
        this._questDetailWindow.refresh();
    }

    onQuestOrderCancel() {
        this.change_QuestOrderWindow_To_QuestListWindow();
    }

    onQuestReportOk() {
        const questData = this._questListWindow.questData();
        questData.setState("reported");
        this.change_QuestReportWindow_To_QuestGetRewardWindow();
        this._questGetRewardWindow.setQuestData(questData);
        this._questGetRewardWindow.refresh();
    }

    onQuestReportCancel() {
        this.change_QuestReportWindow_To_QuestListWindow();
    }

    onQuestGetRewardOk() {
        const questData = this._questListWindow.questData();
        questData.getRewards();
        this.change_QuestGetRewardWindow_To_QuestListWindow();
        this.resetQuestList();
        this._questListWindow.select(0);
        this._questDetailWindow.refresh();
    }

    onQuestCancelOk() {
        const questData = this._questListWindow.questData();
        questData.setState("notOrdered");
        this.change_QuestCancelWindow_To_QuestListWindow();
        this.resetQuestList();
        this._questListWindow.select(0);
        this._questDetailWindow.refresh();
    }

    onQuestCancelCancel() {
        this.change_QuestCancelWindow_To_QuestListWindow();
    }

    // Change window
    change_QuestCommandWindow_To_QuestListWindow() {
        this._questCommandWindow.deactivate();
        this._questListWindow.show();
        this._questListWindow.activate();
        this._questListWindow.select(0);
    }

    change_QuestListWindow_To_QuestCommandWindow() {
        this._questDetailWindow.setQuestData(null);
        this._questDetailWindow.setDrawState("undraw");
        this._questDetailWindow.refresh();
        if (!ShowFilterWindowAndListWindow) this._questListWindow.hide();
        this._questListWindow.deactivate();
        this._questListWindow.select(-1);
        this._questCommandWindow.activate();
    }

    change_QuestListWindow_To_QuestOrderWindow() {
        this._questListWindow.deactivate();
        this._questOrderWindow.show();
        this._questOrderWindow.open();
        this._questOrderWindow.activate();
        this._questOrderWindow.select(0);
    }

    change_QuestListWindow_To_QuestReportWindow() {
        this._questListWindow.deactivate();
        this._questReportWindow.show();
        this._questReportWindow.open();
        this._questReportWindow.activate();
        this._questReportWindow.select(0);
    }

    change_QuestOrderWindow_To_QuestListWindow() {
        this._questOrderWindow.close();
        this._questOrderWindow.deactivate();
        this._questOrderWindow.select(-1);
        this._questListWindow.activate();
    }

    change_QuestReportWindow_To_QuestListWindow() {
        this._questReportWindow.close();
        this._questReportWindow.deactivate();
        this._questReportWindow.select(-1);
        this._questListWindow.activate();
    }

    change_QuestReportWindow_To_QuestGetRewardWindow() {
        this._questReportWindow.close();
        this._questReportWindow.deactivate();
        this._questReportWindow.select(-1);
        this._questGetRewardWindow.show();
        this._questGetRewardWindow.open();
        this._questGetRewardWindow.activate();
    }

    change_QuestGetRewardWindow_To_QuestListWindow() {
        this._questGetRewardWindow.close();
        this._questGetRewardWindow.deactivate();
        this._questListWindow.activate();
    }

    change_QuestListWindow_To_QuestCancelWindow() {
        this._questListWindow.deactivate();
        this._questCancelWindow.show();
        this._questCancelWindow.open();
        this._questCancelWindow.activate();
        this._questCancelWindow.select(-1);
    }

    change_QuestCancelWindow_To_QuestListWindow() {
        this._questCancelWindow.close();
        this._questCancelWindow.deactivate();
        this._questCancelWindow.select(-1);
        this._questListWindow.activate();
    }

    // Reset quest list window.
    resetQuestList() {
        const questList = (UseFilterWindow ? this._questCommandWindow.filterQuestList()
                                           : QuestDatas.filter(data => data.state() !== "none"));
        this._questListWindow.resetQuestList(questList);
    }
}

class Window_QuestCommand extends Window_Command {
    initialize(rect, commandList) {
        this._commandList = commandList;
        super.initialize(rect);
        this.deactivate();
        this.select(-1);
    }

    select(index) {
        super.select(index);
        if (this.active && index >= 0) this.callHandler("select");
    }

    makeCommandList() {
        for (const command of this._commandList) {
            const commandData = COMMAND_TABLE[command];
            if (commandData) {
                this.addCommand(commandData[1], command);
            } else {
                throw new Error(`Unknow quest command ${command}`);
            }
        }
    }

    filterQuestList() {
        if (this.currentSymbol() === "all") return QuestDatas.filter(data => data.state() !== "none");
        const commandData = COMMAND_TABLE[this.currentSymbol()];
        return QuestDatas.filter(quest => commandData[0].includes(quest.state()));
    }
}

class Window_QuestList extends Window_Command {
    initialize(rect) {
        this._questList = [];
        super.initialize(rect);
        this.deactivate();
        this.select(-1);
    }

    select(index) {
        super.select(index);
        if (this.active && index >= 0) this.callHandler("select");
    }

    resetQuestList(questList) {
        this.clearCommandList();
        this._questList = questList;
        this.refresh();
    }

    questData() {
        return this._questList[this.index()];
    }

    makeCommandList() {
        for (let i = 0; i < this._questList.length; i++) {
            const questData = this._questList[i];
            const title = (questData.state() === "hidden" ? Text.HiddenTitleText : questData.title);
            this.addCommand(title, `quest${i}`);
        }
    }

    drawItem(index) {
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        const questData = this._questList[index];
        if (questData.iconIndex === 0) {
            this.drawText(this.commandName(index), rect.x, rect.y, rect.width, "left");
        } else {
            const text = { name: this.commandName(index), iconIndex: questData.iconIndex };
            this.drawItemName(text, rect.x, rect.y, rect.width);
        }
    }
}

class Window_QuestDetail extends Window_Selectable {
    initialize(rect) {
        super.initialize(rect);
        this._questData = null;
        this._drawState = "undraw";
        this.deactivate();
    }

    setQuestData(questData) {
        this._questData = questData;
    }

    // undraw: Unraw window
    // draw: Draw window
    setDrawState(drawState) {
        this._drawState = drawState;
    }

    infoTextWidth() {
        return 160;
    }

    messageX() {
        return this.infoTextWidth() + 16;
    }

    messageWindth() {
        return this.width - this.padding * 2 - this.messageX();
    }

    drawAllItems() {
        if (this._drawState === "draw" && !this._questData) {
            this.drawNothingQuest(0);
        } else if (this._drawState === "draw" && this._questData.state() === "hidden") {
            this.drawHiddenDetail(0);
        } else if (this._drawState === "draw") {
            let startLine = 0;
            this.drawTitle(startLine);
            startLine += 1;
            this.drawRequester(startLine);
            startLine += 1.25;
            this.drawRewards(startLine);
            startLine += this._questData.rewards.length;
            if (DisplayDifficulty) {
                this.drawDifficulty(startLine);
                startLine += 1;
            }
            if (DisplayPlace) {
                this.drawPlace(startLine);
                startLine += 1;
            }
            if (DisplayTimeLimit) {
                this.drawTimeLimit(startLine);
                startLine += 1;
            }
            this.drawDetail(startLine);
        }
    }

    drawNothingQuest(startLine) {
        this.drawTextEx(Text.NothingQuestText, this.padding, this.startY(startLine), this.width - this.padding * 2);
    }

    drawTitle(startLine) {
        this.resetTextColor();
        const width = this.width - this.padding * 4;
        if (this._questData.iconIndex === 0) {
            this.drawText(this._questData.title, this.padding, this.startY(startLine), width - 120, "left");
        } else {
            const text = { name: this._questData.title, iconIndex: this._questData.iconIndex };
            this.drawItemName(text, this.padding, this.startY(startLine), width - 120);
        }
        this.drawText(this._questData.stateText(), this.padding, this.startY(startLine), width, "right");
        this.resetTextColor();
    }

    drawRequester(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawHorzLine(this.startY(startLine));
        this.drawText(Text.RequesterText, this.padding, this.startY(startLine + 0.25), this.infoTextWidth());
        this.resetTextColor();
        this.drawText(this._questData.requester, this.messageX(), this.startY(startLine + 0.25), this.messageWindth());
    }

    drawRewards(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawText(Text.RewardText, this.padding, this.startY(startLine), this.infoTextWidth());
        this.resetTextColor();
        for (const reward of this._questData.rewards) {
            this.drawReward(reward, this.startY(startLine))
            startLine++;
        }
    }

    drawReward(reward, y) {
        if (reward.type === "gold") {
            const text = { name: `${reward.params.value}${TextManager.currencyUnit}`, iconIndex: GoldIcon };
            this.drawItemName(text, this.messageX(), y, this.messageWindth());
        } else if (reward.type === "item") {
            this.drawItemName(reward.params.item.itemData(), this.messageX(), y, this.messageWindth());
            const strItemCount = `×${reward.params.count}`;
            this.drawText(strItemCount, this.messageX(), y, this.messageWindth(), "right");
        }
    }

    drawDifficulty(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawText(Text.DifficultyText, this.padding, this.startY(startLine), this.infoTextWidth());
        this.resetTextColor();
        this.drawText(this._questData.difficulty, this.messageX(), this.startY(startLine), this.messageWindth());
    }

    drawPlace(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawText(Text.PlaceText, this.padding, this.startY(startLine), this.infoTextWidth());
        this.resetTextColor();
        this.drawText(this._questData.place, this.messageX(), this.startY(startLine), this.messageWindth());
    }

    drawTimeLimit(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawText(Text.TimeLimitText, this.padding, this.startY(startLine), this.infoTextWidth());
        this.resetTextColor();
        this.drawText(this._questData.timeLimit, this.messageX(), this.startY(startLine), this.messageWindth());
    }

    drawDetail(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawHorzLine(this.startY(startLine));
        this.resetTextColor();
        this.drawTextEx(this._questData.detail, this.padding, this.startY(startLine + 0.25), this.width - this.padding * 2);
    }

    drawHiddenDetail(startLine) {
        this.drawTextEx(this._questData.hiddenDetail, this.padding, this.startY(startLine), this.width - this.padding * 2);
    }

    startY(line) {
        return this.padding + this.itemHeight() * line;
    }

    drawHorzLine(y) {
        const padding = this.itemPadding();
        const x = padding;
        const width = this.innerWidth - padding * 2;
        this.drawRect(x, y, width, 5);
    }

    itemHeight() {
        return 32;
    }
}

class Window_QuestOrder extends Window_Command {
    initialize(rect) {
        super.initialize(rect);
        this.deactivate();
        this.hide();
        this.close();
    }

    makeCommandList() {
        this.addCommand(Text.QuestOrderYesText, "yes");
        this.addCommand(Text.QuestOrderNoText, "no");
    }

    drawAllItems() {
        const rect = this.itemLineRect(0);
        rect.y = this.padding;
        this.drawText(Text.QuestOrderText, rect.x, rect.y, rect.width);
        super.drawAllItems();
    }

    itemRect(index) {
        return super.itemRect(index + 1);
    }

    playOkSound() {
        if (this.currentSymbol() === "yes") return this.playOrderSound();
        super.playOkSound();
    }

    playOrderSound() {
        if (QuestOrderSe.FileName === "") return;
        const se = {
            name: QuestOrderSe.FileName,
            pan: QuestOrderSe.Pan,
            pitch: QuestOrderSe.Pitch,
            volume: QuestOrderSe.Volume,
        }
        AudioManager.playSe(se);
    }
}

class Window_QuestCancel extends Window_Command {
    initialize(rect) {
        super.initialize(rect);
        this.deactivate();
        this.hide();
        this.close();
    }

    makeCommandList() {
        this.addCommand(Text.QuestCancelYesText, "yes");
        this.addCommand(Text.QuestCancelNoText, "no");
    }

    drawAllItems() {
        const rect = this.itemLineRect(0);
        rect.y = this.padding;
        this.drawText(Text.QuestCancelText, rect.x, rect.y, rect.width);
        super.drawAllItems();
    }

    itemRect(index) {
        return super.itemRect(index + 1);
    }
}

class Window_QuestReport extends Window_Command {
    initialize(rect) {
        super.initialize(rect);
        this.deactivate();
        this.hide();
        this.close();
    }

    makeCommandList() {
        this.addCommand(Text.QuestReportYesText, "yes");
        this.addCommand(Text.QuestReportNoText, "no");
    }

    drawAllItems() {
        const rect = this.itemLineRect(0);
        rect.y = this.padding;
        this.drawText(Text.QuestReportText, rect.x, rect.y, rect.width);
        super.drawAllItems();
    }

    itemRect(index) {
        return super.itemRect(index + 1);
    }

    playOkSound() {
        if (this.currentSymbol() === "yes") return this.playOrderSound();
        super.playOkSound();
    }

    playOrderSound() {
        if (QuestReportMe.FileName === "") return;
        const me = {
            name: QuestReportMe.FileName,
            pan: QuestReportMe.Pan,
            pitch: QuestReportMe.Pitch,
            volume: QuestReportMe.Volume,
        }
        AudioManager.playMe(me);
    }
}

class Window_QuestGetReward extends Window_Selectable {
    initialize(rect) {
        super.initialize(rect);
        this.deactivate();
        this.hide();
        this.close();
        this._questData = null;
    }

    setQuestData(questData) {
        this._questData = questData;
    }

    drawAllItems() {
        const rect = this.itemLineRect(0);
        this.drawText(Text.GetRewardText, rect.x, rect.y, rect.width);
        this.drawRewards();
    }

    drawRewards() {
        let i = 1;
        for (const reward of this._questData.rewards) {
            const rect = this.itemLineRect(i);
            this.drawReward(reward, rect);
            i++;
        }
    }

    drawReward(reward, rect) {
        if (reward.type === "gold") {
            const text = { name: `${reward.params.value}${TextManager.currencyUnit}`, iconIndex: GoldIcon };
            this.drawItemName(text, rect.x, rect.y, rect.width);
        } else if (reward.type === "item") {
            this.drawItemName(reward.params.item.itemData(), rect.x, rect.y, rect.width);
            const strItemCount = `×${reward.params.count}`;
            this.drawText(strItemCount, rect.x, rect.y, rect.width, "right");
        }
    }
}


// Register plugin command.
PluginManager.registerCommand(QuestSystemPluginName, "StartQuestScene", args => {
    SceneManager.push(Scene_QuestSystem);
    const parser = new PluginParamsParser();
    const params = parser.parse(args, { QuestCommands: ["string"] });
    const commands = (params.QuestCommands.length === 0 ? null : params.QuestCommands);
    SceneManager.prepareNextScene(commands);
});

PluginManager.registerCommand(QuestSystemPluginName, "ChangeDetail", args => {
    const parser = new PluginParamsParser();
    const params = parser.parse(args, { VariableId: "number", Detail: "string" });
    const questData = QuestDatas.find(data => data.variableId === params.VariableId);
    if (!questData) return;
    questData.detail = params.Detail;
});

PluginManager.registerCommand(QuestSystemPluginName, "ChangeRewards", args => {
    const parser = new PluginParamsParser();
    const params = parser.parse(args, { Rewards: [{}] });
    const questData = QuestDatas.find(data => data.variableId === params.VariableId);
    if (!questData) return;
    const rewards = params.Rewards.map(rewardParam => {
        return RewardData.fromParam(rewardParam);
    });
    questData.rewards = rewards;
});


// Add QuestSystem to menu command.
const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    _Window_MenuCommand_addOriginalCommands.call(this);
    if (EnabledQuestMenu) this.addCommand(Text.MenuQuestSystemText, "quest", this.isEnabledQuestMenu());
};

Window_MenuCommand.prototype.isEnabledQuestMenu = function() {
    if (EnabledQuestMenuSwitchId === 0) return true;
    return $gameSwitches.value(EnabledAlchemySwitchId);
};

const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    if (EnabledQuestMenu) this._commandWindow.setHandler("quest", this.quest.bind(this));
};

Scene_Menu.prototype.quest = function() {
    SceneManager.push(Scene_QuestSystem);
    SceneManager.prepareNextScene(MenuCommands);
};


// Define class alias.
return {
    ItemInfo: ItemInfo,
    RewardData: RewardData,
    QuestData: QuestData,
    Scene_QuestSystem: Scene_QuestSystem,
    Window_QuestCommand: Window_QuestCommand,
    Window_QuestList: Window_QuestList,
    Window_QuestDetail: Window_QuestDetail,
    Window_QuestOrder: Window_QuestOrder,
    Window_QuestCancel: Window_QuestCancel,
    Window_QuestReport: Window_QuestReport,
    Window_QuestGetReward: Window_QuestGetReward,
};

})();
