/*:
@target MZ
@plugindesc タイルセット設定自動コピー v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/TilesetAutoCopy.js

@help
タイルセットの通行可否や地形タグなどの設定を自動的に別のタイルセットにコピーするプラグインです。
複数のタイルセット素材を組み合わせて使うような場合に使用すると便利かも。

【使用方法】
<copy: "dstType": コピー先タイプ, "srcId": コピー元ID, "srcType": コピー元タイプ>
dstType: コピー先のタイプ(A1～A5, B, C, D, E)
srcType: コピー元のタイプ(A1～A5, B, C, D, E)
srcId:   コピー元のタイルセットID

(例) タイルセットID14のBをID16のDにコピーする場合、ID16のメモ欄に次のように記載してください。
<copy: "dstType": "D", "srcId": 14, "srcType": "B">

また、A1～A5をまとめてコピーする場合、次のように記載することもできます。
<copy: "dstType": "A", "srcId": 14, "srcType": "A">

複数のコピーを行いたい場合は、下記のようにコピーしたい数だけcopyを記述してください。
<copy: "dstType": "C", "srcId": 1, "srcType": "B">
<copy: "dstType": "D", "srcId": 2, "srcType": "C">

A1～A5は同じタイプにしかコピーできないので注意してください。
要するに、A1をBにコピーする、またはその逆はできません。

【Tilesets.jsonの上書き】
スクリプトで
TilesetCopyManager.copyOverWrite(dstId, dstType, srcId, srcType)
を実行することで、タイルセットの設定をコピーしたものをTilesets.jsonに上書きすることができます。

(例) タイルセットID14のBをID16のDにコピーする場合、次のようにスクリプトを記述してください。
TilesetCopyManager.copyOverWrite(16, "D", 14, "B");

なお、Tilesets.jsonを上書きしますので、必ずバックアップを取ったうえで実行してください。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

(() => {
"use strict";

class TilesetCopyManager {
    static copyOverWrite(dstId, dstType, srcId, srcType) {
        const fs = require("fs");
        const copyManager = new this();
        copyManager.copy(dstId, dstType, srcId, srcType)
        const json = JSON.stringify($dataTilesets);
        fs.writeFileSync("data/Tilesets.json", json);
    }

    copy(dstId, dstType, srcId, srcType) {
        const allAType = ["A5", "A1", "A2", "A3", "A4"];
        if (dstType === "A" && srcType === "A") {
            for (const aType of allAType) {
                this._doCopy(dstId, aType, srcId, aType);
            }
        } else if (dstType === "A" || srcType === "A") {
            throw new Error(`dstTypeまたはsrcTypeのどちらかだけがAであってはなりません。`);
        } else {
            if (allAType.includes(dstType) || allAType.includes(srcType)) {
                if (dstType !== srcType) {
                    throw new Error(`A1～A5のコピーの場合、dstTypeとsrcTypeは同じものを指定する必要があります。`)
                }
            }
            this._doCopy(dstId, dstType, srcId, srcType);
        }
    }

    _doCopy(dstId, dstType, srcId, srcType) {
        let dst = null, src = null;
        for (const tileset of $dataTilesets) {
            if (!tileset) continue;
            if (tileset.id === dstId) dst = tileset;
            if (tileset.id === srcId) src = tileset;
        }
        if (!dst) throw new Error(`dst: ${dstId} is not found`);
        if (!src) throw new Error(`src: ${srcId} is not found`);

        let [dstIdxBegin, dstIdxEnd] = this._typeIdxRange(dstType);
        let [srcIdxBegin, srcIdxEnd] = this._typeIdxRange(srcType);
        this._copyFlags(dst, dstIdxBegin, src, srcIdxBegin, srcIdxEnd);
    }

    _copyFlags(dst, dstIdxBegin, src, srcIdxBegin, srcIdxEnd) {
        for (let srcIdx = srcIdxBegin, dstIdx = dstIdxBegin; srcIdx <= srcIdxEnd; srcIdx++, dstIdx++) {
            dst.flags[dstIdx] = src.flags[srcIdx];
        }
    }

    _typeIdxRange(type) {
        switch (type) {
        case "B":
            return [0, 255];
        case "C":
            return [256, 511];
        case "D":
            return [512, 767];
        case "E":
            return [768, 1535];
        case "A5":
            return [1536, 2047];
        case "A1":
            return [2048, 2815];
        case "A2":
            return [2816, 4351];
        case "A3":
            return [4352, 5887];
        case "A4":
            return [5888, 8192];
        }
        throw new Error(`type: ${type} is not found.`);
    }
}


const _DataManager_onLoad = DataManager.onLoad;
DataManager.onLoad = function(object) {
    _DataManager_onLoad.call(this, object);
    if (object === $dataTilesets) {
        this.copyTilesets();
    }
};

DataManager.copyTilesets = function() {
    const tilesetCopyManager = new TilesetCopyManager();
    for (const tileset of $dataTilesets) {
        if (!tileset) continue;
        for (const matchData of tileset.note.matchAll( /\<copy\s*\:(.+)\>/g)) {
            if (matchData) {
                const metaCopy = matchData[1];
                let copyInfo;
                try {
                    copyInfo = JSON.parse(`{${metaCopy}}`);
                } catch(e) {
                    throw new Error(`メモ欄のフォーマット<copy: ${metaCopy}>の形式は不正です。`);
                }
                tilesetCopyManager.copy(tileset.id, copyInfo.dstType, copyInfo.srcId, copyInfo.srcType);
            }
        }
    }
};

window.TilesetCopyManager = TilesetCopyManager;

})();
