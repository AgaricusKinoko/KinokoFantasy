//=============================================================================
// KinokoPlugin8.js
//=============================================================================

/*:ja
 * @plugindesc 戦闘不能にならずにＨＰ１で耐える装備・ステートを作成出来ます。
 *
 * @author Agaricus_Mushroom
 *
 * @help ※再定義をするため、なるべく上の方に設置してください。
 * 
 * ～使い方～
 * 装備、もしくはステートのメモ欄に以下の記述をしてください。
 * <guts:X>
 * Xには、ＨＰ１で耐える確率を代入してください。
 * ※ステートの場合、以下の記述を追加することで、発動時に効果が切れるようになります。
 * <guts_remove:1>
 */

(function() {

var Kinoko_Die = Game_BattlerBase.prototype.die;

Game_BattlerBase.prototype.die = function() {
    this._hp = 0;
    this.clearNormalStates();
    this.clearBuffs();
};

Game_BattlerBase.prototype.clearNormalStates = function() {
    if(this.isActor()){
        for(var i = 0; i < this.equips().length; i++){
            console.log(this.equips()[i]);
            if(this.equips()[i] != null){
                var equip = this.equips()[i];
                var guts = equip.meta.guts;
                guts = parseInt(guts);
                if(!(guts>=0 || guts<=0)) guts = 0;
                if(Math.random() < (guts/100)){
                    this.setHp(1);
                    this.removeState(this.deathStateId());
                    return true;
                }
            }
        }
    }
    for(var i = 0; i < this.states().length; i++){
        var state = this.states()[i];
        var guts = state.meta.guts;
        guts = parseInt(guts);
        if(!(guts>=0 || guts<=0)) guts = 0;
        if(Math.random() < (guts/100)){
            this.setHp(1);
            var rem = state.meta.guts_remove;
            rem = parseInt(rem);
            if(!(rem>=0 || rem<=0)) rem = 0;
            if(rem == 1) this.eraseState(state.id);
            this.removeState(this.deathStateId());
            return true;
        }
    }
    this.clearStates();
};

})();