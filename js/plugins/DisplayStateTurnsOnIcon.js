//=============================================================================
// Display State Turns On Icon
// by lolaccount
// Last Updated: 2015.11.26
//=============================================================================

/*:
 * @plugindesc v1.04 Number of turns remaining for states/debuffs/buffs is
 * displayed on the icon.
 * <lolaccount DisplayStateTurnsOnIcon>
 * @author lolaccount
 *
 * @param Font Size
 * @desc Default: 16
 * @default 16
 *
 * @param Position
 * @desc Options: bottomleft, center, rightcenter, bottomcenter, etc  Default: topright
 * @default topright
 *
 * @param ---Compatibility---
 * @default
 *
 * @param Decimal Places
 * @desc # of decimal places for non-integer turn counts
 * Default: 0
 * @default 0
 *
 * @help This plugin does not provide plugin commands.
 * ============================================================================
 * Patch Notes
 * ============================================================================
 * v1.04 - Added Font Size Parameter, Added Position Parameter
 * v1.03 - Added check if state has an icon, added compatibility for Yanfly's ATB
 * added decimal place parameter for non-integer turn counts, like in Yanfly's
 * ATB. Fixed crashing when using tofixed out of battle
 * v1.02 - Fixed slicing issue that caused more numbers than should be shown
 * v1.01 - Added buff and debuffs turns, fixed displaying 1 or 0 for states
 * that don't have turns, moved text up a bit
 * ============================================================================
 * How To Use
 * ============================================================================
 * Plug and play.
 * ============================================================================
 * Terms Of Use
 * ============================================================================
 * Free to use and modify for commercial and noncommercial games, with or
 * without credit, as long as you do not claim the script as your own.
 * Credit is appreciated though.
 */

var kinokoCount = 0;
(function () {
    var parameters = $plugins.filter(function (p) {
        return p.description.contains('<lolaccount DisplayStateTurnsOnIcon>');
    })[0].parameters;
    var decimalPlaces = parseInt(parameters['Decimal Places'] || 0);
    var turnFontSize = parseInt(parameters['Font Size'] || 16);
    var turnTextPosition = String(parameters['Position'] || 'topright');
    var _Window_Base_drawActorIcons = Window_Base.prototype.drawActorIcons;
    Window_Base.prototype.drawActorIcons = function (actor, x, y, width) {

        _Window_Base_drawActorIcons.call(this, actor, x, y, width);

        var turns = [];
        var i = 0;
        actor.states().forEach(function (state) {
            if (state.autoRemovalTiming != 0 && state.iconIndex > 0) {
                turns.push(actor._stateTurns[actor._states[i]]);
            }
            else {
                turns.push(-1);
            }
            i++;
        }, this);
        for (var j = 0; j < actor._buffs.length; j++) {
            if (actor._buffs[j] !== 0) {
                turns.push(actor._buffTurns[j]);
            }
        }
        turns = turns.slice(0, Math.floor(width / Window_Base._iconWidth));
        this.contents.fontSize = turnFontSize;
        for (var i = 0; i < actor.allIcons().length; i++) {
            if (turns[i] == 0 || (turns[i] && turns[i] != -1)) {
                this.changeTextColor(this.powerUpColor());
                if(turns[i] == 0){
                  turns[i] = 1;
                  this.changePaintOpacity(false);
                }
                this.drawText(turns[i].toFixed(decimalPlaces) + "t", this.turnsRemainingPosX(i,x) - 4, this.turnsRemainingPosY(y) + 18, Window_Base._iconWidth, 'center');
                this.changePaintOpacity(true);
            }
        }
        this.resetFontSettings();
    };

    Window_Base.prototype.turnsRemainingPosX = function (i, x) {
        var returnValue = x + (Window_Base._iconWidth * i);
        switch (turnTextPosition) {
            case "topleft":
            case "bottomleft":
            case "leftcenter":
                returnValue -= (Window_Base._iconWidth / 6);
                break;
            case "topright":
            case "bottomright":
            case "rightcenter":
                returnValue += (Window_Base._iconWidth / 6);
                break;
        }
        return returnValue;
    };

    Window_Base.prototype.turnsRemainingPosY = function (y) {
        var returnValue = y;
        switch (turnTextPosition) {
            case "topleft":
            case "topright":
            case "topcenter":
                returnValue -= (Window_Base._iconWidth / 6);
                break;
            case "bottomleft":
            case "bottomright":
            case "bottomcenter":
                returnValue += (Window_Base._iconWidth / 6);
                break;
        }
        return returnValue;
    };

})();
