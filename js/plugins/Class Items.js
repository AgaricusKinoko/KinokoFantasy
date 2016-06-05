//====================================================================================
//
// Class Items
//
//====================================================================================
/*:
* @plugindesc Specify items to be used only by certain classes.
* @author Musashii
* 
* @help
* Use the notetag <classItem: id> in the Items Note to determine which class can 
* use it. If no notetag is set the item will be available for all.
*
* Use <onlyAffect: id> inside items Note to make it affect only the class id.
*/
//====================================================================================


var usersClass = 0;
var waitUseItem = 0;

(function() {

//===================================
// Update Counter
//===================================
var _Window_BattleLog_startTurn = Window_BattleLog.prototype.startTurn;
			
Window_BattleLog.prototype.startTurn = function() {
waitUseItem = 100
_Window_BattleLog_startTurn.call
};

//===================================
//Replace meetsItemConditions
//===================================
Game_BattlerBase.prototype.meetsItemConditions = function(item) {
 //usersClass = this._classId
  if(waitUseItem === 100){usersClass = this._classId}
  
  //can't use item in menu if any actor in party have the class
  var checkClassInParty = 0;
$gameParty.allMembers().forEach(function(entry){
  if(entry._classId == item.meta.classItem)
    checkClassInParty = 1;
});
if (item.meta.classItem === undefined){checkClassInParty = 1}
    return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item) && checkClassInParty === 1;
};

//===================================
// Get active actor's class ID + reset Counter
//===================================
var _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;

Scene_Battle.prototype.startActorCommandSelection = function() {

   usersClass = BattleManager.actor()._classId
   waitUseItem = 0
    this._statusWindow.select(BattleManager.actor().index());
    this._partyCommandWindow.close();
    this._actorCommandWindow.setup(BattleManager.actor());
       _Scene_Battle_startActorCommandSelection.call
};

//===================================
//Replace isOccasionOk
//===================================
Game_BattlerBase.prototype.isOccasionOk = function(item) {
    if ($gameParty.inBattle()) {
	if (item.meta.classItem === undefined){
        return item.occasion === 0 || item.occasion === 1;}
		else{
		if (usersClass === Number(item.meta.classItem)){
		return item.occasion === 0 || item.occasion === 1;
		}else{
		return false;
		}
		}
    } else {
        return item.occasion === 0 || item.occasion === 2;
    }
};
//===================================================================================
Game_Action.prototype.testApply = function(target) {

if(this._item._dataClass === "item" && $dataItems[this._item._itemId].meta.onlyAffect != undefined){

var classArray = this.isTeste().split(",");
var classResult = false;
for(var i = 0; i < classArray.length; i++){
    if(classArray[i] == target._classId) classResult = true;
}

return (classResult);
}
else{



    return (this.isForDeadFriend() === target.isDead() &&
            ($gameParty.inBattle() || this.isForOpponent() ||
            (this.isHpRecover() && target.hp < target.mhp) ||
            (this.isMpRecover() && target.mp < target.mmp) ||
            (this.hasItemAnyValidEffects(target))));}
};


Game_Action.prototype.isTeste = function() {
    return $dataItems[this._item._itemId].meta.onlyAffect;
};

  })();
