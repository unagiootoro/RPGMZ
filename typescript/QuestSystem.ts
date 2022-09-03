/*:
@target MV MZ
@plugindesc Quest system v1.7.0
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

■ Page break for quest details
If the detailed description of the quest cannot be displayed on one page, the page will automatically break.
If you want to manually break the page, in the quest detailed description
<newpage>
You can display the following content on a separate page by entering .

【Use plugin commands from scripts】
The functionality of plugin commands can also be used from scripts.
The MV version does not support the plug-in command itself, so
If you want to use the function in the plugin command, you need to use this script.

■ Start of quest scene
QuestSystemAlias.QuestUtils.startQuestScene(questCommands, fileName1 = "", fileName2 = "", xOfs = 240, yOfs = 300)
    questCommands: Specify quest commands in the form ["all", "questOrder"].
    fileName1: Specify the file name of the background image. (Optional)
    fileName2: Specify the file name of the background standing image. (Optional)
    xOfs: Specifies the X coordinate of the background standing image. (Optional)
    yOfs: Specifies the Y coordinate of the background standing image. (Optional)

■ Reward acquisition
QuestSystemAlias.QuestUtils.getRewards(variableId)
    variableId: Specify the variable ID of the target quest.

■ Change of detailed description of quest
QuestSystemAlias.QuestUtils.changeDetail(variableId, detail)
    variableId: Specify the variable ID of the target quest.
    detail: Specify the detailed description after the change.

■ Change of reward
QuestSystemAlias.QuestUtils.changeRewards(variableId, rawardDatas)
    variableId: Specify the variable ID of the target quest.
    rawardDatas: Specify rewards in the following format:
                 {type: "reward type", itemId: item ID, itemCount: number of items, gold: gold, exp: experience points}
                 type: Specify one of "gold", "exp", "item", "weapon", "armor".
                 itemId: Specify the corresponding ID when the type is one of "item", "weapon", "armor".
                         For example, if you want to specify a weapon with ID5, set type to "weapon" and itemId to 5.
                 itemCount: Specifies the number of items to get when the type is "item", "weapon", or "armor".
                 gold: Specifies the gold to get if the type is "gold".
                 exp: Specifies the experience value to obtain when type is "exp".

【License】
This plugin is available under the terms of the MIT license.


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

@arg DetailNote
@type note
@text details
@desc Set the quest details to change.

@arg Detail
@type multiline_string
@text details(compatibility)
@desc (This is an older parameter but is left for compatibility.)Set the quest details to change.


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

@param EnabledQuestOrderingCountWindow
@text Whether or not to display the number of quest orders window
@type boolean
@on display
@off hidden
@default true
@desc
Specifies whether or not to display the Quest Order Quantity window.

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
@default {"CommandWindowWidth": "300", "CommandWindowHeight": "160", "DialogWindowWidth": "400", "GetRewardWindowWidth": "540" }
@desc
Set the size of various windows.

@param Text
@text Display text
@type struct<Text>
@default {"MenuQuestSystemText":"Quest confirmation","QuestOrderText":"Do you want to take this quest?","QuestOrderYesText":"Receive","QuestOrderNoText":"not accepted","QuestCancelText":"Do you want to cancel this quest?","QuestCancelYesText":"cancel","QuestCancelNoText":"do not cancel","QuestReportText":"Do you want to report this quest?","QuestReportYesText":"Report","QuestReportNoText":"do not report","NothingQuestText":"There is no corresponding quest.","GetRewardText":"Received the following items as a reward.","ReachedLimitText":"The number of quests has reached the limit.","HiddenTitleText":"??????????","AllCommandText":"All quests","QuestOrderCommandText":"Receive quest","OrderingQuestCommandText":"quest in progress","QuestCancelCommandText":"quest cancellation","QuestReportCommandText":"Report quest","ReportedQuestCommandText":"Reported quest","FailedQuestCommandText":"quest that failed","ExpiredQuestCommandText":"Expired quest","HiddenQuestCommandText":"unknown quest","NotOrderedStateText":"unordered","OrderingStateText":"in progress","ReportableStateText":"can be reported","ReportedStateText":"reported","FailedStateText":"failure","ExpiredStateText":"expired","RequesterText":"[Requester]:","RewardText":"[Reward]:","DifficultyText":"[Difficulty]:","PlaceText":"[Location]:","TimeLimitText":"[Period]:"}
@desc
Sets the text used in the game.

@param TextColor
@text Display text color
@type struct<TextColor>
@default {"NotOrderedStateColor":"#aaaaaa","OrderingStateColor":"#ffffff","ReportableStateColor":"#ffff00","ReportedStateColor":"#60ff60","FailedStateColor":"#0000ff","ExpiredStateColor":"#ff0000"}
@desc
Sets the color of the text used in the game.

@param CommandIcon
@text command icon
@type struct <CommandIcon>
@default {"AllCommandIcon": "0", "QuestOrderCommandIcon": "0", "OrderingQuestCommandIcon": "0", "QuestCancelCommandIcon": "0", "QuestReportCommandIcon": "0", "ReportedQuestCommandIcon": "0" , "FailedQuestCommandIcon": "0", "ExpiredQuestCommandIcon": "0", "HiddenQuestCommandIcon": "0"}
@desc
Specify the icon of the quest command.

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

@param MaxOrderingQuests
@text Maximum number of quests that can be ordered
@type number
@default 3
@desc
Specify the number of quests that can be ordered at one time. If it is 0, you can receive infinite orders.
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

@param DetailNote
@text Quest information
@type note
@desc
Specify the quest information.

@param HiddenDetailNote
@text Hidden information
@type note
@desc
Specifies information when the quest is hidden.

@param Detail
@text Quest information(compatibility)
@type multiline_string
@desc
(This is an older parameter but is left for compatibility.) Specify the quest information.

@param HiddenDetail
@text Hidden information(compatibility)
@type multiline_string
@desc
(This is an older parameter but is left for compatibility.) Specifies information when the quest is hidden.

@param QuestOrderCommonEventId
@text Common event ID that activates when accepting a quest
@type common_event
@default 0
@desc
Specify the common event ID that will be activated immediately after accepting the quest. If it is 0, it will not start.

@param CommonEventId
@text Common event ID that starts when the quest report is completed
@type common_event
@default 0
@desc
Specify the common event ID that will be triggered immediately after completing the quest report. If it is 0, it will not start.

@param QuestCancelCommonEventId
@text Common event ID that activates when the quest is canceled
@type common_event
@default 0
@desc
Specify the common event ID that will be triggered immediately after completing the quest report. If it is 0, it will not start.

@param Priority
@text Priority
@type number
@default 0
@desc
Specify the display priority of the quest. The higher the value, the higher the priority.
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

@param ReachedLimitText
@text Limit reached message
@type string
@default The number of quests has reached the limit.
@desc
Specify the message to be displayed when the number of quests reaches the upper limit.

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
/*~struct~CommandIcon:
@param AllCommandIcon
@text All quest display command icon
@type number
@default 0
@desc
Specify the command icon for displaying all quests.

@param QuestOrderCommandIcon
@text Quest consignment command icon
@type number
@default 0
@desc
Specify the icon of the command for accepting the quest.

@param OrderingQuestCommandIcon
@text In-progress quest command icon
@type number
@default 0
@desc
Specifies the command icon for the quest in progress.

@param QuestCancelCommandIcon
@text quest cancel command icon
@type number
@default 0
@desc
Specify the icon for the quest cancel command.

@param QuestReportCommandIcon
@text quest report command icon
@type number
@default 0
@desc
Specifies the icon for the quest report command.

@param ReportedQuestCommandIcon
@text Reported quest confirmation command icon
@type number
@default 0
@desc
Specifies the command icon for the reported quest.

@param FailedQuestCommandIcon
@text Failure quest confirmation command icon
@type number
@default 0
@desc
Specify the command icon for the failed quest.

@param ExpiredQuestCommandIcon
@text Expired quest confirmation command icon
@type number
@default 0
@desc
Specifies the command icon for expired quests.

@param HiddenQuestCommandIcon
@text Hidden quest confirmation command icon
@type number
@default 0
@desc
Specifies the icon for the hidden quest command.
*/
/*:ja
@target MV MZ
@plugindesc クエストシステム v1.7.0
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

■ クエスト詳細説明の改ページ
クエストの詳細説明が1ページに表示しきれない場合は自動的に改ページを行います。
もし手動で改ページを行いたい場合は、クエスト詳細説明で
<newpage>
と記載することで、以降の内容を別ページに表示することができます。

【スクリプトからプラグインコマンドを使用する】
プラグインコマンドの機能はスクリプトからでも使用することができます。
なお、MV版はプラグインコマンド自体が非対応ですので、
プラグインコマンドにある機能を使用したい場合はこちらのスクリプトを使用する方法で対応する必要があります。

■ クエストシーン開始
QuestSystemAlias.QuestUtils.startQuestScene(questCommands, fileName1 = "", fileName2 = "", xOfs = 240, yOfs = 300)
    questCommands: クエストコマンドを["all", "questOrder"]のような形で指定します。
    fileName1: 背景画像のファイル名を指定します。(省略可能)
    fileName2: 背景の立ち絵画像のファイル名を指定します。(省略可能)
    xOfs: 背景の立ち絵画像のX座標を指定します。(省略可能)
    yOfs: 背景の立ち絵画像のY座標を指定します。(省略可能)

■ 報酬の取得
QuestSystemAlias.QuestUtils.getRewards(variableId)
    variableId: 対象のクエストの変数IDを指定します。

■ クエストの詳細説明の変更
QuestSystemAlias.QuestUtils.changeDetail(variableId, detail)
    variableId: 対象のクエストの変数IDを指定します。
    detail: 変更後の詳細説明を指定します。

■ 報酬の変更
QuestSystemAlias.QuestUtils.changeRewards(variableId, rawardDatas)
    variableId: 対象のクエストの変数IDを指定します。
    rawardDatas: 報酬を以下の形式で指定します。
                 { type: "報酬タイプ", itemId: アイテムID, itemCount: アイテム個数, gold: ゴールド, exp: 経験値 }
                 type: "gold", "exp", "item", "weapon", "armor"のいずれかを指定します。
                 itemId: typeが"item", "weapon", "armor"のいずれかである場合に該当するIDを指定します。
                         例えばID5の武器を指定する場合、typeは"weapon"でitemIdは5に設定します。
                 itemCount: typeが"item", "weapon", "armor"のいずれかである場合に入手するアイテムの個数を指定します。
                 gold: typeが"gold"である場合に入手するゴールドを指定します。
                 exp: typeが"exp"である場合に入手する経験値を指定します。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


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

@arg DetailNote
@type note
@text 詳細
@desc 変更するクエスト詳細を設定します。

@arg Detail
@type multiline_string
@text 詳細(互換)
@desc (これは旧版のパラメータですが、互換性のために残しています。)変更するクエスト詳細を設定します。


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

@param EnabledQuestOrderingCountWindow
@text クエスト受注数ウィンドウ表示有無
@type boolean
@on 表示
@off 非表示
@default true
@desc
クエスト受注数ウィンドウの表示有無を指定します。

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
@default {"CommandWindowWidth":"300","CommandWindowHeight":"160","DialogWindowWidth":"400","GetRewardWindowWidth":"540"}
@desc
各種ウィンドウのサイズを設定します。

@param Text
@text 表示テキスト
@type struct<Text>
@default {"MenuQuestSystemText":"クエスト確認","QuestOrderText":"このクエストを受けますか？","QuestOrderYesText":"受ける","QuestOrderNoText":"受けない","QuestCancelText":"このクエストをキャンセルしますか？","QuestCancelYesText":"キャンセルする","QuestCancelNoText":"キャンセルしない","QuestReportText":"このクエストを報告しますか？","QuestReportYesText":"報告する","QuestReportNoText":"報告しない","NothingQuestText":"該当するクエストはありません。","GetRewardText":"報酬として次のアイテムを受け取りました。","ReachedLimitText":"クエスト数が上限に達しました。","HiddenTitleText":"？？？？？？","AllCommandText":"全クエスト","QuestOrderCommandText":"クエストを受ける","OrderingQuestCommandText":"進行中のクエスト","QuestCancelCommandText":"クエストのキャンセル","QuestReportCommandText":"クエストを報告する","ReportedQuestCommandText":"報告済みのクエスト","FailedQuestCommandText":"失敗したクエスト","ExpiredQuestCommandText":"期限切れのクエスト","HiddenQuestCommandText":"未知のクエスト","NotOrderedStateText":"未受注","OrderingStateText":"進行中","ReportableStateText":"報告可","ReportedStateText":"報告済み","FailedStateText":"失敗","ExpiredStateText":"期限切れ","RequesterText":"【依頼者】：","RewardText":"【報酬】：","DifficultyText":"【難易度】：","PlaceText":"【場所】：","TimeLimitText":"【期間】："}
@desc
ゲーム中で使用されるテキストを設定します。

@param TextColor
@text 表示テキスト色
@type struct<TextColor>
@default {"NotOrderedStateColor":"#ffffff","OrderingStateColor":"#ffffff","ReportableStateColor":"#ffffff","ReportedStateColor":"#ffffff","FailedStateColor":"#ffffff","ExpiredStateColor":"#ff0000"}
@desc
ゲーム中で使用されるテキストのカラーを設定します。

@param CommandIcon
@text コマンドアイコン
@type struct<CommandIcon>
@default {"AllCommandIcon":"0","QuestOrderCommandIcon":"0","OrderingQuestCommandIcon":"0","QuestCancelCommandIcon":"0","QuestReportCommandIcon":"0","ReportedQuestCommandIcon":"0","FailedQuestCommandIcon":"0","ExpiredQuestCommandIcon":"0","HiddenQuestCommandIcon":"0"}
@desc
クエストコマンドのアイコンを指定します。

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

@param MaxOrderingQuests
@text 最大受注可能クエスト数
@type number
@default 3
@desc
一度に受注可能なクエスト数を指定します。0だと無限に受注可能になります。
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

@param DetailNote
@text クエストの情報
@type note
@desc
クエストの情報を指定します。

@param HiddenDetailNote
@text 隠された情報
@type note
@desc
クエストが隠し状態のときの情報を指定します。

@param Detail
@text クエストの情報(互換)
@type multiline_string
@desc
(これは旧版のパラメータですが、互換性のために残しています。)クエストの情報を指定します。

@param HiddenDetail
@text 隠された情報(互換)
@type multiline_string
@desc
(これは旧版のパラメータですが、互換性のために残しています。)クエストが隠し状態のときの情報を指定します。

@param QuestOrderCommonEventId
@text クエスト受注時起動コモンイベントID
@type common_event
@default 0
@desc
クエスト受注直後に起動するコモンイベントIDを指定します。0だと起動しません。

@param CommonEventId
@text クエスト報告完了時起動コモンイベントID
@type common_event
@default 0
@desc
クエスト報告完了直後に起動するコモンイベントIDを指定します。0だと起動しません。

@param QuestCancelCommonEventId
@text クエストキャンセル時起動コモンイベントID
@type common_event
@default 0
@desc
クエスト報告完了直後に起動するコモンイベントIDを指定します。0だと起動しません。

@param Priority
@text プライオリティ
@type number
@default 0
@desc
クエストの表示優先度を指定します。値が大きいほど優先度は高くなります。
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

@param ReachedLimitText
@text 上限到達メッセージ
@type string
@default クエスト数が上限に達しました。
@desc
クエスト数が上限に達した時に表示するメッセージを指定します。

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

@param OrderingCountText
@text  受注数テキスト
@type string
@default 受注数：
@desc
受注数のテキストを指定します。
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
/*~struct~CommandIcon:ja
@param AllCommandIcon
@text 全クエスト表示コマンドアイコン
@type number
@default 0
@desc
全クエスト表示のコマンドのアイコンを指定します。

@param QuestOrderCommandIcon
@text クエスト受託コマンドアイコン
@type number
@default 0
@desc
クエスト受託のコマンドのアイコンを指定します。

@param OrderingQuestCommandIcon
@text 進行中クエストコマンドアイコン
@type number
@default 0
@desc
進行中クエストのコマンドのアイコンを指定します。

@param QuestCancelCommandIcon
@text クエストキャンセルコマンドアイコン
@type number
@default 0
@desc
クエストキャンセルのコマンドのアイコンを指定します。

@param QuestReportCommandIcon
@text クエスト報告コマンドアイコン
@type number
@default 0
@desc
クエスト報告のコマンドのアイコンを指定します。

@param ReportedQuestCommandIcon
@text 報告済クエスト確認コマンドアイコン
@type number
@default 0
@desc
報告済クエストのコマンドのアイコンを指定します。

@param FailedQuestCommandIcon
@text 失敗クエスト確認コマンドアイコン
@type number
@default 0
@desc
失敗クエストのコマンドのアイコンを指定します。

@param ExpiredQuestCommandIcon
@text 期限切れクエスト確認コマンドアイコン
@type number
@default 0
@desc
期限切れクエストのコマンドのアイコンを指定します。

@param HiddenQuestCommandIcon
@text 隠しクエスト確認コマンドアイコン
@type number
@default 0
@desc
隠しクエストのコマンドのアイコンを指定します。
*/

declare interface Window {
    RewardData: new (type: string, params: any) => QuestSystem.RewardData;
    ItemInfo: new (type: string, id: number) => QuestSystem.ItemInfo;
    QuestSaveData: new (variableId: number) => QuestSystem.QuestSaveData;
}

const QuestSystemPluginName = document.currentScript ? decodeURIComponent((document.currentScript as HTMLScriptElement).src.match(/^.*\/(.+)\.js$/)![1]) : "QuestSystem";

let $dataQuests: QuestSystem.QuestData[];
let $questSaveDatas: QuestSystem.QuestSaveData[];

namespace QuestSystem {
    class PluginParamsParser {
        private _predictEnable: boolean;

        static parse(params: any, typeData: any, predictEnable: boolean = true) {
            return new PluginParamsParser(predictEnable).parse(params, typeData);
        }

        constructor(predictEnable = true) {
            this._predictEnable = predictEnable;
        }

        parse(params: any, typeData: any, loopCount: number = 0): any {
            if (++loopCount > 255) throw new Error("endless loop error");
            const result: any = {};
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

        convertParam(param: any, type: any, loopCount: number): any {
            if (typeof type === "string") {
                return this.cast(param, type);
            } else if (typeof type === "object" && type instanceof Array) {
                const aryParam = JSON.parse(param);
                if (type[0] === "string") {
                    return aryParam.map((strParam: string) => this.cast(strParam, type[0]));
                } else {
                    return aryParam.map((strParam: string) => this.parse(JSON.parse(strParam), type[0]), loopCount);
                }
            } else if (typeof type === "object") {
                return this.parse(JSON.parse(param), type, loopCount);
            } else {
                throw new Error(`${type} is not string or object`);
            }
        }

        cast(param: any, type: any): any {
            switch (type) {
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

        predict(param: any): string {
            if (param.match(/^\-?\d+$/) || param.match(/^\-?\d+\.\d+$/)) {
                return "number";
            } else if (param === "true" || param === "false") {
                return "boolean";
            } else {
                return "string";
            }
        }
    }


    export class QuestUtils {
        static startQuestScene(questCommands: string[], fileName1: string = "", fileName2: string = "", xOfs: number = 240, yOfs: number = 300) {
            SceneManager.push(Scene_QuestSystem);
            const questCommandsParam = questCommands.length === 0 ? null : questCommands;
            SceneManager.prepareNextScene(questCommandsParam, { FileName1: fileName1, FileName2: fileName2, XOfs: xOfs, YOfs: yOfs });
        }

        static getRewards(variableId: number) {
            const questData = $dataQuests.find(data => data.variableId === variableId);
            if (!questData) return;
            questData.getRewards();
        }

        static changeDetail(variableId: number, detail: string) {
            const questData = $dataQuests.find(data => data.variableId === variableId);
            if (!questData) return;
            questData.detail = detail;
        }

        // rawardData: { type, itemId, itemCount, gold, exp }
        static changeRewards(variableId: number, rawardDatas: any) {
            const rewards = rawardDatas.map((rawardData: any) => {
                return RewardData.fromObject(rawardData);
            });
            this.changeRewardsByRewardObject(variableId, rewards);
        }

        static changeRewardsByRewardObject(variableId: number, rewards: RewardData[]) {
            const questData = $dataQuests.find(data => data.variableId === variableId);
            if (!questData) return;
            questData.rewards = rewards;
        }
    }


    export class ItemInfo {
        private _type: string;
        private _id: number

        constructor(type: string, id: number) {
            this._type = type;
            this._id = id;
        }

        get type() { return this._type; }
        set type(_type) { this._type = _type; }
        get id() { return this._id; }
        set id(_id) { this._id = _id; }

        itemData(): any {
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

    export class RewardData {
        protected _type: string;
        protected _params: any;

        static fromObject(rewardObject: any): RewardData {
            const { type, itemId, itemCount, gold, exp } = rewardObject;
            if (type === "gold") {
                return new RewardData("gold", { value: gold });
            } else if (type === "exp") {
                return new RewardData("exp", { value: exp });
            } else if (["item", "weapon", "armor"].includes(type)) {
                const itemInfo = new ItemInfo(type, itemId);
                return new RewardData("item", { item: itemInfo, count: itemCount });
            } else if (type === "any") {
                return new RewardData("any", { text: rewardObject.text, iconIndex: rewardObject.iconIndex });
            }
            throw new Error(`${type} is not found.`);
        }

        static fromParam(rewardParam: any): RewardData {
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
            throw new Error(`${rewardParam.Type} is not found.`);
        }

        constructor(type: string, params: any) {
            this._type = type;
            this._params = params;
        }

        get type() { return this._type; }
        get params() { return this._params };

        getReward(): void {
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

    export class TextDrawer {
        protected _window: Window_Base;

        constructor(window: Window_Base) {
            this._window = window;
        }

        drawIconText(text: string, iconIndex: number, x: number, y: number, width: number): number {
            return this.drawIconTextByMode(text, iconIndex, x, y, width, "normal");
        }

        drawIconTextWrap(text: string, iconIndex: number, x: number, y: number, width: number): number {
            return this.drawIconTextByMode(text, iconIndex, x, y, width, "ex");
        }

        drawTextExWrap(text: string, x: number, y: number, width: number): number {
            this._window.resetFontSettings();
            const textState = this._window.createTextState(text, x, y, width);
            const textArray = textState.text.split("");
            const outTextArray = [];
            let begin = 0;
            let turnPoint = 0;
            for (let i = 0; i < textArray.length; i++) {
                outTextArray.push(textArray[i]);
                const end = begin + turnPoint + 2; // +2 is length and next char.
                if (textArray[i] === "\n") {
                    begin += turnPoint;
                    turnPoint = 1;
                } else if (this.isTextTurn(textArray, begin, end, width)) {
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

        isTextTurn(array: string[], begin: number, end: number, width: number): boolean {
            const text = array.slice(begin, end).join("");
            if (this._window.textWidth(text) >= width) return true;
            return false;
        }

        drawIconTextByMode(text: string, iconIndex: number, x: number, y: number, width: number, mode: string): number {
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
            } else {
                throw new Error(`mode(${mode}) is invalid.`);
            }
        }
    }

    export class RewardWindowDrawer {
        protected _window: Window_Base;
        protected _reward: RewardData;
        protected _textDrawer: TextDrawer;

        constructor(window: Window_Base, reward: RewardData) {
            this._window = window;
            this._reward = reward;
            this._textDrawer = new TextDrawer(window);
        }

        drawRewardToWindow(x: number, y: number, width: number): void {
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

    export class QuestData {
        protected _variableId: number;
        protected _title: string;
        protected _iconIndex: number;
        protected _requester: string;
        protected _rewards: RewardData[];
        protected _difficulty: string;
        protected _place: string;
        protected _timeLimit: string;
        protected _detail: string;
        protected _hiddenDetail: string;
        protected _questOrderCommonEventId: number;
        protected _questReportCommonEventId: number;
        protected _questCancelCommonEventId: number;
        protected _priority: number;

        static fromParam(questDataParam: any) {
            const variableId = questDataParam.VariableId;
            const title = questDataParam.Title;
            const iconIndex = questDataParam.IconIndex;
            const requester = questDataParam.Requester;
            const rewards = questDataParam.Rewards.map((rewardParam: any) => {
                return RewardData.fromParam(rewardParam);
            });
            const difficulty = questDataParam.Difficulty;
            const place = questDataParam.Place;
            const timeLimit = questDataParam.TimeLimit;
            let detail;
            if (questDataParam.DetailNote == null || questDataParam.DetailNote === "") {
                detail = questDataParam.Detail;
            } else {
                detail = JSON.parse(questDataParam.DetailNote);
            }
            let hiddenDetail;
            if (questDataParam.HiddenDetailNote == null || questDataParam.HiddenDetailNote === "") {
                hiddenDetail = questDataParam.HiddenDetail;
            } else {
                hiddenDetail = JSON.parse(questDataParam.HiddenDetailNote);
            }
            const questOrderCommonEventId = questDataParam.QuestOrderCommonEventId;
            const questReportCommonEventId = questDataParam.CommonEventId;
            const questCancelCommonEventId = questDataParam.QuestCancelCommonEventId;
            const priority = questDataParam.Priority;

            return new QuestData(
                variableId,
                title,
                iconIndex,
                requester,
                rewards,
                difficulty,
                place,
                timeLimit,
                detail,
                hiddenDetail,
                questOrderCommonEventId,
                questReportCommonEventId,
                questCancelCommonEventId,
                priority
            );
        }

        constructor(
            variableId: number,
            title: string,
            iconIndex: number,
            requester: string,
            rewards: RewardData[],
            difficulty: string,
            place: string,
            timeLimit: string,
            detail: string,
            hiddenDetail: string,
            questOrderCommonEventId: number,
            questReportCommonEventId: number,
            questCancelCommonEventId: number,
            priority: number
        ) {
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
            this._questOrderCommonEventId = questOrderCommonEventId;
            this._questReportCommonEventId = questReportCommonEventId;
            this._questCancelCommonEventId = questCancelCommonEventId;
            this._priority = (priority != null ? priority : 0);
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
        get questOrderCommonEventId() { return this._questOrderCommonEventId; }
        get questReportCommonEventId() { return this._questReportCommonEventId; }
        get questCancelCommonEventId() { return this._questCancelCommonEventId; }
        get priority() { return this._priority; }

        set rewards(_rewards) {
            this._rewards = _rewards;
            const saveData = this.findSaveData();
            saveData!.setRewards(_rewards);
        }

        set detail(_detail) {
            this._detail = _detail;
            const saveData = this.findSaveData();
            saveData!.setDetail(_detail);
        }

        state(): string {
            const data = STATE_LIST.find(data => data.value === $gameVariables.value(this._variableId));
            return data ? data.state : "none";
        }

        setState(state: string): void {
            const data = STATE_LIST.find(data => data.state === state);
            if (data) $gameVariables.setValue(this._variableId, data.value);
        }

        stateText(): string {
            const data = STATE_LIST.find(data => data.state === this.state());
            return data!.text;
        }

        stateTextColor(): string | null {
            const data = STATE_LIST.find(data => data.state === this.state());
            return data!.color;
        }

        getRewards(): void {
            for (const reward of this.rewards) {
                reward.getReward();
            }
        }

        findSaveData(): QuestSaveData | undefined {
            return $questSaveDatas.find(svdata => svdata.variableId() === this._variableId);
        }

        loadSaveData(): void {
            const saveData = this.findSaveData();
            if (!saveData) return;
            const svRewards = saveData.rewards();
            const svDetail = saveData.detail();
            if (svRewards) this._rewards = svRewards;
            if (svDetail) this._detail = svDetail;
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
        CommandIcon: {},
    };


    export class QuestSaveData {
        protected _variableId: number;
        protected _detail: string | null;
        protected _rewards: RewardData[] | null;

        constructor(variableId: number) {
            this._variableId = variableId;
            this._detail = null;
            this._rewards = null;
        }

        variableId(): number {
            return this._variableId;
        }

        rewards(): RewardData[] | null {
            return this._rewards;
        }

        detail(): string | null {
            return this._detail;
        }

        setDetail(detail: string): void {
            this._detail = detail;
        }

        setRewards(rewards: RewardData[]): void {
            this._rewards = rewards;
        }
    }


    export class QuestState {
        protected _state: string;
        protected _value: number;
        protected _text: string;
        protected _color: string | null;

        get state() { return this._state; }
        get value() { return this._value; }
        get text() { return this._text; }
        get color() { return this._color; }

        constructor(state: string, value: number, text: string, color: string | null = null) {
            this._state = state;
            this._value = value;
            this._text = text;
            this._color = color;
        }
    }


    export class QuestCommand {
        protected _state: string[] | null;
        protected _text: string;
        protected _iconIndex: number;

        get state() { return this._state; }
        get text() { return this._text; }
        get iconIndex() { return this._iconIndex; }

        constructor(state: string[] | null, text: string, iconIndex: number) {
            this._state = state;
            this._text = text;
            this._iconIndex = iconIndex;
        }
    }


    const params = PluginParamsParser.parse(PluginManager.parameters(QuestSystemPluginName), typeDefine);

    $dataQuests = params.QuestDatas.map((questDataParam: any) => {
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
    const EnabledQuestOrderingCountWindow = params.EnabledQuestOrderingCountWindow;
    const GoldIcon = params.GoldIcon;
    const ExpIcon = params.ExpIcon;
    const QuestTitleWrap = params.QuestTitleWrap;
    const MaxOrderingQuests = params.MaxOrderingQuests;

    const QuestOrderSe = params.QuestOrderSe;
    const QuestReportMe = params.QuestReportMe;
    const MenuBackgroundImage = params.MenuBackgroundImage;
    const WindowSize = params.WindowSize;
    const Text = params.Text;
    const TextColor = params.TextColor;
    const CommandIcon = params.CommandIcon;

    const STATE_LIST = [
        new QuestState("none", 0, ""),
        new QuestState("notOrdered", 1, Text.NotOrderedStateText, TextColor.NotOrderedStateColor),
        new QuestState("ordering", 2, Text.OrderingStateText, TextColor.OrderingStateColor),
        new QuestState("reportable", 3, Text.ReportableStateText, TextColor.ReportableStateColor),
        new QuestState("reported", 4, Text.ReportedStateText, TextColor.ReportedStateColor),
        new QuestState("failed", 5, Text.FailedStateText, TextColor.FailedStateColor),
        new QuestState("expired", 6, Text.ExpiredStateText, TextColor.ExpiredStateColor),
        new QuestState("hidden", 7, "", "#ffffff"),
    ];

    const COMMAND_TABLE: any = {
        "all": new QuestCommand(null, Text.AllCommandText, CommandIcon.AllCommandIcon),
        "questOrder": new QuestCommand(["notOrdered"], Text.QuestOrderCommandText, CommandIcon.AllCommandIcon),
        "orderingQuest": new QuestCommand(["ordering", "reportable"], Text.OrderingQuestCommandText, CommandIcon.OrderingQuestCommandIcon),
        "questCancel": new QuestCommand(["ordering"], Text.QuestCancelCommandText, CommandIcon.QuestCancelCommandIcon),
        "questReport": new QuestCommand(["reportable"], Text.QuestReportCommandText, CommandIcon.QuestReportCommandIcon),
        "reportedQuest": new QuestCommand(["reported"], Text.ReportedQuestCommandText, CommandIcon.ReportedQuestCommandIcon),
        "failedQuest": new QuestCommand(["failed"], Text.FailedQuestCommandText, CommandIcon.FailedQuestCommandIcon),
        "expiredQuest": new QuestCommand(["expired"], Text.ExpiredQuestCommandText, CommandIcon.ExpiredQuestCommandIcon),
        "hiddenQuest": new QuestCommand(["hidden"], Text.HiddenQuestCommandText, CommandIcon.HiddenQuestCommandIcon),
    };


    // MV compatible
    if (Utils.RPGMAKER_NAME === "MV") {
        ImageManager.iconWidth = 32;
        ImageManager.iconHeight = 32;
        ImageManager.faceWidth = 144;
        ImageManager.faceHeight = 144;

        Window_Base.prototype.drawRect = function(x, y, width, height) {
            const outlineColor = this.contents.outlineColor;
            const mainColor = this.contents.textColor;
            this.contents.fillRect(x, y, width, height, outlineColor);
            this.contents.fillRect(x + 1, y + 1, width - 2, height - 2, mainColor);
        };

        Window_Base.prototype.itemPadding = function() {
            return 8;
        };

        Window_Selectable.prototype.itemRectWithPadding = function(index) {
            const rect = this.itemRect(index);
            const padding = this.itemPadding();
            rect.x += padding;
            rect.width -= padding * 2;
            return rect;
        };

        Window_Selectable.prototype.itemLineRect = function(index) {
            const rect = this.itemRectWithPadding(index);
            const padding = (rect.height - this.lineHeight()) / 2;
            rect.y += padding;
            rect.height -= padding * 2;
            return rect;
        };

        Window_Base.prototype.createTextState = function(text, x, y, width) {
            const textState: any = { index: 0, x: x, y: y, left: x };
            textState.text = this.convertEscapeCharacters(text);
            // @ts-ignore // MV Compatible
            textState.height = this.calcTextHeight(textState, false);
            return textState;
        };

        Window_Base.prototype.processAllText = function(textState) {
            while (textState.index < textState.text.length) {
                this.processCharacter(textState);
            }
            return textState;
        };

        Object.defineProperty(Window.prototype, "innerWidth", {
            get: function() {
                return Math.max(0, this._width - this._padding * 2);
            },
            configurable: true
        });

        Object.defineProperty(Window.prototype, "innerHeight", {
            get: function() {
                return Math.max(0, this._height - this._padding * 2);
            },
            configurable: true
        });

        Scene_Base.prototype.calcWindowHeight = function(numLines, selectable) {
            if (selectable) {
                return Window_Selectable.prototype.fittingHeight(numLines);
            } else {
                return Window_Base.prototype.fittingHeight(numLines);
            }
        };
    }

    export class Window_Selectable_MZMV extends Window_Selectable {
        initialize(rect: Rectangle): void {
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            } else {
                // @ts-ignore // MV Compatible
                super.initialize(rect.x, rect.y, rect.width, rect.height);
            }
        }
    }

    export class Window_Command_MZMV extends Window_Command {
        initialize(rect: Rectangle): void {
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            } else {
                // @ts-ignore // MV Compatible
                this._windowRect = rect;
                // @ts-ignore // MV Compatible
                super.initialize(rect.x, rect.y);
            }
        }

        windowWidth(): number {
            // @ts-ignore // MV Compatible
            return this._windowRect.width;
        }

        windowHeight(): number {
            // @ts-ignore // MV Compatible
            return this._windowRect.height;
        }
    }

    let superScene_Message: any;
    if (Utils.RPGMAKER_NAME === "MZ") {
        superScene_Message = Scene_Message;
    } else {
        function Scene_Message_MV(this: any) {
            this.initialize(...arguments);
        }

        Scene_Message_MV.prototype = Object.create(Scene_Base.prototype);
        Scene_Message_MV.prototype.constructor = Scene_Message_MV;

        Scene_Message_MV.prototype.initialize = function() {
            Scene_Base.prototype.initialize.call(this);
        };

        Scene_Message_MV.prototype.isMessageWindowClosing = function() {
            return this._messageWindow.isClosing();
        };

        Scene_Message_MV.prototype.createAllWindows = function() {
            this.createMessageWindow();
        };

        Scene_Message_MV.prototype.createMessageWindow = function() {
            const rect = this.messageWindowRect();
            this._messageWindow = new Window_Message(rect);
            this.addWindow(this._messageWindow);
        };

        Scene_Message_MV.prototype.messageWindowRect = function() {
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(4, false) + 8;
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = 0;
            return new Rectangle(wx, wy, ww, wh);
        };

        superScene_Message = Scene_Message_MV;
    }

    export class Scene_QuestSystem extends (superScene_Message as new () => Scene_Message) {
        protected _commandList!: string[];
        protected _backgroundImage!: any;
        protected _interpreter!: Game_Interpreter;
        protected _eventState!: string;
        protected _cancelButton!: Sprite_Button;
        protected _backgroundSprite!: Sprite;
        protected _backgroundFilter!: any;
        protected _questCommandWindow!: Window_QuestCommand;
        protected _questDetailWindow!: Window_QuestDetail;
        protected _questListWindow!: Window_QuestList;
        protected _questOrderCountWindow!: Window_QuestOrderCount;
        protected _questOrderWindow!: Window_QuestOrder;
        protected _questOrderFailedWindow!: Window_QuestOrderFailed;
        protected _questReportWindow!: Window_QuestReport;
        protected _questGetRewardWindow!: Window_QuestGetReward;
        protected _questCancelWindow!: Window_QuestCancel;

        prepare(commandList: string[], backgroundImage: any): void {
            this._commandList = commandList;
            this._backgroundImage = backgroundImage;
        }

        create(): void {
            super.create();
            this.createBackground();
            this.createWindowLayer();
            this.createAllWindow();
            this.createButtons();
            this._interpreter = new Game_Interpreter();
            this._eventState = "none";
        }

        // Ported from Scene_MenuBase
        createButtons(): void {
            if (ConfigManager.touchUI) {
                if (this.needsCancelButton()) {
                    this.createCancelButton();
                }
            }
        }

        // Ported from Scene_MenuBase
        needsCancelButton(): boolean {
            return true;
        }

        // Ported from Scene_MenuBase
        createCancelButton(): void {
            this._cancelButton = new Sprite_Button("cancel");
            this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
            this._cancelButton.y = this.buttonY();
            this.addWindow(this._cancelButton);
        }

        // Ported from Scene_MenuBase
        setBackgroundOpacity(opacity: number): void {
            this._backgroundSprite.opacity = opacity;
        }

        createBackground(): void {
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

        createAllWindow(): void {
            this.createQuestCommandWindow();
            this.createQuestListWindow();
            this.createQuestOrderCountWindow();
            this.createQuestDetailWindow();
            this.createQuestOrderWindow();
            this.createQuestOrderFailedWindow();
            this.createQuestReportWindow();
            this.createQuestGetRewardWindow();
            this.createQuestCancelWindow();
            super.createAllWindows();
        }

        start(): void {
            super.start();
            this._questCommandWindow.activate();
            this._questCommandWindow.select(0);
            this._questDetailWindow.setDrawState("undraw");
            this._questCommandWindow.refresh();
            this.resetQuestList();
        }

        update(): void {
            super.update();
            this.updateEvent();
        }

        updateEvent(): void {
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

        createQuestCommandWindow(): void {
            this._questCommandWindow = new Window_QuestCommand(this.questCommandWindowRect());
            this._questCommandWindow.setCommandList(this._commandList);
            this._questCommandWindow.setHandler("ok", this.onQuestCommandOk.bind(this));
            this._questCommandWindow.setHandler("cancel", this.onQuestCommandCancel.bind(this));
            this._questCommandWindow.setHandler("select", this.onQuestCommandSelect.bind(this));
            this.addWindow(this._questCommandWindow);
        }

        createQuestListWindow(): void {
            this._questListWindow = new Window_QuestList(this.questListWindowRect());
            this._questListWindow.setHandler("ok", this.onQuestListOk.bind(this));
            this._questListWindow.setHandler("cancel", this.onQuestListCancel.bind(this));
            this._questListWindow.setHandler("select", this.onQuestListSelect.bind(this));
            this.addWindow(this._questListWindow);
        }

        createQuestOrderCountWindow(): void {
            this._questOrderCountWindow = new Window_QuestOrderCount(this.questOrderCountWindowRect());
            if (EnabledQuestOrderingCountWindow) {
                this._questOrderCountWindow.setNumOrderingQuests(this.numOrderingQuests());
                this.addWindow(this._questOrderCountWindow);
            }
        }

        createQuestDetailWindow(): void {
            this._questDetailWindow = new Window_QuestDetail(this.questDetailWindowRect());
            this._questDetailWindow.activate();
            this.addWindow(this._questDetailWindow);
        }

        createQuestOrderWindow(): void {
            this._questOrderWindow = new Window_QuestOrder(this.questOrderWindowRect());
            this._questOrderWindow.setHandler("yes", this.onQuestOrderOk.bind(this));
            this._questOrderWindow.setHandler("no", this.onQuestOrderCancel.bind(this));
            this._questOrderWindow.setHandler("cancel", this.onQuestOrderCancel.bind(this));
            this.addWindow(this._questOrderWindow);
        }

        createQuestOrderFailedWindow(): void {
            this._questOrderFailedWindow = new Window_QuestOrderFailed(this.questOrderFailedWindowRect());
            this._questOrderFailedWindow.setHandler("ok", this.onQuestOrderFailedOk.bind(this));
            this._questOrderFailedWindow.refresh();
            this.addWindow(this._questOrderFailedWindow);
        }

        createQuestReportWindow(): void {
            this._questReportWindow = new Window_QuestReport(this.questReportWindowRect());
            this._questReportWindow.setHandler("yes", this.onQuestReportOk.bind(this));
            this._questReportWindow.setHandler("no", this.onQuestReportCancel.bind(this));
            this._questReportWindow.setHandler("cancel", this.onQuestReportCancel.bind(this));
            this.addWindow(this._questReportWindow);
        }

        createQuestGetRewardWindow(): void {
            this._questGetRewardWindow = new Window_QuestGetReward(this.questGetRewardWindowRect());
            this._questGetRewardWindow.setHandler("ok", this.onQuestGetRewardOk.bind(this));
            this.addWindow(this._questGetRewardWindow);
        }

        createQuestCancelWindow(): void {
            this._questCancelWindow = new Window_QuestCancel(this.questCancelWindowRect());
            this._questCancelWindow.setHandler("yes", this.onQuestCancelOk.bind(this));
            this._questCancelWindow.setHandler("no", this.onQuestCancelCancel.bind(this));
            this._questCancelWindow.setHandler("cancel", this.onQuestCancelCancel.bind(this));
            this.addWindow(this._questCancelWindow);
        }

        // MV compatible
        isBottomButtonMode(): boolean {
            if (Utils.RPGMAKER_NAME === "MZ") return super.isBottomButtonMode();
            return false;
        }

        buttonAreaHeight(): number {
            if (Utils.RPGMAKER_NAME === "MZ") return super.buttonAreaHeight();
            return 0;
        }

        // Window rectangle
        questCommandWindowRect(): Rectangle {
            const x = 0;
            let y = 0;
            if (!this.isBottomButtonMode()) y += this.buttonAreaHeight();
            const w = WindowSize.CommandWindowWidth;
            const h = WindowSize.CommandWindowHeight;
            return new Rectangle(x, y, w, h);
        }

        questListWindowRect(): Rectangle {
            const questCommandWindowRect = this.questCommandWindowRect();
            const x = 0;
            const y = questCommandWindowRect.y + questCommandWindowRect.height;
            const w = WindowSize.CommandWindowWidth;
            const bottom = (this.isBottomButtonMode() ? Graphics.boxHeight - this.buttonAreaHeight() : Graphics.boxHeight);
            let h = bottom - y;
            if (EnabledQuestOrderingCountWindow) {
                h -= this.calcWindowHeight(1, true);
            }
            return new Rectangle(x, y, w, h);
        }

        questOrderCountWindowRect(): Rectangle {
            if (EnabledQuestOrderingCountWindow) {
                const questListWindowRect = this.questListWindowRect();
                const x = 0;
                const y = questListWindowRect.y + questListWindowRect.height;
                const w = WindowSize.CommandWindowWidth;
                const h = this.calcWindowHeight(1, true);
                return new Rectangle(x, y, w, h);
            }
            return new Rectangle(0, 0, 0, 0);
        }

        questDetailWindowRect(): Rectangle {
            const questCommandWindowRect = this.questCommandWindowRect();
            const questListWindowRect = this.questListWindowRect();
            const questOrderCountWindowRect = this.questOrderCountWindowRect();
            const x = questListWindowRect.x + questListWindowRect.width;
            const y = questCommandWindowRect.y;
            const w = Graphics.boxWidth - x;
            const h = questCommandWindowRect.height + questListWindowRect.height + questOrderCountWindowRect.height;
            return new Rectangle(x, y, w, h);
        }

        questOrderWindowRect(): Rectangle {
            const w = WindowSize.DialogWindowWidth;
            const h = (Utils.RPGMAKER_NAME === "MZ" ? 160 : 150);
            const x = Graphics.boxWidth / 2 - w / 2;
            const y = Graphics.boxHeight / 2 - h / 2;
            return new Rectangle(x, y, w, h);
        }

        questOrderFailedWindowRect(): Rectangle {
            const w = WindowSize.DialogWindowWidth;
            const h = 70;
            const x = Graphics.boxWidth / 2 - w / 2;
            const y = Graphics.boxHeight / 2 - h / 2;
            return new Rectangle(x, y, w, h);
        }

        questReportWindowRect(): Rectangle {
            return this.questOrderWindowRect();
        }

        questGetRewardWindowRect(): Rectangle {
            const x = 0;
            const y = 0;
            const w = WindowSize.GetRewardWindowWidth;
            const h = Graphics.boxHeight;
            return new Rectangle(x, y, w, h);
        }

        questCancelWindowRect(): Rectangle {
            return this.questOrderWindowRect();
        }

        // Define window handlers
        onQuestCommandOk(): void {
            this.change_QuestCommandWindow_To_QuestListWindow();
            this.onQuestListSelect();
        }

        onQuestCommandCancel(): void {
            this.popScene();
        }

        onQuestCommandSelect(): void {
            this.resetQuestList();
        }

        onQuestListOk(): void {
            switch (this._questCommandWindow.currentSymbol()) {
                case "questOrder":
                    if (MaxOrderingQuests === 0 || this.numOrderingQuests() < MaxOrderingQuests) {
                        this.change_QuestListWindow_To_QuestOrderWindow();
                        SoundManager.playOk();
                    } else {
                        this.change_QuestListWindow_To_QuestOrderFailedWindow();
                        SoundManager.playBuzzer();
                    }
                    break;
                case "questCancel":
                    this.change_QuestListWindow_To_QuestCancelWindow();
                    SoundManager.playOk();
                    break;
                case "questReport":
                    this.change_QuestListWindow_To_QuestReportWindow();
                    SoundManager.playOk();
                    break;
                default:
                    this._questListWindow.activate();
                    break;
            }
        }

        onQuestListCancel(): void {
            this.change_QuestListWindow_To_QuestCommandWindow();
        }

        onQuestListSelect(): void {
            if (this._questListWindow.currentSymbol()) {
                this._questDetailWindow.setQuestData(this._questListWindow.questData());
            } else {
                this._questDetailWindow.setQuestData(null);
            }
            this._questDetailWindow.setDrawState("draw");
            this._questDetailWindow.refresh();
        }

        onQuestOrderOk(): void {
            const questData = this._questListWindow.questData();
            questData.setState("ordering");
            this.change_QuestOrderWindow_To_QuestListWindow();
            this.resetQuestList();
            this._questListWindow.select(0);
            this._questDetailWindow.refresh();
            this._questOrderCountWindow.setNumOrderingQuests(this.numOrderingQuests());
            this._eventState = "start";
            this.startCommonEvent(questData.questOrderCommonEventId);
        }

        onQuestOrderFailedOk(): void {
            this.change_QuestOrderFailedWindow_To_QuestListWindow();
        }

        onQuestOrderCancel(): void {
            this.change_QuestOrderWindow_To_QuestListWindow();
        }

        onQuestReportOk(): void {
            const questData = this._questListWindow.questData();
            questData.setState("reported");
            this._questDetailWindow.refresh();
            this.change_QuestReportWindow_To_QuestGetRewardWindow();
            this._questGetRewardWindow.setQuestData(questData);
            this._questGetRewardWindow.refresh();
            this._questOrderCountWindow.setNumOrderingQuests(this.numOrderingQuests());
        }

        onQuestReportCancel(): void {
            this.change_QuestReportWindow_To_QuestListWindow();
        }

        onQuestGetRewardOk(): void {
            const questData = this._questListWindow.questData();
            questData.getRewards();
            this.change_QuestGetRewardWindow_To_QuestListWindow();
            this._eventState = "start";
            this.startCommonEvent(questData.questReportCommonEventId);
        }

        onQuestCancelOk(): void {
            const questData = this._questListWindow.questData();
            questData.setState("notOrdered");
            this.change_QuestCancelWindow_To_QuestListWindow();
            this.resetQuestList();
            this._questListWindow.select(0);
            this._questDetailWindow.refresh();
            this._questOrderCountWindow.setNumOrderingQuests(this.numOrderingQuests());
            this._eventState = "start";
            this.startCommonEvent(questData.questCancelCommonEventId);
        }

        onQuestCancelCancel(): void {
            this.change_QuestCancelWindow_To_QuestListWindow();
        }

        // Change window
        change_QuestCommandWindow_To_QuestListWindow(): void {
            this._questCommandWindow.deactivate();
            this._questListWindow.show();
            this._questListWindow.activate();
            this._questListWindow.select(0);
        }

        change_QuestListWindow_To_QuestCommandWindow(): void {
            this._questDetailWindow.setQuestData(null);
            this._questDetailWindow.setDrawState("undraw");
            this._questDetailWindow.refresh();
            this._questListWindow.deactivate();
            this._questListWindow.select(-1);
            this._questCommandWindow.activate();
        }

        change_QuestListWindow_To_QuestOrderWindow(): void {
            this._questListWindow.deactivate();
            this._questOrderWindow.show();
            this._questOrderWindow.open();
            this._questOrderWindow.activate();
            this._questOrderWindow.select(0);
        }

        change_QuestListWindow_To_QuestOrderFailedWindow(): void {
            this._questListWindow.deactivate();
            this._questOrderFailedWindow.show();
            this._questOrderFailedWindow.open();
            this._questOrderFailedWindow.activate();
        }

        change_QuestListWindow_To_QuestReportWindow(): void {
            this._questListWindow.deactivate();
            this._questReportWindow.show();
            this._questReportWindow.open();
            this._questReportWindow.activate();
            this._questReportWindow.select(0);
        }

        change_QuestOrderWindow_To_QuestListWindow(): void {
            this._questOrderWindow.close();
            this._questOrderWindow.deactivate();
            this._questOrderWindow.select(-1);
            this._questListWindow.activate();
        }

        change_QuestOrderFailedWindow_To_QuestListWindow(): void {
            this._questOrderFailedWindow.close();
            this._questOrderFailedWindow.deactivate();
            this._questListWindow.activate();
        }

        change_QuestReportWindow_To_QuestListWindow(): void {
            this._questReportWindow.close();
            this._questReportWindow.deactivate();
            this._questReportWindow.select(-1);
            this._questListWindow.activate();
        }

        change_QuestReportWindow_To_QuestGetRewardWindow(): void {
            this._questReportWindow.close();
            this._questReportWindow.deactivate();
            this._questReportWindow.select(-1);
            this._questGetRewardWindow.show();
            this._questGetRewardWindow.open();
            this._questGetRewardWindow.activate();
        }

        change_QuestGetRewardWindow_To_QuestListWindow(): void {
            this._questGetRewardWindow.close();
            this._questGetRewardWindow.deactivate();
            this._questListWindow.activate();
        }

        change_QuestListWindow_To_QuestCancelWindow(): void {
            this._questListWindow.deactivate();
            this._questCancelWindow.show();
            this._questCancelWindow.open();
            this._questCancelWindow.activate();
            this._questCancelWindow.select(-1);
        }

        change_QuestCancelWindow_To_QuestListWindow(): void {
            this._questCancelWindow.close();
            this._questCancelWindow.deactivate();
            this._questCancelWindow.select(-1);
            this._questListWindow.activate();
        }

        // Reset quest list window.
        resetQuestList(): void {
            const questList = this._questCommandWindow.filterQuestList();
            questList.sort((a, b) => b.priority - a.priority);
            this._questListWindow.resetQuestList(questList);
        }

        // Start common event.
        startCommonEvent(commonEventId: number): void {
            // If commonEventId is undefined, do not start common event.;
            if (!commonEventId || commonEventId === 0) return;
            const commonEventData = $dataCommonEvents[commonEventId];
            this._interpreter.setup(commonEventData.list);
        }

        // Return ordering quest count.
        numOrderingQuests(): number {
            const orderingQuestCommand = COMMAND_TABLE["orderingQuest"];
            const orderingQuests = $dataQuests.filter(quest => orderingQuestCommand.state.includes(quest.state()));
            return orderingQuests.length;
        }
    }

    export class Window_QuestCommand extends Window_Command_MZMV {
        protected _commandList!: string[];

        initialize(rect: Rectangle): void {
            this._commandList = [];
            super.initialize(rect);
            this.deactivate();
            this.select(-1);
        }

        setCommandList(commandList: string[]): void {
            this._commandList = commandList;
            this.refresh();
        }

        select(index: number): void {
            super.select(index);
            if (this.active && index >= 0) this.callHandler("select");
        }

        makeCommandList(): void {
            for (const command of this._commandList) {
                const commandData = COMMAND_TABLE[command];
                if (commandData) {
                    this.addCommand(commandData.text, command, true, null, commandData.iconIndex);
                } else {
                    throw new Error(`Unknow quest command ${command}`);
                }
            }
        }

        filterQuestList(): QuestData[] {
            if (this.currentSymbol() === "all") return $dataQuests.filter(data => data.state() !== "none");
            const commandData = COMMAND_TABLE[this.currentSymbol()];
            return $dataQuests.filter(quest => commandData.state.includes(quest.state()));
        }

        addCommand(name: any, symbol: string, enabled = true, ext = null, iconIndex = 0): void {
            this._list.push({ name, symbol, enabled, ext, iconIndex });
        }

        commandIconIndex(index: number): number {
            return this._list[index].iconIndex;
        }

        drawItem(index: any): void {
            const rect = this.itemLineRect(index);
            const align = this.itemTextAlign();
            this.resetTextColor();
            this.changePaintOpacity(this.isCommandEnabled(index));
            const iconIndex = this.commandIconIndex(index);
            if (iconIndex != null && iconIndex > 0) {
                const textMargin = ImageManager.iconWidth + 4;
                this.drawIcon(iconIndex, rect.x, rect.y);
                this.drawText(this.commandName(index), rect.x + textMargin, rect.y, rect.width - textMargin, "left");
            } else {
                this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
            }
        }
    }

    export class Window_QuestList extends Window_Command_MZMV {
        protected _questList!: QuestData[];

        initialize(rect: Rectangle): void {
            this._questList = [];
            super.initialize(rect);
            this.deactivate();
            this.select(-1);
        }

        select(index: number): void {
            super.select(index);
            if (this.active && index >= 0) this.callHandler("select");
        }

        resetQuestList(questList: QuestData[]): void {
            this.clearCommandList();
            this._questList = questList;
            this.refresh();
        }

        questData(): QuestData {
            return this._questList[this.index()];
        }

        makeCommandList(): void {
            for (let i = 0; i < this._questList.length; i++) {
                const questData = this._questList[i];
                const title = (questData.state() === "hidden" ? Text.HiddenTitleText : questData.title);
                this.addCommand(title, `quest${i}`);
            }
        }

        drawItem(index: number): void {
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

        // Play OK sound on the scene side.
        playOkSound(): void {
        }
    }

    export class Window_QuestOrderCount extends Window_Selectable_MZMV {
        protected _numOrderingQuests!: number;

        initialize(rect: Rectangle): void {
            super.initialize(rect);
            this._numOrderingQuests = 0;
            this.deactivate();
        }

        setNumOrderingQuests(numOrderingQuests: number): void {
            this._numOrderingQuests = numOrderingQuests;
            this.refresh();
        }

        drawAllItems(): void {
            const rect = this.itemLineRect(0);
            this.drawText(Text.OrderingCountText, rect.x, rect.y, rect.width);
            this.drawText(`${this._numOrderingQuests}/${MaxOrderingQuests}`, rect.x, rect.y, rect.width, "right");
        }
    }

    export class PageSplitter {
        protected _text: string;
        protected _height: number;
        protected _lineHeight: number;

        constructor(text: string, height: number, lineHeight: number) {
            this._text = text;
            this._height = height;
            this._lineHeight = lineHeight;
        }

        doSplit(): string[] {
            const pages = [];
            const maxPageLines = Math.floor(this._height / this._lineHeight);

            for (const page of this._text.split("<newpage>\n")) {
                const lines = page.split("\n");
                if (lines.length >= maxPageLines) {
                    for (let i = 0; i < lines.length; i += maxPageLines) {
                        const buf = [];
                        for (let j = 0; j < maxPageLines; j++) {
                            buf.push(lines[i + j]);
                        }
                        pages.push(buf.join("\n"));
                    }
                } else {
                    pages.push(page);
                }
            }

            return pages;
        }
    }

    export class Window_QuestDetail extends Window_Selectable_MZMV {
        protected _questData!: QuestData | null;
        protected _drawState!: string;
        protected _page!: number;
        protected _maxPage!: number;
        protected _drawDetailPrepared!: boolean;
        protected _detailPages!: string[];
        protected _detailStartYPos!: number;
        protected leftArrowVisible!: boolean;
        protected rightArrowVisible!: boolean;
        protected _leftArrowSprite!: Sprite;
        protected _rightArrowSprite!: Sprite;

        initialize(rect: Rectangle): void {
            super.initialize(rect);
            this._questData = null;
            this._drawState = "undraw";
            this._page = 1;
            this._maxPage = 1;
            this._drawDetailPrepared = false;
            this._detailPages = [];
            this._detailStartYPos = 0; // Arrow spriteの表示のためにクエスト詳細の表示Y座標を保持する。
            this.leftArrowVisible = false;
            this.rightArrowVisible = false;
            this.deactivate();
        }

        // MV Compatible
        _createAllParts(): void {
            super._createAllParts();
            if (Utils.RPGMAKER_NAME === "MV") {
                this._createArrowSprites();
            }
        }

        _createArrowSprites(): void {
            this._leftArrowSprite = new Sprite();
            this.addChild(this._leftArrowSprite);
            this._rightArrowSprite = new Sprite();
            this.addChild(this._rightArrowSprite);
        }

        _refreshArrows(): void {
            const w = this._width;
            const h = this._height;
            const p = 24;
            const q = p / 2;
            const sx = 96 + p;
            const sy = 0 + p;
            this._leftArrowSprite.bitmap = this._windowskin;
            this._leftArrowSprite.anchor.x = 0.5;
            this._leftArrowSprite.anchor.y = 0.5;
            this._leftArrowSprite.setFrame(sx, sy, q, p * 2);
            this._leftArrowSprite.move(q, h / 2 - p / 2);
            this._rightArrowSprite.bitmap = this._windowskin;
            this._rightArrowSprite.anchor.x = 0.5;
            this._rightArrowSprite.anchor.y = 0.5;
            this._rightArrowSprite.setFrame(sx + q + p, sy, q, p * 2);
            this._rightArrowSprite.move(w - q, h / 2 - p / 2);
        }

        update(): void {
            super.update();
            this.updateDetailPage();
        }

        updateDetailPage(): void {
            if (Input.isTriggered("left")) {
                this.pageLeft();
            } else if (Input.isTriggered("right")) {
                this.pageRight();
            }
        }

        _updateArrows(): void {
            this._leftArrowSprite.visible = this.isOpen() && this.leftArrowVisible;
            this._rightArrowSprite.visible = this.isOpen() && this.rightArrowVisible;
        }

        updateArrows(): void {
            if (this._drawDetailPrepared) {
                if (this._page === 1) {
                    this.leftArrowVisible = false;
                } else {
                    this.leftArrowVisible = true;
                }
                if (this._page === this._maxPage) {
                    this.rightArrowVisible = false;
                } else {
                    this.rightArrowVisible = true;
                }
                const w = this._width;
                const h = this._height - this._detailStartYPos;
                const p = 24;
                const q = p / 2;
                this._leftArrowSprite.move(q, this._detailStartYPos + h / 2 - p / 2);
                this._rightArrowSprite.move(w - q, this._detailStartYPos + h / 2 - p / 2);
            } else {
                this.leftArrowVisible = false;
                this.rightArrowVisible = false;
            }
        }

        pageLeft(): void {
            if (!this.activate) return;
            if (!this._drawDetailPrepared) return;
            if (this._page > 1) {
                this._page--;
                SoundManager.playCursor();
                this.refresh();
            }
        }

        pageRight(): void {
            if (!this.activate) return;
            if (!this._drawDetailPrepared) return;
            if (this._page < this._maxPage) {
                this._page++;
                SoundManager.playCursor();
                this.refresh();
            }
        }

        onTouchOk(): void {
            if (!this.isTouchOkEnabled()) return;
            const localPos = this.calcTouchLocalPos();
            if (!(localPos.x >= 0 && localPos.y >= 0 && localPos.x < this.width && localPos.y < this.height)) return;
            if (localPos.x <= this.width / 2) {
                this.pageLeft();
            } else {
                this.pageRight();
            }
        }

        // MV Compatible
        onTouch(triggered: boolean): void {
            if (!triggered) return;
            this.onTouchOk();
        }

        isTouchOkEnabled(): boolean {
            return this._drawDetailPrepared;
        }

        calcTouchLocalPos(): Point {
            const touchPos = new Point(TouchInput.x, TouchInput.y);
            const localPos = this.worldTransform.applyInverse(touchPos);
            return new Point(localPos.x, localPos.y);
        }

        setQuestData(questData: QuestData | null): void {
            this._questData = questData;
            this._page = 1;
        }

        // undraw: Undraw window
        // draw: Draw window
        setDrawState(drawState: string): void {
            this._drawState = drawState;
        }

        infoTextWidth(): number {
            return 160;
        }

        messageX(): number {
            return this.infoTextWidth() + 16;
        }

        messageWindth(): number {
            return this.width - this.padding * 2 - this.messageX();
        }

        drawAllItems(): void {
            this._drawDetailPrepared = false;
            if (this._drawState === "draw" && !this._questData) {
                this.drawNothingQuest(0);
            } else if (this._drawState === "draw" && this._questData!.state() === "hidden") {
                this.drawHiddenDetail(0);
            } else if (this._drawState === "draw") {
                this.drawQuestData();
            }
        }

        drawQuestData(): void {
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
                startLine += this._questData!.rewards.length;
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

            this._detailStartYPos = this.startY(startLine);

            this.prepareDrawDetail();
            this.drawDetail(startLine);
            this.drawPageNumber();
        }

        isOnlyDisplayDetail(): boolean {
            return !(DisplayRequestor || DisplayRewards || DisplayDifficulty || DisplayPlace || DisplayTimeLimit);
        }

        drawNothingQuest(startLine: number): void {
            this.drawTextEx(Text.NothingQuestText, this.padding, this.startY(startLine), this.width - this.padding * 2);
        }

        drawTitle(startLine: number): number {
            let titleRows = 1;
            this.resetTextColor();
            const stateWidth = 120;
            const titleWidth = this.width - this.padding * 4 - stateWidth;
            if (QuestTitleWrap) {
                if (this._questData!.iconIndex === 0) {
                    titleRows = this.drawTextExWrap(this._questData!.title, this.padding, this.startY(startLine), titleWidth);
                } else {
                    titleRows = this.drawIconTextWrap(this._questData!.title, this._questData!.iconIndex, this.padding, this.startY(startLine), titleWidth);
                }
            } else {
                if (this._questData!.iconIndex === 0) {
                    this.drawText(this._questData!.title, this.padding, this.startY(startLine), titleWidth);
                } else {
                    this.drawIconText(this._questData!.title, this._questData!.iconIndex, this.padding, this.startY(startLine), titleWidth);
                }
            }
            this.changeTextColor(this._questData!.stateTextColor());
            this.drawText(this._questData!.stateText(), this.padding + titleWidth, this.startY(startLine), stateWidth, "right");
            this.resetTextColor();
            return titleRows;
        }

        drawRequester(startLine: number): void {
            this.changeTextColor(this.systemColor());
            this.drawText(Text.RequesterText, this.padding, this.startY(startLine), this.infoTextWidth());
            this.resetTextColor();
            this.drawText(this._questData!.requester, this.messageX(), this.startY(startLine), this.messageWindth());
        }

        drawRewards(startLine: number): void {
            this.changeTextColor(this.systemColor());
            this.drawText(Text.RewardText, this.padding, this.startY(startLine), this.infoTextWidth());
            this.resetTextColor();
            for (const reward of this._questData!.rewards) {
                this.drawReward(reward, this.startY(startLine))
                startLine++;
            }
        }

        drawReward(reward: RewardData, y: number): void {
            new RewardWindowDrawer(this, reward).drawRewardToWindow(this.messageX(), y, this.messageWindth());
        }

        drawDifficulty(startLine: number): void {
            this.changeTextColor(this.systemColor());
            this.drawText(Text.DifficultyText, this.padding, this.startY(startLine), this.infoTextWidth());
            this.resetTextColor();
            this.drawText(this._questData!.difficulty, this.messageX(), this.startY(startLine), this.messageWindth());
        }

        drawPlace(startLine: number): void {
            this.changeTextColor(this.systemColor());
            this.drawText(Text.PlaceText, this.padding, this.startY(startLine), this.infoTextWidth());
            this.resetTextColor();
            this.drawText(this._questData!.place, this.messageX(), this.startY(startLine), this.messageWindth());
        }

        drawTimeLimit(startLine: number): void {
            this.changeTextColor(this.systemColor());
            this.drawText(Text.TimeLimitText, this.padding, this.startY(startLine), this.infoTextWidth());
            this.resetTextColor();
            this.drawText(this._questData!.timeLimit, this.messageX(), this.startY(startLine), this.messageWindth());
        }

        // クエスト詳細の表示前にdetailのページ分割処理を行う。
        prepareDrawDetail(): void {
            if (!this._drawDetailPrepared) {
                this._drawDetailPrepared = true;
                const height = this.height - this._detailStartYPos;
                const lineHeight = this.itemHeight() + this.padding;
                const pageSplitter = new PageSplitter(this._questData!.detail, height, lineHeight);
                this._detailPages = pageSplitter.doSplit();
                this._maxPage = this._detailPages.length;
            }
        }

        drawDetail(startLine: number): void {
            const detailPage = this._detailPages[this._page - 1];
            // 自動改行を考慮して横幅を-24する。
            this.drawTextExWrap(detailPage, this.padding, this.startY(startLine), this.width - this.padding * 2 - 24);
        }

        drawPageNumber(): void {
            if (this._maxPage === 1) return;
            const x = 0;
            const y = this.height - 48 - this.padding;
            const w = this.width - this.padding * 2;
            this.changeTextColor(this.systemColor());
            this.drawText(`${this._page}/${this._maxPage}`, x, y, w, "center");
            this.resetTextColor();
        }

        drawHiddenDetail(startLine: number): void {
            this.drawTextEx(this._questData!.hiddenDetail, this.padding, this.startY(startLine), this.width - this.padding * 2);
        }

        startY(line: number): number {
            return this.padding + this.itemHeight() * line;
        }

        drawHorzLine(y: number, color = this.systemColor()): void {
            this.changeTextColor(color);
            const padding = this.itemPadding();
            const x = padding;
            const width = this.innerWidth - padding * 2;
            this.drawRect(x, y, width, 5);
            this.resetTextColor();
        }

        drawTextExWrap(text: string, x: number, y: number, width: number): number {
            const textDrawer = new TextDrawer(this);
            return textDrawer.drawTextExWrap(text, x, y, width);
        }

        drawIconText(text: string, iconIndex: number, x: number, y: number, width: number): number {
            const textDrawer = new TextDrawer(this);
            return textDrawer.drawIconText(text, iconIndex, x, y, width);
        }

        drawIconTextWrap(text: string, iconIndex: number, x: number, y: number, width: number): number {
            const textDrawer = new TextDrawer(this);
            return textDrawer.drawIconTextWrap(text, iconIndex, x, y, width);
        }

        itemHeight(): number {
            return 32;
        }
    }

    export class Window_QuestOrder extends Window_Command_MZMV {
        initialize(rect: Rectangle): void {
            super.initialize(rect);
            this.deactivate();
            this.hide();
            this.close();
        }

        makeCommandList(): void {
            this.addCommand(Text.QuestOrderYesText, "yes");
            this.addCommand(Text.QuestOrderNoText, "no");
        }

        drawAllItems(): void {
            const rect = this.itemLineRect(-1);
            this.drawText(Text.QuestOrderText, rect.x, rect.y, rect.width);
            super.drawAllItems();
        }

        itemRect(index: number): Rectangle {
            const rect = super.itemRect(index + 1);
            return rect;
        }

        playOkSound(): void {
            if (this.currentSymbol() === "yes") return this.playOrderSound();
            super.playOkSound();
        }

        playOrderSound(): void {
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

    export class Window_QuestOrderFailed extends Window_Selectable_MZMV {
        initialize(rect: Rectangle): void {
            super.initialize(rect);
            this.deactivate();
            this.hide();
            this.close();
        }

        onTouchOk(): void {
            this.processOk();
        }

        drawAllItems(): void {
            const rect = this.itemLineRect(0);
            this.drawText(Text.ReachedLimitText, rect.x, rect.y, rect.width);
        }
    }

    export class Window_QuestCancel extends Window_Command_MZMV {
        initialize(rect: Rectangle): void {
            super.initialize(rect);
            this.deactivate();
            this.hide();
            this.close();
        }

        makeCommandList(): void {
            this.addCommand(Text.QuestCancelYesText, "yes");
            this.addCommand(Text.QuestCancelNoText, "no");
        }

        drawAllItems(): void {
            const rect = this.itemLineRect(-1);
            this.drawText(Text.QuestCancelText, rect.x, rect.y, rect.width);
            super.drawAllItems();
        }

        itemRect(index: number): Rectangle {
            const rect = super.itemRect(index + 1);
            return rect;
        }
    }

    export class Window_QuestReport extends Window_Command_MZMV {
        initialize(rect: Rectangle): void {
            super.initialize(rect);
            this.deactivate();
            this.hide();
            this.close();
        }

        makeCommandList(): void {
            this.addCommand(Text.QuestReportYesText, "yes");
            this.addCommand(Text.QuestReportNoText, "no");
        }

        drawAllItems(): void {
            const rect = this.itemLineRect(-1);
            this.drawText(Text.QuestReportText, rect.x, rect.y, rect.width);
            super.drawAllItems();
        }

        itemRect(index: number): Rectangle {
            const rect = super.itemRect(index + 1);
            return rect;
        }

        playOkSound(): void {
            if (this.currentSymbol() === "yes") return this.playOrderSound();
            super.playOkSound();
        }

        playOrderSound(): void {
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

    export class Window_QuestGetReward extends Window_Selectable_MZMV {
        _questData!: QuestData | null;

        initialize(rect: Rectangle): void {
            super.initialize(rect);
            this.deactivate();
            this.hide();
            this.close();
            this._questData = null;
        }

        refresh(): void {
            if (this._questData) this.updateWindowRect();
            super.refresh();
        }

        updateWindowRect(): void {
            const numRewards = this._questData!.rewards.length;
            const w = WindowSize.GetRewardWindowWidth;
            const h = (Utils.RPGMAKER_NAME === "MZ" ? 80 : 70) + numRewards * 40;
            const x = Graphics.boxWidth / 2 - w / 2;
            const y = Graphics.boxHeight / 2 - h / 2;
            this.move(x, y, w, h);
        }

        onTouchOk(): void {
            this.processOk();
        }

        setQuestData(questData: QuestData): void {
            this._questData = questData;
        }

        drawAllItems(): void {
            const rect = this.itemLineRect(0);
            this.drawText(Text.GetRewardText, rect.x, rect.y, rect.width);
            this.drawRewards();
        }

        drawRewards(): void {
            let i = 1;
            for (const reward of this._questData!.rewards) {
                const rect = this.itemLineRect(i);
                this.drawReward(reward, rect);
                i++;
            }
        }

        drawReward(reward: RewardData, rect: Rectangle): void {
            new RewardWindowDrawer(this, reward).drawRewardToWindow(rect.x, rect.y, rect.width);
        }
    }


    // セーブデータ対応
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        $questSaveDatas = $dataQuests.map(questData => new QuestSaveData(questData.variableId));
    };

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents: any = _DataManager_makeSaveContents.call(this);
        contents.questSaveDatas = $questSaveDatas;
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (!contents.questSaveDatas) return;
        $questSaveDatas = $dataQuests.map(questData => {
            const savedQuestSaveData = contents.questSaveDatas.find((saveData: QuestSaveData) => saveData.variableId() === questData.variableId);
            if (savedQuestSaveData) return savedQuestSaveData;
            return new QuestSaveData(questData.variableId);
        });

        for (const questData of $dataQuests) {
            questData.loadSaveData();
        }
    };


    // Register plugin command.
    if (Utils.RPGMAKER_NAME === "MZ") {
        PluginManager.registerCommand(QuestSystemPluginName, "StartQuestScene", (args: any) => {
            SceneManager.push(Scene_QuestSystem);
            const params = PluginParamsParser.parse(args, { QuestCommands: ["string"], BackgroundImage: {} });
            const fileName1 = params.BackgroundImage.FileName1;
            const fileName2 = params.BackgroundImage.FileName2;
            const xOfs = params.BackgroundImage.XOfs;
            const yOfs = params.BackgroundImage.YOfs;
            QuestUtils.startQuestScene(params.QuestCommands, fileName1, fileName2, xOfs, yOfs);
        });

        PluginManager.registerCommand(QuestSystemPluginName, "GetRewards", (args: any) => {
            const params = PluginParamsParser.parse(args, { VariableId: "number" });
            QuestUtils.getRewards(params.VariableId);
        });

        PluginManager.registerCommand(QuestSystemPluginName, "ChangeDetail", (args: any) => {
            const params = PluginParamsParser.parse(args, { VariableId: "number", Detail: "string", DetailNote: "string" });
            let detail;
            if (params.DetailNote == null || params.DetailNote === "") {
                detail = params.Detail;
            } else {
                detail = JSON.parse(params.DetailNote);
            }
            QuestUtils.changeDetail(params.VariableId, detail);
        });

        PluginManager.registerCommand(QuestSystemPluginName, "ChangeRewards", (args: any) => {
            const params = PluginParamsParser.parse(args, { Rewards: [{}] });
            const rewards = params.Rewards.map((rewardParam: any) => {
                return RewardData.fromParam(rewardParam);
            });
            QuestUtils.changeRewardsByRewardObject(params.VariableId, rewards);
        });
    }


    // Add QuestSystem to menu command.
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        if (EnabledQuestMenu && Text.MenuQuestSystemText !== "") this.addCommand(Text.MenuQuestSystemText, "quest", this.isEnabledQuestMenu());
    };

    Window_MenuCommand.prototype.isEnabledQuestMenu = function() {
        if (EnabledQuestMenuSwitchId === 0) return true;
        return $gameSwitches.value(EnabledQuestMenuSwitchId);
    };

    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("quest", this.quest.bind(this));
    };

    Scene_Menu.prototype.quest = function() {
        SceneManager.push(Scene_QuestSystem);
        SceneManager.prepareNextScene(MenuCommands, MenuBackgroundImage);
    };


    // セーブデータに含めるクラスをwindowオブジェクトに登録する。
    window.RewardData = RewardData;
    window.ItemInfo = ItemInfo;
    window.QuestSaveData = QuestSaveData;
}

const QuestSystemAlias = QuestSystem;
