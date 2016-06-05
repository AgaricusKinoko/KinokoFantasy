/*
 *=============================================================================
 * Tinys Revive By Item MV Version
 *  By TinyMine / Philipp Brede
 *  Tiny_ReviveByItem.js
 *  Version: 1.0
 *  Free for commercial and non commercial use.
 *=============================================================================
 */
/*:
 * @help
 *=============================================================================
 *  Bugs, Ideas, Requests?...
 *  ...contact TinyMine in rpgmakerweb.com
 *=============================================================================
 *                                   Plugin Commands
 *=============================================================================
 *  
 *     █ No Commands for this script available
 * 
 *=============================================================================
 * @plugindesc This lets your party survive defeat by having a specified item in their bag like we know from zelda with its fairies.
 *
 * @author TinyMine / Philipp Brede
 * 
 * @param Item ID
 * @desc Item ID that needs to be owned to survive defeat.
 * @default 1
 * 
 * @param Loose Item
 * @desc Should the plugin delete 1 item if defeat was survived by it? On or Off
 * @default On
 * 
 * @param Call Common Event
 * @desc Should a common event be called when the item is used? On or Off
 * @default On
 * 
 * @param Common Event ID
 * @desc Which common event should be called by its ID?
 * @default 1
 * 
 * @param Play Animation
 * @desc Whether to play an animation or not when surviving by item. On or Off
 * @default On
 * 
 * @param Animation ID
 * @desc Which animation id should be played?
 * @default 44
 * 
 *=============================================================================
 */
(function () {
    var _usedParams = {}
    //Initializing variables to parameter values
    var parameters = PluginManager.parameters('Tiny_ReviveByItem');
    _usedParams['item_id'] = Number(parameters['Item ID'] || 10);
    _usedParams['auto_item'] = String(parameters['Loose Item']);
    _usedParams['call_ce'] = String(parameters['Call Common Event']);
    _usedParams['ce_id'] = Number(parameters['Common Event ID'] || 1);
    _usedParams['anim_on'] = String(parameters['Play Animation']);
    _usedParams['anim_id'] = Number(parameters['Animation ID'] || 44);
    //-------------------------------------------------------------------------
    // OLD BattleManager
    //  Modified:
    //      - updateBattleEnd
    var oldBM_updateBattleEnd_Tiny_RBI = BattleManager.updateBattleEnd;
    BattleManager.updateBattleEnd = function () {
        if (this.isBattleTest()) {
            AudioManager.stopBgm();
            SceneManager.exit();
        } else if ($gameParty.isAllDead()) {
            if (this._canLose) {
                $gameParty.reviveBattleMembers();
                SceneManager.pop();
            } else if ($gameParty.hasItem($dataItems[_usedParams['item_id']])) {
                if (_usedParams['auto_item'] === 'On') $gameParty.gainItem($dataItems[_usedParams['item_id']], -1);
                if (_usedParams['call_ce'] === 'On') $gameTemp.reserveCommonEvent(_usedParams['ce_id']);
                if (_usedParams['anim_on'] === 'On') $gamePlayer.requestAnimation(_usedParams['anim_id']);
                $gameParty.reviveBattleMembers();
				this._phase = null;
                SceneManager.pop();
				return;
            }
        }
        oldBM_updateBattleEnd_Tiny_RBI.call(this);
    };
    //-------------------------------------------------------------------------
    // OLD Scene_Base
    //  Modified:
    //      - checkGameover
    var oldSB_checkGameover_Tiny_RBI = Scene_Base.prototype.checkGameover;
    Scene_Base.prototype.checkGameover = function () {
        if ($gameParty.isAllDead()) {
            if ($gameParty.hasItem($dataItems[_usedParams['item_id']])) {
                if (_usedParams['auto_item'] === 'On') $gameParty.gainItem($dataItems[_usedParams['item_id']], -1);
                if (_usedParams['call_ce'] === 'On') $gameTemp.reserveCommonEvent(_usedParams['ce_id']);
                if (_usedParams['anim_on'] === 'On') $gamePlayer.requestAnimation(_usedParams['anim_id']);
                $gameParty.reviveBattleMembers();
            }
            else {
                oldSB_checkGameover_Tiny_RBI.call(this);
            }
        }
    };
})();