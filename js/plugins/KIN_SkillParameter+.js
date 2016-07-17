//=============================================================================
// KIN_SkillParameter+.js
//=============================================================================

/*:ja
 * @plugindesc スキルごとに命中率、クリティカル率を変動させることが可能になります。運の差でクリティカル率が変動するようにもなります。
 *
 * @author Agaricus_Mushroom
 *
 * @help ～使い方～
 * スキルのメモ欄に以下の記述をします。
 *
 * 【命中率を変動させたい場合】
 * <hit:x>
 * 例：命中率が通常より５０％高いスキル
 * <hit:50>
 *
 * 【クリティカル率を変動させたい場合】
 * <critical:x>
 * 例：必ずクリティカルするスキル
 * <critical:100>
 *
 * また、xには負の値も使用出来ます。
 * 例：命中率が通常より５０％低いスキル
 * <hit:-50>
 *
 * 使用者が特定のステートにかかっている時だけこれらを適用する事も出来ます。
 * その場合は、通常の記述に加えて、
 * <eff_state:x>
 * と記述します。（xにはステートIDが入ります）
 * 例：毒（IDが４）にかかっている時だけクリティカル率が２０％高くなるスキル
 * <critical:20>
 * <eff_state:4>
 *
 *
 * ～余談ダガー～
 * デフォルトの命中計算は、使用者がどれだけ命中率が高くても、
 * １００％以上は切り捨てられ、
 * 相手側の回避判定でミスだった場合は容赦なく回避されてしまいます。
 * このプラグインも例外ではないので、必中にしたい場合などは、
 * きぎぬ様のKGN_HitMinusEvaというプラグインと併用すると便利です(^o^)
 * バグとか要望あればよろしく。
 */

(function() {

var Kinoko_Cri = Game_Action.prototype.itemCri;
var Kinoko_Hit = Game_Action.prototype.itemHit;
var Kinoko_EnemyI = Game_Enemy.prototype.initialize;

Game_Action.prototype.itemCri = function(target) {
    Kinoko_Cri.call(this,target);
    var cri = this.item().meta.critical;
    cri = parseInt(cri);
    if(!(cri>=0 || cri<=0)) cri = 0;
    cri += this.KIN_luckRate(target);
    var stateid = this.item().meta.eff_state;
    stateid = parseInt(stateid);
    if(!(stateid>=0 || stateid<=0)) stateid = 0;
    if(stateid > 0){
        if(!this.subject().isStateAffected(stateid)) cri = 0;
    }
    return this.item().damage.critical ? this.subject().cri * (1 - target.cev)+(cri * 0.01) : 0;
};

Game_Action.prototype.KIN_luckRate = function(target){
    return Math.max((this.subject().luk - target.luk) * 0.1,0.0);
};

Game_Battler.prototype.notetags = function() {
	if (this.isEnemy) {return this.enemy().note.split(/[\r\n]+/)};
	if (this.isActor) {return this.actor().note.split(/[\r\n]+/)};
};

Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    Kinoko_EnemyI.call(this,enemyId,x,y);
    if($dataEnemies[enemyId].dropItems[2].kind == 0){
        $dataEnemies[enemyId].dropItems[2].kind = 1;
        $dataEnemies[enemyId].dropItems[2].dataId = 150;
        var Level = 0;
        for(var i = 0; i < this.notetags().length; i++){
            if(this.notetags()[i].indexOf("<EnemyLv:") >= 0){
                Level = this.notetags()[i].replace(/[^0-9^\.]/g,"");
                Level = parseInt(Level * hosei[0],10);
            }
        }
        $dataEnemies[enemyId].dropItems[2].denominator = 50 - Math.min(Math.floor(Level / 2),49);
    }
};

Game_Action.prototype.KIN_levelRate = function(target){
    var targetLevel = 0;
    var thisLevel = 0;
    var a = this.subject();
    if(target.isEnemy()){
        for(var i = 0; i < target.notetags().length; i++){
            if(target.notetags()[i].indexOf("<EnemyLv:") >= 0){
                targetLevel = target.notetags()[i].replace(/[^0-9^\.]/g,"");
                targetLevel = parseInt(targetLevel * hosei[0],10);
            }
        }
    } else {
        targetLevel = target.level;
    }
    if(a.isEnemy()){
        for(var i = 0; i < a.notetags().length; i++){
            if(a.notetags()[i].indexOf("<EnemyLv:") >= 0){
                thisLevel = a.notetags()[i].replace(/[^0-9^\.]/g,"");
                thisLevel = parseInt(thisLevel * hosei[0],10);
            }
        }
    } else {
        thisLevel = a.level;
    }
    return Math.max(1.0 + ((thisLevel - targetLevel) / 20), 0.0);
}

Game_Action.prototype.itemEffectAddAttackState = function(target, effect) {
    this.subject().attackStates().forEach(function(stateId) {
        var chance = effect.value1;
        chance *= target.stateRate(stateId);
        chance *= this.subject().attackStatesRate(stateId);
        if(this.item().meta.ignore_level == null && target.isEnemy() != this.subject().isEnemy()) chance *= this.KIN_levelRate(target);
        if (Math.random() < chance) {
            target.addState(stateId);
            this.makeSuccess(target);
        }
    }.bind(this), target);
};

Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
    var chance = effect.value1;
    if (!this.isCertainHit()) {
        chance *= target.stateRate(effect.dataId);
        if(target.isEnemy() != this.subject().isEnemy()) chance *= this.KIN_levelRate(target);
    }
    if (Math.random() < chance) {
        target.addState(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemHit = function(target) {
    Kinoko_Hit.call(this,target);
    var hit = this.item().meta.hit;
    hit = parseInt(hit);
    if(!(hit>=0 || hit<=0)) hit = 0;
    if(target.isEnemy() == true && $gameVariables.value(104) == 1){
        if (this.isPhysical()) {
            hit -= Math.min(($gameVariables.value(105) - $gameVariables.value(106)) / 300, 50);
        } else {
            hit -= Math.min(($gameVariables.value(106) - $gameVariables.value(105)) / 300, 50);
        }
    }
    var stateid = this.item().meta.eff_state;
    stateid = parseInt(stateid);
    if(!(stateid>=0 || stateid<=0)) stateid = 0;
    if(stateid > 0){
        if(!this.subject().isStateAffected(stateid)) hit = 0;
    }
    if (this.isPhysical()) {
        return this.item().successRate * 0.01 * this.subject().hit + (hit * 0.01);
    } else {
        return this.item().successRate * 0.01 + (hit * 0.01);
    }
};

})();