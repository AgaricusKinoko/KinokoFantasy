//=============================================================================
// Yanfly Engine Plugins - Gamepad Config
// GamepadConfig.js
// Version: 1.00
//=============================================================================

var Imported = Imported || {};
Imported.GamepadConfig = true;

var Yanfly = Yanfly || {};
Yanfly.GamepadConfig = Yanfly.GamepadConfig || {};

//=============================================================================
 /*:
 * @plugindesc Allows players to adjust their button configuration
 * for gamepads.
 * @author Yanfly Engine Plugins
 *
 * @param Command Name
 * @desc This is the option name that appears in the main menu.
 * @default Gamepad Config
 *
 * @param Button Name
 * @desc This is how a button name will appear in the config menu.
 * @default Button %1
 *
 * @param OK Button
 * @desc This is the command name for the OK button.
 * @default OK / Talk
 *
 * @param OK Help
 * @desc This is the help description for the OK button.
 * @default Used to accept menu actions and talk to people.
 *
 * @param Cancel Button
 * @desc Cancel Button
 * @desc This is the command name for the Cancel button.
 * @default Cancel
 *
 * @param Cancel Help
 * @desc This is the help description for the Cancel button.
 * @default Used to cancel menu actions.
 *
 * @param Shift Button
 * @desc This is the command name for the Shift button.
 * @default Dash
 *
 * @param Shift Help
 * @desc This is the help description for the Shift button.
 * @default Hold this button to dash on the field.
 *
 * @param Menu Button
 * @desc This is the command name for the Menu button.
 * @default Menu
 *
 * @param Menu Help
 * @desc This is the help description for the Menu button.
 * @default Access the Main Menu from the field.
 *
 * @param PageUp Button
 * @desc This is the command name for the Page Up button.
 * @default Page Up
 *
 * @param PageUp Help
 * @desc This is the help description for the Page Up button.
 * @default Use it to quickly scroll up menus.
 *
 * @param PageDown Button
 * @desc This is the command name for the Page Down button.
 * @default Page Down
 *
 * @param PageDown Help
 * @desc This is the help description for the Page Down button.
 * @default Use it to quickly scroll down menus.
 *
 * @param Reset Default
 * @desc This is the command name to reset the config to default.
 * @default Reset to Default
 *
 * @param Reset Help
 * @desc This is the help description for the Reset button.
 * @default Returns your controller to default settings.
 *
 * @param Finish Config
 * @desc This is the command name for the finish button.
 * @default Finish Configuration
 *
 * @param Finish Help
 * @desc This is the help description for the Finish button.
 * @default Are you done configuring your gamepad?
 *
 * @help
 * Adds a "Gamepad Config" option to the Options Menu if a gamepad is detected.
 * Players can then adjust the button configuration to their liking and it will
 * be loaded automatically each time they play the game. Keep in mind that if
 * at any point where a Gamepad is not detected inside of the Option or Gamepad
 * Config menu, the game will automatically eject the player out the prevent
 * the player from being locked inside.
 */

 /*:ja
 * @plugindesc ゲームパッドのボタンコンフィグを
 * プレイヤーが設定出来るようにします。
 * @author Yanfly Engine Plugins
 *
 * @param Command Name
 * @desc オプション画面のメニューに表示するコマンド名です。
 * @default ゲームパッドの設定
 *
 * @param Button Name
 * @desc 設定したボタンの表示方法です。%1はボタン番号を表します。
 * @default Button %1
 *
 * @param OK Button
 * @desc 決定ボタンの名前です。
 * @default 決定／話しかける
 *
 * @param OK Help
 * @desc 決定ボタンの役割を説明する場合、ここに記入します。
 * 記入した文章は、画面上部のヘルプウィンドウに描画されます。
 * @default コマンドの決定や、話しかける際に使用します。
 *
 * @param Cancel Button
 * @desc キャンセルボタンの名前です。
 * @default キャンセル
 *
 * @param Cancel Help
 * @desc キャンセルボタンの役割を説明する場合、ここに記入します。
 * 記入した文章は、画面上部のヘルプウィンドウに描画されます。
 * @default コマンドをキャンセルする際に使用します。
 *
 * @param Shift Button
 * @desc ダッシュボタンの名前です。
 * @default ダッシュ
 *
 * @param Shift Help
 * @desc ダッシュボタンの役割を説明する場合、ここに記入します。
 * 記入した文章は、画面上部のヘルプウィンドウに描画されます。
 * @default このボタンを押しっぱなしにすると、\nフィールド画面での移動が速くなります。
 *
 * @param Menu Button
 * @desc メニューボタンの名前です。
 * @default メニュー
 *
 * @param Menu Help
 * @desc メニューボタンの役割を説明する場合、ここに記入します。
 * 記入した文章は、画面上部のヘルプウィンドウに描画されます。
 * @default フィールド画面で、メニュー画面を開きます。
 *
 * @param PageUp Button
 * @desc ページアップボタンの名前です。
 * @default ページアップ
 *
 * @param PageUp Help
 * @desc ページアップボタンの役割を説明する場合、ここに記入します。
 * 記入した文章は、画面上部のヘルプウィンドウに描画されます。
 * @default 選択画面で、上に大きくスクロールすることが出来ます。
 *
 * @param PageDown Button
 * @desc ページダウンボタンの名前です。
 * @default ページダウン
 *
 * @param PageDown Help
 * @desc ページダウンボタンの役割を説明する場合、ここに記入します。
 * 記入した文章は、画面上部のヘルプウィンドウに描画されます。
 * @default 選択画面で、下に大きくスクロールすることが出来ます。
 *
 * @param Reset Default
 * @desc 初期化コマンドの名前です。
 * @default 初期化
 *
 * @param Reset Help
 * @desc 初期化コマンドの役割を説明する場合、ここに記入します。
 * 記入した文章は、画面上部のヘルプウィンドウに描画されます。
 * @default ゲームパッドの設定を初期状態に戻します。
 *
 * @param Finish Config
 * @desc 設定完了コマンドの名前です。
 * @default 設定完了
 *
 * @param Finish Help
 * @desc 設定完了コマンドの役割を説明する場合、ここに記入します。
 * 記入した文章は、画面上部のヘルプウィンドウに描画されます。
 * @default ゲームパッドの設定を完了します。
 *
 * @help
 * このプラグインは、ゲームパッドを検出すると、
 * オプションに「ゲームパッドの設定」を追加します。
 * プレイヤーは、自分の好みに合わせたボタン設定をする事が出来ます。
 * 設定したボタンは、ゲームを終了しても保持され、起動した際に読み込まれます。
 *
 * 設定中にゲームパッドの接続が切断された場合、その時点の設定が保存され、
 * 自動的に設定画面を閉じます。
 * 
 * ※キノコ訳の当プラグインの追加要素として、
 * 　「\n」をヘルプメッセージ内に記入すると、改行コードとして認識されます。
 * 　ただし、ヘルプメッセージを表示するウィンドウは２行しかないため、
 * 　２回目の改行コードは無視されます。
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('GamepadConfig');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.GamepadConfigName = String(Yanfly.Parameters['Command Name']);
Yanfly.Param.GamepadConfigButton = String(Yanfly.Parameters['Button Name']);
Yanfly.Param.GamepadConfigOkTx = String(Yanfly.Parameters['OK Button']);
Yanfly.Param.GamepadConfigOkHelp = String(Yanfly.Parameters['OK Help']);
if(Yanfly.Param.GamepadConfigOkHelp.indexOf("\\n") >= 0){
	var ntext = Yanfly.Param.GamepadConfigOkHelp.indexOf("\\n");
	var ntext1 = Yanfly.Param.GamepadConfigOkHelp.substr(0,ntext);
	var ntext2 = Yanfly.Param.GamepadConfigOkHelp.substr(ntext);
	Yanfly.Param.GamepadConfigOkHelp = ntext1 + "\n" + ntext2;
}
Yanfly.Param.GamepadConfigCancelTx = String(Yanfly.Parameters['Cancel Button']);
Yanfly.Param.GamepadConfigCancelHelp = String(Yanfly.Parameters['Cancel Help']);
if(Yanfly.Param.GamepadConfigCancelHelp.indexOf("\\n") >= 0){
	var ntext = Yanfly.Param.GamepadConfigCancelHelp.indexOf("\\n");
	var ntext1 = Yanfly.Param.GamepadConfigCancelHelp.substr(0,ntext);
	var ntext2 = Yanfly.Param.GamepadConfigCancelHelp.substr(ntext);
	Yanfly.Param.GamepadConfigCancelHelp = ntext1 + "\n" + ntext2;
}
Yanfly.Param.GamepadConfigShiftTx = String(Yanfly.Parameters['Shift Button']);
Yanfly.Param.GamepadConfigShiftHelp = String(Yanfly.Parameters['Shift Help']);
if(Yanfly.Param.GamepadConfigShiftHelp.indexOf("\\n") >= 0){
	var ntext = Yanfly.Param.GamepadConfigShiftHelp.indexOf("\\n");
	var ntext1 = Yanfly.Param.GamepadConfigShiftHelp.substr(0,ntext);
	var ntext2 = Yanfly.Param.GamepadConfigShiftHelp.substr(ntext);
	Yanfly.Param.GamepadConfigShiftHelp = ntext1 + "\n" + ntext2;
}
Yanfly.Param.GamepadConfigMenuTx = String(Yanfly.Parameters['Menu Button']);
Yanfly.Param.GamepadConfigMenuHelp = String(Yanfly.Parameters['Menu Help']);
if(Yanfly.Param.GamepadConfigMenuHelp.indexOf("\\n") >= 0){
	var ntext = Yanfly.Param.GamepadConfigMenuHelp.indexOf("\\n");
	var ntext1 = Yanfly.Param.GamepadConfigMenuHelp.substr(0,ntext);
	var ntext2 = Yanfly.Param.GamepadConfigMenuHelp.substr(ntext);
	Yanfly.Param.GamepadConfigMenuHelp = ntext1 + "\n" + ntext2;
}
Yanfly.Param.GamepadConfigPgUpTx = String(Yanfly.Parameters['PageUp Button']);
Yanfly.Param.GamepadConfigPgUpHelp = String(Yanfly.Parameters['PageUp Help']);
if(Yanfly.Param.GamepadConfigPgUpHelp.indexOf("\\n") >= 0){
	var ntext = Yanfly.Param.GamepadConfigPgUpHelp.indexOf("\\n");
	var ntext1 = Yanfly.Param.GamepadConfigPgUpHelp.substr(0,ntext);
	var ntext2 = Yanfly.Param.GamepadConfigPgUpHelp.substr(ntext);
	Yanfly.Param.GamepadConfigPgUpHelp = ntext1 + "\n" + ntext2;
}
Yanfly.Param.GamepadConfigPgDnTx = String(Yanfly.Parameters['PageDown Button']);
Yanfly.Param.GamepadConfigPgDnHelp = String(Yanfly.Parameters['PageDown Help']);
if(Yanfly.Param.GamepadConfigPgDnHelp.indexOf("\\n") >= 0){
	var ntext = Yanfly.Param.GamepadConfigPgDnHelp.indexOf("\\n");
	var ntext1 = Yanfly.Param.GamepadConfigPgDnHelp.substr(0,ntext);
	var ntext2 = Yanfly.Param.GamepadConfigPgDnHelp.substr(ntext);
	Yanfly.Param.GamepadConfigPgDnHelp = ntext1 + "\n" + ntext2;
}
Yanfly.Param.GamepadConfigResetTx = String(Yanfly.Parameters['Reset Default']);
Yanfly.Param.GamepadConfigResetHelp = String(Yanfly.Parameters['Reset Help']);
if(Yanfly.Param.GamepadConfigResetHelp.indexOf("\\n") >= 0){
	var ntext = Yanfly.Param.GamepadConfigResetHelp.indexOf("\\n");
	var ntext1 = Yanfly.Param.GamepadConfigResetHelp.substr(0,ntext);
	var ntext2 = Yanfly.Param.GamepadConfigResetHelp.substr(ntext);
	Yanfly.Param.GamepadConfigResetHelp = ntext1 + "\n" + ntext2;
}
Yanfly.Param.GamepadConfigFinishTx = String(Yanfly.Parameters['Finish Config']);
Yanfly.Param.GamepadConfigFinishHelp = String(Yanfly.Parameters['Finish Help']);
if(Yanfly.Param.GamepadConfigFinishHelp.indexOf("\\n") >= 0){
	var ntext = Yanfly.Param.GamepadConfigFinishHelp.indexOf("\\n");
	var ntext1 = Yanfly.Param.GamepadConfigFinishHelp.substr(0,ntext);
	var ntext2 = Yanfly.Param.GamepadConfigFinishHelp.substr(ntext);
	Yanfly.Param.GamepadConfigFinishHelp = ntext1 + "\n" + ntext2;
}

//=============================================================================
// Input
//=============================================================================

Input.getPressedGamepadButton = function() {
	if (Yanfly.Param.GamepadTimer > 0) {
		Yanfly.Param.GamepadTimer -= 1;
		return -1;
	}
	if (navigator.getGamepads) {
		var gamepads = navigator.getGamepads();
		if (gamepads) {
			for (var i = 0; i < gamepads.length; i++) {
				var gamepad = gamepads[i];
				if (gamepad && gamepad.connected) {
					return this.gamepadButtonId(gamepad);
				}
			}
		}
  }
	return -1;
};

Input.gamepadButtonId = function(gamepad) {
  var buttons = gamepad.buttons;
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].pressed) return i;
  }
	return -1;
};

Input.getGamepadButton = function(type) {
	for (var i = 0; i < 12; ++i) {
		if (Input.gamepadMapper[i] === type) return i;
	}
	return null;
};

Input.isControllerConnected = function() {
	if (navigator.getGamepads) {
		var gamepads = navigator.getGamepads();
		if (gamepads) {
			for (var i = 0; i < gamepads.length; i++) {
				var gamepad = gamepads[i];
				if (gamepad && gamepad.connected) return true;
			}
		}
	}
	return false;
};

//=============================================================================
// ConfigManager
//=============================================================================

ConfigManager.gamepadInput = {
	0: 'ok',
	1: 'cancel',
	2: 'shift',
	3: 'menu',
	4: 'pageup',
	5: 'pagedown',
	12: 'up',
	13: 'down',
	14: 'left',
	15: 'right',
};

Yanfly.GamepadConfig.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
  var config = Yanfly.GamepadConfig.ConfigManager_makeData.call(this);
	config.gamepadInput = this.gamepadInput;
	return config;
};

Yanfly.GamepadConfig.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
  Yanfly.GamepadConfig.ConfigManager_applyData.call(this, config);
	this.gamepadInput = this.readGamepadConfig(config, 'gamepadInput');
	this.applyGamepadConfig();
};

ConfigManager.applyGamepadConfig = function() {
	Input.gamepadMapper = this.gamepadInput;
	Input.update();
	Input.clear();
};

ConfigManager.readGamepadConfig = function(config, name) {
    var value = config[name];
    if (value !== undefined) {
        return value;
    } else {
        return {
					0: 'ok',
					1: 'cancel',
					2: 'shift',
					3: 'menu',
					4: 'pageup',
					5: 'pagedown',
					12: 'up',
					13: 'down',
					14: 'left',
					15: 'right',
				};
    }
};

//=============================================================================
// Window_MenuCommand
//=============================================================================

Yanfly.GamepadConfig.Window_Options_addGeneralOptions =
	Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
  Yanfly.GamepadConfig.Window_Options_addGeneralOptions.call(this);
	this.addGameConfigCommand();
};

Window_Options.prototype.addGameConfigCommand = function() {
	if (Input.isControllerConnected()) {
		this.addCommand(Yanfly.Param.GamepadConfigName, 'gamepadConfig', true);
		this._addedController = true;
	}
};

Yanfly.GamepadConfig.Window_Options_update =
	Window_Options.prototype.update;
Window_Options.prototype.update = function() {
	Yanfly.GamepadConfig.Window_Options_update.call(this);
	if (this._addedController && !Input.isControllerConnected()) {
		this.refresh();
		this.height = this.windowHeight();
		this.updatePlacement();
	}
};

Yanfly.GamepadConfig.Window_Options_drawItem =
	Window_Options.prototype.drawItem;
Window_Options.prototype.drawItem = function(index) {
    if (this.commandSymbol(index) === 'gamepadConfig') {
			var rect = this.itemRectForText(index);
			var text = this.commandName(index);
	    this.resetTextColor();
	    this.changePaintOpacity(this.isCommandEnabled(index));
	    this.drawText(text, rect.x, rect.y, rect.width, 'left');
		} else {
			Yanfly.GamepadConfig.Window_Options_drawItem.call(this, index);
		}
};

Yanfly.GamepadConfig.Window_Options_processOk =
	Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function() {
  if (this.commandSymbol(this.index()) === 'gamepadConfig') {
		Window_Command.prototype.processOk.call(this);
	} else {
		Yanfly.GamepadConfig.Window_Options_processOk.call(this);
	}
};

//=============================================================================
// Window_GamepadConfig
//=============================================================================

function Window_GamepadConfig() {
    this.initialize.apply(this, arguments);
}

Window_GamepadConfig.prototype = Object.create(Window_Command.prototype);
Window_GamepadConfig.prototype.constructor = Window_GamepadConfig;

Window_GamepadConfig.prototype.initialize = function(helpWindow) {
	var wy = helpWindow.height;
	Window_Command.prototype.initialize.call(this, 0, wy);
  this.setHelpWindow(helpWindow);
	this.height = Graphics.boxHeight - wy;
	this.refresh();
	this.activate();
	this.select(0);
};

Window_GamepadConfig.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_GamepadConfig.prototype.makeCommandList = function(index) {
	for (var i = 0; i < 6; ++i) {
		var text = this.getButtonTypeText(i);
		this.addCommand(text, 'button', true);
	}
	this.addCommand('', 'filler', true);
	this.addCommand(this.getButtonTypeText(7), 'reset', true);
	this.addCommand(this.getButtonTypeText(8), 'finish', true);
};

Window_GamepadConfig.prototype.drawItem = function(index) {
	if (index > 5) {
		Window_Command.prototype.drawItem.call(this, index);
	} else {
		var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
		var ww = rect.width / 2;
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
		this.drawText(this.commandName(index), rect.x, rect.y, ww, align);
		var text = this.getButtonConfig(index);
		this.drawText(text, rect.x + ww, rect.y, ww, align);
	}
};

Window_GamepadConfig.prototype.getButtonTypeText = function(index) {
	if (index === 0) return Yanfly.Param.GamepadConfigOkTx;
	if (index === 1) return Yanfly.Param.GamepadConfigCancelTx;
	if (index === 2) return Yanfly.Param.GamepadConfigShiftTx;
	if (index === 3) return Yanfly.Param.GamepadConfigMenuTx;
	if (index === 4) return Yanfly.Param.GamepadConfigPgUpTx;
	if (index === 5) return Yanfly.Param.GamepadConfigPgDnTx;
	if (index === 7) return Yanfly.Param.GamepadConfigResetTx;
	if (index === 8) return Yanfly.Param.GamepadConfigFinishTx;
	return '';
};

Window_GamepadConfig.prototype.getButtonConfig = function(index) {
	if (index > 5) return '';
	var key = this.getButtonKey(index);
	var button = Input.getGamepadButton(key);
  return Yanfly.Param.GamepadConfigButton.format(button);
};

Window_GamepadConfig.prototype.getButtonKey = function(index) {
	if (index === 0) return 'ok';
	if (index === 1) return 'cancel';
	if (index === 2) return 'shift';
	if (index === 3) return 'menu';
	if (index === 4) return 'pageup';
	if (index === 5) return 'pagedown';
};

Window_GamepadConfig.prototype.itemTextAlign = function() {
    return 'center';
};

Window_GamepadConfig.prototype.clearButtonConfig = function(index) {
    var rect = this.itemRectForText(index);
		rect.x += rect.width / 2;
		rect.width /= 2;
		this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
};

Window_GamepadConfig.prototype.updateHelp = function() {
    if (!this._helpWindow) return;
		switch (this.index()) {
		case 0:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigOkHelp);
			break;
		case 1:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigCancelHelp);
			break;
		case 2:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigShiftHelp);
			break;
		case 3:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigMenuHelp);
			break;
		case 4:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigPgUpHelp);
			break;
		case 5:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigPgDnHelp);
			break;
		case 7:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigResetHelp);
			break;
		case 8:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigFinishHelp);
			break;
		default:
			this._helpWindow.clear();
			break;
		}
};

//=============================================================================
// Scene_Options
//=============================================================================

Yanfly.GamepadConfig.Scene_Options_createOptionsWindow =
	Scene_Options.prototype.createOptionsWindow;
Scene_Options.prototype.createOptionsWindow = function() {
  Yanfly.GamepadConfig.Scene_Options_createOptionsWindow.call(this);
	this._optionsWindow.setHandler('gamepadConfig',
		this.commandGamepadConfig.bind(this));
};

Scene_Options.prototype.commandGamepadConfig = function() {
	SceneManager.push(Scene_GamepadConfig);
};

//=============================================================================
// Scene_GamepadConfig
//=============================================================================

function Scene_GamepadConfig() {
  this.initialize.apply(this, arguments);
}

Scene_GamepadConfig.prototype = Object.create(Scene_MenuBase.prototype);
Scene_GamepadConfig.prototype.constructor = Scene_GamepadConfig;

Scene_GamepadConfig.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_GamepadConfig.prototype.create = function() {
  Scene_MenuBase.prototype.create.call(this);
  this.createHelpWindow();
	this.createGamepadConfigWindow();
};

Scene_GamepadConfig.prototype.terminate = function() {
  Scene_MenuBase.prototype.terminate.call(this);
  ConfigManager.save();
};

Scene_GamepadConfig.prototype.update = function() {
  Scene_MenuBase.prototype.update.call(this);
	this.updateAttachedController();
	this.updateButtonConfig();
	this.updateAfterConfig();
};

Scene_GamepadConfig.prototype.updateAttachedController = function() {
	if (Input.isControllerConnected()) return;
	this.popScene();
};

Scene_GamepadConfig.prototype.createGamepadConfigWindow = function() {
	this._configWindow = new Window_GamepadConfig(this._helpWindow);
	this._configWindow.setHandler('button', this.commandButton.bind(this));
	this._configWindow.setHandler('reset', this.commandReset.bind(this));
	this._configWindow.setHandler('finish', this.popScene.bind(this));
	this.addWindow(this._configWindow);
};

Scene_GamepadConfig.prototype.commandButton = function() {
	var index = this._configWindow.index();
	this._configWindow.clearButtonConfig(index);
	this._configEnabled = true;
	Yanfly.Param.GamepadTimer = 12;
};

Scene_GamepadConfig.prototype.commandReset = function() {
	ConfigManager.gamepadInput = {
		0: 'ok',
		1: 'cancel',
		2: 'shift',
		3: 'menu',
		4: 'pageup',
		5: 'pagedown',
		12: 'up',
		13: 'down',
		14: 'left',
		15: 'right',
	};
	ConfigManager.applyGamepadConfig();
	this.refreshWindows();
};

Scene_GamepadConfig.prototype.refreshWindows = function() {
	this._configWindow.refresh();
	this._configWindow.activate();
	ConfigManager.save();
};

Scene_GamepadConfig.prototype.updateButtonConfig = function() {
	if (!this._configEnabled) return;
	var buttonId = Input.getPressedGamepadButton();
	if (buttonId > 11) return;
	if (buttonId >= 0) this.applyButtonConfig(buttonId);
};

Scene_GamepadConfig.prototype.applyButtonConfig = function(buttonId) {
	this._configEnabled = false;
	var index = this._configWindow.index();
	var newConfig = this._configWindow.getButtonKey(index);
	var formerConfig = Input.gamepadMapper[buttonId];
	var formerButton = Input.getGamepadButton(newConfig);
	ConfigManager.gamepadInput[buttonId] = newConfig;
	ConfigManager.gamepadInput[formerButton] = formerConfig;
	ConfigManager.applyGamepadConfig();
	this._configTimer = 12;
};

Scene_GamepadConfig.prototype.updateAfterConfig = function() {
	if (!this._configTimer) return;
	if (--this._configTimer > 0) return;
	SoundManager.playEquip();
	this.refreshWindows();
};

//=============================================================================
// End of File
//=============================================================================
