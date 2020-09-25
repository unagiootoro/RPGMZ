/*:
@target MZ
@plugindesc Quest system v1.2.0
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/QuestSystem.js
@help
It is a plugin that introduces the quest system.

【How to use】
■ Creating a quest
Quest uses the plugin parameter "QuestDatas"
Create by editing.
"Requester", "Reward", "Quest content" required for the quest according to this parameter
Set items such as.

■ Quest state management
Each quest has a status (unordered, in progress, reported, etc.)
Its state is managed by variables.
The meanings of variable values ​​are as follows.

0: Quest unregistered
   Quests that are not registered and are not displayed in the list
1: Quest unordered
   Unordered quest
2: Quest in progress
   Orders received and ongoing quests
3: Quest can be reported
   Quest that fulfilled the request and became reportable
4: Quest reported
   The quest that made the report
5: Quest failure
   Failed quest reward
6: Quest expired
   Expired quest
7: Hidden quest
   Hidden quest that only shows the outline

■ About state management performed by the quest plugin
The quest plugin only manages the following states:
・ When you receive an order for a quest, change the status from unordered to in progress.
・ When reporting a quest, change the status from reportable to reported
・ When canceling an in-progress quest, change the status from in-progress to unordered

If you want to change to a state other than the above, use the event command.
You need to change the value of the variable.

■ Reward receipt
Quest rewards will be received when you make a report.

■ Start of quest scene
The quest scene can be started in two ways:
・ Call "Quest Management" from the menu
-Execute the plug-in command "StartQuestScene"

It is assumed that these two are mainly used properly as follows.
Plugin command: Create a facility like a request office,
Orders and reports for quests there.
Menu: Check the status of each quest.

■ Quest command
The quest command classifies quests and orders and reports quests.
Used to manage commands.
* Plug-in commands and quest commands set in the menu
Because it is set by default
If you want to use it in a basic way, you do not need to change it.

There are the following types of quest commands.
all: Show all quests
questOrder: Show unordered quests
orderingQuest: View ongoing quests
questCancel: Cancel quest orders for ongoing quests
questReport: Report and receive rewards for reportable quests
reportedQuest: View reported quests
failedQuest: Show failed quests
expiredQuest: Show expired quests
hiddenQuest: Show hidden quests

【License】
This plugin is available under the terms of the MIT license.


@param QuestDatas
@text quest data
@type struct<QuestData>[]
@default []
@desc
Register the quest data.

@param EnabledQuestMenu
@text Quest menu enabled
@type boolean
@on display
@off hidden
@default true
@desc
Specify whether to add the quest management screen to the menu.

@param EnabledQuestMenuSwitchId
@text Quest menu activation switch ID
@type switch
@default 0
@desc
Specify the switch ID that determines whether the quest management screen of the menu is valid / invalid.

@param MenuCommands
@text Menu display command
@type select[]
@option all
@option questOrder
@option orderingQuest
@option questCancel
@option questReport
@option reportedQuest
@option failedQuest
@option expiredQuest
@option hiddenQuest
@default ["orderingQuest", "reportedQuest", "all"]
@desc
Specify the filter command to be used on the quest management screen of the menu. See help quest command

@param MenuBackgroundImage
@text menu background image
@type struct<BackgroundImage>
@default {"FileName1": "", "FileName2": "", "XOfs": "240", "YOfs": "300"}
@desc
Specify the background image of the quest scene in the menu.

@param DisplayRequestor
@text View requester
@type boolean
@on display
@off hidden
@default true
@desc
Specify whether to display the title.

@param DisplayRewards
@text Reward display
@type boolean
@default true
@desc
Specify whether to display the reward request location.

@param DisplayDifficulty
@text Display of difficulty
@type boolean
@on display
@off hidden
@default true
@desc
Specify whether to display the quest difficulty level.

@param DisplayPlace
@text Display location
@type boolean
@default true
@desc
Specify whether to display the request location of the quest.

@param DisplayTimeLimit
@text Expiration date display
@type boolean
@on display
@off hidden
@default true
@desc
Specify whether to display the expiration date of the quest.

@param QuestOrderSe
@text Quest Order SE
@type struct<QuestOrderSe>
@default {"FileName": "Skill1", "Volume": "90", "Pitch": "100", "Pan": "0"}
@desc
Set the SE to play when you receive an order for a quest.

@param QuestReportMe
@text Quest Report ME
@type struct<QuestReportMe>
@default {"FileName": "Item", "Volume": "90", "Pitch": "100", "Pan": "0"}
@desc
Set the ME to play when reporting a quest.

@param WindowSize
@text Window size
@type struct<WindowSize>
@default {"CommandWindowWidth": "300", "CommandWindowHeight": "160", "DialogWindowWidth": "400", "DialogWindowHeight": "160", "GetRewardWindowWidth": "540" }
@desc
Set the size of various windows.

@param Text
@text Display text
@type struct<Text>
@default {"MenuQuestSystemText":"Quest confirmation","QuestOrderText":"Do you want to take this quest?","QuestOrderYesText":"Receive","QuestOrderNoText":"not accepted","QuestCancelText":"Do you want to cancel this quest?","QuestCancelYesText":"cancel","QuestCancelNoText":"do not cancel","QuestReportText":"Do you want to report this quest?","QuestReportYesText":"Report","QuestReportNoText":"do not report","NothingQuestText":"There is no corresponding quest.","GetRewardText":"Received the following items as a reward.","HiddenTitleText":"??????????","AllCommandText":"All quests","QuestOrderCommandText":"Receive quest","OrderingQuestCommandText":"quest in progress","QuestCancelCommandText":"quest cancellation","QuestReportCommandText":"Report quest","ReportedQuestCommandText":"Reported quest","FailedQuestCommandText":"quest that failed","ExpiredQuestCommandText":"Expired quest","HiddenQuestCommandText":"unknown quest","NotOrderedStateText":"unordered","OrderingStateText":"in progress","ReportableStateText":"can be reported","ReportedStateText":"reported","FailedStateText":"failure","ExpiredStateText":"expired","RequesterText":"[Requester]:","RewardText":"[Reward]:","DifficultyText":"[Difficulty]:","PlaceText":"[Location]:","TimeLimitText":"[Period]:"}
@desc
Sets the text used in the game.

@param TextColor
@text Display text color
@type struct<TextColor>
@default {"NotOrderedStateColor":"#aaaaaa","OrderingStateColor":"#ffffff","ReportableStateColor":"#ffff00","ReportedStateColor":"#60ff60","FailedStateColor":"#0000ff","ExpiredStateColor":"#ff0000"}
@desc
Sets the color of the text used in the game.

@param GoldIcon
@text gold icon
@type number
@default 314
@desc
Set the gold icon to be displayed in the reward column.

@param ExpIcon
@text Experience point icon
@type number
@default 89
@desc
Set the experience value icon to be displayed in the reward column.

@param QuestTitleWrap
@text Quest title With or without line breaks
@type boolean
@default false
@desc
Set the presence or absence of line breaks in the quest title.


@command StartQuestScene
@text Quest scene start
@desc Start the quest scene.

@arg QuestCommands
@type select[]
@option all
@option questOrder
@option orderingQuest
@option questCancel
@option questReport
@option reportedQuest
@option failedQuest
@option expiredQuest
@option hiddenQuest
@default ["questOrder", "questCancel", "questReport"]
@text quest command
@desc Specify the quest command.

@arg BackgroundImage
@text background image
@type struct<BackgroundImage>
@default {"FileName1": "", "FileName2": "", "XOfs": "240", "YOfs": "300"}
@desc
Specify the background image of the quest scene.


@command GetRewards
@text Get rewards
@desc Get rewards for quests.

@arg VariableId
@type variable
@text variable ID
@desc Specify the variable ID of the quest to get the reward.


@command ChangeDetail
@text Quest details changed
@desc Change the quest details.

@arg VariableId
@type variable
@text variable ID
@desc Specifies the variable ID of the quest whose details you want to change.

@arg Detail
@type multiline_string
@text details
@desc Set the quest details to change.


@command ChangeRewards
@text Reward change
@desc Change quest rewards.

@arg VariableId
@type variable
@text variable ID
@desc Specify the variable ID of the quest whose reward you want to change.

@arg Rewards
@type struct<Reward>[]
@text reward
@desc Set the reward for the quest you want to change.
*/


/*~struct~QuestData:
@param VariableId
@text variable ID
@type variable
@desc
Specify variables that manage the state of the quest.

@param Title
@text title
@type string
@desc
Specify the title of the quest.

@param IconIndex
@text title icon
@type number
@desc
Specify the icon to be displayed in the title of the quest.

@param Requester
@text Requester name
@type string
@desc
Specify the name of the requester of the quest.

@param Rewards
@text reward
@type struct<Reward>[]
@desc
Specify the reward for the quest.

@param Difficulty
@text Difficulty
@type string
@desc
Specify the difficulty level of the quest.

@param Place
@text location
@type string
@desc
Specify the location of the quest.

@param TimeLimit
@text expiration date
@type string
@desc
Specify the expiration date of the quest.

@param Detail
@text Quest information
@type multiline_string
@desc
Specify the quest information.

@param HiddenDetail
@text Hidden information
@type multiline_string
@desc
Specifies information when the quest is hidden.

@param CommonEventId
@text Common event ID
@type common_event
@default 0
@desc
Specify the common event ID that starts immediately after the quest report is completed. If it is 0, it will not start.
*/


/*~struct~Reward:
@param Type
@text Reward type
@type select
@option gold
@value gold
@option Experience points
@value exp
@option item
@value item
@option Weapon
@value weapon
@option armor
@value armor
@option optional
@value any
@desc
Specify the type of reward (gold, experience, item, weapon, armor, or whatever).

@param GoldValue
@text Reward Gold Number
@type number
@desc
Specifies the gold to get if the reward type is gold.

@param ExpValue
@text Reward experience points
@type number
@desc
Specifies the experience points to obtain if the reward type is experience points.

@param ItemId
@text Reward item ID
@type number
@desc
Specifies the item ID to get if the reward type is item.

@param ItemCount
@text Number of reward items
@type number
@desc
Specifies the number of items to obtain if the reward type is item.

@param Text
@text text
@type string
@desc
Specifies the text to display if the reward type is arbitrary.

@param IconIndex
@text icon
@type number
@desc
Specifies the icon to display when the reward type is arbitrary.
*/


/*~struct~QuestOrderSe:
@param FileName
@text Order SE
@type file
@dir audio / se
@default Skill1
@desc
Specify the file name of the SE to be played when the quest is ordered.

@param Volume
@text Order SE Volume
@type number
@default 90
@desc
Specify the volume of SE to be played when the quest is ordered.

@param Pitch
@text Order SE pitch
@type number
@default 100
@desc
Specify the pitch of the SE to play when the quest is ordered.

@param Pan
@text Order SE Phase
@type number
@default 0
@desc
Specify the pan of the SE to be played when the quest is ordered.
*/


/*~struct~QuestReportMe:
@param FileName
@text Report ME
@type file
@dir audio / me
@default Item
@desc
Specify the filename of the ME to play when reporting the quest.

@param Volume
@text Report ME Volume
@type number
@default 90
@desc
Specifies the volume of ME to play when reporting a quest.

@param Pitch
@text Report ME Pitch
@type number
@default 100
@desc
Specifies the pitch of the ME to play when reporting a quest.

@param Pan
@text Report ME Phase
@type number
@default 0
@desc
Specifies the ME pan to play when reporting a quest.
*/


/*~struct~BackgroundImage:
@param FileName1
@text filename 1
@type file
@dir img
@desc
Specify the file name of the background image.

@param FileName2
@text filename 2
@type file
@dir img
@desc
Specify the file name of the image to be added to the background image.

@param XOfs
@text X coordinate offset
@type number
@default 240
@desc
Specifies the X coordinate offset of the image to add to the background image.

@param YOfs
@text Y coordinate offset
@type number
@default 300
@desc
Specifies the Y coordinate offset of the image to add to the background image.
*/


/*~struct~WindowSize:
@param CommandWindowWidth
@text command window width
@type number
@default 300
@desc
Specifies the width of the command window.

@param CommandWindowHeight
@text command window height
@type number
@default 160
@desc
Specifies the vertical width of the command window.

@param DialogWindowWidth
@text dialog window width
@type number
@default 400
@desc
Specifies the width of the dialog window.

@param DialogWindowHeight
@text dialog window height
@type number
@default 160
@desc
Specifies the vertical width of the dialog window.

@param GetRewardWindowWidth
@text Reward acquisition window width
@type number
@default 540
@desc
Specifies the width of the reward acquisition window.
*/


/*~struct~Text:
@param MenuQuestSystemText
@text Menu display text
@type string
@default Quest confirmation
@desc
Specify the name of the quest management screen to be added to the menu.

@param QuestOrderText
@text Quest order text
@type string
@default Do you want to take this quest?
@desc
Specify the message to be displayed when ordering a quest.

@param QuestOrderYesText
@text Choice text to receive
@type string
@default Receive
@desc
Specify the message to be displayed when the quest order is Yes.

@param QuestOrderNoText
@text Choice text not received
@type string
@default not accepted
@desc
Specify the message to be displayed in the case of quest order No.

@param QuestCancelText
@text Cancellation confirmation message
@type string
@default Do you want to cancel this quest?
@desc
Specify the message to be displayed when canceling the quest.

@param QuestCancelYesText
@text Choice text to cancel
@type string
@default cancel
@desc
Quest order cancellation Specify the message to be displayed when Yes.

@param QuestCancelNoText
@text Choice text not to cancel
@type string
@default do not cancel
@desc
Specify the message to be displayed when the quest order cancellation No.

@param QuestReportText
@text Report confirmation message
@type string
@default Do you want to report this quest?
@desc
Specify the message to be displayed when reporting the quest.

@param QuestReportYesText
@text Choice text to report
@type string
@default Report
@desc
Quest Report Specify the message to be displayed when Yes.

@param QuestReportNoText
@text Choice text not to report
@type string
@default do not report
@desc
Specify the message to be displayed in the case of quest report No.

@param NothingQuestText
@text No quest message
@type string
@default There is no corresponding quest.
@desc
Specify the message to be displayed when there is no corresponding quest.

@param GetRewardText
@text Reward receipt message
@type string
@default Received the following items as a reward.
@desc
Specifies the message to display when receiving a reward.

@param HiddenTitleText
@text Hidden quest title
@type string
@default ??????????
@desc
Specify the title of the hidden quest.

@param AllCommandText
@text All quest display command
@type string
@default All quests
@desc
Specify the command name to display all quests.

@param QuestOrderCommandText
@text Quest consignment command
@type string
@default Receive quest
@desc
Specify the command name for receiving the quest.

@param OrderingQuestCommandText
@text In-progress quest command
@type string
@default quest in progress
@desc
Specify the command name to check the quest in progress.

@param QuestCancelCommandText
@text quest cancel command
@type string
@default quest cancellation
@desc
Specify the command name to cancel the quest in progress.

@param QuestReportCommandText
@text quest report command
@type string
@default Report quest
@desc
Specify the command name when reporting a quest.

@param ReportedQuestCommandText
@text Reported quest confirmation command
@type string
@default Reported quest
@desc
Specify the command name to check the reported quest.

@param FailedQuestCommandText
@text Failure quest confirmation command
@type string
@default quest that failed
@desc
Specify the command name to check the failed quest.

@param ExpiredQuestCommandText
@text Expired quest confirmation command
@type string
@default Expired quest
@desc
Specify the command name to check the expired quest.

@param HiddenQuestCommandText
@text Hidden quest confirmation command
@type string
@default unknown quest
@desc
Specify the command name to check the hidden quest.

@param NotOrderedStateText
@text Unordered text
@type string
@default Unordered
@desc
Specifies the text in the unordered state.

@param OrderingStateText
@text Text in progress
@type string
@default Progress
@desc
Specifies the text in the in-progress state.

@param ReportableStateText
@text Reportable text
@type string
@default Reportable
@desc
Specifies the text in a reportable state.

@param ReportedStateText
@text Reported text
@type string
@default Reported
@desc
Specifies the text in the reported state.

@param FailedStateText
@text Failure text
@type string
@default Failure
@desc
Specifies the text of the failed state.

@param ExpiredStateText
@text Expired text
@type string
@default Expired
@desc
Specifies the expired text.

@param RequesterText
@text Requester text
@type string
@default [Requester]:
@desc
Specify the requester's text.

@param RewardText
@text reward text
@type string
@default [Reward]:
@desc
Specify the reward text.

@param DifficultyText
@text Difficulty text
@type string
@default [Difficulty]:
@desc
Specify the difficulty text.

@param PlaceText
@text location text
@type string
@default [Location]:
@desc
Specify the text of the location.

@param TimeLimitText
@text Deadline text
@type string
@default [Period]:
@desc
Specify the text of the period.
*/


/*~struct~TextColor:
@param NotOrderedStateColor
@text Unordered text color
@type string
@default #aaaaaa
@desc
Specifies the color of the unordered text.

@param OrderingStateColor
@text Text color in progress
@type string
@default #ffffff
@desc
Specifies the color of the text in progress.

@param ReportableStateColor
@text Reportable text color
@type string
@default #ffff00
@desc
Specifies the color of the reportable text.

@param ReportedStateColor
@text Reported text color
@type string
@default #60ff60
@desc
Specifies the color of the text in the reported state.

@param FailedStateColor
@text Failed text color
@type string
@default #0000ff
@desc
Specifies the color of the text in the failed state.

@param ExpiredStateColor
@text Expired text color
@type string
@default #ff0000
@desc
Specifies the color of the expired text.
*/



/*:ja
@target MZ
@plugindesc クエストシステム v1.2.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/QuestSystem.js
@help
クエストシステムを導入するプラグインです。

【使用方法】
■クエストの作成
クエストはプラグインパラメータ「QuestDatas」を
編集することによって作成します。
このパラメータによってクエストに必要な「依頼者」「報酬」「クエストの内容」
などの項目を設定します。

■クエストの状態管理
各クエストは状態(未受注、進行中、報告済み など)を持ち、
その状態は変数によって管理します。
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
　　　失敗したクエスト報酬
6: クエスト期限切れ
　　　期限切れとなったクエスト
7: 隠しクエスト
　　　概要のみ分かる隠しクエスト

■クエストプラグインが行う状態管理について
クエストプラグインでは、次の状態管理のみを行います。
・クエストを受注したとき、状態を未受注から進行中にする
・クエストを報告したとき、状態を報告可から報告済みにする
・進行中のクエストをキャンセルしたとき、状態を進行中から未受注にする

上記以外の状態にする場合はイベントコマンドで
変数の値を変更する必要があります。

■報酬の受け取り
クエストの報酬は、報告を行ったタイミングで受け取ります。

■クエストシーン開始
クエストシーンは次の二通りの方法によって開始することができます。
・メニューから「クエスト管理」を呼び出す
・プラグインコマンド「StartQuestScene」を実行する

この二つは主に次のように使い分けることを想定しています。
プラグインコマンド：依頼所のような施設を作り、
　　　　　　　　　　そこでクエストの受注と報告を行う。
メニュー：各クエストの状況を確認する。

■クエストコマンド
クエストコマンドは、クエストの分類、およびクエストの受注と報告を行う
コマンドを管理するために使用します。
※プラグインコマンドとメニューで設定するクエストコマンドは
　デフォルトで設定されているため、
　基本的な使い方をするのであれば特に変更の必要はありません。

クエストコマンドには以下の種類があります。
all: 全てのクエストを表示する
questOrder: 未受注のクエストを表示する
orderingQuest: 進行中のクエストを表示する
questCancel: 進行中のクエストについて、クエストの受注をキャンセルする
questReport: 報告可能なクエストについて、報告済みにして報酬を受け取る
reportedQuest: 報告済みのクエストを表示する
failedQuest: 失敗したクエストを表示する
expiredQuest: 期限切れのクエストを表示する
hiddenQuest: 隠しクエストを表示する

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@param QuestDatas
@text クエストデータ
@type struct<QuestData>[]
@default []
@desc
クエストのデータを登録します。

@param EnabledQuestMenu
@text クエストメニュー有効化
@type boolean
@on 表示
@off 非表示
@default true
@desc
メニューへのクエスト管理画面の追加有無を指定します。

@param EnabledQuestMenuSwitchId
@text クエストメニュー有効化スイッチID
@type switch
@default 0
@desc
メニューのクエスト管理画面の有効/無効を判定するスイッチIDを指定します。

@param MenuCommands
@text メニュー表示コマンド
@type select[]
@option all
@option questOrder
@option orderingQuest
@option questCancel
@option questReport
@option reportedQuest
@option failedQuest
@option expiredQuest
@option hiddenQuest
@default ["orderingQuest","reportedQuest","all"]
@desc
メニューのクエスト管理画面で使用するフィルターコマンドを指定します。ヘルプのクエストコマンド参照

@param MenuBackgroundImage
@text メニュー背景画像
@type struct<BackgroundImage>
@default {"FileName1":"","FileName2":"","XOfs":"240","YOfs":"300"}
@desc
メニューのクエストシーンの背景画像を指定します。

@param DisplayRequestor
@text 依頼者の表示
@type boolean
@on 表示
@off 非表示
@default true
@desc
タイトルの表示有無を指定します。

@param DisplayRewards
@text 報酬の表示
@type boolean
@default true
@desc
報酬の依頼場所の表示有無を指定します。

@param DisplayDifficulty
@text 難易度の表示
@type boolean
@on 表示
@off 非表示
@default true
@desc
クエスト難易度の表示有無を指定します。

@param DisplayPlace
@text 場所の表示
@type boolean
@default true
@desc
クエストの依頼場所の表示有無を指定します。

@param DisplayTimeLimit
@text 有効期限の表示
@type boolean
@on 表示
@off 非表示
@default true
@desc
クエストの有効期限の表示有無を指定します。

@param QuestOrderSe
@text クエスト受注SE
@type struct<QuestOrderSe>
@default {"FileName":"Skill1","Volume":"90","Pitch":"100","Pan":"0"}
@desc
クエストを受注したときに再生するSEを設定します。

@param QuestReportMe
@text クエスト報告ME
@type struct<QuestReportMe>
@default {"FileName":"Item","Volume":"90","Pitch":"100","Pan":"0"}
@desc
クエストを報告したときに再生するMEを設定します。

@param WindowSize
@text ウィンドウのサイズ
@type struct<WindowSize>
@default {"CommandWindowWidth":"300","CommandWindowHeight":"160","DialogWindowWidth":"400","DialogWindowHeight":"160","GetRewardWindowWidth":"540"}
@desc
各種ウィンドウのサイズを設定します。

@param Text
@text 表示テキスト
@type struct<Text>
@default {"MenuQuestSystemText":"クエスト確認","QuestOrderText":"このクエストを受けますか？","QuestOrderYesText":"受ける","QuestOrderNoText":"受けない","QuestCancelText":"このクエストをキャンセルしますか？","QuestCancelYesText":"キャンセルする","QuestCancelNoText":"キャンセルしない","QuestReportText":"このクエストを報告しますか？","QuestReportYesText":"報告する","QuestReportNoText":"報告しない","NothingQuestText":"該当するクエストはありません。","GetRewardText":"報酬として次のアイテムを受け取りました。","HiddenTitleText":"？？？？？？","AllCommandText":"全クエスト","QuestOrderCommandText":"クエストを受ける","OrderingQuestCommandText":"進行中のクエスト","QuestCancelCommandText":"クエストのキャンセル","QuestReportCommandText":"クエストを報告する","ReportedQuestCommandText":"報告済みのクエスト","FailedQuestCommandText":"失敗したクエスト","ExpiredQuestCommandText":"期限切れのクエスト","HiddenQuestCommandText":"未知のクエスト","NotOrderedStateText":"未受注","OrderingStateText":"進行中","ReportableStateText":"報告可","ReportedStateText":"報告済み","FailedStateText":"失敗","ExpiredStateText":"期限切れ","RequesterText":"【依頼者】：","RewardText":"【報酬】：","DifficultyText":"【難易度】：","PlaceText":"【場所】：","TimeLimitText":"【期間】："}
@desc
ゲーム中で使用されるテキストを設定します。

@param TextColor
@text 表示テキスト色
@type struct<TextColor>
@default {"NotOrderedStateColor":"#ffffff","OrderingStateColor":"#ffffff","ReportableStateColor":"#ffffff","ReportedStateColor":"#ffffff","FailedStateColor":"#ffffff","ExpiredStateColor":"#ff0000"}
@desc
ゲーム中で使用されるテキストのカラーを設定します。

@param GoldIcon
@text ゴールドのアイコン
@type number
@default 314
@desc
報酬欄に表示するゴールドのアイコンを設定します。

@param ExpIcon
@text 経験値のアイコン
@type number
@default 89
@desc
報酬欄に表示する経験値のアイコンを設定します。

@param QuestTitleWrap
@text クエストタイトル改行有無
@type boolean
@default false
@desc
クエストタイトルの改行有無を設定します。


@command StartQuestScene
@text クエストシーン開始
@desc クエストシーンを開始します。

@arg QuestCommands
@type select[]
@option all
@option questOrder
@option orderingQuest
@option questCancel
@option questReport
@option reportedQuest
@option failedQuest
@option expiredQuest
@option hiddenQuest
@default ["questOrder","questCancel","questReport"]
@text クエストコマンド
@desc クエストコマンドを指定します。

@arg BackgroundImage
@text 背景画像
@type struct<BackgroundImage>
@default {"FileName1":"","FileName2":"","XOfs":"240","YOfs":"300"}
@desc
クエストシーンの背景画像を指定します。


@command GetRewards
@text 報酬を入手
@desc クエストの報酬を入手します。

@arg VariableId
@type variable
@text 変数ID
@desc 報酬を入手するクエストの変数IDを指定します。


@command ChangeDetail
@text クエスト詳細変更
@desc クエストの詳細を変更します。

@arg VariableId
@type variable
@text 変数ID
@desc 詳細を変更するクエストの変数IDを指定します。

@arg Detail
@type multiline_string
@text 詳細
@desc 変更するクエスト詳細を設定します。


@command ChangeRewards
@text 報酬変更
@desc クエストの報酬を変更します。

@arg VariableId
@type variable
@text 変数ID
@desc 報酬を変更するクエストの変数IDを指定します。

@arg Rewards
@type struct<Reward>[]
@text 報酬
@desc 変更するクエストの報酬を設定します。
*/


/*~struct~QuestData:ja
@param VariableId
@text 変数ID
@type variable
@desc
クエストの状態を管理する変数を指定します。

@param Title
@text タイトル
@type string
@desc
クエストのタイトルを指定します。

@param IconIndex
@text タイトルアイコン
@type number
@desc
クエストのタイトルに表示するアイコンを指定します。

@param Requester
@text 依頼者名
@type string
@desc
クエストの依頼者名を指定します。

@param Rewards
@text 報酬
@type struct<Reward>[]
@desc
クエストの報酬を指定します。

@param Difficulty
@text 難易度
@type string
@desc
クエストの難易度を指定します。

@param Place
@text 場所
@type string
@desc
クエストの場所を指定します。

@param TimeLimit
@text 有効期限
@type string
@desc
クエストの有効期限を指定します。

@param Detail
@text クエストの情報
@type multiline_string
@desc
クエストの情報を指定します。

@param HiddenDetail
@text 隠された情報
@type multiline_string
@desc
クエストが隠し状態のときの情報を指定します。

@param CommonEventId
@text コモンイベントID
@type common_event
@default 0
@desc
クエスト報告完了直後に起動するコモンイベントIDを指定します。0だと起動しません。
*/


/*~struct~Reward:ja
@param Type
@text 報酬のタイプ
@type select
@option ゴールド
@value gold
@option 経験値
@value exp
@option アイテム
@value item
@option 武器
@value weapon
@option 防具
@value armor
@option 任意
@value any
@desc
報酬のタイプ(ゴールド, 経験値, アイテム, 武器, 防具、任意のいずれか)を指定します。

@param GoldValue
@text 報酬ゴールド数
@type number
@desc
報酬のタイプがゴールドの場合に入手するゴールドを指定します。

@param ExpValue
@text 報酬経験値
@type number
@desc
報酬のタイプが経験値の場合に入手する経験値を指定します。

@param ItemId
@text 報酬アイテムID
@type number
@desc
報酬のタイプがアイテムの場合に入手するアイテムIDを指定します。

@param ItemCount
@text 報酬アイテム数
@type number
@desc
報酬のタイプがアイテムの場合に入手するアイテム数を指定します。

@param Text
@text テキスト
@type string
@desc
報酬のタイプが任意の場合に表示するテキストを指定します。

@param IconIndex
@text アイコン
@type number
@desc
報酬のタイプが任意の場合に表示するアイコンを指定します。
*/


/*~struct~QuestOrderSe:ja
@param FileName
@text 受注SE
@type file
@dir audio/se
@default Skill1
@desc
クエストを受注したときに再生するSEのファイル名を指定します。

@param Volume
@text 受注SE音量
@type number
@default 90
@desc
クエストを受注したときに再生するSEのvolumeを指定します。

@param Pitch
@text 受注SEピッチ
@type number
@default 100
@desc
クエストを受注したときに再生するSEのpitchを指定します。

@param Pan
@text 受注SE位相
@type number
@default 0
@desc
クエストを受注したときに再生するSEのpanを指定します。
*/


/*~struct~QuestReportMe:ja
@param FileName
@text 報告ME
@type file
@dir audio/me
@default Item
@desc
クエストを報告したときに再生するMEのファイル名を指定します。

@param Volume
@text 報告ME音量
@type number
@default 90
@desc
クエストを報告したときに再生するMEのvolumeを指定します。

@param Pitch
@text 報告MEピッチ
@type number
@default 100
@desc
クエストを報告したときに再生するMEのpitchを指定します。

@param Pan
@text 報告ME位相
@type number
@default 0
@desc
クエストを報告したときに再生するMEのpanを指定します。
*/


/*~struct~BackgroundImage:ja
@param FileName1
@text ファイル名1
@type file
@dir img
@desc
背景画像のファイル名を指定します。

@param FileName2
@text ファイル名2
@type file
@dir img
@desc
背景画像に追加する画像のファイル名を指定します。

@param XOfs
@text X座標オフセット
@type number
@default 240
@desc
背景画像に追加する画像のX座標オフセットを指定します。

@param YOfs
@text Y座標オフセット
@type number
@default 300
@desc
背景画像に追加する画像のY座標オフセットを指定します。
*/


/*~struct~WindowSize:ja
@param CommandWindowWidth
@text コマンドウィンドウ幅
@type number
@default 300
@desc
コマンドウィンドウの横幅を指定します。

@param CommandWindowHeight
@text コマンドウィンドウ高
@type number
@default 160
@desc
コマンドウィンドウの縦幅を指定します。

@param DialogWindowWidth
@text ダイアログウィンドウ幅
@type number
@default 400
@desc
ダイアログウィンドウの横幅を指定します。

@param DialogWindowHeight
@text ダイアログウィンドウ高
@type number
@default 160
@desc
ダイアログウィンドウの縦幅を指定します。

@param GetRewardWindowWidth
@text 報酬入手ウィンドウ幅
@type number
@default 540
@desc
報酬入手ウィンドウの横幅を指定します。
*/


/*~struct~Text:ja
@param MenuQuestSystemText
@text メニュー表示テキスト
@type string
@default クエスト確認
@desc
メニューに追加するクエスト管理画面の名称を指定します。

@param QuestOrderText
@text クエスト受注テキスト
@type string
@default このクエストを受けますか？
@desc
クエストを受注する場合に表示するメッセージを指定します。

@param QuestOrderYesText
@text 受ける選択肢テキスト
@type string
@default 受ける
@desc
クエスト受注Yesの場合に表示するメッセージを指定します。

@param QuestOrderNoText
@text 受けない選択肢テキスト
@type string
@default 受けない
@desc
クエスト受注Noの場合に表示するメッセージを指定します。

@param QuestCancelText
@text キャンセル確認メッセージ
@type string
@default このクエストをキャンセルしますか？
@desc
クエストをキャンセルする場合に表示するメッセージを指定します。

@param QuestCancelYesText
@text キャンセルする選択肢テキスト
@type string
@default キャンセルする
@desc
クエスト受注キャンセルYesの場合に表示するメッセージを指定します。

@param QuestCancelNoText
@text キャンセルしない選択肢テキスト
@type string
@default キャンセルしない
@desc
クエスト受注キャンセルNoの場合に表示するメッセージを指定します。

@param QuestReportText
@text 報告確認メッセージ
@type string
@default このクエストを報告しますか？
@desc
クエスト報告時に表示するメッセージを指定します。

@param QuestReportYesText
@text 報告する選択肢テキスト
@type string
@default 報告する
@desc
クエスト報告Yesの場合に表示するメッセージを指定します。

@param QuestReportNoText
@text 報告しない選択肢テキスト
@type string
@default 報告しない
@desc
クエスト報告Noの場合に表示するメッセージを指定します。

@param NothingQuestText
@text クエストなしメッセージ
@type string
@default 該当するクエストはありません。
@desc
該当するクエストがない場合に表示するメッセージを指定します。

@param GetRewardText
@text 報酬受取メッセージ
@type string
@default 報酬として次のアイテムを受け取りました。
@desc
報酬を受け取った時に表示するメッセージを指定します。

@param HiddenTitleText
@text 隠しクエストのタイトル
@type string
@default ？？？？？？
@desc
隠しクエストのタイトルを指定します。

@param AllCommandText
@text 全クエスト表示コマンド
@type string
@default 全クエスト
@desc
全クエストを表示する場合のコマンド名を指定します。

@param QuestOrderCommandText
@text クエスト受託コマンド
@type string
@default クエストを受ける
@desc
クエストを受ける場合のコマンド名を指定します。

@param OrderingQuestCommandText
@text 進行中クエストコマンド
@type string
@default 進行中のクエスト
@desc
進行中のクエストを確認する場合のコマンド名を指定します。

@param QuestCancelCommandText
@text クエストキャンセルコマンド
@type string
@default クエストのキャンセル
@desc
進行中のクエストをキャンセルする場合のコマンド名を指定します。

@param QuestReportCommandText
@text クエスト報告コマンド
@type string
@default クエストを報告する
@desc
クエストを報告する場合のコマンド名を指定します。

@param ReportedQuestCommandText
@text 報告済クエスト確認コマンド
@type string
@default 報告済みのクエスト
@desc
報告済みのクエストを確認する場合のコマンド名を指定します。

@param FailedQuestCommandText
@text 失敗クエスト確認コマンド
@type string
@default 失敗したクエスト
@desc
失敗したクエストを確認する場合のコマンド名を指定します。

@param ExpiredQuestCommandText
@text 期限切れクエスト確認コマンド
@type string
@default 期限切れのクエスト
@desc
期限切れのクエストを確認する場合のコマンド名を指定します。

@param HiddenQuestCommandText
@text 隠しクエスト確認コマンド
@type string
@default 未知のクエスト
@desc
隠しクエストを確認する場合のコマンド名を指定します。

@param NotOrderedStateText
@text 未受注テキスト
@type string
@default 未受注
@desc
未受注の状態のテキストを指定します。

@param OrderingStateText
@text 進行中テキスト
@type string
@default 進行中
@desc
進行中の状態のテキストを指定します。

@param ReportableStateText
@text 報告可能テキスト
@type string
@default 報告可
@desc
報告可能の状態のテキストを指定します。

@param ReportedStateText
@text 報告済みテキスト
@type string
@default 報告済み
@desc
報告済みの状態のテキストを指定します。

@param FailedStateText
@text 失敗テキスト
@type string
@default 失敗
@desc
失敗の状態のテキストを指定します。

@param ExpiredStateText
@text 期限切れテキスト
@type string
@default 期限切れ
@desc
期限切れの状態のテキストを指定します。

@param RequesterText
@text 依頼者テキスト
@type string
@default 【依頼者】：
@desc
依頼者のテキストを指定します。

@param RewardText
@text 報酬テキスト
@type string
@default 【報酬】：
@desc
報酬のテキストを指定します。

@param DifficultyText
@text 難易度テキスト
@type string
@default 【難易度】：
@desc
難易度のテキストを指定します。

@param PlaceText
@text 場所テキスト
@type string
@default 【場所】：
@desc
場所のテキストを指定します。

@param TimeLimitText
@text 期限テキスト
@type string
@default 【期間】：
@desc
期間のテキストを指定します。
*/


/*~struct~TextColor:ja
@param NotOrderedStateColor
@text 未受注テキスト色
@type string
@default #aaaaaa
@desc
未受注の状態のテキストのカラーを指定します。

@param OrderingStateColor
@text 進行中テキスト色
@type string
@default #ffffff
@desc
進行中の状態のテキストのカラーを指定します。

@param ReportableStateColor
@text 報告可能テキスト色
@type string
@default #ffff00
@desc
報告可能の状態のテキストのカラーを指定します。

@param ReportedStateColor
@text 報告済みテキスト色
@type string
@default #60ff60
@desc
報告済みの状態のテキストのカラーを指定します。

@param FailedStateColor
@text 失敗テキスト色
@type string
@default #0000ff
@desc
失敗の状態のテキストのカラーを指定します。

@param ExpiredStateColor
@text 期限切れテキスト色
@type string
@default #ff0000
@desc
期限切れの状態のテキストのカラーを指定します。
*/

const QuestSystemPluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];

let $dataQuests = null;

const QuestSystemAlias = (() => {
"use strict";

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
        } else if (rewardParam.Type === "exp") {
            return new RewardData("exp", { value: rewardParam.ExpValue });
        } else if (["item", "weapon", "armor"].includes(rewardParam.Type)) {
            const itemInfo = new ItemInfo(rewardParam.Type, rewardParam.ItemId);
            return new RewardData("item", { item: itemInfo, count: rewardParam.ItemCount });
        } else if (rewardParam.Type === "any") {
            return new RewardData("any", { text: rewardParam.Text, iconIndex: rewardParam.IconIndex });
        }
    }

    constructor(type, params) {
        this._type = type;
        this._params = params;
    }

    get type() { return this._type; }
    get params() { return this._params };

    getReward() {
        if (this.type === "gold") {
            $gameParty.gainGold(this._params.value);
        } else if (this.type === "exp") {
            for (const actor of $gameParty.members()) {
                actor.gainExp(this._params.value);
            }
        } else if (["item", "weapon", "armor"].includes(this.type)) {
            $gameParty.gainItem(this._params.item.itemData(), this._params.count);
        }
    }
}

class TextDrawer {
    static get WINDOW_TEXT_SPACE() { return 64 };

    constructor(window) {
        this._window = window;
    }

    drawIconText(text, iconIndex, x, y, width) {
        return this.drawIconTextByMode(text, iconIndex, x, y, width, "normal");
    }

    drawIconTextWrap(text, iconIndex, x, y, width) {
        return this.drawIconTextByMode(text, iconIndex, x, y, width, "ex");
    }

    drawTextExWrap(text, x, y, width) {
        this._window.resetFontSettings();
        const textState = this._window.createTextState(text, x, y, width);
        const textArray = textState.text.split("");
        const outTextArray = [];
        let begin = 0;
        let turnPoint = 0;
        for (let i = 0; i < textArray.length; i++) {
            outTextArray.push(textArray[i]);
            if (textArray[i] === "\n") {
                begin += turnPoint;
                turnPoint = 0;
            } else if (this.isTextTurn(textArray, begin, turnPoint, width)) {
                outTextArray.push("\n");
                begin += turnPoint;
                turnPoint = 0;
            } else {
                turnPoint++;   
            }
        }
        textState.text = outTextArray.join("");
        this._window.processAllText(textState);
        return textState.text.split("\n").length;
    }

    isTextTurn(array, begin, length, width) {
        const buf = [];
        for (let i = begin; i < begin + length; i++) {
            buf.push(array[i]);
        }
        const text = buf.join("");
        if (this._window.textWidth(text) >= width - TextDrawer.WINDOW_TEXT_SPACE) {
            return true;
        }
        return false;
    }

    drawIconTextByMode(text, iconIndex, x, y, width, mode) {
        const iconY = y + (this._window.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this._window.resetTextColor();
        this._window.drawIcon(iconIndex, x, iconY);
        if (mode === "normal") {
            this._window.drawText(text, x + textMargin, y, itemWidth);
            return 1;
        } else if (mode === "ex") {
            return this.drawTextExWrap(text, x + textMargin, y, itemWidth);
        }
    }
}

class RewardWindowDrawer {
    constructor(window, reward) {
        this._window = window;
        this._reward = reward;
        this._textDrawer = new TextDrawer(window);
    }

    drawRewardToWindow(x, y, width) {
        if (this._reward.type === "gold") {
            const text = `${this._reward.params.value}${TextManager.currencyUnit}`;
            this._textDrawer.drawIconText(text, GoldIcon, x, y, width);
        } else if (this._reward.type === "item") {
            this._window.drawItemName(this._reward.params.item.itemData(), x, y, width);
            const strItemCount = `×${this._reward.params.count}`;
            this._window.drawText(strItemCount, x, y, width, "right");
        } else if (this._reward.type === "exp") {
            const text = `${TextManager.exp}＋${this._reward.params.value}`;
            this._textDrawer.drawIconText(text, ExpIcon, x, y, width);
        } else if (this._reward.type === "any") {
            this._textDrawer.drawIconText(this._reward.params.text, this._reward.params.iconIndex, x, y, width);
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
        const commonEventId = questDataParam.CommonEventId;
        return new QuestData(variableId, title, iconIndex, requester, rewards, difficulty, place, timeLimit, detail, hiddenDetail, commonEventId);
    }

    constructor(variableId, title, iconIndex, requester, rewards, difficulty, place, timeLimit, detail, hiddenDetail, commonEventId) {
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
        this._commonEventId = commonEventId;
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
    get commonEventId() { return this._commonEventId; }

    set rewards(_rewards) { this._rewards = _rewards; }
    set detail(_detail) { this._detail = _detail; }

    state() {
        const data = STATE_LIST.find(data => data.value === $gameVariables.value(this._variableId));
        return data ? data.state : "none";
    }

    setState(state) {
        const data = STATE_LIST.find(data => data.state === state);
        if (data) $gameVariables.setValue(this._variableId, data.value);
    }

    getRewards() {
        for (const reward of this.rewards) {
            reward.getReward();
        }
    }

    stateText() {
        const data = STATE_LIST.find(data => data.state === this.state());
        return data.text;
    }

    stateTextColor() {
        const data = STATE_LIST.find(data => data.state === this.state());
        return data.color;
    }
}

// Parse plugin parameters.
const typeDefine = {
    MenuCommands: ["string"],
    QuestDatas: [{
        Rewards: [{}],
    }],
    QuestOrderSe: {},
    QuestReportMe: {},
    MenuBackgroundImage: {},
    WindowSize: {},
    Text: {},
    TextColor: {},
};

const params = PluginParamsParser.parse(PluginManager.parameters(QuestSystemPluginName), typeDefine);

$dataQuests = params.QuestDatas.map(questDataParam => {
    return QuestData.fromParam(questDataParam);
});

const EnabledQuestMenu = params.EnabledQuestMenu;
const EnabledQuestMenuSwitchId = params.EnabledQuestMenuSwitchId;
const MenuCommands = params.MenuCommands;
const DisplayRequestor = params.DisplayRequestor;
const DisplayRewards = params.DisplayRewards;
const DisplayDifficulty = params.DisplayDifficulty;
const DisplayPlace = params.DisplayPlace;
const DisplayTimeLimit = params.DisplayTimeLimit;
const GoldIcon = params.GoldIcon;
const ExpIcon = params.ExpIcon;
const QuestTitleWrap = params.QuestTitleWrap;

const QuestOrderSe = params.QuestOrderSe;
const QuestReportMe = params.QuestReportMe;
const MenuBackgroundImage = params.MenuBackgroundImage;
const WindowSize = params.WindowSize;
const Text = params.Text;
const TextColor = params.TextColor;

const STATE_LIST = [
    { state: "none", value: 0, text: "" },
    { state: "notOrdered", value: 1, text: Text.NotOrderedStateText, color: TextColor.NotOrderedStateColor },
    { state: "ordering", value: 2, text: Text.OrderingStateText, color: TextColor.OrderingStateColor },
    { state: "reportable", value: 3, text: Text.ReportableStateText, color: TextColor.ReportableStateColor },
    { state: "reported", value: 4, text: Text.ReportedStateText, color: TextColor.ReportedStateColor },
    { state: "failed", value: 5, text: Text.FailedStateText, color: TextColor.FailedStateColor },
    { state: "expired", value: 6, text: Text.ExpiredStateText, color: TextColor.ExpiredStateColor },
    { state: "hidden", value: 7, text: "", color: "#ffffff" },
];

const COMMAND_TABLE = {
    "all": { state: null, text: Text.AllCommandText },
    "questOrder": { state: ["notOrdered"], text: Text.QuestOrderCommandText },
    "orderingQuest": { state: ["ordering", "reportable"], text: Text.OrderingQuestCommandText },
    "questCancel": { state: ["ordering"], text: Text.QuestCancelCommandText },
    "questReport": { state: ["reportable"], text: Text.QuestReportCommandText },
    "reportedQuest": { state: ["reported"], text: Text.ReportedQuestCommandText },
    "failedQuest": { state: ["failed"], text: Text.FailedQuestCommandText },
    "expiredQuest": { state: ["expired"], text: Text.ExpiredQuestCommandText },
    "hiddenQuest": { state: ["hidden"], text: Text.HiddenQuestCommandText },
};

class Scene_QuestSystem extends Scene_Message {
    prepare(commandList, backgroundImage) {
        this._commandList = commandList;
        this._backgroundImage = backgroundImage;
    }

    create() {
        super.create();
        this.createBackground();
        this.createWindowLayer();
        this.createAllWindow();
        this.createButtons();
        this._interpreter = new Game_Interpreter();
        this._eventState = "none";
    }

    // Ported from Scene_MenuBase
    createButtons() {
        if (ConfigManager.touchUI) {
            if (this.needsCancelButton()) {
                this.createCancelButton();
            }
        }
    }

    // Ported from Scene_MenuBase
    needsCancelButton() {
        return true;
    }

    // Ported from Scene_MenuBase
    createCancelButton() {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
        this._cancelButton.y = this.buttonY();
        this.addWindow(this._cancelButton);
    }

    // Ported from Scene_MenuBase
    setBackgroundOpacity(opacity) {
        this._backgroundSprite.opacity = opacity;
    }

    createBackground() {
        this._backgroundSprite = new Sprite();
        if (this._backgroundImage.FileName1) {
            const bitmap1 = ImageManager.loadBitmap("img/", this._backgroundImage.FileName1);
            this._backgroundSprite.bitmap = bitmap1;
            if (this._backgroundImage.FileName2) {
                const bitmap2 = ImageManager.loadBitmap("img/", this._backgroundImage.FileName2);
                const sprite = new Sprite(bitmap2);
                sprite.x = this._backgroundImage.XOfs;
                sprite.y = this._backgroundImage.YOfs;
                this._backgroundSprite.addChild(sprite);
            }
            this.addChild(this._backgroundSprite);
        } else {
            this._backgroundFilter = new PIXI.filters.BlurFilter();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this._backgroundSprite.filters = [this._backgroundFilter];
            this.addChild(this._backgroundSprite);
            this.setBackgroundOpacity(192);
        }
    }

    createAllWindow() {
        this.createQuestCommandWindow();
        this.createQuestListWindow();
        this.createQuestDetailWindow();
        this.createQuestOrderWindow();
        this.createQuestReportWindow();
        this.createQuestGetRewardWindow();
        this.createQuestCancelWindow();
        super.createAllWindows();
    }

    start() {
        super.start();
        this._questCommandWindow.activate();
        this._questCommandWindow.select(0);
        this._questDetailWindow.setDrawState("undraw");
        this._questCommandWindow.refresh();
        this.resetQuestList();
    }

    update() {
        super.update();
        this.updateEvent();
    }

    updateEvent() {
        if (this._eventState === "start") {
            this._questListWindow.deactivate();
            this._eventState = "running";
        } else if (this._eventState === "running") {
            if (this._interpreter.isRunning()) this._interpreter.update();
            if (!this._interpreter.isRunning() && !$gameMessage.isBusy()) this._eventState = "end";
        } else if (this._eventState === "end") {
            this._eventState = "none";
            this._interpreter.clear();
            this.resetQuestList();
            this._questListWindow.activate();
            this._questListWindow.select(0);
            this._questDetailWindow.refresh();
        }
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
        const w = WindowSize.CommandWindowWidth;
        const h = WindowSize.CommandWindowHeight;
        return new Rectangle(x, y, w, h);
    }

    questListWindowRect() {
        const questCommandWindowRect = this.questCommandWindowRect();
        const x = 0;
        const y = questCommandWindowRect.y + questCommandWindowRect.height;
        const w = WindowSize.CommandWindowWidth;
        const bottom = (this.isBottomButtonMode() ? Graphics.boxHeight - this.buttonAreaHeight() : Graphics.boxHeight);
        const h = bottom - y;
        return new Rectangle(x, y, w, h);
    }

    questDetailWindowRect() {
        const questCommandWindowRect = this.questCommandWindowRect();
        const questListWindowRect = this.questListWindowRect();
        const x = questListWindowRect.x + questListWindowRect.width;
        const y = questCommandWindowRect.y;
        const w = Graphics.boxWidth - x;
        const h = questCommandWindowRect.height + questListWindowRect.height;
        return new Rectangle(x, y, w, h);
    }

    questOrderWindowRect() {
        const w = WindowSize.DialogWindowWidth;
        const h = WindowSize.DialogWindowHeight;
        const x = Graphics.boxWidth / 2 - w / 2;
        const y = Graphics.boxHeight / 2 - h / 2;
        return new Rectangle(x, y, w, h);
    }

    questReportWindowRect() {
        return this.questOrderWindowRect();
    }

    questGetRewardWindowRect() {
        const x = 0;
        const y = 0;
        const w = WindowSize.GetRewardWindowWidth;
        const h = Graphics.boxHeight;
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
        case "questOrder":
            this.change_QuestListWindow_To_QuestOrderWindow();
            break;
        case "questCancel":
            this.change_QuestListWindow_To_QuestCancelWindow();
            break;
        case "questReport":
            this.change_QuestListWindow_To_QuestReportWindow();
            break;
        default:
            this._questListWindow.activate();
            break;
        }
    }

    onQuestListCancel() {
        this.change_QuestListWindow_To_QuestCommandWindow();
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
        this._questDetailWindow.refresh();
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
        this._eventState = "start";
        this.startCommonEvent(questData.commonEventId);
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
        this._questListWindow.resetQuestList(this._questCommandWindow.filterQuestList());
    }

    // Start common event.
    startCommonEvent(commonEventId) {
        // If commonEventId is undefined, do not start common event.;
        if (!commonEventId || commonEventId === 0) return;
        const commonEventData = $dataCommonEvents[commonEventId];
        this._interpreter.setup(commonEventData.list);
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
                this.addCommand(commandData.text, command);
            } else {
                throw new Error(`Unknow quest command ${command}`);
            }
        }
    }

    filterQuestList() {
        if (this.currentSymbol() === "all") return $dataQuests.filter(data => data.state() !== "none");
        const commandData = COMMAND_TABLE[this.currentSymbol()];
        return $dataQuests.filter(quest => commandData.state.includes(quest.state()));
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
            const textDrawer = new TextDrawer(this);
            textDrawer.drawIconText(this.commandName(index), questData.iconIndex, rect.x, rect.y, rect.width);
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
            this.drawQuestData();
        }
    }

    drawQuestData() {
        let startLine = 0;
        const titleRows = this.drawTitle(startLine);
        startLine += titleRows;
        this.drawHorzLine(this.startY(startLine));
        startLine += 0.25;
        if (DisplayRequestor) {
            this.drawRequester(startLine);
            startLine += 1;
        }
        if (DisplayRewards) {
            this.drawRewards(startLine);
            startLine += this._questData.rewards.length;
        }
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
        if (!this.isOnlyDisplayDetail()) {
            this.drawHorzLine(this.startY(startLine));
            startLine += 0.25;
        }
        this.drawDetail(startLine);
    }

    isOnlyDisplayDetail() {
        return !(DisplayRequestor || DisplayRewards || DisplayDifficulty || DisplayPlace || DisplayTimeLimit);
    }

    drawNothingQuest(startLine) {
        this.drawTextEx(Text.NothingQuestText, this.padding, this.startY(startLine), this.width - this.padding * 2);
    }

    drawTitle(startLine) {
        let titleRows = 1;
        this.resetTextColor();
        const stateWidth = 120;
        const titleWidth = this.width - this.padding * 4 - stateWidth;
        if (QuestTitleWrap) {
            if (this._questData.iconIndex === 0) {
                titleRows = this.drawTextExWrap(this._questData.title, this.padding, this.startY(startLine), titleWidth);
            } else {
                titleRows = this.drawIconTextWrap(this._questData.title, this._questData.iconIndex, this.padding, this.startY(startLine), titleWidth);
            }
        } else {
            if (this._questData.iconIndex === 0) {
                this.drawText(this._questData.title, this.padding, this.startY(startLine), titleWidth);
            } else {
                this.drawIconText(this._questData.title, this._questData.iconIndex, this.padding, this.startY(startLine), titleWidth);
            }
        }
        this.changeTextColor(this._questData.stateTextColor());
        this.drawText(this._questData.stateText(), this.padding + titleWidth, this.startY(startLine), stateWidth, "right");
        this.resetTextColor();
        return titleRows;
    }

    drawRequester(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawText(Text.RequesterText, this.padding, this.startY(startLine), this.infoTextWidth());
        this.resetTextColor();
        this.drawText(this._questData.requester, this.messageX(), this.startY(startLine), this.messageWindth());
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
        new RewardWindowDrawer(this, reward).drawRewardToWindow(this.messageX(), y, this.messageWindth());
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
        this.drawTextExWrap(this._questData.detail, this.padding, this.startY(startLine), this.width - this.padding * 2);
    }

    drawHiddenDetail(startLine) {
        this.drawTextEx(this._questData.hiddenDetail, this.padding, this.startY(startLine), this.width - this.padding * 2);
    }

    startY(line) {
        return this.padding + this.itemHeight() * line;
    }

    drawHorzLine(y, color = this.systemColor()) {
        this.changeTextColor(color);
        const padding = this.itemPadding();
        const x = padding;
        const width = this.innerWidth - padding * 2;
        this.drawRect(x, y, width, 5);
        this.resetTextColor();
    }

    drawTextExWrap(text, x, y, width) {
        const textDrawer = new TextDrawer(this);
        return textDrawer.drawTextExWrap(text, x, y, width);
    }

    drawIconText(text, iconIndex, x, y, width) {
        const textDrawer = new TextDrawer(this);
        return textDrawer.drawIconText(text, iconIndex, x, y, width);
    }

    drawIconTextWrap(text, iconIndex, x, y, width) {
        const textDrawer = new TextDrawer(this);
        return textDrawer.drawIconTextWrap(text, iconIndex, x, y, width);
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

    refresh() {
        if (this._questData) this.updateWindowRect();
        super.refresh();
    }

    updateWindowRect() {
        const numRewards = this._questData.rewards.length;
        const w = WindowSize.GetRewardWindowWidth;
        const h = 80 + numRewards * 40;
        const x = Graphics.boxWidth / 2 - w / 2;
        const y = Graphics.boxHeight / 2 - h / 2;
        this.move(x, y, w, h);
    }

    onTouchOk() {
        this.processOk();
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
        new RewardWindowDrawer(this, reward).drawRewardToWindow(rect.x, rect.y, rect.width);
    }
}


// Register plugin command.
PluginManager.registerCommand(QuestSystemPluginName, "StartQuestScene", args => {
    SceneManager.push(Scene_QuestSystem);
    const params = PluginParamsParser.parse(args, { QuestCommands: ["string"], BackgroundImage: {} });
    const commands = (params.QuestCommands.length === 0 ? null : params.QuestCommands);
    SceneManager.prepareNextScene(commands, params.BackgroundImage);
});

PluginManager.registerCommand(QuestSystemPluginName, "GetRewards", args => {
    const params = PluginParamsParser.parse(args, { VariableId: "number" });
    const questData = $dataQuests.find(data => data.variableId === params.VariableId);
    if (!questData) return;
    questData.getRewards();
});

PluginManager.registerCommand(QuestSystemPluginName, "ChangeDetail", args => {
    const params = PluginParamsParser.parse(args, { VariableId: "number", Detail: "string" });
    const questData = $dataQuests.find(data => data.variableId === params.VariableId);
    if (!questData) return;
    questData.detail = params.Detail;
});

PluginManager.registerCommand(QuestSystemPluginName, "ChangeRewards", args => {
    const params = PluginParamsParser.parse(args, { Rewards: [{}] });
    const questData = $dataQuests.find(data => data.variableId === params.VariableId);
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
    if (EnabledQuestMenu || Text.MenuQuestSystemText === "") this.addCommand(Text.MenuQuestSystemText, "quest", this.isEnabledQuestMenu());
};

Window_MenuCommand.prototype.isEnabledQuestMenu = function() {
    if (EnabledQuestMenuSwitchId === 0) return true;
    return $gameSwitches.value(EnabledQuestMenuSwitchId);
};

const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    if (EnabledQuestMenu) this._commandWindow.setHandler("quest", this.quest.bind(this));
};

Scene_Menu.prototype.quest = function() {
    SceneManager.push(Scene_QuestSystem);
    SceneManager.prepareNextScene(MenuCommands, MenuBackgroundImage);
};


// Define class alias.
return {
    ItemInfo: ItemInfo,
    RewardData: RewardData,
    RewardWindowDrawer: RewardWindowDrawer,
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
