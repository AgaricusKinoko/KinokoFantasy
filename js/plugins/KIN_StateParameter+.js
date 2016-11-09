//=============================================================================
// KIN_StateParameter+.js
//=============================================================================

/*:ja
 * @plugindesc ステートのプロパティを増やします。
 *
 * @author Agaricus_Mushroom
 *
 * @help ～プラグイン導入前の注意～
 * きぎぬ様のKGN_HitMinusEvaを使用している場合、
 * このプラグインはKGN_HitMinusEvaより下に配置してください。
 * （このプラグインが多分潰されるので）
 *
 * ～使い方～
 * ステートのメモ欄に以下の記述をします。
 *
 * <cause_physical:x>
 * 物理ダメージをx％上昇させます。
 * 例：<cause_physical:50>
 *
 * <cause_magical:x>
 * 物理ダメージをx％上昇させます。
 * 例：<cause_magical:50>
 *
 * <cause_elements:n:x>
 * n属性のダメージをx％上昇させます。
 * 例：<cause_elements:8:50>
 * 「,」で区切って複数の属性も指定出来ます。
 * 例：<cause_elements:2:50,3:-50>
 * （炎属性のダメージを５０％上昇させ、氷属性のダメージを５０％減少させる。）
 *
 * ※xには負の値も使用出来ます。
 *
 * <after_stateA:x>
 * ステートの自動解除タイミングでID「x」のステートを付与します。
 * 例：<after_stateA:1>
 * （自然に効果が切れると戦闘不能になる。死の宣告のようなもの）
 *
 * <after_stateD:x>
 * ステートのダメージ解除タイミングでID「x」のステートを付与します。
 * 例：<after_stateA:1>
 * （このステートにかかった状態でダメージを受けると戦闘不能になる。）
 *
 * <state_remove:"PARAMETER","PROPERTY",x>
 * ステートの解除条件を増やします。具体的には、"PROPATY"に判定する値を記述し、xに解除条件を記述します。
 * 【"PARAMETER"に入る値】
 * 　・HP…HP
 * 　・MP…MP
 * 【"PROPERTY"に入る値】
 * 　・OVER…x以上
 * 　・BELOW…x以下
 * xには割合値が入ります。
 * 例：<state_remove:HP,OVER,100%>
 * ＨＰが全快になると効果が解除されるステート
 *
 * ～注意～
 * 上昇、減少は合算です。
 * 例えば、物理ダメージを５０％上昇させるステートと２０％減少させるステートが
 * 同時にかかっていた場合、物理ダメージが３０％上昇します。
 * また、減少の下限は０％なので、ダメージが負の値を取る事はありません。
 *
 * オマケ機能として、ダメージを与えた時点でステートを解除する事も出来ます。
 * <oneAttack:x>
 * と記述すると、ダメージを与えた時点で対象のステートが解除されます。
 * xには以下のいずれかのプロパティを記述します。
 *
 * just
 * 複数回攻撃や、全体攻撃であっても、最初の一撃でステートが解除されます。
 * 攻撃を外した場合は、ステートが解除されません。
 *
 * all
 * 複数回攻撃や、全体攻撃の場合、最後まで打ち終えた際にステートが解除されます。
 * 攻撃を外した場合でも、打ち終えた時点でステートが解除されます。
 *
 *
 * これらを組み合わせれば、
 * 某MMORPGの不意打ちの様なステートも作成出来ます。
 *
 * －－－不意打ちっぽいステートの例－－－
 * 特徴：追加能力値：会心率+100%
 * <cause_physical:50>
 * <oneAttack:just>
 * －－－－－－－－－－－－－－－－－－－
 *
 * 「次の物理攻撃一発のダメージを５０％上昇させ、かつ１００％クリティカルする。」
 * というステートになります。
 * クリティカル自体は物理、魔法問わないのがちょっと困る。
 * 増やせばいいんだけどね＾ｑ＾
 *
 * バグとか要望あればよろしく。
 */

(function() {

var Kinoko_executeDamage = Game_Action.prototype.executeDamage;
var Kinoko_Damage = Game_Action.prototype.makeDamageValue;
var Kinoko_Apply = Game_Action.prototype.apply;
var Kinoko_RemoveAuto = Game_Battler.prototype.removeStatesAuto;
var Kinoko_RemoveDamage = Game_Battler.prototype.removeStatesByDamage;
var Kinoko_EffectAddState = Game_Action.prototype.itemEffectAddState;
var Kinoko_StateCounts = Game_BattlerBase.prototype.resetStateCounts;
var Kinoko_Battler = Game_Battler.prototype.initMembers;
var Kinoko_Enemy = Game_Enemy.prototype.initialize;
var Kinoko_Load = Scene_Load.prototype.onLoadSuccess;
var Kinoko_RegeneHP = Game_Battler.prototype.regenerateHp;
var Kinoko_RegeneMP = Game_Battler.prototype.regenerateMp;
var Kinoko_Start = BattleManager.startAction;
var Kinoko_setHp = Game_BattlerBase.prototype.setHp;
var Kinoko_setMp = Game_BattlerBase.prototype.setMp;
var repeat_attack = 0;
var max_attack = 0;
var extension = 100;

var Game_BattlerBase_prototype_die = Game_BattlerBase.prototype.die;
Game_BattlerBase.prototype.die = function() {
    this.states().forEach(function(state){
      if(state.meta.soleSurvivor){
        $gameParty.aliveMembers().forEach(function(member){
          member.gainTp(100 - member.tp);
          member.gainMp(member.mmp - member.mp);
          member.gainHp(member.mhp - member.hp);
        })
      }
    })
    Game_BattlerBase_prototype_die.call(this);
};

Game_BattlerBase.prototype.isTimeStop = function(){
  var stop = false;
  this.states().forEach(function(state){
    if(state.meta.timeStop){
      stop = true;
    }
  });
  return stop;
}

Game_BattlerBase.prototype.isReverseStateCount = function(){
  var stop = false;
  this.states().forEach(function(state){
    if(state.meta.reverseStateCount){
      stop = true;
    }
  });
  return stop;
}

Sprite_Actor_prototype_startMotion = Sprite_Actor.prototype.startMotion;
Sprite_Actor.prototype.startMotion = function(motionType) {
    if(!this._actor.isTimeStop()){
      Sprite_Actor_prototype_startMotion.call(this, motionType);
    }
};

Game_BattlerBase_prototype_updateStateTurns = Game_BattlerBase.prototype.updateStateTurns;
Game_BattlerBase.prototype.updateStateTurns = function() {
  if(!this.isTimeStop() && !this.isReverseStateCount()){
    Game_BattlerBase_prototype_updateStateTurns.call(this);
  }
  if(!this.isTimeStop() && this.isReverseStateCount()){
    this._states.forEach(function(stateId) {
        if (this._stateTurns[stateId] > 0) {
            this._stateTurns[stateId]++;
        }
    }, this);
  }
  this._states.forEach(function(stateId) {
      if ($dataStates[stateId].meta.timeStop && this._stateTurns[stateId] > 0) {
          this._stateTurns[stateId]--;
      }
  }, this);
};

Game_Actor.prototype.equips = function() {
    var notEquip = [];
    this.states().forEach(function(state){
      if(state.meta.sealedEtypeId){
        notEquip.push(parseInt(state.meta.sealedEtypeId));
      }
    })
    return this._equips.map(function(item) {
        if(item.object() && notEquip.indexOf(item.object().etypeId) >= 0){

        } else {
          return item.object();
        }
    });
};

Game_Action.prototype.calcElementRate = function(target) {
    var elements = [];
    elements.push(this.item().damage.elementId);
    if(this.subject().isActor() && this.subject().isActor() != target.isActor() && !this.isMagical())Array.prototype.push.apply(elements,this.subject().attackElements());
    return this.elementsMaxRate(target, elements);
};

Game_Actor.prototype.turnEndOnMap = function() {
};

Game_Actor.prototype.inputtingAction = function() {
    if(this.action(this._actionInputIndex)){
      return this.action(this._actionInputIndex);
    } else {
      var action = new Game_Action(this);
      action._item._dataClass = 'skill';
      action._item._itemId = 9;
      this._actions[0] = action;
      return action;
    }
};

Game_Action.prototype.targetsForFriends = function() {
    var targets = [];
    var unit = this.friendsUnit();
    if (this.isForUser()) {
        return [this.subject()];
    } else if (this.isForDeadFriend()) {
        if (this.isForOne()) {
            targets.push(unit.smoothDeadTarget(this._targetIndex));
        } else {
            targets = unit.deadMembers();
        }
    } else if (this.isForOne()) {
        if (this._targetIndex < 0) {
            targets.push(unit.randomTarget(this.item(), this.subject()));
        } else {
            targets.push(unit.smoothTarget(this._targetIndex));
        }
    } else {
        targets = unit.aliveMembers();
    }
    return targets;
};

Game_Unit.prototype.randomTarget = function(item, subject) {
    var tgrRand = Math.random() * this.tgrSum(item, subject);
    var target = null;
    if(item && item.meta.deadTarget){
      this.deadMembers().forEach(function(member) {
        if(!(this.deadMembers().length > 1 && (item && item.meta.notUserTarget) && (subject && subject == member))){
          tgrRand -= member.tgr;
          if (tgrRand <= 0 && !target) {
              target = member;
          }
        }
      }, this);
    } else {
      this.aliveMembers().forEach(function(member) {
        if(!(this.aliveMembers().length > 1 && (item && item.meta.notUserTarget) && (subject && subject == member))){
          tgrRand -= member.tgr;
          if (tgrRand <= 0 && !target) {
              target = member;
          }
        }
      }, this);
    }
    return target;
};

Game_Unit.prototype.tgrSum = function(item, subject) {
    if(item && item.meta.deadTarget){
      return this.deadMembers().reduce(function(r, member) {
          var value =  r + member.tgr;
          if(((item && item.meta.notUserTarget) && (subject && member == subject))) value = 0;
          //if(subject && member == subject) value = 0;
          return value;
      }, 0);
    } else {
      return this.aliveMembers().reduce(function(r, member) {
          var value =  r + member.tgr;
          if(((item && item.meta.notUserTarget) && (subject && member == subject))) value = 0;
          //if(subject && member == subject) value = 0;
          return value;
      }, 0);
    }
};

BattleManager.makeActionOrders = function() {
    var battlers = [];
    if (!this._surprise) {
        battlers = battlers.concat($gameParty.members());
    }
    if (!this._preemptive) {
        battlers = battlers.concat($gameTroop.members());
    }
    battlers.forEach(function(battler) {
        battler.makeSpeed();
    });
    battlers.sort(function(a, b) {
        if($gameSwitches.value(711)){
          return b.speed() + a.speed();
        } else {
          return b.speed() - a.speed();
        }
    });
    this._actionBattlers = battlers;
};

Game_Action.prototype.targetsForOpponents = function() {
    var targets = [];
    var unit = this.opponentsUnit();
    if (this.isForRandom()) {
        for (var i = 0; i < this.numTargets(); i++) {
            targets.push(unit.randomTarget(this.item(), this.subject()));
        }
    } else if (this.isForOne()) {
        if (this._targetIndex < 0) {
            targets.push(unit.randomTarget(this.item(), this.subject()));
        } else {
            targets.push(unit.smoothTarget(this._targetIndex));
        }
    } else {
        alives = unit.aliveMembers();
        alivesE = $gameTroop.aliveMembers();
        if(this.isStateTarget()){
          targets = alives.filter(function(member){
            if(member.isStateTarget().indexOf(this.isStateTarget()) >= 0){
              return true;
            }
          }, this);
          if(targets.length == 0){
            targets = alives;
          }
          this.targetMemberCount = targets.length;
        } else {
          targets = alives;
        }
        if(this.item().meta.friendAttack){
          Array.prototype.push.apply(targets, alivesE);
        }
    }
    return targets;
};

Game_BattlerBase.prototype.isStateTarget = function() {
  var flg = [];
  this.states().forEach(function(state){
    if(state.meta.stateTarget){
      flg.push(parseInt(state.meta.stateTarget));
    }
  });
  return flg;
}

Game_Action.prototype.isStateTarget = function() {
  if(this.item().meta.stateTarget){
    return this.item().meta.stateTarget;
  } else {
    return 0;
  }
}

BattleManager.checkBattleEnd = function() {
    if (this._phase) {
        if (this.checkAbort()) {
            return true;
        } else if ($gameParty.isAllDead()) {
            if(!$gameSwitches.value(687)){
              var addList = this.checkBattleUser();
              if(addList.length >= 1){
                var removeList = new Array();
                for(var i = 1; i < 4; i++){
                  removeList.push($gameParty.members()[i]);
                }
                for(var i = 0; i < 3; i++){
                  $gameParty.removeActor(removeList[i].actorId());
                }
                for(var i = 0; i < addList.length; i++){
                  $gameParty.addActor(addList[i].actorId());
                }
                for(var i = 0; i < 3; i++){
                  $gameParty.addActor(removeList[i].actorId());
                }
              } else {
                this.processDefeat();
                return true;
              }
            } else {
              this.processDefeat();
              return true;
            }
        } else if ($gameTroop.isAllDead()) {
            this.processVictory();
            return true;
        }
    }
    return false;
};

BattleManager.checkBattleUser = function(){
  var list = new Array();
  for(var i = 0; i < $gameParty._actors.length; i++){
    if(!$gameActors._data[$gameParty._actors[i]].isDead()){
      list.push($gameActors._data[$gameParty._actors[i]]);
    }
  }
  return list;
}

Game_Action.prototype.speed = function() {
    var agi = this.subject().agi;
    var speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
    if (this.item()) {
        speed += this.item().speed;
    }
    speed += this.subject().attackSpeed();
    return speed;
};

Game_Action.prototype.numRepeats = function() {
    var repeats = this.item().repeats;
    if (this.isForOpponent()) {
        repeats += this.subject().attackTimesAdd();
    }
    return Math.floor(repeats);
};

Game_Action.prototype.checkItemScope = function(list) {
    var scope = this.item().scope;
    if(this.item().meta.song){
      this.subject().states().forEach(function(state){
        if(state.meta.fortissimo){
          scope = 2;
        }
      }, this);
    }
    return list.contains(scope);
};

Game_BattlerBase.prototype.traitsSum = function(code, id) {
    var battler = this;
    return this.traitsWithId(code, id).reduce(function(r, trait) {
        var val = trait.value;
        if(code == 22 && id == 8 && trait.value < 0){
          battler.states().forEach(function(state){
            if(state.meta.soulVoice){
              val = 0;
            }
          });
        }
        return r + val;
    }, 0);
};

Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
    var x2 = x + 156;
    var width2 = Math.min(200, width - 180 - this.textPadding());
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x, y + lineHeight * 1);
    this.drawActorIcons(actor, x, y + lineHeight * 2);
    this.drawActorClass(actor, x2, y);
    this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
    this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
};

BattleManager.playBattleBgm = function() {
    var bgm = null;
    for(var i = 0; i < $gameTroop._enemies.length; i++){
      $gameTroop._enemies[i].notetags().forEach(function(note){
        if(note.indexOf("changeBGM") >= 0){
          bgm = note.split(":")[1];
        }
      })
    }
    if(bgm){
      AudioManager.playBgm({"name": bgm, "volume": 90, "pitch": 100, "pan": 0});
    } else {
      AudioManager.playBgm($gameSystem.battleBgm());
    }
    AudioManager.stopBgs();
};

Game_Actor.prototype.expForLevel = function(level) {
    var c = this.currentClass();
    var basis = c.expParams[0];
    var extra = c.expParams[1];
    var acc_a = c.expParams[2];
    var acc_b = c.expParams[3];
    var exp;
    if(level < 61){
      exp = Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
              (level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra);
    } else {
      exp = Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
              (level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra);
      level -= 55;
      exp += (Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
              (level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra)) * 15;
    }
    return exp;
};

var KIN_flg = false;
Window_Base.prototype.processNormalCharacter = function(textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    var text = "";
    for(var i = 0; i < textState.text.length; i++){
      text += textState.text[i];
    }
    if(KIN_flg == false && textState.index <= 1 && text.indexOf("★★★") >= 0){
      KIN_flg = true;
      this.changeTextColor(this.textColor(14));
    }
    if(c == "が"){
      KIN_flg = false;
      this.resetTextColor();
    }
    if(!(KIN_flg == true && c == "★")){
      this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
      textState.x += w;
    }
};

BattleManager.processEscape = function() {
    $gameParty.performEscape();
    SoundManager.playEscape();
    var success = true;
    if (success) {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    } else {
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        $gameParty.clearActions();
        this.startTurn();
    }
    return success;
};

Window_BattleEnemy.prototype.drawItem = function(index) {
    this.resetTextColor();
    var name = this._enemies[index].name();
    var rect = this.itemRectForText(index);
    if(name.indexOf("★★★") >= 0){
      this.changeTextColor(this.textColor(14));
      name = name.replace("★★★", "");
    }
    this.drawText(name, rect.x, rect.y, rect.width);
    this.resetTextColor();
};

Game_BattlerBase.prototype.paramMax = function(paramId) {
    if (paramId === 0) {
        return 9999999;  // MHP
    } else if (paramId === 1) {
        return 9999;    // MMP
    } else {
        return 9999;
    }
};

Game_Actor.prototype.paramMax = function(paramId) {
    if (paramId === 0) {
        return 99999;    // MHP
    }
    return Game_Battler.prototype.paramMax.call(this, paramId);
};

Game_Battler_prototype_addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) {
    var battler = this;
    this.states().forEach(function(state){
      if(state.meta.stateType){
        if($dataStates[stateId].meta.stateType == state.meta.stateType) battler.removeState(state.id);
      }
      if(state.meta.switchState){
        if(state.id == stateId) battler.removeState(state.id);
        return false;
      }
    });
    var party;
    if(this.isActor()){
      party = $gameParty;
    } else {
      party = $gameTroop;
    }
    if($dataStates[stateId].meta.song){
      for(var i = 0; i < Math.min(party.members().length, 4); i++){
        if(this.isActor()){
          if(party.members()[i]._actorId != battler._actorId){
            party.members()[i].addState(stateId + 1);
          }
        } else {
          if(party.members()[i]._enemyId != battler._enemyId){
            party.members()[i].addState(stateId + 1);
          }
        }

      }
    }
    if($dataStates[stateId].meta.ougi){
      battler._ouginomai = 0.5;
    }
    if($dataStates[stateId].meta.reUseRemove && this.isStateAffected(stateId)){
      this.removeState(stateId);
    } else {
      Game_Battler_prototype_addState.call(this, stateId);
    }
};


var DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    DataManager_createGameObjects.call(this);
		$dataWeapons.forEach(function(weapon){
			if(weapon){
				if(weapon.meta.mhp){
					weapon.params[0] += Number(weapon.meta.mhp / 2) || 0;
				}
				if(weapon.meta.mmp){
					weapon.params[1] += Number(weapon.meta.mmp / 2) || 0;
				}
				if(weapon.meta.atk){
					weapon.params[2] += Number(weapon.meta.atk / 2) || 0;
				}
				if(weapon.meta.def){
					weapon.params[3] += Number(weapon.meta.def / 2) || 0;
				}
				if(weapon.meta.mat){
					weapon.params[4] += Number(weapon.meta.mat / 2) || 0;
				}
				if(weapon.meta.mdf){
					weapon.params[5] += Number(weapon.meta.mdf / 2) || 0;
				}
				if(weapon.meta.agi){
					weapon.params[6] += Number(weapon.meta.agi / 2) || 0;
				}
				if(weapon.meta.luk){
					weapon.params[7] += Number(weapon.meta.luk / 2) || 0;
				}
			}
		});
		$dataArmors.forEach(function(armor){
			if(armor){
				if(armor.meta.mhp){
					armor.params[0] += Number(armor.meta.mhp / 2) || 0;
				}
				if(armor.meta.mmp){
					armor.params[1] += Number(armor.meta.mmp / 2) || 0;
				}
				if(armor.meta.atk){
					armor.params[2] += Number(armor.meta.atk / 2) || 0;
				}
				if(armor.meta.def){
					armor.params[3] += Number(armor.meta.def / 2) || 0;
				}
				if(armor.meta.mat){
					armor.params[4] += Number(armor.meta.mat / 2) || 0;
				}
				if(armor.meta.mdf){
					armor.params[5] += Number(armor.meta.mdf / 2) || 0;
				}
				if(armor.meta.agi){
					armor.params[6] += Number(armor.meta.agi / 2) || 0;
				}
				if(armor.meta.luk){
					armor.params[7] += Number(armor.meta.luk / 2) || 0;
				}
			}
		});
};

Object.defineProperty(Game_BattlerBase.prototype, 'tcr', {
	get: function() {
		var value = 1.0;
		this.traitObjects().forEach(function(object) {
			var cdm = parseFloat(object.meta.tp_cost) || 0.0;
			value += cdm;
		});
		return Math.max(value, 0.0);
	},
	configurable: true
});

Game_BattlerBase.prototype.skillTpCost = function(skill) {
    return Math.floor(skill.tpCost * this.tcr);
};

Object.defineProperty(Game_BattlerBase.prototype, 'cdm', {
	get: function() {
		var value = 1.5;
		this.traitObjects().forEach(function(object) {
			var cdm = parseFloat(object.meta.critical_damage) || 0.0;
			value += cdm;
		});
		return Math.max(value, 0.0);
	},
	configurable: true
});

Game_Action.prototype.applyCritical = function(damage) {
    return damage * (parseFloat(this.subject().cdm) + (parseFloat(this.item().meta.critical_damage || 0.0)));
};

var Game_BattlerBase_prototype_clearStates = Game_BattlerBase.prototype.clearStates;
Game_BattlerBase.prototype.clearStates = function() {
    Game_BattlerBase_prototype_clearStates.call(this);
    var party;
    if(this.isActor()){
      party = $gameParty;
    } else {
      party = $gameTroop;
    }
    var song = false;
    for(var i = 0; i < Math.min(party.members().length, 4); i++){
      party.members()[i].states().forEach(function(state){
        if(state.meta.song){
          song = true;
        }
      }, this);
    }
    if(!song){
      for(var i = 0; i < Math.min(party.members().length, 4); i++){
        party.members()[i].states().forEach(function(state){
          if(state.meta.songFriend){
            party.members()[i].removeState(state.id);
          }
        }, this);
      }
    }
};

var Game_Battler_prototype_removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function(stateId) {
    Game_Battler_prototype_removeState.call(this, stateId);
    var party;
    if(this.isActor()){
      party = $gameParty;
    } else {
      party = $gameTroop;
    }
    for(var i = 0; i < Math.min(party.members().length, 4); i++){
      party.members()[i].states().forEach(function(state){
        if(state.meta.songFriend && state.id == stateId + 1){
          this.removeState(stateId + 1);
        }
      }, this);
    }
};

Game_BattlerBase.prototype.KIN_removeState = function(){
    var battler = this;
    var party;
    if(this.isActor()){
      party = $gameParty;
    } else {
      party = $gameTroop;
    }
    this.states().forEach(function(state){
        if(state.meta.song){
          if(battler.mp <= 0){
            battler.removeState(state.id);
            for(var i = 0; i < Math.min(party.members().length, 4); i++){
              party.members()[i].removeState(state.id + 1);
            }
          } else {
            for(var i = 0; i < Math.min(party.members().length, 4); i++){
              if(battler.isActor()){
                if(party.members()[i]._actorId != battler._actorId){
                  party.members()[i].addState(state.id + 1);
                }
              } else {
                if(party.members()[i]._enemyId != battler._enemyId){
                  party.members()[i].addState(state.id + 1);
                }
              }
            }
          }
        }
        if(state.meta.state_remove){
            var array = state.meta.state_remove.split(/,/);
            var parameter;
            var parameter2;
            var property;
            var value;
            switch(array[0]){
            case "HP":
                parameter = "battler.hp";
                parameter2 = "battler.mhp";
                break;
            case "MP":
                parameter = "battler.mp";
                parameter2 = "battler.mmp";
                break;
            }
            switch(array[1]){
            case "OVER":
                property = ">=";
                break;
            case "BELOW":
                property = "<=";
                break;
            }
            var v = array[2].replace(/[^0-9^\.]/g,"");
            value = parseInt(eval(parameter2) * (v / 100));
            if(eval(parameter + property + value)){
                battler.removeState(state.id);
            }
        }
    });
};

Game_BattlerBase.prototype.setHp = function(hp) {
    Kinoko_setHp.call(this, hp);
    this.KIN_removeState();
};

Game_BattlerBase.prototype.setMp = function(mp) {
    Kinoko_setMp.call(this, mp);
    this.KIN_removeState();
};

Game_Action.prototype.executeDamage = function(target, value) {
    this.subject()._nextDamageUp = 0;
    a = this.subject();
    if(value > 0){
      if(a._ouginomai){
        a._ouginomai = Math.min(a._ouginomai + 0.1, 0.8);
      }
	    for(var i = 0; i < target.states().length; i++){
	        var state = target.states()[i];
	        var seesaw = state.meta.seesaw;
	        if(seesaw != null){
	            var elementId = this.item().damage.elementId;
	            if (elementId > 0) {
	                target._elementSeesaw[elementId] -= value / 300;
	                if(target._elementSeesaw[elementId] < 0) target._elementSeesaw[elementId] = 0;
	                var upId = 0;
	                switch(elementId){
	                case 2:
	                    upId = 5;
	                    break;
	                case 3:
	                    upId = 2;
	                    break;
	                case 4:
	                    upId = 6;
	                    break;
	                case 5:
	                    upId = 4;
	                    break;
	                case 6:
	                    upId = 7;
	                    break;
	                case 7:
	                    upId = 3;
	                    break;
	                case 8:
	                    upId = 9;
	                    break;
	                case 9:
	                    upId = 8;
	                    break;
	                }
	                target._elementSeesaw[upId] += value / 300;
	                if(target._elementSeesaw[upId] > 200) target._elementSeesaw[upId] = 200;
	            }
	        }
	    }
    }
    for(var i = 0; i < a.states().length; i++){
        var state = a.states()[i];
        var at = state.meta.oneAttack;
        if(at != null && at.indexOf("just") >= 0) a.removeState(state.id);
    }
    for(var i = 0; i < target.states().length; i++){
        var state = target.states()[i];
        var count = state.meta.damage_count;
        if(count != null) $gameVariables.setValue(count,$gameVariables.value(count)+value);
    }
    if(target.isEnemy() == true && $gameVariables.value(165) == 1){
        if (this.isPhysical()) {
            $gameVariables.setValue(105,$gameVariables.value(105)+value);
        } else {
            $gameVariables.setValue(106,$gameVariables.value(106)+value);
        }
    }
    if(a.isActor() != target.isActor()){
        for(var i = 0; i < target.states().length; i++){
            var state = target.states()[i];
            var at = state.meta.counterState;
            if(at != null){
                var counterArray = at.split(/:/);
                if(Math.random() * 100 < counterArray[1]){
                    if(counterArray[0] == 1){
                        a.addState(a.deathStateId())
                    } else {
                        a.addState(counterArray[0]);
                    }
                }
            }
            var at = state.meta.counterDamage;
            if(at != null){
                var counterValue = value * at / 100;
                if(a.isEnemy() && counterValue > a.mhp / 10) counterValue = a.mhp / 10;
                if (this.isPhysical()) {
                    counterValue *= a.pdr;
                }
                if (this.isMagical()) {
                    counterValue *= a.mdr;
                }
               counterValue = this.applyGuard(counterValue, a);
               counterValue = Math.round(counterValue);
               if(counterValue >= a.hp) counterValue = a.hp -1;
               this.executeDamage(a, counterValue);
            }
            var at = state.meta.counterSacrifice;
            if(at != null){
                if(target.isActor()){
                    for(var i = 0; i < $gameTroop.members().length; i++){
                        var sacTarget = $gameTroop.members()[i];
                        for(var j = 0; j < sacTarget.states().length; j++){
                            var state = sacTarget.states()[j];
                            var sac = state.meta.sacrifice;
                            if(sac != null){
                                var counterValue = value * at / 100;
                                if(counterValue > sacTarget.mhp / 10) counterValue = sacTarget.mhp / 10;
                                if (this.isPhysical()) {
                                    counterValue *= sacTarget.pdr;
                                }
                                if (this.isMagical()) {
                                    counterValue *= sacTarget.mdr;
                                }
                                counterValue = this.applyGuard(counterValue, sacTarget);
                                counterValue = Math.round(counterValue);
                                if(counterValue >= sacTarget.hp) counterValue = sacTarget.hp -1;
                                this.executeDamage(sacTarget, counterValue);
                                break;
                            }
                        }
                    }
                } else {
                    for(var i = 0; i < $gameParty.members().length; i++){
                        var sacTarget = $gameParty.members()[i];
                        for(var j = 0; j < sacTarget.states().length; j++){
                            var state = sacTarget.states()[j];
                            var sac = state.meta.sacrifice;
                            if(sac != null){
                                var counterValue = value * at / 100;
                                if (this.isPhysical()) {
                                    counterValue *= sacTarget.pdr;
                                }
                                if (this.isMagical()) {
                                    counterValue *= sacTarget.mdr;
                                }
                                counterValue = this.applyGuard(counterValue, sacTarget);
                                counterValue = Math.round(counterValue);
                                if(counterValue >= sacTarget.hp) counterValue = sacTarget.hp -1;
                                this.executeDamage(sacTarget, counterValue);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    if(value > target.hp) a._finishCount += 1;
    if(target.isEnemy() && $gameSwitches.value(441) == true && value >= 10000){
        $gameSwitches.setValue(442,true);
    }
    Kinoko_executeDamage.call(this,target, value);	//元々のメソッドを呼び出す
};

BattleManager.startAction = function() {
    Kinoko_Start.call(this);
    max_attack = 0;
};

Game_BattlerBase.prototype.attackSkillId = function() {
    if(this.isActor){
        var skillId = 1;
        for(var i = 0; i < this.notetags().length; i++){
            this.traitObjects().forEach(function(object){
              if(object.meta.physicalAttack){
                skillId =  1;
              }
              if(object.meta.magicAttack){
                skillId =  5;
              }
              if(object.meta.fairyAttack){
                skillId =  6;
              }
            });
            if(this.notetags()[0].indexOf("<magicAttack>") >= 0){
                skillId =  5;
            }
            if(this.notetags()[0].indexOf("<fairyAttack>") >= 0){
                skillId =  6;
            }
        }
        return skillId;
    } else {
        return skillId;
    }
};

DataManager.setupBattleTest = function() {
    hosei = new Array();
    hosei[0] = 1; // 最大HP
    hosei[1] = 1; // 最大MP
    hosei[2] = 1; // 攻撃力
    hosei[3] = 1; // 防御力
    hosei[4] = 1; // 魔法力
    hosei[5] = 1; // 魔法防御
    hosei[6] = 1; // 素早さ
    hosei[7] = 1; // 運
    hosei[8] = 1; // 経験値
    hosei[9] = 1; // ゴールド
    hosei[10] = 1; // アイテムドロップ率
    this.createGameObjects();
    $gameParty.setupBattleTest();
    BattleManager.setup($dataSystem.testTroopId, true, false);
    BattleManager.setBattleTest(true);
    BattleManager.playBattleBgm();
};

Scene_Load.prototype.onLoadSuccess = function() {
    Kinoko_Load.call(this);
    var myDate = new Date();
    var dayOfMonth = myDate.getDate();
    myDate.setDate(dayOfMonth + 1);
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var dayOfMonth = myDate.getDate();
    $dataItems[520].description = "「ファイブ・ナンバーズ」を購入した証。\n番号："+$gameVariables.value(201)+$gameVariables.value(202)+$gameVariables.value(203)+$gameVariables.value(204)+$gameVariables.value(205)+"　当選発表日："+$gameVariables.value(217)+"年"+$gameVariables.value(218)+"月"+$gameVariables.value(219)+"日";
    $gameSwitches.setValue(498,false);
    $gameTemp.reserveCommonEvent(61);
    SceneManager.update();
};

Game_Actor.prototype.notetags = function() {
    return this.actor().note.split(/[\r\n]+/);
};

Game_Action.prototype.itemEffectGainTp = function(target, effect) {
    var value = effect.value1;
    if (value !== 0) {
        target.gainTp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.applyItemUserEffect = function(target) {
    var value = (this.item().tpGain * 1.5) * this.subject().tcr;
    this.subject().gainSilentTp(value);
};

Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
    var value = 50 * damageRate * this.tcr / 2;
    this.gainSilentTp(value);
};

Game_Actor.prototype.gainTp = function(value) {
    this._result.tpDamage = -value;
    for(var i = 0; i < this.notetags().length; i++){
        if(this.notetags()[i].indexOf("<tpLevelRate>") >= 0){
            value = value * (this.level + 100) / 100;
            break;
        }
    }
    this.setTp(this.tp + value);
};


Game_Actor.prototype.gainSilentTp = function(value) {
    for(var i = 0; i < this.notetags().length; i++){
        if(this.notetags()[i].indexOf("<tpLevelRate>") >= 0){
            value = value * (this.level + 100) / 100;
            break;
        }
    }
    this.setTp(this.tp + value);
};

Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    Kinoko_Enemy.call(this,enemyId,x,y);
    this._elementSeesaw = [];
    for(var i = 0; i < 13; i++) this._elementSeesaw[i] = 100;
    this._finishCount = 0;
    this._miseryDamage = 0;
};

Game_Battler.prototype.initMembers = function() {
    Kinoko_Battler.call(this);
    this._finishCount = 0;
    this._miseryDamage = 0;
};

Game_Action.prototype.itemEffectAddState = function(target, effect) {
    var a = this.subject();
    var item = this.item();
    extension = 100;
    if(effect && effect.code == 21 && effect.dataId != 0 && $dataStates[effect.dataId].meta.malinconico){
      target._malinconico = 1 - Math.min(a.mat / 4000, 0.5);
    }
    a.traitObjects().forEach(function(object){
        var ext = object.meta.state_extension;
        var ignore = item.meta.ignore_extension;
        if(ignore != null){
            var ignore_array = ignore.split(/,/);
            /*for(var j = 0; j < ignore_array.length; j++){
                ignore_array[j] = parseInt(ignore_array[j]);
            }*/
        }
        ext = parseInt(ext);
        if(!(ext>=0 || ext<=0)) ext = 0;
        if(ignore != null){
            for(var j = 0; j < ignore_array.length; j++){
                a.states().forEach(function(state){
                  if(!object.isEquipItem){if(state.id == ignore_array[j]) ext = 0;}
                });
            }
        }
        extension += ext;
    });
    if(extension < 0) extension = 0;
    Kinoko_EffectAddState.call(this,target,effect);
};

Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    Kinoko_StateCounts.call(this,stateId);
    if(extension != 100){
        this._stateTurns[stateId] = parseInt(this._stateTurns[stateId] * extension / 100);
        extension = 100;
    }
};

Game_Battler.prototype.removeStatesAuto = function(timing) {
    this.states().forEach(function(state) {
        if (this.isStateExpired(state.id) && state.autoRemovalTiming === timing) {
            var at = state.meta.after_stateA;
            at = parseInt(at);
            if(!(at>=0 || at<=0)) at = 0;
            if(at > 0) this.addState(at);
        }
    }, this);
    this.KIN_removeState();
    Kinoko_RemoveAuto.call(this,timing);
};

Game_Battler.prototype.removeStatesByDamage = function() {
    var at = new Array;
    var i = 0;
    this.states().forEach(function(state) {
        if (state.removeByDamage && Math.randomInt(100) < state.chanceByDamage) {
            at[i] = state.meta.after_stateD;
            at[i] = parseInt(at[i]);
            if(!(at[i]>=0 || at[i]<=0)) at[i] = 0;
            i++;
        }
    }, this);
    Kinoko_RemoveDamage.call(this);
    for(var i = 0; i < at.length; i++){
        if(at[i] > 0) this.addState(at[i]);
    }
};

var kinokoState = null;

Game_Action.prototype.apply = function(target) {
    var a = this.subject();
    if(max_attack == 0) max_attack = this.makeTargets().length;
    if(this.item().meta.song){
      this.subject().states().forEach(function(state){
        if(state.meta.fortissimo){
          this.subject().removeState(state.id);
        }
      }, this);
    }
    if(this.item().meta.stateTurnExtension){
      for(var i in target._stateTurns){
        if(target._stateTurns.hasOwnProperty(i)){
          target._stateTurns[i] = Math.floor(target._stateTurns[i] * eval(this.item().meta.stateTurnExtension));
        }
      }
    }
    if(this.item().meta.stateTurnExtensionAll){
      for(var i = 0; i < Math.min($gameParty.members().length, 4); i++){
        for(var j in $gameParty.members()[i]._stateTurns){
          if($gameParty.members()[i]._stateTurns.hasOwnProperty(j)){
            $gameParty.members()[i]._stateTurns[j] = Math.floor($gameParty.members()[i]._stateTurns[j] * eval(this.item().meta.stateTurnExtensionAll));
          }
        }
      }
      for(var i = 0; i < $gameTroop.members().length; i++){
        for(var j in $gameTroop.members()[i]._stateTurns){
          if($gameTroop.members()[i]._stateTurns.hasOwnProperty(j)){
            $gameTroop.members()[i]._stateTurns[j] = Math.floor($gameTroop.members()[i]._stateTurns[j] * eval(this.item().meta.stateTurnExtensionAll));
          }
        }
      }
    }
    Kinoko_Apply.call(this,target);
    //this.subject().KIN_removeState();
    var result = target.result();
    if (this.item().damage.type > 0) {
        repeat_attack += 1;
        if(repeat_attack >= max_attack){
            repeat_attack = 0;
            max_attack = 0;
            var a = this.subject();
            for(var i = 0; i < a.states().length; i++){
                var state = a.states()[i];
                var at = state.meta.oneAttack;
                if(at != null && at.indexOf("all") >= 0) a.removeState(state.id);
            }
        }
    }
    if(this.item().meta.tpReset){
      a.setTp(0);
    }
    if(this.item().meta.consumeMana){
      a.setTp(a.tp + parseInt(a.mp / a.mmp * 100));
      a._nextDamageUp = a.mp * 10;
      a.setMp(0);
    }
    if(a.isActor() && target.isActor() || a.isEnemy() && target.isEnemy()){
        if((a.isActor() && a._actorId != target._actorId) || (a.isEnemy() && a._enemyId != target._enemyId)){
            for(var i = 0; i < target.states().length; i++){
                if(this.item().scope == 8 || this.item().scope == 10) break;
                var state = target.states()[i];
                var id = target.states()[i].id;
                if((!kinokoState) || (target.states()[i].id != state.id && target.states()[i].id != kinokoState.id)){
                  var at = state.meta.infection;
                  if(at != null){
                      if(at == 2){
                          for(var i = 0; i < a.states().length; i++){
                             kinokoState = a.states()[i];
                             var id2 = a.states()[i].id;
                             var at2 = kinokoState.meta.infection;
                             if(at2 != null && at2 == 2){
                                 target.addState(id2);
                                 a.removeState(id2);
                             }
                          }
                          a.addState(id);
                          target.removeState(id);
                      } else {
                          a.addState(id);
                          if(at == 0) target.removeState(id);
                      }
                  }
                }
            }
            kinokoState = null;
        }
    }
    if(target.isEnemy()){
        var hanshaFlg = false;
        target.states().forEach(function(state){
          if(state.meta.hansha){
            hanshaFlg = state.meta.hansha;
          }
        })
        if($gameSwitches.value(433) == true || hanshaFlg){
          if($gameSwitches.value(433) || (hanshaFlg && hanshaFlg == 1 && this.isPhysical() || (hanshaFlg && hanshaFlg == 2 && this.isMagical()))){
            $gameSwitches.setValue(434,true);
            $gameVariables.setValue(173,this.item().id);
            for(var i = 0; $gameParty.members()[i]._actorId != a._actorId; i++);
            $gameVariables.setValue(174,i);
          }
        }
    }
    var burn = this.item().meta.burn;
    if(burn != null && result.hpDamage > 0){
        for(var i = 259; i < 263; i++){
            if(target.isStateAffected(i)){
                target.addState(Math.min(i+1,263));
                target.removeState(i);
                break;
            }
        }
        if(i == 263) target.addState(259);
    }
    if(this.item().meta.utushi){
      a.states().forEach(function(state){
        target.addState(state.id);
      });
      a.states().forEach(function(state){
        a.removeState(state.id);
      });
    }
};


Game_Action.prototype.makeDamageValue = function(target, critical) {
    Kinoko_Damage.call(this,target,critical);
    var result = target.result();
    var item = this.item();
    var baseValue = this.evalDamageFormula(target);
    if(this.isDamage() || this.isDrain()){
      console.log(this.subject()._nextDamageUp);
      baseValue += (this.subject()._nextDamageUp || 0);
    }
    var value = baseValue * this.calcElementRate(target);
    var upper = 100;
    var a = this.subject();
    a.states().forEach(function(state){
      if(state.meta.malinconico){
        value *= a._malinconico;
      }
      if(state.meta.slowStart){
        value *= Math.max(state.maxTurns - a._stateTurns[state.id], 0) * parseFloat(state.meta.slowStart) + 1.0;
      }
    }, this);
    if(value > 0){
      target.states().forEach(function(state){
        if(state.meta.ougi){
          value *= target._ouginomai;
        }
      });
    }
    if (this.isPhysical()) {
        if(a.isActor() && target.isEnemy() || a.isEnemy() && target.isActor()){
          value *= target.pdr;
        }
        if(a.isActor()){
            for(var i = 0; i < a.equips().length; i++){
                if(a.equips()[i] != null){
                    var equip = a.equips()[i];
                    var up = equip.meta.cause_physical;
                    up = parseInt(up);
                    if(!(up>=0 || up<=0)) up = 0;
                    upper += up;
                    if(equip.meta.Aeonic_Weapons != null) upper += parseInt((a.hp / a.mhp) * 100 / 2);
                }
            }
        }
        for(var i = 0; i < a.states().length; i++){
            var state = a.states()[i];
            var up = state.meta.cause_physical;
            up = parseInt(up);
            if(!(up>=0 || up<=0)) up = 0;
            upper += up;
            var rearguard = false;
            if(state.meta.rearguard){
              rearguard = true;
              if(item.meta.ignore_rearguard) rearguard = false;
              a.traitObjects().forEach(function(object){
                if(object.meta.ignore_rearguard){
                  rearguard = false;
                }
              })
            }
            if(rearguard) value = value / 2;
        }
        for(var i = 0; i < target.states().length; i++){
            var state = target.states()[i];
            var up = state.meta.twice_physical;
            if(up != null) value = value * up;
            var up = state.meta.twice_magical;
            if(up != null) value = value / up;
            var up = state.meta.absorb_physical;
            if(value > 0 && up != null) value = value * -1 * up / 100;
        }
        if(upper < 0 ) upper = 0;
        value = value * upper / 100;
    }
    upper = 100;
    if (this.isMagical()) {
        if((item.stypeId == 1 || item.stypeId == 2) && item.scope == 2){
            value = value * (Math.max(10 - repeat_attack,5)) / 10;
        }
        if(a.isActor() && target.isEnemy() || a.isEnemy() && target.isActor()){
          value *= target.mdr;
        }
        if(a.isActor()){
            for(var i = 0; i < a.equips().length; i++){
                if(a.equips()[i] != null){
                    var equip = a.equips()[i];
                    var up = equip.meta.cause_magical;
                    up = parseInt(up);
                    if(!(up>=0 || up<=0)) up = 0;
                    upper += up;
                    if(equip.meta.Aeonic_Weapons != null) upper += parseInt((a.hp / a.mhp) * 100 / 2);
                }
            }
        }
        for(var i = 0; i < a.states().length; i++){
            var state = a.states()[i];
            var up = state.meta.cause_magical;
            up = parseInt(up);
            if(!(up>=0 || up<=0)) up = 0;
            upper += up;
        }
        for(var i = 0; i < target.states().length; i++){
            var state = target.states()[i];
            var up = state.meta.twice_magical;
            if(up != null) value = value * up;
            var up = state.meta.twice_physical;
            if(up != null) value = value / up;
            var up = state.meta.absorb_magical;
            if(value > 0 && up != null) value = value * -1 * up / 100;
        }
        if(upper < 0 ) upper = 0;
        value = value * upper / 100;
    }
    upper = 100;
    for(var i = 0; i < a.states().length; i++){
        var state = a.states()[i];
        var up = state.meta.cause_elements;
        if(up != null){
            var up_array = up.split(/:|,/);
            if (this.item().damage.elementId < 0) {
                var kinoko_elements = this.subject().attackElements();
            } else {
                var kinoko_elements = this.item().damage.elementId;
            }
            for(var j = 0; j < up_array.length; j+=2){
                if(kinoko_elements == up_array[j]){
                    up = up_array[j+1];
                    up = parseInt(up);
                    if(!(up>=0 || up<=0)) up = 0;
                    upper += up;
                    break;
                }
            }
        }
    }
    if(upper < 0 ) upper = 0;
    value = value * upper / 100;
    if(item.meta.afflatus_misery != null) a._miseryDamage = 0;
    for(var i = 0; i < target.states().length; i++){
        var state = target.states()[i];
        if(value > 0 && state.meta.afflatus_misery != null) target._miseryDamage = value;
        var seesaw = state.meta.seesaw;
        if(seesaw != null){
            var elementId = this.item().damage.elementId;
            if (elementId > 0) {
                value = value * target._elementSeesaw[elementId] / 100;
            }
        }
    }
    if (baseValue < 0) {
        value *= target.rec;
        upper = 100;
        if(a.isActor()){
            for(var i = 0; i < a.equips().length; i++){
                if(a.equips()[i] != null){
                    var equip = a.equips()[i];
                    var up = equip.meta.cause_heal;
                    up = parseInt(up);
                    if(!(up>=0 || up<=0)) up = 0;
                    upper += up;
                    if(equip.meta.Aeonic_Weapons != null) upper += parseInt((a.hp / a.mhp) * 100 / 2);
                }
            }
        }
        for(var i = 0; i < a.states().length; i++){
            var state = a.states()[i];
            var up = state.meta.cause_heal;
            up = parseInt(up);
            if(!(up>=0 || up<=0)) up = 0;
            upper += up;
        }
        if(upper < 0 ) upper = 0;
        value = value * upper / 100;
    }
    if (critical) {
        value = this.applyCritical(value);
    }
    if(a.isActor() != target.isActor()){
      target.states().forEach(function(state){
        if(state.meta.scherzo){
          var sche = state.meta.scherzo.split(":");
          if(value >= target.mhp * (sche[0] / 100)){
            value *= (sche[1] / 100);
          }
        }
      });
    }
    target.states().forEach(function(state){
      if(state.meta.zombie){
        if(value < 0)value *= -1;
      }
    });
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
    value = Math.round(value);
    return value;
};

})();
