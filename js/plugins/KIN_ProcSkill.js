﻿//=============================================================================
// KIN_ProcSkill.js
//=============================================================================

/*:ja
 * @plugindesc PROCするスキルを作成出来ます。
 *
 * @author Agaricus_Mushroom
 *
 * @param proc_sound
 * @desc PROCした際のSEを設定します。
 * (デフォルト = Up4)
 * @default Up4
 *
 * @help ～使い方～
 * PROCスキルを作りたい場合は、スキルのメモ欄に以下の記述をします。
 *
 * <proc_state:X>…X=PROCした際に発生するステートID
 * <proc_target:X>…X=PROCする対象。0=自分 1=スキルの対象
 * <proc_proba:X>…X=PROC確率
 * <proc_critical:X>…X=PROCにクリティカルを必要とするか。0=不要 1=必要
 *
 *（<proc_target:X>や<proc_critical:X>を省略した場合、0として扱います。）
 *
 * バグとか要望あればよろしく。
 */

(function() {

var parameters = PluginManager.parameters('KIN_ProcSkill');
var sound = String(parameters['proc_sound'] || 'up4');

var Kinoko_Apply2 = Game_Action.prototype.apply;

Game_Action.prototype.apply = function(target) {
    Kinoko_Apply2.call(this,target);
    var isSoundPlay = false;
    var result = target.result();
    var item = this.item();
    var a = this.subject();
    var procStateArray = (item.meta.proc_state || "0").split(",");
    var procTargetArray = (item.meta.proc_tartget || "0").split(",");
    var procProbaArray = (item.meta.proc_proba || "0").split(",");
    var procCriticalArray = (item.meta.proc_critical || "0").split(",");
    var procConditionsArray = (item.meta.proc_conditions || "0").split(",");
    for(var i = 0; i < procStateArray.length; i++){
        var proc_state = procStateArray[i];
        var proc_target = procTargetArray[i];
        var proc_proba = procProbaArray[i];
        var proc_critical = procCriticalArray[i];
        var proc_conditions = procConditionsArray[i];
        if(result.isHit() || item.meta.deadTarget){
            if(proc_conditions > 0 && a.isStateAffected(proc_conditions) == false) continue;
            if(proc_conditions > 0) a.removeState(proc_conditions);
            if(Math.random() < proc_proba){
                if(proc_critical == 1){
                    if(result.critical){
                        if(!isSoundPlay)this.playProcSound();
                        if(proc_target == 1){
                            target.addState(proc_state);
                        } else {
                            a.addState(proc_state);
                        }
                    }
                } else {
                    if(!isSoundPlay)this.playProcSound();
                    if(proc_target == 1){
                        target.addState(proc_state);
                    } else {
                        a.addState(proc_state);
                    }
                }
            }
        }
    }
};

Game_Action.prototype.playProcSound = function() {
    if (sound === '') return;
    var procSound = {
      name:   sound,
      volume: 90,
      pitch:  100,
      pan:    0
    };
    AudioManager.playSe(procSound);
};

})();
