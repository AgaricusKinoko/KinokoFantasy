/*:
@plugindesc 	ルーレットを動作させるために必要です。
詳しくはヘルプを見てください。
@author 	SQUARE PHOENIX
@help 	プラグインの詳細な説明。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■　全体的な説明
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
・カーソル移動中に【ESCキー】を押すと
　ルーレット専用のコマンドが表示されます
・ルーレットに移動後の位置は、サンプルの位置を推奨します。
　主人公を透明にして　右に強制移動するようになっています。
・コモンイベント番号８６「元の場所に戻る処理」
　のイベント内で、「場所移動」と「ルーレットのあるマップＩＤ」を
　ゲームに合わせて変更して下さい。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■　使用している画像(png)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▼picturesフォルダ
・ルーレット_p38
・ルーレット背景説明p32
・玉p32
・履歴背景用p32
▼parallaxesフォルダ
・ルーレット背景p32
▼charactersフォルダ
・!カジノp32
・ルーレット_チップp32_1-5
・ルーレット_チップp32_25-100
・ルーレット_チップp32_500-1000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■　使用しているコモンイベント
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
80 ルーレット　左上表示
81 ルーレット高速回転
82 ルーレット回転
83 ルーレット処理
84 賭ける処理
85 まだやるか、やめるか
86 元の場所に戻る処理
87 履歴表示

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■　使用しているスイッチ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
67 ベット中

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■　使用している変数
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
30 所持コイン　★カジノで買ったコインは、この変数に加算して下さい。

※４１から７６までの変数も使用していますが
ルーレット開始時にバックアップをとって
ルーレット終了後に元に戻しています。
そのため、３０番の変数以外は自由に使用しても動作します。
気になるなら、その間の変数を使わない方がよいと思います。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■　使用しているプラグイン
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
・Sq_ruulett(作者：SQUARE PHOENIX）　　　：ルーレットのプラグインです。
・DTextPicture(作者：トリアコンタン様）　：テキストを表示するプラグインです。
　http://triacontane.blogspot.jp/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■　利用規約
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
プラグイン「DTextPicture」のヘッダのライセンス表示を残しておいて下さい。
「DTextPicture」の利用規約については、そちらのヘルプで確認してください。
RPGツクールMV以外では使用できません。
完全な動作は保証できません。
その他の制限はありません。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■　お問い合わせフォーム
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
バグがあればできるだけ修正したいと思います。
http://enix.web.fc2.com/03otoiawase.html
*/			
   var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
		
        // 追加する処理内容をここに記述

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//■ルーレット判定
		//
		//
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (command === 'ルーレット判定') {
			if (window.sq_bet === undefined) {
				window.sq_bet = new Array();	
				window.sq_bet[$gameVariables.value(46)] =null;
			}else{
			}					
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//０～３６の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    
				if (window.sq_bet[$gameVariables.value(41)] == null){
				//★ハズレ(0～36のみ）
				}else{
				//★当たり
				  //カジノ配当(36倍)　v76
				  $gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[$gameVariables.value(41)]*36);
			　　　windowReset();
  				  $gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[$gameVariables.value(41)]*36);
				}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//1-12の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   
			if (window.sq_bet[47] !=null){
			  if (window.sq_bet[47]>=1){//1-12に賭けてる時のみ判定する
				if (1<=$gameVariables.value(41) && $gameVariables.value(41)<=12){
					$gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[47]*3);
					windowReset();
					$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[47]*3);
				}else{    
				}
			  }
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//13-24の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
			if (window.sq_bet[48] !=null){
			  if (window.sq_bet[48]>=1){
				if (13<=$gameVariables.value(41) && $gameVariables.value(41)<=24){
					$gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[48]*3);					
					windowReset();
					$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[48]*3);
				}else{    
				}
			  }
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//25-36の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
			if (window.sq_bet[49] !=null){
			  if (window.sq_bet[49]>=1){
				if (25<=$gameVariables.value(41) && $gameVariables.value(41)<=36){
					$gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[49]*3);									
					windowReset();
				//	$gameVariables.value(30)+=window.sq_bet[49]*3
					$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[49]*3);					
				}else{    
				}
			  }
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//1-18の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   
			if (window.sq_bet[50] !=null){
			  if (window.sq_bet[50]>=1){
				if (1<=$gameVariables.value(41) && $gameVariables.value(41)<=18){
				  //カジノ配当(2倍)　v76
				　$gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[50]*2);					
				  windowReset();
				　$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[50]*2);				  
				}else{
				}
			  }
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//19-36の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			if (window.sq_bet[56] !=null){
			  if (window.sq_bet[56]>=1){
				if (19<=$gameVariables.value(41) && $gameVariables.value(41)<=36){			
				  //カジノ配当(2倍)　v76
				  $gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[56]*2);					
				  windowReset();
				　$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[56]*2);				  
				}else{
				}
			  }
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//黒の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   
			if (window.sq_bet[57] !=null){
			  if (window.sq_bet[57]>=1){
				if ($gameVariables.value(41)==2||$gameVariables.value(41)==4
				  ||$gameVariables.value(41)==6||$gameVariables.value(41)==8
				  ||$gameVariables.value(41)==10||$gameVariables.value(41)==11
				  ||$gameVariables.value(41)==13||$gameVariables.value(41)==15
				  ||$gameVariables.value(41)==17||$gameVariables.value(41)==20
				  ||$gameVariables.value(41)==22||$gameVariables.value(41)==24
				  ||$gameVariables.value(41)==26||$gameVariables.value(41)==28
				  ||$gameVariables.value(41)==29||$gameVariables.value(41)==31
				  ||$gameVariables.value(41)==33||$gameVariables.value(41)==35){
					//カジノ配当(2倍)　v76
					$gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[57]*2);					
					windowReset();
					$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[57]*2);				  
				}else{            
				}
			  }
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//赤の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   
			if (window.sq_bet[58] !=null){
			  if (window.sq_bet[58]>=1){
				if ($gameVariables.value(41)==1||$gameVariables.value(41)==3
				||$gameVariables.value(41)==5||$gameVariables.value(41)==7
				||$gameVariables.value(41)==9||$gameVariables.value(41)==12
				||$gameVariables.value(41)==14||$gameVariables.value(41)==16
				||$gameVariables.value(41)==18||$gameVariables.value(41)==19
				||$gameVariables.value(41)==21||$gameVariables.value(41)==23
				||$gameVariables.value(41)==25||$gameVariables.value(41)==27
				||$gameVariables.value(41)==30||$gameVariables.value(41)==32
				||$gameVariables.value(41)==34||$gameVariables.value(41)==36){
				  //カジノ配当(2倍)　v76
				  $gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[58]*2);					
				  windowReset();
				　$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[58]*2);				  
				}else{
				}
			  }
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//偶数の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   
			if (window.sq_bet[59] !=null){
			  if (window.sq_bet[59]>=1){
				if ($gameVariables.value(41)==2||$gameVariables.value(41)==4
				  ||$gameVariables.value(41)==6||$gameVariables.value(41)==8
				  ||$gameVariables.value(41)==10||$gameVariables.value(41)==12
				  ||$gameVariables.value(41)==14||$gameVariables.value(41)==16
				  ||$gameVariables.value(41)==18||$gameVariables.value(41)==20
				  ||$gameVariables.value(41)==22||$gameVariables.value(41)==24
				  ||$gameVariables.value(41)==26||$gameVariables.value(41)==28
				  ||$gameVariables.value(41)==30||$gameVariables.value(41)==32
				  ||$gameVariables.value(41)==34||$gameVariables.value(41)==36){
					//カジノ配当(2倍)　v76
					$gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[59]*2);					
					windowReset();
					$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[59]*2);				  
				}else{            
				}
			  }  
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//奇数の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   
			if (window.sq_bet[60] !=null){
			  if (window.sq_bet[60]>=1){
				if ($gameVariables.value(41)==1||$gameVariables.value(41)==3
				  ||$gameVariables.value(41)==5||$gameVariables.value(41)==7
				  ||$gameVariables.value(41)==9||$gameVariables.value(41)==11
				  ||$gameVariables.value(41)==13||$gameVariables.value(41)==15
				  ||$gameVariables.value(41)==17||$gameVariables.value(41)==19
				  ||$gameVariables.value(41)==21||$gameVariables.value(41)==23
				  ||$gameVariables.value(41)==25||$gameVariables.value(41)==27
				  ||$gameVariables.value(41)==29||$gameVariables.value(41)==31
				  ||$gameVariables.value(41)==33||$gameVariables.value(41)==35){
				  //カジノ配当(2倍)　v76
				  $gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[60]*2);					
				  windowReset();
				　$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[60]*2);				  
				}else{            
				}
			  }
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//左縦の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   
			 //if $game_variables[67]>=1){ 
			if (window.sq_bet[67] !=null){ 
			  if (window.sq_bet[67]>=1){
				if ($gameVariables.value(41)==1||$gameVariables.value(41)==4
				  ||$gameVariables.value(41)==7||$gameVariables.value(41)==10
				  ||$gameVariables.value(41)==13||$gameVariables.value(41)==16
				  ||$gameVariables.value(41)==19||$gameVariables.value(41)==22
				  ||$gameVariables.value(41)==25||$gameVariables.value(41)==28
				  ||$gameVariables.value(41)==31||$gameVariables.value(41)==34){
					//カジノ配当(3倍)　v76
					$gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[67]*3);					
					windowReset();
					$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[67]*3);				  
				}else{            
				}
			  }   
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//中縦の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   
			if (window.sq_bet[68] !=null){
			  if (window.sq_bet[68]>=1){
				if ($gameVariables.value(41)==2||$gameVariables.value(41)==5
				||$gameVariables.value(41)==8||$gameVariables.value(41)==11
				||$gameVariables.value(41)==14||$gameVariables.value(41)==17
				||$gameVariables.value(41)==20||$gameVariables.value(41)==23
				||$gameVariables.value(41)==26||$gameVariables.value(41)==29
				||$gameVariables.value(41)==32||$gameVariables.value(41)==35){
				  //カジノ配当(3倍)　v76
				  $gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[68]*3);					
				  windowReset();
				　$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[68]*3);				  
				}else{
				}
			  }
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			//右縦の判定
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   
			if (window.sq_bet[69] !=null){  
			  if (window.sq_bet[69]>=1){
				if ($gameVariables.value(41)==3||$gameVariables.value(41)==6
				||$gameVariables.value(41)==9||$gameVariables.value(41)==12
				||$gameVariables.value(41)==15||$gameVariables.value(41)==18
				||$gameVariables.value(41)==21||$gameVariables.value(41)==24
				||$gameVariables.value(41)==27||$gameVariables.value(41)==30
				||$gameVariables.value(41)==33||$gameVariables.value(41)==36){
				  //カジノ配当(3倍)　v76
				  $gameVariables.setValue(76,$gameVariables.value(76)+window.sq_bet[69]*3);					  
				  windowReset();
				　$gameVariables.setValue(30,$gameVariables.value(30)+window.sq_bet[69]*3);				  
				}else{            
				}
			  }   
			}
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
			//コモンイベントですることに・・・
			//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
				  if ($gameVariables.value(66) ==0||$gameVariables.value(66) ==null){
					//何も賭けてないとき、ハズレを表示しない
				  }else if($gameVariables.value(76)==0||$gameVariables.value(76)==null){
					//	console.log('はずれ');
				  }
			//―――――――――――――――――――――――――
			//windowReset　コモンイベントですることに・・・
			//―――――――――――――――――――――――――
			function windowReset() {
				if ($gameVariables.value(76) >=1){//配当があるなら
					//	console.log('当たり');
				}
			}			
			//―――――――――――――――――――――――――
        }
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//■ルーレット表示
		//取得：$gameVariables.value(ID) //ID番の変数の値を取得
		//代入：$gameVariables.setValue(ID,X) //ID番の変数にXを代入
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (command === 'ルーレット履歴表示') {
			//alert("プラグインコマンドに『ルーレット表示』と入力しました。") ;
			if (window.sq_RooretRireki === null || window.sq_RooretRireki === undefined){
			  window.sq_RooretRireki = [];
			  window.sq_RooretRireki_Iro = [];
			}
			
			if (window.sq_RooretRireki.length<=8){
			//先頭に追加 
				window.sq_RooretRireki.push($gameVariables.value(41));
			}else{
			//先頭を削除してから追加
				window.sq_RooretRireki.shift();
				window.sq_RooretRireki_Iro.shift();
				window.sq_RooretRireki.push($gameVariables.value(41));
			}
				//---------------
				// 色判定
				//---------------
				var iro = 0
				switch($gameVariables.value(41)){
					case 0:
					   iro = 3;//緑
  						break;
					case 2:
					case 4:
					case 6:
					case 8:
					case 10:
					case 11:
					case 13:
					case 15:
					case 17:
					case 20:
					case 22:
					case 24:
					case 26:
					case 28:
					case 29:
					case 31:
					case 33:
					case 35:		   
				  	 	iro = 0;////黒（白色）
						break;
					default:
						iro = 2;//赤色
						break;
				}
				//---------------//
				window.sq_RooretRireki_Iro.push(iro);
				this.setupChild($dataCommonEvents[87].list, 0);	//履歴表示コモンイベント
        }
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//■ルーレットかける処理 
		//
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		if (command === 'ルーレットかける処理') {
			if (window.sq_bet === undefined) {
				window.sq_bet = new Array();	
				window.sq_bet[$gameVariables.value(46)] =null;
			}else{
			}				
		//ケース━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
			switch(window.sq_bet[$gameVariables.value(46)]){//46：賭ける目の配列の位置
			case null:
				window.sq_bet[$gameVariables.value(46)]=$gameVariables.value(45);
				//$gameVariables.value(30) -= $gameVariables.value(45)//所持ガボス増減
				$gameVariables.setValue(30,$gameVariables.value(30) - $gameVariables.value(45));//30：所持ガボス　45：ルーレット掛け金
				break;
			case undefined:
				window.sq_bet[$gameVariables.value(46)]=$gameVariables.value(45);
				$gameVariables.setValue(30,$gameVariables.value(30) - $gameVariables.value(45));//30：所持ガボス　45：ルーレット掛け金
				break;				
			case 0:
				window.sq_bet[$gameVariables.value(46)]=$gameVariables.value(45);
				$gameVariables.setValue(30,$gameVariables.value(30) - $gameVariables.value(45));//30：所持ガボス　45：ルーレット掛け金
				break;
			default:
			//賭け直し▼━━━━━━━━━━ 	
			var sa = $gameVariables.value(45) - window.sq_bet[$gameVariables.value(46)];//賭ける値 - 賭けてた値
			switch (true){
				case sa ===0:													//賭ける前と同じ時　何もしない
					break;
				case sa < 0:													//賭ける前より　少ないとき
					window.sq_bet[$gameVariables.value(46)]+=sa; 				//マイナスを加算
					$gameVariables.setValue(30,$gameVariables.value(30)-sa);	//所持コイン増減
					break;
				case 0 < sa: 													//0..999999999   //賭ける前より　多いとき
					window.sq_bet[$gameVariables.value(46)]+=sa;
					$gameVariables.setValue(30,$gameVariables.value(30)-sa);	//所持コイン増減
					break;
				default:	
			}
			//賭け直し▲━━━━━━━━━━   
		}
		//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		var kei = 0;		
		for (i=0; i<(window.sq_bet.length); i++){
			if (window.sq_bet[i] == null){
			}else{
				kei += window.sq_bet[i] ;
			}
		}
		$gameVariables.setValue(66,kei) ;//ID番の変数にXを代入
		//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━		
        }
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//■ベット画像変化 
		//
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		if (command === 'ベット画像変化') {
		//ケース━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   
			var atai = window.sq_bet[$gameVariables.value(46)];
			switch(true){
			case null:
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="";//"カジノp32"
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=0;//1//透明
				break;
			case atai===0:
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="";//"カジノp32"
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=0;//1//透明
				break;
			case atai===1:
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_1-5";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=0;
				break;
			case atai===2:
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_1-5";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=1;
				break;
			case atai===3:
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_1-5";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=2;
				break;
			case atai===4:
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_1-5";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=3;
				break;			  
			case 5<=atai,atai<=9://when 5..9
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_1-5";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=4;
				break;
			case 10<=atai,atai<=14://when 10..14
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_1-5";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=5;
				break;
			case 15<=atai,atai<=19://when 15..19
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_1-5";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=6;
				break;
			case 20<=atai,atai<=24://when 20..24
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_1-5";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=7;
				break;
			//■↓違う画像----------------------------------------------------------------------
			case 25<=atai,atai<=49://when 25..49
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_25-100";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=0
				break;			
			case 50<=atai,atai<=74://when 50..74
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_25-100";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=1;
				break;			
			case 75<=atai,atai<=99://when 75..99
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_25-100";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=2;
				break;						
			case 100<=atai,atai<=199://when 100..199
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_25-100";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=4;
				break;			
			case 200<=atai,atai<=299://when 200..299
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_25-100";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=5;
				break;			
			case 300<=atai,atai<=399://when 300..399
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_25-100";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=6;
				break;			
			case 400<=atai,atai<=499://when 400..499
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_25-100";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=7;
				break;	
			//■↓違う画像----------------------------------------------------------------------				
			case 500<=atai,atai<=999://when 500..999
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_500-1000";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=0;
				break;						
			case 1000<=atai,atai<=1999://when 1000..1999
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_500-1000";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=4;
				break;						
			case 2000<=atai,atai<=2999://when 2000..2999
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_500-1000";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=5;
				break;						
			case 3000<=atai,atai<=3999://when 3000..3999
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_500-1000";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=6;
				break;						
			case 4000<=atai,atai<=99999999999999999://when 4000..99999999999999999
				$gameMap.events()[$gameVariables.value(70)-1]._characterName="ルーレット_チップp32_500-1000";
				$gameMap.events()[$gameVariables.value(70)-1]._characterIndex=7;
				break;						
			default:
		
		  }
		//ケース━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   
		}

		//////////////////////////////////////////////////////////////////////////////
		//■
		//
		//////////////////////////////////////////////////////////////////////////////


    };

