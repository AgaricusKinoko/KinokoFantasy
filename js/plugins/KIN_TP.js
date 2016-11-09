//=============================================================================
// KIN_TP.js
//=============================================================================

/*:ja
 * @plugindesc 得TPのなんか
 *
 * @author Agaricus_Mushroom
 *
 * @help
 *
 * バグとか要望あればよろしく。
 */

(function() {

  Game_Action.prototype.executeHpDamage = function(target, value) {
      if (this.isDrain()) {
          value = Math.min(target.hp, value);
      }
      this.makeSuccess(target);
      target.gainHp(-value);
      if (value > 0) {
          console.log(this._gainTpValue)
          target.onDamage(value, this._gainTpValue);
      }
      this.gainDrainedHp(value);
  };

  Game_Battler.prototype.onDamage = function(value, tpValue) {
      this.removeStatesByDamage();
      this.chargeTpByDamage(value / this.mhp, tpValue);
  };

  Game_Battler.prototype.chargeTpByDamage = function(damageRate, tpValue) {
      console.log(tpValue);
      var value = Math.floor(50 * damageRate * this.tcr);
      this.gainSilentTp(value);
  };

  Game_Action.prototype.applyItemUserEffect = function(target) {
      var value = Math.floor(this.item().tpGain * this.subject().tcr);
      this._gainTpValue = value;
      console.log(this._gainTpValue)
      this.subject().gainSilentTp(value);
  };

})();
