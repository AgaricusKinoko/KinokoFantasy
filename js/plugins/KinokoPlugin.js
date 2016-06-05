/*:
 * @plugindesc Ellye様のATBプラグインを書き換えたりして、
 * スキル・アイテムのアクター選択時はＨＰとＭＰだけ表示します。
 * @author Agaricus_Mushroom
 *
 * @param hide_HP
 * @desc 0:ＨＰゲージを表示する　1:ＨＰゲージを非表示にする
 * (デフォルト = 0) 
 * @default 0
 *
 * @param hide_MP
 * @desc 0:ＭＰゲージを表示する　1:ＭＰゲージを非表示にする
 * (デフォルト = 0) 
 * @default 0
 *
 * @param hide_TP
 * @desc 0:ＴＰゲージを表示する　1:ＴＰゲージを非表示にする
 * (デフォルト = 0) 
 * @default 0
 *
 * @param HP Gauge X Position (with TP)
 * @desc Default: 0
 * @default 0
 * 
 * @param HP Gauge Width (with TP)
 * @desc Default: 97
 * @default 97
 * 
 * @param MP Gauge X Position (with TP)
 * @desc Default: 112
 * @default 112
 * 
 * @param MP Gauge Width (with TP)
 * @desc Default: 86
 * @default 86
 * 
 * @param TP Gauge X Position
 * @desc Default: 213
 * @default 213
 * 
 * @param TP Gauge Width
 * @desc Default: 86
 * @default 86
 *
 * @param ATB Gauge X Position (with TP)
 * @desc Default: 314
 * @default 314
 * 
 * @param ATB Gauge Width (with TP)
 * @desc Default: 86
 * @default 86
 * 
 * @param HP Gauge X Position
 * @desc Default: 0
 * @default 0
 * 
 * @param HP Gauge Width
 * @desc Default: 130
 * @default 130
 * 
 * @param MP Gauge X Position
 * @desc Default: 145
 * @default 145
 * 
 * @param MP Gauge Width
 * @desc Default: 120
 * @default 120
 *
 * @param ATB Gauge X Position
 * @desc Default: 280
 * @default 280
 * 
 * @param ATB Gauge Width
 * @desc Default: 120
 * @default 120
 *
 * @help 【仕様について】
 * ・再定義が多いため、なるべく上の方に配置してね。
 * ・Ellye様のATBプラグインの書き換えを行っているため、
 * 　ATBプラグインの下に配置してね。
 * ・ＨＰ・ＭＰ・ＴＰの表示位置や長さのパラメータはこのプラグインが
 * 　上書きするので、設定はこっち側でよろしくね。
 * ・アクター選択時以外は最大ＨＰと最大ＭＰを表示しないようにしてるよ。
 */


(function() {

var parameters = PluginManager.parameters('KinokoPlugin');
var kinoko_hideHP = Number(parameters['hide_HP'] || 0);
var kinoko_hideMP = Number(parameters['hide_MP'] || 0);
var kinoko_hideTP = Number(parameters['hide_TP'] || 0);

$kinokoEngine = false;
$kinokoBattleNow = false;

Scene_Battle.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    $kinokoBattleNow = true;
    this.createDisplayObjects();
};

Scene_Battle.prototype.stop = function() {
    Scene_Base.prototype.stop.call(this);
    $kinokoBattleNow = false;
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else {
        this.startFadeOut(this.fadeSpeed(), false);
    }
    this._statusWindow.close();
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
};

Window_Base.prototype.drawCurrentAndMax = function(current, max, x, y,
                                                   width, color1, color2) {
    var labelWidth = this.textWidth('HP');
    labelWidth = -99999;
    if($kinokoEngine == false && $kinokoBattleNow == true) labelWidth = 99999;
    var valueWidth = this.textWidth('0000');
    var slashWidth = this.textWidth('/');
    var x1 = x + width - valueWidth;
    var x2 = x1 - slashWidth;
    var x3 = x2 - valueWidth;
    if (x3 >= x + labelWidth) {
        this.changeTextColor(color1);
        this.drawText(current, x3, y, valueWidth, 'right');
        this.changeTextColor(color2);
        this.drawText('/', x2, y, slashWidth, 'right');
        this.drawText(max, x1, y, valueWidth, 'right');
    } else {
        this.changeTextColor(color1);
        this.drawText(current, x1, y, valueWidth, 'right');
    }
};

Window_Base.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    if(kinoko_hideHP == 0) this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                           this.hpColor(actor), this.normalColor());
};

Window_Base.prototype.drawActorMp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    if(kinoko_hideMP == 0) this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y, 44);
    this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
                           this.mpColor(actor), this.normalColor());
};

Window_Base.prototype.drawActorTp = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    if(kinoko_hideTP == 0) this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.tpA, x, y, 44);
    this.changeTextColor(this.tpColor(actor));
    this.drawText(actor.tp, x + width - 64, y, 64, 'right');
};

Scene_Battle.prototype.selectActorSelection = function() {
    $kinokoEngine = true;
    this._actorWindow.refresh();
    this._actorWindow.show();
    this._actorWindow.activate();
};

Scene_Battle.prototype.onActorOk = function() {
    $kinokoEngine = false;
    var action = BattleManager.inputtingAction();
    action.setTarget(this._actorWindow.index());
    this._actorWindow.hide();
    this._skillWindow.hide();
    this._itemWindow.hide();
    this.selectNextCommand();
};

Scene_Battle.prototype.onActorCancel = function() {
    this._actorWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
    case 'skill':
        this._skillWindow.show();
        this._skillWindow.activate();
        $kinokoEngine = false;
        break;
    case 'item':
        this._itemWindow.show();
        this._itemWindow.activate();
        $kinokoEngine = false;
        break;
    }
};


//ここからはＡＴＢプラグインの書き換えです
    var hp_gauge_x_tp = Number(parameters['HP Gauge X Position (with TP)'] || 0);
    var mp_gauge_x_tp = Number(parameters['MP Gauge X Position (with TP)'] || 112);
    var tp_gauge_x = Number(parameters['TP Gauge X Position'] || 213);
    var atb_gauge_x_tp = Number(parameters['ATB Gauge X Position (with TP)'] || 314);
    var hp_gauge_width_tp = Number(parameters['HP Gauge Width (with TP)'] || 97);
    var mp_gauge_width_tp = Number(parameters['MP Gauge Width (with TP)'] || 86);
    var tp_gauge_width = Number(parameters['TP Gauge Width'] || 86);
    var atb_gauge_width_tp = Number(parameters['ATB Gauge Width (with TP)'] || 86);
    var hp_gauge_x = Number(parameters['HP Gauge X Position'] || 0);
    var mp_gauge_x = Number(parameters['MP Gauge X Position'] || 145);
    var atb_gauge_x = Number(parameters['ATB Gauge X Position'] || 280);
    var hp_gauge_width = Number(parameters['HP Gauge Width'] || 130);
    var mp_gauge_width = Number(parameters['MP Gauge Width'] || 120);
    var atb_gauge_width = Number(parameters['ATB Gauge Width'] || 120);

        Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
            if($kinokoEngine == false){
                this.drawActorHp(actor, rect.x + hp_gauge_x_tp, rect.y, hp_gauge_width_tp);
                this.drawActorMp(actor, rect.x + mp_gauge_x_tp, rect.y, mp_gauge_width_tp);
                this.drawActorTp(actor, rect.x + tp_gauge_x, rect.y, tp_gauge_width);
                this.drawActorATB(actor, rect.x + atb_gauge_x_tp, rect.y, atb_gauge_width_tp);
            } else {
                //$kinokoEngine = false;
                this.drawActorHp(actor, rect.x + hp_gauge_x_tp + 50, rect.y, hp_gauge_width_tp + 83);
                this.drawActorMp(actor, rect.x + mp_gauge_x_tp + 133, rect.y, mp_gauge_width_tp + 74);
            }
        };

        Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
            if($kinokoEngine == false){
                this.drawActorHp(actor, rect.x + hp_gauge_x, rect.y, hp_gauge_width);
                this.drawActorMp(actor, rect.x + mp_gauge_x, rect.y, mp_gauge_width);
                this.drawActorATB(actor, rect.x + atb_gauge_x, rect.y, atb_gauge_width);
            } else {
                this.drawActorHp(actor, rect.x + hp_gauge_x + 50, rect.y, hp_gauge_width + 50);
                this.drawActorMp(actor, rect.x + mp_gauge_x + 100, rect.y, mp_gauge_width + 40);
            }
        };


//ＡＴＢプラグインの書き換えここまで

})();