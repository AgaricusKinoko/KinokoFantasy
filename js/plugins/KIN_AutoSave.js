//=============================================================================
// KIN_AutoSave.js
//=============================================================================

/*:ja
 * @plugindesc オートセーブ機能を導入します。
 *
 * @author Agaricus_Mushroom
 *
 * @param autoSaveSlot
 * @desc オートセーブ領域として使用するファイルID
 * デフォルト:1
 * @default 1
 *
 * @help
 * ※ 再定義が複数あるので、プラグインリスト上部に配置してください。
 * ～使い方～
 * 戦闘終了後に自動でゲームデータを保存します。
 * オートセーブ領域として指定したファイルIDのファイルには、
 * オートセーブ以外でセーブすることはできません。
 *
 * ・プラグインコマンド
 * AutoSave オートセーブを実行します。
 *
 * バグとか要望あればよろしく。
 */

(function() {

  var parameters = PluginManager.parameters('KIN_AutoSave');
  var saveSlot = Number(parameters['autoSaveSlot'] || 1);

  var _Game_Interpreter_pluginCommand =
          Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
      _Game_Interpreter_pluginCommand.call(this, command, args);
      if (command === 'AutoSave') {
        $gameSystem.onBeforeSave();
        DataManager.saveGame(saveSlot, true);
      }
  };

BattleManager.updateBattleEnd = function() {
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if ($gameParty.isAllDead()) {
        if (this._canLose) {
            $gameParty.reviveBattleMembers();
            SceneManager.pop();
        } else {
            SceneManager.goto(Scene_Gameover);
        }
    } else {
        SceneManager.pop();
    }
    this._phase = null;
    $gameParty._inBattle = false;
    $gameSystem.onBeforeSave();
    if(!$gameParty.isAllDead())DataManager.saveGame(saveSlot, true);
};

var DataManager_saveGame = DataManager.saveGame;
DataManager.saveGame = function(savefileId, isAutoSave) {
    var auto = isAutoSave || false;
    if(savefileId == saveSlot && !auto) return false;
    try {
        StorageManager.backup(savefileId);
        return this.saveGameWithoutRescue(savefileId, isAutoSave);
    } catch (e) {
        console.error(e);
        try {
            StorageManager.remove(savefileId);
            StorageManager.restoreBackup(savefileId);
        } catch (e2) {
        }
        return false;
    }
};

Window_SavefileList.prototype.drawItem = function(index) {
    var id = index + 1;
    var valid = DataManager.isThisGameFile(id);
    var info = DataManager.loadSavefileInfo(id);
    var rect = this.itemRectForText(index);
    this.resetTextColor();
    if (this._mode === 'load') {
        this.changePaintOpacity(valid);
    }
    if(this._mode === 'save' && id == saveSlot){
        this.changePaintOpacity(false);
    }
    this.drawFileId(id, rect.x, rect.y);
    if (info) {
      if(this._mode === 'save' && id == saveSlot){
          this.changePaintOpacity(false);
      } else {
        this.changePaintOpacity(valid);
      }
        this.drawContents(info, rect, valid, id);
    }
    this.changePaintOpacity(true);
};

Window_SavefileList.prototype.drawContents = function(info, rect, valid, id) {
    var bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);
        if(id && id == saveSlot){
          this.drawSaveFile(info, rect.x, rect.y + 32, rect.width - 192);
        }
        this.drawActorLevel(info, rect.x, rect.y + 64, rect.width - 192);
        if (valid) {
            this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
        }
    }
    var lineHeight = this.lineHeight();
    var y2 = bottom - lineHeight;
    if (y2 >= lineHeight) {
        this.drawPlaytime(info, rect.x, y2, rect.width);
    }
};

var KIN_saveFileId;
Window_SavefileList.prototype.drawSaveFile = function(info, x, y, width) {
    if (info.saveFileId) {
        KIN_saveFileId = info.saveFileId;
        this.changeTextColor(this.tpCostColor());
        this.drawText("*ファイル " + info.saveFileId, x, y, width);
        this.resetTextColor();
    }
};

Window_SavefileList.prototype.drawActorLevel = function(info, x, y, width) {
    if (info.level) {
        this.drawText("Lv. " + info.level, x, y, width);
    }
};

Window_SavefileList.prototype.drawFileId = function(id, x, y) {
    if(id == saveSlot){
      this.drawText("オートセーブ" + ' ' + "", x, y, 180);
    } else {
      if(id < saveSlot){
        this.drawText(TextManager.file + ' ' + (parseInt(id)), x, y, 180);
      } else {
        this.drawText(TextManager.file + ' ' + (parseInt(id)-1), x, y, 180);
      }
    }
};

DataManager.saveGameWithoutRescue = function(savefileId, isNotUpdate) {
    var notUpdate = isNotUpdate || false;
    var json = JsonEx.stringify(this.makeSaveContents());
    if (json.length >= 200000) {
        console.warn('Save data too big!');
    }
    StorageManager.save(savefileId, json);
    if(!notUpdate){
      this._lastAccessedId = savefileId;
    }
    var globalInfo = this.loadGlobalInfo() || [];
    globalInfo[savefileId] = this.makeSavefileInfo();
    this.saveGlobalInfo(globalInfo);
    return true;
};

DataManager.loadGameWithoutRescue = function(savefileId) {
    var globalInfo = this.loadGlobalInfo();
    if (this.isThisGameFile(savefileId)) {
        var json = StorageManager.load(savefileId);
        this.createGameObjects();
        this.extractSaveContents(JsonEx.parse(json));
        if(savefileId == saveSlot){
          $gameSwitches.setValue(661,true);
          if(KIN_saveFileId >= saveSlot){
            this._lastAccessedId = KIN_saveFileId + 1;
          } else {
            this._lastAccessedId = KIN_saveFileId;
          }
        } else {
          this._lastAccessedId = savefileId;
        }
        return true;
    } else {
        return false;
    }
};

DataManager.makeSavefileInfo = function() {
    var info = {};
    info.globalId   = this._globalId;
    if($dataMap.meta.saveName){
      info.title = $dataMap.meta.saveName;
    } else if($dataMap.displayName != ""){
      info.title = $dataMap.displayName;
    } else {
      info.title = $dataMapInfos[$gameMap._mapId].name;
    }
    info.characters = $gameParty.charactersForSavefile();
    info.faces      = $gameParty.facesForSavefile();
    info.playtime   = $gameSystem.playtimeText();
    info.level      = $gameParty.members()[0].level;
    if(DataManager.lastAccessedSavefileId() != saveSlot){
      if(DataManager.lastAccessedSavefileId() < saveSlot){
        info.saveFileId = DataManager.lastAccessedSavefileId();
      } else {
        info.saveFileId = DataManager.lastAccessedSavefileId() - 1;
      }
    } else if(KIN_saveFileId){
      info.saveFileId = KIN_saveFileId;
    }
    info.timestamp  = Date.now();
    return info;
};

})();
