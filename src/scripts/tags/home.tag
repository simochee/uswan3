home
	navbar

	next

	btn-icon(icons="{['fork', 'knife']}" text="今日の献立" scroller="{scrollerOpts}")

	menu-list(year="{year}" month="{month}")

	div(style="height: 3000px; width: 10px; background: #fee")

	div#today Target

	div(style="height: 3000px; width: 10px; background: #fee")

	credit

	script.
		var self = this;

		var d = new Date;
		self.year = d.getFullYear();
		self.month = d.getMonth() + 1;

		self.scrollerOpts = {
			target: 'today',
			duration: 1000,
			offset: -300
		}

		obs.trigger('getMenu:req')
		obs.on('getMenu:res', function(data) {
			self.menu = data;
		});

	style(type="sass" scoped).
		.btn
			display: block
			width: 98%
			height: 40px
			margin: 10px auto
			position: relative
			border: 1px solid  #ccc
			border-radius: 15px
			background-image: -webkit-linear-gradient(#fdfdfd, #f1f1f1)
			background-image: -o-linear-gradient(#fdfdfd, #f1f1f1)
			background-image: linear-gradient(#fdfdfd, #f1f1f1)
			box-shadow: 0 2px 3px #ccc
			line-height: 40px
			color: #2e3436
			text-decoration: none
			text-align: center
			font-weight: bold
			font-size: 100%
			outline: none
			cursor: pointer
			-webkit-tap-highlight-color: rgba(#000,0) !important
			&:hover
				background-image: -webkit-linear-gradient(#f8f8f8, #e1e1e1)
				background-image: -o-linear-gradient(#f8f8f8, #e1e1e1)
				background-image: linear-gradient(#f8f8f8, #e1e1e1)
			&:active
				background-image: -webkit-linear-gradient(#d1d1d1, #dfdfdf)
				background-image: -o-linear-gradient(#d1d1d1, #dfdfdf)
				background-image: linear-gradient(#d1d1d1, #dfdfdf)
			.icon
				position: absolute
				top: 0
				left: 5px
				width: 40px
				height: 40px
				line-height: 40px
				text-align: center
				font-size: 25px
				color: #939393
				& > span:nth-child(2)
					margin-left: 5px
