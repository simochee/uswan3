next
	.next-menu
		//- 門限確認
		curfew
		.time {time}
			span.small の献立
		//- ローダ
		.loader(if="{loading}")

		//- ロード後の処理
		div(if="{!loading}")
			//- データを取得できたとき
			ol.menu-list(if="{menu.state == 'OK'}")
				li.main(if="{timeId != 3}")
					| {menu.main[0]}
					span(if="{menu.main[1]}")  / {menu.main[1]}
				li.main.dinnerA(if="{timeId == 3}") {menu.main[0]}
				li.main.dinnerB(if="{timeId == 3}") {menu.main[1]}
				li.side(each="{item in menu.sides}") {item}
			//- 特殊なイベントの日だった場合
			.event(if="{menu.state == 'event'}")
				p.title {menu.main[0]}
				p.text(if="{menu.main[1]}") {menu.main[1]}
			//- 見つからなかった場合の表示
			.notfound(if="{menu.state == 'notfound' || !menu.state}")
				i.ion-coffee.icon
				p.text 献立を取得できませんでした


	script.
		var self = this;

		var d = new Date;
		var hours = d.getHours();
		var minutes = d.getMinutes();
		var date = d.getDate();

		var getToday = function(data) {
			for(var i = 0, len = data.length; i < len; i++) {
				var item = data[i];
				if( item.date % 100 === date ) {
					return item;
				}
			}
			return 'notfound';
		}

		var getItem = function(data, timeId) {
			var today = getToday(data);
			if(today === 'notfound') {
				return today;
			} else {
				switch(timeId) {
					// 朝の献立を返却
					case 1:
						return {
							state: 'OK',
							main: today.m_main.split(','),
							sides: today.m_side.split(',')
						}
					// 昼の献立を返却
					case 2:
						return {
							state: 'OK',
							main: today.l_main.split(','),
							sides: today.l_side.split(',')
						}
					// 夜の献立を返却
					case 3:
						return {
							state: 'OK',
							main: today.d_main.split(','),
							sides: today.l_side.split(',')
						}
				}
			}
		}

		var getTime = function(data) {
			if( hours < 8 || (hours == 8 && minutes <= 30) ) {
				return { id: 1, label: '朝' };
			} else if( hours < 12 || (hours == 12 && minutes <= 50) ) {
				return { id: 2, label: '昼' };
			} else if( hours < 19 || (hours == 19 && minutes <= 40) ) {
				return { id: 3, label: '夜' };
			} else {
				return { id: 4, label: '明日 朝'}
			}
		}

		var time = getTime();
		self.time = time.label;
		self.timeId = time.id;

		self.loading = true;

		obs.on('getMenu:res', function(data) {
			if(data.status === 'notfound') {
				self.menu = {
					state: 'notfound'
				}
			} else {
				self.menu = getItem(data, time.id);
			}
			self.loading = false;
			riot.update();
		});

	style(type="sass" scoped).
		.next-menu
			position: relative
			margin: 10px 3px 20px
			border: 1px solid  #aaa
			background: #fff
			box-shadow: 0 6px 3px -4px #bbb
			box-sizing: border-box
			text-align: center
			.time
				padding: 8px 0
				border-bottom: 1px solid  #ccc
				background: #ddd
				color: #252521
				.small
					margin-left: 5px
					font-size: 16px
					color: #454545
			.menu-list
				margin: 20px 12px
				.main
					margin-bottom: 5px
					font-size: 22px
					&.dinnerA,
					&.dinnerB
						&::before
							position: relative
							top: -2px
							display: inline-block
							width: 20px
							height: 20px
							margin-right: 5px
							background: #222
							line-height: 20px
							text-align: center
							font-size: 14px
							color: #e9e9e9
					&.dinnerA
						&::before
							content: "A"
					&.dinnerB
						&::before
							content: "B"
				.side
					margin-top: 8px
					font-size: 16px
					color: #444
			.event
				.title
					margin: 25px 0 30px
					font-size: 50px
					color: #222
				.text 
					margin-bottom: 20px
					font-size: 14px
					letter-spacing: 0.18em
					color: #555
			.notfound
				.icon
					display: block
					margin: 25px 0 30px
					font-size: 50px
					color: #999
				.text
					margin-bottom: 20px
					font-size: 13px
					letter-spacing: 0.18em
					color: #555
					text-shadow: 1px 1px #bbb