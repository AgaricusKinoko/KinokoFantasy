//=============================================================================
// KIN_StateParamPlus.js
//=============================================================================

/*:ja
 * @plugindesc ステートの効果で能力値を固定値で上昇させます。
 *
 * @author Agaricus_Mushroom
 *
 * @help
 * ～使い方～
 * ステートのメモ欄に以下の記述をします。
 *
 * <mhp:x> : 最大HPをx上昇
 * <mmp:x> : 最大MPをx上昇
 * <atk:x> : 攻撃力をx上昇
 * <def:x> : 防御力をx上昇
 * <mat:x> : 魔法力をx上昇
 * <mdf:x> : 魔法防御をx上昇
 * <agi:x> : 敏捷性をx上昇
 * <luk:x> : 運をx上昇
 *
 * ※xには負の値も使用出来ます。
 *
 * バグとか要望あればよろしく。
 */

(function() {

  var Game_BattlerBase_prototype_paramPlus = Game_BattlerBase.prototype.paramPlus;
  Game_BattlerBase.prototype.paramPlus = function(paramId) {
      var value = Game_BattlerBase_prototype_paramPlus.call(this, paramId);
      var a = this;
      this.states().forEach(function(state){
        if(state.meta.mhp && paramId == 0){
          value += parseInt(eval(state.meta.mhp)) || 0;
        }
        if(state.meta.mhpMag && paramId == 0){
          value = parseInt(value * eval(state.meta.mhpMag) || 1);
          console.log(value * eval(state.meta.mhpMag));
        }
        if(state.meta.mmp && paramId == 1){
          value += parseInt(eval(state.meta.mmp)) || 0;
        }
        if(state.meta.mmpMag && paramId == 1){
          value = parseInt(value * eval(state.meta.mmpMag) || 1);
        }
        if(state.meta.atk && paramId == 2){
          value += parseInt(eval(state.meta.atk)) || 0;
        }
        if(state.meta.atkMag && paramId == 2){
          value = parseInt(value * eval(state.meta.atkMag) || 1);
        }
        if(state.meta.def && paramId == 3){
          value += parseInt(eval(state.meta.def)) || 0;
        }
        if(state.meta.defMag && paramId == 3){
          value = parseInt(value * eval(state.meta.defMag) || 1);
        }
        if(state.meta.mat && paramId == 4){
          value += parseInt(eval(state.meta.mat)) || 0;
        }
        if(state.meta.matMag && paramId == 4){
          value = parseInt(value * eval(state.meta.matMag) || 1);
        }
        if(state.meta.mdf && paramId == 5){
          value += parseInt(eval(state.meta.mdf)) || 0;
        }
        if(state.meta.mdfMag && paramId == 5){
          value = parseInt(value * eval(state.meta.mdfMag) || 1);
        }
        if(state.meta.agi && paramId == 6){
          value += parseInt(eval(state.meta.agi)) || 0;
        }
        if(state.meta.agiMag && paramId == 6){
          value = parseInt(value * eval(state.meta.agiMag) || 1);
        }
        if(state.meta.luk && paramId == 7){
          value += parseInt(eval(state.meta.luk)) || 0;
        }
        if(state.meta.lukMag && paramId == 7){
          value = parseInt(value * eval(state.meta.lukMag) || 1);
        }
      });
      return value;
  };

})();
