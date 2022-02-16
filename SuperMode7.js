(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __require = x => THREE;
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // src/Game_Temp.ts
  Game_Temp.prototype.setLastMapId = function(lastMapId) {
    this._lastMapId = lastMapId;
  };
  Game_Temp.prototype.lastMapId = function() {
    return this._lastMapId;
  };

  // src/PluginParamsParser.ts
  var PluginParamsParser = class {
    static parse(params, typeData2, predictEnable = true) {
      return new PluginParamsParser(predictEnable).parse(params, typeData2);
    }
    constructor(predictEnable = true) {
      this._predictEnable = predictEnable;
    }
    parse(params, typeData2, loopCount = 0) {
      if (++loopCount > 255)
        throw new Error("endless loop error");
      const result = {};
      for (const name in typeData2) {
        if (params[name] === "" || params[name] === void 0) {
          result[name] = null;
        } else {
          result[name] = this.convertParam(params[name], typeData2[name], loopCount);
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
      } else if (typeof type === "object" && type instanceof Array) {
        const aryParam = JSON.parse(param);
        if (type[0] === "string") {
          return aryParam.map((strParam) => this.cast(strParam, type[0]));
        } else {
          return aryParam.map((strParam) => this.parse(JSON.parse(strParam), type[0]), loopCount);
        }
      } else if (typeof type === "object") {
        return this.parse(JSON.parse(param), type, loopCount);
      } else {
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
      } else if (param === "true" || param === "false") {
        return "boolean";
      } else {
        return "string";
      }
    }
  };

  // src/Globals.ts
  var $scene3d = null;
  function setScene3d(scene3d) {
    $scene3d = scene3d;
    window.$scene3d = scene3d;
  }
  var pluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];
  var typeData = {
    DefaultParameter: {}
  };
  var PP = PluginParamsParser.parse(PluginManager.parameters(pluginName), typeData);
  console.log(PP);

  // src/SuperMode7Utils.ts
  var NoteParseErrorMessage = "\u30E1\u30E2\u6B04\u306E\u89E3\u6790\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u8A72\u5F53\u7B87\u6240\u306E\u5185\u5BB9:(%1)";
  var SuperMode7Utils = class {
    static isEnabledSuperMode7() {
      return !!$dataMap.meta.SuperMode7;
    }
    static superMode7MapParams() {
      const reg = /<SuperMode7>(.+?)<\/SuperMode7>/sg;
      const matchData = reg.exec($dataMap.note);
      if (!matchData)
        return {};
      const strNote = matchData[1];
      try {
        const result = this.parseNote(strNote);
        if (PP.DefaultParameter) {
          if (result.CameraHeight == null)
            result.CameraHeight = PP.DefaultParameter.CameraHeight;
          if (result.FarFromCenter == null)
            result.FarFromCenter = PP.DefaultParameter.FarFromCenter;
          if (result.FadeEffectRate == null)
            result.FadeEffectRate = PP.DefaultParameter.FadeEffectRate;
        }
        return result;
      } catch (e) {
        console.error(e);
        throw NoteParseErrorMessage.format(strNote);
      }
    }
    static parseNote(note) {
      const results = {};
      for (const pare of note.split("\n")) {
        const matchData = pare.match(/\s*([_-\w\d]+)\s*:\s*([_-\w\d\.]+)\s*/);
        if (matchData && matchData.length >= 3) {
          const name = matchData[1];
          const value = JSON.parse(matchData[2]);
          results[name] = value;
        }
      }
      return results;
    }
    static calcDeg(fromPoint, targetPoint) {
      const ox = $gameMap.deltaX(targetPoint.x, fromPoint.x);
      const oy = $gameMap.deltaY(targetPoint.y, fromPoint.y);
      const rad = Math.atan2(oy, ox);
      return this.rad2deg(rad);
    }
    static calcDistance(deg, dpf) {
      const rad = this.deg2rad(deg);
      const disX = dpf * Math.cos(rad);
      const disY = dpf * Math.sin(rad);
      return new Point(disX, disY);
    }
    static rad2deg(rad) {
      return rad * 180 / Math.PI + 90;
    }
    static deg2rad(deg) {
      return (deg - 90) * Math.PI / 180;
    }
    static isEnableMove360() {
      return false;
    }
    static deg2direction4_2(deg) {
      if (typeof DotMoveSystemClassAlias !== "undefined") {
        deg = DotMoveSystemClassAlias.DotMoveUtils.degNormalization(deg);
        const t = Math.round(deg / 45);
        if (t === 7 || t === 0 || t === 8) {
          return 8;
        } else if (t === 1 || t === 2) {
          return 6;
        } else if (t === 3 || t === 4) {
          return 2;
        } else if (t === 5 || t === 6) {
          return 4;
        } else {
          throw new Error(`${deg} is not found`);
        }
      }
    }
  };

  // src/MapScene3D.ts
  var import_three14 = __toModule(__require("three"));

  // src/Scene3D.ts
  var import_three = __toModule(__require("three"));
  var Scene3D = class {
    get sprite() {
      return this._sprite;
    }
    constructor(width = Graphics.width, height = Graphics.height) {
      this._width = width;
      this._height = height;
      this._sceneStarted = false;
      this._renderer = this.createRenderer();
      this._scene = this.createScene();
      this._camera = this.createCamera();
      this._scene.add(this._camera);
    }
    update() {
      if (!this._sceneStarted) {
        this._sceneStarted = true;
        this.startScene();
        return;
      }
      this.updateScene();
      this._textture.update();
    }
    createRenderer() {
      const renderer = new import_three.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setSize(this._width, this._height);
      renderer.setClearColor(0, 0);
      renderer.shadowMapEnabled = true;
      return renderer;
    }
    initPIXITextture() {
      this._textture = PIXI.BaseTexture.fromCanvas(this._renderer.domElement, PIXI.SCALE_MODES.LINEAR);
      this._sprite = new PIXI.Sprite.from(new PIXI.Texture(this._textture));
    }
  };

  // src/Mode7Camera.ts
  var import_three2 = __toModule(__require("three"));

  // src/Timer.ts
  var Timer = class {
    constructor() {
      this._time = 0;
      this._stop = true;
    }
    static start(time) {
      const timer = new this();
      timer.start(time);
      return timer;
    }
    update() {
      if (!this._stop && this._time > 0)
        this._time--;
    }
    start(time) {
      this._time = time;
      this._stop = false;
    }
    resume() {
      this._stop = false;
    }
    stop() {
      this._stop = true;
    }
    isStopping() {
      return this._stop;
    }
    isTimeout() {
      return !this._stop && this._time === 0;
    }
    isBusy() {
      return !this._stop && this._time > 0;
    }
  };

  // src/Mode7Camera.ts
  var Mode7Camera = class extends import_three2.PerspectiveCamera {
    constructor() {
      super(45, Graphics.width / Graphics.height, 1, 1500);
      this._cameraHeight = 48 * 15.5;
      this._farFromCenter = 0;
      this._angle = 0;
      this._cameraController = new CameraController(this);
    }
    get cameraHeight() {
      return this._cameraHeight;
    }
    set cameraHeight(_cameraHeight) {
      this._cameraHeight = _cameraHeight;
    }
    get farFromCenter() {
      return this._farFromCenter;
    }
    set farFromCenter(_farFromCenter) {
      this._farFromCenter = _farFromCenter;
    }
    get angle() {
      return this._angle;
    }
    set angle(_angle) {
      this._angle = _angle;
    }
    update() {
      this._cameraController.update();
      this.updateCameraPosition();
    }
    changeCameraHeight(cameraHeight, duration) {
      this._cameraController.changeCameraHeight(cameraHeight, duration);
    }
    changeFarFromCenter(farFromCenter, duration) {
      this._cameraController.changeFarFromCenter(farFromCenter, duration);
    }
    changeAngle(angle, direction, duration) {
      this._cameraController.changeAngle(angle, direction, duration);
    }
    cameraFocusPoint() {
      return new import_three2.Vector2($gameMap.displayX() + 8, $gameMap.displayY() + 6);
    }
    getProjection(object3d) {
      const worldPosition = object3d.getWorldPosition(object3d.position.clone());
      return worldPosition.project(this);
    }
    updateCameraPosition() {
      this.position.y = this._cameraHeight;
      const focus = this.cameraFocusPoint();
      const cameraBaseX = focus.x * 48 + 24;
      const cameraBaseZ = focus.y * 48 + 24;
      const dis = SuperMode7Utils.calcDistance(this._angle, this._farFromCenter);
      this.position.x = cameraBaseX - dis.x * 48;
      this.position.z = cameraBaseZ - dis.y * 48;
      const vec3 = new import_three2.Vector3(cameraBaseX, 0, cameraBaseZ);
      this.lookAt(vec3);
    }
  };
  var CameraController = class {
    constructor(camera) {
      this._targetCameraHeight = 0;
      this._targetFarFromCenter = 0;
      this._targetAngle = 0;
      this._cameraHeightUnit = 0;
      this._farFromCenterUnit = 0;
      this._angleUnit = 0;
      this._changeCameraHeightTimer = new Timer();
      this._changeFarFromCenterTimer = new Timer();
      this._changeAngleTimer = new Timer();
      this._camera = camera;
    }
    changeCameraHeight(cameraHeight, duration) {
      if (duration <= 0) {
        this._camera.cameraHeight = cameraHeight;
      } else {
        this._targetCameraHeight = cameraHeight;
        this._cameraHeightUnit = (this._camera.cameraHeight - cameraHeight) / duration;
        this._changeCameraHeightTimer.start(duration);
      }
    }
    changeFarFromCenter(farFromCenter, duration) {
      if (duration <= 0) {
        this._camera.farFromCenter = farFromCenter;
      } else {
        this._targetFarFromCenter = farFromCenter;
        this._farFromCenterUnit = (this._camera.farFromCenter - farFromCenter) / duration;
        this._changeFarFromCenterTimer.start(duration);
      }
    }
    changeAngle(angle, direction, duration) {
      if (duration <= 0) {
        this._camera.angle = angle;
      } else {
        if (direction === "left") {
          this._targetAngle = this._camera.angle + angle;
        } else if (direction === "right") {
          this._targetAngle = this._camera.angle - angle;
        } else {
          throw new Error(`direction: ${direction} is not found.`);
        }
        this._angleUnit = (this._camera.angle - this._targetAngle) / duration;
        this._changeAngleTimer.start(duration);
      }
    }
    isBusy() {
      return this._changeCameraHeightTimer.isBusy() || this._changeFarFromCenterTimer.isBusy() || this._changeAngleTimer.isBusy();
    }
    update() {
      this._changeCameraHeightTimer.update();
      this._changeFarFromCenterTimer.update();
      this._changeAngleTimer.update();
      if (this._changeCameraHeightTimer.isTimeout()) {
        this._camera.cameraHeight = this._targetCameraHeight;
      } else {
        this._camera.cameraHeight -= this._cameraHeightUnit;
      }
      if (this._changeFarFromCenterTimer.isTimeout()) {
        this._camera.farFromCenter = this._targetFarFromCenter;
      } else {
        this._camera.farFromCenter -= this._farFromCenterUnit;
      }
      if (this._changeAngleTimer.isTimeout()) {
        this._camera.angle = this._targetAngle;
      } else {
        this._camera.angle -= this._angleUnit;
      }
    }
  };

  // src/EffekseerController.ts
  var import_three3 = __toModule(__require("three"));
  var EffekseerController = class {
    constructor(renderer, camera) {
      this._isPlaying = false;
      this._isLoading = false;
      this._renderer = renderer;
      this._camera = camera;
      this._animationQueue = [];
      this._context = effekseer.createContext();
      this._context.init(renderer.getContext());
      this._fastRenderMode = false;
      if (this._fastRenderMode) {
        this._context.setRestorationOfStatesFlag(false);
      }
    }
    prepareRenderUpdate() {
      if (this._isLoading) {
        const animationInfo = this._animationQueue[0];
        if (animationInfo.effect.isLoaded) {
          this._animationQueue.shift();
          this._isLoading = false;
          this.playAnimation(animationInfo);
        }
      }
      if (this._isPlaying) {
        this._context.update();
      }
    }
    postRenderUpdate() {
      if (!this._isPlaying)
        return;
      this._context.setProjectionMatrix(this._camera.projectionMatrix.elements);
      this._context.setCameraMatrix(this._camera.matrixWorldInverse.elements);
      this._context.draw();
      if (this._fastRenderMode) {
        this._renderer.resetState();
      }
      if (!this._handle.exists) {
        this._isPlaying = false;
      }
    }
    play(effect, location, opt = { scale: null, speed: 1 }) {
      const scale = opt.scale == null ? new import_three3.Vector3(20, 20, 20) : opt.scale;
      const animationInfo = new AnimationInfo(effect, location, scale, opt.speed);
      if (effect.isLoaded) {
        this.playAnimation(animationInfo);
      } else {
        this._isLoading = true;
        this._animationQueue.push(animationInfo);
      }
    }
    isPlaying() {
      return this._isPlaying;
    }
    playAnimation(animationInfo) {
      this._isPlaying = true;
      this._handle = this._context.play(animationInfo.effect);
      const location = animationInfo.location;
      this._handle.setLocation(location.x, location.y, location.z);
      const scale = animationInfo.scale;
      this._handle.setScale(scale.x, scale.y, scale.z);
      this._handle.setSpeed(animationInfo.speed);
    }
  };
  var AnimationInfo = class {
    constructor(effect, location, scale, speed) {
      this.effect = effect;
      this.location = location;
      this.scale = scale;
      this.speed = speed;
    }
  };

  // src/TilemapContainer.ts
  var import_three11 = __toModule(__require("three"));
  var import_three12 = __toModule(__require("three"));

  // src/TilemapElement.ts
  var TilemapElement = class {
    get setNumber() {
      return this._setNumber;
    }
    get sx() {
      return this._sx;
    }
    get sy() {
      return this._sy;
    }
    get dx() {
      return this._dx;
    }
    get dy() {
      return this._dy;
    }
    get w() {
      return this._w;
    }
    get h() {
      return this._h;
    }
    constructor(setNumber, sx, sy, dx, dy, w, h) {
      this._setNumber = setNumber;
      this._sx = sx;
      this._sy = sy;
      this._dx = dx;
      this._dy = dy;
      this._w = w;
      this._h = h;
    }
  };

  // src/TilemapElementsGenerator.ts
  var _TilemapElementsGenerator = class {
    constructor() {
      this.animationFrame = 0;
      this._startX = 0;
      this._startY = 0;
      this._needsRepaint = false;
      this._lastAnimationFrame = 0;
      this._lastStartX = 0;
      this._lastStartY = 0;
      this._lowerLayerElementsCache = null;
      this._upperLayerElementsCache = null;
      this._updated = false;
      this._width = Graphics.width;
      this._height = Graphics.height;
      this._margin = 0;
      this._tileWidth = 48;
      this._tileHeight = 48;
      this._mapWidth = 0;
      this._mapHeight = 0;
      this._mapData = null;
      this.origin = new Point();
      this.flags = [];
      this.animationCount = 0;
      this.horizontalWrap = $gameMap.isLoopHorizontal();
      this.verticalWrap = $gameMap.isLoopVertical();
      this._createLayers();
      this.refresh();
    }
    static isVisibleTile(tileId) {
      return tileId > 0 && tileId < this.TILE_ID_MAX;
    }
    static isAutotile(tileId) {
      return tileId >= this.TILE_ID_A1;
    }
    static getAutotileKind(tileId) {
      return Math.floor((tileId - this.TILE_ID_A1) / 48);
    }
    static getAutotileShape(tileId) {
      return (tileId - this.TILE_ID_A1) % 48;
    }
    static makeAutotileId(kind, shape) {
      return this.TILE_ID_A1 + kind * 48 + shape;
    }
    static isSameKindTile(tileID1, tileID2) {
      if (this.isAutotile(tileID1) && this.isAutotile(tileID2)) {
        return this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2);
      } else {
        return tileID1 === tileID2;
      }
    }
    static isTileA1(tileId) {
      return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;
    }
    static isTileA2(tileId) {
      return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;
    }
    static isTileA3(tileId) {
      return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;
    }
    static isTileA4(tileId) {
      return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;
    }
    static isTileA5(tileId) {
      return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;
    }
    static isWaterTile(tileId) {
      if (this.isTileA1(tileId)) {
        return !(tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192);
      } else {
        return false;
      }
    }
    static isWaterfallTile(tileId) {
      if (tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2) {
        return this.getAutotileKind(tileId) % 2 === 1;
      } else {
        return false;
      }
    }
    static isGroundTile(tileId) {
      return this.isTileA1(tileId) || this.isTileA2(tileId) || this.isTileA5(tileId);
    }
    static isShadowingTile(tileId) {
      return this.isTileA3(tileId) || this.isTileA4(tileId);
    }
    static isRoofTile(tileId) {
      return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    }
    static isWallTopTile(tileId) {
      return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    }
    static isWallSideTile(tileId) {
      return (this.isTileA3(tileId) || this.isTileA4(tileId)) && this.getAutotileKind(tileId) % 16 >= 8;
    }
    static isWallTile(tileId) {
      return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);
    }
    static isFloorTypeAutotile(tileId) {
      return this.isTileA1(tileId) && !this.isWaterfallTile(tileId) || this.isTileA2(tileId) || this.isWallTopTile(tileId);
    }
    static isWallTypeAutotile(tileId) {
      return this.isRoofTile(tileId) || this.isWallSideTile(tileId);
    }
    static isWaterfallTypeAutotile(tileId) {
      return this.isWaterfallTile(tileId);
    }
    get width() {
      return this._width;
    }
    set width(_width) {
      this._width = _width;
    }
    get height() {
      return this._height;
    }
    set height(_height) {
      this._height = _height;
    }
    get startX() {
      return this._startX;
    }
    set startX(_startX) {
      this._startX = _startX;
    }
    get startY() {
      return this._startY;
    }
    set startY(_startY) {
      this._startY = _startY;
    }
    lowerLayerElements() {
      return this._lowerLayerElementsCache;
    }
    upperLayerElements() {
      return this._upperLayerElementsCache;
    }
    checkUpdated() {
      if (this._updated) {
        this._updated = false;
        return true;
      }
      return false;
    }
    setData(width, height, data) {
      this._mapWidth = width;
      this._mapHeight = height;
      this._mapData = data;
    }
    update() {
      this.animationCount++;
      this.animationFrame = Math.floor(this.animationCount / 30);
      this.updateTransform();
      this._lowerLayerElementsCache = this._lowerLayer.elements().concat();
      this._upperLayerElementsCache = this._upperLayer.elements().concat();
    }
    refresh() {
      this._needsRepaint = true;
    }
    updateTransform() {
      const ox = Math.ceil(this.origin.x);
      const oy = Math.ceil(this.origin.y);
      const startX = this._startX;
      const startY = this._startY;
      if (this._needsRepaint || this._lastAnimationFrame !== this.animationFrame || this._lastStartX !== startX || this._lastStartY !== startY) {
        this._lastAnimationFrame = this.animationFrame;
        this._lastStartX = startX;
        this._lastStartY = startY;
        this._addAllSpots(startX, startY);
        this._needsRepaint = false;
        this._updated = true;
      }
    }
    _createLayers() {
      this._lowerLayer = new TilemapElementsLayer();
      this._upperLayer = new TilemapElementsLayer();
      this._needsRepaint = true;
    }
    _addAllSpots(startX, startY) {
      this._lowerLayer.clear();
      this._upperLayer.clear();
      const widthWithMatgin = this.width + this._margin * 2;
      const heightWithMatgin = this.height + this._margin * 2;
      const tileCols = Math.ceil(widthWithMatgin / this._tileWidth);
      const tileRows = Math.ceil(heightWithMatgin / this._tileHeight);
      for (let y = 0; y < tileRows; y++) {
        for (let x = 0; x < tileCols; x++) {
          this._addSpot(startX, startY, x, y);
        }
      }
    }
    _addSpot(startX, startY, x, y) {
      const mx = startX + x;
      const my = startY + y;
      const dx = x * this._tileWidth;
      const dy = y * this._tileHeight;
      const tileId0 = this._readMapData(mx, my, 0);
      const tileId1 = this._readMapData(mx, my, 1);
      const tileId2 = this._readMapData(mx, my, 2);
      const tileId3 = this._readMapData(mx, my, 3);
      const shadowBits = this._readMapData(mx, my, 4);
      const upperTileId1 = this._readMapData(mx, my - 1, 1);
      this._addSpotTile(tileId0, dx, dy);
      this._addSpotTile(tileId1, dx, dy);
      this._addShadow(this._lowerLayer, shadowBits, dx, dy);
      if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
        if (!_TilemapElementsGenerator.isShadowingTile(tileId0)) {
          this._addTableEdge(this._lowerLayer, upperTileId1, dx, dy);
        }
      }
      if (this._isOverpassPosition(mx, my)) {
        this._addTile(this._upperLayer, tileId2, dx, dy);
        this._addTile(this._upperLayer, tileId3, dx, dy);
      } else {
        this._addSpotTile(tileId2, dx, dy);
        this._addSpotTile(tileId3, dx, dy);
      }
    }
    _addSpotTile(tileId, dx, dy) {
      if (this._isHigherTile(tileId)) {
        this._addTile(this._upperLayer, tileId, dx, dy);
      } else {
        this._addTile(this._lowerLayer, tileId, dx, dy);
      }
    }
    _addTile(layer, tileId, dx, dy) {
      if (_TilemapElementsGenerator.isVisibleTile(tileId)) {
        if (_TilemapElementsGenerator.isAutotile(tileId)) {
          this._addAutotile(layer, tileId, dx, dy);
        } else {
          this._addNormalTile(layer, tileId, dx, dy);
        }
      }
    }
    _addNormalTile(layer, tileId, dx, dy) {
      let setNumber = 0;
      if (_TilemapElementsGenerator.isTileA5(tileId)) {
        setNumber = 4;
      } else {
        setNumber = 5 + Math.floor(tileId / 256);
      }
      const w = this._tileWidth;
      const h = this._tileHeight;
      const sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
      const sy = Math.floor(tileId % 256 / 8) % 16 * h;
      layer.addRect(setNumber, sx, sy, dx, dy, w, h);
    }
    _addAutotile(layer, tileId, dx, dy) {
      const kind = _TilemapElementsGenerator.getAutotileKind(tileId);
      const shape = _TilemapElementsGenerator.getAutotileShape(tileId);
      const tx = kind % 8;
      const ty = Math.floor(kind / 8);
      let setNumber = 0;
      let bx = 0;
      let by = 0;
      let autotileTable = _TilemapElementsGenerator.FLOOR_AUTOTILE_TABLE;
      let isTable = false;
      if (_TilemapElementsGenerator.isTileA1(tileId)) {
        const waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
        setNumber = 0;
        if (kind === 0) {
          bx = waterSurfaceIndex * 2;
          by = 0;
        } else if (kind === 1) {
          bx = waterSurfaceIndex * 2;
          by = 3;
        } else if (kind === 2) {
          bx = 6;
          by = 0;
        } else if (kind === 3) {
          bx = 6;
          by = 3;
        } else {
          bx = Math.floor(tx / 4) * 8;
          by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
          if (kind % 2 === 0) {
            bx += waterSurfaceIndex * 2;
          } else {
            bx += 6;
            autotileTable = _TilemapElementsGenerator.WATERFALL_AUTOTILE_TABLE;
            by += this.animationFrame % 3;
          }
        }
      } else if (_TilemapElementsGenerator.isTileA2(tileId)) {
        setNumber = 1;
        bx = tx * 2;
        by = (ty - 2) * 3;
        isTable = this._isTableTile(tileId);
      } else if (_TilemapElementsGenerator.isTileA3(tileId)) {
        setNumber = 2;
        bx = tx * 2;
        by = (ty - 6) * 2;
        autotileTable = _TilemapElementsGenerator.WALL_AUTOTILE_TABLE;
      } else if (_TilemapElementsGenerator.isTileA4(tileId)) {
        setNumber = 3;
        bx = tx * 2;
        by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
        if (ty % 2 === 1) {
          autotileTable = _TilemapElementsGenerator.WALL_AUTOTILE_TABLE;
        }
      }
      const table = autotileTable[shape];
      const w1 = this._tileWidth / 2;
      const h1 = this._tileHeight / 2;
      for (let i = 0; i < 4; i++) {
        const qsx = table[i][0];
        const qsy = table[i][1];
        const sx1 = (bx * 2 + qsx) * w1;
        const sy1 = (by * 2 + qsy) * h1;
        const dx1 = dx + i % 2 * w1;
        const dy1 = dy + Math.floor(i / 2) * h1;
        if (isTable && (qsy === 1 || qsy === 5)) {
          const qsx2 = qsy === 1 ? (4 - qsx) % 4 : qsx;
          const qsy2 = 3;
          const sx2 = (bx * 2 + qsx2) * w1;
          const sy2 = (by * 2 + qsy2) * h1;
          layer.addRect(setNumber, sx2, sy2, dx1, dy1, w1, h1);
          layer.addRect(setNumber, sx1, sy1, dx1, dy1 + h1 / 2, w1, h1 / 2);
        } else {
          layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1);
        }
      }
    }
    _addTableEdge(layer, tileId, dx, dy) {
      if (_TilemapElementsGenerator.isTileA2(tileId)) {
        const autotileTable = _TilemapElementsGenerator.FLOOR_AUTOTILE_TABLE;
        const kind = _TilemapElementsGenerator.getAutotileKind(tileId);
        const shape = _TilemapElementsGenerator.getAutotileShape(tileId);
        const tx = kind % 8;
        const ty = Math.floor(kind / 8);
        const setNumber = 1;
        const bx = tx * 2;
        const by = (ty - 2) * 3;
        const table = autotileTable[shape];
        const w1 = this._tileWidth / 2;
        const h1 = this._tileHeight / 2;
        for (let i = 0; i < 2; i++) {
          const qsx = table[2 + i][0];
          const qsy = table[2 + i][1];
          const sx1 = (bx * 2 + qsx) * w1;
          const sy1 = (by * 2 + qsy) * h1 + h1 / 2;
          const dx1 = dx + i % 2 * w1;
          const dy1 = dy + Math.floor(i / 2) * h1;
          layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1 / 2);
        }
      }
    }
    _addShadow(layer, shadowBits, dx, dy) {
      if (shadowBits & 15) {
        const w1 = this._tileWidth / 2;
        const h1 = this._tileHeight / 2;
        for (let i = 0; i < 4; i++) {
          if (shadowBits & 1 << i) {
            const dx1 = dx + i % 2 * w1;
            const dy1 = dy + Math.floor(i / 2) * h1;
            layer.addRect(-1, 0, 0, dx1, dy1, w1, h1);
          }
        }
      }
    }
    _readMapData(x, y, z) {
      if (this._mapData) {
        const width = this._mapWidth;
        const height = this._mapHeight;
        if (this.horizontalWrap) {
          x = x.mod(width);
        }
        if (this.verticalWrap) {
          y = y.mod(height);
        }
        if (x >= 0 && x < width && y >= 0 && y < height) {
          return this._mapData[(z * height + y) * width + x] || 0;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }
    _isHigherTile(tileId) {
      return this.flags[tileId] & 16;
    }
    _isTableTile(tileId) {
      return _TilemapElementsGenerator.isTileA2(tileId) && this.flags[tileId] & 128;
    }
    _isOverpassPosition(mx, my) {
      return false;
    }
  };
  var TilemapElementsGenerator = _TilemapElementsGenerator;
  TilemapElementsGenerator.FLOOR_AUTOTILE_TABLE = [
    [[2, 4], [1, 4], [2, 3], [1, 3]],
    [[2, 0], [1, 4], [2, 3], [1, 3]],
    [[2, 4], [3, 0], [2, 3], [1, 3]],
    [[2, 0], [3, 0], [2, 3], [1, 3]],
    [[2, 4], [1, 4], [2, 3], [3, 1]],
    [[2, 0], [1, 4], [2, 3], [3, 1]],
    [[2, 4], [3, 0], [2, 3], [3, 1]],
    [[2, 0], [3, 0], [2, 3], [3, 1]],
    [[2, 4], [1, 4], [2, 1], [1, 3]],
    [[2, 0], [1, 4], [2, 1], [1, 3]],
    [[2, 4], [3, 0], [2, 1], [1, 3]],
    [[2, 0], [3, 0], [2, 1], [1, 3]],
    [[2, 4], [1, 4], [2, 1], [3, 1]],
    [[2, 0], [1, 4], [2, 1], [3, 1]],
    [[2, 4], [3, 0], [2, 1], [3, 1]],
    [[2, 0], [3, 0], [2, 1], [3, 1]],
    [[0, 4], [1, 4], [0, 3], [1, 3]],
    [[0, 4], [3, 0], [0, 3], [1, 3]],
    [[0, 4], [1, 4], [0, 3], [3, 1]],
    [[0, 4], [3, 0], [0, 3], [3, 1]],
    [[2, 2], [1, 2], [2, 3], [1, 3]],
    [[2, 2], [1, 2], [2, 3], [3, 1]],
    [[2, 2], [1, 2], [2, 1], [1, 3]],
    [[2, 2], [1, 2], [2, 1], [3, 1]],
    [[2, 4], [3, 4], [2, 3], [3, 3]],
    [[2, 4], [3, 4], [2, 1], [3, 3]],
    [[2, 0], [3, 4], [2, 3], [3, 3]],
    [[2, 0], [3, 4], [2, 1], [3, 3]],
    [[2, 4], [1, 4], [2, 5], [1, 5]],
    [[2, 0], [1, 4], [2, 5], [1, 5]],
    [[2, 4], [3, 0], [2, 5], [1, 5]],
    [[2, 0], [3, 0], [2, 5], [1, 5]],
    [[0, 4], [3, 4], [0, 3], [3, 3]],
    [[2, 2], [1, 2], [2, 5], [1, 5]],
    [[0, 2], [1, 2], [0, 3], [1, 3]],
    [[0, 2], [1, 2], [0, 3], [3, 1]],
    [[2, 2], [3, 2], [2, 3], [3, 3]],
    [[2, 2], [3, 2], [2, 1], [3, 3]],
    [[2, 4], [3, 4], [2, 5], [3, 5]],
    [[2, 0], [3, 4], [2, 5], [3, 5]],
    [[0, 4], [1, 4], [0, 5], [1, 5]],
    [[0, 4], [3, 0], [0, 5], [1, 5]],
    [[0, 2], [3, 2], [0, 3], [3, 3]],
    [[0, 2], [1, 2], [0, 5], [1, 5]],
    [[0, 4], [3, 4], [0, 5], [3, 5]],
    [[2, 2], [3, 2], [2, 5], [3, 5]],
    [[0, 2], [3, 2], [0, 5], [3, 5]],
    [[0, 0], [1, 0], [0, 1], [1, 1]]
  ];
  TilemapElementsGenerator.WALL_AUTOTILE_TABLE = [
    [[2, 2], [1, 2], [2, 1], [1, 1]],
    [[0, 2], [1, 2], [0, 1], [1, 1]],
    [[2, 0], [1, 0], [2, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[2, 2], [3, 2], [2, 1], [3, 1]],
    [[0, 2], [3, 2], [0, 1], [3, 1]],
    [[2, 0], [3, 0], [2, 1], [3, 1]],
    [[0, 0], [3, 0], [0, 1], [3, 1]],
    [[2, 2], [1, 2], [2, 3], [1, 3]],
    [[0, 2], [1, 2], [0, 3], [1, 3]],
    [[2, 0], [1, 0], [2, 3], [1, 3]],
    [[0, 0], [1, 0], [0, 3], [1, 3]],
    [[2, 2], [3, 2], [2, 3], [3, 3]],
    [[0, 2], [3, 2], [0, 3], [3, 3]],
    [[2, 0], [3, 0], [2, 3], [3, 3]],
    [[0, 0], [3, 0], [0, 3], [3, 3]]
  ];
  TilemapElementsGenerator.WATERFALL_AUTOTILE_TABLE = [
    [[2, 0], [1, 0], [2, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[2, 0], [3, 0], [2, 1], [3, 1]],
    [[0, 0], [3, 0], [0, 1], [3, 1]]
  ];
  TilemapElementsGenerator.TILE_ID_B = 0;
  TilemapElementsGenerator.TILE_ID_C = 256;
  TilemapElementsGenerator.TILE_ID_D = 512;
  TilemapElementsGenerator.TILE_ID_E = 768;
  TilemapElementsGenerator.TILE_ID_A5 = 1536;
  TilemapElementsGenerator.TILE_ID_A1 = 2048;
  TilemapElementsGenerator.TILE_ID_A2 = 2816;
  TilemapElementsGenerator.TILE_ID_A3 = 4352;
  TilemapElementsGenerator.TILE_ID_A4 = 5888;
  TilemapElementsGenerator.TILE_ID_MAX = 8192;
  var TilemapElementsLayer = class {
    constructor() {
      this._elements = [];
    }
    clear() {
      this._elements.length = 0;
    }
    addRect(setNumber, sx, sy, dx, dy, w, h) {
      this._elements.push(new TilemapElement(setNumber, sx, sy, dx, dy, w, h));
    }
    elements() {
      return this._elements;
    }
  };
  TilemapElementsLayer.MAX_GL_TEXTURES = 3;
  TilemapElementsLayer.VERTEX_STRIDE = 9 * 4;

  // src/TilemapPlaneGeometry.ts
  var import_three5 = __toModule(__require("three"));

  // src/RectsPlaneGeometry.ts
  var import_three4 = __toModule(__require("three"));
  var RectsPlaneGeometry = class extends import_three4.BufferGeometry {
    constructor(width = 1, height = 1, widthSegments = 1, heightSegments = 1, zSegments = 1) {
      super();
      this.parameters = {
        width,
        height,
        widthSegments,
        heightSegments,
        zSegments
      };
      const indices = [];
      const vertices = [];
      const normals = [];
      const uvs = [];
      let beginIndex = 0;
      const segmentWidth = width / widthSegments;
      const segmentHeight = height / heightSegments;
      for (let n = 0; n < zSegments; n++) {
        for (let iy = 0; iy < heightSegments; iy++) {
          for (let ix = 0; ix < widthSegments; ix++) {
            const px1 = ix * segmentWidth - width / 2;
            const py1 = (heightSegments - iy) * segmentHeight - height / 2;
            const px2 = ix * segmentWidth + segmentWidth - width / 2;
            const py2 = (heightSegments - iy) * segmentHeight - segmentHeight - height / 2;
            vertices.push(...this.createRectVertices(px1, py1, px2, py2, n));
            indices.push(...this.createRectIndices(beginIndex));
            normals.push(...this.createRectNormals());
            const uvX1 = ix / widthSegments;
            const uvY1 = (heightSegments - iy) / heightSegments;
            const uvX2 = (ix + 1) / widthSegments;
            const uvY2 = (heightSegments - 1 - iy) / heightSegments;
            uvs.push(...this.createRectUvs(uvX1, uvY1, uvX2, uvY2));
            beginIndex += 4;
          }
        }
      }
      this.setIndex(indices);
      this.setAttribute("position", new import_three4.Float32BufferAttribute(vertices, 3));
      this.setAttribute("normal", new import_three4.Float32BufferAttribute(normals, 3));
      this.setAttribute("uv", new import_three4.Float32BufferAttribute(uvs, 2));
    }
    createRectUvs(x1, y1, x2, y2) {
      const uvs = [];
      uvs.push(x1, y1);
      uvs.push(x2, y1);
      uvs.push(x1, y2);
      uvs.push(x2, y2);
      return uvs;
    }
    createRectVertices(x1, y1, x2, y2, z) {
      const vertices = [];
      z = 0;
      vertices.push(x1, y1, z);
      vertices.push(x2, y1, z);
      vertices.push(x1, y2, z);
      vertices.push(x2, y2, z);
      return vertices;
    }
    createRectIndices(beginIndex) {
      const indices = [];
      const a = beginIndex;
      const b = 2 + beginIndex;
      const c = 3 + beginIndex;
      const d = 1 + beginIndex;
      indices.push(a, b, d);
      indices.push(b, c, d);
      return indices;
    }
    createRectNormals() {
      const normals = [];
      normals.push(0, 0, 1);
      normals.push(0, 0, 1);
      normals.push(0, 0, 1);
      normals.push(0, 0, 1);
      return normals;
    }
  };

  // src/TilemapPlaneGeometry.ts
  var TilemapPlaneGeometry = class extends RectsPlaneGeometry {
    constructor(width = 1, height = 1, widthSegments = 1, heightSegments = 1, zSegments = 1) {
      super(width, height, widthSegments, heightSegments, zSegments);
      this._textureWidth = 0;
      this._textureHeight = 0;
      this._elements = null;
    }
    update() {
      if (this._elements) {
        this.updateUVs();
        this._elements = null;
      }
    }
    setElements(elements) {
      this._elements = elements;
    }
    setTextureSize(textureWidth, textureHeight) {
      this._textureWidth = textureWidth;
      this._textureHeight = textureHeight;
    }
    updateUVs() {
      const attr = this.getAttribute("uv");
      const uvs = new Float32Array(attr.array.length);
      if (!this._elements)
        return;
      for (const element of this._elements) {
        const { setNumber, sx, sy, dx, dy, w, h } = element;
        if (setNumber < 0)
          continue;
        if (setNumber <= 3) {
          this.setUv(uvs, setNumber, sx, sy, dx, dy, 23, 23, 0, 0);
        } else {
          for (let iy = 0; iy < 2; iy++) {
            for (let ix = 0; ix < 2; ix++) {
              this.setUv(uvs, setNumber, sx, sy, dx, dy, 23, 23, ix * 24, iy * 24);
            }
          }
        }
      }
      this.setAttribute("uv", new import_three5.Float32BufferAttribute(uvs, 2));
    }
    setUv(uvs, setNumber, sx, sy, dx, dy, sw, sh, ox, oy) {
      const widthSegments = this.parameters.widthSegments;
      const heightSegments = this.parameters.heightSegments;
      const dmax = widthSegments * heightSegments * 8;
      const uvSxOfs = Math.floor(setNumber / 2) * 768;
      const uvSyOfs = setNumber % 2 * 768;
      const isx = sx / 24;
      const isy = sy / 24;
      const uvSx = (isx * 24 + 0.5 + ox + uvSxOfs) / this._textureWidth;
      const uvSy = 1 - (isy * 24 + 0.5 + oy + uvSyOfs) / this._textureHeight;
      const dix = Math.floor((dx + ox) / 24);
      const diy = Math.floor((dy + oy) / 24);
      const dindex = (diy * widthSegments + dix) * 8;
      const uvSx2 = (isx * 24 + 0.5 + ox + sw + uvSxOfs) / this._textureWidth;
      const uvSy2 = 1 - (isy * 24 + 0.5 + oy + sh + uvSyOfs) / this._textureHeight;
      const rectUvs = this.createRectUvs(uvSx, uvSy, uvSx2, uvSy2);
      for (let i = 0; i < 8; i++) {
        if (uvs[dindex + i] === 0) {
          uvs[dindex + i] = rectUvs[i];
        } else if (uvs[dmax + dindex + i] === 0) {
          uvs[dmax + dindex + i] = rectUvs[i];
        } else if (uvs[dmax * 2 + dindex + i] === 0) {
          uvs[dmax * 2 + dindex + i] = rectUvs[i];
        } else {
          uvs[dmax * 3 + dindex + i] = rectUvs[i];
        }
      }
    }
  };

  // src/Sprite3D_WrapPixi.ts
  var import_three7 = __toModule(__require("three"));

  // src/Sprite3D_Mesh.ts
  var import_three6 = __toModule(__require("three"));
  var Sprite3D_Mesh = class extends import_three6.Mesh {
    constructor(camera, width, height, material) {
      super(new RectsPlaneGeometry(width, height), material);
      this._spriteMode = true;
      this._camera = camera;
      this.width = width;
      this.height = height;
    }
    dispose() {
      this.geometry.dispose();
      if (this.material instanceof import_three6.Material) {
        this.material.dispose();
      } else if (this.material instanceof Array) {
        for (const mat of this.material) {
          mat.dispose();
        }
      }
    }
    update() {
      if (this._spriteMode)
        this.rotation.setFromRotationMatrix(this._camera.matrix);
    }
    setSpriteMode(spriteMode) {
      this._spriteMode = spriteMode;
    }
    isSpriteMode() {
      return this._spriteMode;
    }
    resetUVMs(frame, textureWidth, textureHeight) {
      const attr = this.geometry.getAttribute("uv");
      const uvs = new Float32Array(attr.array.length);
      for (let i = 0; i < uvs.length; i++) {
        uvs[i] = attr.array[i];
      }
      const uBegin = frame.x / textureWidth;
      const vBegin = 1 - (frame.y + frame.height) / textureHeight;
      const width = frame.width / textureWidth;
      const height = frame.height / textureHeight;
      uvs[0] = uBegin;
      uvs[1] = vBegin + height;
      uvs[2] = uBegin + width;
      uvs[3] = vBegin + height;
      uvs[4] = uBegin;
      uvs[5] = vBegin;
      uvs[6] = uBegin + width;
      uvs[7] = vBegin;
      this.geometry.setAttribute("uv", new import_three6.Float32BufferAttribute(uvs, 2));
    }
  };

  // src/CharacterVertShader.ts
  var CharacterVertShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);    
        gl_Position = projectionMatrix * mvPosition;
    }
`;

  // src/CharacterFragShader.ts
  var CharacterFragShader = `
    varying vec2 vUv;
    uniform sampler2D sampler;
    uniform float bushDepth;
    uniform float screenY;
    uniform float graphicsHeight;
    uniform float characterHeight;
    uniform float hue;
    uniform vec4 colorTone;
    uniform vec4 blendColor;
    uniform float brightness;

    vec3 rgbToHsl(vec3 rgb) {
        float r = rgb.r;
        float g = rgb.g;
        float b = rgb.b;
        float cmin = min(r, min(g, b));
        float cmax = max(r, max(g, b));
        float h = 0.0;
        float s = 0.0;
        float l = (cmin + cmax) / 2.0;
        float delta = cmax - cmin;
        if (delta > 0.0) {
            if (r == cmax) {
                h = mod((g - b) / delta + 6.0, 6.0) / 6.0;
            } else if (g == cmax) {
                h = ((b - r) / delta + 2.0) / 6.0;
            } else {
                h = ((r - g) / delta + 4.0) / 6.0;
            }
            if (l < 1.0) {
                s = delta / (1.0 - abs(2.0 * l - 1.0));
            }
        }
        return vec3(h, s, l);
    }

    vec3 hslToRgb(vec3 hsl) {
        float h = hsl.x;
        float s = hsl.y;
        float l = hsl.z;
        float c = (1.0 - abs(2.0 * l - 1.0)) * s;
        float x = c * (1.0 - abs((mod(h * 6.0, 2.0)) - 1.0));
        float m = l - c / 2.0;
        float cm = c + m;
        float xm = x + m;
        if (h < 1.0 / 6.0) {
            return vec3(cm, xm, m);
        } else if (h < 2.0 / 6.0) {
            return vec3(xm, cm, m);
        } else if (h < 3.0 / 6.0) {
            return vec3(m, cm, xm);
        } else if (h < 4.0 / 6.0) {
            return vec3(m, xm, cm);
        } else if (h < 5.0 / 6.0) {
            return vec3(xm, m, cm);
        } else {
            return vec3(cm, m, xm);
        }
    }

    vec4 applyBushDepth(vec4 color) {
        if (bushDepth > 0.0) {
            if ((graphicsHeight - gl_FragCoord.y) - screenY >= characterHeight - bushDepth) {
                color.a *= 0.5;
            }   
        }
        return color;
    }

    void main() {
        vec4 tex = texture2D(sampler, vUv);
        float a = tex.a;
        vec3 hsl = rgbToHsl(tex.rgb);
        hsl.x = mod(hsl.x + hue / 360.0, 1.0);
        hsl.y = hsl.y * (1.0 - colorTone.a / 255.0);
        vec3 rgb = hslToRgb(hsl);

        float r = rgb.r;
        float g = rgb.g;
        float b = rgb.b;

        float r2 = colorTone.r / 255.0;
        float g2 = colorTone.g / 255.0;
        float b2 = colorTone.b / 255.0;
        float r3 = blendColor.r / 255.0;
        float g3 = blendColor.g / 255.0;
        float b3 = blendColor.b / 255.0;
        float i3 = blendColor.a / 255.0;
        float i1 = 1.0 - i3;
        r = clamp((r / a + r2) * a, 0.0, 1.0);
        g = clamp((g / a + g2) * a, 0.0, 1.0);
        b = clamp((b / a + b2) * a, 0.0, 1.0);
        r = clamp(r * i1 + r3 * i3 * a, 0.0, 1.0);
        g = clamp(g * i1 + g3 * i3 * a, 0.0, 1.0);
        b = clamp(b * i1 + b3 * i3 * a, 0.0, 1.0);
        r = r * brightness / 255.0;
        g = g * brightness / 255.0;
        b = b * brightness / 255.0;

        vec4 color = vec4(r, g, b, a);
        color = applyBushDepth(color);

        gl_FragColor = color;
    }
`;

  // src/Sprite3D_WrapPixi.ts
  var Sprite3D_WrapPixi = class extends Sprite3D_Mesh {
    constructor(pixiSprite, baseX = 0, baseZ = 0, priority = 0) {
      super($scene3d.mode7Camera(), pixiSprite.width, pixiSprite.height);
      this._hue = 0;
      this._blendColor = [0, 0, 0, 0];
      this._colorTone = [0, 0, 0, 0];
      this._useShaderMaterial = true;
      if (this._useShaderMaterial) {
        this.material = this.createShaderMaterial();
      } else {
        const material = new import_three7.MeshBasicMaterial({ transparent: true, depthTest: false });
        this.material = material;
        const bitmap = new Bitmap(1, 1);
        const texture = new import_three7.Texture(bitmap.canvas);
        material.map = texture;
      }
      this._pixiSprite = pixiSprite;
      this._baseX = baseX;
      this._baseZ = baseZ;
      this.createTexture();
      this._texture = null;
      this._priority = priority;
    }
    dispose() {
      super.dispose();
      if (this._texture)
        this._texture.dispose();
    }
    update() {
      super.update();
      this.createTexture();
      if (!this._texture)
        return;
      this.updatePosition();
      this.updateUVs();
      this.updateVisibility();
      this.updateOpacity();
      if (this._useShaderMaterial)
        this.updateShaderUniforms();
    }
    resetPixiSprite(pixiSprite) {
      this._pixiSprite = pixiSprite;
    }
    setBlendColor(color) {
      if (!(color instanceof Array)) {
        throw new Error("Argument must be an array");
      }
      if (!this._blendColor.equals(color)) {
        this._blendColor = color.clone();
      }
    }
    getScreenPosition() {
      const projection = $scene3d.mode7Camera().getProjection(this);
      const x = Graphics.width - (projection.x + 1) * Graphics.width / 2 - this.width / 2;
      const y = Graphics.height - (projection.y + 1) * Graphics.height / 2 - this.height / 2;
      return new import_three7.Vector2(x, y);
    }
    updatePosition() {
      this.position.set(this._pixiSprite.x + this._baseX, 0, this._pixiSprite.y + this._baseZ);
    }
    updateVisibility() {
      if (this._pixiSprite.visible) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    }
    updateOpacity() {
      if (!this._useShaderMaterial) {
        const material = this.material;
        material.opacity = this._pixiSprite.opacity / 255;
      }
    }
    createTexture() {
      if (this._texture)
        return;
      if (!this._pixiSprite.bitmap.isReady())
        return;
      this._texture = new import_three7.Texture(this._pixiSprite.bitmap.canvas);
      if (this._useShaderMaterial) {
        const material = this.material;
        this._texture.needsUpdate = true;
        material.uniforms.sampler.value = this._texture;
      } else {
        const material = this.material;
        material.map = this._texture;
        material.map.needsUpdate = true;
      }
      this.updateUVs();
    }
    updateUVs() {
      const frame = this._pixiSprite._frame.clone();
      this.resetUVMs(frame, this._pixiSprite.bitmap.width, this._pixiSprite.bitmap.height);
    }
    createShaderMaterial() {
      const vertexShader = CharacterVertShader;
      const fragmentShader = CharacterFragShader;
      const uniforms = {
        graphicsHeight: { value: Graphics.height },
        characterHeight: { value: this.height },
        screenY: { value: 0 },
        bushDepth: { value: 0 },
        sampler: { type: "t", value: null },
        hue: { value: this._hue },
        colorTone: { value: this.array2Vec4(this._colorTone) },
        blendColor: { value: this.array2Vec4(this._blendColor) },
        brightness: { value: 255 }
      };
      return new import_three7.ShaderMaterial({ transparent: true, depthTest: false, vertexShader, fragmentShader, uniforms });
    }
    updateShaderUniforms() {
      const material = this.material;
      material.uniforms.hue.value = this._hue;
      material.uniforms.blendColor.value = this.array2Vec4(this._blendColor);
      material.uniforms.colorTone.value = this.array2Vec4(this._colorTone);
    }
    array2Vec4(array) {
      return new import_three7.Vector4(array[0], array[1], array[2], array[3]);
    }
  };

  // src/EventParamParser.ts
  var EventParamParser = class {
    static getSpriteMode(event) {
      let spriteMode = true;
      let noteSpriteMode = this.getAnnotationValue(event, "SpriteMode");
      if (noteSpriteMode != null)
        spriteMode = noteSpriteMode === "true";
      return spriteMode;
    }
    static getAnnotationValue(event, name) {
      const note = this.getAnnotation(event);
      const data = { note };
      DataManager.extractMetadata(data);
      if (data.meta[name])
        return data.meta[name];
      return null;
    }
    static getAnnotation(event) {
      const eventData = event.event();
      if (eventData) {
        const noteLines = [];
        const page0List = eventData.pages[0].list;
        if (page0List.length > 0 && page0List[0].code === 108) {
          for (let i = 0; i < page0List.length; i++) {
            if (page0List[0].code === 108 || page0List[0].code === 408) {
              noteLines.push(page0List[i].parameters[0]);
            } else {
              break;
            }
          }
          return noteLines.join("\n");
        }
      }
      return "";
    }
  };

  // src/Sprite3D_Character.ts
  var Sprite3D_Character = class extends Sprite3D_WrapPixi {
    static get SPRITE_SIZE() {
      return 48;
    }
    constructor(pixiSprite, baseX, baseZ, priority) {
      super(pixiSprite, baseX, baseZ);
      this._character = pixiSprite._character;
      this._priority = priority;
      if (this._character instanceof Game_Event) {
        const spriteMode = EventParamParser.getSpriteMode(this._character);
        this.setSpriteMode(spriteMode);
        this.rotation.x = SuperMode7Utils.deg2rad(0);
      }
    }
    updateShaderUniforms() {
      super.updateShaderUniforms();
      const material = this.material;
      const screenPos = this.getScreenPosition();
      material.uniforms.screenY.value = screenPos.y;
      material.uniforms.bushDepth.value = this._character.bushDepth();
    }
    character() {
      return this._character;
    }
    updatePosition() {
      this._character = this._pixiSprite._character;
      if (this._character instanceof Game_Vehicle && this._character.isAirship()) {
        this.position.y = this._character._altitude * 4;
      } else {
        this.position.y = this.baseY() + this._priority;
      }
      this.position.x = this._character._realX * 48 + this._baseX + 24;
      this.position.z = this._character._realY * 48 + this._baseZ + 24 - this._character.shiftY();
    }
    baseY() {
      return 0;
    }
    updateUVs() {
      const frame = this._pixiSprite._frame.clone();
      frame.width = 48;
      frame.height = 48;
      frame.x += 0.5;
      frame.y += 0.5;
      frame.width -= 0.5;
      frame.height -= 0.5;
      this.resetUVMs(frame, this._pixiSprite.bitmap.width, this._pixiSprite.bitmap.height);
    }
  };

  // src/Sprite3D_Shadow.ts
  var import_three8 = __toModule(__require("three"));
  var Sprite3D_Shadow = class extends Sprite3D_Mesh {
    static get SPRITE_SIZE() {
      return 48;
    }
    constructor(camera, baseX, baseZ) {
      super(camera, Sprite3D_Shadow.SPRITE_SIZE, Sprite3D_Shadow.SPRITE_SIZE);
      this._baseX = baseX;
      this._baseZ = baseZ;
      this.material = new import_three8.MeshBasicMaterial({ transparent: true, depthTest: false });
    }
    setupCharacter(character) {
      this._character = character;
      const spriteSize = Sprite3D_Shadow.SPRITE_SIZE;
      this.position.set(spriteSize * character._realX, spriteSize / 2, spriteSize * character._realY);
      this.createTexture();
    }
    update() {
      super.update();
      this.updatePosition();
      this.updateVisibility();
      this.updateOpacity();
    }
    updatePosition() {
      this.position.z = this._character._realY * 48 + 24 + this._baseZ;
      this.position.x = this._character._realX * 48 + 24 + this._baseX;
    }
    updateVisibility() {
      const pixiSprite = this.getPixiSprite();
      if (pixiSprite.visible) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    }
    updateOpacity() {
      const pixiSprite = this.getPixiSprite();
      this.material.opacity = pixiSprite.opacity / 255;
    }
    getPixiSprite() {
      const spriteset = SceneManager._scene._spriteset;
      return spriteset._shadowSprite;
    }
    createTexture() {
      const pixiSprite = this.getPixiSprite();
      const frame = pixiSprite._frame.clone();
      frame.width = 48;
      frame.height = 48;
      const bitmap = new Bitmap(frame.width, frame.height);
      bitmap.blt(pixiSprite.bitmap, frame.x, frame.y, frame.width, frame.height, 0, 0);
      const texture = new import_three8.Texture(bitmap.canvas);
      const material = this.material;
      material.map = texture;
      material.map.needsUpdate = true;
    }
  };

  // src/TilemapTextureGenerator.ts
  var import_three9 = __toModule(__require("three"));
  var TilemapTextureGenerator = class {
    generate() {
      const spriteset = SceneManager._scene._spriteset;
      const tilemap = spriteset._tilemap;
      const tilemapBitmap = new Bitmap(4092, 4092);
      tilemap._bitmaps.forEach((bitmap, i) => {
        this._convertBitmap(tilemapBitmap, bitmap, i);
      });
      return new import_three9.Texture(tilemapBitmap.canvas, import_three9.Texture.DEFAULT_MAPPING, import_three9.ClampToEdgeWrapping, import_three9.ClampToEdgeWrapping, import_three9.NearestFilter, import_three9.NearestMipMapLinearFilter, import_three9.RGBAFormat, import_three9.UnsignedByteType, 1, import_three9.LinearEncoding);
    }
    _convertBitmap(dstBitmap, srcBitmap, index) {
      const unit = 768 / 24;
      for (let y = 0; y < unit; y++) {
        for (let x = 0; x < unit; x++) {
          const sx = x * 24;
          const sy = y * 24;
          const dxOfs = Math.floor(index / 2) * 768;
          const dyOfs = index % 2 * 768;
          const dx = x * 24 + dxOfs;
          const dy = y * 24 + dyOfs;
          dstBitmap.blt(srcBitmap, sx, sy, 24, 24, dx, dy);
        }
      }
    }
  };

  // src/TilemapVertShader.ts
  var TilemapVertShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);    
        gl_Position = projectionMatrix * mvPosition;
    }
`;

  // src/TilemapFragShader.ts
  var TilemapFragShader = `
    uniform sampler2D sampler;
    uniform float fadeEffectRate;
    varying vec2 vUv;

    void main() {
        vec4 color = texture2D(sampler, vUv);
        float a = color.a;
        vec3 rgb = vec3(color.r, color.g, color.b);
        float n = gl_FragCoord.y / 624.0;
        n += 0.1;
        if (n > 1.0) {
            n = 1.0;
        }
        n = pow(n, 4.0);
        n *= fadeEffectRate;
        vec3 white = vec3(n, n, n);
        rgb += white;

        gl_FragColor = vec4(rgb.r, rgb.g, rgb.b, a);
    }
`;

  // src/Plane_Destination.ts
  var import_three10 = __toModule(__require("three"));
  var Plane_Destination = class extends import_three10.Mesh {
    constructor() {
      super();
      this._frameCount = 0;
      this.geometry = new import_three10.PlaneGeometry($gameMap.tileWidth(), $gameMap.tileHeight());
      this.material = new import_three10.MeshBasicMaterial({ transparent: true, depthTest: false });
      this.createTexture();
      this.position.y = 2;
      this.rotation.x = SuperMode7Utils.deg2rad(0);
    }
    dispose() {
      this.geometry.dispose();
      if (this.material instanceof import_three10.Material) {
        this.material.dispose();
      } else if (this.material instanceof Array) {
        for (const mat of this.material) {
          mat.dispose();
        }
      }
    }
    update() {
      this.createTexture();
      if ($gameTemp.isDestinationValid()) {
        this.updatePosition();
        this.updateAnimation();
        this.visible = true;
      } else {
        this._frameCount = 0;
        this.visible = false;
      }
    }
    createTexture() {
      const tileWidth = $gameMap.tileWidth();
      const tileHeight = $gameMap.tileHeight();
      const bitmap = new Bitmap(tileWidth, tileHeight);
      bitmap.fillAll("white");
      const texture = new import_three10.Texture(bitmap.canvas);
      const material = this.material;
      material.map = texture;
      material.map.needsUpdate = true;
    }
    updatePosition() {
      const tileWidth = $gameMap.tileWidth();
      const tileHeight = $gameMap.tileHeight();
      const x = $gameTemp.destinationX();
      const y = $gameTemp.destinationY();
      this.position.x = x * tileWidth + 24;
      this.position.z = y * tileHeight + 24;
    }
    updateAnimation() {
      this._frameCount++;
      this._frameCount %= 20;
      if (this.material instanceof import_three10.Material) {
        this.material.opacity = (20 - this._frameCount) * 6 / 255;
        ;
      }
      this.scale.x = 1 + this._frameCount / 20;
      this.scale.y = this.scale.x;
    }
  };

  // src/TilemapContainer.ts
  var TilemapContainer = class extends import_three12.Object3D {
    constructor(map, camera) {
      super();
      this._raycaster = new import_three12.Raycaster();
      this._map = map;
      this._camera = camera;
      this._floorPlanesContainer = new TilemapFloorPlanesContainer(map, camera);
      this._playerSprites = [];
      this._followerSprites = [];
      this._vehicleSprites = [];
      this._eventSprites = [];
      this._wrapSprites = [];
      this._shadowSprites = [];
      for (let i = 0; i < 9; i++) {
        this._playerSprites.push([]);
        this._followerSprites.push([]);
        this._vehicleSprites.push([]);
        this._eventSprites.push([]);
        this._wrapSprites.push([]);
        this._shadowSprites.push([]);
      }
      this._planeDestination = null;
    }
    get fadeEffectRate() {
      return this._floorPlanesContainer.fadeEffectRate;
    }
    set fadeEffectRate(_fadeEffectRate) {
      this._floorPlanesContainer.fadeEffectRate = _fadeEffectRate;
    }
    dispose() {
      let baseXIndexBegin = 1;
      let baseXIndexEnd = 1;
      let baseYIndexBegin = 1;
      let baseYIndexEnd = 1;
      if ($gameMap.isLoopHorizontal()) {
        baseXIndexBegin = 0;
        baseXIndexEnd = 2;
      }
      if ($gameMap.isLoopVertical()) {
        baseYIndexBegin = 0;
        baseYIndexEnd = 2;
      }
      for (let baseYIndex = baseYIndexBegin; baseYIndex <= baseYIndexEnd; baseYIndex++) {
        for (let baseXIndex = baseXIndexBegin; baseXIndex <= baseXIndexEnd; baseXIndex++) {
          const baseIdx = baseYIndex * 3 + baseXIndex;
          for (const sprite of this._playerSprites[baseIdx]) {
            this.remove(sprite);
            sprite.dispose();
          }
          for (const sprite of this._followerSprites[baseIdx]) {
            this.remove(sprite);
            sprite.dispose();
          }
          for (const sprite of this._vehicleSprites[baseIdx]) {
            this.remove(sprite);
            sprite.dispose();
          }
          for (const sprite of this._eventSprites[baseIdx]) {
            if (!sprite)
              continue;
            this.remove(sprite);
            sprite.dispose();
          }
          for (const sprite of this._wrapSprites[baseIdx]) {
            this.remove(sprite);
            sprite.dispose();
          }
          for (const sprite of this._shadowSprites[baseIdx]) {
            this.remove(sprite);
            sprite.dispose();
          }
        }
      }
      if (this._planeDestination) {
        this.remove(this._planeDestination);
        this._planeDestination.dispose();
      }
      this.remove(this._floorPlanesContainer);
      this._floorPlanesContainer.dispose();
    }
    start() {
      let baseXIndexBegin = 1;
      let baseXIndexEnd = 1;
      let baseYIndexBegin = 1;
      let baseYIndexEnd = 1;
      if ($gameMap.isLoopHorizontal()) {
        baseXIndexBegin = 0;
        baseXIndexEnd = 2;
      }
      if ($gameMap.isLoopVertical()) {
        baseYIndexBegin = 0;
        baseYIndexEnd = 2;
      }
      for (let baseYIndex = baseYIndexBegin; baseYIndex <= baseYIndexEnd; baseYIndex++) {
        for (let baseXIndex = baseXIndexBegin; baseXIndex <= baseXIndexEnd; baseXIndex++) {
          for (const event of $gameMap.events()) {
            this.addCharacterSprite(event, baseXIndex, baseYIndex);
          }
          this.addCharacterSprite($gamePlayer, baseXIndex, baseYIndex, 5);
          let i = 4;
          for (const follower of $gamePlayer.followers().data()) {
            this.addCharacterSprite(follower, baseXIndex, baseYIndex, i);
            i--;
          }
          for (const vehicle of $gameMap.vehicles()) {
            this.addCharacterSprite(vehicle, baseXIndex, baseYIndex);
          }
          this.addShadowSprite(baseXIndex, baseYIndex);
        }
      }
      this._planeDestination = new Plane_Destination();
      this.add(this._planeDestination);
      this.add(this._floorPlanesContainer);
    }
    update() {
      for (const event of $gameMap.events()) {
        this.updateCharacterSprite(event);
      }
      this.updateCharacterSprite($gamePlayer);
      for (const follower of $gamePlayer.followers().data()) {
        this.updateCharacterSprite(follower);
      }
      for (const vehicle of $gameMap.vehicles()) {
        this.updateCharacterSprite(vehicle);
      }
      this.updateShadowSprite();
      this._planeDestination?.update();
      this._floorPlanesContainer.update();
    }
    reset() {
      for (const event of $gameMap.events()) {
        this.resetCharacterSprite(event);
      }
      this.resetCharacterSprite($gamePlayer);
      for (const follower of $gamePlayer.followers().data()) {
        this.resetCharacterSprite(follower);
      }
      for (const vehicle of $gameMap.vehicles()) {
        this.resetCharacterSprite(vehicle);
      }
    }
    raycastToTilemap(pos) {
      this._raycaster.setFromCamera(pos, this._camera);
      const intersects = this._raycaster.intersectObjects(this._floorPlanesContainer.children);
      if (intersects.length > 0) {
        const intersect = intersects[intersects.length - 1];
        return intersect.point;
      }
      return null;
    }
    findCharacterSprite(character, baseIdx) {
      if (character instanceof Game_Event) {
        return this._eventSprites[baseIdx][character.eventId()];
      } else if (character instanceof Game_Player) {
        return this._playerSprites[baseIdx][0];
      } else if (character instanceof Game_Follower) {
        const followers = $gamePlayer.followers().data();
        const follower = followers.find((follower2) => follower2 === character);
        const followerIdx = followers.indexOf(follower);
        return this._followerSprites[baseIdx][followerIdx];
      } else if (character instanceof Game_Vehicle) {
        let vehicleIdx = 0;
        if (character._type === "boat") {
          vehicleIdx = 0;
        } else if (character._type === "ship") {
          vehicleIdx = 1;
        } else if (character._type === "airship") {
          vehicleIdx = 2;
        }
        return this._vehicleSprites[baseIdx][vehicleIdx];
      }
      return null;
    }
    addCharacterSprite(character, baseXIndex, baseYIndex, pri = 0) {
      const baseIdx = baseYIndex * 3 + baseXIndex;
      const baseX = (baseXIndex - 1) * this._map.width() * 48;
      const baseZ = (baseYIndex - 1) * this._map.height() * 48;
      const spriteset = SceneManager._scene._spriteset;
      const pixiSprite = spriteset.findTargetSprite(character);
      const sprite = new Sprite3D_Character(pixiSprite, baseX, baseZ, pri);
      this.add(sprite);
      if (character instanceof Game_Event) {
        this._eventSprites[baseIdx][character.eventId()] = sprite;
      } else if (character instanceof Game_Player) {
        this._playerSprites[baseIdx][0] = sprite;
      } else if (character instanceof Game_Follower) {
        this._followerSprites[baseIdx].push(sprite);
      } else if (character instanceof Game_Vehicle) {
        let vehicleIdx = 0;
        if (character._type === "boat") {
          vehicleIdx = 0;
        } else if (character._type === "ship") {
          vehicleIdx = 1;
        } else if (character._type === "airship") {
          vehicleIdx = 2;
        }
        this._vehicleSprites[baseIdx][vehicleIdx] = sprite;
      }
    }
    updateCharacterSprite(character) {
      for (let baseIdx = 0; baseIdx < 9; baseIdx++) {
        const sprite = this.findCharacterSprite(character, baseIdx);
        if (sprite)
          sprite.update();
      }
    }
    resetCharacterSprite(character) {
      const spriteset = SceneManager._scene._spriteset;
      for (let baseIdx = 0; baseIdx < 9; baseIdx++) {
        const sprite = this.findCharacterSprite(character, baseIdx);
        if (sprite) {
          const pixiSprite = spriteset.findTargetSprite(character);
          sprite.resetPixiSprite(pixiSprite);
        }
      }
    }
    addShadowSprite(baseX, baseY) {
      const baseIdx = baseY * 3 + baseX;
      const airship = $gameMap.vehicles().find((vehicle) => vehicle.isAirship());
      if (!airship) {
        throw new Error("Airship is not found");
      }
      const xOfs = (baseX - 1) * this._map.width() * 48;
      const yOfs = (baseY - 1) * this._map.height() * 48;
      const sprite = new Sprite3D_Shadow(this._camera, xOfs, yOfs);
      sprite.setupCharacter(airship);
      this.add(sprite);
      this._shadowSprites[baseIdx].push(sprite);
    }
    updateShadowSprite() {
      for (let baseIdx = 0; baseIdx < 9; baseIdx++) {
        for (const sprite of this._shadowSprites[baseIdx]) {
          sprite.update();
        }
      }
    }
  };
  var TilemapFloorPlanesContainer = class extends import_three12.Object3D {
    constructor(map, camera) {
      super();
      this._areaSize = 38;
      this._lowerPlanes = [];
      this._upperPlanes = [];
      this._useShaderMaterial = true;
      this._fadeEffectRate = 0;
      this._map = map;
      this._camera = camera;
      this.createPlanes();
      this._tilemapElementsGenerator = new TilemapElementsGenerator();
      this._tilemapElementsGenerator.setData(map.width(), map.height(), map.data());
    }
    get fadeEffectRate() {
      return this._fadeEffectRate;
    }
    set fadeEffectRate(_fadeEffectRate) {
      this._fadeEffectRate = _fadeEffectRate;
    }
    dispose() {
      this._lowerPlaneGeometry.dispose();
      this._upperPlaneGeometry.dispose();
      this._material.dispose();
      this._tilemapTexture.dispose();
    }
    update() {
      if (this._useShaderMaterial) {
        this._material.uniforms.fadeEffectRate.value = this._fadeEffectRate;
      }
      const focus = this._camera.cameraFocusPoint();
      this._tilemapElementsGenerator.width = this._areaSize * 48;
      this._tilemapElementsGenerator.height = this._areaSize * 48;
      this._tilemapElementsGenerator.startX = Math.round(focus.x) - this._areaSize / 2;
      this._tilemapElementsGenerator.startY = Math.round(focus.y) - this._areaSize / 2;
      this._tilemapElementsGenerator.update();
      if (!this._tilemapElementsGenerator.checkUpdated())
        return;
      if (!this._tilemapTexture) {
        this.createTexture();
        if (this._material instanceof import_three11.MeshBasicMaterial) {
          this._material.map = this._tilemapTexture;
          this._material.map.needsUpdate = true;
        } else {
          this._tilemapTexture.needsUpdate = true;
          this._material.uniforms.sampler.value = this._tilemapTexture;
        }
      }
      let baseXIndexBegin = 1;
      let baseXIndexEnd = 1;
      let baseYIndexBegin = 1;
      let baseYIndexEnd = 1;
      if ($gameMap.isLoopHorizontal()) {
        baseXIndexBegin = 0;
        baseXIndexEnd = 2;
      }
      if ($gameMap.isLoopVertical()) {
        baseYIndexBegin = 0;
        baseYIndexEnd = 2;
      }
      let index = 0;
      for (let baseYIndex = baseYIndexBegin; baseYIndex <= baseYIndexEnd; baseYIndex++) {
        for (let baseXIndex = baseXIndexBegin; baseXIndex <= baseXIndexEnd; baseXIndex++) {
          const xOfs = (baseXIndex - 1) * this._map.width() * 48;
          const zOfs = (baseYIndex - 1) * this._map.height() * 48;
          const xPos = xOfs + Math.round(focus.x) * 48;
          const zPos = zOfs + Math.round(focus.y) * 48;
          const lowerPlane = this._lowerPlanes[index];
          lowerPlane.position.x = xPos;
          lowerPlane.position.z = zPos;
          const upperPlane = this._upperPlanes[index];
          upperPlane.position.x = xPos;
          upperPlane.position.z = zPos;
          index++;
        }
      }
      let elements = this._tilemapElementsGenerator.lowerLayerElements();
      if (elements) {
        this._lowerPlaneGeometry.setElements(elements);
      }
      elements = this._tilemapElementsGenerator.upperLayerElements();
      if (elements) {
        this._upperPlaneGeometry.setElements(elements);
      }
      this._lowerPlaneGeometry.update();
      this._upperPlaneGeometry.update();
    }
    createPlanes() {
      this._lowerPlaneGeometry = new TilemapPlaneGeometry(this._areaSize * 48, this._areaSize * 48, this._areaSize * 2, this._areaSize * 2, 4);
      this._upperPlaneGeometry = new TilemapPlaneGeometry(this._areaSize * 48, this._areaSize * 48, this._areaSize * 2, this._areaSize * 2, 1);
      if (this._useShaderMaterial) {
        this._material = this.createShaderMaterial();
      } else {
        this._material = new import_three11.MeshBasicMaterial({ transparent: true, depthTest: false });
      }
      let baseXIndexBegin = 1;
      let baseXIndexEnd = 1;
      let baseYIndexBegin = 1;
      let baseYIndexEnd = 1;
      if ($gameMap.isLoopHorizontal()) {
        baseXIndexBegin = 0;
        baseXIndexEnd = 2;
      }
      if ($gameMap.isLoopVertical()) {
        baseYIndexBegin = 0;
        baseYIndexEnd = 2;
      }
      for (let baseYIndex = baseYIndexBegin; baseYIndex <= baseYIndexEnd; baseYIndex++) {
        for (let baseXIndex = baseXIndexBegin; baseXIndex <= baseXIndexEnd; baseXIndex++) {
          const xOfs = (baseXIndex - 1) * this._map.width() * 48;
          const zOfs = (baseYIndex - 1) * this._map.height() * 48;
          const lowerPlane = new import_three11.Mesh(this._lowerPlaneGeometry, this._material);
          lowerPlane.position.set(xOfs, 0, zOfs);
          lowerPlane.rotation.x = SuperMode7Utils.deg2rad(0);
          lowerPlane.renderOrder = -1;
          this._lowerPlanes.push(lowerPlane);
          this.add(lowerPlane);
          const upperPlane = new import_three11.Mesh(this._upperPlaneGeometry, this._material);
          upperPlane.position.set(xOfs, 1, zOfs);
          upperPlane.rotation.x = SuperMode7Utils.deg2rad(0);
          upperPlane.renderOrder = -1;
          this._upperPlanes.push(upperPlane);
          this.add(upperPlane);
        }
      }
    }
    createTexture() {
      const textureGenerator = new TilemapTextureGenerator();
      this._tilemapTexture = textureGenerator.generate();
      this._lowerPlaneGeometry.setTextureSize(this._tilemapTexture.image.width, this._tilemapTexture.image.height);
      this._upperPlaneGeometry.setTextureSize(this._tilemapTexture.image.width, this._tilemapTexture.image.height);
    }
    createShaderMaterial() {
      const vertexShader = TilemapVertShader;
      const fragmentShader = TilemapFragShader;
      const uniforms = {
        sampler: { type: "t", value: null },
        fadeEffectRate: { value: 0 }
      };
      return new import_three11.ShaderMaterial({ transparent: true, depthTest: false, vertexShader, fragmentShader, uniforms });
    }
  };

  // src/EffectContainer.ts
  var import_three13 = __toModule(__require("three"));
  var EffectContainer = class extends import_three13.Object3D {
    constructor(animationId, targets) {
      super();
      this._targets = targets;
      this._animation = $dataAnimations[animationId];
      this._mirror = false;
      this._delay = 0;
      this._previous = null;
      this._effect = null;
      this._handle = null;
      this._playing = false;
      this._started = false;
      this._frameIndex = 0;
      this._maxTimingFrames = 0;
      this._flashColor = [0, 0, 0, 0];
      this._flashDuration = 0;
    }
    targets() {
      return this._targets;
    }
    play() {
      this._effect = EffectManager.load(this._animation.effectName);
      const location = new import_three13.Vector3(this._targets[0].position.x, 24, this._targets[0].position.z);
      this._playing = true;
      const speed = this._animation.speed / 200;
      $scene3d._effekseerController.play(this._effect, location, { speed });
    }
    update() {
      if (this._delay > 0) {
        this._delay--;
      } else if (this._playing) {
        if (!this._started && this.canStart()) {
          if (this._effect) {
            if (this._effect.isLoaded) {
              this._started = true;
            } else {
              EffectManager.checkErrors();
            }
          } else {
            this._started = true;
          }
        }
        if (this._started) {
          this.updateMain();
          this.updateFlash();
        }
      }
    }
    canStart() {
      return true;
    }
    updateMain() {
      this.processSoundTimings();
      this.processFlashTimings();
      this._frameIndex++;
    }
    processSoundTimings() {
      for (const timing of this._animation.soundTimings) {
        if (timing.frame === this._frameIndex) {
          AudioManager.playSe(timing.se);
        }
      }
    }
    processFlashTimings() {
      for (const timing of this._animation.flashTimings) {
        if (timing.frame === this._frameIndex) {
          this._flashColor = timing.color.clone();
          this._flashDuration = timing.duration;
        }
      }
    }
    updateFlash() {
      if (this._flashDuration > 0) {
        const d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
        for (const target of this._targets) {
          target.setBlendColor(this._flashColor);
        }
      }
    }
    isPlaying() {
      return this._playing;
    }
  };

  // src/MapScene3D.ts
  var MapScene3D = class extends Scene3D {
    constructor() {
      super();
      this._effekseerController = new EffekseerController(this._renderer, this._camera);
      this._tilemapContainer = new TilemapContainer($gameMap, this.mode7Camera());
      this._fadeEffectController = new FadeEffectController(this._tilemapContainer);
      this._scene.add(this._tilemapContainer);
      if (this._params.FadeEffectRate != null && this._params.FadeEffectRate > 0)
        this.changeFadeEffect(this._params.FadeEffectRate, 0);
    }
    createScene() {
      this._params = SuperMode7Utils.superMode7MapParams();
      const scene = new import_three14.Scene();
      return scene;
    }
    createCamera() {
      const camera = new Mode7Camera();
      if (this._params.CameraHeight != null)
        camera.cameraHeight = this._params.CameraHeight;
      if (this._params.FarFromCenter != null)
        camera.farFromCenter = this._params.FarFromCenter;
      return camera;
    }
    resetScene() {
      this.resetTilemapContainer();
    }
    resetTilemapContainer() {
      this._tilemapContainer.reset();
    }
    startScene() {
      this._tilemapContainer.start();
    }
    dispose() {
      this._scene.remove(this._tilemapContainer);
      this._tilemapContainer.dispose();
    }
    updateScene() {
      this._tilemapContainer.update();
      if (SuperMode7Utils.isEnableMove360()) {
        if (Input.isPressed("pageup")) {
          $gamePlayer._realAngle += 4;
        } else if (Input.isPressed("pagedown")) {
          $gamePlayer._realAngle -= 4;
        }
      }
      this._camera.update();
      for (const child of this._scene.children) {
        if (child instanceof EffectContainer) {
          child.update();
        }
      }
      this._fadeEffectController.update();
      this._effekseerController.prepareRenderUpdate();
      this._renderer.render(this._scene, this._camera);
      this._effekseerController.postRenderUpdate();
    }
    mode7Camera() {
      return this._camera;
    }
    raycastToTilemap(pos) {
      return this._tilemapContainer.raycastToTilemap(pos);
    }
    changeFadeEffect(rate, duration) {
      this._fadeEffectController.changeFadeEffect(rate, duration);
    }
    fadeEffectRate() {
      return this._fadeEffectController.fadeEffectRate();
    }
  };
  var FadeEffectController = class {
    constructor(tilemapContainer) {
      this._remainDuration = 0;
      this._rateChangeUnit = 0;
      this._targetRate = 0;
      this._tilemapContainer = tilemapContainer;
    }
    changeFadeEffect(rate, duration) {
      if (duration === 0) {
        this._tilemapContainer.fadeEffectRate = rate;
      } else {
        const currentRate = this._tilemapContainer.fadeEffectRate;
        if (currentRate === rate)
          return;
        this._targetRate = rate;
        this._rateChangeUnit = (rate - currentRate) / duration;
        this._remainDuration = duration;
      }
    }
    fadeEffectRate() {
      return this._tilemapContainer.fadeEffectRate;
    }
    isBusy() {
      return this._remainDuration > 0;
    }
    update() {
      if (this._remainDuration <= 0)
        return;
      this._remainDuration--;
      this._tilemapContainer.fadeEffectRate += this._rateChangeUnit;
      if (this._remainDuration <= 0) {
        this._tilemapContainer.fadeEffectRate = this._targetRate;
      }
    }
  };

  // src/Scene_Map.ts
  var import_three15 = __toModule(__require("three"));
  var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    if (SuperMode7Utils.isEnabledSuperMode7()) {
      if ($scene3d && $gameMap.mapId() === $gameTemp.lastMapId()) {
        $scene3d.resetScene();
      } else {
        setScene3d(new MapScene3D());
      }
      $scene3d.initPIXITextture();
      Graphics._effekseer = $scene3d._effekseerController._context;
      this._spriteset._sprite3dContainer.addChild($scene3d._sprite);
    } else {
      $scene3d?.dispose();
      setScene3d(null);
    }
    $gameTemp.setLastMapId($gameMap.mapId());
  };
  var _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    if ($scene3d) {
      $scene3d.update();
    }
  };
  Scene_Map.prototype.createSpriteset = function() {
    this._spriteset = new Spriteset_Map();
    this.addChild(this._spriteset);
    this._spriteset.update();
  };
  Scene_Map.prototype.onMapTouch = function() {
    const mouseX = TouchInput.x / (Graphics.width / 2) - 1;
    const mouseY = -(TouchInput.y / (Graphics.height / 2)) + 1;
    const pos = new import_three15.Vector2(mouseX, mouseY);
    const point = $scene3d.raycastToTilemap(pos);
    if (point) {
      const x = Math.round((point.x - 24) / 48);
      const y = Math.round((point.z - 24) / 48);
      $gameTemp.setDestination(x, y);
    }
  };

  // src/Spriteset_Map.ts
  var _Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
  Spriteset_Map.prototype.initialize = function() {
    _Spriteset_Map_initialize.call(this);
    this._effectContainers = [];
  };
  var _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    _Spriteset_Map_createLowerLayer.call(this);
    this._sprite3dContainer = new PIXI.Container();
    this._baseSprite.addChild(this._sprite3dContainer);
  };
  var _Spriteset_Map_createAnimation = Spriteset_Map.prototype.createAnimation;
  Spriteset_Map.prototype.createAnimation = function(request) {
    if (SuperMode7Utils.isEnabledSuperMode7()) {
      for (const target of request.targets) {
        const sprite3d = $scene3d._tilemapContainer.findCharacterSprite(target, 4);
        const container = new EffectContainer(request.animationId, [sprite3d]);
        $scene3d._scene.add(container);
        container.play();
        this._effectContainers.push(container);
      }
    } else {
      _Spriteset_Map_createAnimation.call(this, request);
    }
  };
  var _Spriteset_Map_updateAnimations = Spriteset_Map.prototype.updateAnimations;
  Spriteset_Map.prototype.updateAnimations = function() {
    if (SuperMode7Utils.isEnabledSuperMode7()) {
      this.processAnimationRequests();
      if ($scene3d && !$scene3d._effekseerController.isPlaying() && this._effectContainers.length > 0) {
        for (const container of this._effectContainers) {
          for (const target of container.targets()) {
            if (target.character().endAnimation)
              target.character().endAnimation();
          }
        }
        this._effectContainers = [];
      }
    } else {
      _Spriteset_Map_updateAnimations.call(this);
    }
  };
  var _Spriteset_Map_isAnimationPlaying = Spriteset_Map.prototype.isAnimationPlaying;
  Spriteset_Map.prototype.isAnimationPlaying = function() {
    if (SuperMode7Utils.isEnabledSuperMode7()) {
      return false;
    } else {
      return _Spriteset_Map_isAnimationPlaying.call(this);
    }
  };
  var _Spriteset_Map_createShadow = Spriteset_Map.prototype.createShadow;
  Spriteset_Map.prototype.createShadow = function() {
    _Spriteset_Map_createShadow.call(this);
    this._shadowSprite.setDummyMode(true);
  };

  // src/Sprite.ts
  var _Sprite_initialize = Sprite.prototype.initialize;
  Sprite.prototype.initialize = function(bitmap) {
    this._dummyMode = false;
    if (this instanceof Sprite_Character) {
      if (SuperMode7Utils.isEnabledSuperMode7()) {
        this._dummyMode = true;
      }
    }
    _Sprite_initialize.call(this, bitmap);
  };
  var _Sprite__refresh = Sprite.prototype._refresh;
  Sprite.prototype._refresh = function() {
    if (this._dummyMode) {
      this.texture.frame = new Rectangle();
      for (const child of this.children) {
        child.visible = false;
      }
    } else {
      _Sprite__refresh.call(this);
    }
  };
  Sprite.prototype.isDummyMode = function() {
    return this._dummyMode;
  };
  Sprite.prototype.setDummyMode = function(mode) {
    this._dummyMode = mode;
  };

  // src/Sprite_Character.ts
  var _Sprite_Character_updateHalfBodySprites = Sprite_Character.prototype.updateHalfBodySprites;
  Sprite_Character.prototype.updateHalfBodySprites = function() {
    if (!this.isDummyMode()) {
      _Sprite_Character_updateHalfBodySprites.call(this);
    }
  };
  var _Sprite_Character_updateCharacterFrame = Sprite_Character.prototype.updateCharacterFrame;
  Sprite_Character.prototype.updateCharacterFrame = function() {
    if (this.isDummyMode()) {
      const pw = this.patternWidth();
      const ph = this.patternHeight();
      const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
      const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
      this.setFrame(sx, sy, pw, ph);
    } else {
      _Sprite_Character_updateCharacterFrame.call(this);
    }
  };

  // src/Sprite_Destination.ts
  var _Sprite_Destination_initialize = Sprite_Destination.prototype.initialize;
  Sprite_Destination.prototype.initialize = function() {
    _Sprite_Destination_initialize.call(this);
    this.setDummyMode(true);
    this.visible = false;
  };
  Sprite_Destination.prototype.update = function() {
    Sprite.prototype.update.call(this);
  };

  // src/Tilemap.ts
  (() => {
    "use strict";
    const _Tilemap_createLayers = Tilemap.prototype._createLayers;
    Tilemap.prototype._createLayers = function() {
      if (!SuperMode7Utils.isEnabledSuperMode7()) {
        _Tilemap_createLayers.call(this);
      }
    };
    const _Tilemap_updateTransform = Tilemap.prototype.updateTransform;
    Tilemap.prototype.updateTransform = function() {
      if (SuperMode7Utils.isEnabledSuperMode7()) {
        PIXI.Container.prototype.updateTransform.call(this);
      } else {
        _Tilemap_updateTransform.call(this);
      }
    };
    const _Tilemap__updateBitmaps = Tilemap.prototype._updateBitmaps;
    Tilemap.prototype._updateBitmaps = function() {
      if (!SuperMode7Utils.isEnabledSuperMode7()) {
        _Tilemap__updateBitmaps.call(this);
      }
    };
    const _Tilemap_addAllSpots = Tilemap.prototype._addAllSpots;
    Tilemap.prototype._addAllSpots = function(startX, startY) {
      if (!SuperMode7Utils.isEnabledSuperMode7()) {
        _Tilemap_addAllSpots.call(this, startX, startY);
      }
    };
  })();

  // src/Game_CharacterBase.ts
  var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this._realAngle = 0;
  };
  Game_CharacterBase.prototype.realAngle = function() {
    return this._realAngle;
  };
  Game_CharacterBase.prototype.setRealAngle = function(angle) {
    this._realAngle = angle;
  };

  // src/Game_Player.ts
  var _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
  Game_Player.prototype.moveByInput = function() {
    if (SuperMode7Utils.isEnableMove360()) {
      if (!this.isMoving() && this.canMove()) {
        const dir = this.getInputDirection();
        switch (dir) {
          case 8:
            this.dotMoveByDeg(this._realAngle);
            break;
          case 9:
            this.dotMoveByDeg(this._realAngle + 45);
            break;
          case 6:
            this.dotMoveByDeg(this._realAngle + 90);
            break;
          case 3:
            this.dotMoveByDeg(this._realAngle + 135);
            break;
          case 2:
            this.dotMoveByDeg(this._realAngle + 180);
            break;
          case 1:
            this.dotMoveByDeg(this._realAngle + 225);
            break;
          case 4:
            this.dotMoveByDeg(this._realAngle + 270);
            break;
          case 7:
            this.dotMoveByDeg(this._realAngle + 315);
            break;
        }
      }
    } else {
      _Game_Player_moveByInput.call(this);
    }
  };
  var _Game_Player_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function(sceneActive) {
    _Game_Player_update.call(this, sceneActive);
    if (SuperMode7Utils.isEnableMove360()) {
      if ($scene3d)
        $scene3d.mode7Camera().angle = this._realAngle;
    }
  };
  var _Game_Player_getOnVehicle = Game_Player.prototype.getOnVehicle;
  Game_Player.prototype.getOnVehicle = function() {
    const result = _Game_Player_getOnVehicle.call(this);
    if (result) {
      const cameraHeight = $scene3d.mode7Camera().cameraHeight;
      const farFromCenter = $scene3d.mode7Camera().farFromCenter;
      const angle = $scene3d.mode7Camera().angle;
      const fadeEffectRate = $scene3d.fadeEffectRate();
      this._vehicleOffState = { angle, cameraHeight, farFromCenter, fadeEffectRate };
      if (this._vehicleType === "boat") {
        const func = new Function(PP.OnBoatExecScript);
        func.call(this);
      } else if (this._vehicleType === "ship") {
        const func = new Function(PP.OnShipExecScript);
        func.call(this);
      }
    }
    return result;
  };
  var _Game_Player_getOffVehicle = Game_Player.prototype.getOffVehicle;
  Game_Player.prototype.getOffVehicle = function() {
    const result = _Game_Player_getOffVehicle.call(this);
    if (result) {
      const cameraHeight = this._vehicleOffState.cameraHeight;
      const farFromCenter = this._vehicleOffState.farFromCenter;
      const fadeEffectRate = this._vehicleOffState.fadeEffectRate;
      $scene3d.mode7Camera().changeCameraHeight(cameraHeight, 60);
      $scene3d.mode7Camera().changeFarFromCenter(farFromCenter, 60);
      $scene3d.changeFadeEffect(fadeEffectRate, 60);
    }
    return result;
  };
  var _Game_Player_updateVehicleGetOn = Game_Player.prototype.updateVehicleGetOn;
  Game_Player.prototype.updateVehicleGetOn = function() {
    if (this._vehicleType === "airship") {
      if (!this.areFollowersGathering() && !this.isMoving()) {
        const func = new Function(PP.OnAirshipExecScript);
        func.call(this);
      }
    }
    _Game_Player_updateVehicleGetOn.call(this);
  };

  // src/CharacterMover.ts
  if (typeof DotMoveSystemClassAlias !== "undefined") {
    const { CharacterMover, DotMoveUtils } = DotMoveSystemClassAlias;
    CharacterMover.prototype.dotMoveByDeg = function(deg) {
      if (SuperMode7Utils.isEnableMove360()) {
        const relativeDeg = 360 - this._character._realAngle + deg;
        this.setDirection(SuperMode7Utils.deg2direction4_2(relativeDeg));
      } else {
        this.setDirection(DotMoveUtils.deg2direction4(deg));
      }
      this._moverData.targetCount = 1;
      this._moverData.moveDeg = deg;
      this.moveProcess();
    };
  }

  // src/FollowerMover.ts
  if (typeof DotMoveSystemClassAlias !== "undefined") {
    const { FollowerMover, CharacterMover } = DotMoveSystemClassAlias;
    FollowerMover.prototype.dotMoveByDeg = function(deg) {
      this._character._realAngle = $gamePlayer.realAngle();
      CharacterMover.prototype.dotMoveByDeg.call(this, deg);
    };
  }

  // src/Main.ts
  function SMode7_ChangeCameraHeight(cameraHeight, duration) {
    $scene3d?.mode7Camera().changeCameraHeight(cameraHeight, duration);
  }
  function SMode7_ChangeFarFromCenter(farFromCenter, duration) {
    $scene3d?.mode7Camera().changeFarFromCenter(farFromCenter, duration);
  }
  function SMode7_ChangeAngle(angle, direction, duration) {
    $scene3d?.mode7Camera().changeAngle(angle, direction, duration);
  }
  function SMode7_ChangeFadeEffect(rate, duration) {
    $scene3d?.changeFadeEffect(rate, duration);
  }
  PluginManager.registerCommand(pluginName, "ChangeCameraHeight", (args) => {
    const params = PluginParamsParser.parse(args, { CameraHeight: "number", Duration: "number" });
    SMode7_ChangeCameraHeight(params.CameraHeight, params.Duration);
  });
  PluginManager.registerCommand(pluginName, "ChangeFarFromCenter", (args) => {
    const params = PluginParamsParser.parse(args, { FarFromCenter: "number", Duration: "number" });
    SMode7_ChangeFarFromCenter(params.FarFromCenter, params.Duration);
  });
  PluginManager.registerCommand(pluginName, "ChangeAngle", (args) => {
    const params = PluginParamsParser.parse(args, { Angle: "number", Duration: "number" });
    SMode7_ChangeAngle(params.Angle, params.Direction, params.Duration);
  });
  PluginManager.registerCommand(pluginName, "ChangeFadeEffect", (args) => {
    const params = PluginParamsParser.parse(args, { Rate: "number", Duration: "number" });
    SMode7_ChangeFadeEffect(params.Rate, params.Duration);
  });
  var glb = window;
  glb.SMode7_ChangeCameraHeight = SMode7_ChangeCameraHeight;
  glb.SMode7_ChangeFarFromCenter = SMode7_ChangeFarFromCenter;
  glb.SMode7_ChangeAngle = SMode7_ChangeAngle;
  glb.SMode7_ChangeFadeEffect = SMode7_ChangeFadeEffect;
})();
/*!/*:
@target MZ
@plugindesc SuperMode7 v0.1.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SuperMode7.js
@help
3D表現が可能になるプラグインです。
※注意
本プラグインはまだ開発途中版です。
そのため、色々と機能が不足していたりバグがあったりします。ご了承ください。

【導入方法】
本プラグインは「three.js 0.131.1」を使用するため、同バージョンのthree.jsを
プラグインとしてSuperMode7よりも上に導入してください。

【使用方法】
マップのメモ欄に「<SuperMode7>」と記載することで、モード7が適用されたマップにすることができます。
また、「<SuperMode7>...</SuperMode7>」とすることで、より詳細にカスタマイズすることもできます。
パラメータのデフォルト値にはプラグインパラメータ「デフォルトパラメータ」で指定された値が適用されます。
指定可能なパラメータについては「適用可能なパラメータ」を参照してください。

■ 適用可能なパラメータ
CameraHeight: カメラの高さを指定します。
FarFromCenter: カメラの中央からの距離を指定します。
FadeEffectRate: マップに適用するフェードエフェクトの適用率を0~1の範囲で指定します。
[設定例]
<SuperMode7>
CameraHeight: 528
FarFromCenter: 10
FadeEffectRate: 0.5
</SuperMode7>

■ タイルに沿ったキャラクターの設定
イベントの1ページ目のEVページの一番最初のイベントコマンドを注釈にしたうえで、
注釈に以下の内容を記載することでタイルに沿ったキャラクターの設定にすることができます。
<SetSpriteMode: false>

■ 使用可能なスクリプト
SMode7_ChangeCameraHeight(カメラの高さ, 時間間隔)
カメラの高さを変更します。

SMode7_ChangeFarFromCenter(中心からの距離, 時間間隔)
カメラの中心からの距離を変更します。

SMode7_ChangeAngle(角度, 時間間隔)
カメラの中心からの距離を変更します。

SMode7_ChangeFadeEffect(フェードエフェクト適応率, 時間間隔)
マップのフェードエフェクト適応率を変更します。

【未実装機能】
次の内容は現時点で未実装になっています。
・MVアニメーション表示
・MZアニメーション左右反転
・フキダシアイコンの表示
・マップの端まで移動した場合でも画面中心にスクロールさせる機能
・360度移動機能

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。

@param DefaultParameter
@text デフォルトパラメータ
@type struct<DefaultParameterType>
@default
@desc
マップのメモ欄のパラメータについて、デフォルトで適用するパラメータを設定します。

@param OnBoatExecScript
@text 小型船乗船時実行スクリプト
@type multiline_string
@desc
小型船乗船時に実行するスクリプトを指定します。

@param OnShipExecScript
@text 大型船乗船時実行スクリプト
@type multiline_string
@desc
大型船乗船時に実行するスクリプトを指定します。

@param OnAirshipExecScript
@text 飛行船乗船時実行スクリプト
@type multiline_string
@desc
飛行船乗船時に実行するスクリプトを指定します。

@command ChangeCameraHeight
@text カメラ高さ変更
@desc
カメラの高さを変更します。

@arg CameraHeight
@text カメラ高さ
@type number
@default 744
@desc
カメラの高さを指定します。

@arg Duration
@text 時間間隔
@type number
@default 60
@desc
カメラの高さを変更する時間間隔を指定します。

@command ChangeFarFromCenter
@text カメラ中心距離変更
@desc
カメラの中心からの距離を変更します。

@arg FarFromCenter
@text カメラ中心距離
@type number
@default 0
@desc
カメラの中心からの距離を指定します。

@arg Duration
@text 時間間隔
@type number
@default 60
@desc
カメラの中心からの距離を変更する時間間隔を指定します。

@command ChangeAngle
@text カメラ角度変更
@desc
カメラの角度を変更します。

@arg Angle
@text カメラ角度
@type number
@default 0
@desc
カメラの角度を指定します。

@arg Direction
@text カメラ回転方向
@type select
@option 左
@value left
@option 右
@value right
@default left
@desc
カメラの回転方向を指定します。

@arg Duration
@text 時間間隔
@type number
@default 60
@desc
カメラの角度を変更する時間間隔を指定します。

@command ChangeFadeEffect
@text フェードエフェクト開始
@desc
フェードエフェクトの適用を開始します。

@arg Rate
@text フェードエフェクト適応率
@type number
@default 1
@min 0
@max 1
@decimals 4
@desc
フェードエフェクトの適応率を0～1の範囲で指定します。

@arg Duration
@text 時間間隔
@type number
@default 60
@desc
フェードエフェクトを適用する時間間隔を指定します。
*/
/*!/*~struct~DefaultParameterType:
@param CameraHeight
@text カメラの高さ
@type number
@default 744
@desc
カメラの高さを指定します。

@param FarFromCenter
@text 中心からの距離
@type number
@default 0
@desc
中心からの距離を指定します。

@param FadeEffectRate
@text フェードエフェクト適応率
@type number
@default 1
@min 0
@max 1
@decimals 4
@default 0
@desc
フィードエフェクトの適応率を指定します。
*/
