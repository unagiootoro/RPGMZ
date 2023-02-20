"use strict";
/*:
@target MV MZ
@plugindesc Self variable v1.5.1
@author unagiootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SelfVariable.js
@help
A plugin that introduces self variables.

【How to use】
■ Basic usage
If you prefix the variable name with "$", the variable is treated as a self variable.
Setting example: $ Self variable

self variables are managed on an event-by-event basis, similar to self switching.
You can get and set the value of a self variable on the editor in the same way as a normal variable.
You can do it.

In addition to variables, switches can also be treated as extended self switches by adding "$"
to the beginning of the switch name.

■ Using common event variables
A variable name prefixed with "%" will be treated as a common event variable.
Setting example: %Common event variable

Common event variables are variables that can only be used within common events.
The value is initialized to 0 to call common events.
If you call a common event within a common event,
Values are not shared between common events.

■ Using Decimal Variables
Prefixing a variable name with "#" treats it as a decimal variable.
Setting example: # decimal variable

A variable set to a decimal variable retains its value as a decimal even if a decimal value is assigned to it.
For the setting of the decimal, in "Variable operation" of the event command,
This can be done by entering a decimal value in the script field.

Also, if a description such as "#$" is attached to the beginning, the variable is treated as a self variable and a decimal variable.
can be handled. Either "#" or "$" can be written first.
Setting example: #$ decimal self variable

■ Manipulate self variables from plug-in commands
"Get self variable value" and "Set self variable value" of the plug-in command
By using self variables from one event to another
It is also possible to operate.

Similarly for the extended self switch, you can operate the extended self switch from the outside
by using "extended self switch value acquisition" and "extended self switch setting".

Plugin commands can only be used when running on MZ.
In the case of MV, by using the function to operate self variables from the script
The same can be achieved.

When specifying "map ID" in the plug-in command, "map ID"
If 0 is specified, the ID of the current map is applied.
Also, if 0 is specified for "Event ID" when specifying "Event ID",
The ID of the event that executed the plugin command is applied.

When clearing the self variable/extended self switch with the plugin command,
if the argument "whether event is specified" is ON,
the event specified by the event ID or variable will be cleared. When set to OFF,
all events on the map will be cleared.

■ Batch setting of self variables/extended self switches using event tags
If you set an event tag to an event, the plug-in command "Set self variable value by event tag" will be displayed.
Or with the event tag specified by "Extended self switch value setting by event tag"
Self variables or extended self switches can be set for all events.
Multiple event tags can be set.
When setting an event tag, please describe it as follows in the first annotation of page 0 of the event.
<et: event tag>

Example: When setting event tags "ET1" and "ET2"
<et: ET1>
<et: ET2>

■ Manipulate self variables from scripts
・Acquisition of self variables
Example: To get the self variable of ID3 of the map of ID1 and the event of ID2
$gameVariables.selfVariableValue([1, 2, 3]);

・Self variable setting
Example: If you want to set the self variable for ID3 to 100 for the event for ID2 in the map for ID1.
$gameVariables.selfVariableValue([1, 2, 3], 100);

・Acquisition of extended self switch
Example: To get ID3's extended self switch for ID2's event of ID1's map
$gameSwitches.exSelfSwitchValue([1, 2, 3]);

・Extended self switch settings
Example: When setting ON for the ID3 extended self switch of the ID2 event in the ID1 map
$gameVariables.setExSelfSwitchValue([1, 2, 3], true);

Also, for those who understand the script to some extent, in Game_Event
The following methods are defined, so by using these,
It is possible to manipulate self variables more easily.
・Game_Event#selfVariableValue(variableId)
Gets the self variable specified by variableId for the target event.

・Game_Event#setSelfVariableValue(variableId, value)
Stores the value in the self variable specified by variableId for the target event.

・Game_Event#exSelfSwitchValue(switchId)
Gets the extended self switch specified by switchId for the target event.

・Game_Event#setExSelfSwitchValue(switchId, value)
Stores the value in the extended self switch specified by switchId for the target event.

【Important point】
-Do not manipulate self variables from battle events on the editor.
Self variables are linked to map events, so from other than map events
If the variable is accessed via the event command, it will not operate normally.

-The following functions do not work properly due to specifications.
When using these functions, store them in normal variables once
Please move the value to the self variable.
- \v in text display
- Numerical input processing

【License】
This plugin is available under the terms of the MIT license.


@command GetSelfVariableValue
@text Self variable value acquisition
@desc Gets the value of a self variable.

@arg MapId
@type number
@text map ID
@default 1
@desc Specify the map ID. If 0 is specified, the current map ID will be applied.

@arg MapIdByVariable
@type variable
@text Map ID (variable specification)
@default 0
@desc Specify the map ID with a variable. If you set the map ID value directly, specify 0 for this parameter.

@arg EventId
@type number
@text Event ID
@default 1
@desc Specify the event ID. If you set the event ID value directly, specify 0 for this parameter.

@arg EventIdByVariable
@type variable
@text Event ID (variable specification)
@default 0
@desc Specify the event ID with a variable. If you set the event ID value directly, specify 0 for this parameter.

@arg SelfVariableId
@type variable
@text Self variable ID
@default 1
@desc Specifies the self variable ID.

@arg DestVariableId
@type variable
@text Storage variable ID
@default 2
@desc Specify the variable ID that stores the acquired self variable value.


@command SetSelfVariableValue
@text Self variable value setting
@desc Set the value of the self variable.

@arg MapId
@type number
@text map ID
@default 1
@desc Specify the map ID. If 0 is specified, the current map ID will be applied.

@arg MapIdByVariable
@type variable
@text Map ID (variable specification)
@default 0
@desc Specify the map ID with a variable. If you set the map ID value directly, specify 0 for this parameter.

@arg EventId
@type number
@text Event ID
@default 1
@desc Specify the event ID. If you set the event ID value directly, specify 0 for this parameter.

@arg EventIdByVariable
@type variable
@text Event ID (variable specification)
@default 0
@desc Specify the event ID with a variable. If you set the event ID value directly, specify 0 for this parameter.

@arg SelfVariableId
@type variable
@text Self variable ID
@default 1
@desc Specifies the self variable ID.

@arg Value
@type number
@text setting value
@default 0
@desc Specifies the value to set for the self variable.

@arg SrcVariableId
@type variable
@text Setting value storage variable ID
@default 0
@desc Specify the variable ID that stores the value to be set in the self variable. If you specify a direct value, specify 0 for this parameter.


@command SetSelfVariableValueByEventTags
@text Self variable value setting by event tag
@desc Sets the value of the self variable to all events with the specified event tag.

@arg EventTags
@type string[]
@text Event tag
@default []
@desc Specify the target event tag.

@arg SelfVariableId
@type variable
@text Self variable ID
@default 1
@desc Specifies the self variable ID.

@arg Value
@type number
@text setting value
@default 0
@desc Specifies the value to set for the self variable.

@arg SrcVariableId
@type variable
@text Setting value storage variable ID
@default 0
@desc Specify the variable ID that stores the value to be set in the self variable. If you specify a direct value, specify 0 for this parameter.


@command ClearSelfVariables
@text self variable clear
@desc Sets all self variables corresponding to the specified map ID and event ID to 0.

@arg MapId
@type number
@text map ID
@default 1
@desc Specify the map ID. If 0 is specified, the current map ID will be applied.

@arg MapIdByVariable
@type variable
@text Map ID (variable specification)
@default 0
@desc Specify the map ID with a variable. If you set the map ID value directly, specify 0 for this parameter.

@arg EventSpecification
@type boolean
@text Whether or not event is specified
@default true
@desc When ON is specified, the target event is specified.

@arg EventId
@type number
@text Event ID
@default 1
@desc Specify the event ID. If you set the event ID value directly, specify 0 for this parameter.

@arg EventIdByVariable
@type variable
@text Event ID (variable specification)
@default 0
@desc Specify the event ID with a variable. If you set the event ID value directly, specify 0 for this parameter.

@arg SelfVariableId
@type variable
@text self variable id
@default 0
@desc If specified, only that self variable will be cleared.


@command GetExSelfSwitchValue
@text get extended self switch value
@desc Gets the extended self switch value.

@arg MapId
@type number
@text map ID
@default 1
@desc Specify the map ID. If 0 is specified, the current map ID will be applied.

@arg MapIdByVariable
@type variable
@text Map ID (variable specification)
@default 0
@desc Specify the map ID with a variable. If you set the map ID value directly, specify 0 for this parameter.

@arg EventId
@type number
@text Event ID
@default 1
@desc Specify the event ID. If you set the event ID value directly, specify 0 for this parameter.

@arg EventIdByVariable
@type variable
@text Event ID (variable specification)
@default 0
@desc Specify the event ID with a variable. If you set the event ID value directly, specify 0 for this parameter.

@arg ExSelfSwitchId
@type switch
@text extended self switch ID
@default 1
@desc Specifies an extended self switch ID.

@arg DestSwitchId
@type switch
@text Destination switch ID
@default 2
@desc Specifies the switch ID that stores the acquired extended self switch value.


@command SetExSelfVariableValue
@text extended self switch value setting
@desc Sets the extended self switch value.

@arg MapId
@type number
@text map ID
@default 1
@desc Specify the map ID. If 0 is specified, the current map ID will be applied.

@arg MapIdByVariable
@type variable
@text Map ID (variable specification)
@default 0
@desc Specify the map ID with a variable. If you set the map ID value directly, specify 0 for this parameter.

@arg EventId
@type number
@text Event ID
@default 1
@desc Specify the event ID. If you set the event ID value directly, specify 0 for this parameter.

@arg EventIdByVariable
@type variable
@text Event ID (variable specification)
@default 0
@desc Specify the event ID with a variable. If you set the event ID value directly, specify 0 for this parameter.

@arg ExSelfSwitchId
@type switch
@text extended self switch ID
@default 1
@desc Specifies an extended self switch ID.

@arg Value
@type boolean
@text setting value
@default true
@desc Specifies the value to set for the extended self switch.

@arg SrcSwitchId
@type switch
@text Setting value storage switch ID
@default 0
@desc Specifies the switch ID that stores the value to be set in the extended self switch. When specifying a value directly, specify 0 for this parameter.


@command SetExSelfSwitchValueByEventTags
@text Extended self switch value setting by event tag
@desc Sets the value of the self variable to all events with the specified event tag.

@arg EventTags
@type string[]
@text Event tag
@default []
@desc Specify the target event tag.

@arg ExSelfSwitchId
@type switch
@text extended self switch ID
@default 1
@desc Specifies an extended self switch ID.

@arg Value
@type boolean
@text setting value
@default true
@desc Specifies the value to set for the extended self switch.

@arg SrcSwitchId
@type switch
@text Setting value storage switch ID
@default 0
@desc Specifies the switch ID that stores the value to be set in the extended self switch. When specifying a value directly, specify 0 for this parameter.


@command ClearExSelfSwitches
@text extended self switch clear
@desc Turns off all extended self switches corresponding to the specified map ID and event ID.

@arg MapId
@type number
@text map ID
@default 1
@desc Specify the map ID. If 0 is specified, the current map ID will be applied.

@arg MapIdByVariable
@type variable
@text Map ID (variable specification)
@default 0
@desc Specify the map ID with a variable. If you set the map ID value directly, specify 0 for this parameter.

@arg EventSpecification
@type boolean
@text Whether or not event is specified
@default true
@desc When ON is specified, the target event is specified.

@arg EventId
@type number
@text Event ID
@default 1
@desc Specify the event ID. If you set the event ID value directly, specify 0 for this parameter.

@arg EventIdByVariable
@type variable
@text Event ID (variable specification)
@default 0
@desc Specify the event ID with a variable. If you set the event ID value directly, specify 0 for this parameter.

@arg ExSelfSwitchId
@type switch
@text extended self switch ID
@default 0
@desc If specified, only that extended self switch will be cleared.


@param SelfVariablePrefix
@type string
@text self variable or extend self switch prefix
@default $
@desc Specifies the variable name prefix used to identify self variables or extend self switches.

@param CommonVariablePrefix
@type string
@text common variable/common switch prefix
@default %
@desc Specifies the variable/switch name prefix used to identify common variables/switches.

@param FloatVariablePrefix
@type string
@text decimal variable prefix
@default #
@desc Specifies the variable name prefix used to identify decimal variables.

@param ErrorLanguage
@text Error message language
@type select
@option english
@value en
@option Japanese
@value ja
@default en
@desc Specifies the language for displaying errors. Normally you do not need to change this parameter.
*/
/*:ja
@target MV MZ
@plugindesc セルフ変数 v1.5.1
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SelfVariable.js
@help
セルフ変数を導入するプラグインです。

【使用方法】
■ 基本的な使用法
変数名の先頭に「$」を付けると、その変数はセルフ変数として扱われます。
設定例: $セルフ変数

セルフ変数はセルフスイッチと同じようにイベントごとに管理されます。
セルフ変数の値の取得や設定は通常の変数と同じようにエディタ上で
行うことができます。

また、変数だけでなくスイッチについてもスイッチ名の先頭に「$」をつけることで
拡張セルフスイッチとして扱うことができるようになります。

■ コモンイベント変数の使用
変数名の先頭に「%」を付けると、その変数はコモンイベント変数として扱われます。
設定例: %コモンイベント変数

コモンイベント変数はコモンイベント内だけで使用可能な変数です。
コモンイベントを呼び出すために値が0に初期化されます。
コモンイベント内でコモンイベントを呼び出した場合、
コモンイベント間で値は共有されません。

■ 小数変数の使用
変数名の先頭に「#」を付けると、その変数は小数変数として扱われます。
設定例: #小数変数

小数変数に設定した変数は、小数値を代入した場合でも小数としての値が保持されるようになります。
小数の設定については、イベントコマンドの「変数の操作」にて、
スクリプト欄に小数の値を入力することで行うことが可能です。

また、「#$」のような記載を先頭につけた場合、その変数はセルフ変数かつ小数変数として
扱うことが可能です。「#」と「$」はどちらを先に記載してもかまいません。
設定例: #$小数セルフ変数

■ プラグインコマンドからセルフ変数を操作する
プラグインコマンドの「セルフ変数値取得」「セルフ変数値設定」を
使用することで、あるイベントから他のイベントのセルフ変数を
操作することも可能です。

拡張セルフスイッチについても同じように「拡張セルフスイッチ値取得」
「拡張セルフスイッチ設定」を使用することで、外部からの拡張セルフスイッチの
操作が可能になります。

プラグインコマンドはMZで動作させる場合のみ使用できます。
MVの場合はスクリプトからセルフ変数を操作させる機能を使用することで
同様のことが実現可能です。

プラグインコマンドで「マップID」を指定するときに「マップID」に
0を指定した場合は、現在のマップのIDが適用されます。
また「イベントID」を指定するときに「イベントID」に0を指定した場合は、
プラグインコマンドを実行したイベントのIDが適用されます。

プラグインコマンドでセルフ変数/拡張セルフスイッチをクリアする場合、
引数「イベント指定有無」をONにした場合、イベントIDまたは変数で指定したイベントを
対象にクリアを行います。OFFにした場合、マップ上の全てのイベントに対してクリアを行います。

■ イベントタグによるセルフ変数/拡張セルフスイッチの一括設定
イベントにイベントタグを設定するとプラグインコマンド「イベントタグによるセルフ変数値設定」
または「イベントタグによる拡張セルフスイッチ値設定」によって指定したイベントタグを持つ
イベント全てに対してセルフ変数または拡張セルフスイッチを設定することができます。
イベントタグは複数設定することも可能です。
イベントタグを設定する場合、イベントの0ページ目の最初の注釈に以下のように記載してください。
<et: イベントタグ>

例: イベントタグ"ET1"と"ET2"を設定する場合
<et: ET1>
<et: ET2>

■ スクリプトからセルフ変数を操作する
・セルフ変数の取得
例: ID1のマップの、ID2のイベントの、ID3のセルフ変数を取得する場合
$gameVariables.selfVariableValue([1, 2, 3]);

・セルフ変数の設定
例: ID1のマップの、ID2のイベントの、ID3のセルフ変数に100を設定する場合
$gameVariables.selfVariableValue([1, 2, 3], 100);

・拡張セルフスイッチの取得
例: ID1のマップの、ID2のイベントの、ID3の拡張セルフスイッチを取得する場合
$gameSwitches.exSelfSwitchValue([1, 2, 3]);

・拡張セルフスイッチの設定
例: ID1のマップの、ID2のイベントの、ID3の拡張セルフスイッチにONを設定する場合
$gameVariables.setExSelfSwitchValue([1, 2, 3], true);

また、ある程度スクリプトが分かる人向けですが、Game_Eventに
以下のメソッドを定義していますので、これらを使用することで
より簡単にセルフ変数を操作することが可能です。
・Game_Event#selfVariableValue(variableId)
対象のイベントについてvariableIdで指定したセルフ変数を取得します。

・Game_Event#setSelfVariableValue(variableId, value)
対象のイベントについてvariableIdで指定したセルフ変数にvalueを格納します。

・Game_Event#exSelfSwitchValue(switchId)
対象のイベントについてswitchIdで指定した拡張セルフスイッチを取得します。

・Game_Event#setExSelfSwitchValue(switchId, value)
対象のイベントについてswitchIdで指定した拡張セルフスイッチにvalueを格納します。

【注意点】
・エディタ上で戦闘イベントからセルフ変数を操作しないでください。
 セルフ変数はマップイベントに紐づいていますので、マップイベント以外から
 イベントコマンド経由で変数にアクセスした場合、正常に動作しなくなります。

・以下の機能については仕様の都合上、正常に動作しません。
 これらの機能を使用する際は一旦通常の変数に格納してから
 セルフ変数に値を移すようにしてください。
  - 文章表示における\v
  - 数値入力の処理

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@command GetSelfVariableValue
@text セルフ変数値取得
@desc セルフ変数の値を取得します。

@arg MapId
@type number
@text マップID
@default 1
@desc マップIDを指定します。

@arg MapIdByVariable
@type variable
@text マップID(変数指定)
@default 0
@desc マップIDを変数で指定します。直接マップID値を設定した場合は本パラメータは0を指定してください。

@arg EventId
@type number
@text イベントID
@default 1
@desc イベントIDを指定します。

@arg EventIdByVariable
@type variable
@text イベントID(変数指定)
@default 0
@desc イベントIDを変数で指定します。直接イベントID値を設定した場合は本パラメータは0を指定してください。

@arg SelfVariableId
@type variable
@text セルフ変数ID
@default 1
@desc セルフ変数IDを指定します。

@arg DestVariableId
@type variable
@text 格納先変数ID
@default 2
@desc 取得したセルフ変数の値を格納する変数IDを指定します。


@command SetSelfVariableValue
@text セルフ変数値設定
@desc セルフ変数の値を設定します。

@arg MapId
@type number
@text マップID
@default 1
@desc マップIDを指定します。

@arg MapIdByVariable
@type variable
@text マップID(変数指定)
@default 0
@desc マップIDを変数で指定します。直接マップID値を設定した場合は本パラメータは0を指定してください。

@arg EventId
@type number
@text イベントID
@default 1
@desc イベントIDを指定します。

@arg EventIdByVariable
@type variable
@text イベントID(変数指定)
@default 0
@desc イベントIDを変数で指定します。直接イベントID値を設定した場合は本パラメータは0を指定してください。

@arg SelfVariableId
@type variable
@text セルフ変数ID
@default 1
@desc セルフ変数IDを指定します。

@arg Value
@type number
@text 設定値
@default 0
@desc セルフ変数に設定する値を指定します。

@arg SrcVariableId
@type variable
@text 設定値格納変数ID
@default 0
@desc セルフ変数に設定する値を格納した変数IDを指定します。直接値を指定する場合、このパラメータは0を指定してください。


@command SetSelfVariableValueByEventTags
@text イベントタグによるセルフ変数値設定
@desc 指定したイベントタグを持つイベント全てにセルフ変数の値を設定します。

@arg EventTags
@type string[]
@text イベントタグ
@default []
@desc 対象となるイベントタグを指定します。

@arg SelfVariableId
@type variable
@text セルフ変数ID
@default 1
@desc セルフ変数IDを指定します。

@arg Value
@type number
@text 設定値
@default 0
@desc セルフ変数に設定する値を指定します。

@arg SrcVariableId
@type variable
@text 設定値格納変数ID
@default 0
@desc セルフ変数に設定する値を格納した変数IDを指定します。直接値を指定する場合、このパラメータは0を指定してください。


@command ClearSelfVariables
@text セルフ変数クリア
@desc 指定したマップIDとイベントIDに該当する全てのセルフ変数を0にします。

@arg MapId
@type number
@text マップID
@default 1
@desc マップIDを指定します。

@arg MapIdByVariable
@type variable
@text マップID(変数指定)
@default 0
@desc マップIDを変数で指定します。直接マップID値を設定した場合は本パラメータは0を指定してください。

@arg EventSpecification
@type boolean
@text イベント指定有無
@default true
@desc ONを指定すると対象のイベントを指定します。

@arg EventId
@type number
@text イベントID
@default 1
@desc イベントIDを指定します。

@arg EventIdByVariable
@type variable
@text イベントID(変数指定)
@default 0
@desc イベントIDを変数で指定します。直接イベントID値を設定した場合は本パラメータは0を指定してください。

@arg SelfVariableId
@type variable
@text セルフ変数ID
@default 0
@desc 指定した場合、そのセルフ変数のみクリアの対象とします。


@command GetExSelfSwitchValue
@text 拡張セルフスイッチ値取得
@desc 拡張セルフスイッチの値を取得します。

@arg MapId
@type number
@text マップID
@default 1
@desc マップIDを指定します。

@arg MapIdByVariable
@type variable
@text マップID(変数指定)
@default 0
@desc マップIDを変数で指定します。直接マップID値を設定した場合は本パラメータは0を指定してください。

@arg EventId
@type number
@text イベントID
@default 1
@desc イベントIDを指定します。

@arg EventIdByVariable
@type variable
@text イベントID(変数指定)
@default 0
@desc イベントIDを変数で指定します。直接イベントID値を設定した場合は本パラメータは0を指定してください。


@arg ExSelfSwitchId
@type switch
@text 拡張セルフスイッチID
@default 1
@desc 拡張セルフスイッチIDを指定します。

@arg DestSwitchId
@type switch
@text 格納先スイッチID
@default 2
@desc 取得した拡張セルフスイッチの値を格納するスイッチIDを指定します。


@command SetExSelfVariableValue
@text 拡張セルフスイッチ値設定
@desc 拡張セルフスイッチの値を設定します。

@arg MapId
@type number
@text マップID
@default 1
@desc マップIDを指定します。

@arg MapIdByVariable
@type variable
@text マップID(変数指定)
@default 0
@desc マップIDを変数で指定します。直接マップID値を設定した場合は本パラメータは0を指定してください。

@arg EventId
@type number
@text イベントID
@default 1
@desc イベントIDを指定します。

@arg EventIdByVariable
@type variable
@text イベントID(変数指定)
@default 0
@desc イベントIDを変数で指定します。直接イベントID値を設定した場合は本パラメータは0を指定してください。

@arg ExSelfSwitchId
@type switch
@text 拡張セルフスイッチID
@default 1
@desc 拡張セルフスイッチIDを指定します。

@arg Value
@type boolean
@text 設定値
@default true
@desc 拡張セルフスイッチに設定する値を指定します。

@arg SrcSwitchId
@type switch
@text 設定値格納スイッチID
@default 0
@desc 拡張セルフスイッチに設定する値を格納したスイッチIDを指定します。直接値を指定する場合、このパラメータは0を指定してください。


@command SetExSelfSwitchValueByEventTags
@text イベントタグによる拡張セルフスイッチ値設定
@desc 指定したイベントタグを持つイベント全てにセルフ変数の値を設定します。

@arg EventTags
@type string[]
@text イベントタグ
@default []
@desc 対象となるイベントタグを指定します。

@arg ExSelfSwitchId
@type switch
@text 拡張セルフスイッチID
@default 1
@desc 拡張セルフスイッチIDを指定します。

@arg Value
@type boolean
@text 設定値
@default true
@desc 拡張セルフスイッチに設定する値を指定します。

@arg SrcSwitchId
@type switch
@text 設定値格納スイッチID
@default 0
@desc 拡張セルフスイッチに設定する値を格納したスイッチIDを指定します。直接値を指定する場合、このパラメータは0を指定してください。


@command ClearExSelfSwitches
@text 拡張セルフスイッチクリア
@desc 指定したマップIDとイベントIDに該当する全ての拡張セルフスイッチをOFFにします。

@arg MapId
@type number
@text マップID
@default 1
@desc マップIDを指定します。

@arg MapIdByVariable
@type variable
@text マップID(変数指定)
@default 0
@desc マップIDを変数で指定します。直接マップID値を設定した場合は本パラメータは0を指定してください。

@arg EventSpecification
@type boolean
@text イベント指定有無
@default true
@desc ONを指定すると対象のイベントを指定します。

@arg EventId
@type number
@text イベントID
@default 1
@desc イベントIDを指定します。

@arg EventIdByVariable
@type variable
@text イベントID(変数指定)
@default 0
@desc イベントIDを変数で指定します。直接イベントID値を設定した場合は本パラメータは0を指定してください。

@arg ExSelfSwitchId
@type switch
@text 拡張セルフスイッチID
@default 0
@desc 指定した場合、その拡張セルフスイッチのみクリアの対象とします。



@param SelfVariablePrefix
@type string
@text セルフ変数/拡張セルフスイッチプレフィックス
@default $
@desc セルフ変数/拡張セルフスイッチの識別に使用する変数/スイッチ名のプレフィックスを指定します。

@param CommonVariablePrefix
@type string
@text コモン変数/コモンスイッチプレフィックス
@default %
@desc コモン変数/コモンスイッチの識別に使用する変数/スイッチ名のプレフィックスを指定します。

@param FloatVariablePrefix
@type string
@text 小数変数プレフィックス
@default #
@desc 小数変数の識別に使用する変数名のプレフィックスを指定します。

@param ErrorLanguage
@text エラーメッセージ言語
@type select
@option 英語
@value en
@option 日本語
@value ja
@default ja
@desc エラー表示の言語を指定します。通常このパラメータを変更する必要はありません。
*/
const SelfVariablePluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "SelfVariable";
var globalActiveInterpreter;
var globalActiveEvent;
var SelfVariable;
(function (SelfVariable) {
    const PP = PluginManager.parameters(SelfVariablePluginName);
    const SelfVariablePrefix = PP.SelfVariablePrefix;
    const FloatVariablePrefix = PP.FloatVariablePrefix;
    const CommonVariablePrefix = PP.CommonVariablePrefix;
    const ErrorLanguage = PP.ErrorLanguage;
    /* static class PluginManager */
    if (typeof PluginManager.registerCommand !== "undefined") {
        function getMapId(interpreter, args) {
            const mapIdByVariable = parseInt(args.MapIdByVariable);
            let mapId = mapIdByVariable > 0 ? $gameVariables.value(mapIdByVariable) : parseInt(args.MapId);
            if (mapId === 0)
                return interpreter.mapId();
            return mapId;
        }
        function getEventId(interpreter, args) {
            const eventIdByVariable = parseInt(args.EventIdByVariable);
            let eventId = eventIdByVariable > 0 ? $gameVariables.value(eventIdByVariable) : parseInt(args.EventId);
            if (eventId === 0) {
                if (interpreter.eventId() === 0) {
                    throw ErrorManager.invalidThisEvent();
                }
                else {
                    return interpreter.eventId();
                }
            }
            return eventId;
        }
        PluginManager.registerCommand(SelfVariablePluginName, "GetSelfVariableValue", function (args) {
            const mapId = getMapId(this, args);
            const eventId = getEventId(this, args);
            const selfVariableId = parseInt(args.SelfVariableId);
            const destVariableId = parseInt(args.DestVariableId);
            const key = [mapId, eventId, selfVariableId];
            const value = $gameVariables.selfVariableValue(key);
            $gameVariables.setValue(destVariableId, value);
        });
        PluginManager.registerCommand(SelfVariablePluginName, "SetSelfVariableValue", function (args) {
            const mapId = getMapId(this, args);
            const eventId = getEventId(this, args);
            const selfVariableId = parseInt(args.SelfVariableId);
            let value = parseInt(args.Value);
            const srcVariableId = parseInt(args.SrcVariableId);
            const key = [mapId, eventId, selfVariableId];
            if (srcVariableId > 0) {
                value = $gameVariables.value(srcVariableId);
            }
            $gameVariables.setSelfVariableValue(key, value);
        });
        PluginManager.registerCommand(SelfVariablePluginName, "SetSelfVariableValueByEventTags", function (args) {
            const eventTags = JSON.parse(args.EventTags);
            const selfVariableId = parseInt(args.SelfVariableId);
            let value = parseInt(args.Value);
            const srcVariableId = parseInt(args.SrcVariableId);
            if (srcVariableId > 0) {
                value = $gameVariables.value(srcVariableId);
            }
            $gameVariables.setSelfVariableValueByEventTags(eventTags, selfVariableId, value);
        });
        PluginManager.registerCommand(SelfVariablePluginName, "ClearSelfVariables", function (args) {
            const mapId = getMapId(this, args);
            let eventId;
            if (args.EventSpecification !== "false") {
                eventId = getEventId(this, args);
            }
            let selfVariableId;
            if (args.SelfVariableId) {
                selfVariableId = parseInt(args.SelfVariableId);
                if (selfVariableId === 0)
                    selfVariableId = undefined;
            }
            $gameVariables.clearSelfVariables(mapId, eventId, selfVariableId);
        });
        PluginManager.registerCommand(SelfVariablePluginName, "GetExSelfSwitchValue", function (args) {
            const mapId = getMapId(this, args);
            const eventId = getEventId(this, args);
            const exSelfSwitchId = parseInt(args.ExSelfSwitchId);
            const destSwitchId = parseInt(args.DestSwitchId);
            const key = [mapId, eventId, exSelfSwitchId];
            const value = $gameSwitches.exSelfSwitchValue(key);
            $gameSwitches.setValue(destSwitchId, value);
        });
        // NOTE: SetExSelfVariableValueは誤記だが旧版との互換性を考慮してこのままとする。
        PluginManager.registerCommand(SelfVariablePluginName, "SetExSelfVariableValue", function (args) {
            const mapId = getMapId(this, args);
            const eventId = getEventId(this, args);
            const exSelfSwitchId = parseInt(args.ExSelfSwitchId);
            let value = args.Value === "true";
            const srcSwitchId = parseInt(args.SrcSwitchId);
            const key = [mapId, eventId, exSelfSwitchId];
            if (srcSwitchId > 0) {
                value = $gameSwitches.value(srcSwitchId);
            }
            $gameSwitches.setExSelfSwitchValue(key, value);
        });
        PluginManager.registerCommand(SelfVariablePluginName, "SetExSelfSwitchValueByEventTags", function (args) {
            const eventTags = JSON.parse(args.EventTags);
            const exSelfSwitchId = parseInt(args.ExSelfSwitchId);
            let value = args.Value === "true";
            const srcSwitchId = parseInt(args.SrcSwitchId);
            if (srcSwitchId > 0) {
                value = $gameSwitches.value(srcSwitchId);
            }
            $gameSwitches.setExSelfSwitchValueByEventTags(eventTags, exSelfSwitchId, value);
        });
        PluginManager.registerCommand(SelfVariablePluginName, "ClearExSelfSwitches", function (args) {
            const mapId = getMapId(this, args);
            let eventId;
            if (args.EventSpecification !== "false") {
                eventId = getEventId(this, args);
            }
            let exSelfSwitchId;
            if (args.ExSelfSwitchId) {
                exSelfSwitchId = parseInt(args.ExSelfSwitchId);
                if (exSelfSwitchId === 0)
                    exSelfSwitchId = undefined;
            }
            $gameSwitches.clearExSelfSwitches(mapId, eventId, exSelfSwitchId);
        });
    }
    class ErrorManager {
        static invalidThisEvent() {
            let errorMessage;
            if (ErrorLanguage === "ja") {
                errorMessage = `このイベントではイベントID=0をプラグインコマンドとして使用することはできません。`;
            }
            else {
                errorMessage = `Event ID=0 cannot be used as a plugin command for this event.`;
            }
            return new Error(errorMessage);
        }
        static invalidSelfVariableAccess(variableId) {
            let errorMessage;
            if (ErrorLanguage === "ja") {
                errorMessage = `不正なタイミングでのセルフ変数(ID:${variableId})へのアクセスが発生しました。`;
            }
            else {
                errorMessage = `An access to the self variable(ID:${variableId}) occurred at an incorrect timing.`;
            }
            return new Error(errorMessage);
        }
        static invalidCommonVariableAccess(variableId) {
            let errorMessage;
            if (ErrorLanguage === "ja") {
                errorMessage = `不正なタイミングでのコモンインベント変数(ID:${variableId})へのアクセスが発生しました。`;
            }
            else {
                errorMessage = `An access to the common event variable(ID:${variableId}) occurred at an incorrect timing.`;
            }
            return new Error(errorMessage);
        }
    }
    class SelfVariableOrExSwitchUtils {
        static isDebugScene() {
            if (SceneManager._scene instanceof Scene_Debug)
                return true;
            return false;
        }
        static currentExSelfSwitchKey(id) {
            if (globalActiveEvent) {
                return globalActiveEvent.selfVariableOrExSwitchKey(id);
            }
            else if (globalActiveInterpreter) {
                return globalActiveInterpreter.selfVariableOrExSwitchKey(id);
            }
            throw ErrorManager.invalidSelfVariableAccess(id);
        }
        static checkPrefixs(name) {
            const results = [];
            let index = 0;
            let end = false;
            while (!end) {
                end = true;
                if (SelfVariablePrefix) {
                    if (this.checkPrefix(name, index, SelfVariablePrefix)) {
                        results.push("SelfVariable");
                        index += SelfVariablePrefix.length;
                        end = false;
                    }
                }
                if (FloatVariablePrefix) {
                    if (this.checkPrefix(name, index, FloatVariablePrefix)) {
                        results.push("FloatVariable");
                        index += FloatVariablePrefix.length;
                        end = false;
                    }
                }
                if (CommonVariablePrefix) {
                    if (this.checkPrefix(name, index, CommonVariablePrefix)) {
                        results.push("CommonVariable");
                        index += CommonVariablePrefix.length;
                        end = false;
                    }
                }
            }
            return results;
        }
        static checkPrefix(name, index, expectedPrefix) {
            const prefix = name.slice(index, index + expectedPrefix.length);
            return prefix === expectedPrefix;
        }
    }
    SelfVariable.SelfVariableOrExSwitchUtils = SelfVariableOrExSwitchUtils;
    /* class Game_Variables */
    const _Game_Variables_clear = Game_Variables.prototype.clear;
    Game_Variables.prototype.clear = function () {
        _Game_Variables_clear.call(this);
        this._selfVariablesData = {};
    };
    const _Game_Variables_value = Game_Variables.prototype.value;
    Game_Variables.prototype.value = function (variableId) {
        if (this.isSelfVariable(variableId)) {
            if (SelfVariableOrExSwitchUtils.isDebugScene())
                return 0;
            const key = SelfVariableOrExSwitchUtils.currentExSelfSwitchKey(variableId);
            return this.selfVariableValue(key);
        }
        else if (this.isCommonVariable(variableId)) {
            if (SelfVariableOrExSwitchUtils.isDebugScene())
                return 0;
            if (globalActiveInterpreter) {
                return globalActiveInterpreter.commonVariableValue(variableId);
            }
            else {
                throw ErrorManager.invalidCommonVariableAccess(variableId);
            }
        }
        return _Game_Variables_value.call(this, variableId);
    };
    Game_Variables.prototype.setValue = function (variableId, value) {
        if (this.isSelfVariable(variableId)) {
            if (SelfVariableOrExSwitchUtils.isDebugScene())
                return;
            const key = SelfVariableOrExSwitchUtils.currentExSelfSwitchKey(variableId);
            this.setSelfVariableValue(key, value);
        }
        else if (this.isCommonVariable(variableId)) {
            if (SelfVariableOrExSwitchUtils.isDebugScene())
                return;
            if (globalActiveInterpreter) {
                globalActiveInterpreter.setCommonVariableValue(variableId, value);
            }
            else {
                throw ErrorManager.invalidCommonVariableAccess(variableId);
            }
        }
        else {
            if (variableId > 0 && variableId < $dataSystem.variables.length) {
                if (!this.isFloatVariable(variableId) && (typeof value === "number")) {
                    value = Math.floor(value);
                }
                this._data[variableId] = value;
                this.onChange();
            }
        }
    };
    Game_Variables.prototype.isSelfVariable = function (variableId) {
        const name = $dataSystem.variables[variableId];
        if (!name)
            return false;
        const prefixs = SelfVariableOrExSwitchUtils.checkPrefixs(name);
        return prefixs.includes("SelfVariable");
    };
    Game_Variables.prototype.isCommonVariable = function (variableId) {
        const name = $dataSystem.variables[variableId];
        if (!name)
            return false;
        const prefixs = SelfVariableOrExSwitchUtils.checkPrefixs(name);
        return prefixs.includes("CommonVariable");
    };
    Game_Variables.prototype.isFloatVariable = function (variableId) {
        const name = $dataSystem.variables[variableId];
        if (!name)
            return false;
        const prefixs = SelfVariableOrExSwitchUtils.checkPrefixs(name);
        return prefixs.includes("FloatVariable");
    };
    Game_Variables.prototype.selfVariableValue = function (key) {
        return this._selfVariablesData[key] || 0;
    };
    Game_Variables.prototype.setSelfVariableValue = function (key, value) {
        const variableId = key[2];
        if (variableId > 0 && variableId < $dataSystem.variables.length) {
            if (!this.isFloatVariable(variableId) && (typeof value === "number")) {
                value = Math.floor(value);
            }
            this._selfVariablesData[key] = value;
            this.onChange();
        }
    };
    Game_Variables.prototype.setSelfVariableValueByEventTags = function (eventTags, variableId, value) {
        for (const event of $gameMap.events()) {
            for (const tag of eventTags) {
                if (event.eventTags().includes(tag)) {
                    event.setSelfVariableValue(variableId, value);
                    break;
                }
            }
        }
    };
    Game_Variables.prototype.clearSelfVariables = function (mapId, eventId = undefined, variableId = undefined) {
        for (const key in this._selfVariablesData) {
            const [keyMapId, keyEventId, keyVariableId] = key.split(",").map(s => parseInt(s));
            if (keyMapId === mapId
                && (eventId == null || keyEventId === eventId)
                && (variableId == null || keyVariableId === variableId)) {
                delete this._selfVariablesData[key];
            }
        }
    };
    /* class Game_Switches */
    const _Game_Switches_clear = Game_Switches.prototype.clear;
    Game_Switches.prototype.clear = function () {
        _Game_Switches_clear.call(this);
        this._exSelfSwitchesData = {};
    };
    const _Game_Switches_value = Game_Switches.prototype.value;
    Game_Switches.prototype.value = function (switchId) {
        if (this.isExSelfSwitch(switchId)) {
            if (SelfVariableOrExSwitchUtils.isDebugScene())
                return false;
            const key = SelfVariableOrExSwitchUtils.currentExSelfSwitchKey(switchId);
            return this.exSelfSwitchValue(key);
        }
        else if (this.isCommonSwitch(switchId)) {
            if (SelfVariableOrExSwitchUtils.isDebugScene())
                return false;
            if (globalActiveInterpreter) {
                return globalActiveInterpreter.commonSwitchValue(switchId);
            }
            else {
                throw ErrorManager.invalidCommonVariableAccess(switchId);
            }
        }
        return _Game_Switches_value.call(this, switchId);
    };
    const _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function (switchId, value) {
        if (this.isExSelfSwitch(switchId)) {
            if (SelfVariableOrExSwitchUtils.isDebugScene())
                return;
            const key = SelfVariableOrExSwitchUtils.currentExSelfSwitchKey(switchId);
            this.setExSelfSwitchValue(key, value);
            return;
        }
        else if (this.isCommonSwitch(switchId)) {
            if (SelfVariableOrExSwitchUtils.isDebugScene())
                return;
            if (globalActiveInterpreter) {
                globalActiveInterpreter.setCommonSwitchValue(switchId, value);
            }
            else {
                throw ErrorManager.invalidCommonVariableAccess(switchId);
            }
        }
        return _Game_Switches_setValue.call(this, switchId, value);
    };
    Game_Switches.prototype.isExSelfSwitch = function (switchId) {
        const name = $dataSystem.switches[switchId];
        if (!name)
            return false;
        const prefixs = SelfVariableOrExSwitchUtils.checkPrefixs(name);
        return prefixs.includes("SelfVariable");
    };
    Game_Switches.prototype.isCommonSwitch = function (switchId) {
        const name = $dataSystem.switches[switchId];
        if (!name)
            return false;
        const prefixs = SelfVariableOrExSwitchUtils.checkPrefixs(name);
        return prefixs.includes("CommonVariable");
    };
    Game_Switches.prototype.exSelfSwitchValue = function (key) {
        return !!this._exSelfSwitchesData[key];
    };
    Game_Switches.prototype.setExSelfSwitchValue = function (key, value) {
        const switchId = key[2];
        if (switchId > 0 && switchId < $dataSystem.switches.length) {
            this._exSelfSwitchesData[key] = value;
            this.onChange();
        }
    };
    Game_Switches.prototype.setExSelfSwitchValueByEventTags = function (eventTags, selfSwitchId, value) {
        for (const event of $gameMap.events()) {
            for (const tag of eventTags) {
                if (event.eventTags().includes(tag)) {
                    event.setExSelfSwitchValue(selfSwitchId, value);
                    break;
                }
            }
        }
    };
    Game_Switches.prototype.clearExSelfSwitches = function (mapId, eventId = undefined, switchId = undefined) {
        for (const key in this._exSelfSwitchesData) {
            const [keyMapId, keyEventId, keySwitchId] = key.split(",").map(s => parseInt(s));
            if (keyMapId === mapId
                && (eventId == null || keyEventId === eventId)
                && (switchId == null || keySwitchId === switchId)) {
                delete this._exSelfSwitchesData[key];
            }
        }
    };
    /* class Game_Interpreter */
    const _Game_Interpreter_clear = Game_Interpreter.prototype.clear;
    Game_Interpreter.prototype.clear = function () {
        _Game_Interpreter_clear.call(this);
        this._commonVariableData = {};
        this._commonSwitchData = {};
    };
    Game_Interpreter.prototype.mapId = function () {
        return this._mapId;
    };
    Game_Interpreter.prototype.eventId = function () {
        return this._eventId;
    };
    Game_Interpreter.prototype.selfVariableOrExSwitchKey = function (id) {
        return [this._mapId, this._eventId, id];
    };
    Game_Interpreter.prototype.commonVariableValue = function (variableId) {
        return this._commonVariableData[variableId] || 0;
    };
    Game_Interpreter.prototype.setCommonVariableValue = function (variableId, value) {
        if (variableId > 0 && variableId < $dataSystem.variables.length) {
            if (!$gameVariables.isFloatVariable(variableId) && (typeof value === "number")) {
                value = Math.floor(value);
            }
            this._commonVariableData[variableId] = value;
        }
    };
    Game_Interpreter.prototype.commonSwitchValue = function (switchId) {
        return !!this._commonSwitchData[switchId];
    };
    Game_Interpreter.prototype.setCommonSwitchValue = function (switchId, value) {
        if (switchId > 0 && switchId < $dataSystem.switches.length) {
            this._commonSwitchData[switchId] = value;
        }
    };
    const _Game_Interpreter_executeCommand = Game_Interpreter.prototype.executeCommand;
    Game_Interpreter.prototype.executeCommand = function () {
        globalActiveInterpreter = this;
        const result = _Game_Interpreter_executeCommand.call(this);
        globalActiveInterpreter = undefined;
        return result;
    };
    /* class Game_Event */
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function (...args) {
        _Game_Event_initialize.call(this, ...args);
        this._eventTags = this.parseEventTags();
    };
    Game_Event.prototype.parseEventTags = function () {
        let eventTags = new Set();
        const note = this.getAnnotation(0);
        const reg = /\<et\s*\:\s*(.+)\>/sg;
        while (true) {
            const matchData = reg.exec(note);
            if (!matchData)
                break;
            eventTags.add(matchData[1]);
        }
        return [...eventTags];
    };
    Game_Event.prototype.eventTags = function () {
        return this._eventTags;
    };
    Game_Event.prototype.addEventTag = function (eventTag) {
        if (!this.hasEventTag(eventTag))
            this._eventTags.push(eventTag);
    };
    Game_Event.prototype.hasEventTag = function (eventTag) {
        return this._eventTags.includes(eventTag);
    };
    Game_Event.prototype.getAnnotationValues = function (page) {
        const note = this.getAnnotation(page);
        const data = { note };
        DataManager.extractMetadata(data);
        return data.meta;
    };
    Game_Event.prototype.getAnnotation = function (page) {
        const eventData = this.event();
        if (eventData) {
            const noteLines = [];
            const pageList = eventData.pages[page].list;
            for (let i = 0; i < pageList.length; i++) {
                if (pageList[i].code === 108 || pageList[i].code === 408) {
                    noteLines.push(pageList[i].parameters[0]);
                }
                else {
                    break;
                }
            }
            return noteLines.join("\n");
        }
        return "";
    };
    Game_Event.prototype.selfVariableValue = function (variableId) {
        const key = this.selfVariableOrExSwitchKey(variableId);
        return $gameVariables.selfVariableValue(key);
    };
    Game_Event.prototype.setSelfVariableValue = function (variableId, value) {
        const key = this.selfVariableOrExSwitchKey(variableId);
        $gameVariables.setSelfVariableValue(key, value);
    };
    Game_Event.prototype.exSelfSwitchValue = function (switchId) {
        const key = this.selfVariableOrExSwitchKey(switchId);
        return $gameSwitches.exSelfSwitchValue(key);
    };
    Game_Event.prototype.setExSelfSwitchValue = function (switchId, value) {
        const key = this.selfVariableOrExSwitchKey(switchId);
        $gameSwitches.setExSelfSwitchValue(key, value);
    };
    const _Game_Event_refresh = Game_Event.prototype.refresh;
    Game_Event.prototype.refresh = function () {
        globalActiveEvent = this;
        _Game_Event_refresh.call(this);
        globalActiveEvent = undefined;
    };
    // 移動ルートからスクリプト経由でセルフ変数にアクセスできるようにする。
    const _Game_Event_processMoveCommand = Game_Event.prototype.processMoveCommand;
    Game_Event.prototype.processMoveCommand = function (command) {
        globalActiveEvent = this;
        _Game_Event_processMoveCommand.call(this, command);
        globalActiveEvent = undefined;
    };
    Game_Event.prototype.selfVariableOrExSwitchKey = function (id) {
        return [$gameMap.mapId(), this.eventId(), id];
    };
})(SelfVariable || (SelfVariable = {}));
