/*:
@plugindesc コモンライブラリ v1.0.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/CommonLibrary.js

@help
プラグイン作成用に作った汎用的なクラスなどをまとめたライブラリです。
このライブラリのクラスなどは必要な分だけ私のプラグインにコピペして使用しているので、
私のプラグインを使用する際にこのプラグインを導入する必要はありません。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

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

class TextDrawer {
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

    isTextTurn(array, begin, end, width) {
        const text = array.slice(begin, end).join("");
        if (this._window.textWidth(text) >= width) return true;
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
