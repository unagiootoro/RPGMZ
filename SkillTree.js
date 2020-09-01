/*:
@target MV MZ
@plugindesc Skill tree v1.5.0
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SkillTree.js

@param SpName
@type string
@default SP
@desc
Specify the wording of SP in the game.

@param MaxSp
@type number
@default 9999
@desc
Set the maximum value of SP that can be acquired.

@param EnabledSkillTreeSwitchId
@type switch
@default 0
@desc
Specify the ID of the switch that enables/disables the skill tree with the menu command. If you specify 0, the skill tree is always valid.

@param EnableGetSpWhenBattleEnd
@type boolean
@default true
@desc
If set to true, SP will be available at the end of battle.

@param EnableGetSpWhenLevelUp
@type boolean
@default true
@desc
If you set true, you will be able to get SP when you level up.

@param ViewMode
@type string
@default wide
@desc
If you set wide, the skill tree will be displayed next to it. If long is set, the skill tree will be displayed vertically.

@param EnableMZLayout
@type boolean
@default false
@desc
Set to true to match the layout format of RPG Maker MZ. (MZ limited)

@param RectImageFileName
@type file
@dir img
@desc
Specify the file name of the image that surrounds the acquired skill icon. If left blank, enclose the icon in a straight frame.

@param IconWidth
@type number
@default 32
@desc
Specify the width of the icon.

@param IconHeight
@type number
@default 32
@desc
Specifies the vertical width of the icon.

@param IconSpaceWidth
@type number
@default 32
@desc
Specifies the width of the space between the icons.

@param IconSpaceHeight
@type number
@default 32
@desc
Specifies the vertical width of the space between icons.

@param ViewLineWidth
@type number
@default 3
@desc
Specifies the line width.

@param ViewLineColorBase
@type string
@default #000000
@desc
Specifies the color of the line for which the skill has not been learned.

@param ViewLineColorLearned
@type string
@default #00aaff
@desc
Specify the color of the line for which the skill has been acquired.

@param ViewBeginXOffset
@type number
@default 24
@desc
Specifies the X coordinate of the drawing start of the skill tree.

@param ViewBeginYOffset
@type number
@default 24
@desc
Specify the drawing start Y coordinate of the skill tree.

@param ViewCursorOfs
@type number
@default 6
@desc
Specifies the cursor coordinate offset for the skill tree icon.

@param ViewRectColor
@type string
@default #ffff00
@desc
Specifies the color of the border surrounding the acquired skill icon.

@param ViewRectOfs
@type number
@default 1
@desc
Specify the coordinate offset of the border or border image that surrounds the acquired skill icon.

@param LearnSkillSeFileName
@type file
@dir audio/se
@default Item3
@desc
Specify the file name of the SE to play when the skill is acquired.

@param LearnSkillSeVolume
@type number
@default 90
@desc
Specify the volume of SE to play when the skill is acquired.

@param LearnSkillSePitch
@type number
@default 100
@desc
Specify the SE pitch to play when the skill is acquired.

@param LearnSkillSePan
@type number
@default 0
@desc
Specify the SE pan to play when the skill is acquired.

@param MenuSkillTreeText
@type string
@default Skill tree
@desc
Specify the skill tree command name to be displayed in the menu command.

@param NeedSpText
@type string
@default Required %1:
@desc
Specify the required SP text to be displayed in the skill tree window. The SP name is entered in %1.

@param OpenedNodeText
@type string
@default Acquired
@desc
Specifies the text to display in place of the required SP if the skill is already acquired.

@param NodeOpenConfirmationText
@type string
@default Do you consume %1%2 and get %3?
@desc
The confirmation text is displayed on the screen for selecting whether to acquire skills. %1 is the SP value to be consumed, %2 is the SP name, and %3 is the skill name to be acquired.

@param NodeOpenYesText
@type string
@default Learn
@desc
On the selection screen of whether to acquire the skill, specify the text for acquiring the skill.

@param NodeOpenNoText
@type string
@default Don't learn
@desc
In the selection screen of whether to acquire the skill, specify the text when the skill is not acquired.

@param BattleEndGetSpText
@type string
@default I got %1%2.
@desc
Specifies the text to display when the SP is obtained at the end of the battle. The acquired SP value will be entered in %1, and the SP name will be entered in %2.

@param LevelUpGetSpText
@type string
@default I got %1%2.
@desc
Specify the text to display when you get the SP when you level up. The acquired SP value will be entered in %1, and the SP name will be entered in %2.

@help
A plugin that introduces a skill tree.
Please refer to "SkillTreeConfig.js" for the setting method.

[License]
This plugin is available under the terms of the MIT license.
*/

/*:ja
@target MV MZ
@plugindesc スキルツリー v1.5.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SkillTree.js

@param SpName
@type string
@default SP
@desc
ゲーム中でのSPの文言を指定します。

@param MaxSp
@type number
@default 9999
@desc
取得可能なSPの最大値を設定します。

@param EnabledSkillTreeSwitchId
@type switch
@default 0
@desc
メニューコマンドでスキルツリーを有効/無効を設定するスイッチのIDを指定します。0を指定すると常にスキルツリーは有効になります。

@param EnableGetSpWhenBattleEnd
@type boolean
@default true
@desc
trueを設定すると、戦闘終了時にSPを入手できるようになります。

@param EnableGetSpWhenLevelUp
@type boolean
@default true
@desc
trueを設定すると、レベルアップ時にSPを入手できるようになります。

@param ViewMode
@type string
@default wide
@desc
wideを設定すると、横にスキルツリーを表示します。longを設定すると、縦にスキルツリーを表示します。

@param EnableMZLayout
@type boolean
@default false
@desc
trueを設定すると、RPGツクールMZのレイアウト形式に合わせます。(MZ限定)

@param RectImageFileName
@type file
@dir img
@desc
取得済みスキルのアイコンを囲む画像のファイル名を指定します。空欄の場合、直線の枠でアイコンを囲みます。

@param IconWidth
@type number
@default 32
@desc
アイコンの横幅を指定します。

@param IconHeight
@type number
@default 32
@desc
アイコンの縦幅を指定します。

@param IconSpaceWidth
@type number
@default 32
@desc
アイコン間のスペースの横幅を指定します。

@param IconSpaceHeight
@type number
@default 32
@desc
アイコン間のスペースの縦幅を指定します。

@param ViewLineWidth
@type number
@default 3
@desc
ラインの幅を指定します。

@param ViewLineColorBase
@type string
@default #000000
@desc
スキル未習得の線の色を指定します。

@param ViewLineColorLearned
@type string
@default #00aaff
@desc
スキル習得済みの線の色を指定します。

@param ViewBeginXOffset
@type number
@default 24
@desc
スキルツリーの描画開始X座標を指定します。

@param ViewBeginYOffset
@type number
@default 24
@desc
スキルツリーの描画開始Y座標を指定します。

@param ViewCursorOfs
@type number
@default 6
@desc
スキルツリーのアイコンに対するカーソルの座標オフセットを指定します。

@param ViewRectColor
@type string
@default #ffff00
@desc
取得済みスキルのアイコンを囲む枠線の色を指定します。

@param ViewRectOfs
@type number
@default 1
@desc
取得済みスキルのアイコンを囲む枠線または枠画像の座標オフセットを指定します。

@param LearnSkillSeFileName
@type file
@dir audio/se
@default Item3
@desc
スキルを習得したときに再生するSEのファイル名を指定します。

@param LearnSkillSeVolume
@type number
@default 90
@desc
スキルを習得したときに再生するSEのvolumeを指定します。

@param LearnSkillSePitch
@type number
@default 100
@desc
スキルを習得したときに再生するSEのpitchを指定します。

@param LearnSkillSePan
@type number
@default 0
@desc
スキルを習得したときに再生するSEのpanを指定します。

@param MenuSkillTreeText
@type string
@default スキルツリー
@desc
メニューコマンドに表示するスキルツリーのコマンド名を指定します。

@param NeedSpText
@type string
@default 必要%1：
@desc
スキルツリーウィンドウに表示する必要SPのテキストを指定します。%1にはSP名が入ります。

@param OpenedNodeText
@type string
@default 取得済み
@desc
スキルが取得済みの場合に必要SPの代わりに表示するテキストを指定します。

@param NodeOpenConfirmationText
@type string
@default %1%2を消費して%3を取得しますか？
@desc
スキル取得有無の選択画面で、確認用のテキストを表示します。%1には消費するSP値が、%2にはSP名が、%3には取得するスキル名入ります。

@param NodeOpenYesText
@type string
@default 習得する
@desc
スキル取得有無の選択画面で、スキルを取得する場合のテキストを指定します。

@param NodeOpenNoText
@type string
@default 習得しない
@desc
スキル取得有無の選択画面で、スキルを取得しない場合のテキストを指定します。

@param BattleEndGetSpText
@type string
@default %1%2を入手した。
@desc
戦闘終了時にSPを入手したときに表示するテキストを指定します。%1には取得したSP値が、%2にはSP名が入ります。

@param LevelUpGetSpText
@type string
@default %1%2を入手した。
@desc
レベルアップ時にSPを入手したときに表示するテキストを指定します。%1には取得したSP値が、%2にはSP名が入ります。

@help
スキルツリーを導入するプラグインです。
設定方法については、「SkillTreeConfig.js」を参照してください。

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const SkillTreePluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];
const SkillTreeClassAlias = {};
let $skillTreeData = null;
let $skillTreeConfigLoader = null;

const skt_gainSp = (actorId, value)=> {
    const actor = $gameParty.members().find(actor => actor.actorId() === actorId);
    actor.gainSp(value);
};

const skt_skillReset = (actorId) => {
    const resetSp = $skillTreeData.totalSpAllTypes(actorId);
    $skillTreeData.skillResetAllTypes(actorId);
    $skillTreeData.gainSp(actorId, resetSp);
};

const skt_loadMap = (actorId, typeName) => {
    for (const type of $skillTreeData.types(actorId)) {
        if (type.skillTreeName() === typeName) {
            const skillTreeMapLoader = new SkillTreeClassAlias.SkillTreeMapLoader($dataMap, type);
            skillTreeMapLoader.loadMap();
        }
    }
};

const skt_enableType = (actorId, typeName) => {
    const types = $skillTreeData.types(actorId);
    let targetType = null;
    for (const type of types) {
        if (type.skillTreeName() === typeName) {
            targetType = type;
        }
    }
    if (!targetType) return;
    targetType.setEnabled(true);
}

const skt_disableType = (actorId, typeName) => {
    const types = $skillTreeData.types(actorId);
    let targetType = null;
    for (const type of types) {
        if (type.skillTreeName() === typeName) {
            targetType = type;
        }
    }
    if (!targetType) return;
    targetType.setEnabled(false);
}

const skt_migrationType = (actorId, fromTypeName, toTypeName, reset) => {
    let dstType = null;
    let srcType = null;
    const types = $skillTreeData.types(actorId);
    for (const type of types) {
        if (type.skillTreeName() === fromTypeName) {
            srcType = type;
        } else if (type.skillTreeName() === toTypeName) {
            dstType = type;
        }
    }
    if (!dstType || !srcType) return;
    srcType.setEnabled(false);
    dstType.setEnabled(true);
    if (reset) {
        const resetSp = $skillTreeData.totalSp(srcType);
        $skillTreeData.skillReset(srcType);
        $skillTreeData.gainSp(actorId, resetSp);
    } else {
        $skillTreeData.copyTree(dstType, srcType);
        $skillTreeData.skillReset(srcType);
    }
};

(() => {
"use strict";

const params = PluginManager.parameters(SkillTreePluginName);
const SpName = params["SpName"];
const MaxSp = parseInt(params["MaxSp"]);

const EnableGetSpWhenBattleEnd = (params["EnableGetSpWhenBattleEnd"] === "true" ? true : false);
const EnableGetSpWhenLevelUp = (params["EnableGetSpWhenLevelUp"] === "true" ? true : false);
const EnabledSkillTreeSwitchId = parseInt(params["EnabledSkillTreeSwitchId"]);
const EnableMZLayout = (params["EnableMZLayout"] === "true" ? true : false);

const ViewMode = params["ViewMode"];
const RectImageFileName = (params["RectImageFileName"] === "" ? null : params["RectImageFileName"]);
const IconWidth = parseInt(params["IconWidth"]);
const IconHeight = parseInt(params["IconHeight"]);
const IconSpaceWidth = parseInt(params["IconSpaceWidth"]);
const IconSpaceHeight = parseInt(params["IconSpaceHeight"]);
const ViewLineWidth = parseInt(params["ViewLineWidth"]);
const ViewLineColorBase = params["ViewLineColorBase"];
const ViewLineColorLearned = params["ViewLineColorLearned"];
const ViewBeginXOffset = parseInt(params["ViewBeginXOffset"]);
const ViewBeginYOffset = parseInt(params["ViewBeginYOffset"]);
const ViewCursorOfs = parseInt(params["ViewCursorOfs"]);
const ViewRectOfs = parseInt(params["ViewRectOfs"]);
const ViewRectColor = params["ViewRectColor"];

const LearnSkillSeFileName = params["LearnSkillSeFileName"];
const LearnSkillSeVolume = parseInt(params["LearnSkillSeVolume"]);
const LearnSkillSePitch = parseInt(params["LearnSkillSePitch"]);
const LearnSkillSePan = parseInt(params["LearnSkillSePan"]);

const MenuSkillTreeText = params["MenuSkillTreeText"];
const NeedSpText = params["NeedSpText"];
const OpenedNodeText = params["OpenedNodeText"];
const NodeOpenConfirmationText = params["NodeOpenConfirmationText"];
const NodeOpenYesText = params["NodeOpenYesText"];
const NodeOpenNoText = params["NodeOpenNoText"];
const BattleEndGetSpText = params["BattleEndGetSpText"];
const LevelUpGetSpText = params["LevelUpGetSpText"];

class SkillTreeNodeInfo {
    constructor(actorId, skillId, needSp, iconData, helpMessage) {
        this._actorId = actorId;
        this._skillId = skillId;
        this._needSp = needSp;
        this._iconData = iconData;
        this._helpMessage = helpMessage;
    }

    actor() {
        const actor = $gameParty.members().find(actor => actor.actorId() === this._actorId);
        if (!actor) throw new Error(`actor id: ${this._actorId} is not found.`)
        return actor;
    }

    skill() {
        const skill = $dataSkills[this._skillId];
        if (!skill) throw new Error(`skill id: ${this._skillId} is not found.`)
        return skill;
    }

    canLearn(nowSp) {
        return nowSp >= this._needSp;
    }

    learnSkill() {
        this.actor().learnSkill(this._skillId);
    }

    forgetSkill() {
        this.actor().forgetSkill(this._skillId);
    }

    iconBitmap() {
        if (this._iconData[0] === "img") {
            return ImageManager.loadPicture(this._iconData[1]);
        } else if (this._iconData[0] === "icon") {
            let iconIndex;
            if (this._iconData.length >= 2) {
                iconIndex = this._iconData[1];
            } else {
                iconIndex = this.skill().iconIndex;
            }
            const srcBitmap = ImageManager.loadSystem("IconSet");
            const dstBitmap = new Bitmap(32, 32);
            const sx = iconIndex % 16 * 32;
            const sy = Math.floor(iconIndex / 16) * 32;
            dstBitmap.blt(srcBitmap, sx, sy, 32, 32, 0, 0);
            return dstBitmap;
        }
        throw new Error(`Unknown ${this._iconData[0]}`);
    }

    needSp() {
        return this._needSp;
    }

    helpMessage() {
        return this._helpMessage;
    }
}

class SkillTreeNode {
    constructor(tag) {
        this._tag = tag
        this._parents = [];
        this._childs = [];
        this._info = null;
        this._opened = false;
        this._point = null;
        this._reservedPoint = null;
    }

    get point() { return this._point; }
    set point(_point) { this._point = _point; }

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

    parents() {
        return this._parents;
    }

    childs() {
        return this._childs;
    }

    getAllChilds() {
        let allChilds = [this];
        for (const child of this._childs) {
            allChilds = allChilds.concat(child.getAllChilds());
        }
        return allChilds;
    }

    parent(index) {
        if (index < 0) index = this._parents.length - index;
        return this._parents[index % this._parents.length];
    }

    child(index) {
        if (index < 0) index = this._childs.length - index;
        return this._childs[index % this._childs.length];
    }

    addChild(child) {
        if (!child) throw new Error("child is none.");
        child._parents.push(this);
        this._childs.push(child);
    }

    setup(info) {
        this._info = info;
    }

    isOpenable(nowSp) {
        return this.isSelectable() && !this.isOpened() && this._info.canLearn(nowSp);
    }

    isSelectable() {
        for (const parent of this._parents) {
            if (!parent.isOpened()) return false;
        }
        return true;
    }

    isOpened() {
        return this._opened;
    }

    setOpeneStatus(openStatus) {
        this._opened = openStatus;
    }

    open() {
        this._info.learnSkill();
        this._opened = true;
    }

    close() {
        this._info.forgetSkill();
        this._opened = false;
    }

    clearPointNode() {
        this.point = null;
        if (this._childs.length === 0) return;
        for (const child of this._childs) {
            child.clearPointNode();
        }
    }

    makePointNode(x, y, mode) {
        if (this.reservedPoint()) {
            this.point = this.reservedPoint();
            x = this.reservedPoint().x;
            y = this.reservedPoint().y;
        } else {
            if (this.point) {
                if (mode === "wide") {
                    if (x < this.point.x) {
                        this.point = { x: this.point.x, y: y };
                    } else {
                        this.point = { x: x, y: this.point.y };
                    }
                } else if (mode === "long") {
                    if (y < this.point.y) {
                        this.point = { x: x, y: this.point.y };
                    } else {
                        this.point = { x: this.point.x, y: y };
                    }
                }
            } else {
                this.point = { x: x, y: y };
            }
        }
        if (this._childs.length === 0) return 1;
        if (mode === "wide") {
            let yOfs = 0;
            for (const child of this._childs) {
                yOfs += child.makePointNode(x + 1, y + yOfs, mode);
            }
            return yOfs;
        } else if (mode === "long") {
            let xOfs = 0;
            for (const child of this._childs) {
                xOfs += child.makePointNode(x + xOfs, y + 1, mode);
            }
            return xOfs;
        }
    }

    needSp() {
        return this._info.needSp();
    }

    iconBitmap() {
        return this._info.iconBitmap();
    }

    helpMessage() {
        return this._info.helpMessage();
    }
}

class SkillTreeTopNode extends SkillTreeNode {
    constructor() {
        super(null);
        this._opened = true;
        const dummyInfo = new SkillTreeNodeInfo(null, null, 0, 0, "");
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
            if (child.isOpened()) child.skillReset();
        }
    }
}

class SkillDataType {
    constructor(skillTreeName, actorId, message, helpMessage, enabled) {
        this._skillTreeName = skillTreeName;
        this._actorId = actorId;
        this._message = message;
        this._helpMessage = helpMessage;
        this._enabled = enabled;
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
}

class SkillTreeMapLoader {
    constructor(mapData, type) {
        this._mapData = mapData;
        this._type = type;
    }

    loadMap() {
        const allNodes = $skillTreeData.getAllNodesByType(this._type);
        for (const eventData of this._mapData.events) {
            if (!eventData) continue;
            let nodeTag = eventData.note;
            let node = allNodes[nodeTag];
            if (!node) continue;
            node.setReservedPoint({ x: eventData.x, y: eventData.y });
        }
    }
}

class SkillTreeConfigLoadError extends Error {}

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
        let cfgTypes = null;
        let typesArray = [];
        for (const cfg of this._configData.skillTreeTypes) {
            if (cfg.actorId === actorId) {
                cfgTypes = cfg.types;
                break;
            }
        }
        if (!cfgTypes) throw new SkillTreeConfigLoadError(`Missing types from actorId:${actorId}`);
        for (const cfgType of cfgTypes) {
            const enabled = (cfgType.length === 3 ? true : cfgType[3]);
            typesArray.push(new SkillDataType(cfgType[0], actorId, cfgType[1], cfgType[2], enabled));
        }
        return typesArray;
    }

    loadSkillTreeNodes(type) {
        const nodes = {};
        let derivative = null;
        for (const skillTreeType in this._configData.skillTreeDerivative) {
            if (skillTreeType === type.skillTreeName()) {
                derivative = this._configData.skillTreeDerivative[skillTreeType];
                break;
            }
        }
        if (!derivative) throw new SkillTreeConfigLoadError(`Missing skill type name ${type.skillTreeName()}`);
        for (const data of derivative) {
            const nodeTag = data[0];
            nodes[nodeTag] = new SkillTreeNode(nodeTag);
        }
        for (const data of derivative) {
            const nodeTag = data[0];
            if (data.length >= 2) {
                const childsTag = data[1];
                for (const childTag of childsTag) {
                    if (!nodes[childTag]) throw new SkillTreeConfigLoadError(`Unknow derivative ${childTag}`);
                    nodes[nodeTag].addChild(nodes[childTag]);
                }
            }
        }
        const topNode = new SkillTreeTopNode();
        for (const node of Object.values(nodes)) {
            if (node.parents().length === 0) topNode.addChild(node);
        }
        if (topNode.length === 0) throw new SkillTreeConfigLoadError(`Missing top nodes`);
        return topNode;
    }

    loadSkillTreeInfo(actorId, allNodes) {
        for (const cfgInfoKey in this._configData.skillTreeInfo) {
            const cfgInfo = this._configData.skillTreeInfo[cfgInfoKey];
            const nodeTag = cfgInfo[0];
            const node = allNodes[nodeTag];
            if (!node) continue;
            const skillId = cfgInfo[1];
            const needSp = cfgInfo[2];
            let iconData = ["icon"];
            if (cfgInfo.length >= 4) iconData = cfgInfo[3];
            let helpMessage = "";
            if (cfgInfo.length >= 5) helpMessage = cfgInfo[4];
            const info = new SkillTreeNodeInfo(actorId, skillId, needSp, iconData, helpMessage);
            node.setup(info);
        }
        for (const node of Object.values(allNodes)) {
            if (!node.info()) throw new SkillTreeConfigLoadError(`Node ${node.tag()} is missing node info`);
        }
    }
}

class SkillTreeData {
    constructor() {
        this._actorSp = {};
        this._topNodes = {};
        this._allTypes = {};
    }

    sp(actorId) {
        return this._actorSp[actorId];
    }

    setSp(actorId, sp) {
        this._actorSp[actorId] = sp;
    }

    gainSp(actorId, sp) {
        const nowSp = this.sp(actorId);
        this.setSp(actorId, nowSp + sp);
    }

    topNode(type) {
        return this._topNodes[type.skillTreeTag()];
    }

    setTopNode(type, topNode) {
        this._topNodes[type.skillTreeTag()] = topNode;
    }

    types(actorId) {
        return this._allTypes[actorId];
    }

    enableTypes(actorId) {
        return this.types(actorId).filter((type) => type.enabled());
    }

    setTypes(actorId, types) {
        this._allTypes[actorId] = types;
    }

    totalSp(type) {
        let resetSp = 0;
        for (const node of Object.values(this.getAllNodesByType(type))) {
            if (node.isOpened()) resetSp += node.needSp();
        }
        return resetSp;
    }

    skillReset(type) {
        for (const node of Object.values(this.getAllNodesByType(type))) {
            if (node.isOpened()) node.close();
        }
    }

    totalSpAllTypes(actorId) {
        let resetSp = 0;
        for (const type of this.enableTypes(actorId)) {
            resetSp += this.totalSp(type);
        }
        return resetSp;
    }

    skillResetAllTypes(actorId) {
        for (const type of this.enableTypes(actorId)) {
            this.skillReset(type);
        }
    }

    copyTree(dstType, srcType) {
        const dst = this.getAllNodesByType(dstType);
        const src = this.getAllNodesByType(srcType);
        for (const tag in src) {
            const srcNode = src[tag];
            const dstNode = dst[tag];
            if (srcNode && dstNode && srcNode.isOpened()) {
                srcNode.close();
                dstNode.open();
            }
        }
    }

    makePoint(type, mode) {
        this.topNode(type).clearPointNode();
        // Start point is -1 because first node is dummy. 
        if (mode === "wide") {
            this.topNode(type).makePointNode(-1, 0, mode);
        } else if (mode === "long") {
            this.topNode(type).makePointNode(0, -1, mode);
        } else {
            throw new Error(`Unknown ${ViewMode}`);
        }
    }

    getAllNodesByType(type) {
        const nodes = {};
        for (const node of this.topNode(type).getAllChilds()) {
            nodes[node.tag()] = node; 
        }
        return nodes;
    }

    makeSaveContents() {
        let contents = {};
        for (const actor of $gameParty.members()) {
            const actorId = actor.actorId();
            contents[actorId] = { sp: this.sp(actorId) };
            for (const type of this.types(actorId)) {
                const openeStatus = {};
                const reservedPoint = {};
                const nodes = this.getAllNodesByType(type);
                for (const tag in nodes) {
                    openeStatus[tag] = nodes[tag].isOpened();
                    reservedPoint[tag] = nodes[tag].reservedPoint();
                }
                contents[type.skillTreeTag()] = {
                    enabled: type.enabled(),
                    openeStatus: openeStatus,
                    reservedPoint: reservedPoint,
                };
            }
        }
        return contents;
    }

    loadSaveContents(contents) {
        for (const actor of $gameParty.members()) {
            const actorId = actor.actorId();
            this.setSp(actorId, contents[actorId].sp);
            for (const type of this.types(actorId)) {
                type.setEnabled(contents[type.skillTreeTag()].enabled);
                const nodes = this.getAllNodesByType(type);
                for (const tag in nodes) {
                    nodes[tag].setOpeneStatus(contents[type.skillTreeTag()].openeStatus[tag]);
                    nodes[tag].setReservedPoint(contents[type.skillTreeTag()].reservedPoint[tag]);
                }
            }
        }
    }
}

class SkillTreeManager {
    constructor() {
        this.reset();
    }

    reset() {
        this._actorId = null;
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
        if (!this._selectNode) throw new Error("selectNode is null");
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
        parent = this._selectNode.parent(0);
        if (!parent) throw new Error("Unknown parent");
        const i = parent.childs().indexOf(this._selectNode);
        const nextNode = parent.child(i + 1);
        if (nextNode !== this._selectNode) {
            this._selectNode = nextNode;
            return true;
        }
        return false;
    }

    changePrevNode() {
        parent = this._selectNode.parent(0);
        if (!parent) throw new Error("Unknown parent");
        const i = parent.childs().indexOf(this._selectNode);
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
        for (const node of Object.values(nodes)) {
            const x = node.point.x;
            const y = node.point.y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }
        return [maxX, maxY];
    }

    searchNode(xWay, yWay) {
        const nodes = Object.values(this.getAllNodes());
        if (xWay !== 0) {
            let candidates = nodes.filter(node => node.point.y === this._selectNode.point.y);
            if (candidates.length === 0) {
                return null;
            } else if (xWay === 1) {
                candidates = candidates.filter(node => node.point.x > this._selectNode.point.x)
                const fars = candidates.map(candidate => candidate.point.x - this._selectNode.point.x);
                const i = fars.indexOf(Math.min(...fars))
                return candidates[i];
            } else if (xWay === -1) {
                candidates = candidates.filter(node => node.point.x < this._selectNode.point.x)
                const fars = candidates.map(candidate => candidate.point.x - this._selectNode.point.x);
                const i = fars.indexOf(Math.max(...fars))
                return candidates[i];
            }
        } else if (yWay !== 0) {
            let candidates = nodes.filter(node => node.point.x === this._selectNode.point.x);
            if (candidates.length === 0) {
                return null;
            } else if (yWay === 1) {
                candidates = candidates.filter(node => node.point.y > this._selectNode.point.y)
                const fars = candidates.map(candidate => candidate.point.y - this._selectNode.point.y);
                const i = fars.indexOf(Math.min(...fars))
                return candidates[i];
            } else if (yWay === -1) {
                candidates = candidates.filter(node => node.point.y < this._selectNode.point.y)
                const fars = candidates.map(candidate => candidate.point.y - this._selectNode.point.y);
                const i = fars.indexOf(Math.max(...fars))
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
        } else if (ViewMode === "long") {
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
        } else if (ViewMode === "long") {
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
        } else if (ViewMode === "long") {
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
        } else if (ViewMode === "long") {
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
        return this._selectNode.isOpenable($skillTreeData.sp(this._actorId));
    }

    selectNodeOpen() {
        this._selectNode.open();
        $skillTreeData.gainSp(this._actorId, -this._selectNode.needSp());
    }

    makePoint() {
        $skillTreeData.makePoint(this._type, ViewMode);
    }

    getAllNodes() {
        return $skillTreeData.getAllNodesByType(this._type);
    }
}

class Scene_SkillTree extends Scene_MenuBase {
    create() {
        super.create();
        this._skillTreeManager = new SkillTreeManager($skillTreeData);
        this.updateActor();
        this.createHelpWindow();
        this.createActorInfoWindow();
        this.createTypeSelectWindow();
        this.updateSkillTree();
        this.createSkillTreeNodeInfo();
        this.createSKillTreeWindow();
        this.createNodeOpenWindow();
    }

    isReady() {
        if (!super.isReady()) return false;
        if (RectImageFileName) {
            const rectImage = ImageManager.loadBitmap("img/", RectImageFileName);
            if (!rectImage.isReady()) return false;
        }
        if (typeof Array.prototype.flatMap !== "undefined") {
            const nodes = $gameParty.members()
                                    .flatMap(actor => $skillTreeData.types(actor.actorId()))
                                    .flatMap(type => Object.values($skillTreeData.getAllNodesByType(type)));
            for (const node of nodes) {
                if (!node.iconBitmap().isReady()) return false;
            }
        } else {
            for (const actor of $gameParty.members()) {
                for (const type of $skillTreeData.types(actor.actorId())) {
                    for (const node of Object.values($skillTreeData.getAllNodesByType(type))) {
                        if (!node.iconBitmap().isReady()) return false;
                    }
                }
            }
        }
        return true;
    }

    start() {
        super.start();
        this._windowTypeSelect.showHelpWindow();
        this._windowTypeSelect.open();
        this._windowTypeSelect.activate();
        this._windowTypeSelect.show();
        this._windowActorInfo.open();
        this._windowActorInfo.show();
        this._windowSkillTree.open();
        this._windowSkillTree.show();
    }

    createTypeSelectWindow() {
        this._windowTypeSelect = new Window_TypeSelect(this.typeSelectWindowRect(), this.getSkillTreeTypes());
        this.typeSelectWindowSetupHandlers();
        this._windowTypeSelect.close();
        this._windowTypeSelect.refresh();
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
        this._windowActorInfo.refresh();
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
        this._windowSkillTreeNodeInfo.refresh();
        this._windowSkillTreeNodeInfo.deactivate();
        this._windowSkillTreeNodeInfo.hide();
        this.addWindow(this._windowSkillTreeNodeInfo);
    }

    createSKillTreeWindow() {
        this._windowSkillTree = new Window_SkillTree(this.skillTreeWindowRect(),
                                                        this._skillTreeManager,
                                                        this._windowTypeSelect,
                                                        this._windowSkillTreeNodeInfo);
        this._windowSkillTree.setHandler("ok", this.skillTreeOk.bind(this));
        this._windowSkillTree.setHandler("cancel", this.skillTreeCance.bind(this));
        this._windowSkillTree.setHelpWindow(this._helpWindow);
        this._windowSkillTree.refresh();
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
        this._windowNodeOpen.refresh();
        this._windowNodeOpen.deactivate();
        this._windowNodeOpen.hide();
        this.addWindow(this._windowNodeOpen);
    }

    isBottomHelpMode() {
        if (Utils.RPGMAKER_NAME === "MZ" && EnableMZLayout) return super.isBottomHelpMode();
        return false;
    }

    isBottomButtonMode() {
        if (Utils.RPGMAKER_NAME === "MZ" && EnableMZLayout) return super.isBottomButtonMode();
        return false;
    }

    isRightInputMode() {
        if (Utils.RPGMAKER_NAME === "MZ" && EnableMZLayout) return super.isRightInputMode();
        return false;
    }

    buttonAreaTop() {
        if (Utils.RPGMAKER_NAME === "MZ") return super.buttonAreaTop();
        return this.isBottomButtonMode() ? Graphics.boxHeight : 0;
    }

    buttonAreaHeight() {
        if (Utils.RPGMAKER_NAME === "MZ") return super.buttonAreaHeight();
        return 0;
    }

    mainCommandWidth() {
        if (Utils.RPGMAKER_NAME === "MZ") return super.mainCommandWidth();
        return 240;
    }

    helpWindowRect() {
        if (Utils.RPGMAKER_NAME === "MZ") return super.helpWindowRect();
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
            } else {
                y = this.buttonAreaBottom();
            }
        } else if (this.isBottomButtonMode()) {
            const helpWindowRect = this.helpWindowRect();
            y = helpWindowRect.y + helpWindowRect.height;
        } else {
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
        const h = 200;
        const y = skillTreeNodeInfoWindowRect.y - h;
        return new Rectangle(x, y, w, h);
    }

    skillTreeNodeInfoWindowRect() {
        const w = this.mainCommandWidth();
        let x;
        if (this.isRightInputMode()) {
            x = Graphics.boxWidth - w;
        } else {
            x = 0;
        }
        const h = 110;
        let y;
        if (this.isBottomHelpMode()) {
            const helpWindowRect = this.helpWindowRect();
            y = helpWindowRect.y - h;
        } else {
            if (this.isBottomButtonMode()) {
                y = this.buttonAreaTop() - h;
            } else {
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
        } else {
            x = typeSelectWindowRect.width;
        }
        const w = Graphics.boxWidth - typeSelectWindowRect.width;
        const y = typeSelectWindowRect.y;
        let h;
        if (this.isBottomHelpMode()) {
            const helpWindowRect = this.helpWindowRect();
            h = helpWindowRect.y - y;
        } else if (this.isBottomButtonMode()) {
            h = this.buttonAreaTop() - y;
        } else {
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
        this.changeTypeWindowToSkillTreeWindow();
    }

    typeCancel() {
        this.popScene();
    }

    skillTreeOk() {
        this.changeSkillTreeWindowToNodeOpenWindow();
    }

    skillTreeCance() {
        this.changeSkillTreeWindowToTypeWindow();
    }

    nodeOpenOk() {
        this._skillTreeManager.selectNodeOpen();
        this.playLearnSkillSe();
        this.changeNodeOpenWindowToSkillTreeWindow();
        this._windowSkillTree.refresh();
        this._windowActorInfo.refresh();
    }

    nodeOpenCancel() {
        this.changeNodeOpenWindowToSkillTreeWindow();
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
        } else {
            if (this._windowSkillTree) this._windowSkillTree.setDrawState("undraw");
        }

    }

    changeTypeWindowToSkillTreeWindow() {
        this._windowTypeSelect.deactivate();
        this._windowTypeSelect.hideHelpWindow();
        this._windowSkillTreeNodeInfo.refresh();
        this._windowSkillTreeNodeInfo.open();
        this._windowSkillTreeNodeInfo.show();
        this._windowSkillTree.refresh();
        this._windowSkillTree.showHelpWindow();
        this._windowSkillTree.activate();
    }

    changeSkillTreeWindowToTypeWindow() {
        this._windowSkillTree.deactivate();
        this._windowSkillTree.hideHelpWindow();
        this._windowSkillTreeNodeInfo.close();
        this._windowTypeSelect.showHelpWindow();
        this._windowTypeSelect.activate();
        this._windowTypeSelect.open();
    }

    changeSkillTreeWindowToNodeOpenWindow() {
        this._windowSkillTree.deactivate();
        this._windowNodeOpen.refresh();
        this._windowNodeOpen.activate();
        this._windowNodeOpen.show();
        this._windowNodeOpen.open();
    }

    changeNodeOpenWindowToSkillTreeWindow() {
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
        if (LearnSkillSeFileName === "") return;
        const se = {
            name: LearnSkillSeFileName,
            pan: LearnSkillSePan,
            pitch: LearnSkillSePitch,
            volume: LearnSkillSeVolume,
        }
        AudioManager.playSe(se);
    }
}

class Window_TypeSelect extends Window_Command {
    initialize(rect, types) {
        this._windowRect = rect;
        this._types = types;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
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

    updateHelp() {
        let description = "";
        if (this.type()) description = this.type().helpMessage();
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

class Window_ActorInfo extends Window_Base {
    initialize(rect, actorId) {
        this._actorId = actorId;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
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
        const actor = $gameParty.members().find(actor => actor.actorId() === this._actorId);
        if (!actor) throw new Error(`actor id: ${this._actorId} is not found.`)
        return actor;
    }

    draw() {
        const textWidth = this.width - this.padding * 2;
        this.drawActorFace(this.actor(), 0, 0, textWidth, this.height - 100);
        this.drawText(`${this.actor().name()}`, 0, this.height - 100, textWidth, "left");
        this.changeTextColor(this.systemColor());
        const nowSp = $skillTreeData.sp(this._actorId);
        this.drawText(SpName, 0, this.height - 70, textWidth);
        this.resetTextColor();
        const nowSpTextX = this.textWidth(SpName) + (textWidth - this.textWidth(SpName)) / 2;
        this.drawText(nowSp.toString(), 0, this.height - 70, nowSpTextX, "right");
    }

    systemColor() {
        if (Utils.RPGMAKER_NAME === "MZ") return ColorManager.systemColor();
        return super.systemColor();
    }

    drawActorFace(actor, x, y, width, height) {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
    }
}

class Window_SkillTreeNodeInfo extends Window_Base {
    initialize(rect, skillTreeManager) {
        this._skillTreeManager = skillTreeManager;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
            super.initialize(rect.x, rect.y, rect.width, rect.height);
        }
    }

    refresh() {
        if (this.contents) {
            this.contents.clear();
            if (this._skillTreeManager.type()) this.draw();
        }
    }

    draw() {
        const textWidth = this.width - this.padding * 2;
        const selectNode = this._skillTreeManager.selectNode();
        const skill = selectNode.info().skill();
        this.drawText(skill.name, 0, 0, textWidth, "left");
        const needSp = selectNode.needSp();
        const nowSp = $skillTreeData.sp(this._skillTreeManager.actorId());
        if (selectNode.isOpened()) {
            this.drawText(OpenedNodeText, 0, 40, textWidth, "left");
        } else {
            this.drawText(NeedSpText.format(SpName), 0, 40, textWidth, "left");
            if (needSp <= nowSp) {
                this.changeTextColor(this.crisisColor());
            } else {
                this.changePaintOpacity(false);
            }
            this.drawText(`${needSp}/${nowSp}`, 0, 40, textWidth, "right");
        }
        this.resetTextColor();
        this.changePaintOpacity(true);
    }

    crisisColor() {
        if (Utils.RPGMAKER_NAME === "MZ") return ColorManager.crisisColor();
        return super.crisisColor();
    }
}

class Window_SkillTree extends Window_Selectable {
    initialize(rect, skillTreeManager, windowTypeSelect, windowSkillTreeNodeInfo) {
        this._skillTreeManager = skillTreeManager;
        this._windowTypeSelect = windowTypeSelect;
        this._windowSkillTreeNodeInfo = windowSkillTreeNodeInfo;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
            super.initialize(rect.x, rect.y, rect.width, rect.height);
        }
        this._skillTreeView = new SkillTreeView(skillTreeManager, rect.width, rect.height);
        this._bitmapCache = null;
        this._drawState = "undraw";
    }

    setDrawState(drawState) {
        this._drawState = drawState;
    }

    update() {
        super.update();
        if (this._drawState === "undraw") this.updateCursor();
        this.updateView();
    }

    updateView() {
        if (this._drawState === "none") return;
        this.drawView();
        this._drawState = "none";
    }

    updateHelp() {
        const skill = this._skillTreeManager.selectNode().info().skill();
        this.setHelpWindowItem(skill);
        if (this._windowSkillTreeNodeInfo.isOpen()) this._windowSkillTreeNodeInfo.refresh();
    }

    updateCursor() {
        if (this.isCursorVisible() && this._skillTreeManager.type()) {
            const rect = this._skillTreeView.getCursorRect();
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
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
        if (this._drawState === "undraw") return;
        this._drawState = "createView";
        this.updateView();
    }

    drawView() {
        this.contents.clear();
        if (this._drawState === "undraw") return;
        const view = this.getView();
        const [viewX, viewY] = this._skillTreeView.viewXY();
        this.contents.blt(view, viewX, viewY, this.width, this.height, 0, 0);
    }

    getView() {
        if (this._drawState === "updateScroll" && this._bitmapCache) return this._bitmapCache;
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
            this.onTouchOk();
        } else {
            this.onTouchSelect(triggered);
        }
    }

    onTouchSelect(trigger) {
        const localPos = this.getLocalPos();
        const hitNode = this.hitTest(localPos.x, localPos.y);
        if (!hitNode) return;
        const moved = this._skillTreeManager.select(hitNode);
        if (moved) {
            this._drawState = "updateScroll";
            this.changeSelectNode();
        }
    }

    onTouchOk() {
        const localPos = this.getLocalPos();
        const hitNode = this.hitTest(localPos.x, localPos.y);
        if (!hitNode) return;
        const moved = this._skillTreeManager.select(hitNode);
        if (moved) {
            this._drawState = "updateScroll";
            this.changeSelectNode();
        } else {
            this.processOk();
        }
    }

    getLocalPos() {
        if (Utils.RPGMAKER_NAME === "MZ") {
            const touchPos = new Point(TouchInput.x, TouchInput.y);
            return this.worldTransform.applyInverse(touchPos);
        } else {
            const x = this.canvasToLocalX(TouchInput.x);
            const y = this.canvasToLocalY(TouchInput.y);
            return { x: x, y: y };
        }
    }

    hitTest(x, y) {
        const [viewX, viewY] = this._skillTreeView.viewXY(); 
        if (this.isContentsArea(x, y)) {
            const cx = x - this.padding;
            const cy = y - this.padding;
            const nodes = this._skillTreeManager.getAllNodes();
            for (const node of Object.values(nodes)) {
                let [px, py] = SkillTreeView.getPixelXY(node.point);
                px -= viewX;
                py -= viewY;
                let px2 = px + IconWidth;
                let py2 = py + IconHeight;
                if (px <= cx && cx < px2 && py <= cy && cy < py2) {
                    return node;
                }
            }
        }
        return null;
    }

    isContentsArea(x, y) {
        if (Utils.RPGMAKER_NAME === "MV") return super.isContentsArea(x, y);
        return true;
    }
}

class Window_NodeOpen extends Window_Command {
    initialize(rect, skillTreeManager) {
        this._windowRect = rect;
        this._skillTreeManager = skillTreeManager;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
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
        if (!this._skillTreeManager.type()) return;
        const needSp = this._skillTreeManager.selectNode().needSp();
        const skillName = this._skillTreeManager.selectNode().info().skill().name;
        const textWidth = this.windowWidth() - this.padding * 2;
        this.drawText(NodeOpenConfirmationText.format(needSp, SpName, skillName), 0, 0, textWidth, "left");
    }

    // The SE of skill learn is played, so the SE of OK is not played.
    playOkSound() {
        if (this.currentSymbol() === "no") super.playOkSound();
    }
}

class SkillTreeView {
    constructor(skillTreeManager, windowWidth, windowHeight) {
        this._skillTreeManager = skillTreeManager;
        this._windowWidth = windowWidth;
        this._windowHeight = windowHeight;
    }

    static getPixelXY(point) {
        const px = point.x * (IconWidth + IconSpaceWidth) + ViewBeginXOffset;
        const py = point.y * (IconHeight + IconSpaceHeight) + ViewBeginYOffset;
        return [px, py];
    }

    maxPxy() {
        const [maxX, maxY] = this._skillTreeManager.maxXY();
        return SkillTreeView.getPixelXY({ x: maxX, y: maxY });
    }

    viewXY() {
        const selectNode = this._skillTreeManager.selectNode();
        const [selectNodePx, selectNodePy] = SkillTreeView.getPixelXY(selectNode.point);
        let [maxPx, maxPy] = this.maxPxy();
        maxPx += (IconWidth + IconSpaceWidth);
        maxPy += (IconHeight + IconSpaceHeight);
        let viewX, viewY;

        if (selectNodePx < this._windowWidth / 2) {
            viewX = 0;
        } else if (maxPx - selectNodePx < this._windowWidth / 2) {
            viewX = maxPx - (this._windowWidth - ViewBeginXOffset);
        } else {
            viewX = Math.floor(selectNodePx - this._windowWidth / 2);
        }

        if (selectNodePy < this._windowHeight / 2) {
            viewY = 0;
        } else if (maxPy - selectNodePy < this._windowHeight / 2) {
            viewY = maxPy - (this._windowHeight - ViewBeginYOffset);
        } else {
            viewY = Math.floor(selectNodePy - this._windowHeight / 2);
        }

        if (viewX < 0) viewX = 0;
        if (viewY < 0) viewY = 0;
        return [viewX, viewY];
    }

    viewDrawNode(bitmap) {
        for (const node of Object.values(this._skillTreeManager.getAllNodes())) {
            let [px, py] = SkillTreeView.getPixelXY(node.point);
            if (node.isSelectable()) {
                this.drawIcon(bitmap, node.iconBitmap(), px, py);
            } else {
                this.drawIcon(bitmap, node.iconBitmap(), px, py, 64);
            }
            if (node.isOpened()) {
                const x = px - ViewRectOfs;
                const y = py - ViewRectOfs;
                if (RectImageFileName) {
                    const rectImage = ImageManager.loadBitmap("img/", RectImageFileName);
                    bitmap.blt(rectImage, 0, 0, rectImage.width, rectImage.height, x, y);
                } else {
                    const width = IconWidth + ViewRectOfs * 2;
                    const height = IconHeight + ViewRectOfs * 2;
                    this.drawRect(bitmap, ViewRectColor, x, y, width, height);
                }
            }
        }
    }

    viewDrawLine(bitmap) {
        for (const node of Object.values( this._skillTreeManager.getAllNodes())) {
            let [px, py] = SkillTreeView.getPixelXY(node.point);
            for (const child of node.childs()) {
                let color;
                if (node.isOpened()) {
                    color = ViewLineColorLearned;
                } else {
                    color = ViewLineColorBase;
                }

                const [xDiff, yDiff] = this.nodeDiff(node, child);
                if (ViewMode === "wide") {

                    const pxOfs = IconWidth;
                    const pyOfs = IconHeight / 2;
                    if (node.point.y === child.point.y) {
                        this.drawLine(bitmap, px + pxOfs, py + pyOfs, px + pxOfs + xDiff, py + pyOfs, color);
                    } else {
                        const px1 = px + pxOfs;
                        const py1 = py + pyOfs;
                        const px2 = px1 + xDiff / 4;
                        const py2 = py1;
                        this.drawLine(bitmap, px1, py1, px2, py2, color);
                        const px3 = px2 + xDiff / 2;
                        const py3 = py2 + yDiff;
                        this.drawLine(bitmap, px2, py2, px3, py3, color);
                        const px4 = px3 + xDiff / 4;
                        const py4 = py3;
                        this.drawLine(bitmap, px3, py3, px4, py4, color);
                    }

                } else if (ViewMode === "long") {

                    const pxOfs = IconWidth / 2;
                    const pyOfs = IconHeight;
                    if (node.point.x === child.point.x) {
                        this.drawLine(bitmap, px + pxOfs, py + pyOfs, px + pxOfs, py + pyOfs + yDiff, color);
                    } else {
                        const px1 = px + pxOfs;
                        const py1 = py + pyOfs;
                        const px2 = px1;
                        const py2 = py1 + yDiff / 4;
                        this.drawLine(bitmap, px1, py1, px2, py2, color);
                        const px3 = px2 + xDiff;
                        const py3 = py2 + yDiff / 2;
                        this.drawLine(bitmap, px2, py2, px3, py3, color);
                        const px4 = px3;
                        const py4 = py3 + yDiff / 4;
                        this.drawLine(bitmap, px3, py3, px4, py4, color);
                    }

                }
            }
        }
    }

    nodeDiff(node1, node2) {
        const [px1, py1] = SkillTreeView.getPixelXY(node1.point);
        const [px2, py2] = SkillTreeView.getPixelXY(node2.point);
        let xDiff = px2 - px1;
        let yDiff = py2 - py1;
        if (ViewMode === "wide") {
            if (xDiff < 0) {
                xDiff += IconWidth;
            } else if (xDiff > 0) {
                xDiff -= IconWidth;
            }
        } else if (ViewMode === "long") {
            if (yDiff < 0) {
                yDiff += IconHeight;
            } else if (yDiff > 0) {
                yDiff -= IconHeight;
            }
        }
        return [xDiff, yDiff];
    }

    createView() {
        this._skillTreeManager.makePoint();
        const [maxPx, maxPy] = this.maxPxy();
        const width = Math.ceil(maxPx / this._windowWidth) * this._windowWidth * 1.5;
        const height = Math.ceil(maxPy / this._windowHeight) * this._windowHeight * 1.5;
        const bitmap = new Bitmap(width, height);
        this.viewDrawLine(bitmap);
        this.viewDrawNode(bitmap);
        return bitmap;
    }

    getCursorRect() {
        this._skillTreeManager.makePoint();
        const selectNode = this._skillTreeManager.selectNode();
        const [px, py] = SkillTreeView.getPixelXY(selectNode.point);
        const [viewX, viewY] = this.viewXY();
        return {
            x: px - ViewCursorOfs - viewX,
            y: py - ViewCursorOfs - viewY,
            width: IconWidth + ViewCursorOfs * 2,
            height: IconHeight + ViewCursorOfs * 2
        };
    }

    drawLine(bitmap, x1, y1, x2, y2, color) {
        const ctx = bitmap._context;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = ViewLineWidth;
        ctx.closePath();
        ctx.stroke();
    }

    drawRect(bitmap, style, x, y, width, height) {
        const ctx = bitmap._context;
        ctx.strokeStyle = style;
        ctx.lineWidth = 2;
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


// Initialize skill tree.
const _DataManager_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function() {
    this.initSkillTree();
    _DataManager_setupNewGame.call(this);
};

const _DataManager_setupBattleTest = DataManager.setupBattleTest;
DataManager.setupBattleTest = function() {
    this.initSkillTree();
    _DataManager_setupBattleTest.call(this);
};

const _DataManager_setupEventTest = DataManager.setupEventTest;
DataManager.setupEventTest = function() {
    this.initSkillTree();
    _DataManager_setupEventTest.call(this);
};

DataManager.initSkillTree = function() {
    $skillTreeData = new SkillTreeData();
    $skillTreeConfigLoader = new SkillTreeConfigLoader();
};

const _Game_Party_setupStartingMembers = Game_Party.prototype.setupStartingMembers;
Game_Party.prototype.setupStartingMembers = function() {
    _Game_Party_setupStartingMembers.call(this);
    for (const actor of this.members()) {
        const actorId = actor.actorId();
        $skillTreeConfigLoader.loadConfig(actorId);
        if (!$skillTreeData.sp(actorId)) $skillTreeData.setSp(actorId, 0);
    }
};

const _Game_Party_addActor = Game_Party.prototype.addActor;
Game_Party.prototype.addActor = function(actorId) {
    _Game_Party_addActor.call(this, actorId);
    $skillTreeConfigLoader.loadConfig(actorId);
    if (!$skillTreeData.sp(actorId)) $skillTreeData.setSp(actorId, 0);
};


// Add skill tree to menu command.
const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    _Window_MenuCommand_addOriginalCommands.call(this);
    this.addCommand(MenuSkillTreeText, "skillTree", this.isEnabledSkillTree());
};

Window_MenuCommand.prototype.isEnabledSkillTree = function() {
    if (EnabledSkillTreeSwitchId === 0) return true;
    return $gameSwitches.value(EnabledSkillTreeSwitchId);
};

const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler("skillTree", this.commandPersonal.bind(this));
};

const _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
Scene_Menu.prototype.onPersonalOk = function() {
    _Scene_Menu_onPersonalOk.call(this);
    switch (this._commandWindow.currentSymbol()) {
    case "skillTree":
        SceneManager.push(Scene_SkillTree);
        break;
    }
};


// Includes skill tree data in save data.
const _DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function(){
    const contents = _DataManager_makeSaveContents.call(this);
    contents.skillTreeData = $skillTreeData.makeSaveContents();
    return contents;
};

const _DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents){
    _DataManager_extractSaveContents.call(this, contents);
    if (contents.skillTreeData) $skillTreeData.loadSaveContents(contents.skillTreeData);
};


// Actor gain sp.
Game_Party.prototype.gainSp = function(sp) {
    for (const actor of this.members()) {
        actor.gainSp(sp);
    }
};

Game_Actor.prototype.gainSp = function(sp) {
    $skillTreeData.gainSp(this.actorId(), sp);
    if ($skillTreeData.sp(this.actorId()) > MaxSp) {
        $skillTreeData.setSp(this.actorId(), MaxSp);
    }
};


// Get the sp when win a battle.
Game_Enemy.prototype.sp = function() {
    const battleEndGainSp = this.enemy().meta.battleEndGainSp;
    return battleEndGainSp ? parseInt(battleEndGainSp) : 0;
};

Game_Troop.prototype.spTotal = function() {
    return this.deadMembers().reduce((r, enemy) => {
        return r + enemy.sp();
    }, 0);
};

const _BattleManager_makeRewards = BattleManager.makeRewards;
BattleManager.makeRewards = function() {
    _BattleManager_makeRewards.call(this);
    if (EnableGetSpWhenBattleEnd) this._rewards.sp = $gameTroop.spTotal();
};

const _BattleManager_gainRewards = BattleManager.gainRewards;
BattleManager.gainRewards = function() {
    _BattleManager_gainRewards.call(this);
    if (EnableGetSpWhenBattleEnd) this.gainSp();
};

BattleManager.gainSp = function() {
    $gameParty.gainSp(this._rewards.sp);
};

const _BattleManager_displayRewards = BattleManager.displayRewards;
BattleManager.displayRewards = function() {
    if (EnableGetSpWhenBattleEnd) {
        this.displayExp();
        this.displayGold();
        this.displaySp();
        this.displayDropItems();
    } else {
        _BattleManager_displayRewards.call(this);
    }
};

BattleManager.displaySp = function() {
    const sp = this._rewards.sp;
    if (sp > 0) {
        $gameMessage.add("\\." + BattleEndGetSpText.format(sp, SpName));
    }
};


// Get the sp when level up.
Game_Actor.enableGetSpWhenLevelUp = EnableGetSpWhenLevelUp;

const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
    _Game_Actor_levelUp.call(this);
    if (Game_Actor.enableGetSpWhenLevelUp) {
        const sp = this.getLevelUpSp(this._level);
        if (sp > 0) this.gainSp(sp);
    }
};

const _Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
Game_Actor.prototype.displayLevelUp = function(newSkills) {
    _Game_Actor_displayLevelUp.call(this, newSkills);
    if (Game_Actor.enableGetSpWhenLevelUp) {
        const sp = this.getLevelUpSp(this._level);
        if (sp > 0) $gameMessage.add(LevelUpGetSpText.format(sp, SpName));
    }
};

Game_Actor.prototype.getLevelUpSp = function(level) {
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
Game_Actor.prototype.changeClass = function(classId, keepExp) {
    Game_Actor.enableGetSpWhenLevelUp = false;
    _Game_Actor_changeClass.call(this, classId, keepExp);
    Game_Actor.enableGetSpWhenLevelUp = EnableGetSpWhenLevelUp;
};


// Define class alias.
SkillTreeClassAlias.SkillTreeNodeInfo = SkillTreeNodeInfo;
SkillTreeClassAlias.SkillTreeNode = SkillTreeNode;
SkillTreeClassAlias.SkillTreeTopNode = SkillTreeTopNode;
SkillTreeClassAlias.SkillDataType = SkillDataType;
SkillTreeClassAlias.SkillTreeMapLoader = SkillTreeMapLoader;
SkillTreeClassAlias.SkillTreeConfigLoadError = SkillTreeConfigLoadError;
SkillTreeClassAlias.SkillTreeConfigLoader = SkillTreeConfigLoader;
SkillTreeClassAlias.SkillTreeData = SkillTreeData;
SkillTreeClassAlias.SkillTreeManager = SkillTreeManager;
SkillTreeClassAlias.Scene_SkillTree = Scene_SkillTree;
SkillTreeClassAlias.Window_TypeSelect = Window_TypeSelect;
SkillTreeClassAlias.Window_ActorInfo = Window_ActorInfo;
SkillTreeClassAlias.Window_SkillTreeNodeInfo = Window_SkillTreeNodeInfo;
SkillTreeClassAlias.Window_SkillTree = Window_SkillTree;
SkillTreeClassAlias.Window_NodeOpen = Window_NodeOpen;
SkillTreeClassAlias.SkillTreeView = SkillTreeView;
})();
