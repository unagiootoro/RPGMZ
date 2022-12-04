"use strict";
/*:
@target MV MZ
@plugindesc スキルツリー v2.0.0-b1
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SkillTree.js
@help
【使用方法】
■ スキルツリーの設定
スキルツリーの設定は、「SkillTreeConfig.js」ファイルを編集することで行います。
基本的な設定としては、アクターごとにスキルツリーのタイプ(剣スキルや魔法スキルなど)を設定し、
そしてタイプごとにスキルツリーを構築します。
スキルツリーの構築は、スキルの派生設定(ファイアⅠを取得したらファイアⅡが取得可能になるなど)によって行います。

■ SPの入手設定
スキルの習得には、SPが必要となります。
SPの入手方法としては
・戦闘終了による獲得
・レベルアップによるSP獲得
の二通りの設定を行うことができます。

・戦闘終了時に得られるSPの設定方法
敵キャラのメモ欄に
<battleEndGainSp: SP>
の形式で記載します。

・レベルアップによるSP獲得方法の設定
コンフィグの「levelUpGainSp」によって設定を行います。

■ イベントでSPを獲得する方法
スクリプトで
skt_gainSp(アクターID, 獲得するSP値)
と記載することで、該当のアクターが指定したSPを獲得することができます。
例えば、アクターIDが1のアクターが5SPを獲得する場合、
skt_gainSp(1, 5);
と記載します。

■ 割り振った累計SPの取得
skt_totalSp(アクターID, 累計SP格納先変数ID)
と記載することで、該当のアクターが今までに割り振ったSPを指定した変数に代入することができます。
例えば、アクターIDが1のアクターの累計SPをID2の変数に代入する場合、
skt_totalSp(1, 2);
と記載します。

■ スキルリセット
スクリプトで
skt_skillReset(アクターID);
と記載することで、一度習得したスキルをリセットすることができます。
例えば、アクターIDが1のアクターのスキルリセットを行う場合、
skt_skillReset(1);
と記載します。

■ スキルツリータイプの有効/無効
スクリプトで
skt_enableType(アクターID, "タイプ名");
と記載することで、タイプを有効にします。

無効にする場合は、
skt_disableType(アクターID, "タイプ名")
と記載します。

無効にしたタイプは、スキルツリーのタイプ一覧には表示されません。

■ タイプの引継ぎ
特定の条件を満たすとスキルツリーに新たなスキルが追加されるようにしたい場合、「タイプの引継ぎ」を使用します。
例えば、タイプ「下位魔法」を「上位魔法」に変更したい場合、あらかじめ両方のタイプをコンフィグに登録した上で、
「上位魔法」は無効化しておきます。そして、タイプの引継ぎ機能を用いて、「下位魔法」を「上位魔法」に引き継がせます。

タイプの引継ぎを行う場合、スクリプトで
skt_migrationType(アクターID, "引継ぎ元タイプ名", "引継ぎ先タイプ名", リセット有無);
と記載します。リセット有無については、引継ぎ後、引継ぎ元のタイプのスキルツリーをリセットする場合、trueを、
リセットしない場合、falseを指定します。
例えば、アクターIDが1のアクターが、タイプ「下位魔法」を「上位魔法」に引き継がせ、さらにスキルリセットを行う場合、
skt_migrationType(アクターID, "下位魔法", "上位魔法", true);
と記載します。

■ マップからスキルツリーを読み込む
マップからスキルツリーの各スキルの配置座標を読み込むことで、ある程度自由なレイアウトのスキルツリーを
作成することができます。この機能によって設定可能なのはスキルの座標のみであり、スキル間の線はプラグイン側で描画します。

・スキル座標の設定
マップ上のイベントにて、設定を行います。
例えば、"ファイア"というスキルがある場合、スキルを配置したい座標に空のイベントを作成し、
イベントのメモ欄に
ファイア
と記載します。すると、"ファイア"とメモ欄に記載したイベントのXY座標がスキルのXY座標として使用されます。

■ スクリプトからスキルツリーを起動
スクリプトで
skt_open(アクターID);
と記載することで、指定したアクターのスキルツリーを起動することができます。

■ スクリプトからスキルツリーのスキルを取得する
スクリプトで
skt_learn(アクターID, "タイプ名", スキル名, 強制取得有無(省略可));
と記載することで、指定したスキルを取得することができます。
スキル名は「skillTreeInfo」で指定したものを使用してください。
強制取得有無にtrueを設定した場合、習得可能か否かの判定を無視して強制的にスキルを取得します。
また、この場合SPは消費されません。
強制取得有無にfalseを設定した場合は通常通りの方法でスキルを取得します。この場合はSPも消費されます。
なおこの項目については省略可能です。省略した場合はfalseが適用されます。
例: アクターID1のキャラクターで、タイプ「剣技」のスキルツリーの「強撃」を取得する場合
skt_learn(1, "剣技", "強撃", false);

■ スキルツリーの横配置と縦配置
プラグインパラメータ「ビューレイアウト」内の「ビューモード」を設定することで、
スキルツリーを横方向に展開させるか縦方向に展開させるかを選択することができます。

■ スキル習得時の代わりにコモンイベントを実行する。
スキルのメモ欄に「LearnCommonEventId」を設定することで、
スキル習得時にスキルを覚える代わりにコモンイベントを実行することができます。
例えば、スキルのメモ欄に
<LearnCommonEventId: 1>
と記載すると、スキル習得時にID1のコモンイベントが実行されます。
また、
<ForgetCommonEventId: 2>
と記載した場合は、スキルリセットでスキルを忘れる代わりにID2のコモンイベントが実行されます。

■ プラグインコマンド
ツクールMZの場合、上記で解説したスクリプトを使用する代わりに
プラグインコマンドを使用することが可能です。
詳細については各種プラグインコマンドの説明を参照してください。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@command StartSkillTreeScene
@text スキルツリーシーン開始
@desc
スキルツリーシーンを開始します。

@arg ActorId
@text アクターID
@type actor
@default 1
@desc
スキルツリーシーン開始対象のアクターIDを指定します。


@command SkillLearn
@text スキル習得
@desc
指定したスキルツリーのスキルを習得します。

@arg ActorId
@text アクターID
@type actor
@default 1
@desc
アクターIDを指定します。

@arg TypeName
@text タイプ名
@type string
@desc
タイプ名を指定します。

@arg SkillId
@text スキルID
@type number
@desc
習得するスキルIDを指定します。


@command GainSp
@text SP獲得
@desc
SPを獲得します。

@arg ActorId
@text アクターID
@type actor
@default 1
@desc
SP獲得対象のアクターIDを指定します。

@arg SpValue
@text SP値
@type number
@min -9999
@default 1
@desc
獲得するSP値を指定します。マイナスの値を指定するとSPを減らすことができます。

@arg SpValueVariableId
@text SP値(変数)
@type number
@default 0
@desc
変数で指定したSPを獲得します。SP値を直接指定した場合、このパラメータには0を指定してください。


@command GetTotalSp
@text トータルSP取得
@desc
割り振った全SPの値を取得します。

@arg ActorId
@text アクターID
@type actor
@default 1
@desc
トータルSP取得対象のアクターIDを指定します。

@arg DestVariableId
@text 格納先変数
@type variable
@default 1
@desc
取得したトータルSPを格納する変数IDを指定します。


@command SkillReset
@text スキルリセット
@desc
スキルリセットを実行します。

@arg ActorId
@text アクターID
@type actor
@default 1
@desc
スキルリセット実行対象のアクターIDを指定します。


@command SetTypeEnableOrDisable
@text タイプ有効/無効設定
@desc
スキルツリータイプの有効/無効を設定します。

@arg ActorId
@text アクターID
@type actor
@default 1
@desc
タイプ設定対象のアクターIDを指定します。

@arg TypeName
@text タイプ名
@type string
@desc
タイプ名を指定します。

@arg EnableOrDisable
@text 有効/無効
@type boolean
@desc
trueを設定するとタイプを有効にします。falseを設定するとタイプを無効にします。


@command MigrationType
@text タイプ引継ぎ
@desc
指定したスキルツリータイプを別のタイプに引き継ぎます。

@arg ActorId
@text アクターID
@type actor
@default 1
@desc
タイプ引継ぎ対象のアクターIDを指定します。

@arg SrcTypeName
@text 引継ぎ元タイプ名
@type string
@desc
タイプ名を指定します。

@arg DestTypeName
@text 引継ぎ先タイプ名
@type string
@desc
タイプ名を指定します。

@arg Reset
@text リセット有無
@type boolean
@default false
@desc
trueを指定すると、スキル引継ぎ後に引継ぎ元タイプのスキルツリーをリセットします。


@param MaxSp
@text 最大SP
@type number
@default 9999
@desc
取得可能なSPの最大値を設定します。

@param EnabledSkillTreeSwitchId
@text メニュースキルツリー有効化スイッチID
@type switch
@default 0
@desc
メニューコマンドでスキルツリーを有効/無効を設定するスイッチのIDを指定します。0を指定すると常にスキルツリーは有効になります。

@param EnableGetSpWhenBattleEnd
@text 戦闘終了時SP入手有効化
@type boolean
@default true
@desc
trueを設定すると、戦闘終了時にSPを入手できるようになります。

@param EnableGetSpWhenLevelUp
@text レベルアップ時SP入手有効化
@type boolean
@default true
@desc
trueを設定すると、レベルアップ時にSPを入手できるようになります。

@param SkillTreeManagementByClasses
@text 職業別スキルツリー管理
@type boolean
@default true
@desc
trueを設定すると、アクターごとの職業ごとにスキルツリーを管理するようにします。

@param ViewLayout
@text ビューレイアウト
@type struct<ViewLayout>
@desc
スキルツリービューのレイアウトに関するパラメータを設定します。

@param WindowLayout
@text ウィンドウレイアウト
@type struct<WindowLayout>
@default {"SkillTreeNodeInfoWidowHeight":"110","ActorInfoWindowHeight":"200","ActorInfoWindowFaceHeight":"100"}
@desc
ウィンドウのレイアウトに関するパラメータを設定します。

@param LearnSkillSe
@text スキル取得SE
@type struct<SE>
@default
@desc
スキルを習得したときに再生するSEを指定します。

@param IconXOfs
@text 拡張表示アイコンX座標オフセット
@type number
@default 5
@desc
拡張表示のアイコンのX座標オフセットを指定します。

@param OpenedImage
@text オープン済み画像
@type struct<OpenedImage>
@desc
習得済みスキルに追加する画像を設定します。

@param ChangeOpenedTextColor
@text 拡張表示オープン済みテキスト色
@type boolean
@default true
@desc
trueを設定すると、習得済みスキルの文字の色を変更します。

@param IconFontSize
@text 拡張表示アイコンフォントサイズ
@type number
@default 20
@desc
スキルの文字のフォントサイズを指定します。

@param BackgroundImage
@text 背景画像
@type struct<BackgroundImage>
@default {"FileName":"","BackgroundImage2":"[]","BackgroundImage2XOfs":"240","BackgroundImage2YOfs":"300"}
@desc
スキルツリーシーンの背景画像を設定します。

@param Text
@text テキスト一覧
@type struct<Text>
@default
@desc
各種テキストを指定します。
*/
/*~struct~ViewLayout:
@param ViewMode
@text ビューモード
@type select
@option ワイド
@value wide
@option ロング
@value long
@default wide
@desc
ワイドを設定すると、横にスキルツリーを表示します。ロングを設定すると、縦にスキルツリーを表示します。

@param EnableMZLayout
@text MZレイアウト有効化
@type boolean
@default false
@desc
trueを設定すると、RPGツクールMZのレイアウト形式に合わせます。(MZ限定)

@param IconWidth
@text アイコン横幅
@type number
@default 32
@desc
アイコンの横幅を指定します。

@param IconHeight
@text アイコン縦幅
@type number
@default 32
@desc
アイコンの縦幅を指定します。

@param IconSpaceWidth
@text アイコン間横スペース
@type number
@default 32
@desc
アイコン間のスペースの横幅を指定します。

@param IconSpaceHeight
@text アイコン間縦スペース
@type number
@default 32
@desc
アイコン間のスペースの縦幅を指定します。

@param ViewLineWidth
@text ビューライン幅
@type number
@default 2
@desc
ラインの幅を指定します。

@param ViewLineColorBase
@text スキル未収得ラインカラー
@type string
@default #000000
@desc
スキル未習得の線の色を指定します。

@param ViewLineColorLearned
@text スキル習得済みラインカラー
@type string
@default #00aaff
@desc
スキル習得済みの線の色を指定します。

@param ViewBeginXOffset
@text 描画開始X座標
@type number
@default 24
@desc
スキルツリーの描画開始X座標を指定します。

@param ViewBeginYOffset
@text 描画開始Y座標
@type number
@default 24
@desc
スキルツリーの描画開始Y座標を指定します。

@param ViewCursorOfs
@text カーソル座標オフセット
@type number
@default 6
@desc
スキルツリーのアイコンに対するカーソルの座標オフセットを指定します。

@param ViewRectColor
@text 取得済み矩形枠線色
@type string
@default #ffff00
@desc
取得済みスキルのアイコンを囲む枠線の色を指定します。

@param ViewRectOfs
@text 取得済み矩形座標オフセット
@type number
@default 1
@desc
取得済みスキルのアイコンを囲む枠線または枠画像の座標オフセットを指定します。
*/
/*~struct~WindowLayout:
@param SkillTreeNodeInfoWidowHeight
@text スキルツリーノード情報ウィンドウ縦幅
@type number
@default 110
@desc
スキルツリーノード情報ウィンドウの縦幅を指定します。

@param ActorInfoWindowHeight
@text アクター情報ウィンドウ縦幅
@type number
@default 200
@desc
アクター情報ウィンドウの縦幅を指定します。

@param ActorInfoWindowFaceHeight
@text アクター情報ウィンドウ顔グラフィック縦幅
@type number
@default 100
@desc
アクター情報ウィンドウに表示する顔グラフィックの縦幅を指定します。
*/
/*~struct~SE:
@param FileName
@text SEファイル名
@type file
@dir audio/se
@default Skill1
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
/*~struct~Text:
@param MenuSkillTreeText
@text メニュースキルツリーテキスト
@type string
@default スキルツリー
@desc
メニューコマンドに表示するスキルツリーのコマンド名を指定します。

@param SpName
@text SP名称
@type string
@default SP
@desc
ゲーム中でのSPの名称を指定します。

@param NeedSpText
@text 必要SPテキスト
@type string
@default 必要%1：
@desc
スキルツリーウィンドウに表示する必要SPのテキストを指定します。%1:SP名

@param NeedGoldText
@text 必要ゴールドテキスト
@type string
@default 必要%1：
@desc
スキルツリーウィンドウに表示する必要ゴールドのテキストを指定します。%1:ゴールド名

@param OpenedNodeText
@text オープン済みテキスト
@type string
@default 取得済み
@desc
スキルが取得済みの場合に必要SPの代わりに表示するテキストを指定します。

@param NodeOpenConfirmationText
@text オープン確認テキスト
@type string
@default %1%2を消費して%3を取得しますか？
@desc
スキル取得有無の選択画面で、確認用のテキストを表示します。%1:消費するSP値, %2:SP名, %3:取得するスキル名

@param NodeOpenYesText
@text オープンYesテキスト
@type string
@default 習得する
@desc
スキル取得有無の選択画面で、スキルを取得する場合のテキストを指定します。

@param NodeOpenNoText
@text オープンNoテキスト
@type string
@default 習得しない
@desc
スキル取得有無の選択画面で、スキルを取得しない場合のテキストを指定します。

@param BattleEndGetSpText
@text バトル終了時SP入手テキスト
@type string
@default %1%2を入手した。
@desc
戦闘終了時にSPを入手したときに表示するテキストを指定します。%1:入手するSP値, %2:SP名

@param LevelUpGetSpText
@text レベルアップ時SP入手テキスト
@type string
@default %1%2を入手した。
@desc
レベルアップ時にSPを入手したときに表示するテキストを指定します。%1:入手するSP値, %2:SP名
*/
/*~struct~OpenedImage:
@param EnableOpenedImage
@text オープン済み画像有効化
@type boolean
@default false
@desc
trueを設定すると、習得済みスキルに画像を追加します。

@param FileName
@text ファイル名
@type file
@dir img
@desc
習得済みスキルに追加する画像のファイル名を指定します。

@param XOfs
@text X座標オフセット
@type number
@default 0
@desc
習得済みスキルに追加する画像のX座標オフセットを指定します。

@param YOfs
@text Y座標オフセット
@type number
@default 0
@desc
習得済みスキルに追加する画像のY座標オフセットを指定します。
*/
/*~struct~BackgroundImage:
@param FileName
@text ファイル名
@type file
@dir img
@desc
スキルツリーシーンの背景画像のファイル名を指定します。

@param BackgroundImage2
@text 背景画像2
@type struct<BackgroundImage2>[]
@default []
@dir img
@desc
スキルツリーシーンの背景画像に追加する画像のファイル名を指定します。

@param BackgroundImage2XOfs
@text 背景画像2 X座標オフセット
@type number
@default 240
@desc
スキルツリーシーンの背景画像に追加する画像のX座標オフセットを指定します。

@param BackgroundImage2YOfs
@text 背景画像2 Y座標オフセット
@type number
@default 300
@desc
スキルツリーシーンの背景画像に追加する画像のY座標オフセットを指定します。
*/
/*~struct~BackgroundImage2:
@param FileName
@text ファイル名
@type file
@dir img
@desc
スキルツリーシーンの背景画像のファイル名を指定します。

@param ActorId
@text アクターID
@type actor
@desc
アクターIDを指定します。
*/
const SkillTreePluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "SkillTree";
let $skillTreeData;
let $skillTreeConfigLoader;
const $skillTreeMapLoaders = new Map();
function skt_open(actorId) {
    $gameParty.setMenuActor($gameActors.actor(actorId));
    SceneManager.push(SkillTreeClassAlias.Scene_SkillTree);
}
function skt_gainSp(actorId, value) {
    const actor = $gameParty.members().find((actor) => actor.actorId() === actorId);
    if (actor)
        actor.gainSp(value);
}
function skt_skillReset(actorId) {
    const totalSp = $skillTreeData.totalSpAllTypes(actorId);
    $skillTreeData.skillResetAllTypes(actorId);
    $skillTreeData.gainSp(actorId, totalSp);
}
function skt_totalSp(actorId, variableId) {
    const totalSp = $skillTreeData.totalSpAllTypes(actorId);
    $gameVariables.setValue(variableId, totalSp);
}
function skt_learn(actorId, typeName, skillId, force = false) {
    const types = $skillTreeData.types(actorId);
    const findedType = types.find((type) => type.skillTreeName() === typeName);
    if (!findedType)
        return;
    if (force) {
        $skillTreeData.forceOpenNode(findedType, skillId);
    }
    else {
        $skillTreeData.openNode(findedType, skillId);
    }
}
function skt_enableType(actorId, typeName) {
    const types = $skillTreeData.types(actorId);
    let targetType = null;
    for (const type of types) {
        if (type.skillTreeName() === typeName) {
            targetType = type;
        }
    }
    if (!targetType)
        return;
    targetType.setEnabled(true);
}
function skt_disableType(actorId, typeName) {
    const types = $skillTreeData.types(actorId);
    let targetType = null;
    for (const type of types) {
        if (type.skillTreeName() === typeName) {
            targetType = type;
        }
    }
    if (!targetType)
        return;
    targetType.setEnabled(false);
}
function skt_migrationType(actorId, fromTypeName, toTypeName, reset) {
    let dstType = null;
    let srcType = null;
    const types = $skillTreeData.types(actorId);
    for (const type of types) {
        if (type.skillTreeName() === fromTypeName) {
            srcType = type;
        }
        else if (type.skillTreeName() === toTypeName) {
            dstType = type;
        }
    }
    if (!dstType || !srcType)
        return;
    srcType.setEnabled(false);
    dstType.setEnabled(true);
    if (reset) {
        const resetSp = $skillTreeData.totalSp(srcType);
        $skillTreeData.skillReset(srcType);
        $skillTreeData.gainSp(actorId, resetSp);
    }
    else {
        $skillTreeData.copyTree(dstType, srcType);
        $skillTreeData.skillReset(srcType);
    }
}
var SkillTree;
(function (SkillTree) {
    class PluginParamsParser {
        constructor(predictEnable = true) {
            this._predictEnable = predictEnable;
        }
        static parse(params, typeData, predictEnable = true) {
            return new PluginParamsParser(predictEnable).parse(params, typeData);
        }
        parse(params, typeData, loopCount = 0) {
            if (++loopCount > 255)
                throw new Error("endless loop error");
            const result = {};
            for (const name in typeData) {
                if (params[name] === "" || params[name] === undefined) {
                    result[name] = null;
                }
                else {
                    result[name] = this.convertParam(params[name], typeData[name], loopCount);
                }
            }
            if (!this._predictEnable)
                return result;
            if (typeof params === "object" && !(params instanceof Array)) {
                for (const name in params) {
                    if (result[name])
                        continue;
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
            }
            else if (typeof type === "object" && type instanceof Array) {
                const aryParam = JSON.parse(param);
                if (type[0] === "string") {
                    return aryParam.map((strParam) => this.cast(strParam, type[0]));
                }
                else {
                    return aryParam.map((strParam) => this.parse(JSON.parse(strParam), type[0]), loopCount);
                }
            }
            else if (typeof type === "object") {
                return this.parse(JSON.parse(param), type, loopCount);
            }
            else {
                throw new Error(`${type} is not string or object`);
            }
        }
        cast(param, type) {
            switch (type) {
                case "any":
                    if (!this._predictEnable)
                        throw new Error("Predict mode is disable");
                    return this.cast(param, this.predict(param));
                case "string":
                    return param;
                case "number":
                    if (param.match(/^\-?\d+\.\d+$/))
                        return parseFloat(param);
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
            }
            else if (param === "true" || param === "false") {
                return "boolean";
            }
            else {
                return "string";
            }
        }
    }
    const typeDefine = {
        ViewLayout: {},
        WindowLayout: {},
        Text: {},
        LearnSkillSe: {},
        OpenedImage: {},
        BackgroundImage: {
            BackgroundImage2: [{}]
        },
    };
    const PP = PluginParamsParser.parse(PluginManager.parameters(SkillTreePluginName), typeDefine);
    const MaxSp = PP.MaxSp;
    const EnableGetSpWhenBattleEnd = PP.EnableGetSpWhenBattleEnd;
    const EnableGetSpWhenLevelUp = PP.EnableGetSpWhenLevelUp;
    const SkillTreeManagementByClasses = PP.SkillTreeManagementByClasses;
    const EnabledSkillTreeSwitchId = PP.EnabledSkillTreeSwitchId;
    const EnableMZLayout = PP.EnableMZLayout;
    const ViewMode = PP.ViewLayout.ViewMode;
    const IconWidth = PP.ViewLayout.IconWidth;
    const IconHeight = PP.ViewLayout.IconHeight;
    const IconSpaceWidth = PP.ViewLayout.IconSpaceWidth;
    const IconSpaceHeight = PP.ViewLayout.IconSpaceHeight;
    const ViewLineWidth = PP.ViewLayout.ViewLineWidth;
    const ViewLineColorBase = PP.ViewLayout.ViewLineColorBase;
    const ViewLineColorLearned = PP.ViewLayout.ViewLineColorLearned;
    const ViewBeginXOffset = PP.ViewLayout.ViewBeginXOffset;
    const ViewBeginYOffset = PP.ViewLayout.ViewBeginYOffset;
    const ViewCursorOfs = PP.ViewLayout.ViewCursorOfs;
    const ViewRectOfs = PP.ViewLayout.ViewRectOfs;
    const ViewRectColor = PP.ViewLayout.ViewRectColor;
    const SkillTreeNodeInfoWidowHeight = PP.WindowLayout.SkillTreeNodeInfoWidowHeight;
    const ActorInfoWindowHeight = PP.WindowLayout.ActorInfoWindowHeight;
    const ActorInfoWindowFaceHeight = PP.WindowLayout.ActorInfoWindowFaceHeight;
    const LearnSkillSeFileName = PP.LearnSkillSe.FileName;
    const LearnSkillSeVolume = PP.LearnSkillSe.Volume;
    const LearnSkillSePitch = PP.LearnSkillSe.Pitch;
    const LearnSkillSePan = PP.LearnSkillSe.Pan;
    const SpName = PP.Text.SpName;
    const MenuSkillTreeText = PP.Text.MenuSkillTreeText;
    const NeedSpText = PP.Text.NeedSpText;
    const NeedGoldText = PP.Text.NeedGoldText;
    const OpenedNodeText = PP.Text.OpenedNodeText;
    const NodeOpenConfirmationText = PP.Text.NodeOpenConfirmationText;
    const NodeOpenYesText = PP.Text.NodeOpenYesText;
    const NodeOpenNoText = PP.Text.NodeOpenNoText;
    const BattleEndGetSpText = PP.Text.BattleEndGetSpText;
    const LevelUpGetSpText = PP.Text.LevelUpGetSpText;
    const OpenedImage = PP.OpenedImage;
    const BackgroundImage = PP.BackgroundImage;
    const ChangeOpenedTextColor = PP.ChangeOpenedTextColor;
    const IconXOfs = PP.IconXOfs;
    const IconFontSize = PP.IconFontSize;
    class HttpResponse {
        constructor(result, xhr) {
            this._result = result;
            this._xhr = xhr;
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
        constructor(path, method, opt = {}) {
            this._path = path;
            this._method = method;
            this._mimeType = opt.mimeType == null ? null : opt.mimeType;
        }
        static get(path, opt = {}) {
            const req = new HttpRequest(path, "GET", opt);
            return req.send();
        }
        static post(path, params, opt = {}) {
            const req = new HttpRequest(path, "POST", opt);
            return req.send(params);
        }
        send(params = null) {
            const xhr = new XMLHttpRequest();
            xhr.open(this._method, this._path);
            if (this._mimeType)
                xhr.overrideMimeType(this._mimeType);
            let json = null;
            if (params)
                json = JSON.stringify(params);
            const promise = new Promise((resolve, reject) => {
                xhr.addEventListener("load", (e) => {
                    resolve(new HttpResponse("load", xhr));
                });
                xhr.addEventListener("error", (e) => {
                    reject(new HttpResponse("error", xhr));
                });
            });
            xhr.send(json);
            return promise;
        }
    }
    // Register plugin command.
    if (Utils.RPGMAKER_NAME === "MZ") {
        PluginManager.registerCommand(SkillTreePluginName, "StartSkillTreeScene", (args) => {
            const params = PluginParamsParser.parse(args, { ActorId: "number" });
            $gameParty.setMenuActor($gameActors.actor(params.ActorId));
            SceneManager.push(Scene_SkillTree);
        });
        PluginManager.registerCommand(SkillTreePluginName, "SkillLearn", (args) => {
            const params = PluginParamsParser.parse(args, { ActorId: "number", TypeName: "string", SkillId: "number" });
            skt_learn(params.ActorId, params.TypeName, params.SkillId);
        });
        PluginManager.registerCommand(SkillTreePluginName, "GainSp", (args) => {
            const params = PluginParamsParser.parse(args, { ActorId: "number", SpValue: "number", SpValueVariableId: "number" });
            let spValue;
            if (params.SpValueVariableId === 0) {
                spValue = params.SpValue;
            }
            else {
                spValue = $gameVariables.value(params.SpValueVariableId);
            }
            skt_gainSp(params.ActorId, spValue);
        });
        PluginManager.registerCommand(SkillTreePluginName, "GetTotalSp", (args) => {
            const params = PluginParamsParser.parse(args, { ActorId: "number", DestVariableId: "number" });
            skt_totalSp(params.ActorId, params.DestVariableId);
        });
        PluginManager.registerCommand(SkillTreePluginName, "SkillReset", (args) => {
            const params = PluginParamsParser.parse(args, { ActorId: "number" });
            skt_skillReset(params.ActorId);
        });
        PluginManager.registerCommand(SkillTreePluginName, "SetTypeEnableOrDisable", (args) => {
            const params = PluginParamsParser.parse(args, { ActorId: "number", TypeName: "string", EnableOrDisable: "boolean" });
            if (params.EnableOrDisable) {
                skt_enableType(params.ActorId, params.TypeName);
            }
            else {
                skt_disableType(params.ActorId, params.TypeName);
            }
        });
        PluginManager.registerCommand(SkillTreePluginName, "MigrationType", (args) => {
            const params = PluginParamsParser.parse(args, { ActorId: "number", SrcTypeName: "string", DestTypeName: "string", Reset: "boolean" });
            skt_migrationType(params.ActorId, params.SrcTypeName, params.DestTypeName, params.Reset);
        });
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
        partyItemCount() {
            switch (this._type) {
                case "item":
                    return $gameParty.itemCount(this._id);
                case "weapon":
                    return $gameParty.weaponCount(this._id);
                case "armor":
                    return $gameParty.armorCount(this._id);
                default:
                    throw new Error(`${this._type} is not found`);
            }
        }
    }
    class SkillTreeNodeInfo {
        constructor(actorId, skillId, needCost, iconData, helpMessage) {
            this._actorId = actorId;
            this._skillId = skillId;
            if (typeof needCost === "number") {
                this._needCost = { sp: needCost };
            }
            else {
                this._needCost = needCost;
            }
            this._iconData = iconData;
            this._helpMessage = helpMessage;
            if (this._skillId !== 0) {
                const skill = this.skill();
                this._learnCommonEventId = skill.meta.LearnCommonEventId ? parseInt(skill.meta.LearnCommonEventId) : 0;
                this._forgetCommonEventId = skill.meta.ForgetCommonEventId ? parseInt(skill.meta.ForgetCommonEventId) : 0;
            }
            else {
                this._learnCommonEventId = 0;
                this._forgetCommonEventId = 0;
            }
        }
        actorId() {
            return this._actorId;
        }
        actor() {
            const actor = $gameActors.actor(this._actorId);
            if (!actor)
                throw new Error(`actor id: ${this._actorId} is not found.`);
            return actor;
        }
        skillId() {
            return this._skillId;
        }
        skill() {
            const skill = $dataSkills[this._skillId];
            if (!skill)
                throw new Error(`skill id: ${this._skillId} is not found.`);
            return skill;
        }
        learnSkill() {
            if (this.learnCommonEventId() > 0)
                return;
            this.actor().learnSkill(this._skillId);
        }
        forgetSkill() {
            if (this.forgetCommonEventId() > 0)
                return;
            this.actor().forgetSkill(this._skillId);
        }
        learnCommonEventId() {
            return this._learnCommonEventId;
        }
        forgetCommonEventId() {
            return this._forgetCommonEventId;
        }
        trimIconset(iconIndex) {
            const srcBitmap = ImageManager.loadSystem("IconSet");
            const dstBitmap = new Bitmap(32, 32);
            const sx = iconIndex % 16 * 32;
            const sy = Math.floor(iconIndex / 16) * 32;
            dstBitmap.blt(srcBitmap, sx, sy, 32, 32, 0, 0);
            return dstBitmap;
        }
        iconBitmap(opened) {
            if (this._iconData[0] === "img") {
                return ImageManager.loadPicture(this._iconData[1]);
            }
            else if (this._iconData[0] === "icon") {
                let iconIndex;
                if (this._iconData.length >= 2) {
                    iconIndex = this._iconData[1];
                }
                else {
                    iconIndex = this.skill().iconIndex;
                }
                return this.trimIconset(iconIndex);
            }
            else if (this._iconData[0] === "icon_ex") {
                return this.iconExBitmap(opened);
            }
            throw new Error(`Unknown ${this._iconData[0]}`);
        }
        checkIconBitmapReady() {
            if (this._iconData[0] === "img") {
                const bitmap = ImageManager.loadPicture(this._iconData[1]);
                if (!bitmap.isReady())
                    return false;
            }
            else if (this._iconData[0] === "icon") {
                const iconSet = ImageManager.loadSystem("IconSet");
                if (!iconSet.isReady())
                    return false;
            }
            else if (this._iconData[0] === "icon_ex") {
                const iconSet = ImageManager.loadSystem("IconSet");
                if (!iconSet.isReady())
                    return false;
                if (typeof this._iconData[1] === "string") {
                    const backBitmap = ImageManager.loadPicture(this._iconData[1]);
                    if (!backBitmap.isReady())
                        return false;
                }
                else {
                    const backBitmap = ImageManager.loadPicture(this._iconData[1][0]);
                    if (!backBitmap.isReady())
                        return false;
                }
            }
            else {
                throw new Error(`Unknown ${this._iconData[0]}`);
            }
            return true;
        }
        iconExBitmap(opened) {
            let iconIndex;
            if (this._iconData.length >= 3) {
                iconIndex = this._iconData[2];
            }
            else {
                iconIndex = this.skill().iconIndex;
            }
            const iconBitmap = this.trimIconset(iconIndex);
            const dstBitmap = new Bitmap(IconWidth, IconHeight);
            const dx = IconXOfs;
            let dy = (IconHeight - 32) / 2;
            if (IconHeight % 2 !== 0)
                dy -= 1;
            if (this._iconData.length >= 2 && this._iconData[1]) {
                if (typeof this._iconData[1] === "string") {
                    const backBitmap = ImageManager.loadPicture(this._iconData[1]);
                    if (!backBitmap.isReady())
                        return backBitmap;
                    dstBitmap.blt(backBitmap, 0, 0, IconWidth, IconHeight, 0, 0);
                }
                else {
                    const backBitmap = ImageManager.loadPicture(this._iconData[1][0]);
                    if (!backBitmap.isReady())
                        return backBitmap;
                    const x = this._iconData[1][1] * IconWidth;
                    const y = this._iconData[1][2] * IconHeight;
                    dstBitmap.blt(backBitmap, x, y, IconWidth, IconHeight, 0, 0);
                }
            }
            dstBitmap.blt(iconBitmap, 0, 0, 32, 32, dx, dy);
            const textWidth = IconWidth - 32 - dx - IconXOfs;
            if (Utils.RPGMAKER_NAME === "MZ") {
                dstBitmap.fontFace = $gameSystem.mainFontFace();
            }
            dstBitmap.fontSize = IconFontSize;
            const iconTextSpace = 5;
            if (ChangeOpenedTextColor && opened) {
                const tmpTextColor = dstBitmap.textColor;
                dstBitmap.textColor = this.crisisColor();
                dstBitmap.drawText(this.skill().name, 32 + dx + iconTextSpace, dy, textWidth, 32, "left");
                dstBitmap.textColor = tmpTextColor;
            }
            else {
                dstBitmap.drawText(this.skill().name, 32 + dx + iconTextSpace, dy, textWidth, 32, "left");
            }
            return dstBitmap;
        }
        crisisColor() {
            if (Utils.RPGMAKER_NAME === "MZ")
                return ColorManager.crisisColor();
            // @ts-ignore // MV Compatible
            const dummyWindow = new Window_Base(0, 0, 0, 0);
            return dummyWindow.crisisColor();
        }
        costTypes() {
            if (!this._needCost)
                return [];
            return Object.keys(this._needCost);
        }
        needSp() {
            if (!this._needCost)
                return null;
            return this._needCost.sp;
        }
        needVariables() {
            if (!this._needCost)
                return null;
            return this._needCost.variables;
        }
        needGold() {
            if (!this._needCost)
                return null;
            return this._needCost.gold;
        }
        needItems() {
            if (!this._needCost)
                return null;
            return this._needCost.items;
        }
        helpMessage() {
            return this._helpMessage;
        }
    }
    SkillTree.SkillTreeNodeInfo = SkillTreeNodeInfo;
    class SkillTreeNode {
        constructor(tag) {
            this._tag = tag;
            this._parents = [];
            this._childs = [];
            this._info = null;
            this._opened = false;
            this._point = null;
            this._reservedPoint = null;
            this._needStartCommonEventId = 0;
        }
        get point() { return this._point; }
        set point(_point) { this._point = _point; }
        get parents() { return this._parents; }
        get childs() { return this._childs; }
        tag() {
            return this._tag;
        }
        info() {
            return this._info;
        }
        reservedPoint() {
            return this._reservedPoint;
        }
        setReservedPoint(point) {
            this._reservedPoint = point;
        }
        getAllChilds() {
            let allChilds = [this];
            for (const child of this._childs) {
                allChilds = allChilds.concat(child.getAllChilds());
            }
            return allChilds;
        }
        parent(index) {
            if (index < 0)
                index = this._parents.length - index;
            return this._parents[index % this._parents.length];
        }
        child(index) {
            if (index < 0)
                index = this._childs.length - index;
            return this._childs[index % this._childs.length];
        }
        addChild(child) {
            if (!child)
                throw new Error("child is none.");
            child.parents.push(this);
            this._childs.push(child);
        }
        setup(info) {
            this._info = info;
        }
        isOpenable() {
            return this.isSelectable() && !this.isOpened() && this.canCostConsumption();
        }
        isSelectable() {
            for (const parent of this._parents) {
                if (!parent.isOpened())
                    return false;
            }
            return true;
        }
        isOpened() {
            return this._opened;
        }
        setOpenedStatus(openStatus) {
            this._opened = openStatus;
        }
        open(costConsume = true) {
            if (!this._info)
                return;
            this._info.learnSkill();
            if (costConsume)
                this.costConsumption();
            this._needStartCommonEventId = this._info.learnCommonEventId();
            this._opened = true;
        }
        close() {
            if (!this._info)
                return;
            this._info.forgetSkill();
            this._needStartCommonEventId = this._info.forgetCommonEventId();
            this._opened = false;
        }
        canCostConsumption() {
            if (!this._info)
                return false;
            const actorId = this._info.actorId();
            for (const costType of this.costTypes()) {
                if (costType === "sp") {
                    if ($skillTreeData.sp(actorId) < this.needSp())
                        return false;
                }
                else if (costType === "gold") {
                    if ($gameParty.gold() < this.needGold())
                        return false;
                }
                else if (costType === "variables") {
                    for (const needVariableInfo of this.needVariables()) {
                        const [id, needValue] = needVariableInfo;
                        if ($gameVariables.value(id) < needValue)
                            return false;
                    }
                }
                else if (costType === "items") {
                    for (const needItem of this.needItems()) {
                        const [itemType, id, needCount] = needItem;
                        const itemInfo = new ItemInfo(itemType, id);
                        if (needCount > itemInfo.partyItemCount())
                            return false;
                    }
                }
            }
            return true;
        }
        costConsumption() {
            if (!this._info)
                return;
            const actorId = this._info.actorId();
            for (const costType of this.costTypes()) {
                if (costType === "sp") {
                    $skillTreeData.gainSp(actorId, -this.needSp());
                }
                else if (costType === "gold") {
                    $gameParty.loseGold(this.needGold());
                }
                else if (costType === "variables") {
                    for (const needVariableInfo of this.needVariables()) {
                        const [id, needValue] = needVariableInfo;
                        const currentValue = $gameVariables.value(id);
                        $gameVariables.setValue(id, currentValue - needValue);
                    }
                }
                else if (costType === "items") {
                    for (const needItem of this.needItems()) {
                        const [itemType, id, needCount] = needItem;
                        const itemInfo = new ItemInfo(itemType, id);
                        $gameParty.loseItem(itemInfo.itemData(), needCount);
                    }
                }
            }
        }
        checkNeedStartCommonEventId() {
            const id = this._needStartCommonEventId;
            this._needStartCommonEventId = 0;
            return id;
        }
        clearPointNode() {
            this.point = null;
            if (this._childs.length === 0)
                return;
            for (const child of this._childs) {
                child.clearPointNode();
            }
        }
        makePointNode(x, y, mode) {
            const reservedPoint = this.reservedPoint();
            if (reservedPoint) {
                this.point = reservedPoint;
                x = reservedPoint.x;
                y = reservedPoint.y;
            }
            else {
                if (this.point) {
                    if (mode === "wide") {
                        if (x < this.point.x) {
                            this.point = new Point(this.point.x, y);
                        }
                        else {
                            this.point = new Point(x, this.point.y);
                        }
                    }
                    else if (mode === "long") {
                        if (y < this.point.y) {
                            this.point = new Point(x, this.point.y);
                        }
                        else {
                            this.point = new Point(this.point.x, y);
                        }
                    }
                }
                else {
                    this.point = new Point(x, y);
                }
            }
            if (this._childs.length === 0)
                return 1;
            if (mode === "wide") {
                let yOfs = 0;
                for (const child of this._childs) {
                    yOfs += child.makePointNode(x + 1, y + yOfs, mode);
                }
                return yOfs;
            }
            else if (mode === "long") {
                let xOfs = 0;
                for (const child of this._childs) {
                    xOfs += child.makePointNode(x + xOfs, y + 1, mode);
                }
                return xOfs;
            }
            return 0;
        }
        costTypes() {
            if (!this._info)
                throw new Error("_info is null.");
            return this._info.costTypes();
        }
        needSp() {
            if (!this._info)
                throw new Error("_info is null.");
            return this._info.needSp();
        }
        needVariables() {
            if (!this._info)
                throw new Error("_info is null.");
            return this._info.needVariables();
        }
        needGold() {
            if (!this._info)
                throw new Error("_info is null.");
            return this._info.needGold();
        }
        needItems() {
            if (!this._info)
                throw new Error("_info is null.");
            return this._info.needItems();
        }
        iconBitmap() {
            if (!this._info)
                throw new Error("_info is null.");
            return this._info.iconBitmap(this.isOpened());
        }
        checkIconBitmapReady() {
            if (!this._info)
                throw new Error("_info is null.");
            return this._info.checkIconBitmapReady();
        }
        helpMessage() {
            if (!this._info)
                throw new Error("_info is null.");
            return this._info.helpMessage();
        }
    }
    SkillTree.SkillTreeNode = SkillTreeNode;
    class SkillTreeTopNode extends SkillTreeNode {
        constructor() {
            super(null);
            this._opened = true;
            const dummyInfo = new SkillTreeNodeInfo(0, 0, null, 0, "");
            this.setup(dummyInfo);
        }
        getAllChilds() {
            let allChilds = [];
            for (const child of this._childs) {
                allChilds = allChilds.concat(child.getAllChilds());
            }
            return allChilds;
        }
        skillReset() {
            for (const child of this._childs) {
                if (!(child instanceof SkillTreeTopNode))
                    continue;
                if (child.isOpened())
                    child.skillReset();
            }
        }
    }
    SkillTree.SkillTreeTopNode = SkillTreeTopNode;
    class SkillDataType {
        constructor(skillTreeName, actorId, message, helpMessage, enabled) {
            this._skillTreeName = skillTreeName;
            this._actorId = actorId;
            this._message = message;
            this._helpMessage = helpMessage;
            this._enabled = enabled;
            this._classId = [];
            this._iconIndex = 0;
        }
        message() {
            return this._message;
        }
        skillTreeName() {
            return this._skillTreeName;
        }
        skillTreeTag() {
            return `${this._skillTreeName}_actorId${this._actorId}`;
        }
        helpMessage() {
            return this._helpMessage;
        }
        enabled() {
            return this._enabled;
        }
        setEnabled(enabled) {
            this._enabled = enabled;
        }
        setIconIndex(iconIndex) {
            this._iconIndex = iconIndex;
        }
        iconIndex() {
            return this._iconIndex;
        }
        classId() {
            return this._classId;
        }
        addClassId(classId) {
            if (this._classId) {
                this._classId.push(classId);
            }
            else {
                this._classId = [classId];
            }
        }
    }
    SkillTree.SkillDataType = SkillDataType;
    class SkillTreeMapLoader {
        constructor(mapId) {
            this._mapId = mapId;
        }
        applyMapData(type) {
            const allNodes = $skillTreeData.getAllNodesByType(type);
            for (const eventData of this.mapData().events) {
                if (!eventData)
                    continue;
                let nodeTag = eventData.note;
                let node = allNodes.get(nodeTag);
                if (!node)
                    continue;
                node.setReservedPoint(new Point(eventData.x, eventData.y));
            }
        }
        isLoaded() {
            return !!this._response;
        }
        mapData() {
            return JSON.parse(this._response);
        }
        loadMap() {
            const fileName = "Map%1.json".format(this._mapId.padZero(3));
            this.loadData(fileName);
        }
        async loadData(fileName) {
            const res = await HttpRequest.get(`data/${fileName}`, { mimeType: "application/json" });
            if (res.result() === "error") {
                throw new Error(`Unknow file: ${fileName}`);
            }
            else if (res.status() === 200) {
                this._response = res.response();
            }
            else {
                throw new Error(`Load failed: ${fileName}`);
            }
        }
    }
    SkillTree.SkillTreeMapLoader = SkillTreeMapLoader;
    class SkillTreeConfigLoader {
        constructor() {
            this._configData = loadSkillTreeConfig();
        }
        configData() {
            return this._configData;
        }
        loadConfig(actorId) {
            let types = $skillTreeData.types(actorId);
            if (!types) {
                types = this.loadTypes(actorId);
                $skillTreeData.setTypes(actorId, types);
            }
            for (const type of types) {
                let topNode = $skillTreeData.topNode(type);
                if (!topNode) {
                    topNode = this.loadSkillTreeNodes(type);
                    $skillTreeData.setTopNode(type, topNode);
                    this.loadSkillTreeInfo(actorId, $skillTreeData.getAllNodesByType(type));
                }
            }
        }
        loadTypes(actorId) {
            if (SkillTreeManagementByClasses) {
                return this.loadTypesWhenSkillTreeManagementByClasses(actorId);
            }
            else {
                return this.loadTypesWhenSkillTreeManagementByActor(actorId);
            }
        }
        loadTypesWhenSkillTreeManagementByActor(actorId) {
            let cfgTypes = null;
            let typesArray = [];
            for (const cfg of this._configData.skillTreeTypes) {
                if (cfg.actorId === actorId) {
                    cfgTypes = cfg.types;
                    break;
                }
            }
            if (!cfgTypes)
                return [];
            for (const cfgType of cfgTypes) {
                const enabled = (cfgType.length === 3 ? true : cfgType[3]);
                const type = new SkillDataType(cfgType[0], actorId, cfgType[1], cfgType[2], enabled);
                type.setIconIndex(cfgType[4] ? cfgType[4] : null);
                typesArray.push(type);
            }
            return typesArray;
        }
        loadTypesWhenSkillTreeManagementByClasses(actorId) {
            let typesArray = [];
            for (const cfg of this._configData.skillTreeTypes) {
                for (const cfgType of cfg.types) {
                    const findType = typesArray.find(t => t.skillTreeName() === cfgType[0]);
                    if (findType) {
                        findType.addClassId(cfg.classId);
                    }
                    else {
                        const enabled = (cfgType.length === 3 ? true : cfgType[3]);
                        const type = new SkillDataType(cfgType[0], actorId, cfgType[1], cfgType[2], enabled);
                        if (cfgType[4])
                            type.setIconIndex(cfgType[4] ? cfgType[4] : null);
                        type.addClassId(cfg.classId);
                        typesArray.push(type);
                    }
                }
            }
            return typesArray;
        }
        loadSkillTreeNodes(type) {
            const nodes = new Map();
            let derivative = null;
            for (const skillTreeType in this._configData.skillTreeDerivative) {
                if (skillTreeType === type.skillTreeName()) {
                    derivative = this._configData.skillTreeDerivative[skillTreeType];
                    break;
                }
            }
            if (!derivative)
                throw new Error(`Missing skill type name ${type.skillTreeName()}`);
            for (const data of derivative) {
                const nodeTag = data[0];
                nodes.set(nodeTag, new SkillTreeNode(nodeTag));
            }
            for (const data of derivative) {
                const nodeTag = data[0];
                if (data.length >= 2) {
                    const childsTag = data[1];
                    for (const childTag of childsTag) {
                        const childNode = nodes.get(childTag);
                        if (!childNode)
                            throw new Error(`Unknow derivative ${childTag}`);
                        nodes.get(nodeTag).addChild(childNode);
                    }
                }
            }
            const topNode = new SkillTreeTopNode();
            for (const node of nodes.values()) {
                if (node.parents.length === 0)
                    topNode.addChild(node);
            }
            if (topNode.childs.length === 0)
                throw new Error(`Missing top nodes`);
            return topNode;
        }
        loadSkillTreeInfo(actorId, allNodes) {
            for (const cfgInfoKey in this._configData.skillTreeInfo) {
                const cfgInfo = this._configData.skillTreeInfo[cfgInfoKey];
                const nodeTag = cfgInfo[0];
                const node = allNodes.get(nodeTag);
                if (!node)
                    continue;
                const skillId = cfgInfo[1];
                const needSp = cfgInfo[2];
                let iconData = ["icon"];
                if (cfgInfo.length >= 4)
                    iconData = cfgInfo[3];
                let helpMessage = "";
                if (cfgInfo.length >= 5)
                    helpMessage = cfgInfo[4];
                const info = new SkillTreeNodeInfo(actorId, skillId, needSp, iconData, helpMessage);
                node.setup(info);
            }
            for (const node of allNodes.values()) {
                if (!node.info())
                    throw new Error(`Node ${node.tag()} is missing node info`);
            }
        }
    }
    SkillTree.SkillTreeConfigLoader = SkillTreeConfigLoader;
    class SkillTreeData {
        constructor() {
            this._actorSp = new Map();
            this._topNodes = new Map();
            this._allTypes = new Map();
        }
        actorIds() {
            return this._actorSp.keys();
        }
        sp(actorId) {
            return this._actorSp.get(actorId);
        }
        setSp(actorId, sp) {
            this._actorSp.set(actorId, sp);
        }
        gainSp(actorId, sp) {
            const nowSp = this.sp(actorId);
            this.setSp(actorId, nowSp + sp);
        }
        topNode(type) {
            return this._topNodes.get(type.skillTreeTag());
        }
        setTopNode(type, topNode) {
            this._topNodes.set(type.skillTreeTag(), topNode);
        }
        types(actorId) {
            return this._allTypes.get(actorId);
        }
        enableTypes(actorId) {
            if (SkillTreeManagementByClasses) {
                const actor = $gameActors.actor(actorId);
                const classId = actor.currentClass().id;
                return this.types(actorId).filter((type) => type.enabled() && type.classId().indexOf(classId) >= 0);
            }
            else {
                return this.types(actorId).filter((type) => type.enabled());
            }
        }
        setTypes(actorId, types) {
            this._allTypes.set(actorId, types);
        }
        totalSp(type) {
            let sp = 0;
            for (const node of this.getAllNodesByType(type).values()) {
                if (node.isOpened())
                    sp += node.needSp();
            }
            return sp;
        }
        skillReset(type) {
            for (const node of this.getAllNodesByType(type).values()) {
                if (node.isOpened())
                    node.close();
            }
        }
        totalSpAllTypes(actorId) {
            let sp = 0;
            for (const type of this.enableTypes(actorId)) {
                sp += this.totalSp(type);
            }
            return sp;
        }
        skillResetAllTypes(actorId) {
            for (const type of this.enableTypes(actorId)) {
                this.skillReset(type);
            }
        }
        copyTree(dstType, srcType) {
            const dst = this.getAllNodesByType(dstType);
            const src = this.getAllNodesByType(srcType);
            for (const tag of src.keys()) {
                const srcNode = src.get(tag);
                const dstNode = dst.get(tag);
                if (srcNode && dstNode && srcNode.isOpened()) {
                    srcNode.close();
                    dstNode.open(false);
                }
            }
        }
        openNode(type, skillId) {
            for (const node of this.topNode(type).getAllChilds()) {
                if (node.info().skillId() === skillId && node.isOpenable()) {
                    node.open();
                    return true;
                }
            }
            return false;
        }
        forceOpenNode(type, skillId) {
            for (const node of this.topNode(type).getAllChilds()) {
                if (node.info().skillId() === skillId) {
                    node.open(false);
                    return true;
                }
            }
            return false;
        }
        makePoint(type, mode) {
            this.topNode(type).clearPointNode();
            // Start point is -1 because first node is dummy. 
            if (mode === "wide") {
                this.topNode(type).makePointNode(-1, 0, mode);
            }
            else if (mode === "long") {
                this.topNode(type).makePointNode(0, -1, mode);
            }
            else {
                throw new Error(`Unknown ${ViewMode}`);
            }
        }
        getAllNodesByType(type) {
            const nodes = new Map();
            for (const node of this.topNode(type).getAllChilds()) {
                nodes.set(node.tag(), node);
            }
            return nodes;
        }
        makeSaveContents() {
            let contents = {};
            for (const actorId of this.actorIds()) {
                contents[actorId] = { sp: this.sp(actorId) };
                for (const type of this.types(actorId)) {
                    const openedStatus = {};
                    const nodes = this.getAllNodesByType(type);
                    for (const tag in nodes) {
                        openedStatus[tag] = nodes.get(tag).isOpened();
                    }
                    contents[type.skillTreeTag()] = {
                        enabled: type.enabled(),
                        openedStatus: openedStatus,
                    };
                }
            }
            return contents;
        }
        loadSaveContents(contents) {
            for (let actorId = 1; actorId < $dataActors.length; actorId++) {
                if (!contents[actorId])
                    continue;
                $skillTreeConfigLoader.loadConfig(actorId);
                this.setSp(actorId, contents[actorId].sp);
                for (const type of this.types(actorId)) {
                    type.setEnabled(contents[type.skillTreeTag()].enabled);
                    const nodes = this.getAllNodesByType(type);
                    for (const tag in nodes) {
                        nodes.get(tag).setOpenedStatus(contents[type.skillTreeTag()].openedStatus[tag]);
                    }
                }
            }
        }
    }
    SkillTree.SkillTreeData = SkillTreeData;
    class SkillTreeManager {
        constructor() {
            this.reset();
        }
        reset() {
            this._actorId = 0;
            this._type = null;
            this._selectNode = null;
        }
        topNode() {
            return $skillTreeData.topNode(this._type);
        }
        selectTopNode(topNode) {
            this.select(topNode.child(0));
        }
        type() {
            return this._type;
        }
        actorId() {
            return this._actorId;
        }
        setType(type) {
            this._type = type;
        }
        setActorId(actorId) {
            this._actorId = actorId;
        }
        selectNode() {
            if (!this._selectNode)
                throw new Error("selectNode is null");
            return this._selectNode;
        }
        changeChildNode() {
            const nextNode = this._selectNode.child(0);
            if (nextNode) {
                this._selectNode = nextNode;
                return true;
            }
            return false;
        }
        changeParentNode() {
            const nextNode = this._selectNode.parent(0);
            if (nextNode && !(nextNode instanceof SkillTreeTopNode)) {
                this._selectNode = nextNode;
                return true;
            }
            return false;
        }
        changeNextNode() {
            const parent = this._selectNode.parent(0);
            if (!parent)
                throw new Error("Unknown parent");
            const i = parent.childs.indexOf(this._selectNode);
            const nextNode = parent.child(i + 1);
            if (nextNode !== this._selectNode) {
                this._selectNode = nextNode;
                return true;
            }
            return false;
        }
        changePrevNode() {
            const parent = this._selectNode.parent(0);
            if (!parent)
                throw new Error("Unknown parent");
            const i = parent.childs.indexOf(this._selectNode);
            const nextNode = parent.child(i - 1);
            if (nextNode !== this._selectNode) {
                this._selectNode = nextNode;
                return true;
            }
            return false;
        }
        maxXY() {
            let maxX = 0;
            let maxY = 0;
            const nodes = this.getAllNodes();
            for (const node of nodes.values()) {
                const x = node.point.x;
                const y = node.point.y;
                if (x > maxX)
                    maxX = x;
                if (y > maxY)
                    maxY = y;
            }
            return new Point(maxX, maxY);
        }
        searchNode(xWay, yWay) {
            const nodes = [...this.getAllNodes().values()];
            const selectNode = this._selectNode;
            if (xWay !== 0) {
                let candidates = nodes.filter(node => node.point.y === selectNode.point.y);
                if (candidates.length === 0) {
                    return null;
                }
                else if (xWay === 1) {
                    candidates = candidates.filter(node => node.point.x > selectNode.point.x);
                    const fars = candidates.map(candidate => candidate.point.x - selectNode.point.x);
                    const i = fars.indexOf(Math.min(...fars));
                    return candidates[i];
                }
                else if (xWay === -1) {
                    candidates = candidates.filter(node => node.point.x < selectNode.point.x);
                    const fars = candidates.map(candidate => candidate.point.x - selectNode.point.x);
                    const i = fars.indexOf(Math.max(...fars));
                    return candidates[i];
                }
            }
            else if (yWay !== 0) {
                let candidates = nodes.filter(node => node.point.x === selectNode.point.x);
                if (candidates.length === 0) {
                    return null;
                }
                else if (yWay === 1) {
                    candidates = candidates.filter(node => node.point.y > selectNode.point.y);
                    const fars = candidates.map(candidate => candidate.point.y - selectNode.point.y);
                    const i = fars.indexOf(Math.min(...fars));
                    return candidates[i];
                }
                else if (yWay === -1) {
                    candidates = candidates.filter(node => node.point.y < selectNode.point.y);
                    const fars = candidates.map(candidate => candidate.point.y - selectNode.point.y);
                    const i = fars.indexOf(Math.max(...fars));
                    return candidates[i];
                }
            }
        }
        right() {
            const node = this.searchNode(1, 0);
            if (node) {
                this._selectNode = node;
                return true;
            }
            if (ViewMode === "wide") {
                return this.changeChildNode();
            }
            else if (ViewMode === "long") {
                return this.changeNextNode();
            }
        }
        left() {
            const node = this.searchNode(-1, 0);
            if (node) {
                this._selectNode = node;
                return true;
            }
            if (ViewMode === "wide") {
                return this.changeParentNode();
            }
            else if (ViewMode === "long") {
                return this.changePrevNode();
            }
        }
        up() {
            const node = this.searchNode(0, -1);
            if (node) {
                this._selectNode = node;
                return true;
            }
            if (ViewMode === "wide") {
                return this.changePrevNode();
            }
            else if (ViewMode === "long") {
                return this.changeParentNode();
            }
        }
        down() {
            const node = this.searchNode(0, 1);
            if (node) {
                this._selectNode = node;
                return true;
            }
            if (ViewMode === "wide") {
                return this.changeNextNode();
            }
            else if (ViewMode === "long") {
                return this.changeChildNode();
            }
        }
        select(node) {
            if (node !== this._selectNode) {
                this._selectNode = node;
                return true;
            }
            return false;
        }
        isSelectNodeOpenable() {
            return this._selectNode.isOpenable();
        }
        selectNodeOpen() {
            this._selectNode.open();
        }
        checkNeedStartCommonEventId() {
            return this._selectNode.checkNeedStartCommonEventId();
        }
        makePoint() {
            $skillTreeData.makePoint(this._type, ViewMode);
        }
        getAllNodes() {
            return $skillTreeData.getAllNodesByType(this._type);
        }
    }
    SkillTree.SkillTreeManager = SkillTreeManager;
    class Scene_SkillTree extends Scene_MenuBase {
        create() {
            super.create();
            this._skillTreeManager = new SkillTreeManager();
            this.updateActor();
            this.createHelpWindow();
            this.createActorInfoWindow();
            this.createTypeSelectWindow();
            this.updateSkillTree();
            this.createSkillTreeNodeInfo();
            this.createSKillTreeWindow();
            this.createNodeOpenWindow();
            this.applyMapDatas();
            this._interpreter = new Game_Interpreter();
        }
        isReady() {
            let ready = true;
            if (!super.isReady())
                ready = false;
            for (const actor of $gameParty.members()) {
                const faceImage = ImageManager.loadFace(actor.faceName());
                if (!faceImage.isReady())
                    ready = false;
            }
            // Do not use flatMap because some browsers do not support it.
            for (const actor of $gameParty.members()) {
                for (const type of $skillTreeData.types(actor.actorId())) {
                    for (const node of $skillTreeData.getAllNodesByType(type).values()) {
                        if (!node.checkIconBitmapReady())
                            ready = false;
                    }
                }
            }
            if (OpenedImage.FileName) {
                const openedImage = ImageManager.loadBitmap("img/", OpenedImage.FileName);
                if (!openedImage.isReady())
                    ready = false;
            }
            if (BackgroundImage.FileName) {
                const backgroundImage1 = ImageManager.loadBitmap("img/", BackgroundImage.FileName);
                if (!backgroundImage1.isReady())
                    ready = false;
            }
            for (const img2 of BackgroundImage.BackgroundImage2) {
                if (img2.FileName) {
                    const backgroundImage2 = ImageManager.loadBitmap("img/", img2.FileName);
                    if (!backgroundImage2.isReady())
                        ready = false;
                }
            }
            return ready;
        }
        start() {
            super.start();
            this._windowTypeSelect.showHelpWindow();
            this._windowTypeSelect.refresh();
            this._windowTypeSelect.open();
            this._windowTypeSelect.activate();
            this._windowTypeSelect.show();
            this._windowActorInfo.refresh();
            this._windowActorInfo.open();
            this._windowActorInfo.show();
            this._windowSkillTree.refresh();
            this._windowSkillTree.open();
            this._windowSkillTree.show();
            this._windowSkillTreeNodeInfo.refresh();
            this._windowNodeOpen.refresh();
        }
        update() {
            super.update();
            this.updateEvent();
        }
        nextActor() {
            $gameParty.makeMenuActorNextOrPreviousWhenSkillTree(true);
            this.updateActor();
            this.onActorChange();
        }
        previousActor() {
            $gameParty.makeMenuActorNextOrPreviousWhenSkillTree(false);
            this.updateActor();
            this.onActorChange();
        }
        createBackground() {
            this._backgroundSprite = new Sprite();
            if (BackgroundImage.FileName) {
                const bitmap1 = ImageManager.loadBitmap("img/", BackgroundImage.FileName);
                this._backgroundSprite.bitmap = bitmap1;
                const sprite = new Sprite();
                sprite.x = BackgroundImage.BackgroundImage2XOfs;
                sprite.y = BackgroundImage.BackgroundImage2YOfs;
                this._backgroundSprite.addChild(sprite);
                this._backgroundSprite2 = sprite;
                this.addChild(this._backgroundSprite);
            }
            else {
                this._backgroundFilter = new PIXI.filters.BlurFilter();
                this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
                this._backgroundSprite.filters = [this._backgroundFilter];
                this.addChild(this._backgroundSprite);
                this.setBackgroundOpacity(192);
            }
        }
        getBackgroundImage2(actorId) {
            const img2 = BackgroundImage.BackgroundImage2.find((img2) => img2.ActorId === actorId);
            if (img2)
                return ImageManager.loadBitmap("img/", img2.FileName);
            return null;
        }
        updateActor() {
            super.updateActor();
            this.updateBackgroundImage2();
        }
        updateEvent() {
            if (this._interpreter.isRunning())
                this._interpreter.update();
        }
        updateBackgroundImage2() {
            if (!this._backgroundSprite2)
                return;
            const backgroundImage2 = this.getBackgroundImage2($gameParty.menuActor().actorId());
            this._backgroundSprite2.bitmap = backgroundImage2;
        }
        applyMapDatas() {
            for (const skillTreeName of $skillTreeMapLoaders.keys()) {
                for (const actorId of $skillTreeData.actorIds()) {
                    const mapLoader = $skillTreeMapLoaders.get(skillTreeName);
                    const type = $skillTreeData.types(actorId).find((t) => t.skillTreeName() === skillTreeName);
                    if (!type)
                        continue;
                    mapLoader.applyMapData(type);
                }
            }
        }
        startCommonEvent(commonEventId) {
            // If commonEventId is undefined, do not start common event.;
            if (!commonEventId || commonEventId === 0)
                return;
            const commonEventData = $dataCommonEvents[commonEventId];
            this._interpreter.setup(commonEventData.list);
        }
        createTypeSelectWindow() {
            this._windowTypeSelect = new Window_TypeSelect(this.typeSelectWindowRect(), this.getSkillTreeTypes());
            this.typeSelectWindowSetupHandlers();
            this._windowTypeSelect.close();
            this._windowTypeSelect.deactivate();
            this._windowTypeSelect.hideHelpWindow();
            this._windowTypeSelect.hide();
            this.addWindow(this._windowTypeSelect);
        }
        resetTypeSelectWindow() {
            this._windowTypeSelect.reset(this.getSkillTreeTypes());
            this.typeSelectWindowSetupHandlers();
            this._windowTypeSelect.refresh();
            this._windowTypeSelect.deactivate();
            this._windowTypeSelect.hideHelpWindow();
            this._windowTypeSelect.show();
        }
        typeSelectWindowSetupHandlers() {
            this._windowTypeSelect.setHandler("cancel", this.typeCancel.bind(this));
            this._windowTypeSelect.setHandler("select", this.updateSkillTree.bind(this));
            this._windowTypeSelect.setHandler("pagedown", this.nextActor.bind(this));
            this._windowTypeSelect.setHandler("pageup", this.previousActor.bind(this));
            this._windowTypeSelect.setHelpWindow(this._helpWindow);
            for (let i = 0; i < this.getSkillTreeTypes().length; i++) {
                this._windowTypeSelect.setHandler(`type${i}`, this.typeOk.bind(this));
            }
        }
        createActorInfoWindow() {
            this._windowActorInfo = new Window_ActorInfo(this.actorInfoWindowRect(), this.actor().actorId());
            this._windowActorInfo.close();
            this._windowActorInfo.deactivate();
            this._windowActorInfo.hide();
            this.addWindow(this._windowActorInfo);
        }
        resetActorInfoWindow() {
            this._windowActorInfo.reset(this.actor().actorId());
            this._windowActorInfo.refresh();
            this._windowActorInfo.deactivate();
            this._windowActorInfo.show();
        }
        createSkillTreeNodeInfo() {
            this._windowSkillTreeNodeInfo = new Window_SkillTreeNodeInfo(this.skillTreeNodeInfoWindowRect(), this._skillTreeManager);
            this._windowSkillTreeNodeInfo.close();
            this._windowSkillTreeNodeInfo.deactivate();
            this._windowSkillTreeNodeInfo.hide();
            this.addWindow(this._windowSkillTreeNodeInfo);
        }
        createSKillTreeWindow() {
            this._windowSkillTree = new Window_SkillTree(this.skillTreeWindowRect(), this._skillTreeManager, this._windowTypeSelect, this._windowSkillTreeNodeInfo);
            this._windowSkillTree.setHandler("ok", this.skillTreeOk.bind(this));
            this._windowSkillTree.setHandler("cancel", this.skillTreeCance.bind(this));
            this._windowSkillTree.setHelpWindow(this._helpWindow);
            this._windowSkillTree.deactivate();
            this._windowSkillTree.hideHelpWindow();
            this._windowSkillTree.hide();
            this.addWindow(this._windowSkillTree);
        }
        createNodeOpenWindow() {
            this._windowNodeOpen = new Window_NodeOpen(this.nodeOpenWindowRect(), this._skillTreeManager);
            this._windowNodeOpen.setHandler("yes", this.nodeOpenOk.bind(this));
            this._windowNodeOpen.setHandler("no", this.nodeOpenCancel.bind(this));
            this._windowNodeOpen.setHandler("cancel", this.nodeOpenCancel.bind(this));
            this._windowNodeOpen.close();
            this._windowNodeOpen.deactivate();
            this._windowNodeOpen.hide();
            this.addWindow(this._windowNodeOpen);
        }
        isBottomHelpMode() {
            if (Utils.RPGMAKER_NAME === "MZ" && EnableMZLayout)
                return super.isBottomHelpMode();
            return false;
        }
        isBottomButtonMode() {
            if (Utils.RPGMAKER_NAME === "MZ" && EnableMZLayout)
                return super.isBottomButtonMode();
            return false;
        }
        isRightInputMode() {
            if (Utils.RPGMAKER_NAME === "MZ" && EnableMZLayout)
                return super.isRightInputMode();
            return false;
        }
        buttonAreaTop() {
            if (Utils.RPGMAKER_NAME === "MZ")
                return super.buttonAreaTop();
            return this.isBottomButtonMode() ? Graphics.boxHeight : 0;
        }
        buttonAreaHeight() {
            if (Utils.RPGMAKER_NAME === "MZ")
                return super.buttonAreaHeight();
            return 0;
        }
        mainCommandWidth() {
            if (Utils.RPGMAKER_NAME === "MZ")
                return super.mainCommandWidth();
            return 240;
        }
        helpWindowRect() {
            if (Utils.RPGMAKER_NAME === "MZ")
                return super.helpWindowRect();
            return new Rectangle(this._helpWindow.x, this._helpWindow.y, this._helpWindow.width, this._helpWindow.height);
        }
        typeSelectWindowRect() {
            const actorInfoWindowRect = this.actorInfoWindowRect();
            const x = actorInfoWindowRect.x;
            const w = actorInfoWindowRect.width;
            let y;
            if (this.isBottomHelpMode()) {
                if (this.isBottomButtonMode()) {
                    y = 0;
                }
                else {
                    y = this.buttonAreaBottom();
                }
            }
            else if (this.isBottomButtonMode()) {
                const helpWindowRect = this.helpWindowRect();
                y = helpWindowRect.y + helpWindowRect.height;
            }
            else {
                const helpWindowRect = this.helpWindowRect();
                y = helpWindowRect.y + helpWindowRect.height;
            }
            const h = actorInfoWindowRect.y - y;
            return new Rectangle(x, y, w, h);
        }
        actorInfoWindowRect() {
            const skillTreeNodeInfoWindowRect = this.skillTreeNodeInfoWindowRect();
            const x = skillTreeNodeInfoWindowRect.x;
            const w = skillTreeNodeInfoWindowRect.width;
            const h = ActorInfoWindowHeight;
            const y = skillTreeNodeInfoWindowRect.y - h;
            return new Rectangle(x, y, w, h);
        }
        skillTreeNodeInfoWindowRect() {
            const w = this.mainCommandWidth();
            let x;
            if (this.isRightInputMode()) {
                x = Graphics.boxWidth - w;
            }
            else {
                x = 0;
            }
            const h = SkillTreeNodeInfoWidowHeight;
            let y;
            if (this.isBottomHelpMode()) {
                const helpWindowRect = this.helpWindowRect();
                y = helpWindowRect.y - h;
            }
            else {
                if (this.isBottomButtonMode()) {
                    y = this.buttonAreaTop() - h;
                }
                else {
                    y = Graphics.boxHeight - h;
                }
            }
            return new Rectangle(x, y, w, h);
        }
        skillTreeWindowRect() {
            const typeSelectWindowRect = this.typeSelectWindowRect();
            let x;
            if (this.isRightInputMode()) {
                x = 0;
            }
            else {
                x = typeSelectWindowRect.width;
            }
            const w = Graphics.boxWidth - typeSelectWindowRect.width;
            const y = typeSelectWindowRect.y;
            let h;
            if (this.isBottomHelpMode()) {
                const helpWindowRect = this.helpWindowRect();
                h = helpWindowRect.y - y;
            }
            else if (this.isBottomButtonMode()) {
                h = this.buttonAreaTop() - y;
            }
            else {
                h = Graphics.boxHeight - y;
            }
            return new Rectangle(x, y, w, h);
        }
        nodeOpenWindowRect() {
            const w = 640;
            const h = 160;
            const x = Graphics.boxWidth / 2 - w / 2;
            const y = Graphics.boxHeight / 2 - h / 2;
            return new Rectangle(x, y, w, h);
        }
        typeOk() {
            this.change_TypeWindow_To_SkillTreeWindow();
        }
        typeCancel() {
            this.popScene();
        }
        skillTreeOk() {
            this.change_SkillTreeWindow_To_NodeOpenWindow();
        }
        skillTreeCance() {
            this.change_SkillTreeWindow_To_TypeWindow();
        }
        nodeOpenOk() {
            this._skillTreeManager.selectNodeOpen();
            const commonEventId = this._skillTreeManager.checkNeedStartCommonEventId();
            if (commonEventId > 0) {
                this.startCommonEvent(commonEventId);
            }
            this.playLearnSkillSe();
            this.change_NodeOpenWindow_To_SkillTreeWindow();
            this._windowSkillTree.refresh();
            this._windowActorInfo.refresh();
        }
        nodeOpenCancel() {
            this.change_NodeOpenWindow_To_SkillTreeWindow();
        }
        needsPageButtons() {
            return true;
        }
        arePageButtonsEnabled() {
            return this._windowTypeSelect.active;
        }
        getSkillTreeTypes() {
            return $skillTreeData.enableTypes(this.actor().actorId());
        }
        updateSkillTree() {
            const type = this._windowTypeSelect.type();
            if (type) {
                this._skillTreeManager.reset();
                this._skillTreeManager.setActorId(this.actor().actorId());
                this._skillTreeManager.setType(type);
                this._skillTreeManager.selectTopNode($skillTreeData.topNode(type));
                if (this._windowSkillTree) {
                    this._windowSkillTree.setDrawState("createView");
                    this._windowSkillTree.refresh();
                }
            }
            else {
                if (this._windowSkillTree)
                    this._windowSkillTree.setDrawState("undraw");
            }
        }
        change_TypeWindow_To_SkillTreeWindow() {
            this._windowTypeSelect.deactivate();
            this._windowTypeSelect.hideHelpWindow();
            this._windowSkillTreeNodeInfo.refresh();
            this._windowSkillTreeNodeInfo.open();
            this._windowSkillTreeNodeInfo.show();
            this._windowSkillTree.refresh();
            this._windowSkillTree.showHelpWindow();
            this._windowSkillTree.activate();
        }
        change_SkillTreeWindow_To_TypeWindow() {
            this._windowSkillTree.deactivate();
            this._windowSkillTree.hideHelpWindow();
            this._windowSkillTreeNodeInfo.close();
            this._windowTypeSelect.showHelpWindow();
            this._windowTypeSelect.activate();
            this._windowTypeSelect.open();
        }
        change_SkillTreeWindow_To_NodeOpenWindow() {
            this._windowSkillTree.deactivate();
            this._windowNodeOpen.refresh();
            this._windowNodeOpen.activate();
            this._windowNodeOpen.show();
            this._windowNodeOpen.open();
        }
        change_NodeOpenWindow_To_SkillTreeWindow() {
            this._windowNodeOpen.deactivate();
            this._windowNodeOpen.close();
            this._windowSkillTree.open();
            this._windowSkillTree.showHelpWindow();
            this._windowSkillTree.activate();
        }
        onActorChange() {
            super.onActorChange();
            this.resetTypeSelectWindow();
            this.resetActorInfoWindow();
            this._windowTypeSelect.showHelpWindow();
            this._windowTypeSelect.open();
            this._windowTypeSelect.activate();
            this._windowTypeSelect.show();
            this.updateSkillTree();
        }
        playLearnSkillSe() {
            if (LearnSkillSeFileName === "")
                return;
            const se = {
                name: LearnSkillSeFileName,
                pan: LearnSkillSePan,
                pitch: LearnSkillSePitch,
                volume: LearnSkillSeVolume,
            };
            AudioManager.playSe(se);
        }
    }
    SkillTree.Scene_SkillTree = Scene_SkillTree;
    class Window_TypeSelect extends Window_Command {
        constructor(...args) {
            super(...args);
        }
        initialize(rect, types) {
            this._windowRect = rect;
            this._types = types;
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            }
            else {
                super.initialize(0, 0);
                this.updatePlacement();
            }
        }
        reset(types) {
            this._index = 0;
            this._types = types;
            this._handlers = {};
        }
        type() {
            return this._types[this.index()];
        }
        select(index) {
            super.select(index);
            this.callHandler("select");
        }
        drawItem(index) {
            let rect;
            if (Utils.RPGMAKER_NAME === "MZ") {
                rect = this.itemLineRect(index);
            }
            else {
                // @ts-ignore // MV Compatible
                rect = this.itemRectForText(index);
            }
            this.resetTextColor();
            this.changePaintOpacity(this.isCommandEnabled(index));
            const iconIndex = this._types[index].iconIndex();
            if (iconIndex) {
                this.drawItemName({ name: this.commandName(index), iconIndex: iconIndex }, rect.x, rect.y, this.width);
            }
            else {
                this.drawText(this.commandName(index), rect.x, rect.y, rect.width, this.itemTextAlign());
            }
        }
        updateHelp() {
            let description = "";
            const type = this.type();
            if (type)
                description = type.helpMessage();
            this.setHelpWindowItem({ description: description });
        }
        windowWidth() {
            return this._windowRect.width;
        }
        windowHeight() {
            return this._windowRect.height;
        }
        updatePlacement() {
            this.x = this._windowRect.x;
            this.y = this._windowRect.y;
        }
        makeCommandList() {
            let i = 0;
            for (const type of this._types) {
                this.addCommand(type.message(), `type${i}`);
                i++;
            }
        }
    }
    SkillTree.Window_TypeSelect = Window_TypeSelect;
    class Window_ActorInfo extends Window_Base {
        constructor(...args) {
            super(...args);
        }
        initialize(...args) {
            const [rect, actorId] = args;
            this._actorId = actorId;
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            }
            else {
                super.initialize(rect.x, rect.y, rect.width, rect.height);
            }
        }
        reset(actorId) {
            this._actorId = actorId;
        }
        refresh() {
            if (this.contents) {
                this.contents.clear();
                this.draw();
            }
        }
        actor() {
            const actor = $gameActors.actor(this._actorId);
            if (!actor)
                throw new Error(`actor id: ${this._actorId} is not found.`);
            return actor;
        }
        draw() {
            const textWidth = this.width - this.padding * 2;
            this.drawActorFace(this.actor(), 0, 0, textWidth, ActorInfoWindowFaceHeight);
            this.drawText(`${this.actor().name()}`, 0, ActorInfoWindowFaceHeight, textWidth, "left");
            this.changeTextColor(this.systemColor());
            const nowSp = $skillTreeData.sp(this._actorId);
            this.drawText(SpName, 0, ActorInfoWindowFaceHeight + 32, textWidth);
            this.resetTextColor();
            const nowSpTextX = this.textWidth(SpName) + (textWidth - this.textWidth(SpName)) / 2;
            this.drawText(nowSp.toString(), 0, ActorInfoWindowFaceHeight + 32, nowSpTextX, "right");
        }
        systemColor() {
            if (Utils.RPGMAKER_NAME === "MZ")
                return ColorManager.systemColor();
            return super.systemColor();
        }
        drawActorFace(actor, x, y, width, height) {
            this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
        }
    }
    SkillTree.Window_ActorInfo = Window_ActorInfo;
    class Window_SkillTreeNodeInfo extends Window_Base {
        constructor(...args) {
            super(...args);
        }
        initialize(rect, skillTreeManager) {
            this._skillTreeManager = skillTreeManager;
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            }
            else {
                // @ts-ignore // MV Compatible
                super.initialize(rect.x, rect.y, rect.width, rect.height);
            }
        }
        refresh() {
            if (this.contents) {
                this.contents.clear();
                if (this._skillTreeManager.type())
                    this.draw();
            }
        }
        draw() {
            const textWidth = this.width - this.padding * 2;
            const selectNode = this._skillTreeManager.selectNode();
            const skill = selectNode.info().skill();
            this.drawText(skill.name, 0, 0, textWidth, "left");
            const drawLine = 40;
            if (selectNode.isOpened()) {
                this.drawText(OpenedNodeText, 0, drawLine, textWidth, "left");
            }
            else {
                this.drawCost(drawLine, textWidth, selectNode.costTypes());
            }
        }
        drawCost(drawLine, textWidth, costTypes) {
            for (const costType of costTypes) {
                if (costType === "sp") {
                    drawLine = this.drawNeedSp(drawLine, textWidth);
                }
                else if (costType === "gold") {
                    drawLine = this.drawNeedGold(drawLine, textWidth);
                }
                else if (costType === "variables") {
                    drawLine = this.drawNeedVariables(drawLine, textWidth);
                }
                else if (costType === "items") {
                    drawLine = this.drawNeedItems(drawLine, textWidth);
                }
            }
        }
        drawNeedSp(drawLine, textWidth) {
            const selectNode = this._skillTreeManager.selectNode();
            const needSp = selectNode.needSp();
            const nowSp = $skillTreeData.sp(this._skillTreeManager.actorId());
            this.drawTextEx(NeedSpText.format(SpName), 0, drawLine, textWidth);
            if (needSp <= nowSp) {
                this.changeTextColor(this.crisisColor());
            }
            else {
                this.changePaintOpacity(false);
            }
            this.drawText(`${needSp}/${nowSp}`, 0, drawLine, textWidth, "right");
            this.resetTextColor();
            this.changePaintOpacity(true);
            return drawLine + 32;
        }
        drawNeedGold(drawLine, textWidth) {
            const selectNode = this._skillTreeManager.selectNode();
            const needGold = selectNode.needGold();
            const nowGold = $gameParty.gold();
            this.drawTextEx(NeedGoldText.format(TextManager.currencyUnit), 0, drawLine, textWidth);
            if (needGold <= nowGold) {
                this.changeTextColor(this.crisisColor());
            }
            else {
                this.changePaintOpacity(false);
            }
            this.drawText(`${needGold}/${nowGold}`, 0, drawLine, textWidth, "right");
            this.resetTextColor();
            this.changePaintOpacity(true);
            return drawLine + 32;
        }
        drawNeedVariables(drawLine, textWidth) {
            const selectNode = this._skillTreeManager.selectNode();
            const needVariables = selectNode.needVariables();
            for (const needVariableInfo of needVariables) {
                const [id, needValue] = needVariableInfo;
                const nowValue = $gameVariables.value(id);
                const variableName = $dataSystem.variables[id];
                this.drawTextEx(variableName, 0, drawLine, textWidth);
                if (needValue <= nowValue) {
                    this.changeTextColor(this.crisisColor());
                }
                else {
                    this.changePaintOpacity(false);
                }
                this.drawText(`${needValue}/${nowValue}`, 0, drawLine, textWidth, "right");
                this.resetTextColor();
                this.changePaintOpacity(true);
                drawLine += 32;
            }
            return drawLine;
        }
        drawNeedItems(drawLine, textWidth) {
            const selectNode = this._skillTreeManager.selectNode();
            const needItems = selectNode.needItems();
            for (const needItem of needItems) {
                const [itemType, id, needCount] = needItem;
                const itemInfo = new ItemInfo(itemType, id);
                const nowItemCount = itemInfo.partyItemCount();
                const countText = `${needCount}/${nowItemCount}`;
                const countTextWidth = this.textWidth(countText);
                let itemNameText;
                if (itemInfo.itemData().iconIndex > 0) {
                    itemNameText = `\\I[${itemInfo.itemData().iconIndex}]${itemInfo.itemData().name}`;
                }
                else {
                    itemNameText = `${itemInfo.itemData().name}`;
                }
                this.drawTextEx(itemNameText, 0, drawLine, textWidth - countTextWidth);
                if (needCount <= nowItemCount) {
                    this.changeTextColor(this.crisisColor());
                }
                else {
                    this.changePaintOpacity(false);
                }
                this.drawText(countText, 0, drawLine, textWidth, "right");
                this.resetTextColor();
                this.changePaintOpacity(true);
                drawLine += 32;
            }
            return drawLine;
        }
        crisisColor() {
            if (Utils.RPGMAKER_NAME === "MZ")
                return ColorManager.crisisColor();
            // @ts-ignore // MV Compatible
            return super.crisisColor();
        }
    }
    SkillTree.Window_SkillTreeNodeInfo = Window_SkillTreeNodeInfo;
    class Window_SkillTree extends Window_Selectable {
        constructor(...args) {
            super(...args);
        }
        initialize(rect, skillTreeManager, windowTypeSelect, windowSkillTreeNodeInfo) {
            this._skillTreeManager = skillTreeManager;
            this._windowTypeSelect = windowTypeSelect;
            this._windowSkillTreeNodeInfo = windowSkillTreeNodeInfo;
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
                this._viewSprite = new Sprite(new Bitmap(1, 1));
                this.addInnerChild(this._viewSprite);
            }
            else {
                super.initialize(rect.x, rect.y, rect.width, rect.height);
                this._bitmapCache = null;
            }
            this._skillTreeView = new SkillTreeView(skillTreeManager, rect.width, rect.height);
            this._drawState = "undraw";
            this._touchSelected = true;
        }
        setDrawState(drawState) {
            this._drawState = drawState;
        }
        update() {
            super.update();
            if (this._drawState === "undraw")
                this.updateCursor();
            this.updateView();
        }
        updateView() {
            if (this._drawState === "none")
                return;
            this.drawView();
            this._drawState = "none";
        }
        updateHelp() {
            const skill = this._skillTreeManager.selectNode().info().skill();
            this.setHelpWindowItem(skill);
            if (this._windowSkillTreeNodeInfo.isOpen())
                this._windowSkillTreeNodeInfo.refresh();
        }
        updateCursor() {
            if (this.isCursorVisible() && this._skillTreeManager.type()) {
                const rect = this.getCursorRect();
                this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
            }
            else {
                this.setCursorRect(0, 0, 0, 0);
            }
        }
        getCursorRect() {
            const rect = this._skillTreeView.getCursorRect();
            if (Utils.RPGMAKER_NAME === "MZ") {
                rect.x -= this.scrollBaseX();
                rect.y -= this.scrollBaseY();
            }
            else {
                const viewPos = this._skillTreeView.viewXY();
                rect.x -= viewPos.x;
                rect.y -= viewPos.y;
            }
            return rect;
        }
        refreshCursor() {
            this.updateCursor();
        }
        refreshCursorForAll() {
        }
        isCursorVisible() {
            return this._skillTreeView && !this._windowTypeSelect.active;
        }
        refresh() {
            super.refresh();
            this.updateCursor();
            if (this._drawState === "undraw")
                return;
            this._drawState = "createView";
            this.updateView();
        }
        maxScrollX() {
            const x = this._viewSprite.bitmap.width + this.padding * 2 - this.width;
            return x < 0 ? 0 : x;
        }
        maxScrollY() {
            const y = this._viewSprite.bitmap.height + this.padding * 2 - this.height;
            return y < 0 ? 0 : y;
        }
        drawView() {
            if (Utils.RPGMAKER_NAME === "MZ") {
                if (this._drawState === "undraw") {
                    this._viewSprite.bitmap = new Bitmap(1, 1);
                }
                else if (this._drawState === "createView") {
                    this._viewSprite.bitmap = this.getView();
                    if (this._windowTypeSelect.active)
                        this.scrollTo(0, 0);
                }
                else if (this._drawState === "updateScroll") {
                    const viewPos = this._skillTreeView.viewXY();
                    this.smoothScrollTo(viewPos.x, viewPos.y);
                }
            }
            else {
                this.contents.clear();
                if (this._drawState === "undraw")
                    return;
                const view = this.getView();
                const viewPos = this._skillTreeView.viewXY();
                this.contents.blt(view, viewPos.x, viewPos.y, this.width, this.height, 0, 0);
            }
        }
        getView() {
            if (Utils.RPGMAKER_NAME === "MZ")
                return this._skillTreeView.createView();
            if (this._drawState === "updateScroll" && this._bitmapCache)
                return this._bitmapCache;
            const bitmap = this._skillTreeView.createView();
            this._bitmapCache = bitmap;
            return bitmap;
        }
        isCursorMovable() {
            return this.isOpenAndActive() && !this._cursorFixed && !this._cursorAll;
        }
        isCurrentItemEnabled() {
            return this._skillTreeManager.isSelectNodeOpenable();
        }
        cursorDown(wrap) {
            const moved = this._skillTreeManager.down();
            if (moved) {
                this._drawState = "updateScroll";
                this.changeSelectNode();
            }
        }
        cursorUp(wrap) {
            const moved = this._skillTreeManager.up();
            if (moved) {
                this._drawState = "updateScroll";
                this.changeSelectNode();
            }
        }
        cursorRight(wrap) {
            const moved = this._skillTreeManager.right();
            if (moved) {
                this._drawState = "updateScroll";
                this.changeSelectNode();
            }
        }
        cursorLeft(wrap) {
            const moved = this._skillTreeManager.left();
            if (moved) {
                this._drawState = "updateScroll";
                this.changeSelectNode();
            }
        }
        changeSelectNode() {
            this._stayCount = 0;
            SoundManager.playCursor();
            this.updateCursor();
            this.callUpdateHelp();
        }
        // This method is used when Utils.RPGMAKER_NAME is MV.
        onTouch(triggered) {
            if (triggered) {
                this._touchSelected = true;
                this.onTouchOk();
            }
            else {
                this.onTouchSelect(triggered);
            }
        }
        onTouchSelect(trigger) {
            const localPos = this.getLocalPos();
            const hitNode = this.checkHitNode(localPos.x, localPos.y);
            if (!hitNode)
                return;
            const moved = this._skillTreeManager.select(hitNode);
            if (moved) {
                this._drawState = "updateScroll";
                this.changeSelectNode();
                this._touchSelected = false;
            }
            else {
                this._touchSelected = true;
            }
        }
        onTouchOk() {
            if (!this._touchSelected)
                return;
            const localPos = this.getLocalPos();
            const hitNode = this.checkHitNode(localPos.x, localPos.y);
            if (!hitNode)
                return;
            const moved = this._skillTreeManager.select(hitNode);
            if (moved) {
                this._drawState = "updateScroll";
                this.changeSelectNode();
            }
            else {
                this.processOk();
            }
        }
        getLocalPos() {
            if (Utils.RPGMAKER_NAME === "MZ") {
                const touchPos = new Point(TouchInput.x, TouchInput.y);
                return this.worldTransform.applyInverse(touchPos);
            }
            else {
                // @ts-ignore // MV Compatible
                const x = this.canvasToLocalX(TouchInput.x);
                // @ts-ignore // MV Compatible
                const y = this.canvasToLocalY(TouchInput.y);
                return new Point(x, y);
            }
        }
        checkHitNode(x, y) {
            if (this.isContentsArea(x, y)) {
                const cx = x - this.padding;
                const cy = y - this.padding;
                const nodes = this._skillTreeManager.getAllNodes();
                for (const node of nodes.values()) {
                    let nodePos = SkillTreeView.getPixelXY(node.point);
                    if (Utils.RPGMAKER_NAME === "MZ") {
                        nodePos.x -= this.scrollX();
                        nodePos.y -= this.scrollY();
                    }
                    else {
                        const viewPos = this._skillTreeView.viewXY();
                        nodePos.x -= viewPos.x;
                        nodePos.y -= viewPos.y;
                    }
                    const px2 = nodePos.x + IconWidth;
                    const py2 = nodePos.y + IconHeight;
                    if (nodePos.x <= cx && cx < px2 && nodePos.y <= cy && cy < py2) {
                        return node;
                    }
                }
            }
            return null;
        }
        isContentsArea(x, y) {
            if (Utils.RPGMAKER_NAME === "MZ")
                return true;
            // @ts-ignore // MV Compatible
            return super.isContentsArea(x, y);
        }
    }
    SkillTree.Window_SkillTree = Window_SkillTree;
    class Window_NodeOpen extends Window_Command {
        constructor(...args) {
            super(...args);
        }
        initialize(...args) {
            const [rect, skillTreeManager] = args;
            this._windowRect = rect;
            this._skillTreeManager = skillTreeManager;
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            }
            else {
                super.initialize(0, 0);
                this.updatePlacement();
            }
        }
        windowWidth() {
            return this._windowRect.width;
        }
        windowHeight() {
            return this._windowRect.height;
        }
        numVisibleRows() {
            return Math.ceil(this.maxItems() / this.maxCols());
        }
        updatePlacement() {
            this.x = this._windowRect.x;
            this.y = this._windowRect.y;
        }
        makeCommandList() {
            this.addCommand(NodeOpenYesText, "yes");
            this.addCommand(NodeOpenNoText, "no");
        }
        itemRect(index) {
            const rect = super.itemRect(index);
            rect.y += 48;
            return rect;
        }
        refresh() {
            super.refresh();
            if (!this._skillTreeManager.type())
                return;
            let needSp = this._skillTreeManager.selectNode().needSp();
            needSp = needSp == null ? 0 : needSp;
            const skillName = this._skillTreeManager.selectNode().info().skill().name;
            const textWidth = this.windowWidth() - this.padding * 2;
            this.drawText(NodeOpenConfirmationText.format(needSp, SpName, skillName), 0, 0, textWidth, "left");
        }
        // The SE of skill learn is played, so the SE of OK is not played.
        playOkSound() {
            if (this.currentSymbol() === "no")
                super.playOkSound();
        }
    }
    SkillTree.Window_NodeOpen = Window_NodeOpen;
    class SkillTreeView {
        constructor(skillTreeManager, windowWidth, windowHeight) {
            this._skillTreeManager = skillTreeManager;
            this._windowWidth = windowWidth;
            this._windowHeight = windowHeight;
        }
        static getPixelXY(point) {
            const px = point.x * (IconWidth + IconSpaceWidth) + ViewBeginXOffset;
            const py = point.y * (IconHeight + IconSpaceHeight) + ViewBeginYOffset;
            return new Point(px, py);
        }
        maxPxy() {
            const maxXYPoint = this._skillTreeManager.maxXY();
            return SkillTreeView.getPixelXY(maxXYPoint);
        }
        viewXY() {
            const selectNode = this._skillTreeManager.selectNode();
            const selectNodePos = SkillTreeView.getPixelXY(selectNode.point);
            let maxPos = this.maxPxy();
            maxPos.x += (IconWidth + IconSpaceWidth);
            maxPos.y += (IconHeight + IconSpaceHeight);
            let viewX, viewY;
            // ノードの中央を中心にビューを表示する。
            const selectNodeCenterPos = new Point(selectNodePos.x + IconWidth / 2, selectNodePos.y + IconHeight / 2);
            if (selectNodeCenterPos.x < this._windowWidth / 2) {
                viewX = 0;
            }
            else if (maxPos.x - selectNodeCenterPos.x < this._windowWidth / 2) {
                viewX = maxPos.x - (this._windowWidth - ViewBeginXOffset);
            }
            else {
                viewX = Math.floor(selectNodeCenterPos.x - this._windowWidth / 2);
            }
            if (selectNodeCenterPos.y < this._windowHeight / 2) {
                viewY = 0;
            }
            else if (maxPos.y - selectNodeCenterPos.y < this._windowHeight / 2) {
                viewY = maxPos.y - (this._windowHeight - ViewBeginYOffset);
            }
            else {
                viewY = Math.floor(selectNodeCenterPos.y - this._windowHeight / 2);
            }
            if (viewX < 0)
                viewX = 0;
            if (viewY < 0)
                viewY = 0;
            return new Point(viewX, viewY);
        }
        viewDrawNode(bitmap) {
            for (const node of this._skillTreeManager.getAllNodes().values()) {
                let nodePos = SkillTreeView.getPixelXY(node.point);
                // NOTE: 強制オープンなどで選択可能でないノードがオープン済みになった場合は半透明にしない。
                if (node.isSelectable() || node.isOpened()) {
                    this.drawIcon(bitmap, node.iconBitmap(), nodePos.x, nodePos.y);
                }
                else {
                    this.drawIcon(bitmap, node.iconBitmap(), nodePos.x, nodePos.y, 96);
                }
                if (node.isOpened()) {
                    if (OpenedImage.EnableOpenedImage) {
                        const x = nodePos.x + OpenedImage.XOfs;
                        const y = nodePos.y + OpenedImage.YOfs;
                        const openedImage = ImageManager.loadBitmap("img/", OpenedImage.FileName);
                        bitmap.blt(openedImage, 0, 0, openedImage.width, openedImage.height, x, y);
                    }
                    else {
                        const x = nodePos.x - ViewRectOfs;
                        const y = nodePos.y - ViewRectOfs;
                        const width = IconWidth + ViewRectOfs * 2;
                        const height = IconHeight + ViewRectOfs * 2;
                        this.drawRect(bitmap, ViewRectColor, x, y, width, height, 1); // TODO: check
                    }
                }
            }
        }
        viewDrawLine(bitmap) {
            for (const node of this._skillTreeManager.getAllNodes().values()) {
                let nodePos = SkillTreeView.getPixelXY(node.point);
                for (const child of node.childs) {
                    let color;
                    if (node.isOpened()) {
                        color = ViewLineColorLearned;
                    }
                    else {
                        color = ViewLineColorBase;
                    }
                    const diff = this.nodeDiff(node, child);
                    if (ViewMode === "wide") {
                        const pxOfs = IconWidth;
                        const pyOfs = IconHeight / 2;
                        if (node.point.y === child.point.y) {
                            this.drawLine(bitmap, nodePos.x + pxOfs, nodePos.y + pyOfs, nodePos.x + pxOfs + diff.x, nodePos.y + pyOfs, color);
                        }
                        else {
                            const px1 = nodePos.x + pxOfs;
                            const py1 = nodePos.y + pyOfs;
                            const px2 = px1 + diff.x / 4;
                            const py2 = py1;
                            this.drawLine(bitmap, px1, py1, px2, py2, color);
                            const px3 = px2 + diff.x / 2;
                            const py3 = py2 + diff.y;
                            this.drawLine(bitmap, px2, py2, px3, py3, color);
                            const px4 = px3 + diff.x / 4;
                            const py4 = py3;
                            this.drawLine(bitmap, px3, py3, px4, py4, color);
                        }
                    }
                    else if (ViewMode === "long") {
                        const pxOfs = IconWidth / 2;
                        const pyOfs = IconHeight;
                        if (node.point.x === child.point.x) {
                            this.drawLine(bitmap, nodePos.x + pxOfs, nodePos.y + pyOfs, nodePos.x + pxOfs, nodePos.y + pyOfs + diff.y, color);
                        }
                        else {
                            const px1 = nodePos.x + pxOfs;
                            const py1 = nodePos.y + pyOfs;
                            const px2 = px1;
                            const py2 = py1 + diff.y / 4;
                            this.drawLine(bitmap, px1, py1, px2, py2, color);
                            const px3 = px2 + diff.x;
                            const py3 = py2 + diff.y / 2;
                            this.drawLine(bitmap, px2, py2, px3, py3, color);
                            const px4 = px3;
                            const py4 = py3 + diff.y / 4;
                            this.drawLine(bitmap, px3, py3, px4, py4, color);
                        }
                    }
                }
            }
        }
        nodeDiff(node1, node2) {
            const nodePos1 = SkillTreeView.getPixelXY(node1.point);
            const nodePos2 = SkillTreeView.getPixelXY(node2.point);
            let xDiff = nodePos2.x - nodePos1.x;
            let yDiff = nodePos2.y - nodePos1.y;
            if (ViewMode === "wide") {
                if (xDiff < 0) {
                    xDiff += IconWidth;
                }
                else if (xDiff > 0) {
                    xDiff -= IconWidth;
                }
            }
            else if (ViewMode === "long") {
                if (yDiff < 0) {
                    yDiff += IconHeight;
                }
                else if (yDiff > 0) {
                    yDiff -= IconHeight;
                }
            }
            return new Point(xDiff, yDiff);
        }
        createView() {
            this._skillTreeManager.makePoint();
            const maxPos = this.maxPxy();
            let width, height;
            if (Utils.RPGMAKER_NAME === "MZ") {
                width = maxPos.x + IconWidth + ViewBeginXOffset;
                height = maxPos.y + IconHeight + ViewBeginYOffset;
            }
            else {
                width = Math.ceil(maxPos.x / this._windowWidth) * this._windowWidth + IconWidth + IconSpaceWidth;
                height = Math.ceil(maxPos.y / this._windowHeight) * this._windowHeight + IconHeight + IconSpaceHeight;
            }
            const bitmap = new Bitmap(width, height);
            this.viewDrawLine(bitmap);
            this.viewDrawNode(bitmap);
            return bitmap;
        }
        getCursorRect() {
            this._skillTreeManager.makePoint();
            const selectNode = this._skillTreeManager.selectNode();
            const nodePos = SkillTreeView.getPixelXY(selectNode.point);
            const x = nodePos.x - ViewCursorOfs;
            const y = nodePos.y - ViewCursorOfs;
            const w = IconWidth + ViewCursorOfs * 2;
            const h = IconHeight + ViewCursorOfs * 2;
            return new Rectangle(x, y, w, h);
        }
        drawLine(bitmap, x1, y1, x2, y2, color) {
            const ctx = bitmap.context;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color;
            ctx.lineWidth = ViewLineWidth;
            ctx.closePath();
            ctx.stroke();
        }
        drawRect(bitmap, style, x, y, width, height, rectLineWidth) {
            const ctx = bitmap.context;
            ctx.strokeStyle = style;
            ctx.lineWidth = rectLineWidth;
            ctx.strokeRect(x, y, width, height);
        }
        drawIcon(dstBitmap, iconBitmap, x, y, opacity = 255) {
            const tmpOpacity = dstBitmap.paintOpacity;
            dstBitmap.paintOpacity = opacity;
            const pw = IconWidth;
            const ph = IconHeight;
            dstBitmap.blt(iconBitmap, 0, 0, pw, ph, x, y);
            dstBitmap.paintOpacity = tmpOpacity;
        }
    }
    SkillTree.SkillTreeView = SkillTreeView;
    // Initialize skill tree.
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        _DataManager_createGameObjects.call(this);
        $skillTreeData = new SkillTreeData();
    };
    const _Scene_Boot_create = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function () {
        _Scene_Boot_create.call(this);
        this.initSkillTreeConfig();
        this.loadSkillTreeMap();
    };
    Scene_Boot.prototype.initSkillTreeConfig = function () {
        $skillTreeConfigLoader = new SkillTreeConfigLoader();
    };
    Scene_Boot.prototype.loadSkillTreeMap = function () {
        const skillTreeMapId = $skillTreeConfigLoader.configData().skillTreeMapId;
        if (skillTreeMapId) {
            for (const skillTreeName in skillTreeMapId) {
                const mapId = skillTreeMapId[skillTreeName];
                if (mapId === 0)
                    continue;
                const mapLoader = new SkillTreeMapLoader(mapId);
                mapLoader.loadMap();
                $skillTreeMapLoaders.set(skillTreeName, mapLoader);
            }
        }
    };
    const _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function () {
        if (!_Scene_Boot_isReady.call(this))
            return false;
        for (const mapLoader of $skillTreeMapLoaders.values()) {
            if (!mapLoader.isLoaded())
                return false;
        }
        return true;
    };
    const _Game_Party_setupStartingMembers = Game_Party.prototype.setupStartingMembers;
    Game_Party.prototype.setupStartingMembers = function () {
        _Game_Party_setupStartingMembers.call(this);
        for (const actor of this.members()) {
            const actorId = actor.actorId();
            $skillTreeConfigLoader.loadConfig(actorId);
            if (!$skillTreeData.sp(actorId))
                $skillTreeData.setSp(actorId, 0);
        }
    };
    const _Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function (actorId) {
        _Game_Party_addActor.call(this, actorId);
        $skillTreeConfigLoader.loadConfig(actorId);
        if (!$skillTreeData.sp(actorId))
            $skillTreeData.setSp(actorId, 0);
    };
    // アクターのスキルツリーが存在しない場合はスキップする
    Game_Party.prototype.makeMenuActorNextOrPreviousWhenSkillTree = function (isNext) {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            const firstIndex = index;
            do {
                if (isNext) {
                    index = (index + 1) % this.members().length;
                }
                else {
                    index = (index + this.members().length - 1) % this.members().length;
                }
                const actor = this.members()[index];
                const types = $skillTreeData.types(actor.actorId());
                if (types.length > 0) {
                    this.setMenuActor(actor);
                    break;
                }
            } while (firstIndex !== index);
        }
        else {
            this.setMenuActor(this.members()[0]);
        }
    };
    // Add skill tree to menu command.
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        _Window_MenuCommand_addOriginalCommands.call(this);
        if (MenuSkillTreeText !== "")
            this.addCommand(MenuSkillTreeText, "skillTree", this.isEnabledSkillTree());
    };
    Window_MenuCommand.prototype.isEnabledSkillTree = function () {
        if (EnabledSkillTreeSwitchId === 0)
            return true;
        return $gameSwitches.value(EnabledSkillTreeSwitchId);
    };
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("skillTree", this.commandPersonal.bind(this));
    };
    const _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
    Scene_Menu.prototype.onPersonalOk = function () {
        _Scene_Menu_onPersonalOk.call(this);
        switch (this._commandWindow.currentSymbol()) {
            case "skillTree":
                SceneManager.push(Scene_SkillTree);
                break;
        }
    };
    // アクターのスキルツリーが存在しない場合は、スキルツリー画面を表示しない
    const _Window_MenuStatus_processOk = Window_MenuStatus.prototype.processOk;
    Window_MenuStatus.prototype.processOk = function () {
        const scene = SceneManager._scene;
        if (scene instanceof Scene_Menu && scene._commandWindow.currentSymbol() === "skillTree") {
            // シーンがメニューでシンボルがスキルツリーの場合
            const actor = this.actor(this.index());
            const types = $skillTreeData.types(actor.actorId());
            if (types.length > 0) {
                $gameParty.setMenuActor(actor);
                if (Utils.RPGMAKER_NAME === "MZ") {
                    Window_StatusBase.prototype.processOk.call(this);
                }
                else {
                    Window_Selectable.prototype.processOk.call(this);
                }
            }
            else {
                SoundManager.playBuzzer();
            }
        }
        else {
            _Window_MenuStatus_processOk.call(this);
        }
    };
    // MV compatible
    const _Window_MenuStatus_actor = Window_MenuStatus.prototype.actor;
    Window_MenuStatus.prototype.actor = function (index) {
        if (Utils.RPGMAKER_NAME === "MZ")
            return _Window_MenuStatus_actor.call(this, index);
        return $gameParty.members()[index];
    };
    // Includes skill tree data in save data.
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.skillTreeData = $skillTreeData.makeSaveContents();
        return contents;
    };
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (contents.skillTreeData)
            $skillTreeData.loadSaveContents(contents.skillTreeData);
    };
    Game_Party.prototype.itemCount = function (itemId) {
        return this._items[itemId] ? this._items[itemId] : 0;
    };
    Game_Party.prototype.weaponCount = function (weaponId) {
        return this._weapons[weaponId] ? this._weapons[weaponId] : 0;
    };
    Game_Party.prototype.armorCount = function (armorId) {
        return this._armors[armorId] ? this._armors[armorId] : 0;
    };
    // Actor gain sp.
    Game_Party.prototype.gainSp = function (sp) {
        for (const actor of this.members()) {
            actor.gainSp(sp);
        }
    };
    Game_Actor.prototype.gainSp = function (sp) {
        $skillTreeData.gainSp(this.actorId(), sp);
        if ($skillTreeData.sp(this.actorId()) > MaxSp) {
            $skillTreeData.setSp(this.actorId(), MaxSp);
        }
    };
    // Get the sp when win a battle.
    Game_Enemy.prototype.sp = function () {
        const battleEndGainSp = this.enemy().meta.battleEndGainSp;
        return battleEndGainSp ? parseInt(battleEndGainSp) : 0;
    };
    Game_Troop.prototype.spTotal = function () {
        return this.deadMembers().reduce((r, enemy) => {
            return r + enemy.sp();
        }, 0);
    };
    const _BattleManager_makeRewards = BattleManager.makeRewards;
    BattleManager.makeRewards = function () {
        _BattleManager_makeRewards.call(this);
        if (EnableGetSpWhenBattleEnd)
            this._rewards.sp = $gameTroop.spTotal();
    };
    const _BattleManager_gainRewards = BattleManager.gainRewards;
    BattleManager.gainRewards = function () {
        _BattleManager_gainRewards.call(this);
        if (EnableGetSpWhenBattleEnd)
            this.gainSp();
    };
    BattleManager.gainSp = function () {
        $gameParty.gainSp(this._rewards.sp);
    };
    const _BattleManager_displayRewards = BattleManager.displayRewards;
    BattleManager.displayRewards = function () {
        if (EnableGetSpWhenBattleEnd) {
            this.displayExp();
            this.displayGold();
            this.displaySp();
            this.displayDropItems();
        }
        else {
            _BattleManager_displayRewards.call(this);
        }
    };
    BattleManager.displaySp = function () {
        const sp = this._rewards.sp;
        if (sp > 0) {
            $gameMessage.add("\\." + BattleEndGetSpText.format(sp, SpName));
        }
    };
    // Get the sp when level up.
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function () {
        _Game_Temp_initialize.call(this);
        this._enableGetSpWhenLevelUp = EnableGetSpWhenLevelUp;
        this._prevLevel = null;
    };
    Game_Temp.prototype.enableGetSpWhenLevelUp = function () {
        return this._enableGetSpWhenLevelUp;
    };
    Game_Temp.prototype.setEnableGetSpWhenLevelUp = function (enableGetSpWhenLevelUp) {
        return this._enableGetSpWhenLevelUp = enableGetSpWhenLevelUp;
    };
    Game_Temp.prototype.prevLevel = function () {
        return this._prevLevel;
    };
    Game_Temp.prototype.setPrevLevel = function (prevLevel) {
        return this._prevLevel = prevLevel;
    };
    const _Game_Actor_changeExp = Game_Actor.prototype.changeExp;
    Game_Actor.prototype.changeExp = function (exp, show) {
        $gameTemp.setPrevLevel(this._level);
        _Game_Actor_changeExp.call(this, exp, show);
        $gameTemp.setPrevLevel(null);
    };
    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function () {
        _Game_Actor_levelUp.call(this);
        if ($gameTemp.enableGetSpWhenLevelUp()) {
            const sp = this.getLevelUpSp(this._level);
            if (sp > 0)
                this.gainSp(sp);
        }
    };
    const _Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
    Game_Actor.prototype.displayLevelUp = function (newSkills) {
        _Game_Actor_displayLevelUp.call(this, newSkills);
        if ($gameTemp.enableGetSpWhenLevelUp()) {
            let sp = 0;
            for (let level = $gameTemp.prevLevel() + 1; level <= this._level; level++) {
                sp += this.getLevelUpSp(level);
            }
            if (sp > 0)
                $gameMessage.add(LevelUpGetSpText.format(sp, SpName));
        }
    };
    Game_Actor.prototype.getLevelUpSp = function (level) {
        for (const data of $skillTreeConfigLoader.configData().levelUpGainSp) {
            if (data.classId === this.currentClass().id) {
                const defaultGainSp = data.default;
                const sp = data[level.toString()];
                return sp ? sp : defaultGainSp;
            }
        }
        return 0;
    };
    // Prevent SP from increasing due to level-up processing when changing jobs.
    const _Game_Actor_changeClass = Game_Actor.prototype.changeClass;
    Game_Actor.prototype.changeClass = function (classId, keepExp) {
        $gameTemp.setEnableGetSpWhenLevelUp(false);
        _Game_Actor_changeClass.call(this, classId, keepExp);
        $gameTemp.setEnableGetSpWhenLevelUp(EnableGetSpWhenLevelUp);
    };
})(SkillTree || (SkillTree = {}));
const SkillTreeClassAlias = SkillTree;
