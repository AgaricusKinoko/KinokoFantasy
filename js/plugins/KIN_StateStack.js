//=============================================================================
// KIN_StateStack.js
//=============================================================================

/*:ja
 * @plugindesc スタックするステートを作成できます。
 *
 * @author Agaricus_Mushroom
 *
 * @param displayStack
 * @desc 現在のスタック数を表示するか
 * (true=表示する false=表示しない)
 * @default true
 *
 * @param stackFor1
 * @desc スタックを適用するメモ欄のパラメータ。
 * 【1を100%とするもの】
 * @default
 *
 * @param stackFor100
 * @desc スタックを適用するメモ欄のパラメータ。
 * 【100を100%とするもの】
 * @default
 *
 * @param stackForAdd1
 * @desc スタックを適用するメモ欄のパラメータ。
 * 【1を100%とするもので、加算するもの】
 * @default
 *
 * @param stackForAdd100
 * @desc スタックを適用するメモ欄のパラメータ。
 * 【100を100%とするもので、加算するもの】
 * @default
 *
 * @help ※再定義複数あり
 * 既にそのステートが付与された状態で同じステートを付与した際に、スタックして効果が加算されます。
 * ステートのメモ欄に以下の記述をすることで、ステートをスタックさせることが出来ます。
 * <stackMax:x>
 * x=スタック上限
 * <defaultStack:x>
 * x=スタック初期値。省略時は1になります
 * <addMinStack:x>
 * x=スタック加算最小値。省略時は0になります
 * （スタックが増加する際に、ここで指定した数値を下回っていた場合は、指定した数値になります）
 * ※xにはJavaScriptコードを記述することも可能です。自身を指す場合は、「a.hp」のように、aを記述します。
 *
 * 基本的にスタックで効果が上昇するのは、ステートの「特徴」だけです。
 * メモ欄のパラメータもスタックで効果を上昇させたい場合、プラグインのパラメータに記述することで、
 * スタックを適用させることが出来ます。
 * たとえば、ダメージを1.2倍にする<addDamage:1.2>というようなメモが書かれていた場合、
 * パラメータの「stackFor1」に、「addDamage」と記述します。
 *
 * スタックしたステートは、基本的に減少することはありません。減少させたい場合、
 * ステートのメモ欄に以下の記述をします。
 * <stackDecrease:skillApply>………スキル（アイテム）実行時に、スタックを１減少させます。
 * いずれの場合でも、スタックが0になった時点でステートが解除されます。
 *
 * 【スキル側の設定】
 * <decreaseState:id,id,id...>………スキル（アイテム）実行時に、特定ステートのスタックを１減少させます。
 * id=ステートid　カンマで区切って複数の指定が可能
 * <setStack:id:x>………指定したステートのスタック数を変更します。
 * id=ステートid　x=スタック数　カンマで区切って複数の指定が可能
 * ※xにはJavaScriptコードを記述することも可能です。自身を指す場合は、「a.hp」のように、aを記述します。
 * 　また、現在のスタック数を指す場合は、stackと記述します。（例：<setStack:2:stack-3>………2番のステートのスタック数を3減少させる）
 * <requirement:id:x>………スキルの使用条件（満たしていないと使用できない）
 * id=ステートid x=スタック数
 * （setStackと組み合わせて使用すると良いでしょう）
 *
 * バグとか要望あればよろしく。
 */

(function() {

var Game_Battler_prototype_initMembers = Game_Battler.prototype.initMembers;
var Game_Battler_prototype_addState = Game_Battler.prototype.addState;
var Game_Battler_prototype_removeState = Game_Battler.prototype.removeState;
var Game_BattlerBase_prototype_allTraits = Game_BattlerBase.prototype.allTraits;
var Game_BattlerBase_prototype_states = Game_BattlerBase.prototype.states;
var Game_Action_prototype_apply = Game_Action.prototype.apply;
var Window_Base_drawActorIcons = Window_Base.prototype.drawActorIcons;
var Game_BattlerBase_prototype_isOccasionOk = Game_BattlerBase.prototype.isOccasionOk;
var Game_BattlerBase_prototype_clearStates = Game_BattlerBase.prototype.clearStates;

var parameters = PluginManager.parameters('KIN_StateStack');
var displayStack = Boolean(parameters['displayStack'] || true);
var stackFor1 = String(parameters['stackFor1'] || "").split(",");
var stackFor100 = String(parameters['stackFor100'] || "").split(",");
var stackForAdd1 = String(parameters['stackForAdd1'] || "").split(",");
var stackForAdd100 = String(parameters['stackForAdd100'] || "").split(",");

var backAction;

BattleManager_endAction = BattleManager.endAction;
BattleManager.endAction = function() {
    BattleManager_endAction.call(this);
    var subject = this._subject;
    if(backAction && backBattler){
      var item = backAction;
      var a = backBattler;
      var setArray = item.meta.setStack.split(/:|,/);
      for(var i = 0; i < setArray.length; i+=2){
          for(var j = 0; j < a._stackState.length; j++){
              if(a._stackState[j].id == setArray[i]){
                  var stack = a._stackState[j].stackCount;
                  a._stackState[j].stackCount = parseInt(eval(setArray[i+1]));
                  if(a._stackState[j].stackCount > parseInt(eval($dataStates[a._stackState[j].id].meta.stackMax))){ a._stackState[j].stackCount = parseInt(eval($dataStates[a._stackState[j].id].meta.stackMax)); }
                  if(a._stackState[j].stackCount <= 0){ a.removeState(a._stackState[i].id); }
              }
          }
      }
    }
    backAction = null;
    backBattler = null;
};

Game_BattlerBase.prototype.isOccasionOk = function(item) {
    var battler = this;
    if(item.meta.requirement){
        var useArray = item.meta.requirement.split(":");
        if(!battler._stackState) return false;
        for(var i = 0; i < battler._stackState.length; i++){
            if(battler._stackState[i].id == useArray[0]){
                if(battler._stackState[i].stackCount >= useArray[1]){
                    return Game_BattlerBase_prototype_isOccasionOk.call(this, item);
                } else {
                    return false;
                }
            }
        }
        return false;
    }
    return Game_BattlerBase_prototype_isOccasionOk.call(this, item);
};

Game_Battler.prototype.initMembers = function() {
    Game_Battler_prototype_initMembers.call(this);
    this._stackState = new Array();
};

Game_Battler.prototype.addState = function(stateId) {
    Game_Battler_prototype_addState.call(this, stateId);
    if(!this._stackState) this._stackState = new Array();
    var battler = this;
    var state = $dataStates[stateId];
    var a = this;
    if(state.meta.stackMax){
        for(var i = 0; i < battler._stackState.length; i++){
            if(battler._stackState[i].id == stateId){
                if(battler._stackState[i].stackCount < parseInt(eval(state.meta.stackMax))){
                    var addMinStack = state.meta.addMinStack || 0;
                    if(battler._stackState[i].stackCount < parseInt(eval(addMinStack))){
                        battler._stackState[i].stackCount = parseInt(eval(addMinStack));
                    } else {
                        battler._stackState[i].stackCount++;
                    }
                    if(state.meta.after_stateS){
                      nextState = state.meta.after_stateS.split(":");
                      if(battler._stackState[i].stackCount >= nextState[0]){
                        battler.removeState(stateId);
                        if(nextState[1] == 1){
                          battler.setHp(0);
                        } else {
                          battler.addState(nextState[1]);
                        }
                      }
                    }
                }
                return;
            }
        }
        for(var i = 0; i < battler._stackState.length; i++){
            if(battler._stackState[i].id == 0){
                battler.stackState[i].id = stateId;
                var defualtStack = state.meta.defaultStack || 1;
                battler._stackState[i].stackCount = parseInt(eval(defaultStack));
                if(battler._stackState[i].stackCount > parseInt(eval(state.meta.stackMax))) battler._stackState[i].stackCount = parseInt(eval(state.meta.stackMax));
                if(battler._stackState[i].stackCount == 0) battler.removeState(battler._stackState[i].id);
                return;
            }
        }
        var obj = {
            id: stateId,
            stackCount: 1
        };
        battler._stackState.push(obj);
    }
};

Game_Battler.prototype.removeState = function(stateId) {
    Game_Battler_prototype_removeState.call(this, stateId);
    this.resetStack(stateId);
};

Game_Battler.prototype.getStack = function(stateId) {
    var stack = null;
    this._stackState.forEach(function(state){
      if(state.id == stateId) stack = state.stackCount;
    });
    return stack;
}

Game_Battler.prototype.resetStack = function(stateId) {
    var battler = this;
    var state = $dataStates[stateId];
    if(!this._stackState) this._stackState = new Array();
    var state = $dataStates[stateId];
    if(state && state.meta.stackMax){
        for(var i = 0; i < battler._stackState.length; i++){
            if(battler._stackState[i].id == stateId){
                battler._stackState[i].id == 0;
                battler._stackState[i].stackCount = 0;
                return;
            }
        }
    }
};

Game_BattlerBase.prototype.clearStates = function() {
    Game_BattlerBase_prototype_clearStates.call(this);
    if(this._stackState) this._stackState = null;
};

function clone(objects){
    var obj = new Array();
    for(var i = 0; i < objects.length; i++){
        var f = function(){};
        f.prototype = objects[i];
        obj.push(new f);
    }
    return obj;
}
Game_BattlerBase.prototype.allTraits = function() {
    var battler = this;
    var stackTest = new Array();
    var index = 0;
    var a = this;
    var traitsArray = this.traitObjects().reduce(function(r, obj) {
        if(battler._stackState && obj.meta.stackMax){
            var state = battler._stackState.filter(function(item, index){
                if (item.id == obj.id) return true;
            });
            if(state[0]){
                obj.traits.forEach(function(o){
                    var test = {
                        index:index,
                        stack:state[0].stackCount
                    };
                    stackTest.push(test);
                    index++;
                });
            }
        }
        return r.concat(obj.traits);
    }, []);
    var returnArray = traitsArray;
    returnArray = JSON.parse(JSON.stringify(returnArray));
    /*returnArray.forEach(function(ar){
      ar.value = JSON.parse(JSON.stringify(ar.value));
    });*/
    stackTest.forEach(function(st){
        if(st.index >= 0){
            var stackValue = returnArray[st.index].value;
            if(stackValue < 0){
              stackValue *= st.stack;
            } else if(stackValue > 1){
                stackValue = stackValue - 1;
                stackValue *= st.stack;
                stackValue += 1;
            } else {
                stackValue = 1 - stackValue;
                stackValue *= st.stack;
                stackValue = 1 - stackValue;
            }
            returnArray[st.index].value = stackValue;
        }
    });
    return returnArray;
};

Game_BattlerBase.prototype.states = function() {
    var battler = this;
    var array = Game_BattlerBase_prototype_states.call(this);
    var returnArray = array;
    returnArray.forEach(function(ar){
      ar.meta = JSON.parse(JSON.stringify(ar.meta));
    });
    var a = this;
    for(var i = 0; i < returnArray.length; i++){
        if(battler._stackState && returnArray[i].meta.stackMax){
            var arrayMeta = returnArray[i].meta;
            for(var key in arrayMeta){
                var value = arrayMeta[key];
                if(arrayMeta.hasOwnProperty(key)){
                  for(var j = 0; j < stackFor1.length; j++){
                      if(key == stackFor1[j]){
                          for(var k = 0; k < battler._stackState.length; k++){
                              if(battler._stackState[k].id == returnArray[i].id){
                                if(value < 0){
                                  value *= battler._stackState[k].stackCount;
                                }else if(value > 1){
                                      value = value - 1;
                                      value *= battler._stackState[k].stackCount;
                                      value += 1;
                                  } else {
                                      value = 1 - value;
                                      value *= battler._stackState[k].stackCount;
                                      value = 1 - value;
                                  }
                                  eval("returnArray[i].meta."+key+"=value");
                                  break;
                              }
                          }
                      }
                  }
                  for(var j = 0; j < stackFor100.length; j++){
                      if(key == stackFor100[j]){
                          for(var k = 0; k < battler._stackState.length; k++){
                              if(battler._stackState[k].id == returnArray[i].id){
                                  if(value < 0){
                                    value *= battler._stackState[k].stackCount;
                                  }else if(value > 100){
                                      value = value - 100;
                                      value *= battler._stackState[k].stackCount;
                                      value += 100;
                                  } else {
                                      value = 100 - value;
                                      value *= battler._stackState[k].stackCount;
                                      value = 100 - value;
                                  }
                                  eval("returnArray[i].meta."+key+"=value");
                                  break;
                              }
                          }
                      }
                  }
                  for(var j = 0; j < stackForAdd1.length; j++){
                      if(key == stackForAdd1[j]){
                          for(var k = 0; k < battler._stackState.length; k++){
                              if(battler._stackState[k].id == returnArray[i].id){
                                  value *= battler._stackState[k].stackCount;
                                  eval("returnArray[i].meta."+key+"=value");
                                  break;
                              }
                          }
                      }
                  }
                    for(var j = 0; j < stackForAdd100.length; j++){
                        if(key == stackForAdd100[j]){
                            for(var k = 0; k < battler._stackState.length; k++){
                                if(battler._stackState[k].id == returnArray[i].id){
                                    value *= battler._stackState[k].stackCount;
                                    eval("returnArray[i].meta."+key+"=value");
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return returnArray;
};

Game_Action.prototype.apply = function(target){
    Game_Action_prototype_apply.call(this, target);
    var a = this.subject();
    var item = this.item();
    if(item.meta.decreaseState){
        var decArray = item.meta.decreaseState.split(",");
        decArray.forEach(function(dec){
            for(var i = 0; i < a._stackState.length; i++){
                if(a._stackState[i].id == dec){
                    if(a._stackState[i].stackCount > 0){ a._stackState[i].stackCount--; }
                    if(a._stackState[i].stackCount == 0){ a.removeState(a._stackState[i].id); }
                }
            }
        });
    }
    if(item.meta.setStack){
        backBattler = this.subject();
        backAction = item;
    }
    a.states().forEach(function(state){
        if(state.meta.stackMax && state.meta.stackDecrease == "skillApply"){
            for(var i = 0; i < battler._stackState.length; i++){
                if(battler._stackState[i].id == state.id){
                    if(battler._stackState[i].stackCount > 0){ battler._stackState[i].stackCount--; }
                    if(battler._stackState[i].stackCount == 0){ a.removeState(state.id); }
                }
            }
        }
    });
};


Window_Base.prototype.drawActorIcons = function (actor, x, y, width) {
    Window_Base_drawActorIcons.call(this, actor, x, y, width);
    if(displayStack){
        var stacks = [];
        var i = 0;

        actor.states().forEach(function (state) {
            if(actor._stackState){
                var states = actor._stackState.filter(function(item, index){
                    if (item.id == state.id) return true;
                });
                if(states && states.length > 0){
                    stacks.push(states[0].stackCount);
                } else {
                    stacks.push(0);
                }
            }
            i++;
        }, this);
        this.contents.fontSize = 16;

        for (var i = 0; i < actor.allIcons().length; i++) {
            if (stacks[i] && stacks[i] != 0 ){
                this.changeTextColor(this.crisisColor());
                this.drawText(stacks[i], this.stacksDisplayPosX(i,x), this.stacksDisplayPosY(y), Window_Base._iconWidth, 'center');
            }
        }

        this.resetFontSettings();
    }
};

Window_Base.prototype.stacksDisplayPosX = function (i, x) {
    return x + (Window_Base._iconWidth * i) - (Window_Base._iconWidth / 6) + 15;
};

Window_Base.prototype.stacksDisplayPosY = function (y) {
    return y - (Window_Base._iconWidth / 6);
};

})();
