define(["PopupContainer","css!TimePicker.css"], function(PopupContainer) {
	var TimePicker = Class.extend({
		init: function(opts) {
			var defaultConfig = {
				renderTo: document.body, //type:HTMLElement 
				format: "hh:mm:ss", //type:String
				interval: 900,
				placeholder: "select time", //type:String
				value: new Date(), //type:Date
				editable:false
			};
			this.config = $.extend({}, defaultConfig, opts);
			this.currentSelected = {
				hour:this.config.value.format("hh"),
				minute:this.config.value.format("mm"),
				second:new Date(this.fixTime(new Date(this.config.value),this.config.interval)).format("ss")
			};
			this._createPopupContainer();
			this._createDom(this.config.interval,this.config.value);
			this._initListClick();
			this.hidePanel();
		},
		setValue: function(value) {

		},
		getValue: function() {
			var me = this;
			return {
				hours:me.getHours(),
				minutes:me.getMinutes(),
				secends:me.getSeconds()
			};
		},
		/**
		 * 创建DOM容器
		 * @param  {[Date]} time     [要显示的时间]
		 * @param  {[Number]} interval [显示的粒度]
		 */
		_createDom: function(interval,date) {
			var me = this;
			function _createHoursList(interval) {
				var hours = null;
				if(+interval === 86400){
					hours = 1;
				}else{
					hours = 24;
				}
				return Array(hours).fill().map(function(value, index) {
					if( (me.currentSelected.hour - index)===0 ){
						return "<li data-role='hour' class='timePicker-selected'>" + ((index) < 10 ? "0" + (index) : (index)) + "</li>";
					}
					return "<li data-role='hour'>" + ((index) < 10 ? "0" + (index) : (index)) + "</li>";
				}).join("");
			};

			function _createMinutesList(interval) {
				if(interval > 3600){
					interval = 3600;
				}
				if(interval<3600 && interval>900){
					interval = 900;
				}
				if(interval<900 && interval>60){
					interval = 60;
				}
				return Array(60 / (interval / 60)).fill().map(function(value, index) {
					if( (me.currentSelected.minute - index)===0 ){
						return "<li data-role='minute' class='timePicker-selected'>" + (((interval / 60) * index) < 10 ? "0" + ((interval / 60) * index) : ((interval / 60) * index)) + "</li>";
					}
					return "<li data-role='minute'>" + (((interval / 60) * index) < 10 ? "0" + ((interval / 60) * index) : ((interval / 60) * index)) + "</li>";
				}).join("");
			};

			function _createSecondsList(interval) {
				interval = interval > 60 ? 60 : interval;
				return Array(60 / (interval )).fill().map(function(value, index) {
					if( (me.currentSelected.second - index)===0 ){
						return "<li data-role='secend' class='timePicker-selected'>" + ((index*interval) < 10 ? "0" + (index*interval) : (index*interval)) + "</li>";
					}
					return "<li data-role='secend'>" + ((index*interval) < 10 ? "0" + (index*interval) : (index*interval)) + "</li>";
				}).join("");
			};
			var DOM = `<div class="timePicker-container-panel">
							

							<div class="timePicker-content-box">
								<div>
									<ul>
										${_createHoursList(interval)}
									</ul>
								</div>
					
								<div>
									<ul>
										${_createMinutesList(interval)}
									</ul>
								</div>
									
								<div>
									<ul>
										${_createSecondsList(interval)}
									</ul>
								</div>
							</div>
						</div>`;
			// $(me.config.renderTo).append(DOM);
			this.popupContainer.addContent(DOM);
			this.popupContainer.element.find(".timePicker-selected").each(function(index, el) {
				$(el).parent().parent().get(0).scrollTop = $(el).index()*$(el).height();
			});
			var value = me.currentSelected.hour + ":" + me.currentSelected.minute + ":" + me.currentSelected.second;
			$(this.config.renderTo).prop("readonly", !me.config.editable).val(value);
		},
		/**
		 * 初始化事件
		 */
		_initListClick:function(){
			var me = this;
			this.popupContainer.element.on("click","li",function(event){
				event.stopPropagation();
				var $this = $(this);
				$this.addClass("timePicker-selected").siblings().removeClass("timePicker-selected");
				var value = $this.text();
				var role = $this.attr("data-role");
				var index = $this.index();

				// $(this).parent().parent().get(0).scrollTo(0,index*$this.height());
				$(this).parent().parent().get(0).scrollTop = index*$this.height();
				switch(role){
					case "hour":
						me.currentSelected.hour = value;
						break;
					case "minute":
						me.currentSelected.minute = value;
						break;
					case "secend":
						me.currentSelected.second = value;
						break;
					default :
				};
				var time = me.currentSelected.hour + ":" + me.currentSelected.minute + ":" + me.currentSelected.second;
				$(me.config.renderTo).val(time);				
			});
			$(document).on("click",function(event){
				me.hidePanel();
			});
			$(document).on("click",".timePicker-container-panel",function(event){
				event.stopPropagation();
			});
			$(document).on("click",".timePicker-content-box",function(event){
				event.stopPropagation();
			});
			$(me.config.renderTo).on("click",function(e){
				e.stopPropagation();
				me.showPanel();
				var rect = e.target.getBoundingClientRect();
				var top = rect.height + rect.top;
				var left = rect.left;
				me.setPanelPosition(left,top);
			});
			$(document).on("click",".timePicker-value-input>span",function(event){
				me.hidePanel();
			});
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
		setDisabled:function(disabled){
			var me = this;
			if(disabled === true){
				me.hidePanel();
			}
 			$(this.config.renderTo).prop("disabled",disabled);
		},
		showPanel:function(){
			var me = this;
			this.popupContainer.element.find(".timePicker-content-box").show();
		},
		hidePanel:function(){
			var me = this;
			this.popupContainer.element.find(".timePicker-content-box").hide();
		},
		/**
		 * 设置panel的位置
		 * @params {[Number]} left pagex
		 * @params {[Number]} top  pageY
		 **/
		setPanelPosition:function(left,top){
			this.popupContainer.element.find(".timePicker-content-box").css({
				left:left,
				top:top + 5
			});
		},
		/**
		 * 时间向下归整 
		 * @param date 需要归整的时间           type:Date
		 * @param interval 归整粒度(单位-秒)    type:Number
		 * @return  归整后的时间毫秒数          type:Number
		 */
		fixTime: function(date, interval) { //interval间隔秒数
			var minutes = date.format("mm");
			var latelyMin = minutes - (minutes % (interval / 60));
			latelyMin < 10 ? (latelyMin = "0" + latelyMin) : latelyMin;
			var latelyTime = new Date(date).format("YYYY/MM/DD hh:" + latelyMin)
			return new Date(latelyTime).getTime();
		},
		/**
		 * 设置时间粒度(单位：秒钟)
		 */
		setInterval: function(interval) {

		},
		/**
		 * 设置小时值
		 */
		setHours: function() {

		},
		/**
		 * 获取小时值
		 * @return {[type]} [description]
		 */
		getHours: function() {
			var me = this;
			return me.currentSelected.hour;
		},
		/**
		 * 设置分钟值
		 */
		setMinutes: function() {

		},
		/**
		 * 获取分钟值
		 * @return {[type]} [description]
		 */
		getMinutes: function() {
			var me = this;
			return me.currentSelected.minute;
		},
		/**
		 * 设置秒钟值
		 */
		setSeconds: function() {

		},
		/**
		 * 获取秒钟值
		 */
		getSeconds: function() {
			var me = this;
			return me.currentSelected.second;
		},
		/**
		 * 显示小时面板
		 */
		showHoursPanel: function() {

		},
		/**
		 * 隐藏小时面板
		 */
		hideHoursPanel: function() {

		},
		/**
		 * 显示分钟面板
		 */
		showMinutesPanel: function() {

		},
		/**
		 * 隐藏分钟面板
		 */
		hideMinutesPanel: function() {

		},
		/**
		 * 显示秒钟面板
		 */
		showSecondsPanel: function() {

		},
		/**
		 * 隐藏秒钟面板
		 */
		hideSecondsPanel: function() {

		}

	});
	return TimePicker;
});