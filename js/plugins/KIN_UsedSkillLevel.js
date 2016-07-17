//=============================================================================
// KIN_UseSkillLevel.js
//=============================================================================

/*:ja
 * @plugindesc スキルを習得していても、職業に設定された習得レベルを満たすまで使用不能とします。
 *
 * @author Agaricus_Mushroom
 *
 * @help
 * アクター、または職業のメモ欄に以下のような記述をすると、
 * 習得スキルテーブルに存在しないスキルでも、
 * 使用可能レベルを設定することができます。
 * <UseSkillLevel>
 * skillId2:level30
 * skillId3:level34
 * </UseSkillLevel>
 * 上記の例では、スキルID2のスキルをレベル30で使用可能、
 * スキルID3のスキルをレベル34で使用可能と見なします。
 * また、文字に関しては省略可能です。つまり、
 * <UseSkillLevel>
 * 2:30
 * 3:34
 * </UseSkillLevel>
 * とすることも可能です。
 * また、idではなく名前でスキルを指定することも可能ですが、(例…ヒール:30)
 * 同じ名前のスキルが複数あった場合、
 * 必ず正しい結果が返ってくるとは限らないことに注意してください。
 *
 * バグとか要望あればよろしく。
 */

(function() {

  K_isOccasionOk = Game_BattlerBase.prototype.isOccasionOk;

  Game_BattlerBase.prototype.isOccasionOk = function(item) {
      var defaultResult = K_isOccasionOk.call(this, item);
      if(this.isActor()){
        if(this.isMeetLevel(item) == false) return false;
      }
    return defaultResult;
    /*if ($gameParty.inBattle()) {
        return item.occasion === 0 || item.occasion === 1;
    } else {
        return item.occasion === 0 || item.occasion === 2;
    }*/
  };

  Game_Actor.prototype.isMeetLevel = function(item) {
    var result = true;
    this.currentClass().learnings.forEach(function(learning) {
        if (learning.skillId == item.id && learning.level > this._level) {
            result = false;
        }
    }, this);
    if(!this.checkLearningLevel(item, this.notetags())) return false;
    if(!this.checkLearningLevel(item, this.notetags(true))) return false;
    return result;
  };

  Game_Actor.prototype.checkLearningLevel = function(item, note){
    var notes = note || new Array(0);
    for(var i = 0; i < notes.length; i++){
      if(notes[i].indexOf("<UseSkillLevel>") >= 0){
        for(var j = i + 1; j < notes.length; j++){
          if(notes[j].indexOf("</UseSkillLevel>") >= 0){
            break;
          }
          var id = notes[j].split(":")[0].replace(/[^0-9^\.]/g,"");
          var level = notes[j].split(":")[1].replace(/[^0-9^\.]/g,"");
          if(id == ""){
            id = notes[j].split(":")[0];
            if (id == item.name && level > this._level) {
                return false;
            }
          } else {
            if (id == item.id && level > this._level) {
                return false;
            }
          }
        }
      }
    }
    return true;
  };

  Game_Actor.prototype.notetags = function(isClass) {
    if(isClass){
      return this.currentClass().note.split(/[\r\n]+/);
    } else {
      return this.actor().note.split(/[\r\n]+/);
    }
  };

})();
