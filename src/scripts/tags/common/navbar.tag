navbar
	header.navbar
		.left
			button.navbar-btn-icon(type="button")
				span.ion-ios-calendar-outline
		h1 デジタル版 白鳥寮献立表

	style(type="sass" scoped).
		.navbar
			position: relative
			width: 100%
			height: 40px
			border-bottom: 1px solid  #b3b3b3
			background-image: -webkit-linear-gradient(#f0f0f0, #ddd)
			background-image: -o-linear-gradient(#f0f0f0, #ddd)
			background-image: linear-gradient(#f0f0f0, #ddd)
			h1
				margin: 0 auto
				font-size: 16px
				text-shadow: 1px 1px 0 #fff
				text-align: center
				line-height: 40px
				color: #3e3e3e
				cursor: default
			.left
				position: absolute
				left: 0
				top: 0