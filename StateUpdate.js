/*:
@target MZ
@plugindesc 更新可能ステート v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/StateUpdate.js

@help
更新可能なステートが作成可能になるプラグインです。
例えば、毒状態のときに毒攻撃を受けると猛毒状態になるといったことが作成可能になります。
また、能力強化/弱体に段階をつけるといった用途でも使用できます。

[使用方法]
ステートのメモ欄に
<StateUpdate: [[受けたステートID, 更新先ステートID], [受けたステートID, 更新先ステートID], ...]>
という形式で記載します。
受けたステートID...ステート更新を行うきっかけとなる受けたステートID
更新先ステートID...受けたステートIDで設定したステートを受けた時に更新するステートID
                  なお、ステートIDに0を設定した場合は、ステートにかかっていない状態に更新します。

例えば、攻撃2段階上昇(ステートID: 2)のときに攻撃1段階上昇(ステートID: 1)を受けると
攻撃3段階上昇(ステートID: 3)にしたい場合、攻撃2段階上昇ステートのメモ欄で次のように設定します。
<StateUpdate: [[1, 3]]>

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。
*/
(() => {
"use strict";

const getStateUpdateInfo = (stateId) => {
    const result = [];
    const state = $dataStates[stateId];
    if (!state.meta.StateUpdate) return result;
    const stateUpdateInfoArray = JSON.parse(state.meta.StateUpdate);
    for (const info of stateUpdateInfoArray) {
        result.push({ receiveStateId: info[0], targetStateId: info[1] });
    }
    return result;
}

const getNotCoexistanceStateId = (stateId) => {
    const state = $dataStates[stateId];
    if (!state.meta.NotCoexistanceState) return null;
    const notCoexistanceStateId = JSON.parse(state.meta.NotCoexistanceState);
    return notCoexistanceStateId;
}

Game_Battler.prototype.addState = function(stateId) {
    let addedStateId = stateId;
    if (this.isStateAddable(stateId)) {
        const notCoexistanceStateId = this.isNotCoexistanceStateAdded(stateId);
        if (notCoexistanceStateId) {
            const updatedStateId = this.updateCurrentState(stateId);
            if (updatedStateId) {
                addedStateId = updatedStateId;
            } else {
                addedStateId = notCoexistanceStateId;
            }
        } else {
            if (!this.isStateAffected(stateId)) {
                this.addNewState(stateId);
                this.refresh();
            } else {
                const updatedStateId = this.updateCurrentState(stateId);
                if (updatedStateId) addedStateId = updatedStateId;
            }
        }
        this.resetStateCounts(addedStateId);
        this._result.pushAddedState(addedStateId);
    }
};

Game_Battler.prototype.isNotCoexistanceStateAdded = function(receiveStateId) {
    const notCoexistanceStateId = getNotCoexistanceStateId(receiveStateId);
    for (const stateId of notCoexistanceStateId) {
        if (this.isStateAffected(stateId)) return stateId;
    }
    return null;
};

Game_Battler.prototype.updateCurrentState = function(receiveStateId) {
    for (const stateId of this._states) {
        const stateInfos = getStateUpdateInfo(stateId);
        for (const stateInfo of stateInfos) {
            if (stateInfo.receiveStateId !== receiveStateId) continue;
            this.eraseState(stateId);
            if (stateInfo.targetStateId === 0) return null;
            this.addNewState(stateInfo.targetStateId);
            return stateInfo.targetStateId
        }
    }
    return null;
};

})();
