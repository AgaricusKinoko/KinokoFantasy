//=============================================================================
// KIN_Quest.js
//=============================================================================

/*:ja
 * @plugindesc クエストシステムを導入します。
 *
 * @author Agaricus_Mushroom
 *
 * @param noteSwitch
 * @desc メニューにクエスト手帳を追加するスイッチ
 * デフォルト:1
 * @default 1
 *
 * @help
 * バグとか要望あればよろしく。
 */

(function() {

  var KIN_questCategory = 'none';

  var parameters = PluginManager.parameters('KIN_Quest');
  var techoSwitch = Number(parameters['noteSwitch'] || 1);

  var _Game_Interpreter_pluginCommand =
          Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
      _Game_Interpreter_pluginCommand.call(this, command, args);
      if (command === 'KinokoQuest') {
          switch (args[0]) {
          case 'refreshQuest':
              refreshQuest();
              break;
          case 'offerdOpen':
              KIN_questCategory = 'offerd';
              SceneManager.push(Scene_OfferdQuestList);
              break;
          case 'windowOpen':
              KIN_questCategory = 'window';
              switch (args[1]) {
                case 'helheim':
                  $gameParty._windowQuests = $gameParty._windowQuestsHelheim;
                  break;
                case 'smalldia':
                  $gameParty._windowQuests = $gameParty._windowQuestsSmalldia;
                  break;
                case 'kultbrucke':
                  $gameParty._windowQuests = $gameParty._windowQuestsKultbrucke;
                  break;
                case 'verbrennen':
                  $gameParty._windowQuests = $gameParty._windowQuestsVerbrennen;
                  break;
                case 'southport':
                  $gameParty._windowQuests = $gameParty._windowQuestsSouthport;
                  break;
              }
              SceneManager.push(Scene_OfferdQuestList);
              break;
          case 'reportOpen':
              KIN_questCategory = 'report';
              SceneManager.push(Scene_OfferdQuestList);
              break;
          }
      }
  };

  var Window_MenuCommand_prototype_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function() {
    Window_MenuCommand_prototype_addOriginalCommands.call(this);
    if($gameSwitches.value(techoSwitch)) this.addCommand("クエスト手帳", 'questtecho', true);
  };

  var Scene_Menu_prototype_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function() {
      Scene_Menu_prototype_createCommandWindow.call(this);
      if($gameSwitches.value(techoSwitch)) this._commandWindow.setHandler('questtecho',   this.commandQuesttecho.bind(this));
  };

  Scene_Menu.prototype.commandQuesttecho = function() {
      KIN_questCategory = 'offerd';
      SceneManager.push(Scene_OfferdQuestList);
  };

  Game_BattlerBase_prototype_die = Game_BattlerBase.prototype.die;
  Game_BattlerBase.prototype.die = function() {
      Game_BattlerBase_prototype_die.call(this);
      var id = this.enemyId();
      if(this.isEnemy() && $gameParty._offerdQuests){
        for(var i = 0; i < $gameParty._offerdQuests.length; i++){
          if($gameParty._offerdQuests[i] && $gameParty._offerdQuests[i].type == 1 && $gameParty._offerdQuests[i].purpose == id && $gameParty._offerdQuests[i].progress < $gameParty._offerdQuests[i].num){
            $gameParty._offerdQuests[i].progress += 1;
            break;
          }
        }
      }
  };

  function refreshQuest(){
    var quest = [];
    quest.push({
      title:"首都周辺のモンスター駆除",
      name:"首都警備隊",
      description:"首都周辺に住み着いている\nモンスターが住民に被害を\nもたらしている。特に被害の多い\n%sを%n体\n討伐してほしい。",
      type:1,
      questCorrection:1.5,
      purpose:null,
      purposeCan:[262,263,264,265],
      num:null,
      numMin:2,
      numMax:5,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:null
    });
    quest.push({
      title:"傷病者の手当て",
      name:"首都警備隊",
      description:"モンスターと戦い、傷ついた兵に\n与える薬品が不足している。\n%sを%n個\n提供してほしい。",
      type:2,
      questCorrection:2,
      purpose:null,
      purposeCan:[5,8,14,15,22,32,33,34,35,36,37,38,39],
      num:null,
      numMin:5,
      numMax:20,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:null
    });
    quest.push({
      title:"素材の調達",
      name:"首都警備隊",
      description:"前線で戦う兵のために\n支給する物資が不足している。\n至急、原料である\n%sを%n個\n調達してもらいたい。",
      type:3,
      questCorrection:1.5,
      purpose:null,
      purposeCan:[156,157],
      num:null,
      numMin:1,
      numMax:3,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:["2.19", "2.222", "2.355", null, null, null, null]
    });
    $gameParty._windowQuestsHelheim = makeQuest(quest);
    var quest = [];
    quest.push({
      title:"国境付近の治安維持",
      name:"スモルディア支部",
      description:"スモルディアに隣接する\nマウンテル高地は、ノーランド国境に\n隣接する重要な土地である。\nノーランドとの戦いに勝つには、\nマウンテル高地の安全を\n確保することが重要である。\nマウンテル高地に生息する\n%sを%n匹討伐し、\n治安の維持に協力してほしい。",
      type:1,
      questCorrection:1.5,
      purpose:null,
      purposeCan:[271,272],
      num:null,
      numMin:2,
      numMax:5,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:null
    });
    quest.push({
      title:"後方支援",
      name:"スモルディア支部",
      description:"ノーランド兵との戦いで\n怪我をしたウィンディア兵に\n与えなければならない薬品が\n不足している。\n至急、%sを%n個\n持ってきてほしい。",
      type:2,
      questCorrection:2,
      purpose:null,
      purposeCan:[8,9,15,15,18,22,39,40,42],
      num:null,
      numMin:5,
      numMax:20,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:null
    });
    quest.push({
      title:"軍需品の調達",
      name:"スモルディア支部",
      description:"来たるべきノーランドとの\n決戦に向け、急ピッチで\n軍備の拡張が進められている。\nしかし、増加する兵に対して\n物資の供給が追いついていないのが\n実情である。そこで、\n%sを%n個\n調達してもらいたい。",
      type:3,
      questCorrection:1.5,
      purpose:null,
      purposeCan:[159],
      num:null,
      numMin:1,
      numMax:3,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:["3.26", "3.27", "3.195", "3.196", "3.197", "3.346", "3.347", "3.348", null, null, null, null, null, null, null, null, null, null]
    });
    $gameParty._windowQuestsSmalldia = makeQuest(quest);
    var quest = [];
    quest.push({
      title:"モンスターの一掃",
      name:"カルトブリュッケ支部",
      description:"カルトブリュッケ周辺に\n生息するモンスター共を\n一掃せよ。手始めに\n%sを%n匹\n討伐するように。",
      type:1,
      questCorrection:1.5,
      purpose:null,
      purposeCan:[280,281,282,283],
      num:null,
      numMin:2,
      numMax:5,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:null
    });
    quest.push({
      title:"大規模モンスター掃討作戦",
      name:"カルトブリュッケ支部",
      description:"増え続けるモンスターに対し、\nノーランド政府が大規模な掃討作戦を\n開始した。傭兵にも協力を願う。\n%sを%n匹\n討伐するように。",
      type:1,
      questCorrection:1.7,
      purpose:null,
      purposeCan:[280,281,282,283],
      num:null,
      numMin:12,
      numMax:15,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:["2.21", "2.120", "2.225", "2.320", "2.358", "2.418"]
    });
    quest.push({
      title:"武具を求めて",
      name:"カルトブリュッケ支部",
      description:"ノーランド軍では\nモンスターの素材を使って\n武具の製造を試みている。試験用に\n%sを%n個\n調達せよ。",
      type:3,
      questCorrection:1.5,
      purpose:null,
      purposeCan:[160,161],
      num:null,
      numMin:1,
      numMax:3,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:["3.28", "3.29", "3.198", "3.199", "3.200", "3.349", "3.350", "3.351", null, null, null, null, null, null, null, null, null, null]
    });
    $gameParty._windowQuestsKultbrucke = makeQuest(quest);
    var quest = [];
    quest.push({
      title:"砂漠周辺の掃除",
      name:"フェアブレンネン支部",
      description:"フェアブレンネン周辺は\n憲兵も少なく、モンスターの被害が\n大きくなりつつある。\n冒険者は憲兵の手助けをし、\nフェアブレンネン周辺の\n安全を確保してほしい。\n手始めに%sを%n匹\n討伐してほしい。",
      type:1,
      questCorrection:2,
      purpose:null,
      purposeCan:[289,290,291,292,293],
      num:null,
      numMin:2,
      numMax:5,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:null
    });
    quest.push({
      title:"大規模モンスター掃討作戦II",
      name:"フェアブレンネン支部",
      description:"増え続けるモンスターに対し、\nノーランド政府が大規模な掃討作戦を\n開始した。傭兵にも協力を願う。\n%sを%n匹\n討伐するように。",
      type:1,
      questCorrection:2.5,
      purpose:null,
      purposeCan:[289,290,291,292,293],
      num:null,
      numMin:12,
      numMax:15,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:["2.21", "2.120", "2.225", "2.320", "2.358", "2.418"]
    });
    quest.push({
      title:"素材の研究",
      name:"フェアブレンネン支部",
      description:"フェアブレンネンでは\nモンスターの研究が盛んである。\n研究への協力のため、\n%sを%n個ほど\n調達してほしい。",
      type:3,
      questCorrection:2,
      purpose:null,
      purposeCan:[163,164,165],
      num:null,
      numMin:2,
      numMax:4,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:["3.28", "3.29", "3.198", "3.199", "3.200", "3.349", "3.350", "3.351", null, null, null, null]
    });
    $gameParty._windowQuestsVerbrennen  = makeQuest(quest);
    var quest = [];
    quest.push({
      title:"都市開発の障害を排除せよ",
      name:"サウス・ポート支部",
      description:"近年の人口増加に対応するため、\n南ワーテル平原の都市開発が\n進められている。しかし、\n増加するモンスターへの対応で\nあまり進んでいないのが実情である。\nそこで、傭兵へ協力を求めたい。\n%sを%n匹\n討伐し、障害を排除してもらいたい。",
      type:1,
      questCorrection:2,
      purpose:null,
      purposeCan:[299,300,301],
      num:null,
      numMin:2,
      numMax:5,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:null
    });
    quest.push({
      title:"馬車馬のように",
      name:"サウス・ポート支部",
      description:"都市開発に当たっている兵士が\n労働の疲れを訴えている。\n体力を回復し、労働に従事させるため\n%sを%n個\n調達してほしい。",
      type:2,
      questCorrection:2.5,
      purpose:null,
      purposeCan:[8,9,18,19,22,23,39,40,42,45],
      num:null,
      numMin:10,
      numMax:20,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:null
    });
    quest.push({
      title:"財源の確保",
      name:"サウス・ポート支部",
      description:"サウス・ポート周辺のモンスターの\n素材は他の町で高値で売れる。\n都市開発にかかる費用を\n少しでも賄うため、\n%sを%n個\n取ってきてもらいたい。",
      type:3,
      questCorrection:2,
      purpose:null,
      purposeCan:[166,167],
      num:null,
      numMin:2,
      numMax:4,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:["3.30", "3.31", "3.201", "3.202", "3.203", "3.352", "3.353", "3.354", null, null, null, null, null, null, null, null, null, null]
    });
    quest.push({
      title:"支配者を追い出せ",
      name:"サウス・ポート支部",
      description:"最近、各地で凶悪なモンスターによる\n被害が増加している。\n「フィールドの支配者」と呼ばれる\nモンスターを討伐し、住民への被害を\n減少させたい。\n%sを%n匹\n討伐してほしい。",
      type:1,
      questCorrection:2.5,
      purpose:null,
      purposeCan:[269,284],
      num:null,
      numMin:1,
      numMax:1,
      rewardExp:null,
      rewardMoney:null,
      rewardItem:null,
      rewardItemType:null,
      rewardItemCan:null
    });
    $gameParty._windowQuestsSouthport  = makeQuest(quest);
  }

  function makeQuest(quest){
    var questList = [];
    for(var i = 0; i < 5; i++){
      questList[i] = JSON.stringify(quest[parseInt(Math.random() * quest.length)]);
      questList[i] = JSON.parse(questList[i]);
      questList[i].id = i;
      questList[i].num = parseInt(Math.random() * (questList[i].numMax + 1 - questList[i].numMin) + questList[i].numMin);
      switch(questList[i].type){
        case 1:
          questList[i].purpose = $dataEnemies[questList[i].purposeCan[parseInt(Math.random() * questList[i].purposeCan.length)]].id;
          questList[i].rewardExp = parseInt($dataEnemies[questList[i].purpose].exp * questList[i].num * questList[i].questCorrection);
          questList[i].rewardMoney = parseInt($dataEnemies[questList[i].purpose].gold * questList[i].num * questList[i].questCorrection);
          break;
        case 2:
          questList[i].purpose = $dataItems[questList[i].purposeCan[parseInt(Math.random() * questList[i].purposeCan.length)]].id;
          questList[i].rewardMoney = parseInt($dataItems[questList[i].purpose].price * questList[i].num * questList[i].questCorrection);
          break;
        case 3:
          questList[i].purpose = $dataItems[questList[i].purposeCan[parseInt(Math.random() * questList[i].purposeCan.length)]].id;
          questList[i].rewardExp = parseInt(($dataItems[questList[i].purpose].meta.ItemLevel * $dataItems[questList[i].purpose].meta.ItemLevel * 1.75) * questList[i].num * questList[i].questCorrection);
          questList[i].rewardMoney = parseInt($dataItems[questList[i].purpose].price * questList[i].num * questList[i].questCorrection);
          break;
      }
      var item = null;
      if(questList[i].rewardItemCan)item = questList[i].rewardItemCan[parseInt(Math.random() * questList[i].rewardItemCan.length)];
      if(item){
        item = String(item);
        var itemType = item.split(".")[0];
        questList[i].rewardItemType = Number(itemType);
        var itemId = item.split(".")[1];
        switch(itemType){
          case '1':
            questList[i].rewardItem = $dataItems[itemId];
            break;
          case '2':
            questList[i].rewardItem = $dataWeapons[itemId];
            break;
          case '3':
            questList[i].rewardItem = $dataArmors[itemId];
            break;
        }
      }
    }
    return questList;
  }

//-----------------------------------------------------------------------------
// Scene_OfferdQuestList
//

function Scene_OfferdQuestList() {
    this.initialize.apply(this, arguments);
}

Scene_OfferdQuestList.prototype = Object.create(Scene_ItemBase.prototype);
Scene_OfferdQuestList.prototype.constructor = Scene_OfferdQuestList;

Scene_OfferdQuestList.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_OfferdQuestList.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createProgressWindow();
    this.createItemWindow();
};

Scene_OfferdQuestList.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help(1, 0, 0);
    this.addWindow(this._helpWindow);
    if(KIN_questCategory == 'offerd'){
      this._helpWindow.drawText("現在受注しているクエスト", 0, 0);
    } else if(KIN_questCategory == 'window'){
      this._helpWindow.drawText("受注するクエストを選択してください。", 0, 0);
    } else if(KIN_questCategory == 'report'){
      this._helpWindow.drawText("報告するクエストを選択してください。", 0, 0);
    }
};

Scene_OfferdQuestList.prototype.createSelectWindow = function() {
    this._selectWindow = new Window_selectWindow(Graphics.boxWidth / 2 - 120, Graphics.boxHeight / 2 - 54);
    this._selectWindow.setHandler('offer', this.offer.bind(this));
    this._selectWindow.setHandler('remove', this.remove.bind(this));
    this._selectWindow.setHandler('report', this.report.bind(this));
    this._selectWindow.setHandler('cancel', this.none.bind(this));
    this.addWindow(this._selectWindow);
    if(KIN_questCategory == 'offerd')this._selectWindow.select(1);
};

Scene_OfferdQuestList.prototype.offer = function() {
    if(!$gameParty._offerdQuests) $gameParty._offerdQuests = [];
    $gameParty._offerdQuests.push(this._itemWindow.item());
    $gameParty._offerdQuests[$gameParty._offerdQuests.length -1].progress = 0;
    $gameParty._windowQuests[this._itemWindow.item().id] = null;
    $gameParty._offerdQuests[$gameParty._offerdQuests.length -1].id = $gameParty._offerdQuests.length -1;
    if(this._itemWindow.index() != 0 && this._itemWindow.index() == this._itemWindow._data.length -1) this._itemWindow.select(this._itemWindow.index() -1);
    this.removeSelectWindow();
    this._itemWindow.refresh();
    this._itemWindow.activate();
};

Scene_OfferdQuestList.prototype.remove = function() {
    $gameParty._offerdQuests[this._itemWindow.item().id] = null;
    this.removeSelectWindow();
    this._itemWindow.refresh();
    this._itemWindow.activate();
};

Scene_OfferdQuestList.prototype.report = function() {
    if($gameParty._offerdQuests[this._itemWindow.item().id].type == 2 || $gameParty._offerdQuests[this._itemWindow.item().id].type == 3){
      $gameParty.gainItem($dataItems[$gameParty._offerdQuests[this._itemWindow.item().id].purpose], -$gameParty._offerdQuests[this._itemWindow.item().id].num);
    }
    if($gameParty._offerdQuests[this._itemWindow.item().id].rewardExp)$gameVariables.setValue(326, $gameVariables.value(326) + $gameParty._offerdQuests[this._itemWindow.item().id].rewardExp);
    if($gameParty._offerdQuests[this._itemWindow.item().id].rewardMoney)$gameParty.gainGold($gameParty._offerdQuests[this._itemWindow.item().id].rewardMoney);
    var window = this;
    if($gameParty._offerdQuests[this._itemWindow.item().id].rewardItem){
      switch($gameParty._offerdQuests[this._itemWindow.item().id].rewardItemType){
        case 1:
          $gameParty.gainItem($dataItems[$gameParty._offerdQuests[window._itemWindow.item().id].rewardItem.id], 1);
          break;
        case 2:
          $gameParty.gainItem($dataWeapons[$gameParty._offerdQuests[window._itemWindow.item().id].rewardItem.id], 1);
          break;
        case 3:
          $gameParty.gainItem($dataArmors[$gameParty._offerdQuests[window._itemWindow.item().id].rewardItem.id], 1);
          break;
      }
    }
    AudioManager.playSe({"name": "Coin", "volume": 90, "pitch": 100, "pan": 0});
    $gameParty._offerdQuests[this._itemWindow.item().id] = null;
    if(this._itemWindow.index() != 0 && this._itemWindow.index() == this._itemWindow._data.length -1) this._itemWindow.select(this._itemWindow.index() -1);
    this.removeSelectWindow();
    this._itemWindow.refresh();
    this._itemWindow.activate();
};

Scene_OfferdQuestList.prototype.none = function() {
    this.removeSelectWindow();
    this._itemWindow.refresh();
    this._itemWindow.activate();
};

Scene_OfferdQuestList.prototype.removeSelectWindow = function() {
    this._selectWindow.close();
};

Scene_OfferdQuestList.prototype.createProgressWindow = function() {
    var wy = this._helpWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._progressWindow = new Window_Base(300, wy, 516, wh);
    this.addWindow(this._progressWindow);
};

Scene_OfferdQuestList.prototype.createItemWindow = function() {
    var wy = this._helpWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_QuestList(0, wy, 300, wh);
    this._itemWindow.setHelpWindow(this._progressWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.endScene.bind(this));
    this.addWindow(this._itemWindow);
    this._itemWindow.refresh();
    this._itemWindow.activate();
    this._itemWindow.select(this._itemWindow._data.length >= 1 ? 0 : -1);
};

Scene_OfferdQuestList.prototype.endScene = function() {
    this.popScene.call(this);
};

Scene_OfferdQuestList.prototype.onItemOk = function() {
    if(this._itemWindow.item()){
      this.createSelectWindow();
      this._selectWindow.refresh();
      this._selectWindow.activate();
    } else {
      this._itemWindow.refresh();
      this._itemWindow.activate();
    }
};

//-----------------------------------------------------------------------------
// Window_QuestList
//

function Window_QuestList() {
    this.initialize.apply(this, arguments);
}

Window_QuestList.prototype = Object.create(Window_Selectable.prototype);
Window_QuestList.prototype.constructor = Window_QuestList;

Window_QuestList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._data = [];
    this._parent = parent;
    this.refresh();
};

Window_QuestList.prototype.maxCols = function() {
    return 1;
};

Window_QuestList.prototype.spacing = function() {
    return 48;
};

Window_QuestList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_QuestList.prototype.item = function() {
    var index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_QuestList.prototype.isCurrentItemEnabled = function() {
    return true;
};

Window_QuestList.prototype.needsNumber = function() {
    return true;
};

Window_QuestList.prototype.makeQuestList = function() {
    switch(KIN_questCategory){
      case 'offerd':
        if(!$gameParty._offerdQuests) $gameParty._offerdQuests = [];
        this._data = $gameParty._offerdQuests.filter(function(data){
          if(data) return data;
        });
        break;
      case 'report':
        if(!$gameParty._offerdQuests) $gameParty._offerdQuests = [];
        this._data = $gameParty._offerdQuests.filter(function(data){
          if(data){
            if(data.type == 2 || data.type == 3){
              data.progress = $gameParty.numItems($dataItems[data.purpose]);
            }
            if(data.progress >= data.num)return data;
          }
        });
        break;
      case 'window':
        if(!$gameParty._windowQuests) $gameParty._windowQuests = [];
        this._data = $gameParty._windowQuests.filter(function(data){
          if(data) return data;
        });
        break;
    }
};

Window_QuestList.prototype.selectLast = function() {
    var index = this._data.indexOf($gameParty.lastItem());
    this.select(index >= 0 ? index : 0);
};

Window_QuestList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
      var numberWidth = this.numberWidth();
      var rect = this.itemRect(index);
      rect.width -= this.textPadding();
      if(item.type == 2 || item.type == 3){
        item.progress = $gameParty.numItems($dataItems[item.purpose]);
      }
      if(KIN_questCategory != 'window' && item.progress >= item.num) this.changeTextColor(this.textColor(3));
      this.drawText(item.title, rect.x, rect.y, rect.width - numberWidth);
      this.resetFontSettings()
    }
};

Window_QuestList.prototype.numberWidth = function() {
    return this.textWidth('000');
};

Window_QuestList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};

Window_QuestList.prototype.updateHelp = function() {
    this.setProgressWindowItem(this.item());
};

Window_QuestList.prototype.refresh = function() {
    this.makeQuestList();
    this.createContents();
    this.drawAllItems();
    if(this.index() > this._data.length -1){
      this.select(this._data.length -1);
    }
};

Window_Selectable.prototype.setProgressWindowItem = function(item) {
    if (this._helpWindow) {
        this._helpWindow.contents.clear();
        if(item){
          this.drawDescription(item, 0, 0);
        } else if(this._data.length == 0){
          switch(KIN_questCategory){
            case 'offerd':
              this._helpWindow.drawText("受注しているクエストはありません。", 516 / 2 - this.standardFontSize() * 18 / 2, (Graphics.boxHeight - 72) / 2 - this.lineHeight());
              break;
            case 'report':
              this._helpWindow.drawText("報告できるクエストはありません。", 516 / 2 - this.standardFontSize() * 17 / 2, (Graphics.boxHeight - 72) / 2 - this.lineHeight());
              break;
            case 'window':
              this._helpWindow.drawText("受注できるクエストはありません。", 516 / 2 - this.standardFontSize() * 17 / 2, (Graphics.boxHeight - 72) / 2 - this.lineHeight());
              break;
          }
        }
    }
};

Window_Selectable.prototype.drawDescription = function(item) {
    var window = this._helpWindow;
    //window.drawText("【目的】", 0, 0);
    var texts = item.description.split("\n");
    var line = 0;
    var lineHeight = this.lineHeight();
    var size = this.standardFontSize();
    var target;
    texts.forEach(function(text){
      var textCount = 0;
      if(text.indexOf("%s") >= 0){
        var maeText = text.substring(0, text.indexOf("%s"))
        target = item.purpose;
        text = text.substring(text.indexOf("%s") + 2);
        window.drawText(maeText, textCount * size, line * lineHeight);
        textCount += maeText.length;
        switch(item.type){
          case 1:
            target = $dataEnemies[target].name;
            target = target.replace("★★★","");
            window.changeTextColor(window.textColor(14));
            break;
          case 2:
            target = $dataItems[target].name;
            window.changeTextColor(window.mpCostColor());
            break;
          case 3:
            target = $dataItems[target].name;
            window.changeTextColor(window.mpCostColor());
            break;
        }
        window.drawText(target, textCount * size, line * lineHeight);
        window.resetFontSettings();
        textCount += target.length;
      }
      if(text.indexOf("%n") >= 0){
        var maeText = text.substring(0, text.indexOf("%n"))
        num = String(item.num);
        text = text.substring(text.indexOf("%n") + 2);
        window.drawText(maeText, textCount * size, line * lineHeight);
        textCount += maeText.length;
        window.changeTextColor(window.textColor(2));
        window.drawText(num, textCount * size, line * lineHeight);
        window.resetFontSettings();
        textCount += num.length / 2;
      }
      window.drawText(text, textCount * size, line * lineHeight);
      line++;
    });
    window.drawText("【報酬】", 0, line * lineHeight);
    line++;
    if(item.rewardExp){
      window.changeTextColor(window.textColor(4));
      window.drawText(item.rewardExp + "EXP", 0, line * lineHeight);
      line++;
    }
    if(item.rewardMoney){
      window.changeTextColor(window.textColor(6));
      window.drawText(item.rewardMoney + "G", 0, line * lineHeight);
      line++;
    }
    if(item.rewardItem){
      window.changeTextColor(window.mpCostColor());
      window.drawText(item.rewardItem.name, 0, line * lineHeight);
      line++;
    }
    window.resetFontSettings();
    if(KIN_questCategory == 'offerd' || KIN_questCategory == 'report'){
      window.drawText("【進捗】", 0, line * lineHeight);
      line++;
      switch(item.type){
        case 1:
          window.changeTextColor(window.textColor(14));
          break;
        case 2:
          window.changeTextColor(window.mpCostColor());
          break;
        case 3:
          window.changeTextColor(window.mpCostColor());
          break;
      }
      window.drawText(target, 0, line * lineHeight);
      window.resetFontSettings();
      window.drawText(" " + item.progress + "/" + item.num, target.length * size, line * lineHeight);
      line++;
      /*if(item.progress >= item.num){
        window.changeTextColor(window.textColor(17));
        window.drawText("<<COMPLETED!!>>", 516 / 2 - size * 18 / 2 / 2, line * lineHeight);
        line++;
      }*/
    }
    window.resetFontSettings();
};

//-----------------------------------------------------------------------------
// Window_selectWindow
//

function Window_selectWindow() {
    this.initialize.apply(this, arguments);
}

Window_selectWindow.prototype = Object.create(Window_HorzCommand.prototype);
Window_selectWindow.prototype.constructor = Window_selectWindow;

Window_selectWindow.prototype.initialize = function (x, y) {
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};

Window_selectWindow.prototype.makeCommandList = function () {
    if(KIN_questCategory == 'window')this.addCommand("受注", 'offer', this._offer);
    if(KIN_questCategory == 'offerd')this.addCommand("破棄", 'remove', this._remove);
    if(KIN_questCategory == 'report')this.addCommand("報告", 'report', this._report);
    this.addCommand("何もしない", 'cancel', this._none);
};

Window_selectWindow.prototype.numVisibleRows = function() {
    return 2;
};

Window_selectWindow.prototype.maxCols = function () {
    return 1;
};

})();
