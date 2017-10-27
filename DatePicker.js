define(["BaseComponent","PopupContainer","TimePicker","css!DatePicker.css"], function(BaseComponent,PopupContainer,TimePicker) {
	var DatePicker = BaseComponent.extend({
		/**
		 * 初始化组件参数
		 * @param  {[Object]} opts 配置参数
		 */
		init: function(opts) {
			this.config = {
				renderTo: null,
				width: 226,
				lang: "en",
				height: 24,
				label: true,
				labelText: "",
				labelWidth: 80,
				value: "2016-05-14 12:30",
				format: "YYYY-MM-DD hh:mm:ss",
				splitSymbol:"-",
				interval:900,
				editable: false
			};
			this.config = $.extend({}, this.config, opts);
			var me = this;
			this.currentSelected = {
				year: new Date(this.config.value.replace(/-/gi, "")).format("YYYY"),
				month: new Date(this.config.value.replace(/-/gi, "")).format("MM"),
				day: new Date(this.config.value.replace(/-/gi, "")).format("DD"),
				hour: new Date(this.config.value.replace(/-/gi, "")).format("hh"),
				minutes: new Date(this.config.value.replace(/-/gi, "")).format("mm"),
				second: new Date(this.config.value.replace(/-/gi, "")).format("ss")
			};
			this.i18n = {
				cn: {
					week: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
					tips: {
						lastYear: "上一年",
						nextYear: "下一年",
						lastMonth: "上一月",
						nextMonth: "下一月"
					},
					confirm: "确定"
				},
				en: {
					week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
					tips: {
						lastYear: "last year",
						nextYear: "next year",
						lastMonth: "last month",
						nextMonth: "next month"
					},
					confirm: "confirm"
				}
			};

			this._createPopupContainer();
			this._createDOM();
			this._setDay(this.config.value.replace(/-|\//gi,this.config.splitSymbol));
			this._selectedBehavior();
			this._limitTimeInput();
			this._nextYear();
			this._lastYear();
			this._nextMonth();
			this._lastMonth();
			this._panelHide();
			this.time = new TimePicker({
				value:new Date(me.config.value.replace(/-/gi,"/")),
				renderTo:$(me.popupContainer.element).find("input").get(0),
				interval:me.config.interval
			});
		},
		/**
		 * 获取日期
		 * @return {[Object]} [{year,month,day}]
		 */
		getValue:function(){
			var me = this;
			return {
				year:me.currentSelected.year,
				month:me.currentSelected.month,
				day:me.currentSelected.day
			}
		},
		/**
		 * 设置日期
		 */
		setValue:function(dateString){
			var me = this;
			me._setDay(dateString);
		},
		/**
		 * 设置是否可用
		 * @disabled {[Boolean]} disabled 是否可用
		 *
		 **/
		setDisabled:function(disabled){
			$(this.config.renderTo).prop("disabled",disabled);
			if(disabled){
				this._panelHide();
			}
		},	
		/**
		 * 创建DOM容器
		 */
		_createDOM: function() {
			var me = this;
			$(me.config.renderTo).empty();
			var $panelContainer = $("<div class='data-picker-panel'></div>");
			this.panelContainer = $panelContainer;
			var inputString = '<input class="datePicker-input" value="' + me.config.value + '" />';
			var panelString = '<div class="datePicker-panel"></div>';
			$panelContainer.append('<div class="datePicker"></div>');
			$panelContainer.find(".datePicker")
				.append('<div class="datePicker-panel">')
				.children().append('<div class="datePicker-panel-header">')
				.end().children().append('<div class="datePicker-panel-body">')
				.end().children().append('<div class="datePicker-panel-footer clearfix">');
			var lastYearTip = me.i18n[me.config.lang] == undefined ? me.i18n.en.tips.lastYear : me.i18n[me.config.lang].tips.lastYear,
				nextYearTip = me.i18n[me.config.lang] == undefined ? me.i18n.en.tips.nextYear : me.i18n[me.config.lang].tips.nextYear,
				lastMonthTip = me.i18n[me.config.lang] == undefined ? me.i18n.en.tips.lastMonth : me.i18n[me.config.lang].tips.lastMonth,
				nextMonthTip = me.i18n[me.config.lang] == undefined ? me.i18n.en.tips.nextMonth : me.i18n[me.config.lang].tips.nextMonth;
			var confirmBtn = me.i18n[me.config.lang] == undefined ? me.i18n.en.confirm : me.i18n[me.config.lang].confirm;
			var headerString = '<span class="float-left">' +
				'<i class="last-year" title="' + lastYearTip + '"><<</i>' +
				'<i class="last-month" title="' + lastMonthTip + '"><</i>' +
				'</span>' +
				'<em data-utc="' + new Date(me.config.value.replace(/-/gi, "/")).getTime() + '">' + me.config.value + '</em>' +
				'<span class="float-right">' +
				'<i class="next-month" title="' + nextMonthTip + '">></i>' +
				'<i class="next-year" title="' + nextYearTip + '">>></i>' +
				'</span>';

			function createWeek() {
				var week = me.i18n[me.config.lang] == undefined ? me.i18n.en.week : me.i18n[me.config.lang].week;
				var temp = [];
				for (var i = 0; i < week.length; i++) {
					temp.push("<span>" + week[i] + "</span>");
				}
				var weekString = temp.join("");
				return weekString;
			}
			var weekString = createWeek();
			$panelContainer.find(".datePicker-panel-header").append(headerString);
			$panelContainer.find(".datePicker-panel-body").append('<div class="datePicker-panel-body-week">');
			$panelContainer.find(".datePicker-panel-body-week").append(weekString);
			$panelContainer.find(".datePicker-panel-body").append('<div class="datePicker-panel-body-day">');
			$panelContainer.find(".datePicker-panel-footer").append("<div class='datePicker-time'>")
				.children().append('<input />')
			$panelContainer.find(".datePicker-panel-footer").append('<div class="datePicker-ok">' + confirmBtn + '</div>');
			$(this.config.renderTo).prop("readonly", !me.config.editable);
			this.popupContainer.addContent($panelContainer);
		},
		/**
		 * 动态生成日期(核心方法)
		 */
		_setDay: function(dateString) {
			var me = this;
			me.currentSelected.year = new Date(dateString).format("YYYY");
			me.currentSelected.month = new Date(dateString).format("MM");
			me.currentSelected.day = new Date(dateString).format("DD");
			$(this.config.renderTo).val(dateString);
			this.panelContainer.find(".datePicker-panel-header em").text(dateString).attr("data-utc", new Date(dateString.replace(/-/gi,"/")).getTime());
			this.panelContainer.find(".datePicker-panel-body-day").empty();
			this.panelContainer.find(".datePicker-panel-header em").text(dateString);

			function createDays() {
				//先计算当月一号是星期几用以和列头的星期一一对上
				var firstDay = new Date(new Date(dateString.replace(/-/gi, "/")).format("YYYY/MM") + "/01").getWeekIndex();
				var days = [];
				var maxCol = 5;
				if (firstDay == 6 || firstDay == 7) {
					maxCol = 6;
				}
				for (var i = 0; i < maxCol; i++) {
					var list = ["<li>"];
					for (var j = 0; j < 7; j++) {
						if ((i * 7 + j) >= firstDay) {
							list.push("<span class='" + (function() {
								if (((i * 7 + j)) < new Date(new Date(new Date(new Date(dateString.replace(/-/gi, "/")).format("YYYY/MM/31"))).getTime()+24*60*60*1000).getMonthDays() + firstDay) {
									if ((i * 7 + j + 1 - firstDay) == new Date(dateString.replace(/-/gi, "/")).format("DD")) {
										return "selected-month selected"
									}
									return "selected-month"
								} else {
									return ""
								}
							})() + "'>" + ((i * 7 + j - firstDay) % new Date(new Date(new Date(dateString.replace(/-/gi, "/")).format("YYYY/MM/31")).getTime()+24*60*60*1000).getMonthDays() + 1) + "</span>")
							if (j == 6) {
								list.push("</li>")
							}
						} else {
							list.push("<span></span>")
						}
					}
					days.push(list);
				}
				var dayString = "";
				for (var i = 0; i < days.length; i++) {
					for (var j = 0; j < days[i].length; j++) {
						dayString += days[i][j]
					}
				}
				return "<ul>" + dayString + "</ul>"
			};
			var dayString = createDays();
			this.panelContainer.find(".datePicker-panel-body-day").append(dayString);

		},
		/**
		 * 创建日期panel容器
		 * @params {[jQuery Object || String || DOMNODE]} content 容器内容
		 *
		 **/
		_createPopupContainer:function(){
			if(this.popupContainer){
				return;
			};
			this.popupContainer = new PopupContainer();
		},
		/**
		 * 选择时的行为 
		 */
		_selectedBehavior: function() {
			var me = this;
			$(document).on("click", function(e) {
				me._panelHide();
			});
			this.panelContainer.on("click", ".datePicker-panel", function(e) {
				e.stopPropagation();
				me.time.hidePanel();
			});
			this.panelContainer.on("click", ".selected-month", function(e) {
				//e.stopPropagation();
				$(me.popupContainer.element).find(".selected-month").removeClass("otherSelected");
				$(me.popupContainer.element).find(".selected-month").filter(function(index, elm) {
					return $(elm).hasClass('selected')
				}).removeClass("selected").addClass("otherSelected");
				$(this).addClass("selected");
				//把所选日期写入组件
				me.currentSelected.day = $(this).text();
			});
			$(this.config.renderTo).on("click", function(e) {
				// e.stopPropagation();
				var rect = e.target.getBoundingClientRect();
				var top = rect.height + rect.top;
				var left = rect.left;
				me._panelShow();
				(function(me,left,top){
					setTimeout(function(){
							me._panelShow();
							me._setPanelPosition(left,top);
					}, 100)
				})(me,left,top);
			});
			this.panelContainer.find(".datePicker-ok").on("click", function(e) {
				e.stopPropagation();
				me._combinationDate();
				me._panelHide();
				me.time.hidePanel();
			})
		},
		/**
		 * 明年
		 */
		_nextYear: function() {
			var me = this;
			this.panelContainer.on("click", ".next-year", function(e) {
				e.stopPropagation;
				me.currentSelected.year++;
				me._setDay(me._combinationDate())
			})
		},
		/**
		 * 去年
		 */
		_lastYear: function() {
			var me = this;
			this.panelContainer.on("click", ".last-year", function(e) {
				e.stopPropagation;
				me.currentSelected.year--
				me._setDay(me._combinationDate())
			})
		},
		/**
		 * 下月
		 */
		_nextMonth: function() {
			var me = this;
			this.panelContainer.on("click", ".next-month", function(e) {
				e.stopPropagation;
				me.currentSelected.month++
				if(me.currentSelected.month == 13){
					me.currentSelected.year++;
					me.currentSelected.month = 1
				}
				me._setDay(me._combinationDate())
			})
		},
		/**
		 * 上月
		 */
		_lastMonth: function() {
			var me = this;
			this.panelContainer.on("click", ".last-month", function(e) {
				e.stopPropagation;
				me.currentSelected.month--;
				if(me.currentSelected.month == 0){
					me.currentSelected.year--;
					me.currentSelected.month = 12
				}
				me._setDay(me._combinationDate());
			})
		},
		/**
		 * 显示时间选择面板
		 */
		_panelShow: function() {
			var me = this;
			this.panelContainer.find(".datePicker-panel").show();
		},
		/**
		 *
		 *
		 *
		 **/
		_setPanelPosition(left,top){
			this.panelContainer.find(".datePicker-panel").css({
				left:left,
				top:top+5
			});
		},
		/**
		 * 隐藏时间选择面板
		 */
		_panelHide: function() {
			var me = this;
			this.panelContainer.find(".datePicker-panel").hide()
		},
		/**
		 * 限制输入字符必须是数字
		 * @param  {[HTMLElement]} inputElem 
		 */
		_justInputNumber: function(inputElem) {
			inputElem.value = inputElem.value.replace(/[^\d\.]/g, "");
			if (inputElem.value.split('.').length - 1 > 1) { //inputElem.value.split('.').length-1>1表示'.'符号出现的次数
				inputElem.value = inputElem.value.slice(0, '.'.indexOf(inputElem.value)) + inputElem.value.slice('.'.indexOf(inputElem.value), -1).replace(/\./);
			}
		},
		_limitTimeInput: function() {
			var me = this;
			this.panelContainer.on("input", ".datePicker-time>input", function(e) {
				me._justInputNumber($(this).get(0));
			})
		},
		/**
		 * 确定组合日期
		 * return {{String}}  格式化的日期字符串
		 */
		_combinationDate: function() {
			var me = this;
			var year = me.currentSelected.year,
				month = me.currentSelected.month,
				day = me.currentSelected.day;
			var date = new Date(year + "/" + month + "/" + day).format("YYYY" +this.config.splitSymbol+ "MM" +this.config.splitSymbol+ "DD");
			// this.panelContainer.find(".datePicker-input").val(date);
			$(this.config.renderTo).val(date);
			this.panelContainer.find(".datePicker-panel-header em").text(date).attr("data-utc", new Date(date).getTime());
			return date.replace(/-/gi, this.config.splitSymbol);
		}
	});
	return DatePicker;
})