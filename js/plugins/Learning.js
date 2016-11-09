//
//  ラーニング ver1.00
//
// author yana
//

var Imported = Imported || {};
Imported['Learning'] = 1.00;

/*:
 * @plugindesc ver1.00/敵の攻撃を受けた時、その技を元にスキルを習得する機能を追加します。
 * @author Yana
 * 
 * @param Learning Skill Shared
 * @desc ラーニングしたスキルをパーティで共用するかの設定です。
 * @default true
 * 
 * @param Miss Learning
 * @desc スキルがミスした時、ラーニングできるかの設定です。
 * @default true
 * 
 * @param Evaded Learning
 * @desc スキルを回避した時、ラーニングできるかの設定です。
 * @default true
 * 
 * @param Instant Learning
 * @desc スキルをラーニングした時、即時習得するかの設定です。
 * @default true
 * 
 * @param Watch Learning
 * @desc スキルを見るだけでラーニングできるかの設定です。
 * @default true
 * 
 * @param Display Learning Text
 * @desc ラーニングした時にログに表示するメッセージです。
 * @default _nameは_skillをラーニング！
 * 
 * @param Display　Learning Text Shared
 * @desc ラーニングした時にログに表示するメッセージです。共用設定用です。
 * @default _skillをラーニング！
 * 
 * @param Log Color
 * @desc ラーニング表示のログカラーです。
 * @default 4
 * 
 * @param Play SE Name
 * @desc ラーニングした時に鳴らすSEのファイル名です。
 * @default Flash2
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Play SE Params
 * @desc ラーニングした時に鳴らすSEのパラメータです。
 * パン、ピッチ、ボリュームの順で指定してください。
 * @default 0,100,100
 * 
 * @param Info Text
 * @desc 入手インフォメーションが入っている場合、表示されるテキストです。。
 * @default _actorは「\i[_icon]_name」をラーニング！
 * 
 * @help------------------------------------------------------
 *  プラグインコマンドはありません。
 * ------------------------------------------------------
 * ------------------------------------------------------ 
 * 設定方法
 * ------------------------------------------------------
 * スキルのメモ欄に
 * <ラーニング スキルID,習得率%>
 * と記述します。
 * 
 * そのスキルをラーニング能力を持ったアクターが受けたとき、または、設定によっては
 * 見るだけで習得率%の確率で設定し たIDのスキルを習得します。
 * ラーニング能力は特徴オブジェクト(アクター,クラス,装備,ステートなど)のメモ欄に
 * <ラーニング能力>
 * と記述することで設定することができます。
 * 
 * また、特徴オブジェクト(アクター,クラス,装備,ステートなど)のメモ欄に
 * <ラーニング率補正:[+-]補正率>
 * と記述することで、ラーニング率を補正する特徴を設定することができます。
 * この補正率はそれぞれ加算で計算され、元の習得率に乗算されます。
 * ------------------------------------------------------
 * 利用規約
 * ------------------------------------------------------ 
 * 使用に制限はありません。商用、アダルト、いずれにも使用できます。
 * 二次配布も制限はしませんが、サポートは行いません。
 * 著作表示は任意です。行わなくても利用できます。
 * 要するに、特に規約はありません。
 * バグ報告や使用方法等のお問合せはネ実ツクールスレ、または、Twitterにお願いします。
 * https://twitter.com/yanatsuki_
 * 素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.00:
 * 公開
 */

(function(){	
	////////////////////////////////////////////////////////////////////////////////////
	
	var parameters = PluginManager.parameters('Learning');
	var learningSkillShared = String(parameters['Learning Skill Shared']) === 'true';
	var missLearning = String(parameters['Miss Learning']) === 'true';
	var evadedLearning = String(parameters['Evaded Learning']) === 'true';
	var instantLearning = String(parameters['Instant Learning']) === 'true';
	var watchLearning = String(parameters['Watch Learning']) === 'true';
	var displayLearningText = String(parameters['Display Learning Text'] || '_nameは_skillをラーニング！');
	var displayLearningTextShared = String(parameters['Display Learning Text Shared'] || '_skillをラーニング！');
	var logColor = Number(parameters['Log Color'] || 4);
	var playSEName = String(parameters['Play SE Name'] || '');
	var playSEParams = String(parameters['Play SE Params'] || '');
	var infoText = String(parameters['Info Text'] || '');
	
	////////////////////////////////////////////////////////////////////////////////////
	
	var _L_BManager_gainRewards = BattleManager.gainRewards;
	BattleManager.gainRewards = function() {
		this.showLearningSkills();
		_L_BManager_gainRewards.call(this);
	};
	
	BattleManager.showLearningSkills = function() {
		if (!this._learningList){ return }
		var length = this._learningList.length;
		for (var i=0;i<length;i++){
			var l = this._learningList[i];
			var actor = $gameActors.actor(l[0]);
			var skill = $dataSkills[l[1]];
			var text;
			if (learningSkillShared){
				text = displayLearningTextShared;
				$gameParty.addLearningSkill(l[1]);
				$gameParty.refreshLearning();
			} else {
				text = displayLearningText;
				actor.learnSkill(l[1]);
			}
			text = text.replace(/_name/,actor.name());
			text = text.replace(/_skill/,skill.name);
			if (i === 0){ $gameMessage.newPage() }
			$gameMessage.add('\\.' + text);
		}
		this._learningList = null;
	};
	
	var _L_BManager_startAction = BattleManager.startAction;
	BattleManager.startAction = function() {
		this._checkLearns = [];
		_L_BManager_startAction.call(this);
		if ($gameTemp._learnings && $gameTemp._learnings.length > 0 && learningSkillShared){
			var length = $gameTemp._learnings.length;
			for (var i=0;i<length;i++){
				var l = $gameTemp._learnings[i];
				this._logWindow.displayLearning(l[0],$dataSkills[l[1]]);
			}
			$gameTemp._learnings = [];
		}
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	DataManager.isLearningSkill = function(skill){
		if (this.isSkill(skill)){
			if (!skill._learningSkills){ this.initLearningSkill(skill) }
			return skill._learningSkills.length > 0;
		} else {
			return false;
		}
	};
	
	DataManager.initLearningSkill = function(skill){
		var result = [];
		var texts = skill.note.split('\n');
		var length = texts.length;
		for (var i=0;i<length;i++){
			var text = texts[i];
			if (text.match(/[<＜](?:ラーニング|LEARNING)\s*(\d+)[,，](\d+)[%％]?[>＞]/)){
				result.push({'skill':Number(RegExp.$1),'rate':Number(RegExp.$2)});
			}
		}
		skill._learningSkills = result;
	}
	
	DataManager.learningSupply = function(item){
		if (!item){ return 0 }
		if (item.meta['LEARNING_RATE_SUP']){ return Number(item.meta['LEARNING_RATE_SUP']) }
		if (item.meta['ラーニング率補正']){ return Number(item.meta['ラーニング率補正']) }
		return 0;
	};
	
	DataManager.isLearningObject = function(obj){
		if (!obj){ return false }
		if (obj._learningObject === undefined){
			obj._learningObject = obj.note.match(/[<＜](?:ラーニング能力|LEARNING_ABILITY)[>＞]/);
		}
		return obj._learningObject;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	Game_BattlerBase.prototype.isEnableLearning = function() {
		return false;
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	var _L_GAction_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
		_L_GAction_apply.call(this,target);
		this.processLearning(target);
	};
	
	Game_Action.prototype.processLearning = function(target){
		if (this.subject().isActor()){ return }
		if (target.result.missed && !missLearning){ return }
		if (target.result.evaded && !evadedLearning){ return }
		if (!DataManager.isLearningSkill(this.item())){ return }
		if (!$gameTemp._learnings){ $gameTemp._learnings = [] }
		
		var targets = [target];
		if (watchLearning){ targets = $gameParty.battleMembers() }
		var l1 = targets.length;
		for (var i=0;i<l1;i++){
			var m = targets[i];
			if (BattleManager._checkLearns){
				if (BattleManager._checkLearns.contains(m)){ continue }
				BattleManager._checkLearns.push(m);
			}
			if (!m.isEnableLearning()){ continue }
			var l2 = this.item()._learningSkills.length;
			for (var j=0;j<l2;j++){
				var ls = this.item()._learningSkills[j];
				if (!m.isLearnedSkill(ls['skill'])){
					if (Math.random() < ((ls['rate'] / 100) * (m.learningSupply() / 100))){
						if (instantLearning){
							$gameTemp._learnings.push([m,ls['skill']]);
							if (learningSkillShared){
								$gameParty.addLearningSkill(ls['skill']);
								$gameParty.refreshLearning();
							} else {
								m.learnSkill(ls['skill']);
							}
						} else {
							if (BattleManager._learningList === undefined){ BattleManager._learningList = [] }
							var r = [m.actorId(),ls['skill']];
							if (BattleManager._learningList.contains(r)){ continue }
							BattleManager._learningList.push(r);
						}
					}
				}
			}
		}
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	Game_Actor.prototype.isEnableLearning = function() {
		var objects = this.traitObjects();
		var length = objects.length;
		for (var i=0;i<length;i++){
			if (DataManager.isLearningObject(objects[i])){ return true }
		}
		return false;
	};
	
	Game_Actor.prototype.learningSupply = function() {
		var r = 100;
		var objects = this.traitObjects();
		var length = objects.length;
		for (var i=0;i<length;i++){ r += DataManager.learningSupply(objects[i]) }
		return r;
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	Game_Party.prototype.addLearningSkill = function(skillId) {
		if (this._learningSkills === undefined){ this._learningSkills = [] }
		if (!this._learningSkills.contains(skillId)){ this._learningSkills.push(skillId) }
	};
	
	Game_Party.prototype.refreshLearning = function() {
		if (!this._learningSkills){ return }
		var length = this._learningSkills.length;
		for (var i=0;i<length;i++){
			var skillId = this._learningSkills[i];
			this.allMembers().forEach(function(actor){
				if (actor && !actor.isLearnedSkill(skillId)){
					actor.learnSkill(skillId)
				}
			});
		}
	};
	
	var _L_GParty_addActor = Game_Party.prototype.addActor;
	Game_Party.prototype.addActor = function(actorId){
		_L_GParty_addActor.call(this,actorId);
		this.refreshLearning();
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	Window_BattleLog.prototype.displayLearning = function(actor,skill) {
    	var fmt;
    	if (learningSkillShared){
    		fmt = displayLearningTextShared;
    		fmt = fmt.replace('_name',actor.name());
    		fmt = fmt.replace('_skill',skill.name);
    	} else {
    		fmt = displayLearningText;
    		fmt = fmt.replace('_name',actor.name());
    		fmt = fmt.replace('_skill',skill.name);
    	}
    	if (playSEName){
    		var se = {'name':'','pan':0,'pitch':100,'volume':100}
    		var setting = [playSEName];
    		setting = setting.concat(playSEParams.split(','));
    		se['name'] = setting[0];
    		se['pan'] = Number(setting[1]);
    		se['pitch'] = Number(setting[2]);
    		se['volume'] = Number(setting[3]);
    		AudioManager.playStaticSe(se);
    	}
    	fmt = '\\C[' + logColor + ']' + fmt;
    	this.push('addText', fmt);
	};
	
	var _L_WBattleLog_displayFailure = Window_BattleLog.prototype.displayFailure;
	Window_BattleLog.prototype.displayFailure = function(target){
		_L_WBattleLog_displayFailure.call(this,target);
		if ($gameTemp._learnings && $gameTemp._learnings.length > 0 && !learningSkillShared){
			var length = $gameTemp._learnings.length;
			for (var i=0;i<length;i++){
				var l = $gameTemp._learnings[i];
				this.displayLearning(l[0],$dataSkills[l[1]]);
			}
			$gameTemp._learnings = [];
		}
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	if (Imported['GetInformation'] && Imported['GetInformation'] >= 1.04){
	var _L_WBattleLog_displayLearning = Window_BattleLog.prototype.displayLearning;
	Window_BattleLog.prototype.displayLearning = function(actor,skill) {
		_L_WBattleLog_displayLearning.call(this,actor,skill);
			console.log(CommonPopupManager.popEnable(),!!infoText)
		if (CommonPopupManager.popEnable() && !!infoText) {
			CommonPopupManager.showInfo(skill, infoText, 'learning', actor._name);
		}	
	}
	}
	
}());