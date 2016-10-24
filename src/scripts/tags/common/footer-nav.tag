footer-nav
	
	btn(icons="{['ios-calendar-outline']}" text="過去の献立" onclick="{test}")

	.slider#archiveList(if="isOpen.calendar")
		ol
			li(each="item in archives")

	script.
		var self = this;

		self.isOpen = {
			calendar: false
		}

		self.test = function() {
			console.log('happen')
		}