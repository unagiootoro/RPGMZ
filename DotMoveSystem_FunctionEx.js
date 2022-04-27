/*:
@target MV MZ
@plugindesc Dot movement system enhancement v1.3.3
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem_FunctionEx.js
@help
It is a plug-in that extends the functions of the dot movement system.
Add the following features.
・ Change player size
・ Adjustment of movement speed
・ Addition of acceleration
・ Addition of inertia
・ Press an event
・ Change of behavior when immersing in an event
・ Jump with collision detection
・ Half-square collision detection of terrain
・ Triangular mass collision detection of terrain

【How to use】
■ Change player size
Change the size of the player by setting the plug-in parameter "player information".

■ Adjustment of movement speed
You will be able to specify any movement speed.
You can also add acceleration and inertia to the movement.
・ Adjustment of movement speed
In the setting of the movement route
this.setDpf(movement speed);
Specify. The moving speed specifies the moving speed per frame.

(Example) When moving 0.01 squares per frame
this.setDpf(0.01);

If you want to cancel the movement speed adjustment and reflect the movement speed specified by the event command,
this.setDpf(null);
Specify.

■ Addition of acceleration
Acceleration is valid only when the movement speed is adjusted.
To specify the acceleration
this.setAcc(maximum acceleration, degree of influence);
Specify.

(Example) Acceleration between 20 frames, maximum acceleration at 3x speed
this.setAcc(20, 3);

■ Addition of inertia
To specify inertia
this.setInertia;
Specify.
Specify a value of 1 or more for inertia.
This value will continue to decrease every frame by the specified value from the current acceleration.
When set to 1, acceleration and inertia increase / decrease are the same.

(Example) When decelerating 2 times in 1 frame
this.setInertia(2);

■ Press an event
Add the ability to press an event.
In the memo field of the event to be pushed
<PushableEvent>
Please describe.

■ Changes in behavior when immersing yourself in an event
By setting the plugin command "ThroughIfCollided" to true
If you're into an event, make sure it slips through.

■ Jump with collision detection
Jump with collision detection.
Write the following script in the movement route setting.
this.smartJump (addition value in the X-axis direction, addition value in the Y-axis direction, maximum jump height (optional));
* The maximum jump height can be omitted. If omitted, 10 applies.
* The presence or absence of slip-through can be omitted. If omitted, no slip-through is applied.

(Example) When jumping 2 to the left and 3.5 to the top
this.smartJump (2, -3.5);

■ Half-square collision detection of terrain
By editing the plug-in parameter "HalfCollisionMassInfo"
Set the hit judgment for half a square of the terrain based on the region or terrain tag.

■ Judgment of hitting the triangular squares of the terrain
By editing the plug-in parameter "TriangleCollisionMassInfo"
Set the hit judgment to the triangular square of the terrain based on the region or terrain tag.

【License】
This plugin is available under the terms of the MIT license.


@param PlayerInfo
@text player information
@type struct<CharacterInfo>
@default {"Width":"1","Height":"1","OffsetX":"0","OffsetY":"0","SlideLengthX":"0.5","SlideLengthY":"0.5","TransferOffsetX":"0","TransferOffsetY":"0"}
@desc
Specify various information of the player.

@param FollowerInfo
@text follower information
@type struct<CharacterInfo>
@default {"Width":"1","Height":"1","OffsetX":"0","OffsetY":"0","SlideLengthX":"0.75","SlideLengthY":"0.75","TransferOffsetX":"0","TransferOffsetY":"0"}
@desc
Specify various information of followers.

@param ThroughIfCollided
@text slip through when an event collides
@type boolean
@default true
@desc
Setting true allows you to bypass conflicted events.

@param HalfCollisionMassInfo
@text Collision detection information per half square
@type struct<HalfCollisionMassInfo>
@default {"UpCollisionRegionId": "0", "RightCollisionRegionId": "0", "DownCollisionRegionId": "0", "LeftCollisionRegionId": "0", "UpRightCollisionRegionId": "0", "RightDownCollisionRegionId": "0" , "DownLeftCollisionRegionId": "0", "LeftUpCollisionRegionId": "0", "UpRightOpenCollisionRegionId": "0", "RightDownOpenCollisionRegionId": "0", "DownLeftOpenCollisionRegionId": "0", "LeftUpOpenCol" UpCollisionTerrainTagId ":" 0 "," RightCollisionTerrainTagId ":" 0 "," DownCollisionTerrainTagId ":" 0 "," LeftCollisionTerrainTagId ":" 0 "," UpRightCollisionTerrainTagId ":" 0 "," RightDownCollisionTerrainTagId ":" 0 "," RightDownCollisionTerrainTagId ":" 0 " : "0", "LeftUpCollisionTerrainTagId": "0", "UpRightOpenCollisionTerrainTagId": "0", "RightDownOpenCollisionTerrainTagId": "0", "DownLeftOpenCollisionTerrainTagId": "0", "LeftUpOpenCollisionTerrainTagId": "0", "LeftUpOpenCollisionTerrainTagId": "0"
@desc
Specify various information for half-square collision detection. Common to all types of information, if 0 is set, the setting will be invalidated.

@param TriangleCollisionMassInfo
@text Triangular cell collision detection information
@type struct<TriangleCollisionMassInfo>
@default {"LeftUpTriangleRegionId": "0", "DownLeftTriangleRegionId": "0", "RightDownTriangleRegionId": "0", "UpRightTriangleRegionId": "0", "LeftUpTriangleTerrainTagId": "0", "DownLeftTriangleTerrainTagId": "0" , "RightDownTriangleTerrainTagId": "0", "UpRightTriangleTerrainTagId": "0"}
@desc
Specify various information for collision detection of triangular squares. Common to all types of information, if 0 is set, the setting will be invalidated.
*/

/*~struct~CharacterInfo:
@param Width
@text width
@type number
@decimals 2
@default 1
@desc
Specify the width of the character.

@param Height
@text height
@type number
@decimals 2
@default 1
@desc
Specify the width of the character.

@param OffsetX
@text offset X
@type number
@decimals 2
@min -1000
@default 0
@desc
Specifies the display offset of the character along the X axis.

@param OffsetY
@text offset Y
@type number
@decimals 2
@min -1000
@default 0
@desc
Specifies the display offset in the Y-axis direction of the character.

@param SlideLengthX
@text X-axis slide length
@type number
@decimals 2
@default 0.5
@desc
Specifies the slide length of the character in the X-axis direction.

@param SlideLengthY
@text Y-axis slide length
@type number
@decimals 2
@default 0.5
@desc
Specifies the slide length of the character in the Y-axis direction.

@param TransferOffsetX
@text Offset when moving location X
@type number
@decimals 2
@min -1000
@default 0
@desc
Specifies the X coordinate offset when moving to a location.

@param TransferOffsetY
@text Offset Y when moving to another location
@type number
@decimals 2
@min -1000
@default 0
@desc
Specifies the Y coordinate offset when moving to a location.
*/


/*~struct~HalfCollisionMassInfo:
@param UpCollisionRegionId
@text Upward collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the upward collision detection.

@param RightCollisionRegionId
@text Right-hand collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the right-handed mass collision detection.

@param DownCollisionRegionId
@text Downward collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the downward mass collision detection.

@param LeftCollisionRegionId
@text Left-hand collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the left-handed mass collision detection.

@param UpRightCollisionRegionId
@text Upper right collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the mass collision detection in the upper right direction.

@param RightDownCollisionRegionId
@text Lower right collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the mass collision detection in the lower right direction.

@param DownLeftCollisionRegionId
@text Lower left collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the mass collision detection in the lower left direction.

@param LeftUpCollisionRegionId
@text Upper left collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the mass collision detection in the upper left direction.

@param UpRightOpenCollisionRegionId
@text Top right direction Free collision detection Region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the free space collision detection in the upper right direction.

@param RightDownOpenCollisionRegionId
@text Lower right collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for collision detection in the lower right direction.

@param DownLeftOpenCollisionRegionId
@text Lower left collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for collision detection in the lower left direction.

@param LeftUpOpenCollisionRegionId
@text Upper left collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the free space collision detection in the upper left direction.

@param UpCollisionRegionId
@text Upward collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the upward collision detection.

@param RightCollisionRegionId
@text Right-hand collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the right-handed mass collision detection.

@param DownCollisionRegionId
@text Downward collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the downward mass collision detection.

@param LeftCollisionRegionId
@text Left-hand collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the left-handed mass collision detection.

@param UpRightCollisionRegionId
@text Upper right collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the mass collision detection in the upper right direction.

@param RightDownCollisionRegionId
@text Lower right collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the mass collision detection in the lower right direction.

@param DownLeftCollisionRegionId
@text Lower left collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the mass collision detection in the lower left direction.

@param LeftUpCollisionRegionId
@text Upper left collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the mass collision detection in the upper left direction.

@param UpRightOpenCollisionRegionId
@text Top right direction Free collision detection Region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the free space collision detection in the upper right direction.

@param RightDownOpenCollisionRegionId
@text Lower right collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for collision detection in the lower right direction.

@param DownLeftOpenCollisionRegionId
@text Lower left collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for collision detection in the lower left direction.

@param LeftUpOpenCollisionRegionId
@text Upper left collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for the free space collision detection in the upper left direction.


@param UpCollisionTerrainTagId
@text Upward collision detection Terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for the upward collision detection.

@param RightCollisionTerrainTagId
@text Right-hand collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for collision detection in the right direction.

@param DownCollisionTerrainTagId
@text Downward collision detection Terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for the downward mass collision detection.

@param LeftCollisionTerrainTagId
@text Left-hand collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for the left-hand side collision detection.

@param UpRightCollisionTerrainTagId
@text Collision detection terrain tag ID in the upper right direction
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for the square collision detection in the upper right direction.

@param RightDownCollisionTerrainTagId
@text Lower right collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for the mass collision detection in the lower right direction.

@param DownLeftCollisionTerrainTagId
@text Lower left collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for the mass collision detection in the lower left direction.

@param LeftUpCollisionTerrainTagId
@text Upper left collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for the square collision detection in the upper left direction.

@param UpRightOpenCollisionTerrainTagId
@text Top right direction vacant collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for collision detection in the upper right direction.

@param RightDownOpenCollisionTerrainTagId
@text Lower right collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for collision detection in the lower right direction.

@param DownLeftOpenCollisionTerrainTagId
@text Lower left collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for collision detection in the lower left direction.

@param LeftUpOpenCollisionTerrainTagId
@text Upper left collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for collision detection in the upper left direction.
*/

/*~struct~TriangleCollisionMassInfo:
@param LeftUpTriangleRegionId
@text Upper left triangle collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for collision detection in the upper left direction.

@param DownLeftTriangleRegionId
@text Lower left triangle collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for collision detection in the lower left direction.

@param RightDownTriangleRegionId
@text Lower right triangle collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID for collision detection in the lower right direction.

@param UpRightTriangleRegionId
@text Upper right triangle collision detection region ID
@type number
@min 0
@default 0
@desc
Set the region ID of the triangle collision detection in the upper right direction.


@param LeftUpTriangleTerrainTagId
@text Upper left collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for collision detection in the upper left direction.

@param DownLeftTriangleTerrainTagId
@text Lower left collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for collision detection in the lower left direction.

@param RightDownTriangleTerrainTagId
@text Lower right collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for collision detection in the lower right direction.

@param UpRightTriangleTerrainTagId
@text Upper right triangle collision detection terrain tag ID
@type number
@min 0
@default 0
@desc
Set the terrain tag ID for collision detection in the upper right triangle direction.
*/

/*:ja
@target MV MZ
@plugindesc ドット移動システム機能拡張 v1.3.3
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/DotMoveSystem_FunctionEx.js
@help
ドット移動システムの機能を拡張するプラグインです。
次の機能を追加します。
・プレイヤーサイズの変更
・移動速度の調整
・加速度の追加
・慣性の追加
・イベントを押す
・イベントめり込み時の挙動の変更
・当たり判定付きジャンプ
・地形の半マス当たり判定
・地形の三角マス当たり判定

【使用方法】
■ プレイヤーサイズの変更
プラグインパラメータ「プレイヤー情報」の設定によりプレイヤーのサイズを変更します。

■ 移動速度の調整
任意の移動速度を指定できるようになります。
また、移動に加速度と慣性をつけることができます。
・移動速度の調整
移動ルートの設定で
this.setDpf(移動速度);
と指定します。移動速度は1フレーム当たりの移動速度を指定します。

(例) 1フレーム当たり0.01マス移動する場合
this.setDpf(0.01);

なお、移動速度の調整をキャンセルしてイベントコマンドで指定する移動速度を反映する場合、
this.setDpf(null);
と指定します。

■ 加速度の追加
加速度は移動速度の調整を行っている場合のみ有効になります。
加速度を指定するには、
this.setAcc(最大加速度, 影響度);
と指定します。

(例) 20フレーム間加速、最高加速で3倍速の場合
this.setAcc(20, 3);

■ 慣性の追加
慣性を指定するには
this.setInertia(慣性);
と指定します。
慣性には1以上の値を指定してください。
この値が現在の加速度から指定した値だけ毎フレーム減り続けることになります。
1を設定した場合は加速と慣性の増減は同じになります。

(例) 1フレームに2減速する場合
this.setInertia(2);

■ イベントを押す
イベントを押す機能を追加します。
押される側のイベントのメモ欄に
<PushableEvent>
と記載してください。

■ イベントめり込み時の挙動の変更
プラグインコマンド「ThroughIfCollided」をtrueに設定することで、
イベントにめり込んでいる場合はそのイベントはすり抜けられるようにします。

■ 当たり判定付きジャンプ
当たり判定付きでジャンプを行います。
移動ルートの設定で以下のスクリプトを記述します。
this.smartJump(X軸方向の加算値, Y軸方向の加算値, 最大のジャンプする高さ(省略可));
※最大のジャンプする高さは省略可能です。省略した場合、10が適用されます。
※すり抜け有無は省略可能です。省略した場合、すり抜け無しが適用されます。

(例) 左方向に2、上方向に3.5ジャンプさせる場合
this.smartJump(2, -3.5);

■ 地形の半マス当たり判定
プラグインパラメータ「HalfCollisionMassInfo」を編集することで、
リージョンまたは地形タグをもとに地形の半マスに当たり判定を設定します。

■ 地形の三角マス当たり判定
プラグインパラメータ「TriangleCollisionMassInfo」を編集することで、
リージョンまたは地形タグをもとに地形の三角マスに当たり判定を設定します。

【ライセンス】
このプラグインは、MITライセンスの条件の下で利用可能です。


@param PlayerInfo
@text プレイヤー情報
@type struct<CharacterInfo>
@default {"Width":"1","Height":"1","OffsetX":"0","OffsetY":"0","SlideLengthX":"0.5","SlideLengthY":"0.5","TransferOffsetX":"0","TransferOffsetY":"0"}
@desc
プレイヤーの各種情報を指定します。

@param FollowerInfo
@text フォロワー情報
@type struct<CharacterInfo>
@default {"Width":"1","Height":"1","OffsetX":"0","OffsetY":"0","SlideLengthX":"0.75","SlideLengthY":"0.75","TransferOffsetX":"0","TransferOffsetY":"0"}
@desc
フォロワーの各種情報を指定します。

@param ThroughIfCollided
@text イベント衝突時すり抜け
@type boolean
@default true
@desc
trueを設定すると衝突済みのイベントをすり抜けられるようになります。

@param HalfCollisionMassInfo
@text 半マス当たり判定情報
@type struct<HalfCollisionMassInfo>
@default {"UpCollisionRegionId":"0","RightCollisionRegionId":"0","DownCollisionRegionId":"0","LeftCollisionRegionId":"0","UpRightCollisionRegionId":"0","RightDownCollisionRegionId":"0","DownLeftCollisionRegionId":"0","LeftUpCollisionRegionId":"0","UpRightOpenCollisionRegionId":"0","RightDownOpenCollisionRegionId":"0","DownLeftOpenCollisionRegionId":"0","LeftUpOpenCollisionRegionId":"0","UpCollisionTerrainTagId":"0","RightCollisionTerrainTagId":"0","DownCollisionTerrainTagId":"0","LeftCollisionTerrainTagId":"0","UpRightCollisionTerrainTagId":"0","RightDownCollisionTerrainTagId":"0","DownLeftCollisionTerrainTagId":"0","LeftUpCollisionTerrainTagId":"0","UpRightOpenCollisionTerrainTagId":"0","RightDownOpenCollisionTerrainTagId":"0","DownLeftOpenCollisionTerrainTagId":"0","LeftUpOpenCollisionTerrainTagId":"0"}
@desc
半マス当たり判定の各種情報を指定します。各種情報共通で、0が設定された場合は設定を無効化します。

@param TriangleCollisionMassInfo
@text 三角マス当たり判定情報
@type struct<TriangleCollisionMassInfo>
@default {"LeftUpTriangleRegionId":"0","DownLeftTriangleRegionId":"0","RightDownTriangleRegionId":"0","UpRightTriangleRegionId":"0","LeftUpTriangleTerrainTagId":"0","DownLeftTriangleTerrainTagId":"0","RightDownTriangleTerrainTagId":"0","UpRightTriangleTerrainTagId":"0"}
@desc
三角マス当たり判定の各種情報を指定します。各種情報共通で、0が設定された場合は設定を無効化します。
*/

/*~struct~CharacterInfo:ja
@param Width
@text 横幅
@type number
@decimals 2
@default 1
@desc
キャラクターの横幅を指定します。

@param Height
@text 縦幅
@type number
@decimals 2
@default 1
@desc
キャラクターの横幅を指定します。

@param OffsetX
@text オフセットX
@type number
@decimals 2
@min -1000
@default 0
@desc
キャラクターのX軸方向の表示オフセットを指定します。

@param OffsetY
@text オフセットY
@type number
@decimals 2
@min -1000
@default 0
@desc
キャラクターのY軸方向の表示オフセットを指定します。

@param SlideLengthX
@text X軸スライド長
@type number
@decimals 2
@default 0.5
@desc
キャラクターのX軸方向のスライド長を指定します。

@param SlideLengthY
@text Y軸スライド長
@type number
@decimals 2
@default 0.5
@desc
キャラクターのY軸方向のスライド長を指定します。

@param TransferOffsetX
@text 場所移動時X座標オフセット
@type number
@decimals 2
@min -1000
@default 0
@desc
場所移動時のX座標オフセットを指定します。

@param TransferOffsetY
@text 場所移動時Y座標オフセット
@type number
@decimals 2
@min -1000
@default 0
@desc
場所移動時のY座標オフセットを指定します。
*/

/*~struct~HalfCollisionMassInfo:ja
@param UpCollisionRegionId
@text 上方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
上方向のマス当たり判定のリージョンIDを設定します。

@param RightCollisionRegionId
@text 右方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右方向のマス当たり判定のリージョンIDを設定します。

@param DownCollisionRegionId
@text 下方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
下方向のマス当たり判定のリージョンIDを設定します。

@param LeftCollisionRegionId
@text 左方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左方向のマス当たり判定のリージョンIDを設定します。

@param UpRightCollisionRegionId
@text 右上方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右上方向のマス当たり判定のリージョンIDを設定します。

@param RightDownCollisionRegionId
@text 右下方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右下方向のマス当たり判定のリージョンIDを設定します。

@param DownLeftCollisionRegionId
@text 左下方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左下方向のマス当たり判定のリージョンIDを設定します。

@param LeftUpCollisionRegionId
@text 左上方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左上方向のマス当たり判定のリージョンIDを設定します。

@param UpRightOpenCollisionRegionId
@text 右上方向空き当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右上方向の空きマス当たり判定のリージョンIDを設定します。

@param RightDownOpenCollisionRegionId
@text 右下方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右下方向の空きマス当たり判定のリージョンIDを設定します。

@param DownLeftOpenCollisionRegionId
@text 左下方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左下方向の空きマス当たり判定のリージョンIDを設定します。

@param LeftUpOpenCollisionRegionId
@text 左上方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左上方向の空きマス当たり判定のリージョンIDを設定します。

@param UpCollisionRegionId
@text 上方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
上方向のマス当たり判定のリージョンIDを設定します。

@param RightCollisionRegionId
@text 右方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右方向のマス当たり判定のリージョンIDを設定します。

@param DownCollisionRegionId
@text 下方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
下方向のマス当たり判定のリージョンIDを設定します。

@param LeftCollisionRegionId
@text 左方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左方向のマス当たり判定のリージョンIDを設定します。

@param UpRightCollisionRegionId
@text 右上方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右上方向のマス当たり判定のリージョンIDを設定します。

@param RightDownCollisionRegionId
@text 右下方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右下方向のマス当たり判定のリージョンIDを設定します。

@param DownLeftCollisionRegionId
@text 左下方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左下方向のマス当たり判定のリージョンIDを設定します。

@param LeftUpCollisionRegionId
@text 左上方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左上方向のマス当たり判定のリージョンIDを設定します。

@param UpRightOpenCollisionRegionId
@text 右上方向空き当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右上方向の空きマス当たり判定のリージョンIDを設定します。

@param RightDownOpenCollisionRegionId
@text 右下方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右下方向の空きマス当たり判定のリージョンIDを設定します。

@param DownLeftOpenCollisionRegionId
@text 左下方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左下方向の空きマス当たり判定のリージョンIDを設定します。

@param LeftUpOpenCollisionRegionId
@text 左上方向当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左上方向の空きマス当たり判定のリージョンIDを設定します。



@param UpCollisionTerrainTagId
@text 上方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
上方向のマス当たり判定の地形タグIDを設定します。

@param RightCollisionTerrainTagId
@text 右方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
右方向のマス当たり判定の地形タグIDを設定します。

@param DownCollisionTerrainTagId
@text 下方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
下方向のマス当たり判定の地形タグIDを設定します。

@param LeftCollisionTerrainTagId
@text 左方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
左方向のマス当たり判定の地形タグIDを設定します。

@param UpRightCollisionTerrainTagId
@text 右上方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
右上方向のマス当たり判定の地形タグIDを設定します。

@param RightDownCollisionTerrainTagId
@text 右下方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
右下方向のマス当たり判定の地形タグIDを設定します。

@param DownLeftCollisionTerrainTagId
@text 左下方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
左下方向のマス当たり判定の地形タグIDを設定します。

@param LeftUpCollisionTerrainTagId
@text 左上方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
左上方向のマス当たり判定の地形タグIDを設定します。

@param UpRightOpenCollisionTerrainTagId
@text 右上方向空き当たり判定地形タグID
@type number
@min 0
@default 0
@desc
右上方向の空きマス当たり判定の地形タグIDを設定します。

@param RightDownOpenCollisionTerrainTagId
@text 右下方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
右下方向の空きマス当たり判定の地形タグIDを設定します。

@param DownLeftOpenCollisionTerrainTagId
@text 左下方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
左下方向の空きマス当たり判定の地形タグIDを設定します。

@param LeftUpOpenCollisionTerrainTagId
@text 左上方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
左上方向の空きマス当たり判定の地形タグIDを設定します。
*/

/*~struct~TriangleCollisionMassInfo:ja
@param LeftUpTriangleRegionId
@text 左上三角当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左上方向の三角マス当たり判定のリージョンIDを設定します。

@param DownLeftTriangleRegionId
@text 左下三角当たり判定リージョンID
@type number
@min 0
@default 0
@desc
左下方向の三角マス当たり判定のリージョンIDを設定します。

@param RightDownTriangleRegionId
@text 右下三角当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右下方向の三角マス当たり判定のリージョンIDを設定します。

@param UpRightTriangleRegionId
@text 右上三角当たり判定リージョンID
@type number
@min 0
@default 0
@desc
右上方向の三角マス当たり判定のリージョンIDを設定します。


@param LeftUpTriangleTerrainTagId
@text 左上方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
左上方向の三角マス当たり判定の地形タグIDを設定します。

@param DownLeftTriangleTerrainTagId
@text 左下方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
左下方向の三角マス当たり判定の地形タグIDを設定します。

@param RightDownTriangleTerrainTagId
@text 右下方向当たり判定地形タグID
@type number
@min 0
@default 0
@desc
右下方向の三角マス当たり判定の地形タグIDを設定します。

@param UpRightTriangleTerrainTagId
@text 右上三角当たり判定地形タグID
@type number
@min 0
@default 0
@desc
右上三角方向の三角マス当たり判定の地形タグIDを設定します。
*/

const DotMoveSystem_FunctionExPluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];

(() => {
"use strict";

const { CharacterCollisionChecker, FollowerCollisionChecker } = DotMoveSystemClassAlias;
const { DotMoveUtils, CollisionResult, CharacterController, CharacterMover, PlayerMover } = DotMoveSystemClassAlias;

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
            if (param.match(/^\-?\d+\.\d+$/)) return parseFloat(param);
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
}


const typeDefine = {
    PlayerInfo: {},
    FollowerInfo: {},
    HalfCollisionMassInfo: {},
    TriangleCollisionMassInfo: {},
};
const PP = PluginParamsParser.parse(PluginManager.parameters(DotMoveSystem_FunctionExPluginName), typeDefine);


/*
 * ● 定数定義
 */
const LEFT_UP_TRIANGLE_ID = 13;
const DOWN_LEFT_TRIANGLE_ID = 14;
const RIGHT_DOWN_TRIANGLE_ID = 15;
const UP_RIGHT_TRIANGLE_ID = 16;

const START_TRIANGLE_ID = 13;
const END_TRIANGLE_ID = 16;

/*
 * ● 初期化処理
 */
const _CharacterMover_initialize = CharacterMover.prototype.initialize;
CharacterMover.prototype.initialize = function(character) {
    _CharacterMover_initialize.call(this, character);
    this._lastDirection = character.direction();
    this._changeDirectionCount = 0;
    this._direction8 = this._character.direction();
};

const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this._dpf = null;
    this._acceleration = 0;
    this._inertia = 1;
    this._accelerationPlus = null;
    this._maxAcceleration = null;
    this._jumpXPlus = null;
    this._jumpYPlus = null;
};


const _Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
    _Game_Player_initMembers.call(this);
    this._width = PP.PlayerInfo.Width;
    this._height = PP.PlayerInfo.Height;
    this._offsetX = PP.PlayerInfo.OffsetX;
    this._offsetY = PP.PlayerInfo.OffsetY;
    this._slideLengthX = PP.PlayerInfo.SlideLengthX;
    this._slideLengthY = PP.PlayerInfo.SlideLengthY;
    this._transferOffsetX = PP.PlayerInfo.TransferOffsetX == null ? 0 : PP.PlayerInfo.TransferOffsetX;
    this._transferOffsetY = PP.PlayerInfo.TransferOffsetX == null ? 0 : PP.PlayerInfo.TransferOffsetX;
    this._enableTransferOffset = true;
};


const _Game_Follower_initMembers = Game_Follower.prototype.initMembers;
Game_Follower.prototype.initMembers = function() {
    _Game_Follower_initMembers.call(this);
    this._width = PP.FollowerInfo.Width;
    this._height = PP.FollowerInfo.Height;
    this._offsetX = PP.FollowerInfo.OffsetX;
    this._offsetY = PP.FollowerInfo.OffsetY;
    this._slideLengthX = PP.FollowerInfo.SlideLengthX;
    this._slideLengthY = PP.FollowerInfo.SlideLengthY;
    this._transferOffsetX = PP.FollowerInfo.TransferOffsetX == null ? 0 : PP.FollowerInfo.TransferOffsetX;
    this._transferOffsetY = PP.FollowerInfo.TransferOffsetX == null ? 0 : PP.FollowerInfo.TransferOffsetX;
};

/*
 * ● 更新処理
 */
const _CharacterMover_update = CharacterMover.prototype.update;
CharacterMover.prototype.update = function() {
    _CharacterMover_update.call(this);
    // TODO: 斜め慣性処理を実装する
    // this.updateChangeDirection();
};

const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
    if (this.isJumping() && this.isSmartJumping()) this.updateSmartJump();
    if (this.isNeedUpdateAcceleration()) this.updateAcceleration();
    this.updateCurrentDpf();
    _Game_CharacterBase_update.call(this);
};

/*
 * ● プレイヤーサイズの変更機能
 */
const CharacterInfo = {
    width() {
        return this._width;
    },

    height() {
        return this._height;
    },

    offsetX() {
        return this._offsetX;
    },

    offsetY() {
        return this._offsetY;
    },

    slideLengthX() {
        return this._slideLengthX;
    },

    slideLengthY() {
        return this._slideLengthY;
    },
};

Object.assign(Game_Player.prototype, CharacterInfo);
Object.assign(Game_Follower.prototype, CharacterInfo);

Game_Player.prototype.setEnableTransferOffset = function(bool) {
    this._enableTransferOffset = bool;
};

const _Game_Player_reserveTransfer = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
    _Game_Player_reserveTransfer.call(this, mapId, x, y, d, fadeType);
    this._newX = x + this._transferOffsetX;
    this._newY = y + this._transferOffsetY;
};

/*
 * ● 移動速度の調整
 */
CharacterMover.prototype.updateChangeDirection = function() {
    if (!this._reserveChangeDirection) return;
    const direction = this._lastDirection;
    if (direction !== this._character.direction()) {
        this._changeDirectionCount++;
        if (this._changeDirectionCount >= 3) {
            this._reserveChangeDirection = false;
            const deg = DotMoveUtils.direction2deg(direction);
            const direction4 = DotMoveUtils.deg2direction4(deg, this._character.direction());
            this.setDirection8(direction);
            this.setDirection(direction4);
            this._reserveSetDirection = null;
        }
    }
};


CharacterMover.prototype.setDirection8 = function(direction8) {
    this._direction8 = direction8;
};

CharacterMover.prototype.direction8 = function() {
    return this._direction8;
};

const _CharacterMover_dotMoveByDeg = CharacterMover.prototype.dotMoveByDeg;
CharacterMover.prototype.dotMoveByDeg = function(deg, opt = { changeDir: true }) {
    if (opt.changeDir) {
        const direction = DotMoveUtils.deg2direction(deg);
        this.changeDirectionWhenDotMove(direction);
    }
    _CharacterMover_dotMoveByDeg.call(this, deg);
};

const _CharacterMover_dotMoveByDirection = CharacterMover.prototype.dotMoveByDirection;
CharacterMover.prototype.dotMoveByDirection = function(direction, opt = { changeDir: true }) {
    if (opt.changeDir) {
        this.changeDirectionWhenDotMove(direction);
    }
    _CharacterMover_dotMoveByDirection.call(this, direction);
};

CharacterMover.prototype.changeDirectionWhenDotMove = function(direction) {
    if (this._lastDirection !== direction) {
        this._lastDirection = direction;
        this._changeDirectionCount = 0;
        this._reserveChangeDirection = true;
        this.setDirection8(direction);
        const deg = DotMoveUtils.direction2deg(direction);
        const direction4 = DotMoveUtils.deg2direction4(deg, this._character.direction());
        this.setDirection(direction4);
    }
};


Game_CharacterBase.prototype.originDistancePerFrame = Game_CharacterBase.prototype.distancePerFrame;

Game_CharacterBase.prototype.distancePerFrame = function() {
    if (this._dpf == null) return this.originDistancePerFrame();
    if (this.isNeedUpdateAcceleration() && this._moverData.targetCount > 1) return this.originDistancePerFrame();
    return this._currentDpf;
};

Game_CharacterBase.prototype.updateCurrentDpf = function() {
    const dashMul = this._dashing ? 2 : 1;
    if (this.isNeedUpdateAcceleration()) {
        const acc = 1 + this._acceleration / this._maxAcceleration * this._accelerationPlus;
        this._currentDpf = this._dpf * acc * dashMul;
    } else {
        this._currentDpf = this._dpf * dashMul;
    }
};

Game_CharacterBase.prototype.setDpf = function(dpf) {
    this._dpf = dpf;
};

Game_CharacterBase.prototype.setAcc = function(maxAcc, accPlus) {
    this._maxAcceleration = maxAcc;
    this._accelerationPlus = accPlus;
};

Game_CharacterBase.prototype.setInertia = function(inertia) {
    this._inertia = inertia;
};

Game_CharacterBase.prototype.isNeedUpdateAcceleration = function() {
    return this._dpf != null && this._maxAcceleration != null && this._accelerationPlus != null;
};

Game_CharacterBase.prototype.updateAcceleration = function() {
    if ($gameMap.isEventRunning()) {
        this.cancelAcceleration();
    } else {
        if (this.isMoved()) {
            if (this._acceleration < this._maxAcceleration) {
                this._acceleration++;
            }
        } else {
            if (this._acceleration > 0) {
                this._acceleration -= this._inertia;
                if (this._acceleration < 0) this._acceleration = 0;
                this.mover().dotMoveByDirection(this.mover().direction8(), { changeDir: false });
            }
        }
    }
};

Game_CharacterBase.prototype.cancelAcceleration = function() {
    this._acceleration = 0;
};


Game_Player.prototype.distancePerFrame = function() {
    if (this.isInVehicle()) return this.originDistancePerFrame();
    return Game_CharacterBase.prototype.distancePerFrame.call(this);
};

Game_Player.prototype.isNeedUpdateAcceleration = function() {
    if (this.isInVehicle()) return false;
    return Game_CharacterBase.prototype.isNeedUpdateAcceleration.call(this);
};


Game_Follower.prototype.distancePerFrame = function() {
    if ($gamePlayer.isInVehicle()) return this.originDistancePerFrame();
    return Game_CharacterBase.prototype.distancePerFrame.call(this);
};

Game_Follower.prototype.isNeedUpdateAcceleration = function() {
    if ($gamePlayer.isInVehicle()) return false;
    return Game_CharacterBase.prototype.isNeedUpdateAcceleration.call(this);
};

Game_Follower.prototype.changeFollowerSpeed = function(precedingCharacterFar) {
    if ($gamePlayer.distancePerFrame()) {
        this.setDpf(this.calcFollowerDpf(precedingCharacterFar));
    } else {
        this.setDpf(null);
        this.setMoveSpeed(this.calcFollowerSpeed(precedingCharacterFar));
    }
};

Game_Follower.prototype.calcFollowerDpf = function(precedingCharacterFar) {
    if (precedingCharacterFar >= 2) {
        return $gamePlayer.distancePerFrame() * 2;
    } else if (precedingCharacterFar >= 1.5) {
        return $gamePlayer.distancePerFrame();
    } else if (precedingCharacterFar >= 1) {
        return $gamePlayer.distancePerFrame() / 2;
    } else {
        return 0;
    }
};


const _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function() {
    _Scene_Map_callMenu.call(this);
    $gamePlayer.cancelAcceleration();
};

/*
 * ● イベントを押す
 */
const _PlayerMover_moveProcess = PlayerMover.prototype.moveProcess;
PlayerMover.prototype.moveProcess = function() {
    // プレイヤー移動の前にイベントを動かし、その後でプレイヤーを動かす
    this.eventPushProcess();
    _PlayerMover_moveProcess.call(this);
};

PlayerMover.prototype.eventPushProcess = function() {
    const x = this._character._realX;
    const y = this._character._realY;
    const width = this._character.width();
    const height = this._character.height();
    const dpf = this._character.distancePerFrame();
    const margin = dpf / 2;
    const dir = this._character.direction();
    const dis = DotMoveUtils.calcDistance(DotMoveUtils.direction2deg(dir), dpf);
    const x2 = x + dis.x;
    const y2 = y + dis.y;
    for (const event of DotMoveUtils.enteringMassesEvents(x2, y2, width, height)) {
        if (!event.event().meta.PushableEvent) continue;
        const result = this.checkCharacter(x2, y2, dir, event);
        if (!(result && result.collisionLengthX() >= margin && result.collisionLengthY() >= margin)) continue;
        event.mover().dotMoveByDirection(dir);
    }
};

/*
 * ● イベントと既に衝突している場合、そのイベントはすり抜けられるようにする
 */
CharacterCollisionChecker.prototype.checkEventsPrepare = function(notCollisionEventIds) {
    const collidedEvents = [];
    const x = this._character._realX;
    const y = this._character._realY;
    const width = this._character.width();
    const height = this._character.height();
    const margin = this._character.distancePerFrame();
    const events = DotMoveUtils.enteringMassesEvents(x, y, width, height);
    for (const event of events) {
        if (event.isNormalPriority() && !event.isThrough() && !notCollisionEventIds.includes(event.eventId())) {
            const result = this.checkCharacter(x, y, this._character.direction(), event);
            if (result && result.collisionLengthX() >= margin && result.collisionLengthY() >= margin) collidedEvents.push(event);
        }
    }
    return collidedEvents.map(event => event.eventId());
};

const _CharacterCollisionChecker_checkEvents = CharacterCollisionChecker.prototype.checkEvents;
CharacterCollisionChecker.prototype.checkEvents = function(x, y, d, notCollisionEventIds = []) {
    if (PP.ThroughIfCollided) {
        const collidedEventIds = this.checkEventsPrepare(notCollisionEventIds);
        notCollisionEventIds = notCollisionEventIds.concat(collidedEventIds);
    }
    return _CharacterCollisionChecker_checkEvents.call(this, x, y, d, notCollisionEventIds)
};

FollowerCollisionChecker.prototype.checkEventsPrepare = function(notCollisionEventIds) {
    return [];
};

/*
 * ● 当たり判定付きジャンプ
 */
Game_CharacterBase.prototype.smartJump = function(xPlus, yPlus, baseJumpPeak = 10) {
    this._jumpXPlus = xPlus;
    this._jumpYPlus = yPlus;
    if (Math.abs(xPlus) > Math.abs(yPlus)) {
        if (xPlus !== 0) {
            this.setDirection(xPlus < 0 ? 4 : 6);
        }
    } else {
        if (yPlus !== 0) {
            this.setDirection(yPlus < 0 ? 8 : 2);
        }
    }
    const distance = Math.round(Math.sqrt(xPlus**2 + yPlus**2));
    this._jumpPeak = baseJumpPeak + distance - this._moveSpeed;
    this._jumpCount = this._jumpPeak * 2;
    this.resetStopCount();
    this.straighten();
};

Game_CharacterBase.prototype.smartJumpAbs = function(x, y, baseJumpPeak = 10) {
    const xPlus = x - this._realX;
    const yPlus = y - this._realY;
    this.smartJump(xPlus, yPlus, baseJumpPeak);
};


Game_CharacterBase.prototype.isSmartJumping = function() {
    return this._jumpXPlus != null && this._jumpYPlus != null;
};

const _Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
Game_CharacterBase.prototype.updateJump = function() {
    if (!this.isSmartJumping()) _Game_CharacterBase_updateJump.call(this);
};

Game_CharacterBase.prototype.updateSmartJump = function() {
    this._jumpCount--;
    const x = this._realX + this._jumpXPlus / (this._jumpPeak * 2);
    const y = this._realY + this._jumpYPlus / (this._jumpPeak * 2);
    const dis = { x: x - this._realX, y: y - this._realY };
    this.mover()._controller.dotMoveByDistance(this.direction(), dis);
    if (this._jumpCount === 0) {
        this._jumpXPlus = null;
        this._jumpYPlus = null;
        this.setPosition(this._realX, this._realY);
    }
};


/*
 * ● 半マス通行判定設定
 */
CharacterCollisionChecker.prototype.getMassRects = function(x, y) {
    switch (this.getMassCollisionType(x, y)) {
    case 1:
        return [{ x: x, y: y, width: 1, height: 0.5 }];
    case 2:
        return [{ x: x + 0.5, y: y, width: 0.5, height: 1 }];
    case 3:
        return [{ x: x, y: y + 0.5, width: 1, height: 0.5 }];
    case 4:
        return [{ x: x, y: y, width: 0.5, height: 1 }];
    case 5:
        return [{ x: x + 0.5, y: y, width: 0.5, height: 0.5 }];
    case 6:
        return [{ x: x + 0.5, y: y + 0.5, width: 0.5, height: 0.5 }];
    case 7:
        return [{ x: x, y: y + 0.5, width: 0.5, height: 0.5 }];
    case 8:
        return [{ x: x, y: y, width: 0.5, height: 0.5 }];
    case 9:
        return [{ x: x, y: y, width: 0.5, height: 1 }, { x: x + 0.5, y: y + 0.5, width: 0.5, height: 0.5 }];
    case 10:
        return [{ x: x, y: y, width: 0.5, height: 1 }, { x: x + 0.5, y: y, width: 0.5, height: 0.5 }];
    case 11:
        return [{ x: x + 0.5, y: y, width: 0.5, height: 1 }, { x: x, y: y, width: 0.5, height: 0.5 }];
    case 12:
        return [{ x: x + 0.5, y: y, width: 0.5, height: 1 }, { x: x, y: y + 0.5, width: 0.5, height: 0.5 }];
    }
    return [{ x: x, y: y, width: 1, height: 1 }];
};

CharacterCollisionChecker.prototype.getMassCollisionType = function(x, y) {
    const regionId = $gameMap.regionId(x, y);
    const terrainTag = $gameMap.terrainTag(x, y);
    if (regionId > 0) {
        switch (regionId) {
        case PP.HalfCollisionMassInfo.UpCollisionRegionId:
            return 1;
        case PP.HalfCollisionMassInfo.RightCollisionRegionId:
            return 2;
        case PP.HalfCollisionMassInfo.DownCollisionRegionId:
            return 3;
        case PP.HalfCollisionMassInfo.LeftCollisionRegionId:
            return 4;
        case PP.HalfCollisionMassInfo.UpRightCollisionRegionId:
            return 5;
        case PP.HalfCollisionMassInfo.RightDownCollisionRegionId:
            return 6;
        case PP.HalfCollisionMassInfo.DownLeftCollisionRegionId:
            return 7;
        case PP.HalfCollisionMassInfo.LeftUpCollisionRegionId:
            return 8;
        case PP.HalfCollisionMassInfo.UpRightOpenCollisionRegionId:
            return 9;
        case PP.HalfCollisionMassInfo.RightDownOpenCollisionRegionId:
            return 10;
        case PP.HalfCollisionMassInfo.DownLeftOpenCollisionRegionId:
            return 11;
        case PP.HalfCollisionMassInfo.LeftUpOpenCollisionRegionId:
            return 12;
        case PP.TriangleCollisionMassInfo.LeftUpTriangleRegionId:
            return LEFT_UP_TRIANGLE_ID;
        case PP.TriangleCollisionMassInfo.DownLeftTriangleRegionId:
            return DOWN_LEFT_TRIANGLE_ID;
        case PP.TriangleCollisionMassInfo.RightDownTriangleRegionId:
            return RIGHT_DOWN_TRIANGLE_ID;
        case PP.TriangleCollisionMassInfo.UpRightTriangleRegionId:
            return UP_RIGHT_TRIANGLE_ID;
        }
    }
    if (terrainTag > 0) {
        switch (terrainTag) {
        case PP.HalfCollisionMassInfo.UpCollisionTerrainTagId:
            return 1;
        case PP.HalfCollisionMassInfo.RightCollisionTerrainTagId:
            return 2;
        case PP.HalfCollisionMassInfo.DownCollisionTerrainTagId:
            return 3;
        case PP.HalfCollisionMassInfo.LeftCollisionTerrainTagId:
            return 4;
        case PP.HalfCollisionMassInfo.UpRightCollisionTerrainTagId:
            return 5;
        case PP.HalfCollisionMassInfo.RightDownCollisionTerrainTagId:
            return 6;
        case PP.HalfCollisionMassInfo.DownLeftCollisionTerrainTagId:
            return 7;
        case PP.HalfCollisionMassInfo.LeftUpCollisionTerrainTagId:
            return 8;
        case PP.HalfCollisionMassInfo.UpRightOpenCollisionTerrainTagId:
            return 9;
        case PP.HalfCollisionMassInfo.RightDownOpenCollisionTerrainTagId:
            return 10;
        case PP.HalfCollisionMassInfo.DownLeftOpenCollisionTerrainTagId:
            return 11;
        case PP.HalfCollisionMassInfo.LeftUpOpenCollisionTerrainTagId:
            return 12;
        case PP.TriangleCollisionMassInfo.LeftUpTriangleTerrainTagId:
            return LEFT_UP_TRIANGLE_ID;
        case PP.TriangleCollisionMassInfo.DownLeftTriangleTerrainTagId:
            return DOWN_LEFT_TRIANGLE_ID;
        case PP.TriangleCollisionMassInfo.RightDownTriangleTerrainTagId:
            return RIGHT_DOWN_TRIANGLE_ID;
        case PP.TriangleCollisionMassInfo.UpRightTriangleTerrainTagId:
            return UP_RIGHT_TRIANGLE_ID;
        }
    }
    return 0;
};

CharacterCollisionChecker.prototype.checkCollisionMass = function(targetRect, d, ix, iy) {
    const results = [];
    const massRects = this.getMassRects(ix, iy);
    if (!this.checkPassMass(ix, iy, d)) {
        for (const massRect of massRects) {
            const result = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, massRect);
            if (result) results.push(result);
        }
    }
    return results;
}

CharacterCollisionChecker.prototype.checkPassMass = function(x, y, d) {
    const x2 = $gameMap.roundX(x);
    const y2 = $gameMap.roundY(y);
    if (!$gameMap.isValid(x2, y2)) {
        return false;
    }
    if (this._character.isThrough() || this._character.isDebugThrough()) {
        return true;
    }

    if (this.getMassCollisionType(x2, y2) >= 1 && this.getMassCollisionType(x2, y2) <= END_TRIANGLE_ID) {
        return false;
    }
    const prevPoint = DotMoveUtils.prevPointWithDirection({ x: x2, y: y2 }, d);
    if (this.getMassCollisionType(prevPoint.x, prevPoint.y) >= 1 && this.getMassCollisionType(prevPoint.x, prevPoint.y) <= END_TRIANGLE_ID) {
        return true;
    }

    if (this.isMassCollisionNoTarget(x, y, d)) return true;
    if (!this._character.isMapPassable(prevPoint.x, prevPoint.y, d)) {
        return false;
    }
    return true;
};

const _CharacterCollisionChecker_checkCollisionXCliff = CharacterCollisionChecker.prototype.checkCollisionXCliff;
CharacterCollisionChecker.prototype.checkCollisionXCliff = function(targetRect, x1, x2, iy, d) {
    if (this.getMassCollisionType(x1, iy) >= 1 && this.getMassCollisionType(x1, iy) <= END_TRIANGLE_ID && this.getMassCollisionType(x2, iy) >= 1 && this.getMassCollisionType(x2, iy) <= END_TRIANGLE_ID) {
        return [];
    }
    return _CharacterCollisionChecker_checkCollisionXCliff.call(this, targetRect, x1, x2, iy, d);
};

const _CharacterCollisionChecker_checkCollisionYCliff = CharacterCollisionChecker.prototype.checkCollisionYCliff;
CharacterCollisionChecker.prototype.checkCollisionYCliff = function(targetRect, y1, y2, ix, d) {
    if (this.getMassCollisionType(ix, y1) >= 1 && this.getMassCollisionType(ix, y1) <= END_TRIANGLE_ID && this.getMassCollisionType(ix, y2) >= 1 && this.getMassCollisionType(ix, y2) <= END_TRIANGLE_ID) {
        return [];
    }
    return _CharacterCollisionChecker_checkCollisionYCliff.call(this, targetRect, y1, y2, ix, d);
};

/*
 * ● 三角マス通行判定設定
 */
Object.defineProperty(CollisionResult, "triangleType", {
    get: function() {
        return this._triangleType;
    },
    set: function(_triangleType) {
        this._triangleType = _triangleType;
    },
    configurable: true
});

DotMoveUtils.calcMassTriangle = function(id, characterRect, direction, ix, iy) {
    switch (id) {
    case LEFT_UP_TRIANGLE_ID:
        if (direction === 8) {
            const dx = characterRect.x - ix;
            const h = 1 - dx;
            return new Rectangle(ix, iy, 1, h);
        } else if (direction === 4) {
            const dy = characterRect.y - iy;
            let w = 1 - dy;
            return new Rectangle(ix, iy, w, 1);
        }
        break;
    case DOWN_LEFT_TRIANGLE_ID:
        if (direction === 2) {
            const dx = characterRect.x - ix;
            const h = 1 - dx;
            return new Rectangle(ix, iy + (1 - h), 1, h);
        } else if (direction === 4) {
            const dy = (characterRect.y + characterRect.height) - iy;
            const w = dy;
            return new Rectangle(ix, iy, w, 1);
        }
        break;
    case RIGHT_DOWN_TRIANGLE_ID:
        if (direction === 6) {
            const dy = (characterRect.y + characterRect.height) - iy;
            const w = dy;
            return new Rectangle(ix + (1 - w), iy, w, 1);
        } else if (direction === 2) {
            const dx = (characterRect.x + characterRect.width) - ix;
            const h = dx;
            return new Rectangle(ix, iy + (1 - h), 1, h);
        }
        break;
    case UP_RIGHT_TRIANGLE_ID:
        if (direction === 8) {
            const dx = (characterRect.x + characterRect.width) - ix;
            const h = dx;
            return new Rectangle(ix, iy, 1, h);
        } else if (direction === 6) {
            const dy = characterRect.y - iy;
            const w = 1 - dy;
            return new Rectangle(ix + (1 - w), iy, w, 1);
        }
        break;
    }
    throw new Error(`Calc triangle failed. (id=${id}, direction=${direction})`);
};

const _CharacterCollisionChecker_checkCollisionCliff = CharacterCollisionChecker.prototype.checkCollisionCliff;
CharacterCollisionChecker.prototype.checkCollisionCliff = function(targetRect, x1, y1, x2, y2, d) {
    for (let ix = x1; ix < x2; ix++) {
        for (let iy = y1; iy < y2; iy++) {
            const id = $gameMap.regionId(ix, iy);
            if (id >= START_TRIANGLE_ID && id <= END_TRIANGLE_ID) return [];
        }
    }
    return _CharacterCollisionChecker_checkCollisionCliff.call(this, targetRect, x1, y1, x2, y2, d);
};

const _CharacterCollisionChecker_checkCollisionMass = CharacterCollisionChecker.prototype.checkCollisionMass;
CharacterCollisionChecker.prototype.checkCollisionMass = function(targetRect, d, ix, iy) {
    const id = this.getMassCollisionType(ix, iy);

    if (this.checkPassMass(ix, iy, d)) return [];

    if (id === LEFT_UP_TRIANGLE_ID) {
        return this.checkCollisionMassLeftUp(targetRect, d, ix, iy);
    } else if (id === DOWN_LEFT_TRIANGLE_ID) {
        return this.checkCollisionMassDownLeft(targetRect, d, ix, iy);
    } else if (id === RIGHT_DOWN_TRIANGLE_ID) {
        return this.checkCollisionMassRightDown(targetRect, d, ix, iy);
    } else if (id === UP_RIGHT_TRIANGLE_ID) {
        return this.checkCollisionMassUpRight(targetRect, d, ix, iy);
    } else {
        return _CharacterCollisionChecker_checkCollisionMass.call(this, targetRect, d, ix, iy);
    }
};

CharacterCollisionChecker.prototype.checkCollisionMassLeftUp = function(targetRect, d, ix, iy) {
    const massRect = new Rectangle(ix, iy, 1, 1);
    const result = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, massRect);
    if (!result) return [];
    const pos = this._character.positionPoint();
    if (d === 8) {
        if (pos.x < ix) {
            result.triangleType = 1;
            return [result];
        } else {
            const rect = DotMoveUtils.calcMassTriangle(LEFT_UP_TRIANGLE_ID, targetRect, d, ix, iy);
            const result2 = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, rect);
            if (!result2) return [];
            result2.triangleType = 1;
            return [result2];
        }
    } else if (d === 6) {
        if (pos.x < ix) {
            return [result];
        } else {
            return [];
        }
    } else if (d === 2) {
        if (pos.y < iy) {
            return [result];
        } else {
            return [];
        }
    } else if (d === 4) {
        if (pos.y < iy) { 
            result.triangleType = 1;
            return [result];
        } else {
            const rect = DotMoveUtils.calcMassTriangle(LEFT_UP_TRIANGLE_ID, targetRect, d, ix, iy);
            const result2 = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, rect);
            if (!result2) return [];
            result2.triangleType = 1;
            return [result2];
        }
    }
};

CharacterCollisionChecker.prototype.checkCollisionMassDownLeft = function(targetRect, d, ix, iy) {
    const massRect = new Rectangle(ix, iy, 1, 1);
    const result = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, massRect);
    if (!result) return [];
    const pos = this._character.positionPoint();
    if (d === 8) {
        if (pos.y + this._character.height() < iy + 1) {
            return [];
        } else {
            return [result];
        }
    } else if (d === 6) {
        if (pos.x < ix) {
            return [result];
        } else {
            return [];
        }
    } else if (d === 2) {
        if (pos.x < ix) { 
            result.triangleType = 2;
            return [result];
        } else {
            const rect = DotMoveUtils.calcMassTriangle(DOWN_LEFT_TRIANGLE_ID, targetRect, d, ix, iy);
            const result2 = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, rect);
            if (!result2) return [];
            result2.triangleType = 2;
            return [result2];
        }
    } else if (d === 4) {
        if (pos.y + this._character.height() > iy + 1) { 
            result.triangleType = 2;
            return [result];
        } else {
            const rect = DotMoveUtils.calcMassTriangle(DOWN_LEFT_TRIANGLE_ID, targetRect, d, ix, iy);
            const result2 = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, rect);
            if (!result2) return [];
            result2.triangleType = 2;
            return [result2];
        }
    }
};

CharacterCollisionChecker.prototype.checkCollisionMassRightDown = function(targetRect, d, ix, iy) {
    const massRect = new Rectangle(ix, iy, 1, 1);
    const result = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, massRect);
    if (!result) return [];
    const pos = this._character.positionPoint();
    if (d === 8) {
        if (pos.y + this._character.height() < iy + 1) {
            return [];
        } else {
            return [result];
        }
    } else if (d === 6) {
        if (pos.y + this._character.height() > iy + 1) { 
            result.triangleType = 3;
            return [result];
        } else {
            const rect = DotMoveUtils.calcMassTriangle(RIGHT_DOWN_TRIANGLE_ID, targetRect, d, ix, iy);
            const result2 = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, rect);
            if (!result2) return [];
            result2.triangleType = 3;
            return [result2];
        }
    } else if (d === 2) {
        if (pos.x + this._character.width() > ix + 1) {
            result.triangleType = 3;
            return [result];
        } else {
            const rect = DotMoveUtils.calcMassTriangle(RIGHT_DOWN_TRIANGLE_ID, targetRect, d, ix, iy);
            const result2 = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, rect);
            if (!result2) return [];
            result2.triangleType = 3;
            return [result2];
        }
    } else if (d === 4) {
        if (pos.x + this._character.width() > ix + 1) {
            return [result];
        } else {
            return [];
        }
    }
};

CharacterCollisionChecker.prototype.checkCollisionMassUpRight = function(targetRect, d, ix, iy) {
    const massRect = new Rectangle(ix, iy, 1, 1);
    const result = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, massRect);
    if (!result) return [];
    const pos = this._character.positionPoint();
    if (d === 8) {
        if (pos.x + this._character.width() >= ix + 1) {
            result.triangleType = 4;
            return [result];
        } else {
            const rect = DotMoveUtils.calcMassTriangle(UP_RIGHT_TRIANGLE_ID, targetRect, d, ix, iy);
            const result2 = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, rect);
            if (!result2) return [];
            result2.triangleType = 4;
            return [result2];
        }
    } else if (d === 6) {
        if (pos.y < iy) { 
            result.triangleType = 4;
            return [result];
        } else {
            const rect = DotMoveUtils.calcMassTriangle(UP_RIGHT_TRIANGLE_ID, targetRect, d, ix, iy);
            const result2 = this.checkCollidedRectOverComplement(this._character._realX, this._character._realY, d, targetRect, rect);
            if (!result2) return [];
            result2.triangleType = 4;
            return [result2];
        }
    } else if (d === 2) {
        if (pos.y > iy) {
            return [];
        } else {
            return [result];
        }
    } else if (d === 4) {
        if (pos.x + this._character.width() > ix + 1) {
            return [result];
        } else {
            return [];
        }
    }
};

CharacterController.prototype.calcUp = function(dis) {
    const target = this._character.collisionRect();
    const collisionResults = this.checkCollision(target.x, target.y + dis.y, 8);

    if (collisionResults.length >= 1) {
        if (collisionResults.every(res => res.triangleType === 1)) {
            let dis2 = this.calcDistance(45);
            return this.calcUpRightWithSlide(dis2);
        } else if (collisionResults.every(res => res.triangleType === 4)) {
            let dis2 = this.calcDistance(315);
            return this.calcLeftUpWithSlide(dis2);
        }
    }

    if (this.canSlide(collisionResults, 4)) {
        return this.calcLeftUpWithSlide(dis);
    } else if (this.canSlide(collisionResults, 6)) {
        return this.calcUpRightWithSlide(dis);
    }
    if (dis.x < 0) {
        return this.calcLeftUpWithoutSlide(dis);
    } else {
        return this.calcUpRightWithoutSlide(dis);
    }
};

CharacterController.prototype.calcRight = function(dis) {
    const target = this._character.collisionRect();
    const collisionResults = this.checkCollision(target.x + dis.x, target.y, 6);

    if (collisionResults.length >= 1) {
        if (collisionResults.every(res => res.triangleType === 4)) {
            let dis2 = this.calcDistance(135);
            return this.calcRightDownWithSlide(dis2);
        } else if (collisionResults.every(res => res.triangleType === 3)) {
            let dis2 = this.calcDistance(45);
            return this.calcUpRightWithSlide(dis2);
        }
    }

    if (this.canSlide(collisionResults, 8)) {
        return this.calcUpRightWithSlide(dis);
    } else if (this.canSlide(collisionResults, 2)) {
        return this.calcRightDownWithSlide(dis);
    }
    if (dis.y < 0) {
        return this.calcUpRightWithoutSlide(dis);
    } else {
        return this.calcRightDownWithoutSlide(dis);
    }
};

CharacterController.prototype.calcDown = function(dis) {
    const target = this._character.collisionRect();
    const collisionResults = this.checkCollision(target.x, target.y + dis.y, 2);

    if (collisionResults.length >= 1) {
        if (collisionResults.every(res => res.triangleType === 2)) {
            let dis2 = this.calcDistance(135);
            return this.calcRightDownWithSlide(dis2);
        } else if (collisionResults.every(res => res.triangleType === 3)) {
            let dis2 = this.calcDistance(225);
            return this.calcDownLeftWithSlide(dis2);
        }
    }

    if (this.canSlide(collisionResults, 4)) {
        return this.calcDownLeftWithSlide(dis);
    } else if (this.canSlide(collisionResults, 6)) {
        return this.calcRightDownWithSlide(dis);
    }
    if (dis.x < 0) {
        return this.calcDownLeftWithoutSlide(dis);
    } else {
        return this.calcRightDownWithoutSlide(dis);
    }
};

CharacterController.prototype.calcLeft = function(dis) {
    const target = this._character.collisionRect();
    const collisionResults = this.checkCollision(target.x + dis.x, target.y, 4);

    if (collisionResults.length >= 1) {
        if (collisionResults.every(res => res.triangleType === 1)) {
            let dis2 = this.calcDistance(225);
            return this.calcDownLeftWithSlide(dis2);
        } else if (collisionResults.every(res => res.triangleType === 2)) {
            let dis2 = this.calcDistance(315);
            return this.calcLeftUpWithSlide(dis2);
        }
    }

    if (this.canSlide(collisionResults, 8)) {
        return this.calcLeftUpWithSlide(dis);
    } else if (this.canSlide(collisionResults, 2)) {
        return this.calcDownLeftWithSlide(dis);
    }
    if (dis.y < 0) {
        return this.calcLeftUpWithoutSlide(dis);
    } else {
        return this.calcDownLeftWithoutSlide(dis);
    }
};

})();
