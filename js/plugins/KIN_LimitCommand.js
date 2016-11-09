//=============================================================================
// KIN_LimitCommand.js
//=============================================================================

/*:ja
 * @plugindesc リミットコマンド
 *
 * @author Agaricus_Mushroom
 *
 * @help
 *
 * バグとか要望あればよろしく。
 */

(function() {

  Window_ActorCommand.prototype.makeCommandList = function() {
      if (this._actor) {
          this.addLimitCommand();
          this.addAttackCommand();
          this.addSkillCommands();
          this.addGuardCommand();
          this.addItemCommand();
      }
  };

  Window_ActorCommand.prototype.addSkillCommands = function() {
      var skillTypes = this._actor.addedSkillTypes();
      skillTypes.sort(function(a, b) {
          return a - b;
      });
      skillTypes.forEach(function(stypeId) {
          var name = $dataSystem.skillTypes[stypeId];
          if(stypeId != 2)this.addCommand(name, 'skill', true, stypeId);
      }, this);
  };

  Window_ActorCommand.prototype.addLimitCommand = function() {
      if(this._actor.tp == 100){
        var name = $dataSystem.skillTypes[2];
        this.addCommand(name, 'skill', true, 2);
      }
  };

})();
