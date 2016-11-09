//=============================================================================
// 【武器グラフィック設定拡張】　Version: 1.01
//
// ここからリスポーン: http://respawnfromhere.blog.fc2.com/
// Twitter: https://twitter.com/ibakip
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc 武器グラフィックについて、より細かく設定できるようになります。
 * @author 【武器グラフィック設定拡張】　Version: 1.00
 *
* @help
 *
 * //=============================================================================
 * // 【武器グラフィック設定拡張】　Version: 1.01
 * //
 * // ここからリスポーン: http://respawnfromhere.blog.fc2.com/
 * // Twitter: https://twitter.com/ibakip
 * //=============================================================================
 *
 * 武器グラフィックについて、より細かく設定できるようになります。
 * 【主な機能】
 *  1. 武器グラフィックの個数制限をなくし、何枚でも導入可能にする。
 *  2. 武器、スキル、アイテムのメモ欄から個別に使用時の武器グラフィックと
 *     モーションを設定可能にする。
 *
 * 【使い方】
 *  ・武器グラフィックの導入
 *    Weapons3.pngと同じ規格の画像を、Weapons4.png、Weapons5.png、…のように、
 *    末尾の数字を１ずつずらしながらimg/systemフォルダに入れて下さい。
 *
 *    ※ Weapons3.pngの規格は、96×64の武器が横に3つ並んで1セット、
 *      それを縦に6セットまで配置した288×384の画像です。
 *       6セットすべてが埋まっている必要はなく、空でもOKです。
 *
 *  ・設定方法
 *    武器、スキル、アイテムのメモ欄に以下のオプションを記述することができます。
 *    複数記述する場合は必ず改行してください。
 *
 *    <WeaponNumber:x>
 *      x には武器が画像の何番目にあるかを示す数値を記述して下さい。
 *      （画像毎ではなく、Weapons1.pngから数えたものです。）
 *      例えばWeapons3.pngの3セット目の武器を設定する場合は、
 *      Weapons1.png、Weapons2.pngがそれぞれ12セットあるので、
 *      12 + 12 + 3 で <WeaponNumber:27>と指定します。
 *
 *    <MotionType:x>
 *      x にはモーションタイプを表す以下の数値を指定して下さい。
 *      0:突き（thrust） 1:振り（swing） 2:飛び道具(missile)
 *
 *    上記のオプションを指定しなかった場合は、すべてデフォルトの設定に従います。
 *    （武器のグラフィックとモーションはシステムタブで設定したものへ、
 *     アイテム、スキルはグラフィック無しでそれぞれ対応するモーションへ）
 *
 * 【仕様】
 *  アクターが二刀流でふたつ武器を装備している場合、通常攻撃を行う度に
 *  毎回ランダムでどちらかの武器グラフィックとモーションが採用されます。
 *
 *
 * 【プラグインコマンド】
 *  このプラグインにプラグインコマンドはありません。
 *
 * 【パラメータ】
 *  このプラグインに設定可能パラメータはありません。
 *
 * 【更新履歴】
 *  ○ Ver 1.01 （2015/12/10）
 *   ・設定が正しく反映されない問題を修正
 *
 */
 //=============================================================================


var Imported = Imported || {};
Imported.ExtendWeaponImageConfig = {};

(function(){

var weaponNumber = 0;
var motionType = null;


//-----------------------------------------------------------------------------
// Game_Actor
//-----------------------------------------------------------------------------

/* メモ欄を読みこむ処理です */
Game_Actor.prototype.inputNote = function(item) {
    var Note = item.note.split(/[\r\n]+/);
    for (var i = 0; i < Note.length; i++) {
        var line = Note[i];
        if (line.match(/<(?:WeaponNumber):(\d+)>/i)) {
            weaponNumber = parseInt(RegExp.$1);
        }
        if (line.match(/<(?:MotionType):(\d+)>/i)) {
            motionType = parseInt(RegExp.$1);
        }
    }
};

/* アクターが行動する際の処理です（再定義） */
Game_Actor.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
    var id = action._item.itemId();
    weaponNumber = 0;
    motionType = null;

    if (action.isAttack()) {
        this.performAttack();
    }
    else if (action.isGuard()) {
        this.requestMotion('guard');
    }
    else if (action.isItem()) {
        this.inputNote($dataItems[id]);
        if( motionType === null ){
            this.requestMotion('item');
        }
        else{
            if (motionType === 0) {
                this.requestMotion('thrust');
            } else if (motionType === 1) {
                this.requestMotion('swing');
            } else if (motionType === 2) {
                this.requestMotion('missile');
            }
        }
        this.startWeaponAnimation(weaponNumber);
    }
    else{
        this.inputNote($dataSkills[id]);
        if( motionType === null ){
            if(action.isMagicSkill()){
                this.requestMotion('spell');
            } else if(action.isSkill()){
                this.requestMotion('skill');
            }
        }
        else{
            if (motionType === 0) {
                this.requestMotion('thrust');
            } else if (motionType === 1) {
                this.requestMotion('swing');
            } else if (motionType === 2) {
                this.requestMotion('missile');
            }
        }
        this.startWeaponAnimation(weaponNumber);
    }
};

/* 攻撃を実行する際の処理です（再定義） */
Game_Actor.prototype.performAttack = function() {
    var weapons = this.weapons();
    var wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
    var wtypeId2 = weapons[1] ? weapons[1].wtypeId : 0;
    var attackMotion = $dataSystem.attackMotions[wtypeId];
    var rand = 0;

    console.log( Math.floor( Math.random() * 2 ) );

    if(wtypeId !== 0){
        if( wtypeId2 !== 0 ){
            this.inputNote( weapons[Math.floor( Math.random()*2 )] );
        } else{
            this.inputNote(weapons[0]);
        }
    }

    if ( weaponNumber === 0 ){
        weaponNumber = attackMotion.weaponImageId;
    }
    if ( motionType === null ){
        motionType = attackMotion.type;
    }

    if (motionType === 0) {
        this.requestMotion('thrust');
    } else if (motionType === 1) {
        this.requestMotion('swing');
    } else if (motionType === 2) {
        this.requestMotion('missile');
    }
    this.startWeaponAnimation(weaponNumber);
};


//-----------------------------------------------------------------------------
// Sprite_Weapon
//-----------------------------------------------------------------------------

/* 武器グラフィックを読み込む処理です（再定義） */
Sprite_Weapon.prototype.loadBitmap = function() {
    var pageId = 0;
    if(this._weaponImageId > 30){
        pageId = Math.floor((this._weaponImageId - 1) / 12) + 2;
    } else{
        pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
    }
    if (pageId >= 1) {
        this.bitmap = ImageManager.loadSystem('Weapons' + pageId);
    } else {
        this.bitmap = ImageManager.loadSystem('');
    }
};

/* 武器グラフィックの描画処理です（再定義） */
Sprite_Weapon.prototype.updateFrame = function() {
    if (this._weaponImageId > 0) {
        var index = 0;
        if(this._weaponImageId > 30){
            index = (this._weaponImageId - 1) % 6;
        } else{
            index = (this._weaponImageId - 1) % 12;
        }
        var w = 96;
        var h = 64;
        var sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
        var sy = Math.floor(index % 6) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};

})();