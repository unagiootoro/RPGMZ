/*:
@target MV MZ
@plugindesc Character movement motion expansion v1.2.3
@author unagiootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/CharacterMoveMotionEx.js
@help
It is a plug-in that extends the movement motion of the character. Add the following features.
・Increase the number of walking motions to 4 or more.
・Add diagonal movement motion.
・Add a dash motion.

【How to use】
■ Increase the number of character motions
By ending the file name of the character image with "_M<number of motions>",
Animation can be displayed with the specified number of motions.
In this case, the character image is a single character
Must be (image with $ at the beginning of the file name).
For example: $character_M4.png

In addition, the material standards when the motion is increased are as follows.
-------------
|↓1|↓2|↓3|↓n|
|←1|←2|←3|←n|
|→1|→2|→3|→n|
|↑1|↑2|↑3|↑n|
-------------

Standards for increasing the number of motions are dash, diagonal walking,
It can be applied to diagonal dashes in the same way.
With this, even if you dash, 4 or more
It becomes possible to display the motion.

■ Add wait, dash, diagonal walk, and diagonal dash motions
In the plug-in parameter "Character movement motion list"
By registering various motions, it is possible to change the motion when moving.

"Character file name" is set as the plug-in parameter for each motion.
"Character index" must be specified,
Specify the following contents respectively.
[Character file name]
Specify the image file name corresponding to the motion of the character.
[Character Index]
When using an image with 4 * 2 characters registered, which position should be used for the image?
Specify whether to use it with a numerical value from 0 to 7. 0 to 3 are the first row,
4 to 7 are the second row. Single character image
Specify 0 for (file name with $ at the beginning).

■ Precautions when changing character images
When changing the character image from the moving route,
Be sure to specify the image of the motion when walking.

■ Material standard for diagonal walking
The material standards for diagonal walking are as follows.
----------
|↙1|↙2|↙3|
|↖1|↖2|↖3|
|↘1|↘2|↘3|
|↗1|↗2|↗3|
----------

【Competition response】
This plug-in is compatible with the dot movement system.
When using with the dot movement system, use this plug-in.
Please install below the dot movement plugin.

【License】
This plugin is available under the terms of the MIT license.

@param CharacterMoveMotionList
@text Character movement motion list
@type struct<CharacterMoveMotion>[]
@desc
Register a list of character movement motions.

@param PatternRepetitionMode
@text Pattern repeat mode
@type select
@option Rewind
@value rewind
@option Restart
@value restart
@default rewind
@desc
Specifies the repeat mode for the character's pattern.
*/
/*~struct~CharacterMoveMotion:
@param WalkMotion
@text walking motion
@type struct<Motion>
@desc
Specify the walking motion.

@param WaitMotion
@text waiting motion
@type struct<Motion>
@desc
Specifies the standby motion.

@param DashMotion
@text dash motion
@type struct<Motion>
@desc
Specify the dash motion.

@param DiagonalWalkMotion
@text Diagonal walking motion
@type struct<Motion>
@desc
Specifies the diagonal walking motion.

@param DiagonalDashMotion
@text Diagonal dash motion
@type struct<Motion>
@desc
Specifies diagonal dash motion.
*/
/*~struct~Motion:
@param CharacterFileName
@text character file name
@type file
@dir img/characters
@desc
Specify the file name of the character.

@param CharacterIndex
@text Character index
@type number
@default 0
@desc
Specifies the character's index.

@param MotionSpeed
@text motion speed
@type number
@decimals 2
@default 3
@desc
Specifies the motion playback speed in frames.
*/
/*:ja
@target MV MZ
@plugindesc キャラクター移動モーション拡張 v1.2.3
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/CharacterMoveMotionEx.js
@help
キャラクターの移動モーションを拡張するプラグインです。次の機能を追加します。
・歩行モーション数を4以上に増加させる。
・斜め移動モーションを追加する。
・ダッシュモーションを追加する。

【使用方法】
■ キャラクターのモーション数を増やす
キャラクター画像のファイル名の末尾を「_M<モーション数>」とすることで、
指定したモーション数でアニメーション表示することができるようになります。
この場合、キャラクター画像は単独のキャラクター
(ファイル名の先頭に$がつく画像)にする必要があります。
例: $character_M4.png

また、モーションを増やした場合の素材規格は下記の通りとなります。
-------------
|↓1|↓2|↓3|↓n|
|←1|←2|←3|←n|
|→1|→2|→3|→n|
|↑1|↑2|↑3|↑n|
-------------

このモーション数を増やす場合の規格は、ダッシュ、斜め歩行、
斜めダッシュにも同様の形で適用することができます。
これによって、ダッシュした場合などでも4以上の
モーションを表示することが可能になります。

■ 待機、ダッシュ、斜め歩行、斜めダッシュのモーションを追加する
プラグインパラメータ「キャラクター移動モーションリスト」に
各種モーションを登録することで、移動時のモーション変更が可能になります。

各モーションごとのプラグインパラメータには「キャラクターファイル名」と
「キャラクターインデックス」を指定する必要があり、
それぞれ次の内容を指定します。
[キャラクターファイル名]
キャラクターのモーションに対応する画像ファイル名を指定します。
[キャラクターインデックス]
4*2のキャラクターが登録された画像を使用する場合、どの位置の画像を
使用するかを0~7までの数値で指定します。0~3までが1列目となり、
4~7までが2列目となります。単体のキャラクター画像
(ファイル名の先頭に$がつくもの)は0を指定してください。

■ キャラクター画像変更時の注意点
移動ルートからキャラクター画像を変更する場合、
必ず歩行時のモーションの画像を指定してください。

■ 斜め歩行の素材規格
斜め歩行の素材規格は下記の通りとなります。
----------
|↙1|↙2|↙3|
|↖1|↖2|↖3|
|↘1|↘2|↘3|
|↗1|↗2|↗3|
----------

【競合対応】
本プラグインではドット移動システムとの併用に対応しています。
ドット移動システムと併用する場合は、本プラグインを
ドット移動プラグインよりも下に導入してください。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@param CharacterMoveMotionList
@text キャラクター移動モーションリスト
@type struct<CharacterMoveMotion>[]
@desc
キャラクター移動モーションの一覧を登録します。

@param PatternRepetitionMode
@text パターン繰り返しモード
@type select
@option 巻き戻し
@value rewind
@option 再スタート
@value restart
@default rewind
@desc
キャラクターのパターンの繰り返しモードを指定します。
*/
/*~struct~CharacterMoveMotion:ja
@param WalkMotion
@text 歩行モーション
@type struct<Motion>
@desc
歩行モーションを指定します。

@param WaitMotion
@text 待機モーション
@type struct<Motion>
@desc
待機モーションを指定します。

@param DashMotion
@text ダッシュモーション
@type struct<Motion>
@desc
ダッシュモーションを指定します。

@param DiagonalWalkMotion
@text 斜め歩行モーション
@type struct<Motion>
@desc
斜め歩行モーションを指定します。

@param DiagonalDashMotion
@text 斜めダッシュモーション
@type struct<Motion>
@desc
斜めダッシュモーションを指定します。
*/
/*~struct~Motion:ja
@param CharacterFileName
@text キャラクターファイル名
@type file
@dir img/characters
@desc
キャラクターのファイル名を指定します。

@param CharacterIndex
@text キャラクターインデックス
@type number
@default 0
@desc
キャラクターのインデックスを指定します。

@param MotionSpeed
@text モーション速度
@type number
@decimals 2
@default 3
@desc
モーションの再生速度をフレーム単位で指定します。
*/

declare interface Window {
    MoveMotionSaveData: new () => CharacterMoveMotionEx.MoveMotionSaveData;
}

declare interface Game_CharacterBase {
    _moveMotionSaveData: CharacterMoveMotionEx.MoveMotionSaveData;
    moveMotionController(): CharacterMoveMotionEx.MoveMotionController;
    moveMotionSaveData(): CharacterMoveMotionEx.MoveMotionSaveData;
    moveMotionChangeProcess(direction: number): void;
    updateMotion(): void;
    changeMotionImage(characterName: string, characterIndex: number): void;
    straightWalkCharacterName(): string;
    straightWalkCharacterIndex(): number;
    numPattern(): number;
    originalPattern(): number;
    isDiagonalMotion(): boolean;
    diagonalMoveDirection(): number;
}

declare interface Game_Temp {
    _moveMotionControllers: Map<Game_CharacterBase, CharacterMoveMotionEx.MoveMotionController>;

    moveMotionController(character: Game_CharacterBase): CharacterMoveMotionEx.MoveMotionController;
}


const CharacterMoveMotionExPluginName = document.currentScript ? decodeURIComponent((document.currentScript as HTMLScriptElement).src.match(/^.*\/(.+)\.js$/)![1]) : "CharacterMoveMotionEx";


namespace CharacterMoveMotionEx {
    export class PluginParamsParser {
        private _predictEnable: boolean;

        static parse(params: any, typeData: any = {}, predictEnable: boolean = true) {
            return new PluginParamsParser(predictEnable).parse(params, typeData);
        }

        constructor(predictEnable = true) {
            this._predictEnable = predictEnable;
        }

        parse(params: any, typeData: any = {}): any {
            const result: any = {};
            for (const name in params) {
                const expandedParam = this.expandParam(params[name]);
                result[name] = this.convertParam(expandedParam, typeData[name]);
            }
            return result;
        }

        expandParam(strParam: string, loopCount = 0) {
            if (++loopCount > 255) throw new Error("endless loop error");
            if (strParam.match(/^\s*\[.*\]\s*$/)) {
                const aryParam = JSON.parse(strParam);
                return aryParam.map((data: any) => this.expandParam(data), loopCount + 1);
            } else if (strParam.match(/^\s*\{.*\}\s*$/)) {
                const result: any = {};
                const objParam = JSON.parse(strParam);
                for (const name in objParam) {
                    result[name] = this.expandParam(objParam[name], loopCount + 1);
                }
                return result;
            }
            return strParam;
        }

        convertParam(param: any, type: any, loopCount: number = 0): any {
            if (++loopCount > 255) throw new Error("endless loop error");
            if (typeof param === "string") {
                return this.cast(param, type);
            } else if (typeof param === "object" && param instanceof Array) {
                if (!((param == null) || (typeof param === "object" && param instanceof Array))) {
                    throw new Error(`Invalid array type: ${type}`);
                }
                return param.map((data: any, i) => {
                    const dataType: any = type == null ? undefined : type[i];
                    return this.convertParam(data, dataType, loopCount + 1)
                });
            } else if (typeof param === "object") {
                if (!((param == null) || (typeof param === "object"))) {
                    throw new Error(`Invalid object type: ${type}`);
                }
                const result: any = {};
                for (const name in param) {
                    const dataType = type == null ? undefined : type[name];
                    result[name] = this.convertParam(param[name], dataType, loopCount + 1);
                }
                return result;
            } else {
                throw new Error(`Invalid param: ${param}`);
            }
        }

        cast(param: any, type: any): any {
            if (param == null || param === "") return undefined;
            if (type == null) type = "any";
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


    const PP = PluginParamsParser.parse(PluginManager.parameters(CharacterMoveMotionExPluginName));

    const MotionType = {
        WALK: 0,
        WAIT: 1,
        DASH: 2,
        DIAGONAL_WALK: 3,
        DIAGONAL_DASH: 4,
    };

    type MotionType = typeof MotionType[keyof typeof MotionType];

    if (typeof DotMoveSystemPluginName !== "undefined") {
        const { CharacterMover } = DotMoveSystem;

        const _CharacterMover_dotMoveByDeg = CharacterMover.prototype.dotMoveByDeg;
        CharacterMover.prototype.dotMoveByDeg = function(this: DotMoveSystem.CharacterMover, deg, dpf = this._character.distancePerFrame(), opt = { changeDir: true }) {
            // TODO: 暫定
            (_CharacterMover_dotMoveByDeg as any).call(this, deg, dpf, opt);
            if (this._character.isMoved()) this._character.moveMotionChangeProcess(deg.toDirection8());
        };

        const _CharacterMover_continuousMoveProcess = CharacterMover.prototype.continuousMoveProcess;
        CharacterMover.prototype.continuousMoveProcess = function(this: DotMoveSystem.CharacterMover) {
            _CharacterMover_continuousMoveProcess.call(this);
            if (this._character.isMoved()) {
                const deg = new DotMoveSystem.Degree(this._moverData.moveDeg);
                this._character.moveMotionChangeProcess(deg.toDirection8());
            }
        };
    } else {
        const _Game_CharacterBase_moveStraight = Game_CharacterBase.prototype.moveStraight;
        Game_CharacterBase.prototype.moveStraight = function(d) {
            _Game_CharacterBase_moveStraight.call(this, d);
            if (this.isMovementSucceeded()) this.moveMotionChangeProcess(d);
        };

        const _Game_CharacterBase_moveDiagonally = Game_CharacterBase.prototype.moveDiagonally;
        Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
            _Game_CharacterBase_moveDiagonally.call(this, horz, vert);
            let d = this.direction();
            if (horz === 6 && vert === 8) {
                d = 9;
            } else if (horz === 6 && vert === 2) {
                d = 3;
            } else if (horz === 4 && vert === 2) {
                d = 1;
            } else if (horz === 4 && vert === 8) {
                d = 7;
            }
            if (this.isMovementSucceeded()) this.moveMotionChangeProcess(d);
        };
    }


    class MoveMotionUtils {
        static getNumPattern(characterName: string) {
            const matchData = characterName.match(/_M(\d+)$/)
            if (matchData) return parseInt(matchData[1]);
            return 3;
        }

        static getOriginalPattern(numPattern: number) {
            return Math.floor(numPattern / 2);
        }
    }


    export class MoveMotionController {
        private _character: Game_CharacterBase;
        private _saveData: MoveMotionSaveData;

        constructor(character: Game_CharacterBase) {
            this._character = character;
            this._saveData = character.moveMotionSaveData();
        }

        resetMotion(): void {
            this._saveData.motion = MotionType.WAIT;
            this._saveData.lastMotion = MotionType.WALK; // 初回更新でWAITへの遷移を発生させるため、WALKとする。
        }

        update() {
            this.updateResetMotionImage();
            this.updateEndDashMotion();
            this.updateMotionNonmoved();
            this.updateChangeMotionImage();
        }

        moveMotionChangeProcess(direction: number) {
            this.motionChangeProcessWhenWalk();
            this.motionChangeProcessWhenDash();
            this.motionChangeProcessWhenDiagonal(direction);
        }

        motionChangeProcessWhenWalk() {
            if (this._character.isMoving()) {
                if (this._saveData.motion === MotionType.WAIT) {
                    this._saveData.motion = MotionType.WALK;
                }
            }
        }

        motionChangeProcessWhenDash() {
            let nextMotion;
            if ($gamePlayer.isDashing()) {
                if (this._saveData.motion === MotionType.DIAGONAL_WALK) {
                    nextMotion = MotionType.DIAGONAL_DASH;
                } else if (this._saveData.motion === MotionType.WAIT || this._saveData.motion === MotionType.WALK) {
                    nextMotion = MotionType.DASH;
                }
            } else {
                if (this._saveData.motion === MotionType.DIAGONAL_DASH) {
                    nextMotion = MotionType.DIAGONAL_WALK;
                } else if (this._saveData.motion === MotionType.DASH) {
                    nextMotion = MotionType.WALK;
                }
            }
            if (nextMotion != null) this._saveData.motion = nextMotion;
        }

        motionChangeProcessWhenDiagonal(direction: number) {
            if ([9, 3, 1, 7].includes(direction)) {
                this._saveData.diagonalMoveDirection = direction;
                if (this._saveData.motion === MotionType.DASH) {
                    this._saveData.motion = MotionType.DIAGONAL_DASH;
                } else if (this._saveData.motion === MotionType.WALK || this._saveData.motion === MotionType.WAIT) {
                    this._saveData.motion = MotionType.DIAGONAL_WALK;
                }
            } else {
                if (this._saveData.motion === MotionType.DIAGONAL_DASH) {
                    this._saveData.motion = MotionType.DASH;
                } else if (this._saveData.motion === MotionType.DIAGONAL_WALK) {
                    this._saveData.motion = MotionType.WALK;
                }
            }
        }

        // セーブデータを読み込んだときはsetImageはコールされないので、初回updateで現在のchanracterNameと
        // characterIndexを用いてsetImageを実行する。
        updateResetMotionImage() {
            if (this._saveData.needReset) {
                this._saveData.needReset = false;
                this._character.setImage(this._character.characterName(), this._character.characterIndex());
            }
        }

        updateEndDashMotion() {
            if (this._saveData.motion === MotionType.DASH && !$gamePlayer.isDashing()) {
                this._saveData.motion = MotionType.WALK;
            }
        }

        updateMotionNonmoved() {
            let needWait = false;
            if (typeof DotMoveSystemPluginName !== "undefined") {
                if (!this._character.isMoved()) {
                    needWait = true;
                }
            } else {
                if (!this._character.isMoving()) {
                    needWait = true;
                }
            }

            if (needWait) {
                if (this._saveData.waitReserve) {
                    this._saveData.motion = MotionType.WAIT;
                    this._saveData.waitReserve = false;
                } else {
                    this._saveData.waitReserve = true;
                }
            } else {
                this._saveData.waitReserve = false;
            }
        }

        updateChangeMotionImage() {
            if (this._saveData.lastMotion !== this._saveData.motion) {
                const motionData = this.getMotionData();
                if (motionData) {
                    if (!(this.isDiagonalMotion() && this._character.isDirectionFixed())) {
                        this._character.changeMotionImage(motionData.CharacterFileName, motionData.CharacterIndex);
                    }
                }
                this._saveData.lastMotion = this._saveData.motion;
            }
        }

        getMotionData() {
            const characterMoveMotion = this.findMoveMotion();
            if (!characterMoveMotion) return undefined;
            const motion = this.getMotionType();
            switch (motion) {
                case MotionType.WALK:
                    return characterMoveMotion.WalkMotion;
                case MotionType.WAIT:
                    return characterMoveMotion.WaitMotion;
                case MotionType.DASH:
                    return characterMoveMotion.DashMotion;
                case MotionType.DIAGONAL_WALK:
                    return characterMoveMotion.DiagonalWalkMotion;
                case MotionType.DIAGONAL_DASH:
                    return characterMoveMotion.DiagonalDashMotion;
            }
            throw new Error(`invalid motion(${motion})`);
        }

        getMotionType() {
            const characterMoveMotion = this.findMoveMotion();
            if (!characterMoveMotion) return MotionType.WALK;
            switch (this._saveData.motion) {
                case MotionType.WALK:
                    return MotionType.WALK;
                case MotionType.WAIT:
                    if (characterMoveMotion.WaitMotion && characterMoveMotion.WaitMotion.CharacterFileName != null) {
                        return MotionType.WAIT;
                    } else {
                        return MotionType.WALK;
                    }
                case MotionType.DASH:
                    if (characterMoveMotion.DashMotion && characterMoveMotion.DashMotion.CharacterFileName != null) {
                        return MotionType.DASH;
                    } else {
                        return MotionType.WALK;
                    }
                case MotionType.DIAGONAL_WALK:
                    if (characterMoveMotion.DiagonalWalkMotion && characterMoveMotion.DiagonalWalkMotion.CharacterFileName != null) {
                        return MotionType.DIAGONAL_WALK;
                    } else {
                        return MotionType.WALK;
                    }
                case MotionType.DIAGONAL_DASH:
                    if (characterMoveMotion.DiagonalDashMotion && characterMoveMotion.DiagonalDashMotion.CharacterFileName != null) {
                        return MotionType.DIAGONAL_DASH;
                    } else if (characterMoveMotion.DashMotion) {
                        return MotionType.DASH;
                    } else if (characterMoveMotion.DiagonalWalkMotion) {
                        return MotionType.DIAGONAL_WALK;
                    } else {
                        return MotionType.WALK;
                    }
            }
            throw new Error(`invalid motion(${this._saveData.motion})`);
        }

        findMoveMotion() {
            for (const characterMoveMotion of PP.CharacterMoveMotionList) {
                const walkMotion = characterMoveMotion.WalkMotion;
                if (walkMotion.CharacterFileName === this._character.straightWalkCharacterName()) {
                    if (ImageManager.isBigCharacter(this._character.straightWalkCharacterName())) {
                        return characterMoveMotion;
                    } else if (walkMotion.CharacterIndex === this._character.straightWalkCharacterIndex()) {
                        return characterMoveMotion;
                    }
                }
            }
            return undefined;
        }

        isNeedWaitAnimation() {
            return this.getMotionType() === MotionType.WAIT;
        }

        motionSpeed() {
            const motionData = this.getMotionData();
            if (!motionData || motionData.MotionSpeed == null) return 3;
            return motionData.MotionSpeed;
        }

        numPattern() {
            return this._saveData.numPattern;
        }

        setNumPattern(numPattern: number) {
            this._saveData.numPattern = numPattern;
        }

        isDiagonalMotion() {
            const motionType = this.getMotionType();
            return motionType === MotionType.DIAGONAL_WALK || motionType === MotionType.DIAGONAL_DASH;
        }

        diagonalMoveDirection() {
            return this._saveData.diagonalMoveDirection;
        }
    }


    export class MoveMotionSaveData {
        private _straightWalkCharacterName: string;
        private _straightWalkCharacterIndex: number;
        private _motion: MotionType;
        private _lastMotion: MotionType;
        private _numPattern: number;
        private _waitReserve: boolean;
        private _waitMotionDelay: number;
        private _needReset: boolean;
        private _diagonalMoveDirection: number;

        constructor() {
            this._straightWalkCharacterName = "";
            this._straightWalkCharacterIndex = 0;
            this._motion = MotionType.WAIT;
            this._lastMotion = MotionType.WALK; // 初回更新でWAITへの遷移を発生させるため、WALKとする。
            this._numPattern = 3;
            this._waitReserve = false; // WAITへの遷移を1フレーム遅延させる。
            this._waitMotionDelay = 1;
            this._needReset = true;
            this._diagonalMoveDirection = 0;
        }

        get straightWalkCharacterName(): string { return this._straightWalkCharacterName; }
        set straightWalkCharacterName(value: string) { this._straightWalkCharacterName = value; }
        get straightWalkCharacterIndex(): number { return this._straightWalkCharacterIndex; }
        set straightWalkCharacterIndex(value: number) { this._straightWalkCharacterIndex = value; }
        get motion(): MotionType { return this._motion; }
        set motion(value: MotionType) { this._motion = value; }
        get lastMotion(): MotionType { return this._lastMotion; }
        set lastMotion(value: MotionType) { this._lastMotion = value; }
        get numPattern(): number { return this._numPattern; }
        set numPattern(value: number) { this._numPattern = value; }
        get waitReserve(): boolean { return this._waitReserve; }
        set waitReserve(value: boolean) { this._waitReserve = value; }
        get waitMotionDelay(): number { return this._waitMotionDelay; }
        set waitMotionDelay(value: number) { this._waitMotionDelay = value; }
        get needReset(): boolean { return this._needReset; }
        set needReset(value: boolean) { this._needReset = value; }
        get diagonalMoveDirection(): number { return this._diagonalMoveDirection; }
        set diagonalMoveDirection(value: number) { this._diagonalMoveDirection = value; }
    }


    const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.call(this);
        this._moveMotionSaveData = new MoveMotionSaveData();
    };

    Game_CharacterBase.prototype.moveMotionController = function() {
        return $gameTemp.moveMotionController(this);
    };

    Game_CharacterBase.prototype.moveMotionSaveData = function() {
        return this._moveMotionSaveData;
    };

    Game_CharacterBase.prototype.moveMotionChangeProcess = function(direction) {
        this.moveMotionController().moveMotionChangeProcess(direction);
    };

    Game_CharacterBase.prototype.updateMotion = function() {
        this.moveMotionController().update();
    };

    const _Game_CharacterBase_setImage = Game_CharacterBase.prototype.setImage;
    Game_CharacterBase.prototype.setImage = function(characterName, characterIndex) {
        _Game_CharacterBase_setImage.call(this, characterName, characterIndex);
        this._moveMotionSaveData.straightWalkCharacterName = characterName;
        this._moveMotionSaveData.straightWalkCharacterIndex = characterIndex;
        this.moveMotionController().resetMotion();
        this.resetPattern();
        const numPattern = MoveMotionUtils.getNumPattern(characterName);
        this.moveMotionController().setNumPattern(numPattern);
    };

    Game_CharacterBase.prototype.changeMotionImage = function(this: Game_CharacterBase, characterName, characterIndex) {
        this._characterName = characterName;
        this._characterIndex = characterIndex;
        this.resetPattern();
        const numPattern = MoveMotionUtils.getNumPattern(characterName);
        this.moveMotionController().setNumPattern(numPattern);
    };

    Game_CharacterBase.prototype.straightWalkCharacterName = function() {
        return this._moveMotionSaveData.straightWalkCharacterName;
    };

    Game_CharacterBase.prototype.straightWalkCharacterIndex = function() {
        return this._moveMotionSaveData.straightWalkCharacterIndex;
    };

    Game_CharacterBase.prototype.numPattern = function() {
        return this.moveMotionController().numPattern();
    };

    Game_CharacterBase.prototype.straighten = function(this: Game_CharacterBase) {
        if (this.hasWalkAnime() || this.hasStepAnime() || this.moveMotionController().isNeedWaitAnimation()) {
            this._pattern = this.originalPattern();
        }
        this._animationCount = 0;
    };

    Game_CharacterBase.prototype.updateAnimationCount = function(this: Game_CharacterBase) {
        if (this.isMoving() && this.hasWalkAnime()) {
            this._animationCount += 1.5;
        } else if (this.hasStepAnime() || !this.isOriginalPattern() || this.moveMotionController().isNeedWaitAnimation()) {
            this._animationCount++;
        }
    };

    Game_CharacterBase.prototype.animationWait = function() {
        return Math.round((9 - this.realMoveSpeed()) * this.moveMotionController().motionSpeed());
    };

    Game_CharacterBase.prototype.isOriginalPattern = function(this: Game_CharacterBase) {
        return this.pattern() === this.originalPattern();
    };

    Game_CharacterBase.prototype.originalPattern = function() {
        return MoveMotionUtils.getOriginalPattern(this.numPattern());
    };

    Game_CharacterBase.prototype.resetPattern = function() {
        this.setPattern(this.originalPattern());
    };

    Game_CharacterBase.prototype.updatePattern = function(this: Game_CharacterBase) {
        this._pattern = (this._pattern + 1) % this.maxPattern();
    };

    Game_CharacterBase.prototype.maxPattern = function() {
        if (PP.PatternRepetitionMode === "restart") {
            return this.numPattern();
        } else {
            return this.numPattern() * 2 - 2;
        }
    };

    Game_CharacterBase.prototype.pattern = function(this: Game_CharacterBase) {
        if (this._pattern < this.numPattern()) {
            return this._pattern;
        } else {
            return this.numPattern() - this._pattern + 2;
        }
    };

    Game_CharacterBase.prototype.isDiagonalMotion = function() {
        if (this.isDirectionFixed()) return false;
        return this.moveMotionController().isDiagonalMotion();
    };

    Game_CharacterBase.prototype.diagonalMoveDirection = function() {
        return this.moveMotionController().diagonalMoveDirection();
    };


    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        this.updateMotion();
    };


    const _Game_Followers_update = Game_Followers.prototype.update;
    Game_Followers.prototype.update = function() {
        _Game_Followers_update.call(this);
        for (const follower of this._data) {
            follower.updateMotion();
        }
    };


    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._moveMotionControllers = new Map();
    };

    Game_Temp.prototype.moveMotionController = function(character) {
        let controller = this._moveMotionControllers.get(character);
        if (controller) return controller;
        controller = new MoveMotionController(character);
        this._moveMotionControllers.set(character, controller);
        return controller;
    };


    Sprite_Character.prototype.patternWidth = function(this: Sprite_Character) {
        if (this._tileId > 0) {
            return $gameMap.tileWidth();
        } else if (this._isBigCharacter) {
            return this.bitmap.width / this._character!.numPattern();
        } else {
            return this.bitmap.width / (this._character!.numPattern() * 4);
        }
    };

    Sprite_Character.prototype.characterBlockX = function(this: Sprite_Character) {
        if (this._isBigCharacter) {
            return 0;
        } else {
            const index = this._character!.characterIndex();
            return (index % 4) * this._character!.numPattern();
        }
    };

    const _Sprite_Character_characterPatternY = Sprite_Character.prototype.characterPatternY;
    Sprite_Character.prototype.characterPatternY = function(this: Sprite_Character) {
        if (this._character!.isDiagonalMotion()) {
            switch (this._character!.diagonalMoveDirection()) {
                case 1:
                    return 0;
                case 7:
                    return 1;
                case 3:
                    return 2;
                case 9:
                    return 3;
                default:
                    throw new Error(`invalid direction(${this._character!.diagonalMoveDirection()})`);
            }
        } else {
            return _Sprite_Character_characterPatternY.call(this);
        }
    };


    Window_Base.prototype.drawCharacter = function(characterName, characterIndex, x, y) {
        const numPattern = MoveMotionUtils.getNumPattern(characterName);
        const bitmap = ImageManager.loadCharacter(characterName);
        const big = ImageManager.isBigCharacter(characterName);
        const pw = bitmap.width / (big ? numPattern : numPattern * 4);
        const ph = bitmap.height / (big ? 4 : 8);
        const n = big ? 0 : characterIndex;
        const orig = MoveMotionUtils.getOriginalPattern(numPattern);
        const sx = ((n % 4) * 3 + orig) * pw;
        const sy = Math.floor(n / 4) * 4 * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    };

    window.MoveMotionSaveData = MoveMotionSaveData;
}
